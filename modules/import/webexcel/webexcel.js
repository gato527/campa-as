
/*
* @module  Webexcel - [Descripción de la vista]
*
* @author [correo] ([Nombre Completo])
*
* @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
*/

Titan.modules.create({
	name : 'Webexcel',
	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
    ready: function () {
		//init components
		this.headers = [

            "COD_VENDEDOR",
            "COD_CLIENTE",
            "NIT",
            "NOMBRE CLIENTE",
            "NOMBRE DE NEGOCIO",
            "TIPO DE NEGOCIO",
            "TELÉFONO",
            "DIRECCIÓN",
            "CIUDAD",
            "BARRIO",
            "DIA_VISITA",
            "DIA LLAMADA",
            "ESTADO",
            "CAUSAL",

		]

		// from a CSV file
		jexcel(this.demo[0], {
		    data:[['', '', '', '', '', '', '', '', '', '', '', '', '', '']],
		    colHeaders: this.headers,
		    colWidths: [  110, 100, 90, 250, 150, 120, 80, 100, 80, 80, 80, 100, 100 , 80],
		});
	},


	 /**
	 * @name importData
	 * @description description
	 * @params data Server response
	 * @return {void} 
	 */
	importData: function  (data) {

		 var parseJson = (row) => {
            var newObject = {}
            row.map((val, i) => newObject[this.headers[i]] = val)
            return newObject
        }


	    let datas = this.demo.jexcel('getData', false);

	    let products = []
	    for (var i = 0; i < datas.length; i++) {
	    	let row = datas[i]
	    	products.push( parseJson(row) )
	    }

	    this.rows = products


	    this.onImport()
	},


    	/*
	 * @name import
	 * @description description
	 * @return {void}
	 */
	 import: function() {
	 	
		
		WebService.post({ 'route': 'import/saveClient' , clients: this.clients }).done(this.onSavedClients.bind(this))

	 },


	 /*
	  * @name onImport
	  * @description description
	  * @return {void}
	  */
	  onImport: function() {
	  	
		WebService.post({ 
			route : 'import/saveClient',
			rows: JSON.stringify(this.rows),
		}).done( (data)=>{
			if(data.StatusResult){
                swal('Información', 'La importación finalizó exitosamente!');
            } else {
                Titan.popup.danger('Error al guardar los datos');
            }
			this.onClearData()
		});
	 	
	  },


		 /**
		 * @name onClear
		 * @description description
		 * @params data Server response
		 * @return {void} 
		 */
		onClear: function  (data) {
			Titan.message.confirmation('Confirmación', '¿Desea cancelar la importación?', this.onClearData ,this, 'Aceptar', 'Cancelar')
		    
		},

	   /**
	   * @name onClearData
	   * @description description
	   * @params data Server response
	   * @return {void} 
	   */
	  onClearData: function(state){

			if (state != 'ok') {
				return
			}
	    	this.demo.jexcel('setData', [['', '', '', '', '', '', '', '', '', '', '', '']]);
	      
	  },

});	
								