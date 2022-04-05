<?php

/**
 * @file  : class Inmo_webservice
 *
 * @autor : edwin_eka
 * @email  : edwinandeka@gmail.com
 * servicios para la inmobiliaria
 *
 * version 1.0
 *
 * fecha: 13 sep de 2017
 *
 */

class Inmo_webservice extends Webservice {

	//public $ws_validate = true;


	/**
	 * @return load data of all property´s types
	 */
	function loadTypesProperties() {
		ws_send('types', Query::all('type_property') );
		ws_send('deals', Query::all('type_deal') );
		ws_send('owners', Query::all('owner') );
		ws_send('services', Query::all('feature_services') );
		ws_send('interiores', Query::all('feature_interior') );
		ws_send('exteriores', Query::all('feature_exterior') );
		
		/* se consulta el archivo de traduccion */
		include  'lang' . DS . 'es-owner.php';
		ws_send('owner-i18n', $i18n['owner'] );

		ws_ok();
	}



	/**
	 * @return save data of one property
	 */
	function saveProperty() {


		$property = Model::create('property');
		ws_send('saved', Model::save($property) );

		$services = Post::input('services');
		foreach ($services as $key => $s) {
			$service = new Property_service();
			$service->property = $property->id;
			$service->feature_services = $s;
			Model::save($service);
		}
		

		$interior = Post::input('interior');
		if ($interior) {
			foreach ($interior as $key => $s) {
				$service = new Property_interior();
				$service->property = $property->id;
				$service->feature_interior = $s;
				Model::save($service);
			}
		}


		$exterior = Post::input('exterior');
		if ($exterior) {
		
			foreach ($exterior as $key => $s) {
				$service = new Property_exterior();
				$service->property = $property->id;
				$service->feature_exterior = $s;
				Model::save($service);
			}
		}

		ws_send('services', Post::input('services') );
		ws_send('interior', Post::input('interior') );
		ws_send('exterior', Post::input('exterior') );
		ws_send('property', $property );

		ws_ok();
	}


	/**
	 * @return load all the data of the rental properties
	 */
	function loadPropertiesRents() {

		$tipo_negocio = 'type_deal';
		$alquiler = 2;
		$sql = '';
		
		ws_send('properties', Query::byColumnAll('property', $tipo_negocio, $alquiler, $sql, true) );

		ws_ok();
	}


	/**
	 * @return load all the data of the available Rents
	 */
	function loadAvailableRents() {

		$disponibilidad = 'availability';
		$disponible = 'Disponible';
		$sql = '';

		ws_send('properties', Query::byColumnAll('property', $disponibilidad, $disponible, $sql, true));

		ws_ok();
	}	


	/**
	 * @return load all the detailed data of the selected rental property
	 */
	function loadDetailsPropertyRent($id) {

		ws_send('properties', Query::byId('property',  $id, "", true) );
		$result = Query::byColumnAll('property_service', 'property', $id, "", true);
		ws_send('real_state', $this->getSetting('real-state') );
		ws_send('nit', $this->getSetting('nit') );
		ws_send('address', $this->getSetting('address') );
		ws_send('phone', $this->getSetting('phone') );
		ws_send('property_service', $result );

		ws_ok();
	}	


	/**
	 * @return load all the detailed data of the selected rental property
	 */
	function loadServiceProperty($id) {

		$result = Query::byId('property_service',  $id, "", true);

		ws_send('property_service', $result );

		ws_ok();
	}


	/**
	 * @return load all the detailed data of the selected rental property
	 */
	function searchOwner() {

		$owner = Post::input('owner');
		$address = Post::input('address');
		$neighborhood = Post::input('neighborhood');
		$message = "No se encontraron resultados";

		$sql = "SELECT * FROM owner WHERE CONCAT(name, ' ', lastname) LIKE '%".$owner."%' ORDER BY id ASC";
		$owners = Query::bySql('owner', $sql);
		$result = array();
		
		if($owners != NULL)
		{
			foreach ($owners as $key => $owner) {
			
				$property =  new Property();
				$property->owner = $owner->id;
				$property->neighborhood = $neighborhood;
				$property->address = $address;

				$result = array_merge($result, Query::search($property));

			}

			if(!empty($result)) {
				ws_send('properties', $result);
				ws_ok();
			}
			else {
				ws_send('message', $message);
				ws_fail();
			}

		}
		else {			
			ws_send('message', $message);
			ws_fail();
		}
	}

	/**
	 * @return load all the detailed data of the selected rental property
	 */
	function searchRents($id) {

		$result = Query::byId('property_service',  $id, "", true);

		ws_send('property_service', $result );

		ws_ok();
	}

	/**
	 * @return save data of the lease agreement in the database
	 */
	function saveAgreement() {

		$agreement = Model::create('agreement');
		ws_send('saved', Model::save($agreement) );

		$uftEncodeAgreement = (array) $agreement;
		$uftEncodeAgreement = array_map('utf8_decode', $uftEncodeAgreement);

		Inmo_webservice::savePaymentAgreements($uftEncodeAgreement);

		Inmo_webservice::createAgreement($uftEncodeAgreement);
		ws_ok();


	}

	/**
	 * @return save data of the lease agreement in the database
	 */
	function savePaymentAgreements($payment_agreements) {

		//print_r($payment_agreements)

		$agreement = Model::create('payment_agreements');



		//ws_send('saved', Model::save($agreement) );




	}	

	/**
	 * @return create the file of the lease agreement 
	 */
	public static  function  createAgreement($arr) {

		$strFilename = 'agreement.docx';

		$word = new PHPWord();
		$template = $word->loadTemplate( ROOT.$strFilename);
		$noAplica = 'N/A';
		$date = getdate();
		$day = $date['mday'];
		$month = $date['mon'];
		$year = $date['year'];

		$template->setValue('lessee_name', $arr['lessee_name']);
		$template->setValue('dni_lessee', $arr['dni_lessee']);
		$template->setValue('phone_1_lessee', $arr['phone_1_lessee']);



		$template->setValue('debtor_name', $arr['debtor_name']);
		$template->setValue('debtor_dni', $arr['debtor_dni']);
		$template->setValue('phone_1_debtor', $arr['phone_1_debtor']);

		if($arr['phone_2_debtor'] == '') {
			$template->setValue('phone_2_debtor', $noAplica);				
		}
		else {
			$template->setValue('phone_2_debtor', $arr['phone_2_debtor']);
		}

		if($arr['surety_1_name'] == '' && $arr['surety_1_dni'] == '' && $arr['phone_1_surety_1'] == '') {
			$template->setValue('surety_1_name', $noAplica);
			$template->setValue('surety_1_dni', $noAplica);
			$template->setValue('phone_1_surety_1', $noAplica);				
		}
		else {
			$template->setValue('surety_1_name', $arr['surety_1_name']);
			$template->setValue('surety_1_dni', $arr['surety_1_dni']);
			$template->setValue('phone_1_surety_1', $arr['phone_1_surety_1']);
		}
		if($arr['phone_2_surety_1'] == '') {
			$template->setValue('phone_2_surety_1', $noAplica);
		}
		else {
			 $template->setValue('phone_2_surety_1', $arr['phone_2_surety_1']);
		}

		if($arr['surety_2_name'] == '' && $arr['surety_2_dni'] == '' && $arr['phone_1_surety_2'] == '') {
			$template->setValue('surety_2_name', $noAplica);
			$template->setValue('surety_2_dni', $noAplica);
			$template->setValue('phone_1_surety_2', $noAplica);				
		}
		else {
			$template->setValue('surety_2_name', $arr['surety_1_name']);
			$template->setValue('surety_2_dni', $arr['surety_2_dni']);
			$template->setValue('phone_1_surety_2', $arr['phone_1_surety_2']);
		}
		if($arr['phone_2_surety_2'] == '') {
			$template->setValue('phone_2_surety_2', $noAplica);
		}
		else {
			 $template->setValue('phone_2_surety_2', $arr['phone_2_surety_2']);
		}

		$template->setValue('property_address', $arr['property_address']);

		$template->setValue('property_city', $arr['property_city']);

		$template->setValue('advance_canon', $arr['advance_canon']);

		$template->setValue('start_date', $arr['start_date']);
		$template->setValue('ending_date', $arr['ending_date']);

		$template->setValue('destination_property', $arr['destination_property']);

		$template->setValue('address_lessee', $arr['address_lessee']);
		$template->setValue('day', $day);
		$template->setValue('month', $month);
		$template->setValue('year', $year);

		$template->save(ROOT.'otro-'.$strFilename);
		
	}

	/**
	 * @return load all the upcoming contracts to expire
	 */
	function loadContractFinish($today, $endingDate) {

		$message = "No se encontraron resultados";

		$sql = "SELECT * FROM agreement WHERE ending_date BETWEEN '".$today."' AND '".$endingDate."' ORDER BY ending_date ASC";
		$contract_finish = Query::bySql('agreement', $sql);

		if($contract_finish != NULL) {
			ws_send('contract_finish', $contract_finish );
			ws_ok();
		}
		else {
			ws_send('message', $message);
			ws_fail();
		}

	}
	
}
?> 