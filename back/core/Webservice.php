<?php
/*
 * @file  : class Webservice
 *
 * @autor : edwin_eka
 * @email  : edwinandeka@gmail.com
 *
 * version 1.0
 *
 * fecha: 08 de febrero de 2015
 */

class Webservice {

	public $response = array();

	function validate() {
		if (isset($_SERVER['HTTP_TOKEN'])) {
			$token = $_SERVER['HTTP_TOKEN'];
			$payload = Session::get(base64_encode($token));
			if ($payload == null) {
				ws_send("CODE_ERROR", 1001);
				ws_fail();
				die();
			}
			
			$payload = json_decode($payload);
			// print_r($payload);

		} else {
			ws_send("CODE_ERROR", 1001);
			ws_fail();
			die();
		}	
		
	}

	function getSetting($key) {
		return Query::byColumn('settings', 'keydata', $key)->value;
		
	}
	
	


	
}