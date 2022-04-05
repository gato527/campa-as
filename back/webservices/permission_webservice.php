<?php

/**
 * @file  : class Permission_webservice
 *
 * @autor : edwin_eka
 * @email  : edwinandeka@gmail.com
 *
 * version 1.0
 *
 * fecha: 11 abr de 2017
 *
 */

class Permission_webservice extends Webservice {

	//public $ws_validate = true;


	/**
	 * @return data de las aplicaciones
	 */
	function getPermisionAplication() {

		ws_send('apps', Query::all('menu') );
		ws_send('permission', Query::all('permission') );
		ws_send('roles', Query::all('rol') );

		ws_ok();
		
		
	}

	/**
	 * @return data de las aplicaciones
	 */
	function getPermisionRol($id) {


		ws_send('permissions', Query::byColumnAll('permission', 'rol', $id , '', true ));

		ws_ok();
		
		
	}


	/**
	 * @return permisos de las aplicaciones
	 */
	function savePermisionAplication() {
		

		$rolId = Post::input("rolId");
		$app = Post::input("app");

		$p_create = Post::input("p_create");
		$p_update = Post::input("p_update");
		$p_delete = Post::input("p_delete");


		$permission = Query::byColumn("permission","rol", $rolId , 'and menu=' . $app);
		

		if ($permission == null) {

			$permission = new Permission();
			$permission->rol = $rolId;
			$permission->menu = $app;    
			$permission->p_create = $p_create;    
			$permission->p_update = $p_update;    
			$permission->p_delete = $p_delete;   

			Model::save($permission);

			ws_send('operation', 'save');
			ws_send('permission', $permission);
		} else {

			$permission->p_create = $p_create;    
			$permission->p_update = $p_update;    
			$permission->p_delete = $p_delete;   

			Model::update($permission);
			ws_send('operation', 'update');
			ws_send('permission', $permission);

		}

		ws_ok();
		
	}

	/**
	 * @return permisos de las aplicaciones
	 */
	function deletePermisionAplication() {
		

		$rolId = Post::input("rolId");
		$app = Post::input("app");

		$permission = Query::byColumn("permission","rol", $rolId , 'and menu=' . $app);
		
		if ($permission != null) {
			Model::delete($permission);
			ws_ok();
		} else {
			ws_fail();
		}

		
	}

	
}
?> 