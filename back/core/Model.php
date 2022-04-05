<?php

/*
 * @file  : class Model
 *
 * @autor : edwin_eka
 * @emal  : edwinandeka@gmail.com
 *
 * version 1.0
 *
 * fecha: 02 de enero de 2014
 *
 */

class Model {

	//primary key autoincrementada
	public $id;
	public $created_at;
	public $updated_at;


	public function __construct() {

		$vars_clase = get_class_vars(get_class($this));

		foreach ($vars_clase as $attr => $value) {

			//var_dump($this -> $attr);
			//$this -> $attr = NULL;
		}

	}

	public static function clear($model) {
		$vars_clase = get_class_vars(get_class($this));

		foreach ($vars_clase as $attr => $value) {
			unset($this -> $attr);
		}
	}



	public static function create($model, $id = "") {

		$post = Post::input($model);

		//print_r($post);

		$model = ucfirst(strtolower($model));
		$vars_clase = get_class_vars($model);

		$model = new $model;
		$model = clearModel($model);

		$i = 0;

		foreach ($vars_clase as $attr => $value) {
			if ($i > 0) 
				if (isset($post[$attr])) {
					$model -> $attr = $post[$attr];
				} else {
					$model -> $attr = null;
				}
			$i++;
		}

		if ($id != "") 
			$model -> id = $id;
		

		return $model;
	}

	/**
	 * recibe un objeto de modelo y lo guarda en la base de datos
	 */
	public static function save($model) {

		$vars_clase = get_class_vars(get_class($model));

		$table = get_class($model);
		$table = strtolower($table);
		$sql = "INSERT INTO $table (";

		$i = 0;
		foreach ($vars_clase as $attr => $value) {
			if ( $attr != 'created_at' && $attr != 'updated_at' && $attr != 'id' ) {
				$sql .= "`$attr`";

				if ($i < count($vars_clase) - 3) 
					$sql .= ", ";
			}
			$i++;
		}

		$sql .= ") VALUES  (";

		$i = 0;
		foreach ($vars_clase as $attr => $value) {
			if ( $attr != 'created_at' && $attr != 'updated_at' && $attr != 'id' ) {
				if ($i == 0) 
					$sql .= "NULL,";

				if ($i > 0) {
					if (is_int($value)) 
						$sql .= $model -> $attr;
					else if(gettype($model -> $attr)=="object")
						$sql .= $model -> $attr -> id ;
					else if(strpos($model -> $attr, '::') !== false)
						$sql .= " NULL";
					else
						$sql .= "'" . str_replace("'","", $model -> $attr) . "'";
					
					if ($i < count($vars_clase) - 3) 
						$sql .= ", ";
				}
			}
			$i++;

		}

		$sql .= ")";
		
		//echo $sql;

		 $_database = Database::getIntance();

		if ($_database -> exec($sql) or die(print_r($_database->errorInfo(), true)) !== false) {
			$model -> id = $_database -> lastInsertId();
			return true;
		} else {
			return false;
		}

	}

	/**
	 * recibe un objeto de modelo y lo edita en la base de datos
	 */
	public static function update($model) {

		$vars_clase = get_class_vars(get_class($model));

		$table = get_class($model);
		$table = strtolower($table);
		$sql = "update $table set ";

		$i = 0;
		foreach ($vars_clase as $attr => $value) {
			try{
				if ($i > 0) {
					if ( $attr != 'created_at' && $attr != 'updated_at' && $attr != 'id' ) {

						if (is_object($model -> $attr)) {
							$model -> $attr = $model -> $attr->id;
						}

						if (is_numeric($value)) {
							$sql .= " $attr = $model -> $attr";

						} else if(strpos($model -> $attr, '::') !== false){
							$sql .= " $attr = NULL";
						}  else {
							$sql .= " $attr ='" . str_replace("'","", $model -> $attr) . "'";
						}
	
						if ($i < count($vars_clase) - 3) {
							$sql .= ", ";
						}
					}
				}
				$i++;
			}
			catch(Exception $e){
				print_r($model);
				print_r($value);
			}

		}


		//$sql .= ", updated_at =" . (new DateTime())->getTimestamp();

		$sql .= " where id= " . $model -> id;

		//echo $sql;

		$_database = Database::getIntance();

		if ($_database -> exec($sql) /* or die (print_r($_database->errorInfo(), true)) */!= false) {
			return true;
		} else {
			return false;
		}

	}

	/**
	 * recibe un objeto de modelo y lo borra en la base de datos
	 */
	public static function delete($model) {

		$vars_clase = get_class_vars(get_class($model));

		$table = get_class($model);
		$table = strtolower($table);

		$sql = "delete FROM  $table  where id= " . $model -> id;

		$_database = Database::getIntance();

		if ($_database -> exec($sql) !== false) {
			return true;
		} else {
			return false;
		}

	}



	/**
	 * sincronizacion de tablas
	 */
	
	/**
	 * crea una tabla en la base de datos segun el modelo descrito
	 * @return[type][description]
	 */
	public static 	function sync() {

		if ($handle = opendir('.'.DS.'models')) {

		    while (false !== ($model = readdir($handle))) {

		        if ($model != "." && $model != "..") {

		        	 // echo "$model<br>";

		        	$model = str_replace('.php', '', $model);
		        	if ($model != 'super_user' && $model != 'index' && $model != 'struct_table') {
		        		Model::createTable($model);
		        	}

		        }
		    }

		    closedir($handle);
		}

	}




	/**
	 * crea una tabla en la base de datos segun el modelo descrito
	 * @return[type][description]
	 */
	public static 	function createTable($model) {

		/* tipos de dato con tamaño*/
		$dataTypesN = array('character',
			'varchar',
			'character varying',
			'binary',
			'varbinary',
			'binary varying');

		/* tipos de dato con precicion */

		$dataTypesP = array('integer',
			'decimal',
			'int', 
			'numeric');
		




		$class = ucfirst ( strtolower (  $model ) );

		$struct = get_class_vars ( $class );

			// echo "*** $model";
			// print_r($struct);
			// echo "***************************<br/>";
		

		try {

			/* validamos si hay cambios en el modelo */
			$struct_table = Query::struct ( "struct_table", $model );

			
			if (!isset($struct_table[0])) {
				$respose_structTemp = array ();

				$sql =  "CREATE TABLE IF NOT EXISTS $model (";
				$sql .= "id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY, ";
				$sql .= "
					created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
					updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  
				";

				$i = 0;

				$process = false;
				foreach ( $struct as $attr => $value ) {

					if (isset ( $struct[$attr] ) && $attr != 'created_at' && $attr != 'updated_at' && $attr != 'id' ) {

						$value = explode("::", $value);
						$value = array_filter($value);

						$type = array_shift($value);
						$size = array_shift($value);

						//$sql = "";
						if (in_array($type, $dataTypesN) || in_array($type, $dataTypesP)) {
							$sql .= $attr." ".$type."(".$size.") ";
						} else {
							$sql .= $attr." ".$type;
						}

						if ($i < count($struct) - 3) {
							$sql .= ", ";
						}
						
						$process = true;

					}

					$i++;

				}

				$sql .= ")";
				// echo "$sql<br>";

				if ($process) {
					# code...
				

					$_database = Database::getIntance();

					if ($_database -> exec($sql) /* or die(print_r($_database->errorInfo()[0]. '  ' . $sql, true)) */!== false) {
						return true;
					} else {
						return false;
					}

				} 
			}


			/* varificamos si hay colunas */
			$structArr = array();

			foreach ( $struct_table as $key => $value ) {

				
				$structArr[$value->COLUMN_NAME] = null;
			}

			$columnsChange = array_diff_key ( $struct, $structArr );

			foreach ( $columnsChange as $key => $value ) {
				if ( array_key_exists($key, $struct ) ) {
					/*hay que agregar la columna a la tabla */
					Model::addColumn($model, $key, $struct[$key]);
				} else {
					/*eliminar columna de la tabla si se elimino del model */
					Model::deleteColumn($model, $key);
				}
			}


			$columnsChange = array_diff_key ($structArr,  $struct );

			foreach ( $columnsChange as $key => $value ) {
				if ( array_key_exists($key, $struct ) ) {
					/*hay que agregar la columna a la tabla */
					Model::addColumn($model, $key, $struct[$key]);
				} else {
					/*eliminar columna de la tabla si se elimino del model */
					Model::deleteColumn($model, $key);
				}
			}


		} catch(Exception $e ) {
			print_r($e);
			print_r($class);
			print_r($struct);
		}


	}

	/* agrega una columna a una tabla */
	public static 	function addColumn( $model, $key, $value ) {

		/* tipos de dato con tamaño*/
		$dataTypesN = array('character',
			'varchar',
			'character varying',
			'binary',
			'varbinary',
			'binary varying');

		/* tipos de dato con precicion */

		$dataTypesP = array('integer',
			'decimal',
			'int', 
			'numeric');



		$value = explode("::", $value);
		$value = array_filter($value);

		$type = array_shift($value);
		$size = array_shift($value);

		$sql = "";
		if (in_array($type, $dataTypesN) || in_array($type, $dataTypesP)) {
			$sql = "ALTER TABLE $model ADD $key ".$type."(".$size.")";
		} else {
			$sql = "ALTER TABLE $model ADD $key ".$type;
		}

		$_database = Database::getIntance();

		if ($_database -> exec($sql) !== false) {
			return true;
		} else {
			return false;
		}
		
	}

	/* elimina una columna a una tabla */
	public static 	function deleteColumn( $model, $key ) {

				
		$sql = "ALTER TABLE $model DROP COLUMN $key";

		$_database = Database::getIntance();

		if ($_database -> exec($sql) !== false) {
			return true;
		} else {
			return false;
		}
		
	}

}
?>