<?php

/**
* @class  Query
*
* @author : edwin_eka <edwinandeka@gmail.com>
* @copyright Copyright (c) 2022, EkaSoft 
* @version 1.0
*
* @date: 02 de enero de 2014
*
*/
class Query {
	function __construct() {
	}
	
	/**
	 * hace un llamado ala base de datos retorna todos
	 * las tuplas de la tabla indicada por el modelo
	 * como objetos mas accesibles para el usuario
	 *
	 * @param        	
	 *
	 *
	 *
	 */
	public static function count($model) {
		
		/* * hacemos un llamado a la tabla a la base de datos * la tabla debe tener el mismo nombre que el modelo * */

		
		$_database = Database::getIntance ();
		
		$sql = "select  count(*) as total from $model";
		
		$result = $_database->prepare ( $sql );
		
		$result->execute ();
		
		$number_of_rows = $result->fetchColumn ();
		
		$_database = null;
		
		return $number_of_rows;
	}
	
	/**
	 * hace un llamado ala base de datos retorna todos
	 * las tuplas de la tabla indicada por el modelo
	 * como objetos mas accesibles para el usuario
	 *
	 * @param        	
	 *
	 *
	 *
	 */
	public static function all($model, $sql = "", $foranea = true) {
		
		/* * hacemos un llamado a la tabla a la base de datos * la tabla debe tener el mismo nombre que el modelo * */

		
		$_database = Database::getIntance ();
		$sql = "select * from $model $sql";
		//echo $sql;
		$result = $_database->query ($sql);

		if($result===false)
		{
		   return null;
		    $error = $_database->errorInfo();//  die ("Error: (".$error[0].':'.$error[1].') '.$error[2]);
		}

		/* * verificamos que el usuario haga un llamado correcto del modelo * con la primera letra en mayuscula para el nombre de la clase * no habra distinncion entre mayusculas y minusculas * el framework se encarga de hacer la correccion */

		
		
		$model = ucfirst ( strtolower ( $model ) );
		
		/* * creamos un array de objetos del tipo del modelo solicitado * y lo retornamos al usuario */



		if($result !== false) {
		
			$models = $result->fetchall ( PDO::FETCH_CLASS, $model );
			
			$vars_clase = get_class_vars ( $model );
			if ($foranea) 
				foreach ( $vars_clase as $attr => $value ) {
					
					$class = ucfirst ( strtolower ( $attr ) );
					
					if (class_exists ( $class )) {
						
						foreach ( $models as $mod ) {
							
							$id = $mod->$attr;
							
							$result = $_database->query ( "select * from " . (strtolower ( $class )) . " where id = " . $id );
							
							if ($result != false) {
								
								$r = $result->fetchall ( PDO::FETCH_CLASS, $class );
								
								if (isset ( $r [0] )) {
									
									$mod->$attr = $r [0];
								}
							}
						}
					}
				}
				
				$_database = null;

			} else {
				return null;
			}
			
			return $models;
		}
		
	/**
	 * hace un llamado ala base de datos retorna todos
	 * la informacion de las columnas de la tabla indicada por el modelo
	 * como objetos mas accesibles para el usuario
	 *
	 * @param        	
	 *
	 *
	 *
	 */
	public static function struct($model, $table) {
		
		/* * hacemos un llamado a la tabla a la base de datos * la tabla debe tener el mismo nombre que el modelo * */

		
		$_database = Database::getIntance ();
		
		$sql = "select COLUMN_NAME, IS_NULLABLE, DATA_TYPE from information_schema.COLUMNS where TABLE_NAME = '$table' AND TABLE_SCHEMA='" . DB_NAME . "'";
		
		 // print_r($sql);
		
		$result = $_database->query ( $sql ) or die ( print_r ( $_database->errorInfo (), true ) );
		
		/* * verificamos que el usuario haga un llamado correcto del modelo * con la primera letra en mayuscula para el nombre de la clase * no habra distinncion entre mayusculas y minusculas * el framework se encarga de hacer la correccion */

		
		
		$model = ucfirst ( strtolower ( $model ) );
		
		/* * creamos un array de objetos del tipo del modelo solicitado * y lo retornamos al usuario */

		
		
		$models = $result->fetchall ( PDO::FETCH_CLASS, $model );
		
		$_database = null;
		
		return $models;
	}
	
	/**
	 * hace un llamado ala base de datos retorna una
	 * las tuplas de la tabla indicada por el modelo y el id
	 * como objetos mas accesibles para el usuario
	 */
	public static function byId($model, $id, $sql = "", $foranea = false) {
		
		/* * hacemos un llamado a la tabla a la base de datos * la tabla debe tener el mismo nombre que el modelo * */
		
		$_database = Database::getIntance ();
		
		$sql = "select * from $model where id = $id $sql";
		
		// echo $sql;
		
		$result = $_database->query ( $sql );
		
		// echo print_r($result);
		
		/* * verificamos que el usuario haga un llamado correcto del modelo * con la primera letra en mayuscula para el nombre de la clase * no habra distinncion entre mayusculas y minusculas * el framework se encarga de hacer la correccion */

		
		
		$model = ucfirst ( strtolower ( $model ) );
		$modelName = $model;
		
		$vars_clase = get_class_vars ( $model );
		
		/* * creamos un array de objetos del tipo del modelo solicitado * y lo retornamos al usuario */

		
		if ($result == null) {
			
			return null;
		} else {
			
			$model = $result->fetchall ( PDO::FETCH_CLASS, $model );
			
			
			// creamos un nuevo objeto del modelo para retornarlo
			// 
			if (count($model)>0) {
				$obj =  $model [0];

				if ($foranea) {
					$obj = Query::getForanea($modelName, $obj, $_database );

				}
				$_database = null;

				return $obj;

				# code...
			} else {
				return null;

			}
			
		}
	}
	
	/**
	 * recibe un objeto de modelo y lo busca en la base de datos
	 */
	public static function search($model) {
		$vars_clase = get_class_vars ( get_class ( $model ) );
		
		$table = get_class ( $model );
		
		$table = strtolower ( $table );
		
		// SELECT * FROM `persona` WHERE nombre Like '%c%'
		
		$sql = "SELECT * FROM $table WHERE ";
		
		$aux = count ( $vars_clase );

		//print_r($model );
		
		$i = 1;
		
		foreach ( $vars_clase as $attr => $value ) {
			
			$dataAtrr = $model->$attr;
			
			if ($dataAtrr != "" && !(strpos($dataAtrr, '::') !== false)) {
				
				$sql .= "`$attr` Like '%" . $dataAtrr . "%' ";
				
				if ($i < $aux)
					
					$sql .= " AND ";
			}
			
			$i ++;
		}
		
		$sql = str_lreplace ( "AND", "", $sql );
		
		// echo($sql);
		
		$_database = Database::getIntance ();
		
		$result = $_database->query ( $sql ) or die ( print_r ( $_database->errorInfo (), true ) );
		
		/* * verificamos que el usuario haga un llamado correcto del modelo * con la primera letra en mayuscula para el nombre de la clase * no habra distinncion entre mayusculas y minusculas * el framework se encarga de hacer la correccion */

		
		
		$model = ucfirst ( strtolower ( $table ) );
		
		/* * creamos un array de objetos del tipo del modelo solicitado * y lo retornamos al usuario */

		
		
		$models = $result->fetchall ( PDO::FETCH_CLASS, $model );
		
		$vars_clase = get_class_vars ( $model );
		
		foreach ( $vars_clase as $attr => $value ) {
			
			$class = ucfirst ( strtolower ( $attr ) );
			
			if (class_exists ( $class )) {
				
				foreach ( $models as $mod ) {
					
					$id = $mod->$attr;
					
					$sql = "select * from " . (strtolower ( $class )) . " where id = " . $id;
					
					$result = $_database->query ( $sql );
					
					$r = $result->fetchall ( PDO::FETCH_CLASS, $class );
					if (isset($r[0])) {
						$mod->$attr = $r [0];
					}
					
				}
			}
		}
		
		$_database = null;
		
		return $models;
	}
	
	/**
	 * hace un llamado ala base de datos retorna una
	 * las tuplas de la tabla indicada por el modelo y el id
	 * como objetos mas accesibles para el usuario
	 */
	public static function byColumn($model, $column, $value, $sql = "") {
		
		/* * hacemos un llamado a la tabla a la base de datos * la tabla debe tener el mismo nombre que el modelo * */

		
		$_database = Database::getIntance ();
		
		$sql = "select * from $model where $column = '$value' $sql";
		
		// echo $sql;
		
		$result = $_database->query ( $sql );
		
		/* * verificamos que el usuario haga un llamado correcto del modelo * con la primera letra en mayuscula para el nombre de la clase * no habra distinncion entre mayusculas y minusculas * el framework se encarga de hacer la correccion */

		
		
		$model = ucfirst ( strtolower ( $model ) );
		
		$vars_clase = get_class_vars ( $model );
		
		$_database = null;
		
		/* * creamos un array de objetos del tipo del modelo solicitado * y lo retornamos al usuario * * */

		
		
		if ($result == null) {
			
			return false;
		} else {
			
			$model = $result->fetchall ( PDO::FETCH_CLASS, $model );
			
			if ($model != array ()) {
				
				return $model [0];
			}
		}
	}
	
	/**
	 * hace un llamado ala base de datos retorna una
	 * las tuplas de la tabla indicada por el modelo y el id
	 * como objetos mas accesibles para el usuario
	 */
	public static function byColumnLike($model, $column, $value, $sql = "") {
		
		/* * hacemos un llamado a la tabla a la base de datos * la tabla debe tener el mismo nombre que el modelo * */

		
		$_database = Database::getIntance ();
		
		$sql = "select * from $model where $column like '$value' $sql";
		
		// echo $sql;
		
		$result = $_database->query ( $sql );
		
		/* * verificamos que el usuario haga un llamado correcto del modelo * con la primera letra en mayuscula para el nombre de la clase * no habra distinncion entre mayusculas y minusculas * el framework se encarga de hacer la correccion */

		
		
		$model = ucfirst ( strtolower ( $model ) );
		
		$vars_clase = get_class_vars ( $model );
		
		$_database = null;
		
		/* * creamos un array de objetos del tipo del modelo solicitado * y lo retornamos al usuario * * */

		
		
		if ($result == null) {
			
			return false;
		} else {
			
			$model = $result->fetchall ( PDO::FETCH_CLASS, $model );
			
			if ($model != array ()) {
				
				return $model [0];
			}
		}
	}
	
	/**
	 * hace un llamado ala base de datos retorna una
	 * las tuplas de la tabla indicada por el modelo y el id
	 * como objetos mas accesibles para el usuario
	 */
	public static function byColumnAll($model, $column, $value, $sql = "", $foranea = false, $debug=false) {
		
		/* * hacemos un llamado a la tabla a la base de datos * la tabla debe tener el mismo nombre que el modelo * */

		
		$_database = Database::getIntance ();
		
		$sql = is_int($value)? "select * from $model where $column = $value $sql":"select * from $model where $column = '$value' $sql";
		if ($debug)
			echo $sql;
		
		$result = $_database->query ( $sql );
		
		/* * verificamos que el usuario haga un llamado correcto del modelo * con la primera letra en mayuscula para el nombre de la clase * no habra distinncion entre mayusculas y minusculas * el framework se encarga de hacer la correccion */

		
		
		$clase = ucfirst ( strtolower ( $model ) );
		
		$vars_clase = get_class_vars ( $clase );
		
		/* * creamos un array de objetos del tipo del modelo solicitado * y lo retornamos al usuario * * */

		
		
		if ($result == null) {
			
			return false;
		} else {
			
			$objetos = $result->fetchall ( PDO::FETCH_CLASS, $model );
			
			if ($objetos != array ()) {
				if ($foranea)
					
					$objetos = Query::foraneaAll ( $model, $objetos, $_database );
				
				$_database = null;
				
				return $objetos;
			}
		}
	}
	public static function foraneaAll($model, $objetos, $_database) {
		$vars_clase = get_class_vars ( $model );
		
		foreach ( $vars_clase as $attr => $value ) {
			
			// formato de clases
			
			$class = ucfirst ( strtolower ( $attr ) );
			
			// existe el modelo
			
			if (class_exists ( $class )) {


				foreach ( $objetos as $obj ) {
					
					$id = $obj->$attr;
					
					$result = $_database->query ( "select * from " . (strtolower ( $class )) . " where id = " . $id );
					
					
					if ($result != false) {
						
						$r = $result->fetchall ( PDO::FETCH_CLASS, $class );
						
						if (isset ( $r [0] )) {
							
							$obj->$attr = $r [0];
						}
					}
				}
			}
		}
		
		return $objetos;
	}

	public static function getForanea($model, $obj, $_database) {
		$vars_clase = get_class_vars ( $model );

		
		foreach ( $vars_clase as $attr => $value ) {
			
			// formato de clases
			
			$class = ucfirst ( strtolower ( $attr ) );
			
			// existe el modelo
			
			if (class_exists ( $class )) {
				
					
					$id = $obj->$attr;
					
					$result = $_database->query ( "select * from " . (strtolower ( $class )) . " where id = " . $id );
					
					if ($result != false) {
						
						$r = $result->fetchall ( PDO::FETCH_CLASS, $class );
						
						if (isset ( $r [0] )) {
							
							$obj->$attr = $r [0];
						}
					}
			}
		}
		
		return $obj;
	}
	
	/**
	 * hace un llamado ala base de datos retorna una
	 * las tuplas de la tabla indicada por el modelo y el id
	 * como objetos mas accesibles para el usuario
	 */
	public static function bySql($model, $sql = "", $debug = false) {
		
		/* * hacemos un llamado a la tabla a la base de datos 		* la tabla debe tener el mismo nombre que el modelo 		* */

		
		$_database = Database::getIntance ();
		
		if ($debug) {
		 	echo $sql;
		}
		
		$result = $_database->query ( $sql );
		
		/* * verificamos que el usuario haga un llamado correcto del modelo 		* con la primera letra en mayuscula para el nombre de la clase 		* no habra distinncion entre mayusculas y minusculas 		* el framework se encarga de hacer la correccion */

		
		
		$model = ucfirst ( strtolower ( $model ) );
		
		$vars_clase = get_class_vars ( $model );
		
		$_database = null;
		
		/* * creamos un array de objetos del tipo del modelo solicitado 		* y lo retornamos al usuario 		* 		* */

		
		
		if ($result == null) {
			
			return false;
		} else {
			
			$model = $result->fetchall ( PDO::FETCH_CLASS, $model );
			
			if ($model != array ()) {
				
				return $model;
			}
		}
	}
}

?>