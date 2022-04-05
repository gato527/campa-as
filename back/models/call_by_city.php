<?php 

class Call_by_city extends Model {
    //primary key autoincrementada
	public $id;
	
    //LLave Foranea
    public $date = 'varchar::11';
  	public $quantity = 'int::12';
  	public $total = 'int::12';
  	public $city = 'varchar::120';
  	public $day = 'varchar::12';


}

?>