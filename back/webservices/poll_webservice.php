<?php

/**
 * @file  : class Poll_webservice
 *
 * @autor : edwin_eka
 * @email  : edwinandeka@gmail.com
 *
 * version 1.0
 *
 * fecha: 17 Marzo de 2020
 *
 */
class Poll_webservice {

	function savePoll() {

		$results = true;

		$question = Post::input('question');


		if ($question['mode'] == 'create') {
			

			$poll = new Poll();
			$poll->title = $question['title'];
			Model::save($poll);

			foreach ($question['answers'] as $key => $answer) {
				$poll_option = new Poll_option();
				$poll_option->text = $answer;
				$poll_option->poll = $poll->id;
				Model::save($poll_option);
			}

		}


		
		ws_send('poll', $poll->id );
		ws_ok();
	}


	function allPoll() {

		$poll =  Query::byColumn('settings', 'keydata', 'poll-selected');
		ws_send('selected', $poll != null? $poll->value: 0 );
		ws_send('polls', Query::all('poll', ' order by id asc') );
		ws_ok();
	}



	
	function getSelectedPoll($clientId) {
		
		$poll =  Query::byColumn('settings', 'keydata', 'poll-selected');

		if ($poll != null) {
			 
			ws_send('selected', $poll->value );
			ws_send('poll', Query::byId('poll', $poll->value) );
			ws_send('answers', Query::byColumnAll('poll_option', 'poll',  $poll->value) );
			ws_send('answer_poll', Query::byColumn('poll_answer', 'poll',  $poll->value, ' and client =' .$clientId . ' order by id desc') );
		} else  {
			ws_send('selected',  0 );

		}
		ws_ok();
	}

	function saveAnswer($clientId,  $reportId,  $pollId,  $value) {
		
		$poll = new Poll_answer();
		$poll->poll = $pollId;
		$poll->poll_answer = $value;
		$poll->client = $clientId;
		$poll->call_report = $reportId;
		Model::save($poll);

		ws_ok();
	}


}