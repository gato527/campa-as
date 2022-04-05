/*
 * @module  Perfil
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */

 Titan.modules.create({
 	name : 'Cmd',
	/*
	 * @constructor @description inicia los componentes del módulo
	 */
	 ready : function() {

		// init components
		// this.btnMenu = $('#nav-toogle-menu');
		// 
		this.display = this.get('#display-console');
		this.btnExec = this.get('#btn-exec');
		this.inputCommand = this.get('#input-command');

		
		
	},

	/*
	 * @name initEvents @description inicia los eventos de los componentes del
	 * módulo @return {void}
	 */
	 initEvents : function() {
	 	this.btnExec.on('click', this.onClickExecCommand.bind(this));
	 	// Titan.keypress('inputCommand', 'onKeyPress', this);
	 },

	 /*
	  * @name onClickExecCommand
	  * @description describe la function
	  * @params data, respuesta del servidor
	  * @return {void}
	  */
	 onClickExecCommand: function () {
	 	var command = this.inputCommand.val();
	 	this.showClient(command);
	 	this.inputCommand.val('');

	 	WebService.cmd({ route : 'cmd/exec', command: command}).done(this.onExecutedComand.bind(this));
	  	
	 },

	  onKeyPress: function (e) {

	 	var tecla = (document.all) ? e.keyCode : e.which;
	 	if (tecla==13){

	 		this.onClickExecCommand();
	 	}

	 },	

	 /*
	  * @name onExecutedComand
	  * @description describe la function
	  * @params data, respuesta del servidor
	  * @return {void}
	  */
	 onExecutedComand: function ( data ) {

	 	data = data.replace(/</gmi, '&lt;' );
	 	data = data.replace(/>/gmi, '&gt;' );
	 	data = data.replace(/\n/gmi, '</br>' );
	 	this.showServer(data);
	 	
	  	
	 },
	 	

	 	


	 /*
	  * @name show
	  * @description describe la function
	  * @params data, respuesta del servidor
	  * @return {void}
	  */
	 showClient: function ( msj ) {
	 	
	  	this.display.append('$home >> '+msj +'</br>');
	 },
	 	
	 /*
	  * @name show
	  * @description describe la function
	  * @params data, respuesta del servidor
	  * @return {void}
	  */
	 showServer: function ( msj ) {
	 	
	  	this.display.append('$server >> '+ msj +'</br>');
	 },

});