/*
 * @module  Debts_by_subsidiary
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */

 Titan.modules.create({
 	name : 'Tickets',
	/*
	 * @constructor @description inicia los componentes del módulo
	 */
	 ready : function() {

	 	this.table = this.get('table_report');

	 	this.campo_date_init = this.get('date_init');
	 	this.campo_date_finish = this.get('date_finish');
	 	

	 	this.btn_generar = this.get('btn_generar');

	 },

	/*
	 * @name initEvents @description inicia los eventos de los componentes del
	 * módulo @return {void}
	 */
	 initEvents : function() {
	 	Titan.click('btn_generar', 'clickSelect', this);
	 },

	/*
	 * @name clickMenu @description carga la vista usuarios @return {void}
	 */
	 clickSelect : function(e) {
	 	WebService.post({ 
	 		route : 'reports/tickets', 
	 		desde: this.campo_date_init.val(),
	 		hasta: this.campo_date_finish.val()
	 	}).done(this.load_reports_response.bind(this));
	 },


	 load_reports_response : function(data) {
	 	console.log(data);

	 	var cols = [];
	 	for (i  in data.struct) {
	 		if (data.struct[i])
	 			cols.push(this.getCols(data.struct[i],i));
	 	};

	 	console.log(cols);

	 	this.table.bootstrapTable('destroy');

	 	this.table.bootstrapTable({
	 		cache: false,
	 		striped: true,
	 		showColumns: true,
	 		minimumCountColumns: 2,
	 		clickToSelect: false,
	 		columns: cols,
	 		data: (data.report || {}),
	 	});



	 },

	 getCols: function(col, index){
	 	return {
	 		field: index,
	 		title: col,
	 		align: 'center',
	 		sortable: true
	 	}
	 },

	});