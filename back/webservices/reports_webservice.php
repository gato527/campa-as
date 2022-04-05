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

class Reports_webservice {


	function getFilters() {

		$causales = Query::bySql('call_report', 'SELECT type as causal FROM call_report WHERE id IN(  SELECT Min(id) FROM call_report GROUP BY type)' );

		ws_send('causales', $causales);
		ws_send('cities', Query::bySql('client', 'SELECT city FROM client WHERE id IN(  SELECT Min(id) FROM client GROUP BY city)' ));
		ws_ok();

	}


	function diary() {

		Reports_webservice::diaryDay( date('Y-m-d'), date('Y-m-d'));
	}


	function diaryDay($day, $dayEnd) {

		ini_set('max_execution_time', 3000);
		ini_set('memory_limit', '1024M');


		$causales = Post::input('causales');
		$cities = Post::input('cities');


		$sql1 = "SELECT 

	
        cl.client_code,
        cl.name client_name,
        cl.nit,
        cl.business_name,
        cl.address,
        cl.neighborhood,
        cl.city,
		cl.typebusinnes,
        cl.day,
        cr.date,
        cr.hour,
        cr.type causal,
        cl.day_route,
        cl.seller_code,
        cr.state,
        cr.contact,
        cr.id,
        cr.user,
        cr.reminder_count

        FROM call_report cr

        INNER JOIN client cl on cr.client = cl.id 

		WHERE  (cr.date  between '".$day."' and '".$dayEnd."') ". $causales ."  ". $cities ."  ORDER BY client_code, date, hour;";

		//echo "$sql1";
		$result =  Query::bySql('report_diary', $sql1);
			//$data['print_var'] = print_var($result);
			//send($data);
			//die();
		if ($result != null) {
			foreach ($result as $key => $report) {

				$order = Query::byColumn('order_products', 'call_report', $report->id);

				


				if ($order != null) {

					$report->price = $order->price;
					$report->dateorder = $order->date;
					$report->canal = $order->canal;


					$products = Query::byColumnAll('product_order_products', 'order_products', $order->id, '', true);
					if ($products != null) {
						$productString = '';
						$productsprice = 0;

						foreach ($products as $key => $product) {
							$products = Query::byColumnAll('product_order_products', 'order_products', $order->id, '');
							
							$productDB = Query::byColumn("aproductos", "Codigo", $product->sap_code);
							if ($productDB != null) {
								$productString .= $product->quantity .' - cod: '. (int)$product->sap_code .' - '. $productDB->Nombre ." # ";
							} else {
								$productString .= $product->quantity .' - cod: '. (int)$product->sap_code .' - Sin información # ';
							}

							$productsprice += $product->price * $product->quantity;

						}

						$report->order = trim($productString);
						$report->productsprice = $productsprice;

					}

				}

				$observation = Query::byColumn('observation', 'call_report', $report->id, ' ORDER BY  created_at  DESC', true);
				if ($observation != null) {

					$observationString = '';
						$observationString .= trim( $observation->detail) .' # ';
						
					$report->detail = $observationString;

				}

				if (isset($report->user)) {
					$report->user = Query::byId('user', $report->user)->name;
				}

				if (isset($report->contact)) {
					$report->contact = Query::byId('contact', $report->contact);
				}

			}

			//$data['print_var'] = print_var($result);
			ws_send('report', $result );
			// ws_send('report', $order2 );
		}

		

		$struct = array();

		$struct['canal'] = 'Canal';
		$struct['client_code'] = 'Código del Cliente';
		$struct['client_name'] = 'Cliente';
		$struct['nit'] = 'Nit';
		$struct['business_name'] = 'Rázon social';
		$struct['typebusinnes'] = 'Tipo de negocio';
		$struct['address'] = 'Dirección';
		$struct['neighborhood'] = 'Barrio';
		$struct['city'] = 'Ciudad';
		$struct['date'] = 'Fecha de gestión';
		$struct['dateorder'] = 'Fecha de pedido';
		$struct['hour'] = 'Hora';
		$struct['causal'] = 'Causal';
		$struct['detail'] = 'Observación';
		$struct['day'] = 'Día de llamada';
		$struct['day_route'] = 'Dia de Ruta';
		$struct['seller_code'] = 'Ruta';
		$struct['state'] = 'Estado';
		$struct['order'] = 'Pedido';
		$struct['price'] = 'Precio orden';
		$struct['productsprice'] = 'Precio productos';
		$struct['user'] = 'Agente';
		$struct['reminder_count'] = 'Intentos de llamada';

		
		ws_send('struct', $struct );

		
		ws_ok();
	}


	function historyClient($code) {

		ini_set('max_execution_time', 3000);
		ini_set('memory_limit', '1024M');


		$sql1 = "SELECT 

        cl.client_code,
        cl.name client_name,
        cl.nit,
        cl.business_name,
        cl.address,
        cl.neighborhood,
        cl.city,
        cl.day,
        cr.date,
        cr.hour,
        cr.type causal,
        cl.day_route,
        cl.seller_code,
        cr.state,
        cr.contact,
        cr.id,
        cr.user,
        cr.reminder_count

        FROM call_report cr

        INNER JOIN client cl on cr.client = cl.id 

		WHERE cl.client_code = $code  ORDER BY client_code, date, hour;";

		//echo "$sql1";
		$result =  Query::bySql('report_diary', $sql1);
			//$data['print_var'] = print_var($result);
			//send($data);
			//die();
		if ($result != null) {
			foreach ($result as $key => $report) {

				$order = Query::byColumn('order_products', 'call_report', $report->id);

				if ($order != null) {

					$report->price = $order->price;

					$products = Query::byColumnAll('product_order_products', 'order_products', $order->id, '', true);
					if ($products != null) {
						$productString = '';
						$productsprice = 0;
						foreach ($products as $key => $product) {

							$productString .= $product->quantity .' - cod: '.$product->product->sap_code .' - '. $product->product->description ." # ";

							$productsprice += $product->price * $product->quantity;

						}

						$report->order = trim($productString);
						$report->productsprice = $productsprice;

					}

				}

				$observation = Query::byColumn('observation', 'call_report', $report->id, ' ORDER BY  created_at  DESC', true);
				if ($observation != null) {

					$observationString = '';
						$observationString .= trim( $observation->detail) .' # ';
						
					$report->detail = $observationString;

				}

				if (isset($report->user)) {
					$report->user = Query::byId('user', $report->user)->name;
				}

				if (isset($report->contact)) {
					$report->contact = Query::byId('contact', $report->contact);
				}

			}

			//$data['print_var'] = print_var($result);
			ws_send('report', $result );
		}

		

		$struct = array();

		$struct['client_name'] = 'Cliente';
		$struct['nit'] = 'Nit';
		$struct['business_name'] = 'Rázon social';
		$struct['address'] = 'Dirección';
		$struct['neighborhood'] = 'Barrio';
		$struct['city'] = 'Ciudad';
		$struct['date'] = 'Fecha de gestión';
		$struct['hour'] = 'Hora';
		$struct['causal'] = 'Causal';
		$struct['detail'] = 'Observación';
		$struct['day'] = 'Día de llamada';
		$struct['day_route'] = 'Dia de Ruta';
		$struct['seller_code'] = 'Ruta';
		$struct['state'] = 'Estado';
		$struct['order'] = 'Pedido';
		$struct['price'] = 'Precio orden';
		$struct['productsprice'] = 'Precio productos';
		$struct['user'] = 'Agente';
		$struct['reminder_count'] = 'Intentos de llamada';

		
		ws_send('struct', $struct );		
		ws_ok();
	}


}