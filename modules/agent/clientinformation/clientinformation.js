/*
 * @module  index
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */
Titan.modules.create({
	name: 'Clientinformation',
	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components

	},

	/*
	 * @name search
	 * @description get the information of client id past to params
	 * @return {void}
	 */
	 search: function(clientId) {
		WebService.post({ 'route': 'agent/getInfoClient/' + clientId }).done(this.refresh.bind(this));

	 },


	/*
	 * @name refresh
	 * @description description
	 * @return {void}
	 */
	 refresh: function(data) {

	 	let {client , seller } = data

	 	this.client = client

	 	this.name.text(client.name.toName())

	 	this.nickname.val(client.nickname)
	 	this.state.val(client.state)
	 	this.address.text(client.address)
	 	this.neighborhood.text(client.neighborhood)
	 	this.businessName.text(client.business_name)
	 	this.nit.text(client.nit)
	 	this.city.text(client.city)
	 	this.typeBussiness.val(client.typebusinnes)

	 	this.dayCall.val(client.day)
	 	this.dayVisit.val(client.day_route)

	 	console.log('client', client)

	 	data.client.startTimeMorning = data.client.startTimeMorning || ''
	 	data.client.endTimeMorning = data.client.endTimeMorning || ''
	 	data.client.startTimeafternoon = data.client.startTimeafternoon || ''
	 	data.client.endTimeafternoon = data.client.endTimeafternoon || ''


	 	this.clientCode.html(`<h4>${client.client_code}</h4>`)
		if(data.client.startTimeMorning !== ''){
			this.startTimeMorning.val(data.client.startTimeMorning)
		}
		this.startTimeMorning.timepicki({
			show_meridian:false,
			min_hour_value:1,
			max_hour_value:12,
			start_time: ((data.client.startTimeMorning === '')?["06", "00"] : data.client.startTimeMorning.split(':')),
			on_blur: this.onChangeInputTime.bind(this),
		})
		if(data.client.endTimeMorning !== ''){
			this.endTimeMorning.val(data.client.endTimeMorning)
		}
		this.endTimeMorning.timepicki({
			show_meridian:false,
			min_hour_value:1,
			max_hour_value:12,
			start_time: ((data.client.endTimeMorning === '')?["06", "00"] : data.client.endTimeMorning.split(':')),
			on_blur: this.onChangeInputTime.bind(this),
		})
		if(data.client.startTimeafternoon !== ''){
			this.startTimeafternoon.val(data.client.startTimeafternoon)
		}
		this.startTimeafternoon.timepicki({
			show_meridian:false,
			min_hour_value:1,
			max_hour_value:12,
			start_time: ((data.client.startTimeafternoon === '')?["06", "00"] : data.client.startTimeafternoon.split(':')),
			on_blur: this.onChangeInputTime.bind(this),
		})
		if(data.client.endTimeafternoon !== ''){
			this.endTimeafternoon.val(data.client.endTimeafternoon)
		}
		this.endTimeafternoon.timepicki({
			show_meridian:false,
			min_hour_value:1,
			max_hour_value:12,
			start_time: ((data.client.endTimeafternoon === '')?["06", "00"] : data.client.endTimeafternoon.split(':')),
			on_blur: this.onChangeInputTime.bind(this),
		})
		this.sellerCode.html(client.seller_code)

		this.createEitable(this.sellerCode, 'seller_code', 'Ingrese el código del vendedor')
		this.createEitable(this.clientCode, 'client_code', 'Ingrese el código del Cliente')

		if(seller) {
			this.sellerName.text(seller.name)
			this.sellerPhone.text(seller.phone || '')
		} else {
			swal({ title:"Información", text: "El cliente no tiene un vendedor asignado", type: "info" });
		}

		

	 	this.sellerPhone.editable({
		    type: 'text',
		    title: 'Ingrese el número del vendedor',
		    emptytext: '--Vacía--',
		    success: (response, newValue) =>{
				WebService.post({ 'route': 'agent/updateValueSeller/' + seller.id + '/' + 'phone'  , value: newValue}).done(this.onSuccessUpdate)
		    }
		})

		
		this.createEitable(this.nit, 'nit', 'Ingrese el nuevo NIT')
		this.createEitable(this.address, 'address', 'Ingrese la nueva dirección')
		this.createEitable(this.neighborhood, 'neighborhood', 'Ingrese el nuevo barrio')

		// this.createEitable(this.dayCall, 'day', 'Ingrese el nuevo día de llamada')
		// this.createEitable(this.dayVisit, 'day_route', 'Ingrese el nuevo día de Visita')


		console.log(data)


	 },

	 /**
 	  * @name onChangeInputTime
 	  * @description description
 	  * @params data Server response
 	  * @return {void}
 	  */
 	  onChangeInputTime: function  (input) {
			var field = input.attr('id');
			var value = input.val();
 			WebService.post({ 'route': 'agent/updateValueClient/' + this.client.id + '/' + field, value: value}).done(this.onSuccessUpdate)
 	  },

	/**
	  * @name onChangeType
	  * @description description
	  * @params data Server response
	  * @return {void}
	  */
	  onChangeType: function  (select, value) {
			WebService.post({ 'route': 'agent/updateValueClient/' + this.client.id + '/typebusinnes', value: value}).done(this.onSuccessUpdate)
	  },


	 /*
	  * @name createEitable
	  * @description description
	  * @return {void}
	  */
	  createEitable: function( elem,field, title, placeholder) {

	  	let client = this.client
	 	elem.editable({
		    type: 'text',
		    title: title,
		    emptytext: '--Vacía--',
		    success: (response, newValue) =>{
				WebService.post({ 'route': 'agent/updateValueClient/' + client.id + '/' + field  , value: newValue}).done(this.onSuccessUpdate)
		    }
		})
	  },

	  /*
	   * @name onChangeDay
	   * @description description
	   * @return {void}
	   */
	   onChangeDay: function(select, value) {
			WebService.post({ 'route': 'agent/updateValueClient/' + this.client.id + '/day', value: value}).done(this.onSuccessUpdate)
	   },

	   /*
	   * @name onChangeDayVisit
	   * @description description
	   * @return {void}
	   */
	   onChangeDayVisit: function(select, value) {
			WebService.post({ 'route': 'agent/updateValueClient/' + this.client.id + '/day_route' , value: value }).done(this.onSuccessUpdate)
	   },

	   /*
	    * @name onSuccessUpdate
	    * @description description
	    * @return {void}
	    */
	    onSuccessUpdate: function() {

	    	Titan.popup.success('La información se actualizó correctamente.')

	    },


	 /*
	  * @name onChangeState
	  * @description description
	  * @return {void}
	  */
	  onChangeState: function(select, value) {
		WebService.post({ 'route': 'agent/updateStatusClient/' + this.client.id + '/' + value })
	  },

	  /*
	  * @name onChangeState
	  * @description description
	  * @return {void}
	  */
	  onChangeNickname: function(select, value) {
	  	if (value) {
			WebService.post({ 'route': 'agent/updateNicknameClient/' + this.client.id + '/' + value })
		}
	  },

});
