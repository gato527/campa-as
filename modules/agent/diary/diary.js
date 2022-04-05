/*
 * @module  index
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */
Titan.modules.create({
	name: 'Diary',
	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components
		//
		
		let manager = Titan.getUserData()
		this.nameUser.text('Turno: ' + (parseInt(manager.turn)+1) + '  -  ' + manager.name + '  - ' )
		

		setInterval(()=>{
			let clock = moment().format("hh:mm a")
			let seg = moment().format("ss")
			this.clock.text(clock)
			this.seconds.text(seg)

			let clockAlarm = moment().format("HH:mm a")
			if (this.reminders) {
				for (var i = 0; i < this.reminders.length; i++) {
		  			let reminder = this.reminders[i]
		  			let hour = reminder.reminder_time
		  			if (clockAlarm >= hour) {
		  				if (!this.interval && !this.isOccupied) {

			  				this.playSound()
			  			}
		  			}
		  		}
		  	}


		}, 1000)
	 
	 	this.operationsContainer.hide()

	 	this.refresh()


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
	 * @name playSound
	 * @description description
	 * @return {void}
	 */
	 playSound: function() {

	 	if(window.Audio) {
	      let audio = new Audio('dollar.wav')
	      //audio.play()

	      setTimeout(()=>{
	      	this.listReminders.find('.thumbnail').first().effect('highlight')
	      	this.listReminders.find('.thumbnail').first().effect('shake')
	      }, 800)
	      
	    }
	 	
		this.interval = setInterval(()=>{

			if(window.Audio) {
		      let audio = new Audio('dollar.wav')
		     // audio.play()

		      setTimeout(()=>{
		      	this.listReminders.find('.thumbnail').first().effect('highlight')
		      	this.listReminders.find('.thumbnail').first().effect('shake')
		      }, 800)
		      
		    }
		}, 3000)

	 },



	 /*
	  * @name refresh
	  * @description description
	  * @return {void}
	  */
	  refresh: function() {

	  	Titan.loader.show()
		WebService.post({ 'route': 'agent/getClientByDay', manager: Titan.getUser() }).done(this.onLoadClients.bind(this))
	  	
	 
	  },

	  /*
	   * @name onLoadClients
	   * @description description
	   * @return {void}
	   */
	   onLoadClients: function(data) {

	   		this.isOccupied = false

	   	

	  		let {clients} = data
			
			clients = clients.filter(client =>  client.last_atention != data.today )
			
			let clientsMonday = clients.filter(client =>  client.day.trim() == 'LUNES' )
			let clientsTuesday = clients.filter(client =>  client.day.trim() == 'MARTES' )
			let clientsWednesday = clients.filter(client =>  client.day.trim() == 'MIERCOLES' )
			let clientsThursday = clients.filter(client =>  client.day.trim() == 'JUEVES' )
			let clientsFriday = clients.filter(client =>  client.day.trim() == 'VIERNES' )
			let clientsSaturday = clients.filter(client =>  client.day.trim() == 'SABADO' )
			let clientsEmpty = clients.filter(client =>  client.day.trim() == '' )
			
			clients = []
			clients = clients.concat(clientsTuesday)
			clients = clients.concat(clientsWednesday)
			clients = clients.concat(clientsThursday)
			clients = clients.concat(clientsFriday)
			clients = clients.concat(clientsSaturday)
			clients = clients.concat(clientsMonday)
			clients = clients.concat(clientsEmpty)

	  		 let efectivosArray = []
	  		// let noEfectivosArray = []

	  		let temp = {
		  		"PEDIDO" : [],
				"PEDIDO PQR" : [],
				"PQR" : [],
				"VOLVER A LLAMAR" : [],
				"" : [],
				"PEDIDO CON VENDEDOR" : [],
				"COMPRA OTRA MARCA" : [],
				"NUMERO EQUIVOCADO" : [],
				"NO CONTESTA" : [],
				"VENDIO NEGOCIO" : [],
				"CLIENTE BLOQUEADO": [],
				"NO DA INFORMACION": [],
	  		}


	  		for (var i = 0; i < clients.length; i++) {
	  			let client = clients[i]

		  		if (!temp[client.causal.trim()]) {
		  			temp[client.causal.trim()] = []
		  		}

		  		temp[client.causal.trim()].push(client)

				let favorite = client.causal.trim() == "PEDIDO"  || client.causal.trim() == "PEDIDO PQR"  || client.causal.trim() == "PQR"  || client.causal.trim() == "VOLVER A LLAMAR"  ||  client.causal.trim() == "PEDIDO CON VENDEDOR"  || client.causal.trim() == "COMPRA OTRA MARCA" ? true : false
				if (favorite) {
					efectivosArray.push(0)
				}
				
	  		}

	  		let clientsNews = {}

	  		this.listClients.empty()
	  		let printClientsArray = (containerId, key)=>{

	  			let containerHtml = `<div class="panel panel-default">
			      <div class="panel-heading"><span class="badge" var="${containerId}Count"></span> ${key ? key: 'Sin causal'}</div>
			      <div class="panel-body" var="${containerId}"></div>
			    </div>`

			    this.listClients.appendTitan(containerHtml)

	  			this[containerId].empty()

		  		for (var i = 0; i < temp[key].length; i++) {
		  			let client = temp[key][i]

		  			clientsNews[client.id] = client

		  			let html = this.printClient(client, i)

					this[containerId].appendTitan(html)
		  		}

				this[containerId+ 'Count'].text(temp[key].length)
	  		}

	  		printClientsArray('listClientsPedido','PEDIDO');
	  		printClientsArray('listClientsPedidoPqr','PEDIDO PQR');
	  		printClientsArray('listClientsPqr','PQR')
	  		printClientsArray('listClientsVolver','VOLVER A LLAMAR')
	  		printClientsArray('listClientsWithout','')
	  		// printClientsArray('listClientsSeller','PEDIDO CON VENDEDOR')
	  		// printClientsArray('listClientsOther','COMPRA OTRA MARCA')
	  		// printClientsArray('listClientsNumber','NUMERO EQUIVOCADO')
	  		// printClientsArray('listClientsContesta','NO CONTESTA')
	  		// printClientsArray('listClientsBussiness','VENDIO NEGOCIO')
	  		// printClientsArray('listClientsLocked','CLIENTE BLOQUEADO')
	  		// printClientsArray('listClientsNoInformation','NO DA INFORMACION')

		  
	  		this.clients = clientsNews


	  		this.efectivos.text(efectivosArray.length)


	  		this.total.text(clients.length)


	  		for (var i = 0; i < clients.length; i++) {
	  			let client = clients[i]

	  			this.printClient(client, i)
	  		}

	  		this.search.jFilter({
			    container: this.listClients,
			    findBy: '.thumbnail',
			    hide: '.thumbnail',
			    minsize: 2,
			});

			if(data.clients.length == 0) {
				html = `<h4>No se asignaron clientes para este usuario</h4>`
				this.viewMessage.append(html)
			}

	  		this.reminders = data.reminders || []
			
	  		this.listReminders.empty()
	  		for (var i = 0; i < this.reminders.length; i++) {
	  			let reminder = this.reminders[i]
	  			if (typeof reminder.client != 'string' ) {
	  			this.printReminder(reminder.client, i, reminder)
	  		};
	  		}
			
			this.searchPending.jFilter({
			    container: this.listReminders,
			    findBy: '.thumbnail',
			    hide: '.thumbnail',
			    minsize: 2,
			});


			celuweb({type: 'reset'}) 
		
	  		Titan.loader.hide()

	  		this.search.trigger('keyup')
	  		this.searchPending.trigger('keyup')


	   },

	   /*
	    * @name printClient
	    * @description description
	    * @return {void}
	    */
	    printClient: function(client, index) {
	    		
			let favorite = client.causal.trim() == "PEDIDO"  || client.causal.trim() == "PEDIDO PQR"  || client.causal.trim() == "PQR"  || client.causal.trim() == "VOLVER A LLAMAR"  ||  client.causal.trim() == "PEDIDO CON VENDEDOR"  || client.causal.trim() == "COMPRA OTRA MARCA" ? '<span class="glyphicon glyphicon-star star" aria-hidden="true"></span>' : ''   		
	    	let html = $(`
	    		<div class="col-md-12 thumbnail">      
				      <!-- column 1 -->
				      <div class="col-md-4" title="Cliente efectivo">
						<p>${client.client_code}</p>
				      	${favorite}
						<p>${client.day}</p>
				      </div>
				      
				      <!-- column 2 -->
				      <div class="col-md-6">
						<p>${client.name.toName()}</p>
						<label>${client.city}</label>
						<div class="none">${client.business_name}</div>
						<p>${client.causal}</p>

				      </div>
				      
				      <!-- column 3 -->      
				      <a class="btn btn-success col-md-2" href="#" on-click="onClickInit" data-index="${client.id}" >Iniciar</a>
				</div>

	    	`)

	    	return html
	  		//this.listClients.appendTitan(html)

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
						<p>${client.causal}</p>

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

	    /*
	     * @name onClickRemainder
	     * @description description
	     * @return {void}
	     */
	     onClickRemainder: function(elem, event , index) {
	   			this.isOccupied = true
	   			clearInterval(this.interval)
	   			this.interval = null
	     		

	     		let report = this.reminders[index]

	     		let reportId = report.id 
		      	let clientId = report.client.id 
				this.clientData = report.client

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


	 		
	      },


	      /*
	       * @name onFinishedSession
	       * @description description
	       * @return {void}
	       */
	       onFinishedSession: function(typeOperation, pqrOperation) {
				WebService.post({ 'route': 'agent/finishReportCall/' + this.reportId + '/' + this.clientId + '/' + typeOperation + '/' + pqrOperation  }).done(this.onFinishedReport.bind(this))
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