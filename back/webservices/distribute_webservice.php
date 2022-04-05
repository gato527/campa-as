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
class Distribute_webservice extends Webservice {

	// public $ws_validate = true;
	// 
	


	public function getAllCities() {

		$day_operation = Query::byColumn('day_operation', 'date', date('Y-m-d') );

		if ($day_operation != null) {
			$sql  = 'SELECT COUNT(id) as id, city FROM `client` WHERE '.$day_operation->query_sql.'  and causal IN("PEDIDO","PEDIDO PQR","VOLVER A LLAMAR","")  GROUP by city';
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


		$cities = Post::input('cities');

		$clients = array();

		foreach ($cities as $key => $city) {
			 $clientsTemp = Query::all('client', 'where  day LIKE "%'.$city['day'].'%" and ( '.$city['sql'].') and causal IN("PEDIDO","PEDIDO PQR","VOLVER A LLAMAR","") ORDER BY causal, city');
			 $clients = array_merge($clients,$clientsTemp);

		}

		//	print_r($clients);

		// $daysArray =  array(
		// 	0 => "DOMINGO",
		// 	1 => "LUNES",
		// 	2 => "MARTES",
		// 	3 => "MIERCOLES",
		// 	4 => "JUEVES",
		// 	5 => "VIERNES",
		// 	6 => "SABADO"
		// );
		
		// $day_operation = Query::byColumn('day_operation', 'date', date('Y-m-d') );

		$managers =  Post::input('managers');


		//$clients = Query::all('client', 'where ( '.$day_operation->query_sql.' ) and causal IN("PEDIDO","PEDIDO PQR","VOLVER A LLAMAR","") ORDER BY causal, city');
		$clientsLong = count($clients);
		//$dayIndex = date('w');
		$managers =  Post::input('managers');
		$agents = count($managers);
		
		$arrayClients = array();
		//se crean las colas de trabajo
		for ($j=0; $j < $agents; $j++) {
			$arrayClients[$j] = array();
		}

		$aux = 0;

		// reparto los clientes segun la cantidad de ejecutivos
		for ($i=0; $i < $clientsLong; $i++) {	
				
			$client = $clients[$i];

			$arrayClients[$aux][] = $client->id;
			$aux++;
			if($aux == $agents) {
				$aux = 0;
			}
		}



		$cities = Post::input('cities');
		foreach ($cities as $key => $city) {

			$call =  new Call_by_city();
		    $call->date = date('Y-m-d');
		  	$call->city = $city['cities'];
		  	$call->day = $city['day'];

		  	Model::save($call);
		}

		// borramos los turnos anteriores
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

			ws_send('clients' . $key , Query::bySql('client', $sql));


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


	public function clearDistribute() {

	    $date = date('Y-m-d');

	    Query::bySql('call_by_city',"DELETE FROM `call_by_city` WHERE date = '"  .$date. "'");
	    Query::bySql('day_operation',"DELETE FROM `day_operation` WHERE date = '"  .$date. "'");
	    Query::bySql('day_operation_clients',"DELETE FROM `day_operation_clients` WHERE date = '"  .$date. "'");

		ws_ok();
	}


}