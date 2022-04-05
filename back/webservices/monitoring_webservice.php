<?php

/**
 *
 * @file  : class Monitoring_webservice
 *
 * @autor : edwin_eka
 * @email  : edwinandeka@gmail.com
 *
 * version 1.0
 *
 * fecha: 28 dic de 2019
 *
 */
class Monitoring_webservice extends Webservice {



	public function getAllManagers( $today) {

		$day_operation = Query::byColumn('day_operation', 'date', $today );

		ws_send('today',  $today);

		if ($day_operation != null ) {

			$managers =  Query::bySql('user', "select * from user where (rol = '2' OR rol = '4') and TRIM(name) <> 'Inactivo'");

			foreach ($managers as $key => $manager) {

				if ($manager->turn != -1) {

					$day_operation_clients = Query::byColumn('day_operation_clients', 'date', $today, "and user= " .$manager->id);
					if ($day_operation_clients != null) {
						$managers[$key]->day_operation_clients = $day_operation_clients;
						$managers[$key]->clients = Query::bySql('client', $day_operation_clients->query_clients_sql) ;
						$managers[$key]->calls = Query::bySql('client',
							"select * from (". substr($day_operation_clients->query_clients_sql, 0, strlen($day_operation_clients->query_clients_sql)-1)  .") as cl , call_report cr WHERE cr.date = '$today' and cl.id = cr.client GROUP BY cr.client");

						ws_send($managers[$key]->name,  $day_operation_clients->query_clients_sql);

					} else {
						$managers[$key]->clients =  array();
					}


					$pedidos = Query::byColumnAll('order_products', 'date', $today, "and user= " .$manager->id);



					if ($pedidos != null) {
						$managers[$key]->pedidos = $pedidos;
					} else {
						$managers[$key]->pedidos = array();
					}

					$login_log = Query::byColumnAll('login_log', 'date', $today, "and user= " .$manager->id);
					if($login_log == NULL){
						$managers[$key]->loginLog = array();
					} else {
						$managers[$key]->loginLog = $login_log;
					}



					//inactividad


					//inicios de sesion



				}
			}

			ws_send('managers',  $managers);
		} else {
			ws_send('message', 'Aun no se han asignado los clientes para hoy');
			ws_send('managers',  array());
		}





		// $reminders = array();
		// $reminders = Query::all('call_report', "where user='".$manager->id."' and date='" . date('Y-m-d')."'  and reminder_time <> '' and type='AGENDADO' ORDER BY reminder_time ASC ", true);
		// ws_send('reminders', $reminders );
		//ws_send('clients', Query::all('client', "where day = '$day' AND (last_atention IS NULL OR last_atention <> '" .date('Y-m-d'). "')" ));
		ws_ok();
	}




	// public $ws_validate = true;

	public function restoreCausal() {

		$reports = Query::all('call_report');
		$aux = 0;
		$arrayName = array();

		foreach ($reports as $key => $report) {

			try {
				$client =  $report->client;
				if (isset($client) && isset($report) && $client != null) {
					$client->causal = $report->type;
					Model::update($client);
					$aux++;
				}
			}catch(ErrorException $error){
				$arrayName[] = $report;
			}
		}

		ws_send('aux', $aux);
		ws_send('arrayName', $arrayName);


		ws_ok();
	}


	public function savePhone() {
		ws_send('phone', Model::save(Model::create("phone")));
		ws_ok();
	}

	public function findClient() {

		$field = Post::input('field');

		$client = Query::all('client', ' where '. $field  . " LIKE '%".Post::input('code')."%'", true);

		ws_send('clients', $client);
		ws_ok();
	}



	public function loadPhones($id) {
		ws_send('phones', Query::byColumnAll("phone", 'client', $id , 'ORDER BY created_at  DESC') );
		ws_ok();
	}

	public function updatePhone() {
		$p = Post::input('phone');

		$phone = Query::byId("phone", $p['id']);
		$phone->phone = $p['phone'];
		$phone->observation = $p['observation'];

		ws_send('phone', Model::update($phone));
		ws_ok();
	}

	public function updateStatus($id, $state) {
		$phone = Query::byId("phone", $id);
		$phone->state = $state;
		ws_send('phone', Model::update($phone));
		ws_ok();
	}


	public function getInfoClient($id) {

		$client = Query::byId('client', $id );
		ws_send('client',  $client);

		$seller = Query::byColumn('seller', 'seller_code', $client->seller_code );
		ws_send('seller',  $seller);


		ws_ok();
	}


	public function updateStatusClient($id, $state) {
		$client = Query::byId("client", $id);
		$client->state = $state;
		ws_send('client', Model::update($client));
		ws_ok();
	}

	public function updateValueClient($id, $field) {
		$client = Query::byId("client", $id);
		$client->$field = Post::input('value');
		ws_send('client', Model::update($client));
		ws_ok();
	}


	public function updateValueSeller($id, $field) {
		$client = Query::byId("seller", $id);
		$client->$field = Post::input('value');
		ws_send('seller', Model::update($client));
		ws_ok();
	}

	public function updateNicknameClient($id, $nickname) {
		$client = Query::byId("client", $id);
		$client->nickname = $nickname;
		ws_send('client', Model::update($client));
		ws_ok();
	}




	public function createReportCall($id) {

		$report = new Call_report();

	    $report->client = $id;
	    $report->date = date('Y-m-d');
	    $report->hour = date('H:i:s');
	    $report->state = 'stared';
	    $report->user = Post::input('user');

		ws_send('saved', Model::save( $report));
		ws_send('report', $report);
		ws_ok();
	}


	public function updateValueReportCall($id, $field) {
		$call_report = Query::byId("call_report", $id);
		$call_report->$field = Post::input('value');
		ws_send('call_report', Model::update($call_report));
		ws_ok();
	}

	public function updateReminderReportCall($id) {
		$call_report = Query::byId("call_report", $id);
		$call_report->reminder_time = Post::input('time');
		$call_report->reminder_count = $call_report->reminder_count + 1;
		$call_report->state = 'reminder';

		ws_send('call_report', Model::update($call_report));
		ws_ok();
	}


	public function loadObservations($id) {
		ws_send('observations', Query::byColumnAll("observation", 'client', $id , 'ORDER BY created_at  DESC limit 0,10', true) );
		ws_ok();
	}

	public function saveObservation() {
		$observation = Model::create("observation");
		$observation->date = date('Y-m-d');
	    $observation->hour = date('H:i:s');

		ws_send('observation', Model::save($observation));
		ws_ok();
	}

	public function finishReportCall($id, $clientId, $typeOperation, $typeOperationPqr ) {

		$report = Query::byId("call_report", $id);
		$report->date_end = date('Y-m-d');
	    $report->hour_end = date('H:i:s');
	    $report->state = 'ended';
	    $report->type = $typeOperation;
	    $report->causal_pqr = $typeOperationPqr;

		ws_send('report', Model::update($report));

		$client = Query::byId("client", $clientId);
		ws_send('client1', $client);

		$client->last_atention = date('Y-m-d');
		if($typeOperation != 'AGENDADO'){
			$client->causal = $typeOperation;
		}
		ws_send('typeOperation', $typeOperation);
		ws_send('diff', $typeOperation != 'AGENDADO');

		ws_send('client', Model::update($client));
		ws_send('client2', $client);

		ws_ok();
	}


	public function onCancelSession($id) {
		$report = Query::byId("call_report", $id);
		$report->date_end = date('Y-m-d');
	    $report->hour_end = date('H:i:s');
	    $report->state = 'canceled';

		ws_send('report', Model::update($report));

		ws_ok();
	}


	public function getLastReportCall($id) {
		$reports = Query::byColumn("call_report", 'client',  $id, 'and state="ended" order by id DESC', true, true);
	    if ($reports != null) {
			$user = Query::byId("user", $reports->user);
			ws_send('user',$user);
	    }
		ws_send('report',$reports);
		ws_ok();
	}


	public function saveProduct() {
		ws_send('product', Model::save(Model::create("product")));
		ws_ok();
	}

	public function getProducts() {
		ws_send('products', Query::all('product'));
		ws_ok();
	}

	public function saveOrder( $clientId,  $reportId) {

		$order_products = new Order_products();
		$order_products->date = date('Y-m-d');
	    $order_products->hour = date('H:i:s');
	    $order_products->state = 'registered';
	    $order_products->client = $clientId;
	    $order_products->user = Post::input('user');
	    $order_products->call_report = $reportId;
	    $order_products->price = Post::input('price');

		ws_send('order_products', Model::save($order_products));





	    $products = Post::input('products');

	    foreach ($products as $key => $product) {
			$productDB = Query::byId("product", $product['product']);

			$product_order_products = new Product_order_products();
	    	$product_order_products->client = $clientId;
	    	$product_order_products->order_products = $order_products->id;
	    	$product_order_products->product = $product['product'];
	    	$product_order_products->quantity = $product['quantity'];
	    	$product_order_products->price = $productDB->price;
			Model::save($product_order_products);
	    }


		ws_ok();
	}

	public function getOrderAndProductsHistory($clientId) {
		ws_send('orders', Query::byColumnAll("order_products", 'client', $clientId , 'ORDER BY created_at  DESC limit 0,10', true) );
		ws_send('products', Query::all('product_order_products', "WHERE client = '$clientId' GROUP by product ORDER BY created_at DESC"));
		ws_ok();
	}


	public function saveClient2() {
		ws_send('clients', Model::save(Model::create("client")));
		ws_ok();
	}



	public function getAllCities() {


		$day_operation = Query::byColumn('day_operation', 'date', date('Y-m-d') );


		if ($day_operation != null) {
			// day LIKE "%MARTES%"
			$sql  = 'SELECT COUNT(id) as id, city FROM `client` WHERE '.$day_operation->query_sql.' GROUP by city';
			ws_send('cities', Query::bySql('client', $sql));

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

		$orderBy = "ORDER BY causal, city";
		$clients = Query::all('client', 'where ( '.$day_operation->query_sql.' )'.$orderBy);
		$longitud = count($clients);
		$dayIndex = date('w');
		$managers =  Post::input('managers');
		$agents = count($managers);

		$arrayClients = array();

		for ($j=0; $j < $agents; $j++) {
			$arrayClients[$j] = array();
		}

		$aux = 0;

		for ($i=0; $i < $longitud; $i++) {

			$client = $clients[$i];

			$arrayClients[$aux][] = $client;
			$aux++;
			if($aux == $agents) {
				$aux = 0;
			}
		}

		Session::set('arrayClients', $arrayClients);

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

		}

		ws_ok();
	}

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



	public function getHistoryOrder($id) {

		$order = Query::byId('order_products', $id);

		if ($order != null) {
			ws_send('order', $order);
			$products = Query::byColumnAll('product_order_products', 'order_products', $order->id, '', true);
			ws_send('products', $products);
		}

		ws_ok();
	}



	/**
	 * @return load data of all property´s types
	 */
	function saveClient() {

		$client = Model::create("client");
		Model::save($client);
		ws_send('id', $client->id);
		ws_ok();
	}





}
