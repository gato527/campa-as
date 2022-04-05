<?php 

class Listprice extends Model {
    //primary key autoincrementada
	public $id;
	
    //LLave Foranea
	public $tabla = 'varchar::120'; 
	public $columna = 'varchar::120'; 
	public $valor_columna = 'varchar::125'; 

	public $campo1 = 'varchar::120'; 
	public $campo2 = 'varchar::120'; 
	public $campo3 = 'varchar::120'; 
	public $campo4 = 'varchar::120'; 
	public $campo5 = 'varchar::120'; 
	public $campo6 = 'varchar::120'; 
	
	public $kschl = 'varchar::120'; 
	public $datab = 'varchar::120'; 
	public $datai = 'varchar::120'; 
	
	public $code = 'varchar::120'; 
	public $name = 'varchar::120'; 
	public $price = 'varchar::120'; 
	public $iva = 'varchar::120';  

}

?>
