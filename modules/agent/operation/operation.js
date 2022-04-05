/*
 * @module  index
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */
Titan.modules.create({
	name: 'Operation',
	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components

		// load the client information
		Titan.loadView({
			module: 'agent',
			view: 'clientinformation',
			container: this.infoClient,
			params: {},
		})

		// load the phones of client
		Titan.loadView({
			module: 'agent',
			view: 'phones',
			container: this.phones,
			params: {},
		})

		//load the postponecall of client
		Titan.loadView({
			module: 'agent',
			view: 'postponecall',
			container: this.postpone,
			params: {},
		})

		// load the observation of client
		Titan.loadView({
			module: 'agent',
			view: 'observation',
			container: this.observations,
			params: {},
		})

		// load the view of orders
		Titan.loadView({
			module: 'listprice',
			view: 'products',
			container: this.orders,
			params: {},
		})

		// load the orders history of the client
		Titan.loadView({
			module: 'agent',
			view: 'history_products',
			container: this.history,
			params: {},
		})


		// load the orders history of the client
		Titan.loadView({
			module: 'agent',
			view: 'infoseller',
			container: this.infoseller,
			params: {},
		})

		// load the sms
		Titan.loadView({
			module: 'sms',
			view: 'sms',
			container: this.smsContainer,
			params: {},
		})
		

		this.typeOperationPQR.hide()
 		this.typeOperationBuyAnotherBrand.hide()
		this.typeOperationDoesNotOrder.hide()

	},

	/*
	 * @name finishSession
	 * @description description
	 * @return {void}
	 */
	 finishSession: function() {

	 	if (this.typeOperation.val() == '-Seleccione tipo de llamada-') {
	 		Titan.popup.warning('Seleccione el tipo de llamada antes de finalizar.', 6000)
	 		return
	 	}

	 	Titan.message.confirmation('Confirmación', '¿Desea finalizar la llamada?', this.onFinishedSession ,this)

	 },

	 /*
	 * @name cancelSession
	 * @description description
	 * @return {void}
	 */
	 cancelSession: function() {

	 	Titan.message.confirmation('Confirmación', '¿Desea cancelar la llamada?', this.onCancelSession ,this)

	 },

	 /*
	  * @name onFinishedSession
	  * @description description
	  * @return {void}
	  */
	  onFinishedSession: function() {
	 	if (this.params.onFinishedSession) {
			var value = this.typeOperation.val();
			var operation = this.typeOperationPQR.val();
			switch (value) {
				case 'COMPRA OTRA MARCA':
					operation = this.typeOperationBuyAnotherBrand.val();
					break;
				case 'NO HACE PEDIDO':
					operation = this.typeOperationDoesNotOrder.val();
					break;
			}
	 		this.params.onFinishedSession(value, operation)
	 		this.typeOperationPQR.hide()
			this.typeOperationBuyAnotherBrand.hide()
			this.typeOperationDoesNotOrder.hide()
	 	}

	 	this.typeOperation.removeAttr('disabled')
	  },


	   /*
	  * @name onCancelSession
	  * @description description
	  * @return {void}
	  */
	  onCancelSession: function() {
	 	if (this.params.onCancelSession) {
	 		this.params.onCancelSession()
	 	}
	  },


	   /**
	   * @name onChangeOperation
	   * @description description
	   * @params data Server response
	   * @return {void}
	   */
		 onChangeOperation: function  (elm , value) {
			 this.typeOperationPQR.val('-Seleccione tipo de pqr-')
			 this.typeOperationPQR.hide()
			 this.typeOperationBuyAnotherBrand.val('-Seleccione el motivo-')
			 this.typeOperationBuyAnotherBrand.hide()
			 this.typeOperationDoesNotOrder.val('-Seleccione el motivo-')
			 this.typeOperationDoesNotOrder.hide()
			 if (value=='COMPRA OTRA MARCA') {
				 this.typeOperationBuyAnotherBrand.show()
			 }
			 if (value=='NO HACE PEDIDO') {
				 this.typeOperationDoesNotOrder.show()
			 }
			 if (value=='PQR' || value=='PEDIDO PQR') {
				 this.typeOperationPQR.show()
			 }

		 },

});
