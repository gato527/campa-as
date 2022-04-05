<?php 

class Call_report extends Model {
    //primary key autoincrementada
	public $id;

    public $type = 'varchar::120';
    public $client = 'varchar::120';
    public $date = 'varchar::11';
    public $date_end = 'varchar::11';
    public $hour = 'varchar::11';
    public $hour_end = 'varchar::11';
    public $state = 'varchar::120';
    public $reminder_time = 'varchar::11';
    public $reminder_count = 'int::11';
    public $user = 'varchar::11';

    public $causal_pqr = 'varchar::120';

    public $is_visit = 'varchar::2';
    public $reason_visit = 'varchar::60';
    public $date_visit = 'varchar::12';
    public $date_last_order = 'varchar::12';
    
    //foranea
    public $contact = 'int::11';
}

?>