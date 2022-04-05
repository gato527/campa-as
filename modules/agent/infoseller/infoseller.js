/*
 * @module  index
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */
Titan.modules.create({
	name: 'Infoseller',
	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components
		moment.locale('es')


	},


	 /**
	 * @name getPoll
	 * @description description
	 * @params data Server response
	 * @return {void} 
	 */
	getPoll: function  (clientId) {
	    WebService.post({route: 'poll/getSelectedPoll/' + clientId}).done((response) => {

	 		if (response.StatusResult == 'OK') {

	 			// debugger
	 			console.log(response)

	 			if (response.poll) {

	 				this.poll = response.poll
	 				this.pollTitle.text(response.poll.title)

	 				this.pollContainer.empty()
	 				for (var i = 0; i < response.answers.length; i++) {
	 					let answer = response.answers[i]
	 				
		      			this.loadAnswer(answer, response.poll)
		 			}

		 			if (response.answer_poll) {
		 				this['answer'+response.answer_poll.poll_answer].prop('checked', 'checked')
		 			}
	 			}

	 		} else{
	 			Titan.popup.info('faliure');
	 		}
	 	});
	},


	 /*
	  * @name onAddAnswer
	  * @description description
	  * @return {void}
	  */
	  loadAnswer: function(answer) {


		this.pollContainer.appendTitan(`
		  	 <div class="form-group">
			  	 <div class="radio">
		            <input var="answer${answer.id}" on-change="onChangeAnswer" type="radio" name="radio-name" value="${answer.id}" >
		            <label for="radio1">
		                ${answer.text}
		            </label>
		        </div>
	        </div>
	  	`)
	  	
	 	
	  },

	   /**
	   * @name onChangeAnswer
	   * @description description
	   * @params data Server response
	   * @return {void} 
	   */
	  onChangeAnswer: function  (elem, value) {


		WebService.post({ 'route': 'poll/saveAnswer/' + this.clientId + '/' + this.reportId + '/' + this.poll.id + '/' + value }).done(this.onSuccessPoll.bind(this))

	  },

	   /**
	   * @name onSuccessPoll
	   * @description description
	   * @params data Server response
	   * @return {void} 
	   */
	  onSuccessPoll: function  (data) {
	    	Titan.popup.success('La encuesta se guardo.')
	  },

	/*
	 * @name search
	 * @description get the observation of report call id past to params
	 * @return {void}
	 */
	 search: function(reportId, clientId) {
	 	this.reportId = reportId
	 	this.clientId = clientId


		this.getPoll(clientId)


	 	if (!reportId) {
	 		this.field.hide()
	 	}

	 	this.get('#isVisit button').removeClass('btn-success')

		WebService.post({ 'route': 'agent/getLastReportCall/' + this.clientId }).done(this.onSuccessReport.bind(this))

	 },


	  /**
	  * @name onSuccessReport
	  * @description description
	  * @params data Server response
	  * @return {void} 
	  */
	  onSuccessReport: function  (data) {

	  	/*
	  		
	  		causal_pqr: null
			client: "30"
			created_at: "2018-09-07 08:53:24"
			date: "2018-09-07"
			date_end: "2018-09-07"
			date_last_order: null
			date_visit: null
			hour: "08:53:24"
			hour_end: "08:55:43"
			id: "511"
			is_visit: null
			reason_visit: null
			reminder_count: "0"
			reminder_time: ""
			state: "ended"
			type: "VOLVER A LLAMAR"
			updated_at: "2018-09-07 08:55:43"
			user: "19"


	  	 */
	  	
	  		let report = data.report
			if(report){
				this.dateLastCall.text('última llamada ' + moment(report.created_at).fromNow() + '  -  ' + dateFormatter(report.created_at) )
				this.userLastCall.text('Realizada por: ' + (data.user? data.user.name : '' ))
			} else {
				swal({ title:"Información", text: "Es la primera llamada a este cliente", type: "info" });
			}

	    	this.isVisitSmall.text(report.is_visit? 'SI' : 'NO' )
	    	this.dateVisitSmall.text(dateFormatter(report.date_visit))
	    	this.typeVisitSmall.text(report.reason_visit? report.reason_visit : '')
	    	this.dateOrderSmall.text(dateFormatter(report.date_last_order))

	  },

	/**
	  * @name onChangeType
	  * @description description
	  * @params data Server response
	  * @return {void} 
	  */
	  onChangeType: function  (select, value) {
			WebService.post({ 'route': 'agent/updateValueReportCall/' + this.reportId + '/reason_visit', value: value}).done(this.onSuccessUpdate.bind(this))
	  		
	  },

	  /**
	  * @name onChangeType
	  * @description description
	  * @params data Server response
	  * @return {void} 
	  */
	  onChangeDate: function  (select, value) {
			WebService.post({ 'route': 'agent/updateValueReportCall/' + this.reportId + '/date_visit', value: value}).done(this.onSuccessUpdate.bind(this))
	  		
	  },
	
	  /**
	  * @name onChangeDateOrder
	  * @description description
	  * @params data Server response
	  * @return {void} 
	  */
	  onChangeDateOrder: function  (select, value) {
			WebService.post({ 'route': 'agent/updateValueReportCall/' + this.reportId + '/date_last_order', value: value}).done(this.onSuccessUpdate.bind(this))
	  },


	  /**
	  * @name onChangeType
	  * @description description
	  * @params data Server response
	  * @return {void} 
	  */
	  onChangeIsVisit: function  (btn) {


	  		let value = btn.attr('data-value');
	  		this.buttons.find('.btn').removeClass('btn-success')
	  		btn.addClass('btn-success')

			WebService.post({ 'route': 'agent/updateValueReportCall/' + this.reportId + '/is_visit', value: value}).done(this.onSuccessUpdate.bind(this))
	  },



	   /*
	    * @name onSuccessUpdate
	    * @description description
	    * @return {void}
	    */
	    onSuccessUpdate: function() {
	    	
	    	Titan.popup.success('La información se actualizó correctamente.')
	   
	    },

});