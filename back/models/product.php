<?php 

class Product extends Model {
    //primary key autoincrementada
	public $id;

    public $line = 'varchar::120';
    public $sap_code = 'varchar::120';
    public $category = 'varchar::120';
    public $description = 'varchar::120';
    public $measure = 'varchar::60';
    public $price = 'varchar::120';
    public $iva = 'varchar::120';
    public $state = 'varchar::280';
    public $presentation = 'varchar::120';
    public $units = 'varchar::12';
    public $units_by_package = 'varchar::120';
    public $presentation_by_package = 'varchar::280';
    public $observation_poduct = 'varchar::580';
}

?>