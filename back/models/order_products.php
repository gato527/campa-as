<?php 

class Order_products extends Model {
    //primary key autoincrementada
	public $id;

    public $client = 'int::11';
    public $call_report = 'int::11';

    public $user = 'int::11';
    public $price = 'int::21';
    public $price_base = 'int::21';
    public $price_iva = 'int::21';

    public $date = 'varchar::11';
    public $hour = 'varchar::11';
    public $state = 'varchar::60';

    public $sync_harinera = 'int::1';
    public $sync_code = 'varchar::60';
    public $canal = 'varchar::60';



}

?>