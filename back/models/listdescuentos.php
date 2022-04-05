<?php 

class Listdescuentos extends Model {
    //primary key autoincrementada
	public $id;
	
    //LLave Foranea
	public $tabla = 'varchar::120'; 
	public $columna = 'varchar::120'; 
	public $datab = 'varchar::120'; 
	public $code = 'varchar::120'; 
	public $name = 'varchar::120'; 
	public $price = 'varchar::120'; 
	public $kschl = 'varchar::120'; 

}

?>
