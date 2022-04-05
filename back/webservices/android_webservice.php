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
class Android_webservice extends Webservice {

	// public $ws_validate = true;
	
	
	public function listUsers() {

		$userId = Post::input("user-id");
		$rolId = Post::input("rol-id");


		ws_send('userId',$userId);
		ws_send('rolId',$rolId);

		$users = array();

		switch ($rolId) {
			case '13':
				# cliente -> ejecutivo
				$sql = 'SELECT t1.id as id,t1.name as name, t1.password as password, t1.login as login, t1.email as email, t1.chat as chat, t2.name as rol FROM user AS t1 INNER JOIN rol AS t2 on t1.rol = t2.id WHERE rol in(12)';
				$users = Query::bySql('user', $sql);
				break;

			case '12':
				# ejecutivo -> cliente , tramitadores
				$sql = 'SELECT t1.id as id,t1.name as name, t1.password as password, t1.login as login, t1.email as email, t1.chat as chat, t2.name as rol FROM user AS t1 INNER JOIN rol AS t2 on t1.rol = t2.id WHERE rol in(12,11)';
				$users = Query::bySql('user', $sql);

				break;

			case '11':
				# tramitador -> ejecutivo
				$sql = 'SELECT t1.id as id,t1.name as name, t1.password as password, t1.login as login, t1.email as email, t1.chat as chat, t2.name as rol FROM user AS t1 INNER JOIN rol AS t2 on t1.rol = t2.id WHERE rol in(12)';
				$users = Query::bySql('user', $sql);

				break;
			
			default:
				# default...
				$users = Query::all('user');

				break;
		}

		ws_send('users', $users);
		ws_ok();
	}


	public function boletines() {

		$userId = Post::input("user-id");
		$Interes_user = Query::byColumnAll("interes_user", "user", $userId );
		
		$ids = array();
		if ($Interes_user != null) {
			
			foreach ($Interes_user as $key => $value) {
				$ids[] =  $value->interes;
			}
			$in = join(',', $ids);	

			$sql = 'SELECT t1.id as id, t1.title as title, t1.body as body, t1.imageurl as imageurl, t1.publishDate as publishDate, t1.url as url, t1.likes as likes FROM boletin as t1 INNER JOIN interes_boletin as t2 on t1.id = t2.boletin WHERE interes in ( '.$in .') GROUP BY t1.id order by t1.id desc';

			$boletines = Query::bySql('boletin', $sql);

			$user_boletin_like = Query::byColumnAll("user_boletin_like", "user", $userId );
			$likes = array();

			if ( $user_boletin_like != null ) {
				foreach ($user_boletin_like as $key => $value) {
					$likes[] =  $value->boletin;
				}
			}

			ws_send('likes-arr', $likes);
			$likes = json_encode($likes);

			$likes = str_replace("[", "", $likes);
			$likes = str_replace("]", "", $likes);
			$likes = str_replace('"', "", $likes);

			ws_send('likes', $likes);
			ws_send('boletines', $boletines);
			ws_send('userId', $userId);
			ws_send('Interes_user', $Interes_user);
			ws_ok();
		} else {
			ws_fail();
		}
	}


	/**
	* regresa los intereses de los boletines por id de usuario
	*/
	function getIntersing() {

		$userId = Post::input("user-id");
		$values = array();
		$names = array();
		$intereses = Query::all('interes');

		foreach ($intereses as $key => $interest ) {
			$Interes_user = Query::byColumn("interes_user", "user", $userId, "and interes = ". $interest->id );
			
			if($Interes_user != null) {
				if ($Interes_user->flag) {
					$values[] = $key;
				}
			}
			$names[$key] =$interest->name;
		}

		ws_send('values', $values);
		ws_send('names', $names);

		if ($intereses != null) {
			ws_send('intereses', $intereses);
			ws_send('userId', $userId);
			ws_ok();
 		} else {
			ws_fail();
 		}
 		
	}

	/**
	* guarda los intereses por usuario
	*/
	function saveIntersing() {


		$intereses = explode(",", Post::input('intereses'));
		$userId = Post::input('user-id');

		$Interes_user = Query::byColumnAll("interes_user", "user", $userId );
		if ($Interes_user != null) {
			foreach ($Interes_user as $key => $value) {
				Model::delete($value);
			}
		}

		foreach ($intereses as $key => $interest ) {
			$interes = Query::byColumn("interes", "name", trim($interest) );

			$Interes_user = new Interes_user(); 
			$Interes_user->interes = $interes->id; 
			$Interes_user->user = $userId; 
			$Interes_user->flag = 1; 
			Model::save($Interes_user);
		}

		ws_send('intereses', $intereses);
		ws_send('userId', $userId);
		ws_ok();
 		
	}


	



	function login() {

		$login = Post::input("login");
		$user = Query::byColumn("user","email", $login['user']);
		
		if ($user == null) {
			ws_send("ErrorMessage", "Nombre de usuario no encontrado");
			ws_fail();
		} else {
			if ( $login['pass'] ==  $user->password ){
				$intents_session = Query::byColumn("intent_session","user", $user->id);
				
				//almacenar los intentos de iniciar sesión del usuario
				$intents_session = Query::byColumn("intent_session","user", $user->id);
				$fec_ = date_default_timezone_set('America/Bogota');

				if ($intents_session != null) {
					$count_session = $intents_session->count_session;
					$intents_session->count_session++;
					$intents_session->date_last_login = date("Y-m-d H:i:s");
					Model::update($intents_session);
				}
				

				ws_send("user", $user->id );
				ws_send("rol", $user->rol );
				ws_ok();

			}else {
				ws_send("ErrorMessage", "Contraseña incorrecta");
				ws_fail();
			}	
		}

		
		
	}


	/**
	* guarda los like a los boletines por usuario
	*/
	function saveLike() {

		$userId = Post::input('user-id');
		$boletinId = Post::input('boletin-id');

		$user_boletin_like = Query::byColumn("user_boletin_like", "user", $userId, "and boletin='" . $boletinId ."'");
		if ($user_boletin_like == null) {
			$user_boletin_like = new User_boletin_like();
			$user_boletin_like->user = $userId; 
			$user_boletin_like->created_date = date("Y-m-d H:i:s");
			$user_boletin_like->boletin = $boletinId; 
			Model::save($user_boletin_like);
		}

		$boletin = Query::byId("boletin", $boletinId );
		 if ($boletin != null) {
		 	$boletin->likes = $boletin->likes + 1;
		 	Model::update($boletin);
		 }


		ws_send('user_boletin_like', $user_boletin_like);
		ws_send('userId', $userId);
		ws_send('boletinId', $boletinId);
		ws_ok();
 		
	}


	/**
	* borra los like a los boletines por usuario
	*/
	function deleteLike() {

		$userId = Post::input('user-id');
		$boletinId = Post::input('boletin-id');

		$user_boletin_like = Query::byColumn("user_boletin_like", "user", $userId, "and boletin='" . $boletinId ."'");
		if ($user_boletin_like != null) {
			Model::delete($user_boletin_like);
		}

		$boletin = Query::byId("boletin", $boletinId );
		 if ($boletin != null) {
		 	$boletin->likes = $boletin->likes - 1;
		 	Model::update($boletin);
		 }


		ws_send('user_boletin_like', $user_boletin_like);
		ws_send('userId', $userId);
		ws_send('boletinId', $boletinId);
		ws_ok();
 		
	}


	
}