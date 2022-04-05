/*
 * @module  Config_deudores
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */
 Titan.modules.create({
 	name: 'Config_deudores',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	 ready: function () {

	 	this.containerUsers = this.get('container-users');
	 	this.containerSubsidiarys = this.get('container-subsidiarys');


	 	WebService.post({ 'route': 'asignacion_cartera/getAllSubsidiary' })
	 	.done( this.loadSubsidiary.bind(this) );



	 },

	 initEvents: function () {	
	 	//Titan.click('btn_guardar', 'save', this); 	
	 },


	 /*
	  * @name loadSubsidiary
	  * @description describe la function
	  * @params data, respuesta del servidor
	  * @return {void}
	  */
	  loadSubsidiary: function ( data ) {
	  	if(data.StatusResult){
	  		if (data.StatusResult == "FALIURE") {
	  			Titan.popup.info('no hay cambios que guardar');

	  			
	  		}
	  		else{
	  			var users = data.users;

	  			for (var i = 0; i < users.length; i++) {
	  				var user = users[i];
	  				this.printUser(user);
	  				
	  			}

	  			var subsidiarys = data.subsidiarys;
	  			var counts = data.count;

	  			

	  			for (var i = 0; i < subsidiarys.length; i++) {
	  				var subsidiary = subsidiarys[i];
	  				subsidiary.count = counts[subsidiary.id];
	  				if (!subsidiary.count) {
	  					subsidiary.count= 0;
	  				}
	  				this.printSubsidiary(subsidiary);
	  				
	  			}

	  			this.updateCounts();

	  			$( ".drag" ).sortable({
	  				connectWith: ".drag",
	  				handle: ".portlet-header",
	  				cancel: ".portlet-toggle",
	  				placeholder: "portlet-placeholder ui-corner-all",
	  				cursor: "move",
	  				stop: this.onStopPorlet.bind(this)
	  			});

	  			
	  			$( ".portlet" )
	  			.addClass( "ui-widget ui-widget-content ui-helper-clearfix" )
	  			.find( ".portlet-header" )
	  			.prepend( "<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");
	  			
	  			$( ".portlet-toggle" ).click(this.onClickPorlet);
	  			$( ".portlet-toggle" ).click();
	  		}
	  	}else{
	  		Titan.popup.danger('Error al guardar los datos');
	  	}
	  	
	  },

	  /*
	   * @name updateCounts
	   * @description actualiza todos los contadores de la app
	   * @return {void}
	   */
	   updateCounts: function () {
	   	var contUsrs = this.containerUsers.find('.panel-default');
	   	for (var i = 0; i < contUsrs.length; i++) {
	   		var spanMain = $(contUsrs[i]).find('span.badge').first();
	   		var pBody = $(contUsrs[i]).find('.panel-body');

	   		var counters = pBody.find('span.badge');
	   		// console.log(counters);
	   		var aux = 0;
	   		for (var j = 0; j < counters.length; j++) {
	   			var tex = $(counters[j]).text();
	   			console.log(tex);
	   			aux += parseInt(tex);
	   		}

	   		spanMain.text(aux);
	   	}
	   },


	  /*
	   * @name onStopPorlet
	   * @description describe la function
	   * @params data, respuesta del servidor
	   * @return {void}
	   */
	   onStopPorlet: function (  event, ui  ) {
	   	var el = ui.item;
	   	var containerU = el.parent().parent();
	   	var user = containerU.attr('data-user');
	   	var count = containerU.find('span');
	   	var subsidiary = el.attr('data-subsidiary');
	   	
	   	WebService.post({ 
	   		'route': 'asignacion_cartera/updateSubsidiary',
	   		'user': user,
	   		'subsidiary': subsidiary
	   	})
	   	.done( this.onUpdateSubsidiary.bind(this) );

	   	
	   },

	   /*
	    * @name onUpdateSubsidiary
	    * @description describe la function
	    * @params data, respuesta del servidor
	    * @return {void}
	    */
	    onUpdateSubsidiary: function ( data ) {
	    	this.updateCounts();
	    	
	    },



	  /*
	   * @name onClickPorlet
	   * @description describe la function
	   * @return {void}
	   */
	   onClickPorlet: function (params) {
	   	var icon = $( this );
	   	icon.toggleClass( "ui-icon-minusthick ui-icon-plusthick" );
	   	icon.closest( ".portlet" ).find( ".portlet-content" ).toggle();
	   	
	   },


	  /*
	   * @name printUser
	   * @description pinta el panel para un cobrador
	   * @params user, informacion del deudor a pintar
	   * @return {void}
	   */
	   printUser: function ( user ) {

	   	var html = '<div data-user="'+user.id+'" class="column panel panel-default heigth-midle">'+
	   	'<div class="panel-heading"><span class="badge">0</span>' + user.name.toName()+ '</div>'+
	   	'<div class="panel-body drag">'+
	   	'</div>'+
	   	'</div>';

	   	this.containerUsers.append(html)
	   },

	   /*
	   * @name printSubsidiary
	   * @description pinta el panel para un cobrador
	   * @params user, informacion del deudor a pintar
	   * @return {void}
	   */
	   printSubsidiary: function ( subsidiary ) {

	   	var html = '<div data-subsidiary="'+subsidiary.id+'" class="portlet">'+
	   	'<div class="portlet-header"><span class="badge">' +subsidiary.count+'</span> &nbsp&nbsp'+ subsidiary.name.toName()+'</div>'+
	   	'<div class="portlet-content">'+subsidiary.company.name.toName()+'</div>'+
	   	'</div>';
	   	
	   	if (subsidiary.user=="0") {
	   		this.containerSubsidiarys.append(html);
	   	} else {

	   		this.main_container.find('[data-user="'+subsidiary.user.id+'"] .panel-body').append(html);
	   	}

	   },

	});