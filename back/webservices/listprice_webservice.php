<?php

/**
 *
 * @file  : class Listprice_webservice
 *
 * @autor : edwin_eka
 * @email  : edwinandeka@gmail.com
 *
 * version 1.0
 *
 * fecha: 10 mayo de 2020
 *
 */
class Listprice_webservice extends Webservice {

		// public $ws_validate = true;
	
	public function getDiscountList() {

		$today = date("Ymd");
		ws_send('today', $today);

		// 11
		$select = "SELECT a888.*, p.Codigo, p.Nombre, p.Iva FROM aproductos as p RIGHT JOIN ";
		$where = "WHERE DATBI >= '$today' and p.Codigo <> 'NULL' and KSCHL = 'ZTP1' and VKORG = 'V010'";

		$A888MATNR = Query::bySql('a888', "$select a888 ON p.Codigo = MATNR $where and MATNR <> ''");
		$A888KONDM = Query::bySql('a888', "$select a888 ON p.Grupo  = KONDM $where and KONDM <> ''");
		$A888PRODH = Query::bySql('a888', "$select a888 ON p.Unidadesxcaja = PRODH $where and PRODH <> '' ");

		ws_send('A888MATNR', $A888MATNR);
		ws_send('A888KONDM', $A888KONDM);
		ws_send('A888PRODH', $A888PRODH);

		// 10
		$select = "SELECT a972.*, p.Codigo, p.Nombre, p.Iva FROM aproductos as p RIGHT JOIN ";
		$where = "WHERE DATBI >= '$today' and p.Codigo <> 'NULL' and KSCHL = 'ZTP1' and VKORG = 'V010' and VTWEG = 15 ";
 
		$A972MATNR = Query::bySql('a972', "$select a972 ON p.Codigo = MATNR $where and MATNR <> ''");
		$A972KONDM = Query::bySql('a972', "$select a972 ON p.Grupo  = KONDM $where and KONDM <> ''");
		$A972PRODH = Query::bySql('a972', "$select a972 ON p.Unidadesxcaja = PRODH $where and PRODH <> '' ");

		ws_send('A972MATNR', $A972MATNR);
		ws_send('A972KONDM', $A972KONDM);
		ws_send('A972PRODH', $A972PRODH);

		$clientCode = Post::input('clientCode');

		$acliente = Query::bySql('aclientes', "
			SELECT * FROM `aclientes` WHERE Canal = 15 and CodigoAmarre = 'V010' and  `codigo` LIKE '%".trim($clientCode)."%'");
		ws_send('Acliente', $acliente);

		$today = date("Ymd");
		ws_send('today', $today);

		$origin = "WHERE DATBI >= '$today' and p.Codigo <> 'NULL' and KSCHL = 'ZTP1' and VKORG = 'V010'";


		// 09
		$select = "SELECT a987.*, p.Codigo, p.Nombre, p.Iva FROM aproductos as p RIGHT JOIN ";
		$where = "$origin and ZZKATR5 = '". trim( $acliente[0]->marcacliente)."'";
 
		$A987MATNR = Query::bySql('a987', "$select a987 ON p.Codigo 	   = MATNR $where and MATNR <> ''");
		$A987KONDM = Query::bySql('a987', "$select a987 ON p.Grupo  	   = KONDM $where and KONDM <> ''");
		$A987PRODH = Query::bySql('a987', "$select a987 ON p.Unidadesxcaja = PRODH $where and PRODH <> ''");

		ws_send('A987MATNR', $A987MATNR);
		ws_send('A987KONDM', $A987KONDM);
		ws_send('A987PRODH', $A987PRODH);


		// 08
		$select = "SELECT a685.*, p.Codigo, p.Nombre, p.Iva FROM aproductos as p RIGHT JOIN ";
		$where = "$origin and ZZKUKLA = '". trim( $acliente[0]->clasecliente)."'";

		$A685MATNR = Query::bySql('a685', "$select a685 ON p.Codigo = MATNR and p.Grupo = KONDM and p.Unidadesxcaja = PRODH $where and MATNR <> ''" );
		ws_send('A685MATNR', $A987MATNR);


		// 07
		$select = "SELECT a981.*, p.Codigo, p.Nombre, p.Iva FROM aproductos as p RIGHT JOIN ";
		$where = "$origin and KDGRP = '". trim( $acliente[0]->subcanal)."'";
 
		$A981MATNR = Query::bySql('a981', "$select a981 ON p.Codigo 	   = MATNR $where and MATNR <> ''");
		$A981KONDM = Query::bySql('a981', "$select a981 ON p.Grupo  	   = KONDM $where and KONDM <> ''");
		$A981PRODH = Query::bySql('a981', "$select a981 ON p.Unidadesxcaja = PRODH $where and PRODH <> ''");

		ws_send('A981MATNR', $A981MATNR);
		ws_send('A981KONDM', $A981KONDM);
		ws_send('A981PRODH', $A981PRODH);


		// 06
		$select = "SELECT a968.*, p.Codigo, p.Nombre, p.Iva FROM aproductos as p RIGHT JOIN ";
		$where = "$origin and VKBUR = '". trim( $acliente[0]->agencia)."'";
 
		$A968MATNR = Query::bySql('a968', "$select a968 ON p.Codigo        = MATNR $where and MATNR <> ''");
		$A968KONDM = Query::bySql('a968', "$select a968 ON p.Grupo         = KONDM $where and KONDM <> ''");
		$A968PRODH = Query::bySql('a968', "$select a968 ON p.Unidadesxcaja = PRODH $where and PRODH <> ''");

		ws_send('A968MATNR', $A968MATNR);
		ws_send('A968KONDM', $A968KONDM);
		ws_send('A968PRODH', $A968PRODH);


		// 05
		$select = "SELECT a687.*, p.Codigo, p.Nombre, p.Iva FROM aproductos as p RIGHT JOIN ";
		$where = "$origin and VKBUR = '". trim( $acliente[0]->agencia)."' and ZZKUKLA = '". trim( $acliente[0]->clasecliente)."'";
 
		$A687MATNR = Query::bySql('a687', "$select a687 ON p.Codigo 	   = MATNR and p.Grupo = KONDM and p.Unidadesxcaja = PRODH $where and MATNR <> ''");
		$A687KONDM = Query::bySql('a687', "$select a687 ON p.Grupo  	   = KONDM and p.Grupo = KONDM and p.Unidadesxcaja = PRODH $where and KONDM <> ''");
		$A687PRODH = Query::bySql('a687', "$select a687 ON p.Unidadesxcaja = PRODH and p.Grupo = KONDM and p.Unidadesxcaja = PRODH $where and PRODH <> '' ");

		ws_send('A687MATNR', $A687MATNR);
		ws_send('A687KONDM', $A687KONDM);
		ws_send('A687PRODH', $A687PRODH);


		// 04
		$select = "SELECT a967.*, p.Codigo, p.Nombre, p.Iva FROM aproductos as p RIGHT JOIN ";
		$where = "$origin and VKBUR = '". trim( $acliente[0]->agencia)."' and KDGRP = '". trim( $acliente[0]->subcanal)."'";
 
		$A967MATNR = Query::bySql('a967', "$select a967 ON p.Codigo 	   = MATNR $where and MATNR <> ''");
		$A967KONDM = Query::bySql('a967', "$select a967 ON p.Grupo  	   = KONDM $where and KONDM <> ''");
		$A967PRODH = Query::bySql('a967', "$select a967 ON p.Unidadesxcaja = PRODH $where and PRODH <> '' ");

		ws_send('A967MATNR', $A967MATNR);
		ws_send('A967KONDM', $A967KONDM);
		ws_send('A967PRODH', $A967PRODH);


		// 03
		$select = "SELECT a974.*, p.Codigo, p.Nombre, p.Iva FROM aproductos as p RIGHT JOIN ";
		$where = "$origin and BZIRK = '". trim( $acliente[0]->clientezenu)."' ";
 
		$A974MATNR = Query::bySql('a974', "$select a974 ON p.Codigo 	   = MATNR $where and MATNR <> ''");
		$A974KONDM = Query::bySql('a974', "$select a974 ON p.Grupo  	   = KONDM $where and KONDM <> ''");
		$A974PRODH = Query::bySql('a974', "$select a974 ON p.Unidadesxcaja = PRODH $where and PRODH <> '' ");

		ws_send('A974MATNR', $A974MATNR);
		ws_send('A974KONDM', $A974KONDM);
		ws_send('A974PRODH', $A974PRODH);

		// 02
		$select = "SELECT a678.*, p.Codigo, p.Nombre, p.Iva FROM aproductos as p RIGHT JOIN ";
		$where = "$origin and VKGRP = '". trim( $acliente[0]->factor)."' and ZZKATR2 = '". trim( $acliente[0]->ruta_parada)."'";
 
		$A678MATNR = Query::bySql('a678', "$select a678 ON p.Codigo 	   = MATNR $where and MATNR <> ''");
		$A678KONDM = Query::bySql('a678', "$select a678 ON p.Grupo  	   = KONDM $where and KONDM <> ''");
		$A678PRODH = Query::bySql('a678', "$select a678 ON p.Unidadesxcaja = PRODH $where and PRODH <> ''");

		ws_send('A678MATNR', $A678MATNR);
		ws_send('A678KONDM', $A678KONDM);
		ws_send('A678PRODH', $A678PRODH);

		
		// 01
		$select = "SELECT a971.*, p.Codigo, p.Nombre, p.Iva FROM aproductos as p RIGHT JOIN ";
		$where = "$origin and KUNNR = '". trim( $acliente[0]->codigo)."' ";
 		
		$A971MATNR = Query::bySql('a971', "$select a971 ON p.Codigo 	   = MATNR $where and MATNR <> ''");
		$A971KONDM = Query::bySql('a971', "$select a971 ON p.Grupo  	   = KONDM $where and KONDM <> ''");
		$A971PRODH = Query::bySql('a971', "$select a971 ON p.Unidadesxcaja = PRODH $where and PRODH <> ''");

		ws_send('A971MATNR', $A971MATNR);
		ws_send('A971KONDM', $A971KONDM);
		ws_send('A971PRODH', $A971PRODH);

		ws_ok();
	}


	
	public function getProductsList() {

		$today = date("Ymd");
		ws_send('today', $today);

		// 11
		$select = "SELECT a888.*, p.Codigo, p.Nombre, p.Iva FROM aproductos as p RIGHT JOIN ";
		$where = "WHERE DATBI >= '$today' and p.Codigo <> 'NULL' and KSCHL = 'ZTP0' and VKORG = 'V010'";

		$A888MATNR = Query::bySql('a888', "$select a888 ON p.Codigo = MATNR $where and MATNR <> ''");
		$A888KONDM = Query::bySql('a888', "$select a888 ON p.Grupo  = KONDM $where and KONDM <> ''");
		$A888PRODH = Query::bySql('a888', "$select a888 ON p.Unidadesxcaja = PRODH $where and PRODH <> '' ");

		ws_send('A888MATNR', $A888MATNR);
		ws_send('A888KONDM', $A888KONDM);
		ws_send('A888PRODH', $A888PRODH);

		// 10
		$select = "SELECT a972.*, p.Codigo, p.Nombre, p.Iva FROM aproductos as p RIGHT JOIN ";
		$where = "WHERE DATBI >= '$today' and p.Codigo <> 'NULL' and KSCHL = 'ZTP0' and VKORG = 'V010' and VTWEG = 15 ";
 
		$A972MATNR = Query::bySql('a972', "$select a972 ON p.Codigo = MATNR $where and MATNR <> ''");
		$A972KONDM = Query::bySql('a972', "$select a972 ON p.Grupo  = KONDM $where and KONDM <> ''");
		$A972PRODH = Query::bySql('a972', "$select a972 ON p.Unidadesxcaja = PRODH $where and PRODH <> '' ");

		ws_send('A972MATNR', $A972MATNR);
		ws_send('A972KONDM', $A972KONDM);
		ws_send('A972PRODH', $A972PRODH);

		ws_ok();
	}


	public function getListByClient() {

		$clientCode = Post::input('clientCode');

		$acliente = Query::bySql('aclientes', "
			SELECT * FROM `aclientes` WHERE Canal = 15 and CodigoAmarre = 'V010' and  `codigo` LIKE '%".trim($clientCode)."%'");
		ws_send('Acliente', $acliente);

		$today = date("Ymd");
		ws_send('today', $today);

		$origin = "WHERE DATBI >= '$today' and p.Codigo <> 'NULL' and KSCHL = 'ZTP0' and VKORG = 'V010'";


		// 09
		$select = "SELECT a987.*, p.Codigo, p.Nombre, p.Iva FROM aproductos as p RIGHT JOIN ";
		$where = "$origin and ZZKATR5 = '". trim( $acliente[0]->marcacliente)."'";
 
		$A987MATNR = Query::bySql('a987', "$select a987 ON p.Codigo 	   = MATNR $where and MATNR <> ''");
		$A987KONDM = Query::bySql('a987', "$select a987 ON p.Grupo  	   = KONDM $where and KONDM <> ''");
		$A987PRODH = Query::bySql('a987', "$select a987 ON p.Unidadesxcaja = PRODH $where and PRODH <> ''");

		ws_send('A987MATNR', $A987MATNR);
		ws_send('A987KONDM', $A987KONDM);
		ws_send('A987PRODH', $A987PRODH);


		// 08
		$select = "SELECT a685.*, p.Codigo, p.Nombre, p.Iva FROM aproductos as p RIGHT JOIN ";
		$where = "$origin and ZZKUKLA = '". trim( $acliente[0]->clasecliente)."'";

		$A685MATNR = Query::bySql('a685', "$select a685 ON p.Codigo = MATNR and p.Grupo = KONDM and p.Unidadesxcaja = PRODH $where and MATNR <> ''" );
		ws_send('A685MATNR', $A987MATNR);


		// 07
		$select = "SELECT a981.*, p.Codigo, p.Nombre, p.Iva FROM aproductos as p RIGHT JOIN ";
		$where = "$origin and KDGRP = '". trim( $acliente[0]->subcanal)."'";
 
		$A981MATNR = Query::bySql('a981', "$select a981 ON p.Codigo 	   = MATNR $where and MATNR <> ''");
		$A981KONDM = Query::bySql('a981', "$select a981 ON p.Grupo  	   = KONDM $where and KONDM <> ''");
		$A981PRODH = Query::bySql('a981', "$select a981 ON p.Unidadesxcaja = PRODH $where and PRODH <> ''");

		ws_send('A981MATNR', $A981MATNR);
		ws_send('A981KONDM', $A981KONDM);
		ws_send('A981PRODH', $A981PRODH);


		// 06
		$select = "SELECT a968.*, p.Codigo, p.Nombre, p.Iva FROM aproductos as p RIGHT JOIN ";
		$where = "$origin and VKBUR = '". trim( $acliente[0]->agencia)."'";
 
		$A968MATNR = Query::bySql('a968', "$select a968 ON p.Codigo        = MATNR $where and MATNR <> ''");
		$A968KONDM = Query::bySql('a968', "$select a968 ON p.Grupo         = KONDM $where and KONDM <> ''");
		$A968PRODH = Query::bySql('a968', "$select a968 ON p.Unidadesxcaja = PRODH $where and PRODH <> ''");

		ws_send('A968MATNR', $A968MATNR);
		ws_send('A968KONDM', $A968KONDM);
		ws_send('A968PRODH', $A968PRODH);


		// 05
		$select = "SELECT a687.*, p.Codigo, p.Nombre, p.Iva FROM aproductos as p RIGHT JOIN ";
		$where = "$origin and VKBUR = '". trim( $acliente[0]->agencia)."' and ZZKUKLA = '". trim( $acliente[0]->clasecliente)."'";
 
		$A687MATNR = Query::bySql('a687', "$select a687 ON p.Codigo 	   = MATNR and p.Grupo = KONDM and p.Unidadesxcaja = PRODH $where and MATNR <> ''");
		$A687KONDM = Query::bySql('a687', "$select a687 ON p.Grupo  	   = KONDM and p.Grupo = KONDM and p.Unidadesxcaja = PRODH $where and KONDM <> ''");
		$A687PRODH = Query::bySql('a687', "$select a687 ON p.Unidadesxcaja = PRODH and p.Grupo = KONDM and p.Unidadesxcaja = PRODH $where and PRODH <> '' ");

		ws_send('A687MATNR', $A687MATNR);
		ws_send('A687KONDM', $A687KONDM);
		ws_send('A687PRODH', $A687PRODH);


		// 04
		$select = "SELECT a967.*, p.Codigo, p.Nombre, p.Iva FROM aproductos as p RIGHT JOIN ";
		$where = "$origin and VKBUR = '". trim( $acliente[0]->agencia)."' and KDGRP = '". trim( $acliente[0]->subcanal)."'";
 
		$A967MATNR = Query::bySql('a967', "$select a967 ON p.Codigo 	   = MATNR $where and MATNR <> ''");
		$A967KONDM = Query::bySql('a967', "$select a967 ON p.Grupo  	   = KONDM $where and KONDM <> ''");
		$A967PRODH = Query::bySql('a967', "$select a967 ON p.Unidadesxcaja = PRODH $where and PRODH <> '' ");

		ws_send('A967MATNR', $A967MATNR);
		ws_send('A967KONDM', $A967KONDM);
		ws_send('A967PRODH', $A967PRODH);


		// 03
		$select = "SELECT a974.*, p.Codigo, p.Nombre, p.Iva FROM aproductos as p RIGHT JOIN ";
		$where = "$origin and BZIRK = '". trim( $acliente[0]->clientezenu)."' ";
 
		$A974MATNR = Query::bySql('a974', "$select a974 ON p.Codigo 	   = MATNR $where and MATNR <> ''");
		$A974KONDM = Query::bySql('a974', "$select a974 ON p.Grupo  	   = KONDM $where and KONDM <> ''");
		$A974PRODH = Query::bySql('a974', "$select a974 ON p.Unidadesxcaja = PRODH $where and PRODH <> '' ");

		ws_send('A974MATNR', $A974MATNR);
		ws_send('A974KONDM', $A974KONDM);
		ws_send('A974PRODH', $A974PRODH);

		// 02
		$select = "SELECT a678.*, p.Codigo, p.Nombre, p.Iva FROM aproductos as p RIGHT JOIN ";
		$where = "$origin and VKGRP = '". trim( $acliente[0]->factor)."' and ZZKATR2 = '". trim( $acliente[0]->ruta_parada)."'";
 
		$A678MATNR = Query::bySql('a678', "$select a678 ON p.Codigo 	   = MATNR $where and MATNR <> ''");
		$A678KONDM = Query::bySql('a678', "$select a678 ON p.Grupo  	   = KONDM $where and KONDM <> ''");
		$A678PRODH = Query::bySql('a678', "$select a678 ON p.Unidadesxcaja = PRODH $where and PRODH <> ''");

		ws_send('A678MATNR', $A678MATNR);
		ws_send('A678KONDM', $A678KONDM);
		ws_send('A678PRODH', $A678PRODH);

		
		// 01
		$select = "SELECT a971.*, p.Codigo, p.Nombre, p.Iva FROM aproductos as p RIGHT JOIN ";
		$where = "$origin and KUNNR = '". trim( $acliente[0]->codigo)."' ";
 		
		$A971MATNR = Query::bySql('a971', "$select a971 ON p.Codigo 	   = MATNR $where and MATNR <> ''");
		$A971KONDM = Query::bySql('a971', "$select a971 ON p.Grupo  	   = KONDM $where and KONDM <> ''");
		$A971PRODH = Query::bySql('a971', "$select a971 ON p.Unidadesxcaja = PRODH $where and PRODH <> ''");

		ws_send('A971MATNR', $A971MATNR);
		ws_send('A971KONDM', $A971KONDM);
		ws_send('A971PRODH', $A971PRODH);


		ws_ok();
	}
	
	
	


	
}