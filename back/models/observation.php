<?php 

class Observation extends Model {
    //primary key autoincrementada
	public $id;

	//foraneas
    public $call_report = 'int::11';
    public $client = 'int::11';
    public $user = 'int::11';

    public $detail = 'text::10000';
    public $date = 'varchar::11';
    public $hour = 'varchar::11';

}

?>