<?php

class Login_log extends Model {
	//primary key autoincrementada login_log
	public $id;
	public $user = 'int::11';
	public $date = 'varchar::11';
	public $hour = 'varchar::11';
	public $state = 'varchar::60';

}

?>
