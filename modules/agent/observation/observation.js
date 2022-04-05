/*
 * @module  index
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */
Titan.modules.create({
	name: 'Observation',
	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components
		Titan.loadView({
			module: 'agent',
			view: 'contacts',
			container: this.contanerContacts,
		})
	},

	/*
	 * @name search
	 * @description get the observation of report call id past to params
	 * @return {void}
	 */
	 search: function(reportId, clientId) {
	 	this.reportId = reportId
	 	this.clientId = clientId

	 	this.loadObservations()

	 	
	 	if (!reportId) {
	 		this.field.hide()
	 	}
	 },

	 /*
	 * @name saveObservation
	 * @description save the observation in the database
	 * @return {void}
	 */
	 saveObservation: function() {
	 	
		
		this.saveObservationServer(this.detail.val())
	 },


	  /**
	  * @name saveContact
	  * @description description
	  * @params data Server response
	  * @return {void} 
	  */
	 saveContact: function  (contactId) {
	     WebService.post({ 
			'route': 'agent/saveContactCallReport/'+ this.reportId +'/'+contactId
		})
	 },

	 /*
	  * @name saveObservationServer
	  * @description description
	  * @return {void}
	  */
	  saveObservationServer: function(detail) {
	  	WebService.post({ 
			'route': 'agent/saveObservation',
			'observation[detail]': detail,
			'observation[call_report]': this.reportId,
			'observation[client]': this.clientId,
			'observation[user]': Titan.getUser(),
		}).done(this.loadObservations.bind(this));
	 
	  },



	 /*
	  * @name loadObservations
	  * @description description
	  * @return {void}
	  */
	  loadObservations: function() {
		WebService.post({ 'route': 'agent/loadObservations/' + this.clientId }).done(this.refresh.bind(this));
	 	this.detail.val('')
	  },

	  /*
	   * @name refresh
	   * @description description
	   * @return {void}
	   */
	   refresh: function(data) {
	   	
	  		this.observationsList.empty()
	  		this.observationsArray = data.observations

	  		data.observations = data.observations || []

	  		for (var i = 0; i < data.observations.length; i++) {
	  			let observation = data.observations[i]
	  			this.printObservation(observation, i)
	  		}

        	this.previus.animate({ scrollTop: 0 }, "slow")




	   },


	   /*
	    * @name printobservation
	    * @description description
	    * @return {void}
	    */
	    printObservation: function(observation, index) {

	    	let html = $(`
	    	<div class="row observation" >
                    <div class="col-md-2">
                        <i class="material-icons photo">account_circle</i>
                        <p class="observation-name">${observation.user.name}</p>
                    </div>
                    <div class="col-md-10">
	                    <div class="bubble">
	                        <div class="observation-date">${dateFormatter(observation.date)}</div>
	                        <p>
	                        	${observation.detail}
	                        </p>
	                        <div class="observation-date-ago">${moment(observation.created_at).fromNow()}</div>

	                    </div>
                    </div>


                </div>`)

	  		this.observationsList.appendTitan(html)
	   
	    },


	

});