<?php 

class Permission extends Model {
    //primary key autoincrementada
    public $id;    

    //LLave Foranea
    
    public $rol;
    public $menu;    

    //permisos
    public $p_create;    
    public $p_update;    
    public $p_delete;    
}
?>