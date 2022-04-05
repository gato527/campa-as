<?php

function loadCore($class) {
	$file = CORE_PATH . ucfirst(strtolower($class)) . ".php";
	if (file_exists($file)) {
		include_once $file;
	}
}

function loadModels($class) {
	$file = MODELS_PATH . strtolower($class) . ".php";
	if (file_exists($file)) {
		include_once $file;
	}
}

function loadObjects($class) {
	$file = OBJECTS_PATH . strtolower($class) . ".php";
	if (file_exists($file)) {
		include_once $file;
	}
}

function loadLibs($class) {
	$file = LIBS_PATH . strtolower($class) . ".php";
	//echo $file;
	if (file_exists($file)) {
		include_once $file;
	}
}


spl_autoload_register('loadCore');
spl_autoload_register('loadModels');
spl_autoload_register('loadLibs');
spl_autoload_register('loadObjects');


$i18n = array();

function utf8ize($d) {
    if (is_array($d)) {
        foreach ($d as $k => $v) {
            $d[$k] = utf8ize($v);
        }
    } else if (is_string ($d)) {
        return utf8_encode($d);
    }
    return $d;
}


/**
 * para la respuesta de los servicios
 */

$GLOBALS['ws_response'] = array();

function ws_send($key, $value) {
	$GLOBALS['ws_response'][$key] = $value;	
}

function ws_ok() {
	$GLOBALS['ws_response']["StatusResult"] = "OK";	
	send($GLOBALS['ws_response']);
}

function ws_fail() {
	$GLOBALS['ws_response']["StatusResult"] = "FAIL";
	send($GLOBALS['ws_response']);
}



function Response($message)
{
	echo json_encode(utf8ize($message));
}

function send($message)
{
	// echo json_encode(utf8ize($message));
	echo json_encode($message);
}




function print_var($var)
{
		ob_start();
		var_dump($var);
		return ob_get_clean();
}

function str_lreplace($search, $replace, $subject)
{
    $pos = strrpos($subject, $search);

    if($pos !== false)
    {
        $subject = substr_replace($subject, $replace, $pos, strlen($search));
    }

    return $subject;
}

function getI18n($table) {

	$table  = strtolower($table);
	
	$fileName = 'lang' . DS . 'es-' . $table . '.php';

	$model = ucfirst(strtolower($table));

	if (file_exists ( $fileName )) {
		include $fileName;

		$vars_clase = get_class_vars($model);
		$respose_struct_table = array ();

		foreach ( $vars_clase as $key => $value ) {
			if (isset ( $i18n [$table] [$key] )) {
				
				$respose_struct_table["$key"] = $i18n [$table] [$key];
			} else {
				$respose_struct_table["$key"] = $key;
			};
		}

		return $respose_struct_table;
	} else {
		return new $model;
	}

}

set_error_handler(function($errno, $errstr, $errfile, $errline, array $errcontext) {
    // error was suppressed with the @-operator
    if (0 === error_reporting()) {
        return false;
    }

    throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
});

function warning_handler($errno, $errstr) { 
// do something
}
  function clearModel($model) {
        $vars_clase = get_class_vars(get_class($model));

        foreach ($vars_clase as $attr => $value) {
            $model->$attr = null;
        }

        return $model;
    }
?>