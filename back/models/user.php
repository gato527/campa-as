<?php 

class User extends Model {
    //primary key autoincrementada
	public $id;
	
    //LLave Foranea
	public $rol = 'int::11';
	
	public $name = 'varchar::120';

	public $email = 'varchar::60';
	public $password = 'varchar::16';
	public $turn = 'int::11';
	public $status = 'boolean::1';

}

?>