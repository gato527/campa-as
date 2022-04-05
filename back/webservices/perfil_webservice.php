<?php

/**
 * @file  : class Perfil_webservice
 *
 * @autor : edwin_eka
 * @email  : edwinandeka@gmail.com
 *
 * version 1.0
 *
 * fecha: 18 abril de 2014
 *
 */

class Perfil_webservice {

	

	function saveImage($user){
		
				
		$target_dir =  ".". DS . ".." . DS . "img". DS ."uploads" . DS . "users" . DS . "";
		$target_file = $target_dir . $user . '.png';

		ws_send('image f', $target_file);

		$data = Post::input('base64img');
		list($type, $data) = explode(';', $data);
		list(, $data)      = explode(',', $data);
		$data = base64_decode($data);

		file_put_contents($target_file, $data);

	    ws_ok();
				
	}


	function saveLogo(){
		

				
		$target_dir =  ".". DS . ".." . DS . "img". DS ."uploads" . DS . "bill" . DS . "";
		$photo =  uniqid() . uniqid();
		$target_file = $target_dir . $photo . '.png';

		$setting = Query::byColumn('settings', 'keydata', 'image-bill');

		if ($setting == null ) {
			$setting = new Settings();
			$setting->keydata = 'image-bill';
			$setting->value = $photo;
			Model::save($setting);

		} else {
			try{
				@unlink ( $target_dir . $setting->value . '.png');
			} catch(Exeption $e) {}
			$setting->keydata = 'image-bill';
			$setting->value = $photo;
			Model::update($setting);
		}
		

		ws_send('setting', $setting);
		ws_send('image f', $target_file);

		$data = Post::input('base64img');
		list($type, $data) = explode(';', $data);
		list(, $data)      = explode(',', $data);
		$data = base64_decode($data);

		file_put_contents($target_file, $data);

	    ws_ok();
				
	}
}
?>