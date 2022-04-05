/*
 * @module  index
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */
Titan.modules.create({
	name: 'Contacts',
	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components
		
		this.service = 'saveContact'
	},

		/*
	 * @name search
	 * @description get the contact information of client id past to params
	 * @return {void}
	 */
	 search: function(clientId) {
	 	this.clientId = clientId
		this.loadContacts(clientId)
	 },

	/*
	  * @name openSave
	  * @description description
	  * @return {void}
	  */
	  openSave: function() {
		this.service = 'saveContact'
	  	this.idContact = null
	 	this.contact.val('')
		this.observation.val('')
		this.modalContacts.modal('show')
	  }, 

	/*
	 * @name saveContact
	 * @description save the contact number in the database
	 * @return {void}
	 */
	 saveContact: function() {
	 	
		WebService.post({ 
			'route': 'agent/' + this.service,
			'contact[id]': this.idContact,
			'contact[client]': this.clientId,
			'contact[contact]': this.contact.val().toName(),
			'contact[observation]': this.observation.val().toName(),
		}).done(()=>{this.loadContacts(this.clientId)});

	  	Titan.app.agent.observation.saveObservationServer(`Se agrega el contacto ${this.contact.val().toName()} de cargo ${this.observation.val().toName()}  `)

		
	 },

	 /*
	  * @name loadContacts
	  * @description description
	  * @return {void}
	  */
	  loadContacts: function(clientId) {
		WebService.post({ 'route': 'agent/loadContacts/' + clientId }).done(this.refreshContacts.bind(this));
	  	this.contact.val('')
		this.observation.val('')
	 
	  },

	  /*
	   * @name refreshContacts
	   * @description description
	   * @return {void}
	   */
	   refreshContacts: function(data) {
	   	
	  		this.contactsList.empty()
	  		this.contactsArray = data.contacts || []

	  		for (var i = 0; i < this.contactsArray.length; i++) {
	  			let contact = this.contactsArray[i]
	  			this.printContact(contact, i)
	  		}

	  		var copy = this.get('.copy');
        	copy.on('click', copyText);


	   },


	   /*
	    * @name printContact
	    * @description description
	    * @return {void}
	    */
	    printContact: function(contact, index) {



	    	let html = $(`
	    	<a href="#" class="list-group-item">
		    	<h4 class="list-group-item-heading " >${contact.contact.toName()}</h4>

		      	<p class="list-group-item-text">${contact.observation.toName()}&nbsp</p>
		      	<span class="badge"><i on-click="onClickEdit" data-index="${index}" title="Editar"class="material-icons">edit</i></span>

		      	<div class="btn-group list-right btn-group-xs">
				  <button on-click="updateStatus" data-index="${index}" title="Último contacto" class="btn btn-default danger">
				  	<i class="material-icons">account_circle</i> Contactado
				  </button>
				</div>

		    </a>`)


	  		this.contactsList.appendTitan(html)

	  		if (contact.state) {
		  		html.find(`button[title="${contact.state}"]`).addClass('active')
	  		}
	   
	    },

	    /*
	     * @name onClickEdit
	     * @description description
	     * @return {void}
	     */
	     onClickEdit: function(elem, event, index) {

	     	let contact = this.contactsArray[index]
	  		this.idContact = contact.id

	     	this.contact.val(contact.contact)
			this.observation.val(contact.observation)
			this.service = 'updateContact'
			this.modalContacts.modal('show')
	    
	     },

	     /*
	      * @name updateStatus
	      * @description the contact status will update
	      * @return {void}
	      */
	      updateStatus: function(elem, event, index) {

	      	let contact = this.contactsArray[index]
	  		this.idContact = contact.id

	  		Titan.app.agent.observation.saveObservationServer(`Se habla con el contacto ${contact.contact.toName()} (${contact.observation.toName() }) `)
	  		Titan.app.agent.observation.saveContact(contact.id)

	      	WebService.post({ 
				'route': 'agent/updateStatusContact/' + this.idContact + '/' + elem.attr('title')+ '/' + this.clientId,
			}).done(()=>{this.loadContacts(this.clientId)});
	     
	      },

});