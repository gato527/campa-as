<?php 

class Day_operation_clients extends Model {
    //primary key autoincrementada
	public $id;
	
    //LLave Foranea
    public $date = 'varchar::11';
  	public $query_clients_sql = 'varchar::520';
  	public $turn = 'int::11';
  	public $count = 'int::11';
  	public $user = 'int::11';


}

?>