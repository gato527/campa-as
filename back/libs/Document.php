<?php header("Content-Type: text/html; charset=utf-8"); 

/**
 * @file  : class Dateformats
 *
 * @autor : edwin_eka
 * @email  : edwinandeka@gmail.com
 *
 * version 1.0
 *
 * fecha: 26 de nov de 2014
 *
 */

require_once(LIBS_PATH.'PHPWord.php'); 

class Document {

	/*
	* Regresa el dia de hoy en letras 
	* 
 	*/
	public static function generate($filename, $template, $vars ) {
		$PHPWord = new PHPWord();

		$document = $PHPWord->loadTemplate(utf8_decode($template));

		foreach ($vars as $key => $value) {
		//	$value = utf8_decode($value);
			$document->setValue($key, utf8_decode($value));
		}

		$document->save(utf8_decode($filename));
	}
	
}
?>




