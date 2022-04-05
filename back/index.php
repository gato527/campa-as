<?php
header("access-control-allow-origin: *");
header('Content-type: application/json');

$fec_ = date_default_timezone_set('America/Bogota');


if (isset($_POST["route"])) {
	//proporsionada por el sistema operativo
	define('DS', DIRECTORY_SEPARATOR);
	define('ROOT', realpath(dirname(__FILE__)) . DS);
	define('CORE_PATH', ROOT . 'core' . DS);
	define('CONFIG_PATH', ROOT . 'config' . DS);
	define('LIBS_PATH', ROOT . 'libs' . DS);
	define('MODELS_PATH', ROOT . 'models' . DS);
	define('OBJECTS_PATH', ROOT . 'objects' . DS);
	define('WEB_SERVICE_PATH', ROOT . "webservices" . DS);
	define('UPLOAD_PATH', ROOT .'..'. DS.'img'. DS.'uploads'. DS.'users'. DS.'');
	define('UPLOAD_BOLETINES_PATH', ROOT .'boletines'. DS.'');
	define('CHAT_ATTACH_PATH', ROOT . ".." . DS. "docs". DS);
	

	if (isset($_POST["database_name"])) {
		if ($_POST["database_name"]!="") {
			$DATABASE_NAME =  $_POST["database_name"];
		} else {
			$DATABASE_NAME = 'dowesoft_bluefolderadmin';
		}
	}else{
		$DATABASE_NAME = 'dowesoft_bluefolderadmin';
	}	
	

	require_once CORE_PATH . 'Autoload.php';
	//Session::delete("database_name");
	//$DATABASE_NAME = (Session::valueFor("database_name"))? Session::get("database_name") : 'dowesoft_bluefolderadmin';
	//comente la siguinte linea si sus servicios web no requiere una base de datos
	
	require_once CONFIG_PATH . 'Database.php';
	

	session_start();
	// if (isset($_POST["database_name"])) {
	// 	if ($_POST["database_name"]!="") {
			//   Model::sync();
	// 	}
	// }

	Router::init($_POST["route"]);

} else {
	$respose = array();
	$respose["StatusResult"] =  "FALIURE";
	$respose["error"] =  "data 'route' no found in request";
	echo json_encode($respose);
}

?>