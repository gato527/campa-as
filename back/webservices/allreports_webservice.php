<?php

/**
 * @file  : class Allreports_webservice
 *
 * @autor : edwin_eka
 * @email  : edwinandeka@gmail.com
 *
 * version 1.0
 *
 * fecha: 06 apr de 2019
 *
 */
class Allreports_webservice {

	function getclientOrders() {

		$headers = array(
			'code' => 'Código del cliente', 
			'name' => 'Nombre', 
			'city' => 'Ciudad', 
			'day' => 'Día de llamada', 
			'last_atention' => 'Última llamada', 
			'total' => 'Total en compras', 
			'causal' => 'Causal', 
		);

		$results =  Query::bySql('order_products', 'SELECT *, SUM(price) as total FROM `order_products` GROUP by client ORDER BY `total` DESC' );

		foreach ($results as $key => $result) {
			$client = Query::byId('client', $result->client);

			if ($client != null) {
				$result->code = $client->client_code;
				$result->name = $client->name;
				$result->city = $client->city;
				$result->day = $client->day;
				$result->last_atention = $client->last_atention;
				$result->causal = $client->causal;
			} else {
				$result->code = $result->client;
				$result->name = '';
				$result->city = '';
				$result->day = '';
				$result->last_atention = '';
				$result->causal = '';
			}
			
		
		}

		ws_send('headers', $headers);
		ws_send('report', $results );
		ws_ok();
	}


	function getclientErrorPhones() {

		$headers = array(
			'code' => 'Código del cliente', 
			'name' => 'Nombre', 
			'city' => 'Ciudad', 
			'day' => 'Día de llamada', 
			'last_atention' => 'Última llamada', 
			'causal' => 'Causal', 
			'phone' => 'Teléfono', 
			'state' => 'Estado del Teléfono', 
			'observation' => 'Observación del Teléfono', 
		);

		$results =  Query::bySql('phone', "SELECT * FROM `phone` WHERE state ='Fuera de servicio' ORDER BY `phone`.`state` DESC" );

		foreach ($results as $key => $result) {
			$client = Query::byId('client', $result->client);
			$result->code = $client->client_code;
			$result->name = $client->name;
			$result->city = $client->city;
			$result->day = $client->day;
			$result->last_atention = $client->last_atention;
			$result->causal = $client->causal;
		}

		ws_send('headers', $headers);
		ws_send('report', $results );
		ws_ok();
	}


	function getclientPQRs() {

		$headers = array(
			'client_code' => 'Código del cliente', 
			'name' => 'Nombre', 
			'city' => 'Ciudad', 
			'day' => 'Día de llamada', 
			'last_atention' => 'Última llamada', 
			'call' => 'Última observación de llamada', 
			'agent' => 'Última observación de llamada', 
			'causal' => 'Causal', 
			'phone' => 'Teléfono', 
			'state' => 'Estado del Teléfono', 
			'observation' => 'Observación del Teléfono', 
		);

		$results =  Query::bySql('client', "SELECT * FROM `client` WHERE causal = 'PQR' ORDER BY last_atention ASC" );

		foreach ($results as $key => $result) {
			$phone = Query::byColumn('phone', 'client', $result->id);
			$result->phone = $phone->phone;
			$result->state = $phone->state;
			$result->observation = $phone->observation;
			
			$observations = Query::byColumnAll('observation', 'client', $result->id, 'order by created_at desc limit 3');

			$result->call = ''; 

			foreach ($observations as $key => $observation) {
				$result->call .= $observation->id. ') '. str_replace("\n", '', $observation->detail);
			}

			$user = Query::byId('user',$observation->user);
			$result->agent = $user->name;
		}

		ws_send('headers', $headers);
		ws_send('report', $results );
		ws_ok();
	}


	function getclientPQRsPedido() {

		$headers = array(
			'client_code' => 'Código del cliente', 
			'name' => 'Nombre', 
			'city' => 'Ciudad', 
			'day' => 'Día de llamada', 
			'last_atention' => 'Última llamada', 
			'call' => 'Última observación de llamada', 
			'agent' => 'Última observación de llamada', 
			'causal' => 'Causal', 
			'phone' => 'Teléfono', 
			'state' => 'Estado del Teléfono', 
			'observation' => 'Observación del Teléfono', 
		);

		$results =  Query::bySql('client', "SELECT * FROM `client` WHERE causal = 'PEDIDO PQR' ORDER BY last_atention ASC" );

		foreach ($results as $key => $result) {
			$phone = Query::byColumn('phone', 'client', $result->id);
			$result->phone = $phone->phone;
			$result->state = $phone->state;
			$result->observation = $phone->observation;
			
			$observations = Query::byColumnAll('observation', 'client', $result->id, 'order by created_at desc limit 3');

			$result->call = ''; 

			foreach ($observations as $key => $observation) {
				$result->call .= $observation->id. ') '. str_replace("\n", '', $observation->detail);
			}

			$user = Query::byId('user',$observation->user);
			$result->agent = $user->name;
		}

		ws_send('headers', $headers);
		ws_send('report', $results );
		ws_ok();
	}


	function getclientList() {

		$headers = array(
			'client_code' => 'Codigo', 
			'name' => 'Nombre', 
			'city' => 'Ciudad', 
			'causal' => 'Causal', 
			'day' => 'Dia de llamada', 
		);

		$results =  Query::bySql('client', "SELECT * FROM `client` ORDER BY id ASC" );

		

		ws_send('headers', $headers);
		ws_send('report', $results );
		ws_ok();
	}


	function getclientListUpdate() {

		$headers = array(
			"seller_code" => "COD_VENDEDOR",
			"client_code" => "COD_CLIENTE",
			"name" => "NOMBRE_CLIENTE",
			"nit" => "NIT",
			"business_name" => "NOMBRE_DE_NEGOCIO",
			"address" => "DIRECCION",
			"city" => "CIUDAD",
			"neighborhood" => "BARRIO",
			"day" => "DIA_LLAMADA",
			"day_route" => "DIA_VISITA",
			"state" => "ESTADO",
			"causal" => "CAUSAL",
		);


		$results =  Query::bySql('client', "SELECT * FROM `client` ORDER BY id ASC" );

		ws_send('headers', $headers);
		ws_send('report', $results );
		ws_ok();
	}



		function getProductsOrders() {

			/**
			 * 
		    public $category = 'varchar::120';
		    public $sap_code = 'varchar::12';
		    public $bar_code = 'varchar::12';
		    public $name = 'varchar::320';
		    public $messure = 'varchar::60';
		    public $price = 'int::20';
		    public $price_out = 'int::20';
		    public $iva = 'int::20';
		    public $state = 'varchar::280';
		    public $presentation = 'varchar::280';
		    public $units = 'int::12';
		    public $units_by_package = 'int::12';
		    public $presentation_by_package = 'varchar::280';
		    public $observation = 'varchar::580';
			 */

		$headers = array(
			'code' => 'Código del producto', 
			'name' => 'Nombre', 
			'category' => 'Categoria', 
			'messure' => 'Medida', 
			'state' => 'Estado', 
			'price' => 'Precio', 
			'total' => 'Total de productos vendidos', 
			'total_price' => 'Total en compras', 
		);

		$results =  Query::bySql('product_order_products', 'SELECT *, SUM(quantity) as total FROM `product_order_products` GROUP by product ORDER BY `total` DESC' );

		foreach ($results as $key => $result) {

			// echo "$result->product";
			$product = Query::byId('product', $result->product);
			// var_dump($product);
			$result->code = $product->sap_code;
			$result->name = $product->description;
			$result->category = $product->category;
			$result->messure = $product->measure;
			$result->price = $product->price;
			$result->presentation = $product->presentation;
			$result->state = $product->state;
			$result->total_price = $result->price * $result->total;

		}

		ws_send('headers', $headers);
		ws_send('report', $results );
		ws_ok();
	}





	function getProductsOrdersCity() {

		$initDate = Post::input('initDate');
		$endDate = Post::input('endDate');

			/**
			 * 
		    public $category = 'varchar::120';
		    public $sap_code = 'varchar::12';
		    public $bar_code = 'varchar::12';
		    public $name = 'varchar::320';
		    public $messure = 'varchar::60';
		    public $price = 'int::20';
		    public $price_out = 'int::20';
		    public $iva = 'int::20';
		    public $state = 'varchar::280';
		    public $presentation = 'varchar::280';
		    public $units = 'int::12';
		    public $units_by_package = 'int::12';
		    public $presentation_by_package = 'varchar::280';
		    public $observation = 'varchar::580';
			 */

		$headers = array(
			'ciudad' => 'Ciudad', 
			'code' => 'Código del producto', 
			'name' => 'Nombre', 
			'category' => 'Categoria', 
			'messure' => 'Medida', 
			'state' => 'Estado', 

			'created_at' => 'Fecha de venta', 
			'quantity' => 'Cantidad', 
			'price' => 'Precio', 
			'total' => 'Total de productos vendidos', 
		);

		$sql = '
			SELECT  
			replace(
				replace(
				replace(
				replace(
				replace(
				replace(
				replace(
				replace(
				replace(
				TRIM(cl.city),
				"Á","A"), 
				"É","E"), 
				"Í","I"), 
				"Ó","O"), 
				"Ú","U"), 
				"\t",""), 
				"\s", ""), 
				".", ""), 
				",","")
			 as ciudad, p.* , p.quantity, (p.price * p.quantity ) as total FROM `product_order_products` as p join client as cl on cl.id = p.client 

			 WHERE DATE(p.created_at) BETWEEN   "'.$initDate.'" and "'.$endDate.'"  

			  ORDER BY p.created_at ASC




		';

		/*
		

		SELECT SUM(p.price)as price, SUM(quantity) as total, 
			replace(
				replace(
				replace(
				replace(
				replace(
				replace(
				replace(
				replace(
				replace(
				TRIM(cl.city),
				"�","A"), 
				"�","E"), 
				"�","I"), 
				"�","O"), 
				"�","U"), 
				"\t",""), 
				"\s", ""), 
				".", ""), 
				",","")
			 as ciudad, p.product FROM `product_order_products` as p join client as cl on cl.id = p.client 

			 WHERE DATE(p.created_at) BETWEEN  "'.$initDate.'" and "'.$endDate.'"  

			  ORDER BY ciudad, total DESC

		 */

		$results =  Query::bySql('product_order_products', $sql );

		if (isset($results) && $results != null) {
		

				foreach ($results as $key => $result) {

					// echo "$result->product";
					$product = Query::byId('product', $result->product);
					// var_dump($product);
					$result->code = $product->sap_code;
					$result->name = $product->description;
					$result->category = $product->category;
					$result->messure = $product->measure;
					// $result->price = $product->price;
					$result->presentation = $product->presentation;
					$result->state = $product->state;

				}
		}
		ws_send('headers', $headers);
		ws_send('report', $results );
		ws_send('sql', $sql );
		ws_ok();
	}



	function getAllClientOrders() {

		$headers = array(
			'client_code' => 'Código del cliente', 
			'name' => 'Nombre', 
			'city' => 'Ciudad', 
			'day' => 'Día de llamada', 
			'last_atention' => 'Última llamada', 
			'causal' => 'Causal', 
			'price' => 'Último pedido', 
		);

		$results =  Query::bySql('order_products', 'SELECT * FROM `order_products` as r join client c on c.id = r.client GROUP by client ORDER BY `r`.`date` DESC' );

		// foreach ($results as $key => $result) {
		// 	$client = Query::byId('client', $result->client);

		// 	if ($client != null) {
		// 		$result->code = $client->client_code;
		// 		$result->name = $client->name;
		// 		$result->city = $client->city;
		// 		$result->day = $client->day;
		// 		$result->last_atention = $client->last_atention;
		// 		$result->causal = $client->causal;
		// 	} else {
		// 		$result->code = $result->client;
		// 		$result->name = '';
		// 		$result->city = '';
		// 		$result->day = '';
		// 		$result->last_atention = '';
		// 		$result->causal = '';
		// 	}
			
		
		// }

		ws_send('headers', $headers);
		ws_send('report', $results );
		ws_ok();
	}



	function getAllProductsOrders() {

		$headers = array(
			'fecha' => 'Fecha', 
			'quantity' => 'Cantidad', 
			'price' => 'Precio de Venta', 
			'totalventa' => 'Total Venta', 
			'price_base' => 'Precio base', 
			'price_iva' => 'IVA', 
			'iva' => '% iva', 
			'sap_code' => 'Código del producto', 
			'Nombre' => 'Nombre del producto', 
			'ciudad' => 'Ciudad', 
			'day' => 'Día de llamada', 
			'client_code' => 'Código del cliente', 
			'typebusinnes' => 'Tipo de negocio', 
		);

		$initDate = Post::input('initDate');
		$endDate = Post::input('endDate');

		$sql = "SELECT DATE(p.created_at) fecha, quantity, p.price, (quantity*p.price ) totalventa, p.price_base, p.price_iva, p.iva, p.sap_code,replace(
			replace(
			replace(
			replace(
			replace(
			replace(
			replace(
			replace(
			replace(
			TRIM(c.city),
			'Á','A'), 
			'É','E'), 
			'Í','I'), 
			'Ó','O'), 
			'Ú','U'), 
			'\t',''), 
			'\s', ''), 
			'.', ''), 
			',','')
		 as ciudad, c.day, c.client_code, c.typebusinnes, ap.Nombre FROM product_order_products p JOIN client c on p.client = c.id join aproductos ap on ap.Codigo = p.sap_code WHERE p.created_at BETWEEN '$initDate 00:00:00.000000' AND '$endDate 00:00:00.000000'";

		$results =  Query::bySql('product_order_products',  $sql);


		ws_send('headers', $headers);
		ws_send('report', $results );
		ws_send('sql', $sql );
		ws_ok();
	}


	// **********************************************************************************
	function getProducts() {

		$headers = array(
			'Codigo' => 'Codigo', 
			'Nombre' => 'Nombre del producto', 
			'Precio' => 'Precio', 
			'categoria' => 'Categoria', 
			'status' => 'Disponibilidad', 
			 
		);

		$results =  Query::bySql('aproductos', "SELECT Codigo, Nombre, Precio, categoria FROM `aproductos` " );

		ws_send('headers', $headers);
		foreach ($results as $key => $value) {
			$value->status=1;
			$value->categoria='';
		}

		ws_send('report', $results );
		ws_ok();
	}
	



	/*************************************************************************************************************************/ 

	function getVendidos() {

		$headers = array(
			'client' => 'Cliente',
			'seller_code' => 'Ruta',
			'product_order_products' => 'ProductoCodigo',

		 
		);

		$initDate = Post::input('initDate');
		$endDate = Post::input('endDate');

		$order_products =  Query::bySql('order_products', "SELECT * FROM order_products WHERE created_at BETWEEN '$initDate 00:00:00.000000' AND '$endDate 00:00:00.000000'" );

		// $prueba = "SELECT * FROM order_products WHERE created_at BETWEEN '$initDate 00:00:00.000000' AND '$endDate 00:00:00.000000'";

		
		foreach ($order_products as $key => $order_product) {
			$client = Query::byId('client', $order_product->client);
			$productos = Query::byColumnAll('product_order_products', 'order_products', $order_product->id);




			if ($client != null) {
				$order_product->client = $client->id;
				$order_product->seller_code = $client->seller_code;				
				$order_product->product_order_products = $productos;
				// $result->city = $client->city;
				// $result->day = $client->day;
				// $result->last_atention = $client->last_atention;
				// $result->causal = $client->causal;
			} else {
				// $result->code = $result->client;
				// $result->name = '';
				// $result->city = '';
				// $result->day = '';
				// $result->last_atention = '';
				// $result->causal = '';
			}

			foreach ($productos as $key => $producto) {			
			$productosEncontrados = Query::byColumn('aproductos', 'Codigo', $producto->sap_code);
			$order_product->$key = $productosEncontrados;
			// $producto->id





			}




			
		
		}	
		ws_send('headers', $headers);
		ws_send('report', $order_products );
		// ws_send('report', $productosEncontrados );
		ws_ok();
	}


	
}