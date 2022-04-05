<?php

/**
 *
 * @file  : class Sms_webservice
 *
 * @autor : edwin_eka
 * @email  : edwinandeka@gmail.com
 *
 * version 1.0
 *
 * fecha: 16 dic de 2018
 *
 */
class Sms_webservice {

	public function index($page) {
		$init = $page - 20; 
		$array = array();
		//echo $init. "  ". $page;
		$array["categorias"] = Query::all("categoria", "order by nombre limit 20 OFFSET $page");

		echo json_encode($array);
	}

	public function create() {
		
		if (Post::isKey("categoria")) 
			echo  json_encode(Model::save(Model::create("categoria")));
		else 
			echo "error data null: " ;
	}

	public function edit($id) {
		if (Post::isKey("categoria")) 
			echo Model::update(Model::create("categoria", $id));
		else 
			echo json_encode(Query::byId("categoria", $id));
	}

	public function erase($id) {
		echo json_encode(Model::delete(Query::byId("categoria", $id)));
	}

	public function saveTemplate($name, $size, $user) {
		$textSms = Post::input('textSms');

		$template = new Sms_template();


		$template->name = $name;
		$template->textsms = $textSms;
		$template->size = $size;

		$template->user = $user;

		Model::save($template);
		ws_send("template", $template);
		ws_ok();
	}


	public function loadTemplates() {
		$templates = Query::all("sms_template", "order by created_at desc");
		ws_send("templates", $templates);
		ws_ok();

	}


	public function website($name, $phone) {
		Database::switchDB('dowesoft_duverneysuarez');
		$ip = getUserIP() == '::1'? 'localhost': getUserIP();

		$contact = Query::byColumn('contact', 'ip_address', $ip, " and DATE(created_at) ='" .date('Y-m-d')."'  ");

		if ($contact != null) {
			ws_send("message", "Su solicitud ya fue recibida, ten paciencia un asesor se contactará contigo.");
			ws_ok();
		} else {
			$contact = new Contact();
			$contact->name = $name;
			$contact->phone = $phone;
			$contact->ip_address = $ip;

			Model::save($contact);

			$this->sendWEBS("Eficartsas.com: contáctame, $contact->name al $contact->phone.");

			ws_send("contact", $contact);
			ws_ok();
		}

	}


	public function send($phone, $size, $user, $intern = false) {

		$textSms = Post::input('textSms');


		$user = Session::get("autorization");

		if (isset($user)) {
		
			/*
			

			*/
		

			$url = 'https://api.hablame.co/sms/envio/';
			$data = array(
				'cliente' => 10013022, //Numero de cliente
				'api' => 'fra3AFQziuGJ41qxAGtt4gyYpTLxwU', //Clave API suministrada
				'numero' => $phone, //numero o numeros telefonicos a enviar el SMS (separados por una coma ,)
				'sms' => $textSms, //Mensaje de texto a enviar
				'fecha' => '', //(campo opcional) Fecha de envio, si se envia vacio se envia inmediatamente (Ejemplo: 2017-12-31 23:59:59)
				'referencia' => 'Harinera del valle', //(campo opcional) Numero de referencio ó nombre de campaña
			);

			$options = array(
			    'http' => array(
			        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
			        'method'  => 'POST',
			        'content' => http_build_query($data)
			    )
			);
			$context  = stream_context_create($options);
			$result = json_decode((file_get_contents($url, false, $context)), true);



			if ($result["resultado"]===0) {

				foreach ($result['sms'] as $key => $sms) {

					$register = new Sms_register();

					$register->textsms = $sms['sms'];
					$register->size = strlen($sms['sms']);
					$register->number = $sms['numero'];
					$register->date_sent = date("Y-m-d");
					$register->user = $user;
					Model::save($register);
				}

				ws_send("message", 'Se ha enviado el SMS exitosamente');
				ws_send("resultado", $result);
			} else {
				ws_send("message", 'ha ocurrido un error!!');
				ws_send("resultado", $result);
			}


		} else {
			ws_send("message", 'La sessión caducó porfaver ingrese nuevamente.');
		}

		if (!$intern) {
			ws_ok();
		}

		return $result["resultado"]===0;

	}


	/**
	 * graphics sms by month
	 */
	public function graphicsMonth() {

		$actual = date("Y-m-") . '01';

		$templates = Query::bySql("sms_register", "SELECT DATE(created_at) as DATE, count(id) totalCount FROM sms_register where DATE(created_at) >= '$actual' GROUP BY DATE(created_at) ");
		ws_send("rows", $templates);
		ws_send("actual", $actual);
		ws_ok();

	}	


	/**
	 * graphics sms by month
	 */
	public function graphicsByMonth() {

		$mesmenos = Post::input('dateInit');
		$actual = Post::input('dateEnd');

		$templates = Query::bySql("sms_register", "SELECT DATE(created_at) as DATE, count(id) totalCount FROM sms_register where  (DATE(created_at) BETWEEN '$mesmenos'  AND '$actual') GROUP BY DATE(created_at) ");
		ws_send("rows", $templates);
		ws_send("actual", $actual);
		ws_ok();

	}	


















	public function graphics() {

		$actual = date("Y-m-d");
  		$mesmenos = date("Y-m-d", strtotime("-1 month", strtotime($actual)));


		$templates = Query::bySql("sms_register", "SELECT DATE(created_at) as DATE, count(id) totalCount FROM sms_register where (DATE(created_at) BETWEEN '$mesmenos'  AND '$actual') GROUP BY DATE(created_at)");
		ws_send("rows", $templates);
		ws_send("actual", $actual);
		ws_send("mesmenos", $mesmenos);
		ws_ok();

	}	



	 public function masive()  {
        ini_set('max_execution_time', 3000);
        ini_set('memory_limit', '1024M');
        
        $rows = Post::input('debtors');

        $rows = json_decode($rows);

        $user = Post::input("user");
        $fec_ = date_default_timezone_set('America/Bogota');
        
        $debtors = array();
        foreach($rows as $key => $row) {

            $row = (array) $row; 


            $phone = trim($row["Celular"]);
            $text = trim($row["Mensaje a enviar"]);
            
			$status = $this->sendMasive($phone, $text, strlen($text) , $user, true);
			$debtors[] = ($status? 'SI - ': 'NO - ' ) .  "  $phone";

        }
		ws_send("debtors", $debtors);
           
        ws_ok();
    }	


    public function sendMasive($phone, $textSms, $size, $user, $intern = false) {

    	$result = array('resultado' => 1 );

		$user = Session::get("autorization");

		if (isset($user)) {
		
			/*
			

			*/
		

			$url = 'https://api.hablame.co/sms/envio/';
			$data = array(
				'cliente' => 10013022, //Numero de cliente
				'api' => 'fra3AFQziuGJ41qxAGtt4gyYpTLxwU', //Clave API suministrada
				'numero' => $phone, //numero o numeros telefonicos a enviar el SMS (separados por una coma ,)
				'sms' => $textSms, //Mensaje de texto a enviar
				'fecha' => '', //(campo opcional) Fecha de envio, si se envia vacio se envia inmediatamente (Ejemplo: 2017-12-31 23:59:59)
				'referencia' => 'Harinera del valle', //(campo opcional) Numero de referencio ó nombre de campaña
			);

			$options = array(
			    'http' => array(
			        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
			        'method'  => 'POST',
			        'content' => http_build_query($data)
			    )
			);
			$context  = stream_context_create($options);
			$result = json_decode((file_get_contents($url, false, $context)), true);



			if ($result["resultado"]===0) {

				foreach ($result['sms'] as $key => $sms) {

					$register = new Sms_register();

					$register->textsms = $sms['sms'];
					$register->size = strlen($sms['sms']);
					$register->number = $sms['numero'];
					$register->date_sent = date("Y-m-d");
					$register->user = $user;
					Model::save($register);
				}

				ws_send("message", 'Se ha enviado el SMS exitosamente');
				ws_send("resultado", $result);
			} else {
				ws_send("message", 'ha ocurrido un error!!');
				ws_send("resultado", $result);
			}


		} else {
			ws_send("message", 'La sessión caducó porfaver ingrese nuevamente.');
		}

		if (!$intern) {
			ws_ok();
		}

		return $result["resultado"]===0;

	}
	

}