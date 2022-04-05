/*
 * @module  Debts_by_subsidiary
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */

 Titan.modules.create({
 	name : 'Reportdiary',
	/*
	 * @constructor @description inicia los componentes del módulo
	 */
	 ready : function() {


	   
	 	WebService.post({ 
	 		route : 'reports/getFilters', 
	 	}).done(this.onFilters.bind(this));
	 },


	 /*
	  * @name onFilters
	  * @description description
	  * @return {void}
	  */
	  onFilters: function(data) {

	  	let {causales , cities } = data

	  	causales.map((client)=> {
	  		this.causalesValues.append(`<option value="${client.causal}">${client.causal}</option>`)
	  	})

	  	cities = cities.map((client)=> {
	  		this.citiesValues.append(`<option value="${client.city}">${client.city}</option>`)
	  	})

	  	this.cities.fSelect({placeholder: 'Seleciona las ciudades'})
	  	this.causales.fSelect({placeholder: 'Seleciona las causales'})

	  	




	 
	  },


	 /*
	  * @name dataReport
	  * @description description
	  * @return {void}
	  */
	  dataReport: function(elem, reportDay) {

		 if (this.dayReport.val() && this.dayReportEnd.val()) {

		 	let cities = this.cities.val()
	  		let causales = this.causales.val()

	  		if (causales) {
	  			causales = "and cr.type IN ('" + causales.join("', '") + "')"
	  		} else {
	  			causales = ''
	  		}

	  		if (cities) {
	  			cities = "and cl.city IN ('" + cities.join("', '") + "')"
	  		} else {
	  			cities = ''
	  		}


	  		Titan.loader.show()
	  		this.wait.show()

		 	WebService.post({ 
		 		route : 'reports/diaryDay/'+ this.dayReport.val() +'/'+ this.dayReportEnd.val(), 
		 		cities: cities,
		 		causales: causales,
		 	}).done(this.load_reports_response.bind(this)).fail(()=>{
		 		Titan.loader.hide()
	  			this.wait.hide()

		 		alert('Error al consultar la información')
		 	})
		 }
	  },

	 load_reports_response : function(data) {
	 	console.log(data);
		Titan.loader.hide()
	  	this.wait.hide()

	 	var cols = [];


	 	for (i  in data.struct) {
	 		if (data.struct[i]){
	 			cols.push(this.getCols(data.struct[i],i));
	 		}
	 	};

	 	cols.push(this.getCols('Contacto','contact'));
	 	cols.push(this.getCols('Cargo', 'cargo'));


	 	this.tableReport.bootstrapTable('destroy');

	 	let reports = data.report || {}



	 	// var h = this.tablaResponsive.css('height');
   //      if (h == '100%') {
   //          h = '520';
   //      }
   //      this.table.attr('data-height', h.replace('px', ''));

         this.report = data.report || []
         this.struct = data.struct || []

	 	

	 	let agents = {}
	 	let cities = {}

	 	this.total = 0
	 	for (var i = 0; i < this.report.length; i++) {
	 		let report = this.report[i]

	 		this.report[i].detail = this.report[i].detail || ''
	 		this.report[i].order = this.report[i].order || ''

	 		//contacto
	 		if (this.report[i].contact) {

	 			this.report[i].cargo = this.report[i].contact.observation
	 			this.report[i].contact = this.report[i].contact.contact

	 			debugger
	 		} 

	 	 	this.report[i].detail = this.report[i].detail.replace(/\n/gmi, '')
	 	 	this.report[i].order = this.report[i].order.replace(/\n/gmi, '')


	 	 	++this.report[i].reminder_count

	 	 	this.total += this.report[i].reminder_count

	 		agents[report.user] = report.user
	 		cities[report.city] = report.city
	 	}

	 	this.count.text(this.report.length)
	 	this.countIntent.text(this.total)



	 	// this.selectAgent.html('<option>Todos</option>')

	 	// Object.keys(agents).map(agent=> {
	 	// 	if (agent) {
	 	// 		this.selectAgent.append(`<option>${agent}</option>`)
	 	// 	}
	 	// })


	 	// this.selectCity.html('<option>Todas</option>')

	 	// Object.keys(cities).map(city=> {
	 	// 	if (city) {
	 	// 		this.selectCity.append(`<option>${city}</option>`)
	 	// 	}
	 	// })

	 	
		this.tableReport.bootstrapTable({
	 		cache: false,
	 		striped: true,
	 		showColumns: false,
	 		minimumCountColumns: 2,
	 		clickToSelect: false,
	 		columns: cols,
	 		data: this.report,
	 	});
	 	
	 	this.tableReport.excelTableFilter({
	 		columnSelector: '.order-column'
	 	});


		// setTimeout(()=>{


		// }, 3000)



/*


	 	var pdf = new jsPDF('p', 'pt', 'letter');
		            // source can be HTML-formatted string, or a reference
		            // to an actual DOM element from which the text will be scraped.
		            // 
		            source = this.table[0];

		            debugger

		            // we support special element handlers. Register them with jQuery-style 
		            // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
		            // There is no support for any other type of selectors 
		            // (class, of compound) at this time.
		            specialElementHandlers = {
		                // element with id of "bypass" - jQuery style selector
		                '#bypassme': function(element, renderer) {
		                    // true = "handled elsewhere, bypass text extraction"
		                    return true
		                }
		            };
		            margins = {
		                left: 10,//x
		                top: 10,//y
		                bottom: 60,
		                width: 5000
		            };
		            // all coords and widths are in jsPDF instance's declared units
		            // 'inches' in this case
		            pdf.fromHTML(
		                    source, // HTML string or DOM elem ref.
		                    margins.left, // x coord
		                    margins.top, 
		                    {// y coord
		                    },
		            function(dispose) {
		                // dispose: object with X, Y of the last line add to the PDF 
		                //          this allow the insertion of new lines after html
		                pdf.save('Test.pdf');
		            }
		            , margins);*/
	


	 },

	 /*
	  * @name clearFilters
	  * @description description
	  * @return {void}
	  */
	  clearFilters: function() {
	  	
					
	 	WebService.post({ 
	 		route : this.dayReport.val() ?  'reports/diaryDay/'+ this.dayReport.val(): 'reports/diary', 
	 	}).done(this.load_reports_response.bind(this));
	 
	  },

	 numberFormatter : function (amount) {
	 	return numberFormatter(amount||0);
	 },

	 getCols: function(col, index){

	 	let columns = [
	 	'Ciudad', 
	 	'Causal',
	 	'Día de llamada',
	 	'Agente',
	 	'',
	 	'',

	 	]

	 	return {
	 		class: columns.contains(col)? 'order-column': '',
	 		field: index,
	 		title: col,
	 		align: 'center',
	 		sortable: true
	 	}
	 },


	 /*
	  * @name onChangeAgent
	  * @description description
	  * @return {void}
	  */
	  onChangeAgent: function(select, value) {
	  	
	 	//this.table.bootstrapTable('destroy')
	 	this.table.find('tbody').empty()

	 	if (value=='Todos') {
			this.table.bootstrapTable('load', this.report)
	 		this.count.text(this.report.length)
	 		this.countIntent.text(this.total)


	 	} else {

		 	let total = 0

	 		let datas = this.report.filter((call)=> {
	 			if (call.user == value) {
	 				total += call.reminder_count
	 			}
	 			return call.user == value;
	 		});
	 		this.table.bootstrapTable('load', datas)
	 		this.count.text(datas.length)
	 		this.countIntent.text(total)

	 	}

	 	

	  },


	   /*
	  * @name onChangeCity
	  * @description description
	  * @return {void}
	  */
	  onChangeCity: function(select, value) {
	  	
	 	//this.table.bootstrapTable('destroy')
	 	this.table.find('tbody').empty()

	 	if (value=='Todas') {
			this.table.bootstrapTable('load', this.report)
	 		this.count.text(this.report.length)
	 		this.countIntent.text(this.total)


	 	} else {

		 	let total = 0

	 		let datas = this.report.filter((call)=> {
	 			if (call.city == value) {
	 				total += call.reminder_count
	 			}
	 			return value.contains(call.city)
	 		});
	 		this.table.bootstrapTable('load', datas)
	 		this.count.text(datas.length)
	 		this.countIntent.text(total)

	 	}

	 	

	  },



   fnExcelReport: function() {


	   	

	   	
		let { struct, report} = this

       	let reportData = '';

       	reportData += Object.values(struct).join(';') + '\n';
       	
       	Object.values(report).map((row) => {
       	  	let rowData = Object.keys(struct).map(h => row[h])
       		reportData += rowData.join(';') + '\n' 
        })
       	
       	var csvData = new Blob(["\ufeff",reportData], {encoding:"UTF-8",type:"text/csv;charset=UTF-8"});
		saveAs(csvData,  "ReporteDiario.csv", true);






		/**************************


	    var tab_text="<table border='0' encoding='utf-8'><tr>";
	    var textRange; var j=0;

	    tab = document.getElementById('tableReport'); // id of table

	    let headers = $(tab.rows[0]).find('th')


	    for (var i = 0; i < headers.length; i++) {
	    	tab_text += "<th>" + $(headers[i]).find('.th-inner').text() +  "</th>"
	    };

	    tab_text += "</tr>";

	    for(j = 1 ; j < tab.rows.length ; j++) 
	    {     
			if (tab.rows[j].style.display != 'none') {
	        	tab_text=tab_text+tab.rows[j].innerHTML+"</tr>";
	    	}
	    }

	    tab_text=tab_text+"</table>";
	    // tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
	    // tab_text= tab_text.replace(/<img[^>]*>/gi,""); // remove if u want images in your table
	    // tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params


		var uri = 'data:application/vnd.ms-excel;base64,';
		var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>reporte</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>' + tab_text + '</body></html>'
		

		var base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
		

		document.getElementById("dlink").href = uri + base64(template)
		document.getElementById("dlink").download = 'reporte.xls';
		document.getElementById("dlink").click();

	 	//this.tableReport.excelTableFilter();
********/


	},

});