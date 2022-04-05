<?php
/**
 * @file  : class Calcular
 *
 * @autor : edwin_eka
 * @email  : edwinandeka@gmail.com
 *
 * version 1.0
 *
 * fecha: 18 abril de 2014
 * funciones de apoyo a los calculos realizados en la liquidación
 *
 */

class Calcular {

	public static function porcentaje( $monto, $porciento ){
		return intval( $monto*$porciento/100 );
	}

	/**
	 * Calcula el valor de el procredito segun las tasas establecidas en 
	 * la tabla de desbloqueo de procredito en el modulo de configuraciones
	 * 
	 * @param  int $monto saldo de la deuda
	 * @return int        valor a pagar por el procredito en pesos colombianos
	 */
	public static function valorProcredito( $monto ) {

		$porcentaje = 0;
		$setting = '';

		if ($monto > 1 && $monto <= 110000) {
			return Query::byColumn('settings', 'keydata', 'procredito-1')->value;
		} else if ($monto > 110001 && $monto <= 200000) {
			$setting = 'procredito-2';
		} else if ($monto > 200001 && $monto <= 300000) {
			$setting = 'procredito-3';
		} else if ($monto > 300001 && $monto <= 500000) {
			$setting = 'procredito-4';
		} else if ($monto > 500001 && $monto <= 1000000) {
			$setting = 'procredito-5';
		} else if ($monto > 1000001 && $monto <= 2000000) {
			$setting = 'procredito-6';
		} else if ($monto > 2000001 ) {
			$setting = 'procredito-7';
		}

		$porcentaje = Query::byColumn('settings', 'keydata', $setting )->value;

		//calculamos la tasa de procredito
		$value = Calcular::porcentaje($monto, $porcentaje);
		$monto += $value;

		//calculamoslos intereses de la tasa de procredito
		$intereses = Calcular::porcentaje($value, 16);

		$monto += $intereses;

		return $value + $intereses;
	}


}

?>