<?php
/**
 *
 */

class Post {

	function __construct() {
	}

	public static function input($key) {
		return isset($_POST[$key])? $_POST[$key] : null;
	}

	public static function isKey($key) {
		return isset($_POST[$key]);
	}

	public static function delete() {
		$_POST = array();
	}
}

?>