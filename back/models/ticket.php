<?php 
class Ticket extends Model {
    //primary key autoincrementada
	public $id;
	
	public $state;
	public $priority;
	public $date_report;
	public $description;
	//LLave Foranea
	public $user = "hidden";
	public $hours;
	public $date_finish;
	
}
?>