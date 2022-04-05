/*
 * @module  index
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */
Titan.modules.create({
	name: 'Phones',
	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components
		
		this.service = 'savePhone'
	},

		/*
	 * @name search
	 * @description get the phone information of client id past to params
	 * @return {void}
	 */
	 search: function(clientId) {
	 	this.clientId = clientId
		this.loadPhones(clientId)
	 },

	/*
	  * @name openSave
	  * @description description
	  * @return {void}
	  */
	  openSave: function() {
		this.service = 'savePhone'
	  	this.idPhone = null
	 	this.phone.val('')
		this.observation.val('')
		this.modalPhones.modal('show')
	  }, 

	/*
	 * @name savePhone
	 * @description save the phone number in the database
	 * @return {void}
	 */
	 savePhone: function() {
	 	
		WebService.post({ 
			'route': 'agent/' + this.service,
			'phone[id]': this.idPhone,
			'phone[client]': this.clientId,
			'phone[phone]': this.phone.val(),
			'phone[observation]': this.observation.val(),
		}).done(()=>{this.loadPhones(this.clientId)});

	  	Titan.app.agent.observation.saveObservationServer(`Se agrega el teléfono ${this.phone.val()}  `)

		
	 },

	 /*
	  * @name loadPhones
	  * @description description
	  * @return {void}
	  */
	  loadPhones: function(clientId) {
		WebService.post({ 'route': 'agent/loadPhones/' + clientId }).done(this.refreshPhones.bind(this));
	  	this.phone.val('')
		this.observation.val('')
	 
	  },

	  /*
	   * @name refreshPhones
	   * @description description
	   * @return {void}
	   */
	   refreshPhones: function(data) {
	   	
	  		this.phonesList.empty()
	  		this.phonesArray = data.phones || []

	  		for (var i = 0; i < this.phonesArray.length; i++) {
	  			let phone = this.phonesArray[i]
	  			this.printPhone(phone, i)
	  		}

	  		var copy = this.get('.copy');
        	copy.on('click', copyText);


	   },


	   /*
	    * @name printPhone
	    * @description description
	    * @return {void}
	    */
	    printPhone: function(phone, index) {



	    	let html = $(`
	    	<a href="#" class="list-group-item">
		    	<h4 class="list-group-item-heading copy" title="Click para copiar">${phone.phone}</h4>

		      	<p class="list-group-item-text">${phone.observation}&nbsp</p>
		      	<span class="badge"><i on-click="onClickEdit" data-index="${index}" title="Editar"class="material-icons">edit</i></span>

		      	<div class="btn-group list-right btn-group-xs">
				  <button on-click="updateStatus" data-index="${index}" title="Llamada contestada" class="btn btn-default success"><i class="material-icons">phone_callback</i></button>
				  <button on-click="updateStatus" data-index="${index}" title="Buzón de mensajes" class="btn btn-default info"><i class="material-icons">phone_in_talk</i></button>
				  <button on-click="updateStatus" data-index="${index}" title="No contesta" class="btn btn-default warning"><i class="material-icons">phone_missed</i></button>
				  <button on-click="updateStatus" data-index="${index}" title="Fuera de servicio" class="btn btn-default danger"><i class="material-icons">sync_problem</i></button>
				</div>

		    </a>`)


	  		this.phonesList.appendTitan(html)

	  		if (phone.state) {
		  		html.find(`button[title="${phone.state}"]`).addClass('active')
	  		}
	   
	    },

	    /*
	     * @name onClickEdit
	     * @description description
	     * @return {void}
	     */
	     onClickEdit: function(elem, event, index) {

	     	let phone = this.phonesArray[index]
	  		this.idPhone = phone.id

	     	this.phone.val(phone.phone)
			this.observation.val(phone.observation)
			this.service = 'updatePhone'
			this.modalPhones.modal('show')
	    
	     },

	     /*
	      * @name updateStatus
	      * @description the phone status will update
	      * @return {void}
	      */
	      updateStatus: function(elem, event, index) {

	      	let phone = this.phonesArray[index]
	  		this.idPhone = phone.id

	  		Titan.app.agent.observation.saveObservationServer(`Se marca al teléfono ${phone.phone} (${elem.attr('title') }) `)

	      	WebService.post({ 
				'route': 'agent/updateStatus/' + this.idPhone + '/' + elem.attr('title') ,
			}).done(()=>{this.loadPhones(this.clientId)});
	     
	      },
	      

});