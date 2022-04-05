/*
 * @module  InfoDebtor
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */
 Titan.modules.create({

 	name: 'Sms',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	 ready: function () {

		//init components
		

		this.phones.tagsInput({
			'defaultText':'Agregar',
			'width':'100%',
			'height':'80px',
			'minChars' : 10,
   			'maxChars' : 10, 
		})

		this.get("#phones_tag").on('paste',(e)=>{
		    var element=e.target;
		    setTimeout( () =>{
		        var text = $(element).val();
		        var target= this.phones
		        var tags = (text).split(/[ ,]+/);
		        for (var i = 0, z = tags.length; i<z; i++) {
		              var tag = $.trim(tags[i]);
		              if (!target.tagExist(tag)) {
		                    target.addTag(tag);
		              }
		              else
		              {
		                  this.get("#tagsinput_tag").val('');
		              }
		         }
		    }, 0);
		});
	 	
		this.search.jFilter({
			container: '#templateList',
			findBy: '.list-group-item',
			hide: '.list-group-item',
			message: 'No hay resultados ...', // opcional,
			highlight: true

		});

		this.loadTemplates()
	},

	/*
	 * @name initEvents
	 * @description inicia los eventos de los componentes del módulo
	 * @return {void}
	 */
	 initEvents: function () {
	 },


	 /*
	  * @name onChangeSms
	  * @description description
	  * @return {void}
	  */
	  onChangeSms: function(elem, val, event) {
	  	
	  	this.count.text(450 - val.length)

	  	let prop = val.length > 0 ? 'removeProp' : 'prop'
	  	this.save[prop]('disabled', true)
	  	this.send[prop]('disabled', true)

	 
	  },


	  /*
	   * @name saveTemplate
	   * @description description
	   * @return {void}
	   */
	   saveTemplate: function() {
	   	
	   		let user = Titan.getUser()
	   		let nameSms = this.nameSms.val();
	   		let textSms = this.textSms.val();
	   		let size = textSms.length

	   		if (nameSms=='') {
	   			toast('Nombre inválido.')
	   			return
	   		}

	   		WebService.post({
		 		route: 'sms/saveTemplate/'+ nameSms + '/'+ size + '/'+ user ,
		 		textSms: textSms,
		 	}).done(this.onSavedTemplate.bind(this));

	  
	   },


	   /*
	    * @name onSavedTemplate
	    * @description description
	    * @return {void}
	    */
	    onSavedTemplate: function() {

	    	this.nameSms.val('');
	   		this.textSms.val('');
	   			toast('Plantilla guardada.')

	   		this.createTemplate.modal('hide')
	    	
	    	this.loadTemplates()
	   
	    },

	    /*
	     * @name loadTemplates
	     * @description description
	     * @return {void}
	     */
	     loadTemplates: function() {
	     	WebService.post({
		 		route: 'sms/loadTemplates'
		 	}).done(this.onloadedTemplate.bind(this));
	    
	     },


	     /*
	      * @name onloadedTemplate
	      * @description description
	      * @return {void}
	      */
	      onloadedTemplate: function(data) {
		       this.templateList.empty()

		      let {templates} = data

		      for (var i = 0; i < templates.length; i++) {
		      	this.printTemplate(templates[i])
		      }
	      	
	      },

	      /*
	       * @name printTemplate
	       * @description description
	       * @return {void}
	       */
	       printTemplate: function(template) {


	       	this.templateList.appendTitan(`
	       		<a href="#" class="list-group-item list-group-item-action" on-click="clickTemplate" data-dismiss="modal">
		   			<h4>${template.name}</h4>
		   			<p>${template.textsms}</p>
		   			<span>Tamaño ${template.size} Caractéres</span>
		   			<h5 class="badge">${Math.ceil(template.size/450)} SMS</h5>
		   		</a>
	       	`)
	      
	       },


	       /*
	        * @name clickTemplate
	        * @description description
	        * @return {void}
	        */
	        clickTemplate: function(elem) {
	        	
	       		let text = elem.find('p').first().text()
	       		this.textSms.val(text)
	       		this.textSms.trigger('change')
	        },


	      /*
	       * @name sendText
	       * @description description
	       * @return {void}
	       */
	       sendText: function() {
		       	let user = Titan.getUser()
		   		let textSms = this.textSms.val();
		   		let phones = this.phones.val();
		   		let size = textSms.length

		   		

		   		if (phones=='') {
		   			toast('Numeros inválidos.')
		   			return
		   		}


		   		phones = phones.split(',').map((elem) => {
		   			return 57 + '' + elem;
		   		})

		   		phones = phones.join(',')

		   		textSms = textSms.substring(0,450)

		   		WebService.post({
			 		route: 'sms/send/'+ phones + '/'+ size + '/'+ user,
		 			textSms: textSms,

			 	}).done(this.onSentSms.bind(this));
	      
	       },

	       /*
	        * @name onSentSms
	        * @description description
	        * @return {void}
	        */
	        onSentSms: function(data) {

	        	if (data.resultado.sms[1].resultado == '1') {
	        		Titan.message.info('Atención!',  data.resultado.sms[1].resultado_t )
	        	} else {
	        		toast(data.message)
	        		this.textSms.val('');
		   			this.phones.val('');
	        	}

	        },


});