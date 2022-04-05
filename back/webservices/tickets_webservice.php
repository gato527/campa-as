<?php

/**
 *
 * @file  : class Categoria_webservice
 *
 * @autor : edwin_eka
 * @email  : edwinandeka@gmail.com
 *
 * version 1.0
 *
 * fecha: 28 nov de 2014
 *
 */
class Tickets_webservice extends Webservice {

	// public $ws_validate = true;
	
	
	public function save() {

		$ticket = Model::create("ticket");
		$ticket->state = true;
		$ticket->date_report = date('Y-m-d');

		ws_send("email", Send_email::send("Nuevo Ticket", $ticket->description, ["edwinandeka@gmail.com"]));


		ws_send('ticket', Model::save($ticket));
		ws_ok();
	}


	public function getAll() {

		ws_send('tickets', Query::byColumnAll('ticket', 'state', true,  '',true ));
		ws_ok();
	}

	
}