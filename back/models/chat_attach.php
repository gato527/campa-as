<?php 

class Chat_attach extends Model {
    //primary key autoincrementada
	public $id;

	//text - attach
	public $name = 'varchar::255';
	public $ext = 'varchar::20';
	public $size = 'int::12';
	public $path = 'text::0';

	


}

 ?>