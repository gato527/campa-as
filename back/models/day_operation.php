<?php 

class Day_operation extends Model {
    //primary key autoincrementada
	public $id;
	
    //LLave Foranea
    public $date = 'varchar::11';
  	public $query_sql = 'varchar::520';
  	public $days = 'varchar::120';


}

?>