/*
 * @module  Debts_by_subsidiary
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */

 Titan.modules.create({
 	name : 'Report',
	/*
	 * @constructor @description inicia los componentes del módulo
	 */
	 ready : function() {


	  
	 },


	 /*
	  * @name dataReport
	  * @description description
	  * @return {void}
	  */
	  process: function(elem) {
	  		
	 	WebService.post({ 
	 		route : 'agent/restoreCausal', 
	 	})
	  },

	

});