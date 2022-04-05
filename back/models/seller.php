<?php 

class Seller extends Model {

    //primary key autoincrementada
	public $id;

	public $name = 'varchar::120';
	public $city = 'varchar::120';
	public $seller_code = 'varchar::12';
	public $phone = 'varchar::40';


}

?>