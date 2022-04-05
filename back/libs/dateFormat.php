<?php 
/*
 * @file  : class Dateformat
 *
 * @autor : edwin_eka
 * @email  : edwinandeka@gmail.com
 *
 * version 1.0
 *
 * fecha: 26 de nov de 2014
 *
 */

class Dateformat {

	  	
	public static $arrayMeses = array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');
	public static $arrayDias = array( 'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado');
	public static $arrayDiasLetras = array('','un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 
			'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte',
			'veinti uno', 'veinti dos',	'veinti tres', 	'veinti cuatro', 'veinti cinco', 'veinti seis', 
			'veinti siete',	'veinti ocho', 'veinti nueve', 'treinta', 'treinta y uno');


	/*
	* Regresa el dia de hoy en letras 
	* 
 	*/
	public static function todayToLetters() {
		date_default_timezone_set("America/Bogota");
	    $fecha = Dateformat::$arrayDias[date('w')]." ".date('d')." de ". Dateformat::$arrayMeses[date('m')-1]." de ".date('Y');
		return  $fecha;
	}

	public static function toLetters($fecha='') {
		date_default_timezone_set("America/Bogota");
		$fecha = strtotime($fecha);
	    $fecha = Dateformat::$arrayDias[date('w', $fecha)]." ".date('d', $fecha)." de ". Dateformat::$arrayMeses[date('m', $fecha)-1]." de ".date('Y', $fecha);
		return  $fecha;
	}


	public static function daysToLetters() {
		return  ''. Dateformat::$arrayDiasLetras[ intval(date('d'))] . ' días';
	}

	public static function dateToLetters($fecha) {
		$tem = explode("-",  $fecha );
		return  $tem[2] . ' ' . Dateformat::$arrayMeses[(int)$tem[1] -1] . ' de '. $tem[0];
	}

	
}
?>




