/*
 * @module  Reports
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */

 Titan.modules.create({
 	name : 'Reports',
	/*
	 * @constructor @description inicia los componentes del módulo
	 */
	 ready : function() {

	 	this.btn_debts_by_subsidiary = this.get('btn_debts_by_subsidiary');
	 	this.btn_tickets = this.get('btn_tickets');
	 	this.btn_box = this.get('btn_box');
	 	this.btn_excel = this.get('btn_excel');
	 	this.btn_prueba = this.get('btn_prueba');





	 },

	/*
	 * @name initEvents @description inicia los eventos de los componentes del
	 * módulo @return {void}
	 */
	 initEvents : function() {

	 	Titan.click('btn_debts_by_subsidiary', 'get_debts_by_subsidiary', this);
	 	Titan.click('btn_tickets', 'get_tickets', this);
	 	Titan.click('btn_box', 'get_box', this);
	 	Titan.click('btn_excel', 'load_abonos', this);
	 	Titan.click('btn_prueba', 'prueba', this);
	 	
		//Titan.click('btn_debts_by_subsidiary', 'get_debts_by_subsidiary', this);
	},

	/*
	 * @name clickMenu @description carga la vista usuarios @return {void}
	 */
	 get_debts_by_subsidiary : function(e) {

	 	Titan.view('workspace/reports', 'debts_by_subsidiary', 'content-admin');
	 },



	 get_tickets: function(e) {
	 	//WebService.post({route: 'import/calcular', database_name: 'dowesoft_duverneysuarez' });

	 	Titan.view('workspace/reports', 'tickets', 'content-admin');
	 },

	 load_abonos: function(e) {
	 	WebService.post({route: 'import/calcular', database_name: 'dowesoft_duverneysuarez' }).done(function(argument) {
	 		Titan.message.info('information', 'loaded file libro.xlsx');
	 	});

	 	//Titan.view('workspace/reports', 'tickets', 'content-admin');
	 },
	 get_box: function(e) {

	 	Titan.view('workspace/reports', 'box', 'content-admin');
	 },

	 prueba: function(e) {
	 	WebService.post({route: 'android/test', database_name: 'dowesoft_duverneysuarez' }).done(function(argument) {
	 		Titan.message.info('information', 'test finalize');
	 	});

	 	//Titan.view('workspace/reports', 'tickets', 'content-admin');
	 },

	});