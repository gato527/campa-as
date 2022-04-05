<?php

/**
 * @file  : class Login_webservice
 *
 * @autor : edwin_eka
 * @email  : edwinandeka@gmail.com
 *
 * version 1.0
 *
 * fecha: 18 abril de 2014
 *
 */

class Query_webservice extends Webservice {

   public $ws_validate = true;
   
	function sucursales() {
		

		$respose["StatusResult"] =  "OK";
		$respose["sucursales"] =  Query::all("subsidiary", "order by name desc");

		
	}
}