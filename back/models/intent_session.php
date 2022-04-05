<?php 

class Intent_session extends Model {
    //primary key autoincrementada
    public $id;

	//LLave Foranea
    public $user;
    public $count_session;
    public $date_last_login;

}
?>