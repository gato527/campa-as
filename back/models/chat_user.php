<?php 

class Chat_user extends Model {
    //primary key autoincrementada
	public $id;

	public $user = 'int::11';
	public $heartbeat = 'varchar::60';

}

 ?>