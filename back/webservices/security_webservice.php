<?php

/**
 * @file  : class Security_webservice
 *
 * @autor : edwin_eka
 * @email  : edwinandeka@gmail.com
 *
 * version 1.0
 *
 * fecha: 31 mayo de 2014
 *
 */

class Security_webservice extends Webservice {

	// public $ws_validate = true;

	function terms() {

		$user = Query::byId("user", Post::input("accept"));

		//almacenar los intentos de inisiar sesión del usuario
		$intents_session = Query::byColumn("intent_session","user", $user->id);

		$fec_ = date_default_timezone_set('America/Bogota');

		if ($intents_session == null) {
			ws_send("count_session", 0);
			$intents_session = new Intent_session();
			$intents_session->user =  $user;
			$intents_session->count_session = 1;
			$intents_session->date_last_login = date("Y-m-d H:i:s");
			Model::save($intents_session);
		}else{
			ws_send("count_session", $intents_session->count_session);
			$count_session = $intents_session->count_session;
			$intents_session->count_session = $count_session + 1;
			$intents_session->date_last_login = date("Y-m-d H:i:s");
			Model::update($intents_session);
		}

	}

	function logout() {
		$userId = Post::input("userId");
		if (isset($_SERVER['HTTP_TOKEN'])) {
			$token = $_SERVER['HTTP_TOKEN'];
			Session::delete(base64_encode($token));
		}
		/*Agregar actividad del usuario*/

		$loginLog = new Login_log();
		$loginLog->user = $userId;
		$loginLog->date = date("Y-m-d");
		$loginLog->hour = date("H:i:s");
		$loginLog->state = 0;
		Model::save($loginLog);
		/*-Agregar actividad del usuario-*/
		ws_ok();
	}

	function login() {


		// $vw_descuentos = Query::bySql("listdescuentos","SELECT * FROM vw_descuentos");
		// ws_send("vw_descuentos", $vw_descuentos);

		$login = Post::input("login");
		$user = Query::byColumn("user","email", $login['user']);

		if ($user == null) {
			ws_send("ErrorMessage", "Nombre de usuario no encontrado");
			ws_fail();
		} else {
			if ( md5($login['pass']) ==  $user->password){
				$intents_session = Query::byColumn("intent_session","user", $user->id);

				//almacenar los intentos de inisiar sesión del usuario
				$intents_session = Query::byColumn("intent_session","user", $user->id);
				$fec_ = date_default_timezone_set('America/Bogota');

				// if ($intents_session == null) {
				// 	ws_send("count_session", 0);
				// }else{
				// 	ws_send("count_session", $intents_session->count_session);
				// 	$count_session = $intents_session->count_session;
				// 	$intents_session->count_session = $count_session + 1;
				// 	$intents_session->date_last_login = date("Y-m-d H:i:s");
				// 	Model::update($intents_session);
				// }
				//
				$intents_session = new Intent_session();
				$intents_session->user =  $user->id;
				$intents_session->count_session = 1;
				$intents_session->date_last_login = date("Y-m-d H:i:s");
				Model::save($intents_session);

				ws_send("__u__", $user->id );
				ws_send("__u_d", $user);

				$rol = Query::byid("rol", $user->rol);
				ws_send("__u__r_o", $rol);


				$permission = Query::byColumnAll("permission","rol", $user->rol);
				ws_send("__u__r", $permission);

				$menu = array();
				//consultamos los menus autorizados para el rol del usuario
				foreach ($permission as $key => $value) {
					$menu[$key] = Query::byId("menu", $value->menu );
				}

				ws_send("__u__r_", $menu);
				ws_send("module", "workspace");
				ws_send("view", "admin");
				ws_send("view", "admin");


				/**
				 * se implementa la Autenticación
				 * JSON Web Tokens (JWT)
				 * https://carlosazaustre.es/blog/que-es-la-autenticacion-con-token/
				 * http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html
				 */
				$secret = 'blackfolder backend';

				$headers = array();
				$headers["typ"] =  "JWT";
				$headers["alg"] =  "HS256";
				$headersJSON = json_encode( $headers );

				$payload = array();
				$payload["sub"] =  $user->id;
				$payload["iat"] =  "HS256";
				$payload["exp"] =  "HS256";
				$payload["role"] =  $user->rol;
				$payloadJSON = json_encode( $payload );


				$signature = base64_encode($headersJSON).'.'.base64_encode( $payloadJSON );

				$headers = hash_hmac('sha256', $headersJSON, $secret);
				$payload = hash_hmac('sha256', $payloadJSON, $secret);
				$signature = hash_hmac('sha256', $signature, $secret);

				$token = $headers.'.'.$payload.'.'.$signature;

				Session::set(base64_encode($token), $payloadJSON);

				Session::delete('arrayClients');
				Session::set("autorization", $user->id);

//				header("signature: $signature");
//				header("token: $token");


				ws_send("token", "$token");


				/*Agregar actividad del usuario*/
				$loginLog = new Login_log();
				$loginLog->user = $user->id;
				$loginLog->date = date("Y-m-d");
				$loginLog->hour = date("H:i:s");
				$loginLog->state = 1;
				Model::save($loginLog);
				/*-Agregar actividad del usuario-*/

				/*consultar tiempo de inactividad*/
				$timmerSession = Query::byColumn('settings', 'keydata', 'timmer_session');
				ws_send("timmer_session", "$timmerSession->value");
				/*-consultar tiempo de inactividad-*/

				ws_ok();



			}else {
				ws_send("ErrorMessage", "Contraseña incorrecta");
				ws_fail();
			}
		}



	}


	function backup()
	{



		$respose = array();
		$dir = 'backup' . DS . DATABASE_NAME . DS;
		$ficheroseliminados = 0;
		$handle = opendir($dir);
		while ($file = readdir($handle)) {
			if (is_file($dir . $file)) {
				if (unlink($dir . $file)) {
					$ficheroseliminados++;
				}
			}
		}

		$respose["StatusResult"] = "OK";
		$_database = Database::getIntance();

		// put table names you want backed up in this array.
		// leave empty to do all

		$tables = array();
		$respose["path_backup"] ='back/'. $this->backup_tables($_database, $tables);
		Response($respose);
	}

	function backup_tables($DBH, $tables)
	{


		$DBH->setAttribute(PDO::ATTR_ORACLE_NULLS, PDO::NULL_NATURAL);
		$fec_ = date_default_timezone_set('America/Bogota');

		// Script Variables

		$BACKUP_PATH = 'backup' . DS . DATABASE_NAME . DS;
		$nowtimename = date("Y-m-d-H-i-s");
		$filename;

		// create/open files

		$filename = $BACKUP_PATH . DATABASE_NAME . '-' . $nowtimename . '.sql';
		$handle = fopen($BACKUP_PATH . DATABASE_NAME . '-' . $nowtimename . '.sql', 'a+');

		// array of all database field types which just take numbers

		$numtypes = array(
			'tinyint',
			'smallint',
			'mediumint',
			'int',
			'bigint',
			'float',
			'double',
			'decimal',
			'real'
		);

		// get all of the tables

		if (empty($tables)) {
			$pstm1 = $DBH->query('SHOW TABLES');
			while ($row = $pstm1->fetch(PDO::FETCH_NUM)) {
				$tables[] = $row[0];
			}
		}
		else {
			$tables = is_array($tables) ? $tables : explode(',', $tables);
		}

		// cycle through the table(s)

		foreach($tables as $table) {
			$result = $DBH->query("SELECT * FROM $table");
			$num_fields = $result->columnCount();
			$num_rows = $result->rowCount();
			$return = "";

			// uncomment below if you want 'DROP TABLE IF EXISTS' displayed

			$return.= 'DROP TABLE IF EXISTS `' . $table . '`;';

			// table structure

			$pstm2 = $DBH->query("SHOW CREATE TABLE $table");
			$row2 = $pstm2->fetch(PDO::FETCH_NUM);
			$ifnotexists = str_replace('CREATE TABLE', 'CREATE TABLE IF NOT EXISTS', $row2[1]);
			$return.= "\n\n" . $ifnotexists . ";\n\n";
			fwrite($handle, $return);

			$return = "";

			// insert values

			if ($num_rows) {
				$headers = 'INSERT INTO `' . "$table" . "` (";
				$pstm3 = $DBH->query("SHOW COLUMNS FROM $table");
				$count = 0;
				$type = array();
				while ($rows = $pstm3->fetch(PDO::FETCH_NUM)) {
					if (stripos($rows[1], '(')) {
						$type[$table][] = stristr($rows[1], '(', true);
					}
					else {
						$type[$table][] = $rows[1];
					}

					$headers.= "`" . $rows[0] . "`";
					$count++;
					if ($count < ($pstm3->rowCount())) {
						$headers.= ", ";
					}
				}

				$headers.= ")" . ' VALUES';
				fwrite($handle, $headers);

				$headers;
			}

			$count = 0;
			$aux = 0;
			while ($row = $result->fetch(PDO::FETCH_NUM)) {
				$return = "\n\t(";
				for ($j = 0; $j < $num_fields; $j++) {

					// $row[$j] = preg_replace("\n","\\n",$row[$j]);

					if (isset($row[$j])) {

						// if number, take away "". else leave as string

						if ((in_array($type[$table][$j], $numtypes)) && (!empty($row[$j]))) $return.= $row[$j];
						else $return.= $DBH->quote($row[$j]);
					}
					else {
						$return.= 'NULL';
					}

					if ($j < ($num_fields - 1)) {
						$return.= ',';
					}
				}

				$count++;
				if ($count < ($result->rowCount())) {
					if ($aux >= 500) {
						$return.= ");\n";
						$return.= $headers;
						$aux = 0;
					}
					else {
						$return.= "),";
					}

					$aux++;
				}
				else {
					$return.= ");";
				}

				fwrite($handle, $return);
				$return = "";
			}

			$return = "\n\n-- ------------------------------------------------ \n\n";
			fwrite($handle, $return);

			$return = "";
		}

		$error1 = $pstm2->errorInfo();
		$error2 = $pstm3->errorInfo();
		$error3 = $result->errorInfo();
		echo $error1[2];
		echo $error2[2];
		echo $error3[2];

		fclose($handle);

		return $filename;
	}


}
?>
