<?php 

class Chat_message extends Model {
    //primary key autoincrementada
	public $id;

	//text - attach
	public $dialog = 'varchar::120';
	public $type = 'varchar::120';
	public $message = 'text::0';

	public $status = 'varchar::120';

	public $user_from = 'int::11';
	public $user_to = 'int::11';
	public $chat_attach = 'int::11';
	


}

 ?>