/*
 * @module  index
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */
Titan.modules.create({
	name: 'Postponecall',
	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components
		//
		this.time.bootstrapMaterialDatePicker({ 
			date: false, 
			shortTime: true,
			okText: 'Siguiente',
			cancelText: 'Cancelar'
		});

		this.time.on('change', this.onChangeTime.bind(this))
	},


	/*
	 * @name search
	 * @description get the observation of report call id past to params
	 * @return {void}
	 */
	 search: function(reportId, clientId) {
	 	this.reportId = reportId
	 	this.clientId = clientId
	 },


	/*
	 * @name onChangeTime
	 * @description description
	 * @return {void}
	 */
	 onChangeTime: function(event, time) {
	 	

	 	let hour = moment(time).format('HH:mm a')
	 	this.time.val('')

	 	this.saveTime(hour)
	 },

	 /*
	  * @name postpone15
	  * @description description
	  * @return {void}
	  */
	  postpone15: function() {
	  	let hour = moment().add(15, 'minutes').format('HH:m a')
	 	this.saveTime(hour)
	 
	  },

	   /*
	  * @name postpone15
	  * @description description
	  * @return {void}
	  */
	  postpone30: function() {
	  	let hour = moment().add(30, 'minutes').format('HH:m a')
	 	this.saveTime(hour)
	 
	 
	  },

	   /*
	  * @name postpone15
	  * @description description
	  * @return {void}
	  */
	  postpone60: function() {
	  	let hour = moment().add(60, 'minutes').format('HH:m a')
	 	this.saveTime(hour)
	 
	 
	  },

	 /*
	  * @name saveTime
	  * @description description
	  * @return {void}
	  */
	  saveTime: function(time) {
			WebService.post({ 'route': 'agent/updateReminderReportCall/' +this.reportId ,time : time  })
	 		Titan.app.agent.operation.typeOperation.val("AGENDADO")
	 		Titan.app.agent.operation.typeOperation.attr('disabled', 'disabled')

	 		Titan.app.agent.observation.saveObservationServer('Volver a llamar a las ' + time)
	  },

	 /*
	  * @name openTime
	  * @description description
	  * @return {void}
	  */
	  openTime: function() {
	  	
	 	this.time.trigger('focus')
	 	// this.time.trigger('click')
	  },

   	/**
	   * @name hide
	   * @description description
	   * @params data Server response
	   * @return {void} 
	   */
	   hide: function  (data) {
	      	this.getContainer().hide()
	   },


			/**
	   * @name hide
	   * @description description
	   * @params data Server response
	   * @return {void} 
	   */
	   show: function  (data) {
	      	this.getContainer().show()
	   },
	
});