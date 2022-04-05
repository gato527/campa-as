/*
 * @module  Debts_by_subsidiary
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */

 Titan.modules.create({
 	name : 'AddClient',
	/*
	 * @constructor @description inicia los componentes del módulo
	 */
	 ready : function() {

	 	this.addField('código del cliente', 'client_code',3)
	 	this.addField('código del vendedor', 'seller_code',3)

	 	this.addField('NIT', 'nit', 4)
	 	this.addField('Nombre Completo', 'name')
	 	this.addField('Razón social', 'business_name')

	 	
	 	this.addField('Ciudad', 'city', 4)
	 	this.addField('Dirección', 'address')
	 	this.addField('Barrio', 'neighborhood')

	 	this.addSelect('Día de llamada', 'day', 4,['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'])
	 	this.addSelect('Dia de Visita', 'day_route', 4, ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'])

		this.addSelect('Causal', 'causal', 6, ["PEDIDO", "PEDIDO PQR", "PQR", "VOLVER A LLAMAR" , "PEDIDO CON VENDEDOR", "COMPRA OTRA MARCA", "NUMERO EQUIVOCADO", "NO CONTESTA", "VENDIO NEGOCIO", "CLIENTE BLOQUEADO","NO DA INFORMACION"])
	 	

	 	this.phonesContainer.hide()

	 	// WebService.post({ 
	 	// 	route : 'reports/diary', 
	 	// }).done(this.load_reports_response.bind(this));
	 	

	 	Titan.loadView({
			module: 'agent',
			view: 'phones',
			container: this.phonesContainer,
		})

	 },



	 /*
	  * @name addField
	  * @description description
	  * @return {void}
	  */
	  addField: function(text, field, size) {
	  	
	 		this.clientForm.appendTitan(`
	 			<div class="form-group">
				    <label class="col-sm-4 control-label">${text}</label>
				    <div class="col-sm-${size || 8}">
				      	<input type="text" class="form-control"  data-value="client[${field}]">
				    </div>
			  	</div>`)


	  },



	  /*
	   * @name addSelect
	   * @description description
	   * @return {void}
	   */
	   addSelect: function(text, field, size, options) {
	   		this.clientForm.appendTitan(`
	 			<div class="form-group">
				    <label class="col-sm-4 control-label">${text}</label>
				    <div class="col-sm-${size || 8}">
			      		<select class="form-control" data-value="client[${field}]">
			      			${ options.map(option => ` <option>${option}</option>`  )}
				        </select> 
				    </div>
			  	</div>`)
	  
	   },

	/*
	 * @name save
	 * @description envía los datos a guardar al servidor
	 * @return {void}
	 */
	 save:function(elem){
	 	elem.hide()
	 	this.phonesContainer.show()


	 	var datas = this.get('[data-value]');
	 	datas.attr('disabled', 'disabled');

	 	let data = {}
	 	$.map(datas, function(val, index ) {
	 		var el = $(val);
	 		data[el.attr('data-value')] = el.val()
	 	});

	 	/* Guardamos las configuraciones */
		WebService.post({ 'route': 'agent/saveClient', ... data }).done(this.onSave.bind(this));

	 },


	 /*
	  * @name onSave
	  * @description description
	  * @return {void}
	  */
	  onSave: function(data ) {

	    let views = Titan.app.agent
	    views.phones.search(data.id)
	  	
	 
	  },




	 

});