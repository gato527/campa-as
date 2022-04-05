<?php

/**
 * @file  : class Superadmin_webservice
 *
 * @autor : edwin_eka
 * @email  : edwinandeka@gmail.com
 *
 * version 1.0
 *
 * fecha: 18 abril de 2014
 *
 */

class Superadmin_webservice extends Webservice {

	function company_query() {
		$fec_ = date_default_timezone_set('America/Bogota');

		$companyName = Post::input("company_name");
		$companyData = Query::byColumn("super_user","company", $companyName);

		if ($companyData==null) {
			ws_send("ErrorMessage", "No found data for company $companyData");
			ws_fail();
			
		} else {

			$fecha_i = new DateTime($companyData->contract_end_date);
			$fecha_hoy = new DateTime(date("Y-m-d"));
			$calculando_dias = $fecha_i -> diff($fecha_hoy);

			$dias = floatval($calculando_dias -> format('%d'));
			$m = floatval($calculando_dias -> format('%m'));
			
			ws_send("database_name", $companyData->database_name );
			ws_send("contract_end_date", $dias);
			ws_send("contractend_date", $companyData->contract_end_date);
			ws_send("m", $m);

			$fecha1 = strtotime($companyData->contract_end_date);
			$fecha2 = strtotime(date("Y-m-d"));
			ws_send("mayor", $fecha1 < $fecha2);
			
			ws_ok();
		}
		
	}
}
?>