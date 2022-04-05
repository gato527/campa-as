<?php

class Client extends Model {
    //primary key autoincrementada
	public $id;

	public $neighborhood = 'varchar::120';
	public $causal = 'varchar::255';
	public $city = 'varchar::120';
	public $client_code = 'varchar::255';
	public $seller_code = 'varchar::120';
	public $day = 'varchar::120';
	public $day_route = 'varchar::120';
	public $address = 'varchar::120';
	public $state = 'varchar::120';
    public $nit = 'varchar::120';
	public $name = 'varchar::120';
    public $business_name = 'varchar::120';
	public $typebusinnes = 'varchar::120';


	public $nickname = 'varchar::120';
	public $last_atention = 'varchar::120';

	public $startTimeMorning = 'varchar::11';
	public $endTimeMorning = 'varchar::11';
	public $startTimeafternoon = 'varchar::11';
	public $endTimeafternoon = 'varchar::11';






				/*
			BARRIO:"VILLAS DEL DORADO"
			CAUSAL:""
			CIUDAD:"BOGOTÁ"
			COD_CLIENTE:"118755"
			COD_VENDEDOR:"S32"
			DIA LLAMADA:"MIERCOLES"
			DIA_VISITA:"VIERNES"
			DIRECCIÓN:"cr 110 68c 64"
			ESTADO:""
			NIT:"39544326"
			NOMBRE CLIENTE:"PRIETO TORRES SANDRA CECILIA"
			NOMBRE DE NEGOCIO:"SUPERMERCADO BUCAROS"
			RECORRIDO:"RUTA"
			TELÉFONO:"0618065393"
			TIPO:"AUTOVENTA"
			ZONA:"5"*/

}

?>
