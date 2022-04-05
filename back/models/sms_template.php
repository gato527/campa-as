<?php 

class Sms_template extends Model {
    //primary key autoincrementada
	public $id;

	public $name = 'varchar::30';
	public $textsms = 'text::0';
	public $size = 'varchar::10';
	
	public $user = 'int::11';
	


}

 ?>