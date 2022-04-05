<?php

/**
 * @description : ejemplo de un webservice para un CRUD sobre la tabla categorias
 *
 * @file  : class Categoria_webservice
 *
 * @autor : edwin_eka
 * @email  : edwinandeka@gmail.com
 *
 * version 1.0
 *
 * fecha: 18 abril de 2014
 *
 */
class Crud_webservice extends Webservice {

	//public $ws_validate = false;

	/* tipos de dato con tamaño*/
	public $dataTypesN = array('CHARACTER',
		'VARCHAR',
		'CHARACTER VARYING',
		'BINARY',
		'VARBINARY',
		'BINARY VARYING');

	/* tipos de dato con precicion */

	public $dataTypesP = array('INTEGER',
		'DECIMAL', 
		'NUMERIC');


	public function index($page) {
		$init = $page - 20;
		
		$array = array ();
		
		// echo $init. " ". $page;
		
		$array["categorias"] = Query::all ( "categoria", "order by nombre limit 20 OFFSET $page" );
		
		echo json_encode ( $array );
	}
	public function count() {
		if (Post::isKey ( "data_table" ))
			
			$table = Post::input ( "data_table" );
		
		$array = array ();
		
		// echo $init. " ". $page;
		
		$array["count"] = Query::count ( $table );
		
		echo json_encode ( $array );
	}

	/**
	 * carga la estructura y los datos de una tabla
	 */
	public function load() {
		$array = array ();
		
		$table = Post::input ( "data_table" );

		/* 
		 * validamos si no existe la tabla la creamos 
		 * en la base de datos segun lo descrito 
		 * en el modelo
		 */
		//$this->createTable($table);
		
		$struct_table = Query::struct ( "struct_table", $table );

		
		$page = Post::input ( "page" );
		$items_per_page = Post::input ( "totalRows" );
		
		$model = ucfirst ( strtolower ( $table ) );

		if ($page == null) {
			/* si no se envia una página */
			if(!Post::isKey ( "nodata" )){
				ws_send("data", Query::all ( $table ));
			}
		} else {
			/*si se solicita una página */
			$offset = ($page - 1) * $items_per_page;
			
			if (Query::count ( $table ) >= 1)
				if(!Post::isKey ( "nodata" )) {
					$data = Query::all ( $table, "limit $offset, $items_per_page" );
					ws_send("data", $data);

				}

				$types['varchar'] = "text";
				$types['text'] = "textarea";
				$types['int'] = "number";
				$types['float'] = "decimal";
				$types['double'] = "decimal";
				$types['date'] = "date";
				$types['datetime'] = "datetime";
				$types['tinyint'] = "checkbox";
				$types['longtext'] = "textarea";
				$types['tinytext'] = "color";


				$respose_struct = array ();

				$fileName = 'lang' . DS . 'es-' . $table . '.php';

				if (!file_exists ( $fileName ))  {

					/* creamos el archivo de traducción */
					$myfile = fopen($fileName, "w") or die("Unable to open file!");
					
					$txt = "<?php\n\n";
					$txt .= "\$i18n[\"$table\"] = array();\n";
					$txt .= "\$i18n[\"$table\"][\"$table\"] = \"$model\";\n";
					$txt .= "\n";
					$txt .= "//primary key autoincrementada\n";
					$txt .= "\$i18n[\"$table\"][\"id\"] = \"Código\";\n";

					foreach ( $struct_table as $key => $value ) {
						if ($value->COLUMN_NAME != 'id') {

							$val = ucfirst ( strtolower ( $value->COLUMN_NAME) );
							$txt .= "\$i18n[\"$table\"][\"$value->COLUMN_NAME\"] = \"$val\";\n";
						}
					}

					fwrite($myfile, $txt);
					fclose($myfile);
				}
				
				/* se consulta el archivo de traduccion */
				include $fileName;

				foreach ( $struct_table as $key => $value ) {

					$respose_struct_table = array ();

					if (isset ( $i18n[$table][$value->COLUMN_NAME] )) {
						$respose_struct_table['name'] = $i18n[$table][$value->COLUMN_NAME];
					} else {

						/* 
						 * agregamos los atributos el archivo de traducción 
						 * si estos no se han creado 
						 */
						$txt ="";
						if ($value->COLUMN_NAME != 'id') {
							$txt .= "\$i18n[\"$table\"][\"$value->COLUMN_NAME\"] = \"$value->COLUMN_NAME\";";
						}

						$myfile = file_put_contents($fileName, $txt.PHP_EOL , FILE_APPEND | LOCK_EX);

						$respose_struct_table['name'] = $value->COLUMN_NAME;
					}

					if (isset ( $types[$value->DATA_TYPE] )){
						$respose_struct_table['type'] = $types[$value->DATA_TYPE];
					} else {
						$respose_struct_table['type'] = $value->DATA_TYPE;
					}

					$respose_struct_table['is_null'] = $value->IS_NULLABLE;
					$class = ucfirst ( strtolower ( $value->COLUMN_NAME ) );

					/* en caso de que sea foránea */
					if (class_exists ( $class ) ) {
						$respose_struct_table['type'] = "foranea";
						$respose_struct_table['table'] = $value->COLUMN_NAME;
						$dataColumn['struct'] = get_class_vars ( $class );
					}

					$respose_struct[$value->COLUMN_NAME] = $respose_struct_table;
				}

				// para organizar las columnas a gusto en el model
				$struct = get_class_vars ( $model );


				$respose_structTemp = array ();

				foreach ( $struct as $attr => $value ) {

					if ( $attr != 'created_at' && $attr != 'updated_at' && isset ( $respose_struct[$attr] )) {

						$respose_structTemp[$attr] = $respose_struct[$attr];
						$respose_structTemp[$attr]["visible"] = ($value=="hidden")?false:true;
						$respose_structTemp[$attr]["dao"] = json_decode($value);

					}
				}


				ws_send("struct", $respose_structTemp);
				ws_send("table", $i18n[$table][$table]);
				ws_send("count", Query::count ( $table ));
				ws_ok();
				


			}


		}

			/**
			 * crea una tabla en la base de datos segun el modelo descrito
			 * @return[type][description]
			 */
			function createTable($model) {


				$class = ucfirst ( strtolower (  $model ) );

				$struct = get_class_vars ( $class );

				/* validamos si hay cambios en el modelo */
				$struct_table = Query::struct ( "struct_table", $model );

				if (!isset($struct_table[0])) {
					$respose_structTemp = array ();

					$sql =  "CREATE TABLE $model (";
					$sql .= "id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY";

					$i = 0;
					foreach ( $struct as $attr => $value ) {
						if (isset ( $struct[$attr] )) {
							$field = json_decode($value);

							$sql .= $attr." ".$field->type."(".$field->size.")";
						}

						if ($i < count($struct) - 1) {
							$sql .= ", ";
						}

						$i++;
					}

					$sql .= ")";

					$_database = Database::getIntance();
					//echo "$sql";

					if ($_database -> exec($sql) or die(print_r($_database->errorInfo(), true)) !== false) {
						return true;
					} else {
						return false;
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
						$this->addColumn($model, $key, $struct[$key]);
					} else {
						/*eliminar columna de la tabla si se elimino del model */
						$this->deleteColumn($model, $key);

					}
				}


			}

			/* agrega una columna a una tabla */
			function addColumn( $model, $key, $value ) {

				$field = json_decode($value);
				$sql = "";
				if (in_array($field->type, $this->dataTypesN) || in_array($field->type, $this->dataTypesP)) {
					$sql = "ALTER TABLE $model ADD $key ".$field->type."(".$field->size.")";
				} else {
					$sql = "ALTER TABLE $model ADD $key ".$field->type;
				}

				$_database = Database::getIntance();

				if ($_database -> exec($sql) or die(print_r($_database->errorInfo(), true)) !== false) {
					return true;
				} else {
					return false;
				}
				
			}

			/* elimina una columna a una tabla */
			function deleteColumn( $model, $key ) {

				
				$sql = "ALTER TABLE $model DROP COLUMN $key";

				$_database = Database::getIntance();

				if ($_database -> exec($sql) or die(print_r($_database->errorInfo(), true)) !== false) {
					return true;
				} else {
					return false;
				}
				
			}



			function create() {
				$respose = array ();

				if (Post::isKey ( "data_table" ))

					$table = Post::input ( "data_table" );

				if (Post::isKey ( $table )) {
					$objct = Model::create ( $table );

					if ($table == 'user') {
						$objct->password = md5($objct->password); 
						if ($objct->rol == 1) {

							$respose["StatusResult"] = "FALIURE";

							$respose["table"] = $objct;

							$respose["ErrorMessage"] = "No tiene permiso para crear un administrador";
							Response ( $respose );
							return;
							
						}
					}

					if (Model::save ( $objct )) {

						$respose["StatusResult"] = "OK";

						$respose["data"] = Query::byColumnAll ( $table, 'id',  $objct->id, '', true)[0];
						if ($table == 'ticket') {
							$respose["email"] = Send_email::send("Nuevo Ticket", $objct->description,["edwinandeka@gmail.com"]);
						}else{
							$respose["email"] = "error ". $table == 'ticket';
						}
					} else {

						$respose["StatusResult"] = "FALIURE";

						$respose["table"] = $table;

						$respose["ErrorMessage"] = "error al guardar en la base de datos";
					}
				} else {

					$respose["StatusResult"] = "FALIURE";

					$respose["ErrorMessage"] = "error data null";
				}

				Response ( $respose );
			}
			function filter() {
				$respose = array ();

				if (Post::isKey ( "data_table" ))

					$table = Post::input ( "data_table" );

				$respose["StatusResult"] = "OK";

				$data = Query::search ( Model::create ( $table ) );

				$respose["data"] = $data;

				$array["count"] = count ( $data );

				Response ( $respose );
			}
			function update($id) {
				$respose = array ();

				if (Post::isKey ( "data_table" ))

					$table = Post::input ( "data_table" );

				if (Post::isKey ( $table )) {

					$var = Model::create ( $table, $id );
					if ($table == 'user') {

						$user = Query::byId("user",$id);
						//no permitir actualizar el rol a admin
						if ($var->rol == 1) {
							$respose["StatusResult"] = "FALIURE";
							$respose["table"] = $var;
							$respose["ErrorMessage"] = "No tiene permiso para crear un administrador";
							Response ( $respose );
							return;
						}
						if ($user->password != $var->password) {
							$var->password = md5($var->password); 
						}
					}

					if (Model::update ( $var )) {

						$respose["StatusResult"] = "OK";
						$respose["data"] = Query::byColumnAll ( $table, 'id',  $id, '', true)[0];
					} else {

						$respose["StatusResult"] = "FALIURE";

						$respose["table"] = $var;

						$respose["ErrorMessage"] = "No se pudo actualizar en la base de datos, es posible que no hallan cambios que guardar";
					}
				} else {

					$respose["StatusResult"] = "FALIURE";

					$respose["ErrorMessage"] = "error data null";
				}

				Response ( $respose );
			}


			public function eraseOld($id) {
				$respose = array ();

				if (Post::isKey ( "data_table" ))
					$table = Post::input ( "data_table" );

				$model = Query::byId ( $table, $id );
				
				if ($table == 'user') {

					//no permitir actualizar el rol a admin
					if ($model->rol == 1) {
						$respose["StatusResult"] = "FALIURE";
						$respose["table"] = $model;
						$respose["ErrorMessage"] = "No tiene permiso para eliminar un administrador";
						Response ( $respose );
						return;
					}
				}
				
				if (Model::delete ( $model)) {

					$respose["StatusResult"] = "OK";
				} else {

					$respose["StatusResult"] = "FALIURE";

					$respose["ErrorMessage"] = "error al borrar en la base de datos " . $id;
				}

				Response ( $respose );
			}

			public function erase() {
				$data= array ();
				
				if (Post::isKey ( "data_table" ))
					$table = Post::input ( "data_table" );
				
				

				if (Post::isKey ( "ids" ))
					$ids = Post::input ( "ids" );

				foreach ($ids as $key => $id) {
					$model = Query::byId ( $table, $id );
					if ($table == 'user') {
						//no permitir actualizar el rol a admin
						if ($model->rol == 1) {
							$data["StatusResult"] = "FALIURE";
							$data["ErrorMessage"] = "No tiene permiso para eliminar un administrador";
							send( $data);
							return;
						}
					}
					Model::delete ( $model);
				}

				$data["StatusResult"] = "OK";

				send( $data);
			}

			public function edit($id) {
				$respose = array ();

				if (Post::isKey ( "data_table" ))

					$table = Post::input ( "data_table" );

				$respose["StatusResult"] = "OK";

				$respose["data"] = Query::byColumnAll ( $table, 'id',  $id, '', true)[0];

				Response ( $respose );
			}
		}

		?>