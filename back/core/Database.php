<?php
/**
 *
 */



class Database {

	 // Contenedor Instancia de la clase
    private static $instance;
    

	// Constructor privado, previene la creación de objetos vía new
	public function __construct() { 
        
       
    }

    public static function getIntance() {
        if(self::$instance === null) {
        	// Check to see if static PDO instance
        	// has already been created, so we create only one (singleton)
            if(!self::$instance) {
	            self::$instance = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME, DB_USER, DB_PASS, array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES ' . DB_CHARSET));
	        }
        }
        return self::$instance;
    }

    public function __clone() 
    {
        die(__CLASS__ . ' class cant be instantiated. Please use the method called getInstance.');
    }
  
}

?>