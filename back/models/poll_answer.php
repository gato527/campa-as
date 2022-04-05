<?php 

class Poll_answer extends Model {
    //primary key autoincrementada
	public $id;

    public $poll = 'int::11';
    public $poll_answer = 'int::11';

    public $client = 'int::11';
    public $call_report = 'int::11';


}

?>