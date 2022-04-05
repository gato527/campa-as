/*
 * @module  Select_icon
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */

 Titan.modules.create({
 	name : 'Select_icon',
	/*
	 * @constructor @description inicia los componentes del módulo
	 */
	 ready : function() {

	 	this.iconsSample = this.get('.content-icons');

	 	var icons = this.get('.icon-element');

	 	icons.on('click', this.onClickIcon.bind(this));

	 	this.search = this.get('#search');

		this.search.jFilter({
		    container: this.iconsSample,
		    findBy: '.item',
		    hide: '.item'
		 });



		// init components
		// this.btnMenu = $('#nav-toogle-menu');
		
	},

	/*
	 * @name initEvents @description inicia los eventos de los componentes del
	 * módulo @return {void}
	 */
	 onClickIcon : function(e) {
	 	var icon = $(e.target);
	 	var col = icon.attr('data-col');
	 	col = ( parseInt(col) * 125 ) + 10;
	 	var row = icon.attr('data-row');
	 	row = parseInt(row) * 18;


	 	var html = '<div class="icon-fugue" style="background-position: -'+ col+'px -'+ row+'px"></div>';

	 	this.iconsSample.html(html);

	 },

});