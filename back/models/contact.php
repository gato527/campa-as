<?php 

class Contact extends Model {
    //primary key autoincrementada
	public $id;

    public $client = 'varchar::120';
    public $contact = 'varchar::20';
    public $state = 'varchar::60';
    public $observation = 'varchar::280';
}

?>