<?php

class Configuracion_webservice extends Webservice {

	//public $ws_validate = true;
	
	function save_percentage(){

		$data = array();
		
		//para imprimir variables
		//$obj = $this->get_data('honorarios');
		//$data['print_var'] = print_var( $obj->value + 20);

		$this->save_data('capital', Post::input("capital"));
		$this->save_data('honorarios', Post::input("honorarios"));
		$this->save_data('interes', Post::input("interes"));

		$data['StatusResult'] = 'OK';
		
		send($data);
	}

	function get_vars(){
		$data = array();
		
		$data['capital'] = $this->get_data('capital');
		$data['honorarios'] = $this->get_data('honorarios');
		$data['interes'] = $this->get_data('interes');
		
		send($data);
	}
	

	function get_data($keydata){
		return Query::byColumn('settings', 'keydata', $keydata);
	}
	

	function save_data($keydata, $value){
		$obj = Query::byColumn('settings', 'keydata', $keydata);
		if ($obj == null){
			$obj = new Settings();
			$obj->keydata = $keydata;
			$obj->value = $value;
			return Model::save($obj);
		}else{
			$obj->value = $value;
			return Model::update($obj);
		}
		
	}

	function save(){

		$data = array();
		
		$data['settings'] = Post::input("settings");
		$settings = Post::input("settings");

		foreach ($settings as $key => $value) {
			$this->save_data($value['keydata'], $value['value']);
		}

		$data['StatusResult'] = 'OK';
		
		send($data);
	}

	function load() {

		$data = array();
		

		$data['StatusResult'] = 'OK';
		$data['settings'] = Query::all('settings');
		
		send($data);
	}
}

?>