/*
 * @module  index
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */
Titan.modules.create({
	name: 'Find',
	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components
		//
		

	 	this.operationsContainer.hide()


	 	Titan.loadView({
			module: 'agent',
			view: 'operation',
			container: this.operationsContainer,
			params: {
				onFinishedSession: this.onFinishedSession.bind(this),
				onCancelSession: this.onCancelSession.bind(this),
			},
		})

	},




	 /*
	  * @name refresh
	  * @description description
	  * @return {void}
	  */
	  refresh: function() {

	  	Titan.loader.show()
		WebService.post({ 
			'route': 'agent/findClient', 
			field: this.field.val(),
			code: this.code.val(),
			}).done(this.onLoadClients.bind(this))
	  	
	 
	  },

	  /*
	   * @name onLoadClients
	   * @description description
	   * @return {void}
	   */
	   onLoadClients: function(data) {

	   		this.isOccupied = false

	   	
			this.listClients.empty()

	  		let clients = data.clients || []

	  		for (var i = 0; i < clients.length; i++) {
	  			let client = clients[i]

	  			this.printClient(client, i)
	  		}

	  		this.clients = clients || []
	  		
	  		this.viewMessage.html('')
			if(this.clients.length == 0) {
				html = `<h3>No se encontraron resultados</h3>`
				this.viewMessage.append(html)
			}

	  		Titan.loader.hide()

			celuweb({type: 'reset'})

	   },

	   /*
	    * @name printClient
	    * @description description
	    * @return {void}
	    */
	    printClient: function(client, index) {
	    		
			
	   		
	    	let html = $(`
	    		<div class="col-md-12 thumbnail"> 
	    			<br>

				      <!-- column 1 -->
				      <div class="col-md-2 star" title="Cliente efectivo">
				      	${client.state == 'EFECTIVO'? '<span class="glyphicon glyphicon-star" aria-hidden="true"></span>' : ''}
				      </div>
				      
				      <!-- column 2 -->
				      <div class="col-md-7">
						<p>${client.name.toName()}</p>
						<p>${client.day}</p>
						<label>${client.city}</label>
						<div class="none">${client.business_name}</div>
						<p>${client.client_code}</p>
						<p>${client.causal}</p>

				      </div>
				      
				      <!-- column 3 -->      
				       <div class="col-md-3">
				      
				     	 <a class="btn btn-block btn-danger" href="#" on-click="onClickInit" data-index="${index}" >Iniciar</a>
				        	<br>
				        	<br>
				        	<br>
				      	<a class="btn btn-block btn-success" href="#" on-click="onClickFind" data-index="${index}" >Consultar</a>
				        	<br>
				        	<br>
				      </div>
				</div>

	    	`)


	  		this.listClients.appendTitan(html)

	    },

	    

	    /*
	    * @name printReminder
	    * @description description
	    * @return {void}
	    */
	    printReminder: function(client, index, callReport) {
	    		

	   		
	    	let html = $(`
	    		<div class="col-md-12 thumbnail">      
				      <!-- column 1 -->
				      <div class="col-md-2 star" title="Cliente efectivo">
				      	${client.state == 'EFECTIVO'? '<span class="glyphicon glyphicon-star" aria-hidden="true"></span>' : ''}
				      </div>
				      
				      <!-- column 2 -->
				      <div class="col-md-8">
						<p>${client.name.toName()}</p>
						<div class="none">${client.business_name}</div>
						<p>${client.client_code}</p>
						<p>${client.day}</p>
				        <label>${client.city}</label>
				        <br>
				        	<br>
				        <label>${moment(callReport.reminder_time, 'HH:mm a').format("hh:mm a")}</label>
				       <br>
				        <p>Esta alarma ha sido programada ${callReport.reminder_count} ve${callReport.reminder_count==1? 'z': 'ces'}</p>

				      </div>
				      
				      <!-- column 3 -->      
				      <a class="btn btn-success col-md-2" href="#" on-click="onClickRemainder" data-index="${index}" >Iniciar</a>
				</div>

	    	`)


	  		this.listReminders.appendTitan(html)

	    },

	   /**
	     * @name onClickFind
	     * @description description
	     * @params data Server response
	     * @return {void} 
	     */
	     onClickFind: function  (elem, event, index) {

	     	this.isOccupied = true
	   		clearInterval(this.interval)
	   		this.interval = null

	     	let client = this.clients[index]
	  		this.client = client.id
	  		this.clientData = client

			//WebService.post({ 'route': 'agent/createReportCall/' + client.id, user: Titan.getUser() }).done(this.onCreatedReport.bind(this))

			this.onCreatedReport(null)

	        
	     },


	     /*
	     * @name onClickInit
	     * @description description
	     * @return {void}
	     */
	     onClickInit: function(elem, event, index) {

	   		this.isOccupied = true
	   		clearInterval(this.interval)
	   		this.interval = null

	     	let client = this.clients[index]
	  		this.client = client.id
	  		this.clientData = client

			WebService.post({ 'route': 'agent/createReportCall/' + client.id, user: Titan.getUser() }).done(this.onCreatedReport.bind(this))


	    
	     },


	     /*
	      * @name onCreatedReport
	      * @description description
	      * @return {void}
	      */
	      onCreatedReport: function(data) {

	      		if (data) {
		      		// gestion
			      	let reportId = data.report.id 
			      	let clientId = data.report.client 

			      	this.reportId = reportId
			      	this.clientId = clientId

			      	celuweb({id: this.clientData.client_code, type: "client"})


			      	let views = Titan.app.agent

			      	views.clientinformation.search(clientId)
			      	views.phones.search(clientId)
		      		views.contacts.search(clientId)
					views.observation.search(reportId , clientId)
					Titan.app.listprice.products.init(reportId , clientId, this.clientData)
					views.history_products.init(clientId)
					views.postponecall.search(reportId , clientId)
					views.infoseller.search(reportId , clientId)
			 		
			 		this.operationsContainer.show()
					Titan.app.agent.operation.getContainer().find('.navbar').show()
					views.postponecall.show()
					
				} else {
					// consulta
					
					let reportId = null
			      	let clientId = this.client

			      	this.reportId = reportId
			      	this.clientId = this.client

			      	// celuweb({id: this.clientData.client_code, type: "client"})


			      	let views = Titan.app.agent

			      	views.clientinformation.search(clientId)
			      	views.phones.search(clientId)
		      		views.contacts.search(clientId)
					views.observation.search(reportId , clientId)
					Titan.app.listprice.products.init(reportId , clientId, this.clientData)
					views.history_products.init(clientId)
					views.postponecall.hide()
					views.infoseller.search(reportId , clientId)
			 		
			 		this.operationsContainer.show()
					Titan.app.agent.operation.getContainer().find('.navbar').hide()
				}
	 		
	      },


	      /*
	       * @name onFinishedSession
	       * @description description
	       * @return {void}
	       */
	       onFinishedSession: function(typeOperation, typeOperationPQR) {
				WebService.post({ 'route': 'agent/finishReportCall/' + this.reportId + '/' + this.clientId + '/' + typeOperation   + '/' + typeOperationPQR}).done(this.onFinishedReport.bind(this))
	       },


	       	/*
	       * @name onCancelSession
	       * @description description
	       * @return {void}
	       */
	       onCancelSession: function(typeOperation) {
				WebService.post({ 'route': 'agent/onCancelSession/' + this.reportId  }).done(this.onFinishedReport.bind(this))
	      		
	       },

	       /*
	        * @name onFinishedReport
	        * @description description
	        * @return {void}
	        */
	        onFinishedReport: function(data) {
	      		Titan.app.agent.operation.typeOperation.val("-Seleccione tipo de llamada-")
	        	
	 			this.operationsContainer.hide()
	 			this.refresh()

	        },
});