/*
 * @module  Debts_by_subsidiary
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */

 Titan.modules.create({
 	name : 'Box',
	/*
	 * @constructor @description inicia los componentes del módulo
	 */
	 ready : function() {

	 	this.table = this.get('table_report');

	 	this.campo_date_init = this.get('date_init');
	 	this.campo_date_finish = this.get('date_finish');
	 	

	 	this.btn_generar = this.get('btn_generar');
	 	this.btn_box_info = this.get('box-info');

	 	var now = new Date();
	 	var day = ("0" + now.getDate()).slice(-2);
	 	var month = ("0" + (now.getMonth() + 1)).slice(-2);
	 	var today = now.getFullYear()+"-"+(month)+"-"+(day) ;

	 	this.campo_date_init.val(today);
	 	this.campo_date_finish.val(today);

	 	this.clickSelect();

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
	 		route : 'reports/box_today', 
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

	 	var capital_payment  = parseFloat(data.report_box.capital_payment);
	 	var intereses  = parseFloat(data.report_box.intereses);
	 	var iva_intereses  = parseFloat(data.report_box.iva_intereses);
	 	var office_expenses  = parseFloat(data.report_box.office_expenses);
	 	var fee  = parseFloat(data.report_box.fee);
	 	var iva_fee  = parseFloat(data.report_box.iva_fee);
	 	var procredito = parseFloat(data.report_box.procredito);


	 	this.btn_box_info.html('');
	 	this.btn_box_info.append('<li>Gastos de oficina: $' +this.numberFormatter( office_expenses ) + '</li>');
	 	this.btn_box_info.append('<li>Abono a Capital: $' +this.numberFormatter( capital_payment ) + '</li>');
	 	this.btn_box_info.append('<li>Intereses de Capital: $' +this.numberFormatter( intereses ) + '</li>');
	 	this.btn_box_info.append('<li>IVA de intereses: $' +this.numberFormatter( iva_intereses ) + '</li>');
	 	this.btn_box_info.append('<li>Honorarios: $' +this.numberFormatter( fee ) + '</li>');
	 	this.btn_box_info.append('<li>IVA de Honorarios: $' +this.numberFormatter( iva_fee ) + '</li>');
	 	this.btn_box_info.append('<li>Procredito: $' +this.numberFormatter( procredito ) + '</li>');
	 	this.btn_box_info.append('<li><h3> Total: $' +this.numberFormatter(( capital_payment + intereses + iva_intereses + office_expenses + fee + iva_fee + procredito) ) + '</h3>' + '</li>');


	 },

	 numberFormatter : function (amount) {
	 	return numberFormatter(amount||0);
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