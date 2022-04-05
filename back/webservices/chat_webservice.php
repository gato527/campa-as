<?php

/**
 *
 * @file  : class Chat_webservice
 *
 * @autor : edwin_eka
 * @email  : edwinandeka@gmail.com
 *
 * version 1.0
 *
 * fecha: 21 Marzo de 2020
 *
 */
class Chat_webservice {

	public function getUsers() {
		$users  = Query::all("user", " where status='1' order by name");

		if ($users != null) {
			foreach ($users as $key => $user) {
				$user->chat_user =  Query::byColumn("chat_user", 'user', $user->id);
			}
		}

		ws_send('users', $users);
		ws_ok();
	}

	
	
	public function saveMessage() {

		$dialog = Post::input('dialog');

		$message = new Chat_message();
		$message->dialog = $dialog['id'];
		$message->type = $dialog['type'];
		$message->message = $dialog['message'];

		$message->user_from = $dialog['from'];
		$message->user_to = $dialog['to'];
		$message->status = 'Entregado';
		Model::save($message);
		ws_send('message', $message);

		ws_ok();
	}
	

	public function getMessages() {
		$dialog = Post::input('dialog');
		$user = Post::input('user');

		$messages  = Query::byColumnAll("chat_message", 'dialog', $dialog, "order by id desc limit 50", true);
		if ($messages != null) {
			foreach ($messages as $key => $message) {
				if ($message->user_to == $user) {
					$message->status = 'Leído';
					Model::update($message);
				}
			}
		}
		$messages  = Query::byColumnAll("chat_message", 'dialog', $dialog, "order by id desc limit 50", true);

		ws_send('messages', $messages);
		ws_ok();
	}

	public function getNewMessages() {
		$dialog = Post::input('dialog');
		$lastMessage = Post::input('lastMessage');

		$messages  = Query::byColumnAll("chat_message", 'dialog', $dialog, " and id > $lastMessage order by id desc", true);
		$user = Post::input('user');
		if ($messages != null) {
			foreach ($messages as $key => $message) {
				if ($message->user_to == $user) {
					$message->status = 'Leído';
					Model::update($message);
				}
			}
		}
		$messages  = Query::byColumnAll("chat_message", 'dialog', $dialog, " and id > $lastMessage order by id desc", true);

		ws_send('messages', $messages);
		ws_send('refresh', true);
		ws_ok();
	}

	public function checkByNewMessages() {
		$user = Post::input('user');

		$messages  = Query::bySql("chat_message", "SELECT count(id) as count, user_from FROM `chat_message` WHERE status = 'Entregado' and user_to=$user GROUP BY user_from");


		$chat_user  = Query::byColumn("chat_user", 'user', $user);
		$date = date("Y-m-d H:i:s");

		if ($chat_user == null) {
			$chat_user = new Chat_user();
			$chat_user->user = $user;
			$chat_user->heartbeat = $date;
			Model::save($chat_user);
		} else {
			$chat_user->user =  $user;
			$chat_user->heartbeat = $date;
			Model::update($chat_user);
		}


		$time = strtotime($date);
		$time = $time - (15);
		$date = date("Y-m-d H:i:s", $time);

		$users  = Query::bySql("chat_user",  "select * from chat_user where heartbeat > '$date'");

		ws_send('online', $users);
		ws_send('messages', $messages);
		ws_ok();
	}


	

	public function saveAttach(){
		
		ws_send('messages', $_POST);

		$secretfilename =  uniqid() . uniqid();
			
		$target_dir = "attachments/";
		$target_file = CHAT_ATTACH_PATH . $target_dir . $secretfilename;
		$uploadOk = 1;

		$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
		
		// Check if file already exists
		// if (file_exists($target_file)) {
		// 	ws_send('error', "Sorry, file already exists.");
		//     $uploadOk = 0;
		// }
		// Check file size
		
		if ((($_FILES["attach"]["size"]/1024)/1024) > 5) {
			ws_send('size', $_FILES["attach"]["size"]);
			ws_send('error', "Lo sentimos, el tamaño el archivo debe ser menor a 5mb.");
		    $uploadOk = 0;
		}
		
		// Check if $uploadOk is set to 0 by an error
		if ($uploadOk == 0) {
			ws_fail();

		} else {
			// if everything is ok, try to upload file
		    if (move_uploaded_file($_FILES["attach"]["tmp_name"], $target_file)) {
		        //echo "The file ". basename( $_FILES["attach"]["name"]). " has been uploaded.";
		        $dialog = (array) json_decode(Post::input('dialog'));

				$message = new Chat_message();
				$message->dialog = $dialog['id'];
				$message->type = $dialog['type'];
				$message->message = $dialog['message'];
				$message->status = 'Entregado';

				$message->user_from = $dialog['from'];
				$message->user_to = $dialog['to'];
				Model::save($message);
				ws_send('message', $message);

				ws_send('dialog', $dialog);

				$attach = new Chat_attach();
				$attach->name = $dialog['message'];
				$attach->ext = $imageFileType;
				$attach->size = $_FILES["attach"]["size"];
				$attach->path = $secretfilename;
				Model::save($attach);

				$message->chat_attach = $attach->id;
				Model::update($message);

				ws_send('message', $message);


				ws_ok();

		    } else {
				ws_fail();
		    }
		}


		
		

	}


}