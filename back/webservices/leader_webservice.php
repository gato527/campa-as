<?php

/**
 *
 * @file  : class Categoria_webservice
 *
 * @autor : edwin_eka
 * @email  : edwinandeka@gmail.com
 *
 * version 1.0
 *
 * fecha: 28 nov de 2014
 *
 */
class Leader_webservice extends Webservice {

	// public $ws_validate = true;
	// 
	


	public function getAllCities() {

		$day_operation = Query::byColumn('day_operation', 'date', date('Y-m-d') );

		if ($day_operation != null) {
			$sql  = 'SELECT COUNT(id) as id, city, day FROM `client` WHERE '.$day_operation->query_sql.'  and causal IN("PEDIDO","PEDIDO PQR","VOLVER A LLAMAR","","PQR")  GROUP by city';
			ws_send('cities', Query::bySql('client', $sql));
			ws_send('query',  $sql);

		} else {
			ws_send('cities',  array());
			
		}

		ws_send('managers', Query::byColumnAll('user', 'rol',  '2', "OR rol = '4'"));
		ws_send('calls', Query::byColumnAll('call_by_city', 'date',  date('Y-m-d')));

		ws_ok();
	}

	public function saveDistribute() {


		$daysArray =  array(
			0 => "DOMINGO",
			1 => "LUNES",
			2 => "MARTES",
			3 => "MIERCOLES",
			4 => "JUEVES",
			5 => "VIERNES",
			6 => "SABADO"
		);
		
		$day_operation = Query::byColumn('day_operation', 'date', date('Y-m-d') );



		$clients = Query::all('client', 'where ( '.$day_operation->query_sql.' ) and causal IN("PEDIDO","PEDIDO PQR","VOLVER A LLAMAR","","PQR") ORDER BY causal, city');
		$clientsLong = count($clients);
		$dayIndex = date('w');
		$managers =  Post::input('managers');
		$agents = count($managers);
		
		$arrayClients = array();

		for ($j=0; $j < $agents; $j++) {
			$arrayClients[$j] = array();
		}

		$aux = 0;

		/* reparto los clientes segun la cantidad de ejecutivos*/
		for ($i=0; $i < $clientsLong; $i++) {	
				
			$client = $clients[$i];

			$arrayClients[$aux][] = $client->id;
			$aux++;
			if($aux == $agents) {
				$aux = 0;
			}
		}






		//Session::set('arrayClients', $arrayClients);

		$day = $daysArray[$dayIndex];

		$cities = Post::input('cities');
		foreach ($cities as $key => $city) {

			$call =  new Call_by_city();
		    $call->date = date('Y-m-d');
		  	$call->quantity = $city['distribute'];
		  	$call->total = $city['total'];
		  	$call->city = $city['city'];
		  	$call->day = $day;

		  	Model::save($call);
		}

		$managers =  Query::all('user', '', false);
		foreach ($managers as $key => $manager) {
			$manager->turn = -1;
		  	Model::update($manager);
		}



		$managers =  Post::input('managers');
		foreach ($managers as $key => $manager) {

			$user = Query::byId('user', $manager['manager']);
			$user->turn = $manager['turn'];
		  	Model::update($user);

		  	$clientsIds = $arrayClients[$user->turn];

			$sql = 'SELECT * FROM client WHERE id IN ("'.join($clientsIds, '","').'");';

			$operation = new Day_operation_clients();
		    $operation->date = date('Y-m-d');
		  	$operation->query_clients_sql = $sql ;
		  	$operation->turn = $user->turn;
		  	$operation->count = count($clientsIds);
		  	$operation->user = $user->id;
		  	Model::save($operation);

			ws_send('clients' + $key , Query::bySql('client', $sql));


		}

		ws_send('clientsall'  ,  $arrayClients );


		ws_ok();
	}


	/**
	 * save the sql for the days the clients
	 * @return [type] [description]
	 */
	public function saveDistributeDay() {

		$day_operation = Query::byColumn('day_operation', 'date', date('Y-m-d') );

		if ($day_operation == null) {
			
			$day_operation =  new Day_operation();
			$day_operation->date = date('Y-m-d');
			$day_operation->query_sql = Post::input('sql');
			$day_operation->days  = Post::input('days');

			ws_send('day_operation', Model::save($day_operation));

		} else {
			$day_operation->date = date('Y-m-d');
			$day_operation->query_sql = Post::input('sql');
			$day_operation->days  = Post::input('days');

			ws_send('day_operation', Model::update($day_operation));
		}

		ws_ok();
	}

	/**
	 * load all order by day
	 * @return [type] [description]
	 */
	public function findOrders() {


		$orderdate = Post::input('orderdate');


		$order_products = Query::all('order_products', "WHERE date LIKE '$orderdate' order by id asc" );

		if ($order_products != null) {
			
			foreach ($order_products as $keyo => $order) {
			
				$products = Query::byColumnAll('product_order_products', 'order_products', $order->id);
				if ($products != null ) {
					foreach ($products as $key => $product) {
						$productDB = Query::byColumn("aproductos", "Codigo", $product->sap_code);
						$products[$key]->aproduct = $productDB;
				    }
			    }

			    $order_products[$keyo]->products = $products;

			}
		} 

		$order_errors = Query::all('order_error', "WHERE fecha LIKE REPLACE('$orderdate','-','') order by id asc" );
		
		ws_send('errors', $order_errors);
		ws_send('orders', $order_products);

		ws_ok();
	}

		/**
	 * change the day order
	 * @return [type] [description]
	 */
	public function changeDateOrder() {


		$orderdate = Post::input('orderdate');
		$orderId = Post::input('orderId');

		$order_products = Query::byId('order_products', $orderId );

		if ($order_products != null) {
			$order_products->date = $orderdate;
			Model::update($order_products);
		} 
		
		ws_send('orders', $order_products);

		ws_ok();
	}



	
}