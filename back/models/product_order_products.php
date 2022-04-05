<?php 

class Product_order_products extends Model {
    //primary key autoincrementada
	public $id;

    public $order_products = 'int::11';
    public $client = 'int::11';

    public $product = 'int::11';
    public $quantity = 'int::11';
    public $price = 'int::11';
    public $price_base = 'int::21';
    public $price_iva = 'int::21';
    public $iva = 'int::21';
    public $sap_code = 'varchar::20';


}

?>