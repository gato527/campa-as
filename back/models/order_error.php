<?php 

class Order_error extends Model {
    //primary key autoincrementada
	public $id;

    public $document = 'varchar::120';
    public $type_order = 'varchar::16';
    public $office = 'varchar::16';
    public $seller = 'varchar::16';
    public $client_code = 'varchar::16';
    public $fecha = 'varchar::16';
    public $hour = 'varchar::16';
    public $message = 'text::0';

}

?>