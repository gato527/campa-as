/*
 * @module  index
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */
Titan.modules.create({
	name: 'Find_sap',
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
			'route': 'agent/findClientSap', 
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

			// celuweb({type: 'reset'})

	   },

	   /*
	    * @name printClient
	    * @description description
	    * @return {void}
	    */
	    printClient: function(client, index) {


			/*

			actividad: null
			agencia: "Z109"
			bloqueado: null
			canal: "15 "
			ciudad: "41001                         "
			clasecliente: "91 "
			clientecunit: "0000236282"
			clientesuizo: "1060    "
			clientezenu: "41001   "
			codigo: "0001087779 "
			codigoamarre: "V010           "
			codlista: "Z10915ZTP0"
			codpadre: "0001087779 "
			created_at: "2021-05-19 01:00:50"
			cumpleanos: null
			cupo: "ZTYP           "
			cupoclte: null
			cupousado: null
			direccion: "CR 1   31 27                            "
			email: null
			factor: "600   "
			fechaingreso: null
			ica: null
			id: "14977"
			latitud: "-75.297347"
			linea: "ZG "
			longitud: "2.946196"
			marcacliente: "01   "
			nit: "55157556          "
			nombre: "ZUÑIGA MOSQUERA DUPERLY                           "
			ordencompra: null
			padrest: "000"
			perica: null
			plazo: "   "
			razonsocial: "FORTACHIRAS                                       "
			retencion: null
			ruta_parada: "VI45                                    "
			subcanal: "93 "
			sustituto: null
			telefono: "3506766022      "
			territorio: "000"
			tipocliente: "1"
			tipocredito: null
			tipodoc: null
			unidadmedida: null
			updated_at: "2021-05-19 01:00:50"
			vendedor: "00000000"

			 */
	    		
			
	   		
	    	let html = $(`
	    		<div class="col-md-12 thumbnail"> 
	    			<br>

				      <!-- column 1 -->
				      <div class="col-md-12">
						<p> <b>Nombre:</b> ${client.nombre.toName()}</p>
						<p><b>Código SAP:</b> ${client.codigo}</p>
						<p><b>Direccion:</b> ${client.direccion}</p>
						<label><b>Nit:</b> ${client.nit}</label>
						<div><b>Nombre Negocio:</b> ${client.razonsocial}</div>
						<p><b>Canal:</b> ${client.canal}</p>

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

			      	// celuweb({id: this.clientData.client_code, type: "client"})


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

			      	celuweb({id: this.clientData.client_code, type: "client"})


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