<?php 

class Poll extends Model {
    //primary key autoincrementada
	public $id;

    public $user = 'int::11';

    public $state = 'varchar::60';
    public $title = 'text::0';


}

?>