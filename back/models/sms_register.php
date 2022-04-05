<?php 

class Sms_register extends Model {
    //primary key autoincrementada
	public $id;

	public $textsms = 'text::0';
	public $number = 'varchar::12';
	public $date_sent = 'varchar::12';
	public $size = 'varchar::10';
	
	public $user = 'int::11';
	


}

 ?>