<?php

/*
 * @file  : class Controller
 *
 * @autor : edwin_eka
 * @emal  : edwinandeka@gmail.com
 *
 * version 1.0
 *
 * fecha: 02 de enero de 2014
 *
 */

abstract  class Controller {

	/**
	 * se usa para pasar atributos a las vistas
	 */
	protected $_view;

	function __construct() {
		$this -> _view = new View(new Request);
	}

	/**
	 * metodo obligatorio en todos los controladores
	 * se usa para no permitir la creacion de un controlador vacio
	 */
	abstract public function index();

	/**
	 *
	 */
	public static function link($url, $name = null, $icon = "") {

		if ($name == null) {
			$name = $url;
		}

		echo "<a  href='" . HOST_PATH . $url . "' >";
		Bootstrap::icon($icon);
		echo $name . "</a>";

	}

	public function view($vista, $value = "") {

		if ($value != "") {
			$this -> _view -> $vista = $value;
		} else {
			$this -> _view -> load($vista);
		}
	}

	public function subir() {

		include_once "ImageWorkshop.php";

		//tomo el valor de un elemento de tipo texto del formulario
		$file = $_FILES['file']['name'];

		//datos del arhivo
		$nombre_archivo = $_FILES['file']['name'];
		$tipo = $_FILES['file']['type'];
		//compruebo si las características del archivo son las que deseo
		
		if (move_uploaded_file($_FILES['file']['tmp_name'], PUBLIC_PATH . "img" . DS . "upload" . DS . $file)) {
			$link = HOST_PATH . "public" . DS . "img" . DS . "upload" . DS . $file;

			return $file;
		} else {
			echo "Ocurrió algún error al subir el fichero. No pudo guardarse.";
		}
		

	}
	
	
	

	public function validar() {
		if (!Session::valueFor("email")) {
			Router::location("registro/create");
		}else{
			return true;
		}
	}

}
?>