/*
 * @module  Debts_by_subsidiary
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */

 Titan.modules.create({
 	name : 'Debts_by_subsidiary',
	/*
	 * @constructor @description inicia los componentes del módulo
	 */
	 ready : function() {

	 	this.select_company = this.get('select_company');
	 	this.table = this.get('table_report');
	 	this.loader = this.get('loading-container');
	 	this.loader.hide();

	 	WebService.post({ route : 'reports/company'}).done(this.loadCompany_response.bind(this));

		// init components
	//	this.btnMenu = $('#nav-toogle-menu');
},

	/*
	 * @name initEvents @description inicia los eventos de los componentes del
	 * módulo @return {void}
	 */
	 initEvents : function() {
	//	Titan.click('btnMenu', 'loadMenu', this);
	this.select_company.on('change', this.clickSelect.bind(this));
},

	/*
	 * @name clickMenu @description carga la vista usuarios @return {void}
	 */
	 clickSelect : function(e) {
	 	this.loader.show();

	 	WebService.post({ route : 'reports/debts_by_company_amount', company: this.select_company.val()}).done(this.load_reports_response.bind(this));
	 },

	 loadCompany_response : function(data) {
	 	console.log(data);
	 	this.select_company.html('<option value="-1"> -- Seleccione el cliente --</option>');

	 	for (var i = 0; i < data.company.length; i++) {
	 		this.select_company.append('<option value="' + data.company[i].id + '">' + data.company[i].name + '</option>')
	 	}
	 },

	 load_reports_response : function(data) {

	 	this.loader.hide();

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