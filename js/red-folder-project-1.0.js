/*
 * @module  Abono
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DoweSoft
 */

Titan.modules.create({

	name: 'Abono',
	
	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components
		this.btn_calcular_abono = $('#btn_calcular_abono');
		this.btn_calcular_abono_minimo = $('#btn_calcular_abono_minimo');
		this.campo_abono = $('#monto-abono');
		this.campo_abono.mask('0#');
		this.infoDebts = $('#data_debts_abonos');
		this.infoDebtstbody = this.infoDebts.find('tbody').first();
	},

	/*
	 * @name initEvents
	 * @description inicia los eventos de los componentes del módulo
	 * @return {void}
	 */

	initEvents: function () {
		Titan.click('btn_calcular_abono', 'calcular', this);
		Titan.click('btn_calcular_abono_minimo', 'calcularMinimo', this);
	},

	calcular: function () {

		if (Titan.modules.Pagos.tablapagos.bootstrapTable('getSelections').length >=1) {

			if (this.campo_abono.val()!='') {
				var a = WebService.post({
					route: 'deudor/calcularAbono/',
					abono: this.campo_abono.val(),
					fecha: Titan.modules.Pagos.campoFechaLiquidacion.val(),
					debt: Titan.modules.Pagos.tablapagos.bootstrapTable('getSelections')[0],
				});

			 	a.done(	function  (response) {
			 			
			 		this.infoDebtstbody.html('');
			 		var data = response.liquidation[0];

			 		var datosResaltados = ['total Servicios', 'total Interes por cobrar', 'total del abono', 'gastos de cobranza'];
		 	 				console.log(response,datosResaltados);
					for(i in data){
						if(i != 'total del abono'){
							var b = (datosResaltados.contains(i))? true:false;

							this.infoDebtstbody.append('<tr><td>'+ 
								((b)? '<strong>' : '') + i + ((b)? '</strong>' : '') 
								+'</td><td>'+ ((b)? '<strong>' : '')  + 
								((data[i] > 999)? '$'+ numberFormatter(data[i]):data[i]) + 
								((b)? '</strong>' : '')  + '</td></tr>')
						
						}else if(i)
							this.infoDebtstbody.append('<tr><td>'  + i +'</td><th><h3><strong>' + ((data[i] > 999)? '$'+ numberFormatter(data[i]):data[i]) + '</strong></h3></th></tr>')
	 	 			}

			 	}.bind(this));
			} else {
			 	Titan.popup.warning('ingrese el monto del abono');
			}
		}else {
		 	Titan.popup.warning('seleccione una deuda primero');
		}
	},

	calcularMinimo: function () {

		if (Titan.modules.Pagos.tablapagos.bootstrapTable('getSelections').length >=1) {

			//if (this.campo_abono.val()!='') {
				var a = WebService.post({
					route: 'deudor/calcularAbonoMinimo/',
					abono: this.campo_abono.val(),
					fecha: Titan.modules.Pagos.campoFechaLiquidacion.val(),
					debt: Titan.modules.Pagos.tablapagos.bootstrapTable('getSelections')[0],
				});

			 	a.done(	function  (response) {
			 			
			 		this.infoDebtstbody.html('');
			 		var data = response.liquidation[0];

			 		var datosResaltados = ['total Servicios', 'total Interes por cobrar', 'total del abono', 'gastos de cobranza'];
		 	 				console.log(response,datosResaltados);
					for(i in data){
						if(i != 'total del abono'){
							var b = (datosResaltados.contains(i))? true:false;

							this.infoDebtstbody.append('<tr><td>'+ 
								((b)? '<strong>' : '') + i + ((b)? '</strong>' : '') 
								+'</td><td>'+ ((b)? '<strong>' : '')  + 
								((data[i] > 999)? '$'+ numberFormatter(data[i]):data[i]) + 
								((b)? '</strong>' : '')  + '</td></tr>')
						
						}else if(i)
							this.infoDebtstbody.append('<tr><td>'  + i +'</td><th><h3><strong>' + ((data[i] > 999)? '$'+ numberFormatter(data[i]):data[i]) + '</strong></h3></th></tr>')
	 	 			}

			 	}.bind(this));
			//} else {
			 //	Titan.popup.warning('ingrese el monto del abono');
			//}
		}else {
		 	Titan.popup.warning('seleccione una deuda primero');
		}
	},


});
/*

 * @module  Codeudores

 *

 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)

 *

 * @license Derechos Reservados de Autor (C) IP Total Software S.A

 */



Titan.modules.create({



	name: 'Codeudores',

	

	/*

	 * @constructor

	 * @description inicia los componentes del módulo

	 */

	ready: function () {

		//init components

		this.container = $('#codeudor-container');

		this.tablaInforme = this.container.find('#tabla_codeudores');

		//this.tablaInforme.bootstrapTable();



		this.thead = this.tablaInforme.find('thead > tr').first();

		this.tbody = this.tablaInforme.find('tbody').first();

		this.descripcion = this.container.find('#descripcion');



		this.btnSave = this.container.find('#save');	

		console.log('cargando data codeudores');	 	

		this.informe();



	},



	/*

	 * @name initEvents

	 * @description inicia los eventos de los componentes del módulo

	 * @return {void}

	 */

	initEvents: function () {

		Titan.click('btnSave', 'save', this);

	},





	update_table: function () {		

		this.buscar(Titan.global['deudor_id']);

	},



	save: function () {



		var descripcion = this.descripcion.val();



		if ($.trim(descripcion) !='') {

		

			

			var params = {

				'route': 'deudor/save_reports', 

				'id_deudor': Titan.global['deudor_id'],

				'__u__': __u__,

				'description': descripcion

			};

			var a = WebService.post(params);



			a.done(function  (response) {



				if(response.StatusResult){

					this.descripcion.val('');

					this.update_table();

					Titan.popup.success('El reporte se guardó exitosamente');

				}else{

					Titan.popup.danger('Error al guardar el reporte');

				}

					

			}.bind(this));

		} else{

			Titan.popup.warning('Escriba primero el reporte');

		};

				

	},

	



	/**

	* carga la estructura de la tabla 

	*/

	informe:function(){



		console.log('informe metod');	 	

		var params = {

			route: 'crud/load', 
			nodata: true, 
			'data_table': 'cosigner'

		}



		var a = WebService.post(params);



	 	a.done(	function  (response) {

	 		console.log(response);	 	 		

	 		this.loadStruct(response.struct);

	 		this.tablaInforme.bootstrapTable('destroy');

    		this.tablaInforme.bootstrapTable();

	 	}.bind(this));



    },



    loadData: function (arreglo) {    	

    	this.tablaInforme.bootstrapTable('load', arreglo);

    },



    loadStruct:function(estructura){

    	for(var i in estructura){

    		if (i != 'id' &&i != 'debtor') 

    			this.thead.append('<th data-field="' + i + '">' + estructura[i].name+ '</th>');

    	}

    },



    buscar: function (id) {

		this.tbody.html('');

		var a = WebService.post({route: 'deudor/query_cosigners', 'id_deudor': id});	



		a.done(function(response){	

			if(response.StatusResult == 'OK'){

				this.descripcion.val('');

				console.log(response.cosigners);

				this.loadData(response.cosigners);	



			}else{

				this.tbody.html('');

				this.tablaInforme.bootstrapTable('destroy');

    			this.tablaInforme.bootstrapTable();

			}

				

		}.bind(this));   		

    		

	},  



	deshabilitar:function(sentinela){

		 this.descripcion.attr('disabled', 'disabled');

		 this.btnSave.attr('disabled', 'disabled');

		 this.tbody.html(' ');



	},



	habilitar:function(sentinela){

		 this.descripcion.removeAttr('disabled', 'disabled');

		 this.btnSave.removeAttr('disabled', 'disabled');

	}

});



/*
 * @module  Abono
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DoweSoft
 */

Titan.modules.create({

	name: 'Abono',
	
	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components
		this.btn_calcular_abono = $('#btn_calcular_abono');
		this.btn_calcular_abono_minimo = $('#btn_calcular_abono_minimo');
		this.campo_abono = $('#monto-abono');
		this.campo_abono.mask('0#');
		this.infoDebts = $('#data_debts_abonos');
		this.infoDebtstbody = this.infoDebts.find('tbody').first();
	},

	/*
	 * @name initEvents
	 * @description inicia los eventos de los componentes del módulo
	 * @return {void}
	 */

	initEvents: function () {
		Titan.click('btn_calcular_abono', 'calcular', this);
		Titan.click('btn_calcular_abono_minimo', 'calcularMinimo', this);
	},

	calcular: function () {

		if (Titan.modules.Pagos.tablapagos.bootstrapTable('getSelections').length >=1) {

			if (this.campo_abono.val()!='') {
				var a = WebService.post({
					route: 'deudor/calcularAbono/',
					abono: this.campo_abono.val(),
					fecha: Titan.modules.Pagos.campoFechaLiquidacion.val(),
					debt: Titan.modules.Pagos.tablapagos.bootstrapTable('getSelections')[0],
				});

			 	a.done(	function  (response) {
			 			
			 		this.infoDebtstbody.html('');
			 		var data = response.liquidation[0];

			 		var datosResaltados = ['total Servicios', 'total Interes por cobrar', 'total del abono', 'gastos de cobranza'];
		 	 				console.log(response,datosResaltados);
					for(i in data){
						if(i != 'total del abono'){
							var b = (datosResaltados.contains(i))? true:false;

							this.infoDebtstbody.append('<tr><td>'+ 
								((b)? '<strong>' : '') + i + ((b)? '</strong>' : '') 
								+'</td><td>'+ ((b)? '<strong>' : '')  + 
								((data[i] > 999)? '$'+ numberFormatter(data[i]):data[i]) + 
								((b)? '</strong>' : '')  + '</td></tr>')
						
						}else if(i)
							this.infoDebtstbody.append('<tr><td>'  + i +'</td><th><h3><strong>' + ((data[i] > 999)? '$'+ numberFormatter(data[i]):data[i]) + '</strong></h3></th></tr>')
	 	 			}

			 	}.bind(this));
			} else {
			 	Titan.popup.warning('ingrese el monto del abono');
			}
		}else {
		 	Titan.popup.warning('seleccione una deuda primero');
		}
	},

	calcularMinimo: function () {

		if (Titan.modules.Pagos.tablapagos.bootstrapTable('getSelections').length >=1) {

			//if (this.campo_abono.val()!='') {
				var a = WebService.post({
					route: 'deudor/calcularAbonoMinimo/',
					abono: this.campo_abono.val(),
					fecha: Titan.modules.Pagos.campoFechaLiquidacion.val(),
					debt: Titan.modules.Pagos.tablapagos.bootstrapTable('getSelections')[0],
				});

			 	a.done(	function  (response) {
			 			
			 		this.infoDebtstbody.html('');
			 		var data = response.liquidation[0];

			 		var datosResaltados = ['total Servicios', 'total Interes por cobrar', 'total del abono', 'gastos de cobranza'];
		 	 				console.log(response,datosResaltados);
					for(i in data){
						if(i != 'total del abono'){
							var b = (datosResaltados.contains(i))? true:false;

							this.infoDebtstbody.append('<tr><td>'+ 
								((b)? '<strong>' : '') + i + ((b)? '</strong>' : '') 
								+'</td><td>'+ ((b)? '<strong>' : '')  + 
								((data[i] > 999)? '$'+ numberFormatter(data[i]):data[i]) + 
								((b)? '</strong>' : '')  + '</td></tr>')
						
						}else if(i)
							this.infoDebtstbody.append('<tr><td>'  + i +'</td><th><h3><strong>' + ((data[i] > 999)? '$'+ numberFormatter(data[i]):data[i]) + '</strong></h3></th></tr>')
	 	 			}

			 	}.bind(this));
			//} else {
			 //	Titan.popup.warning('ingrese el monto del abono');
			//}
		}else {
		 	Titan.popup.warning('seleccione una deuda primero');
		}
	},


});
/*

 * @module  Codeudores

 *

 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)

 *

 * @license Derechos Reservados de Autor (C) IP Total Software S.A

 */



Titan.modules.create({



	name: 'Codeudores',

	

	/*

	 * @constructor

	 * @description inicia los componentes del módulo

	 */

	ready: function () {

		//init components

		this.container = $('#codeudor-container');

		this.tablaInforme = this.container.find('#tabla_codeudores');

		//this.tablaInforme.bootstrapTable();



		this.thead = this.tablaInforme.find('thead > tr').first();

		this.tbody = this.tablaInforme.find('tbody').first();

		this.descripcion = this.container.find('#descripcion');



		this.btnSave = this.container.find('#save');	

		console.log('cargando data codeudores');	 	

		this.informe();



	},



	/*

	 * @name initEvents

	 * @description inicia los eventos de los componentes del módulo

	 * @return {void}

	 */

	initEvents: function () {

		Titan.click('btnSave', 'save', this);

	},





	update_table: function () {		

		this.buscar(Titan.global['deudor_id']);

	},



	save: function () {



		var descripcion = this.descripcion.val();



		if ($.trim(descripcion) !='') {

		

			

			var params = {

				'route': 'deudor/save_reports', 

				'id_deudor': Titan.global['deudor_id'],

				'__u__': __u__,

				'description': descripcion

			};

			var a = WebService.post(params);



			a.done(function  (response) {



				if(response.StatusResult){

					this.descripcion.val('');

					this.update_table();

					Titan.popup.success('El reporte se guardó exitosamente');

				}else{

					Titan.popup.danger('Error al guardar el reporte');

				}

					

			}.bind(this));

		} else{

			Titan.popup.warning('Escriba primero el reporte');

		};

				

	},

	



	/**

	* carga la estructura de la tabla 

	*/

	informe:function(){



		console.log('informe metod');	 	

		var params = {

			route: 'crud/load', 
			nodata: true, 
			'data_table': 'cosigner'

		}



		var a = WebService.post(params);



	 	a.done(	function  (response) {

	 		console.log(response);	 	 		

	 		this.loadStruct(response.struct);

	 		this.tablaInforme.bootstrapTable('destroy');

    		this.tablaInforme.bootstrapTable();

	 	}.bind(this));



    },



    loadData: function (arreglo) {    	

    	this.tablaInforme.bootstrapTable('load', arreglo);

    },



    loadStruct:function(estructura){

    	for(var i in estructura){

    		if (i != 'id' &&i != 'debtor') 

    			this.thead.append('<th data-field="' + i + '">' + estructura[i].name+ '</th>');

    	}

    },



    buscar: function (id) {

		this.tbody.html('');

		var a = WebService.post({route: 'deudor/query_cosigners', 'id_deudor': id});	



		a.done(function(response){	

			if(response.StatusResult == 'OK'){

				this.descripcion.val('');

				console.log(response.cosigners);

				this.loadData(response.cosigners);	



			}else{

				this.tbody.html('');

				this.tablaInforme.bootstrapTable('destroy');

    			this.tablaInforme.bootstrapTable();

			}

				

		}.bind(this));   		

    		

	},  



	deshabilitar:function(sentinela){

		 this.descripcion.attr('disabled', 'disabled');

		 this.btnSave.attr('disabled', 'disabled');

		 this.tbody.html(' ');



	},



	habilitar:function(sentinela){

		 this.descripcion.removeAttr('disabled', 'disabled');

		 this.btnSave.removeAttr('disabled', 'disabled');

	}

});



/*
 * @module  index
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */
Titan.modules.create({
	name: 'index',
	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components
		Titan.view( 'llamadas', 'reportes_de_llamadas','informe_de_llamada_tab');
		Titan.view( 'liquidacion', 'informacion_del_deudor','informacion_Deudor_tab');
		Titan.view( 'liquidacion', 'pagos','pagos_tab');
		Titan.view( 'liquidacion', 'codeudores','codeudores_tab');
		Titan.view( 'liquidacion', 'informe_de_pagos','informe_pagos_tab');
		Titan.view( 'liquidacion', 'referencias','referencias_tab');
	},

});/*
 * @module  Login
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */
Titan.modules.create({

	name: 'Informacion_del_deudor',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components
		this.info_deudor_field = $('#busca_Deudor');
		this.info_deudor_field.mask('0#');
		this.btn_buscar = $('#btn_buscar');
		this.containerInfo = $('#content-information-deudor');
		this.panelInfo = $('#panel-content-info');
		this.nombre_deudor = $('#nombre');
		this.table = $('#tabla-info');
		
		this.select_sucursal = $('#select_sucursales');
		this.select_sucursal.hide();
	},

	/*
	 * @name initEvents
	 * @description inicia los eventos de los componentes del módulo
	 * @return {void}
	 */

	initEvents: function () {
		Titan.click('btn_buscar', 'ejecutarBusqueda', this);
		Titan.keypress('info_deudor_field', 'buscar', this);
		this.select_sucursal.on('change',  function(event) {
			 this.cargarData(this.select_sucursal.val());
		}.bind(this));	
	},


	ejecutarBusqueda: function () {
		if(this.info_deudor_field.val() == ''){
					Titan.popup.danger('Debe ingresar el número de cedula del deudor! ');
					this.panelInfo.hide();
				}else{
		var a = WebService.post({route: 'deudor/search_debtor', 'dni': this.info_deudor_field.val()});	

					a.done(function(data){

						if(data.StatusResult == 'OK'){
							//guardamos la informacion del deudor
							this.deudores = data.deudores;
							this.sucursales = data.sucursales;
							
							
							if(this.sucursales.length <= 1){
								this.cargarData(0);
								this.select_sucursal.hide();
							}else{
								this.select_sucursal.html("");
								this.select_sucursal.append("<option value='-1'> -- seleccione la sucursal -- </option>");
								
								for(i in this.sucursales)
									if(i < this.sucursales.length)
										this.select_sucursal.append("<option value='" + i +  "'>" + this.sucursales[i].name + "</option>");
								this.select_sucursal.show();
								
								this.limpiar();
							}

						}else{
							Titan.popup.info(data.ErrorMessage );
							Titan.modules['Reportes_de_llamadas'].deshabilitar();	
							this.panelInfo.hide();	
					     }	
				    }.bind(this));	
				}
	},
	
	buscar: function (e) {
		
		  var tecla = (document.all) ? e.keyCode : e.which;
		  if (tecla==13){
			  
			  console.log("buscando deudor ...");
				
				this.dato_encontrado = false;

				if(this.info_deudor_field.val() == ''){
					Titan.popup.danger('Debe ingresar el número de cedula del deudor! ');
					this.panelInfo.hide();
				}else{
					this.ejecutarBusqueda();
				}	
		  }
			
	},	

	cargarData: function (index) {
		console.log("cargando la informacion del deudor ...");
		this.dato_encontrado = false;
		this.deudor = this.deudores[index];
		Titan.global['deudor_id'] = this.deudor.id;
	    this.dato_encontrado = true;
	    
	    this.limpiar();
	   
	    var params = {
	    		route: 'deudor/search', 
	    		'dni': this.deudor.dni,
	    		'sucursal': this.sucursales[index].id,
	    	};
	    
	    var a = WebService.post(params);	

		a.done(function(data){

			if(data.StatusResult == 'OK'){
			    this.table.bootstrapTable('destroy');
			    this.containerInfo.html(''); 
			    
			    var deudorLast = data.deudor;
			    console.log(deudorLast.Sucursal.name);

			    if (deudorLast.status == '0') {
			    	this.panelInfo.addClass('panel-danger');

			    	Titan.popup.error('Este deudor ha sido deshabilitado en el sistema', 5000);
			    } else{
			    	this.panelInfo.removeClass('panel-danger');
			    }
			    
				for(i in deudorLast){
					if(deudorLast[i]){
						if(i != 'Código' &&i != 'id' &&i != 'status' )
							this.containerInfo.append('<tr><td>' + i + ':</td><td>' + ((typeof deudorLast[i] == 'object')? deudorLast[i].name : deudorLast[i]) + '</td></tr>');										
				    }					
			    }
				delete deudorLast;
			   
			   // this.table.bootstrapTable();
			    this.panelInfo.show();
			}
		}.bind(this));
		
		Titan.global['deudor'] = this.deudor;
		Titan.global['id_subsidiary'] = this.sucursales[index].id;
		Titan.global['id_deudor'] = this.deudores[index].id;
		
		
	    Titan.modules['Reportes_de_llamadas'].buscar(this.deudor.id);
	    Titan.modules['Reportes_de_llamadas'].habilitar();
		Titan.modules['Reportes_de_llamadas'].cancel();
		
	    Titan.modules['Codeudores'].buscar(this.deudor.id);
	    Titan.modules['Pagos'].buscar(this.deudor.dni);
	    Titan.modules['Informe_de_pagos'].buscar(this.deudor.id);
	    Titan.modules['Referencias'].buscar_personales(this.deudor.id);
	    Titan.modules['Referencias'].buscar_comerciales(this.deudor.id);
	    Titan.modules['Pagos'].habilitar();
		
	},	
	
	limpiar: function (){
		this.panelInfo.hide();
		 this.table.bootstrapTable('load', {});
		Titan.modules['Pagos'].limpiar();
		Titan.modules['Reportes_de_llamadas'].cancel();
	    //Titan.modules['Codeudores'].buscar(this.deudor.id);
	    
	    //Titan.modules['Informe_de_pagos'].buscar(this.deudor.id);
	    //Titan.modules['Referencias'].buscar_comerciales(this.deudor.id);
	},

});/*

 * @module  Login

 *

 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)

 *

 * @license Derechos Reservados de Autor (C) IP Total Software S.A

 */

Titan.modules.create({



	name: 'Informe_de_llamadas',



	/*

	 * @constructor

	 * @description inicia los componentes del módulo

	 */

	ready: function () {

		//init components

		this.container = $('#informe-de-llamadas-container');

		this.tablaInforme = this.container.find('#tabla_informe');

		//this.tablaInforme.bootstrapTable();



		this.thead = this.tablaInforme.find('thead > tr').first();

		this.tbody = this.tablaInforme.find('tbody').first();

		this.descripcion = this.container.find('#descripcion');



		this.btnSave = this.container.find('#save');	

		console.log('cargando data informes');	 	

		this.informe();



	},



	/*

	 * @name initEvents

	 * @description inicia los eventos de los componentes del módulo

	 * @return {void}

	 */

	initEvents: function () {

		Titan.click('btnSave', 'save', this);

	},





	update_table: function () {		

		console.log(' update_table update_table update_table update_table update_table');

		var id_del_deudor = Titan.modules['Informacion_del_deudor'].deudor.id;	

		this.buscar(id_del_deudor);



	},



	save: function () {



		var descripcion = this.descripcion.val();



		if ($.trim(descripcion) !='') {		

			var id = Titan.modules['Informacion_del_deudor'].deudor.id;

			

			var params = {

				'route': 'deudor/save_reports', 

				'id_deudor': id,

				'__u__': __u__,

				'description': descripcion

			}



			var a = WebService.post(params);



			a.done(function  (response) {



				if(response.StatusResult=='OK'){

					this.descripcion.val('');

					this.update_table();

					//Titan.popup.success('El reporte se guardó exitosamente');

				}else{

					Titan.popup.danger('Error al guardar el reporte');

				}

					

			}.bind(this));

		} else{

			Titan.popup.warning('Escriba primero el reporte');

		};

				

	},

	



	/**

	* carga la estructura de la tabla 

	*/

	informe:function(){



		var params = {

			route: 'crud/load', 
			nodata: true, 
			'data_table': 'report'

		}



		var a = WebService.post(params);



	 	a.done(	function  (response) {

	 		console.log(response);	 	 		

	 		this.loadStruct(response.struct);

	 		this.tablaInforme.bootstrapTable('destroy');

    		this.tablaInforme.bootstrapTable();

	 	}.bind(this));



    },



    loadData: function (arreglo) {    	

    	this.tablaInforme.bootstrapTable('load', arreglo);

    },



    loadStruct:function(estructura){

    	for(var i in estructura){

    		if (i != 'id' &&i != 'debtor' ) 

    			this.thead.append('<th data-field="' + i + '">' + estructura[i].name+ '</th>');

    	}

    },



    buscar: function (id) {

		this.tbody.html('');

		var a = WebService.post({route: 'deudor/query_reports', 'id_deudor': id});	



		a.done(function(response){	

			if(response.StatusResult == 'OK'){

				this.descripcion.val('');

				this.loadData(response.reports);	



			}else{

				this.tbody.html('');

				this.tablaInforme.bootstrapTable('destroy');

    			this.tablaInforme.bootstrapTable();

			}

				

		}.bind(this));   		

    		

	},  



	deshabilitar:function(sentinela){

		 this.descripcion.attr('disabled', 'disabled');

		 this.btnSave.attr('disabled', 'disabled');

		 this.tbody.html(' ');



	},



	habilitar:function(sentinela){

		 this.descripcion.removeAttr('disabled', 'disabled');

		 this.btnSave.removeAttr('disabled', 'disabled');

	}

});



Titan.modules.create({



	name: 'Informe_de_pagos',

	

	/*

	 * @constructor

	 * @description inicia los componentes del módulo

	 */

	ready: function () {

		//init components

		this.container = $('#informe-pagos-container');

		this.tabla_informe_pagos = this.container.find('#tabla_pagos');

		

		this.thead = this.tabla_informe_pagos.find('thead > tr').first();

		this.tbody = this.tabla_informe_pagos.find('tbody').first();		

		

		console.log('cargando data pagos');	 	

		this.informe();



	},



	/*

	 * @name initEvents

	 * @description inicia los eventos de los componentes del módulo

	 * @return {void}

	 */

	initEvents: function () {

	},





	update_table: function () {		

	},	



	/**

	* carga la estructura de la tabla 

	*/

	informe:function(){



		console.log('informe metod');	 	

		var params = {

			route: 'crud/load', 
			nodata: true, 
			'data_table': 'payment'

		}



		var a = WebService.post(params);



	 	a.done(	function  (response) {

	 		console.log(response);	 	 		

	 		this.loadStruct(response.struct);

	 		this.tabla_informe_pagos.bootstrapTable('destroy');

    		this.tabla_informe_pagos.bootstrapTable();

	 	}.bind(this));



    },



    loadData: function (arreglo) {    	

    	this.tabla_informe_pagos.bootstrapTable('load', arreglo);

    },



    loadStruct:function(estructura){

    	for(var i in estructura){

    		if (i != 'id' &&i != 'debtor') 

    			this.thead.append('<th data-field="' + i + '">' + estructura[i].name+ '</th>');

    	}

    },



    buscar: function (id) {



		this.tbody.html('');

		this.id_ = id;



		var a = WebService.post({route: 'pagos/query_payment', 'id_deudor': id});	



		a.done(function(response){	

			if(response.StatusResult == 'OK'){

				this.loadData(response.payment);

				

			}else{

				this.tbody.html('');

				this.tabla_informe_pagos.bootstrapTable('destroy');

    			this.tabla_informe_pagos.bootstrapTable();

			}

				

		}.bind(this));   		

    		

	},  



	

});



/*
 * @module  Pagos
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */
Titan.modules.create({
	name: 'Pagos',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		this.container = $('#informe-de-pagos-container');
		this.tablapagos= this.container.find('#tabla_pagos');
		this.thead = this.tablapagos.find('thead > tr').first();
		this.tbody = this.tablapagos.find('tbody').first();
		this.abono_deuda = this.container.find('#abono_deuda');
		this.abono_deuda.mask('0#');
		this.labelInfo = this.container.find('#monto');
		this.btnSave = this.container.find('#save');
		this.saldo_deuda= this.container.find('#saldo_deuda');
		this.infoDebts = this.container.find('#data-debts');
		this.infoDebtstbody = this.infoDebts.find('tbody').first();
		this.campoFechaLiquidacion = this.container.find('#date-liquidation');
		this.campoFechaLiquidacion.datepicker({
	      changeMonth: true,
	      changeYear: true
	    });

		this.btnCalcularLiquidacion = this.container.find('#btn-liquidation');
		this.infoDebtsManual = this.container.find('#data-debts-manual');
		this.infoDebtstbodyManual = this.infoDebtsManual.find('tbody').first();

		//liquidacion manual
		this.campoSucursales = this.container.find('#sucursales-deuda');
		this.campoFechaPagoManual = this.container.find('#fecha-deuda');
		this.campoFechaPagoManual.datepicker({
	      changeMonth: true,
	      changeYear: true
	    });
		this.campoSaldoManual = this.container.find('#saldo-deuda');
		this.campoSaldoManual.mask('0#');
		this.campoFechaLiquidacionManual = this.container.find('#fecha-liquidacion');
		this.campoFechaLiquidacionManual.datepicker({
	      changeMonth: true,
	      changeYear: true
	    });
		this.campoFechaLiquidacionManual.val(this.ultimoDiaDelMes());
		this.btnCalcularLiquidacionManual = this.container.find('#btn-fecha-liquidacion');
		Titan.view( 'liquidacion', 'abono','abonos_deuda');

		this.count = $("#badge_liquidacion");
		this.count.hide();	

		this.sucursales();
		this.informe();
	},



	initEvents: function () {

		Titan.click('btnSave', 'confirmationSave', this);

		Titan.click('btnCalcularLiquidacion', 'calcularLiquidacion', this);

		Titan.click('btnCalcularLiquidacionManual', 'calcularLiquidacionManual', this);

		//Titan.keypress('abono_deuda', 'loadAmount', this);

			

	},



	sucursales: function () {

		var a = WebService.post({route: 'query/sucursales'});



	 	a.done(	function  (response) {

	 		this.campoSucursales.html('');



	 		var sucursales  = response.sucursales;

	 		for (var i = sucursales.length - 1; i >= 0; i--) {

	 			var s = sucursales[i];

	 			this.campoSucursales.append('<option  >' + s.name + '</option>')

	 		}



	 	}.bind(this));

	},





	calcularLiquidacionManual: function () {



		if (this.campoSaldoManual.val() == '' || this.campoSaldoManual.val() <= '0') {

			Titan.popup.warning('Ingrese el saldo');

			return;

		}



		if (this.campoFechaPagoManual.val() == '') {

			Titan.popup.warning('elija la fecha del último pago');

			return;

		}



		



		var params = {

			route: 'deudor/calculateLiquidationManual', 

			'sucursal': this.campoSucursales.val(),

			'fechaPago': this.campoFechaPagoManual.val(),

			'saldo': this.campoSaldoManual.val(),

			'fechaLiquidacion': this.campoFechaLiquidacionManual.val(),

		}



		var a = WebService.post(params);



	 	a.done(	function  (response) {

	 		console.log(response);	

	 		this.infoDebtstbodyManual.html('');

	 		var data = response.liquidation;



	 		var datosResaltados = ['total Servicios', 'total Interes por cobrar', 'Procredito', 'gastos de cobranza'];



	 		for(k in data){

	 			if(k!='contains'){

	 				//this.infoDebtstbody.append('<tr><td>deuda #' + k + '</td><td></td></tr>')

 	 				

					for(i in data[k]){

						if(i != 'total por cobrar'){

							var b = (datosResaltados.contains(i))? true:false;



							this.infoDebtstbodyManual.append('<tr><td>'+ 

								((b)? '<strong>' : '') + i + ((b)? '</strong>' : '') 

								+'</td><td>'+ ((b)? '<strong>' : '')  + 

								((data[k][i] > 999)? '$'+ numberFormatter(data[k][i]):data[k][i]) + 

								((b)? '</strong>' : '')  + '</td></tr>')

						

						}else if(i)

							this.infoDebtstbodyManual.append('<tr><td>'  + i +'</td><th><h3><strong>' + ((data[k][i] > 999)? '$'+ numberFormatter(data[k][i]):data[k][i]) + '</strong></h3></th></tr>')

	 	 				

	 	 			}

 	 			}

 	 		}

	 		

	 	}.bind(this));

	},



	calcularLiquidacion: function () {



		if (Titan.modules.Pagos.tablapagos.bootstrapTable('getSelections').length >=1) {

			var params = {

				route: 'deudor/calculateLiquidation', 

				'debts': this.tablapagos.bootstrapTable('getSelections'),

				'fecha': this.campoFechaLiquidacion.val(),

			}



			var a = WebService.post(params);



		 	a.done(	function  (response) {

		 		console.log(response);	

		 		this.infoDebtstbody.html('');

		 		var data = response.liquidation;



		 		var datosResaltados = ['total Servicios', 'total Interes por cobrar', 'Procredito', 'gastos de cobranza'];



		 		for(k in data){

		 			if(k!='contains'){

		 				//this.infoDebtstbody.append('<tr><td>deuda #' + k + '</td><td></td></tr>')

	 	 				

						for(i in data[k]){

							if(i != 'total por cobrar'){

								var b = (datosResaltados.contains(i))? true:false;



								this.infoDebtstbody.append('<tr><td>'+ 

									((b)? '<strong>' : '') + i + ((b)? '</strong>' : '') 

									+'</td><td>'+ ((b)? '<strong>' : '')  + 

									((data[k][i] > 999)? '$'+ numberFormatter(data[k][i]):data[k][i]) + 

									((b)? '</strong>' : '')  + '</td></tr>')

							

							}else if(i)

								this.infoDebtstbody.append('<tr><td>'  + i +'</td><th><h3><strong>' + ((data[k][i] > 999)? '$'+ numberFormatter(data[k][i]):data[k][i]) + '</strong></h3></th></tr>')

		 	 				

		 	 			}

	 	 			}

	 	 		}

		 		

		 	}.bind(this));

		}else {

		 	Titan.popup.warning('seleccione una deuda primero');

		}

	},



	confirmationSave: function () {

		Titan.message.confirmation('Guardar Pago','Desea confirmar el pago',this.save, this);

	},



	update_table: function () {	

		var id_del_deudor = Titan.modules['Informacion_del_deudor'].deudor.id;	

		this.buscar(id_del_deudor);

	},


	ultimoDiaDelMes: function () {
		var today = new Date(); 
		var fecha = new Date(today.getFullYear(), today.getMonth()+1, 0);
		console.log(fecha);	 
		var dia = fecha.getDate();
		var mes = fecha.getMonth() + 1;
		var anno = fecha.getFullYear();
		fecha =  anno +'-' + (mes< 10 ?'0'+mes:mes)+ '-' +  (dia< 10 ?'0'+dia:dia);
		console.log(fecha);	 
		return fecha;
	},



	informe:function(){

		this.campoFechaLiquidacion.val(this.ultimoDiaDelMes()); 	

		console.log('informe metod');	 	

		var params = {

			route: 'crud/load', 
			nodata: true, 
			'data_table': 'debt'

		}



		var a = WebService.post(params);



	 	a.done(	function  (response) {

	 		console.log(response);	 	 		

	 		this.loadStruct(response.struct);

	 		this.tablapagos.bootstrapTable('destroy');

    		this.tablapagos.bootstrapTable();

	 	}.bind(this));



    },



	loadData: function (arreglo) {    	
		this.count.show(); 	
    	arreglo.length > 0? this.count.html(arreglo.length):this.count.hide();
    	this.tablapagos.bootstrapTable('load', arreglo);

    },



    loadStruct:function(estructura){



    	var fieldshiddens = ['id', 'debtor', 'status', 'dni'];



    	for(var i in estructura){

    		if (!fieldshiddens.contains(i)) 

    			this.thead.append('<th data-field="' + i + '" data-formatter="' + i + 'Formatter">' + estructura[i].name+ '</th>');

    			

    	}

    },



    buscar: function (dni) {



		this.tbody.html('');

		this.labelInfo.html('');

		this.abono_deuda.val('');

		console.log(dni);



		var a = WebService.post({route: 'deudor/query_debt', 'dni': dni});	



		a.done(function(response){	

			if(response.StatusResult == 'OK'){



				Titan.global['guardaSaldo'] = response.debts[0].amount;

				

				this.loadData(response.debts);		



				this.labelInfo.html( amountFormatter(response.total_));

				Titan.global['debt'] = response.debts[0];



				this.infoDebtstbody.html('');



				var data = response.data;

				for(i in data)

					if(i)

						this.infoDebtstbody.append('<tr><td>'  + i.replace(/_/mgi, ' ') +'</td><td> ' + ((data[i] > 999)? numberFormatter(data[i]):data[i]) + '</td></tr>')



				//this.infoDebts.bootstrapTable('destroy');

				//this.infoDebts.bootstrapTable();



			}else{

				this.tbody.html('');

				this.tablapagos.bootstrapTable('destroy');

    			this.tablapagos.bootstrapTable();

			}

				

		}.bind(this));   		

    		

	}, 



	save: function () {

		

		this.abono = parseInt( $.trim(this.abono_deuda.val()).valueOf());

		this.monto = parseInt( Titan.global['guardaSaldo'].valueOf());

		

		if (this.abono !='') {



			if(this.abono <= this.monto){							

				this.abono_deuda_ =  this.monto - this.abono;



				var params = {

					'route': 'deuda/save_debt', 

					'abono_deuda': this.abono_deuda_,

					'debt': Titan.global['debt'] 

				};

				var a = WebService.post(params);



				a.done(function  (response) {



					if(response.StatusResult){

						this.save_payment_debtor();

						this.update_table();

						Titan.global['guardaSaldo'] = this.abono_deuda_;

						Titan.popup.success('El abono se guardó exitosamente');

					}else{

						Titan.popup.danger('Error al guardar el abono');

					}



				}.bind(this));	

			}else{

				Titan.popup.danger('Error al guardar el abono');

			}						

		} else{

			Titan.popup.warning('Escriba primero el abono');

		};			

				

	},



	loadAmount:function(){



		this.abono_ = parseInt( $.trim(this.abono_deuda.val()).valueOf());

		this.monto_ = parseInt( Titan.global['guardaSaldo'].valueOf());		

		this.abono_deuda_ =  this.monto - this.abono;



		

    },



	formatAmount:function(amount){

		amount = "" + amount;

		var centavos;

		

		if (amount.contains('.')){

			var amountTotal = amount.split('.');

			var centavos = amountTotal.pop();

			amount = amountTotal.pop();

		}



		



		var tem = amount.split('');

		var z = tem.pop();

		var y = tem.pop();

		var x = tem.pop();



		var w = tem.pop();

		var v = tem.pop();

		var u = tem.pop();



		var t = tem.pop();

		var r = tem.pop();

		var s = tem.pop();



		//debugger;



		var str = '$';



		 str += ((s)?s:''); 

		 str += ((r)?r:''); 

		 str += ((t)?t:''); 

		 str += ((u)?u:''); 

		 str += ((v)?v:''); 

		 str += ((w)?w:''); 

		 str += ((w)?'.':''); 

		 str += ((x)?x:''); 

		 str += ((y)?y:''); 

		 str += ((z)?z:'');



		 return str;

    },



    save_payment_debtor: function () {





		this.abono = parseInt( $.trim(this.abono_deuda.val()).valueOf());

		this.monto = parseInt( Titan.global['guardaSaldo'].valueOf());

		this.abono_deuda_ =  this.monto - this.abono;

		this.id_del_deudor = Titan.modules['Informacion_del_deudor'].deudor.id;	



		var params = {

			'route': 'pagos/save_payment', 

			'id_deudor': this.id_del_deudor,

			'abono_': this.abono,

			'monto_': this.monto,

			'payme_debt': this.abono_deuda_

		};

		var a = WebService.post(params);



		console.log(this.id_del_deudor + "***" + this.abono + "***" + this.monto + "***" + this.abono_deuda_ );



		a.done(function  (response) {

			if(response.StatusResult = 'OK'){

				Titan.modules['Informe_de_pagos'].buscar(this.id_del_deudor);

			}else{

				

			}



		}.bind(this));						

				

	},



    deshabilitar:function(){

		this.abono_deuda.attr('readonly', 'readonly');

		this.btnSave.attr('disabled', 'disabled');

		this.abono_deuda.html('');

	},



	habilitar:function(){

		 this.abono_deuda.removeAttr('readonly', 'readonly');

		 this.btnSave.removeAttr('disabled');

	},

	

	limpiar:function(){

		this.tablapagos.bootstrapTable('load', {});

	},

	updateLiquidation : function() {

	},



});

Titan.modules.create({



	name: 'Referencias',

	

	/*

	 * @constructor

	 * @description inicia los componentes del módulo

	 */

	ready: function () {

		

		this.container = $('#referencias-container');

		

		this.tabl_ref_per= this.container.find('#tabla-referencias-personales');

		this.thead = this.tabl_ref_per.find('thead > tr').first();

		this.tbody = this.tabl_ref_per.find('tbody').first();



		this.tabl_ref_com= this.container.find('#tabla-referencias-comerciales');

		this.whead = this.tabl_ref_com.find('thead > tr').first();

		this.wbody = this.tabl_ref_com.find('tbody').first();	



		this.informe_persona();

		this.informe_business();



	},



	informe_persona:function(){



		console.log('informe_persona metod');	 	

		var params = {

			route: 'crud/load', 
			nodata: true, 

			'data_table': 'debtor_personal_reference'

		}



		var a = WebService.post(params);



	 	a.done(	function  (response) {

	 		console.log(response);	 	 		

	 		this.loadStruct_personal(response.struct);

	 		this.tabl_ref_per.bootstrapTable('destroy');

    		this.tabl_ref_per.bootstrapTable();

	 	}.bind(this));



    },



    informe_business:function(){



		console.log('informe_business metod');	 	

		var params = {

			route: 'crud/load', 
			nodata: true, 
			'data_table': 'debtor_business_reference'

		};



		var a = WebService.post(params);



	 	a.done(	function  (response) {

	 		console.log(response);	 	 		

	 		this.loadStruct_business(response.struct);

	 		this.tabl_ref_com.bootstrapTable('destroy');

    		this.tabl_ref_com.bootstrapTable();

	 	}.bind(this));



    },



    loadData_personal: function (arreglo) {    	

    	this.tabl_ref_per.bootstrapTable('load', arreglo);

    },



     loadData_business: function (arreglo) {    	

    	this.tabl_ref_com.bootstrapTable('load', arreglo);

    },



    loadStruct_personal:function(estructura){

    	for(var i in estructura){

    		if (i != 'id' &&i != 'debtor') 

    			this.thead.append('<th data-field="' + i + '">' + estructura[i].name+ '</th>');

    	}

    },



     loadStruct_business:function(estructura){

    	for(var i in estructura){

    		if (i != 'id' &&i != 'debtor') 

    			this.whead.append('<th data-field="' + i + '">' + estructura[i].name+ '</th>');

    	}

    },



    buscar_personales: function (id) {



		var a = WebService.post({route: 'referencias/query_payment_personales', 'id_deudor': id});	



		a.done(function(response){	

			if(response.StatusResult == 'OK'){

				this.loadData_personal(response.personal);

				

			}else{

				this.tbody.html('');

				this.tabl_ref_per.bootstrapTable('destroy');

    			this.tabl_ref_per.bootstrapTable();

			}				

		}.bind(this));   		

    		

	},  





	buscar_comerciales: function (id) {



		var a = WebService.post({route: 'referencias/query_payment_business', 'id_deudor': id});	



		a.done(function(response){	

			if(response.StatusResult == 'OK'){

				this.loadData_business(response.business);

				

			}else{

				this.wbody.html('');

				this.tabl_ref_com.bootstrapTable('destroy');

    			this.tabl_ref_com.bootstrapTable();

			}				

		}.bind(this));   		

    		

	}, 



	

});



/*
 * @module  Abono
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DoweSoft
 */

Titan.modules.create({

	name: 'Abono',
	
	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components
		this.btn_calcular_abono = $('#btn_calcular_abono');
		this.btn_calcular_abono_minimo = $('#btn_calcular_abono_minimo');
		this.campo_abono = $('#monto-abono');
		this.campo_abono.mask('0#');
		this.infoDebts = $('#data_debts_abonos');
		this.infoDebtstbody = this.infoDebts.find('tbody').first();
	},

	/*
	 * @name initEvents
	 * @description inicia los eventos de los componentes del módulo
	 * @return {void}
	 */

	initEvents: function () {
		Titan.click('btn_calcular_abono', 'calcular', this);
		Titan.click('btn_calcular_abono_minimo', 'calcularMinimo', this);
	},

	calcular: function () {

		if (Titan.modules.Pagos.tablapagos.bootstrapTable('getSelections').length >=1) {

			if (this.campo_abono.val()!='') {
				var a = WebService.post({
					route: 'deudor/calcularAbono/',
					abono: this.campo_abono.val(),
					fecha: Titan.modules.Pagos.campoFechaLiquidacion.val(),
					debt: Titan.modules.Pagos.tablapagos.bootstrapTable('getSelections')[0],
				});

			 	a.done(	function  (response) {
			 			
			 		this.infoDebtstbody.html('');
			 		var data = response.liquidation[0];

			 		var datosResaltados = ['total Servicios', 'total Interes por cobrar', 'total del abono', 'gastos de cobranza'];
		 	 				console.log(response,datosResaltados);
					for(i in data){
						if(i != 'total del abono'){
							var b = (datosResaltados.contains(i))? true:false;

							this.infoDebtstbody.append('<tr><td>'+ 
								((b)? '<strong>' : '') + i + ((b)? '</strong>' : '') 
								+'</td><td>'+ ((b)? '<strong>' : '')  + 
								((data[i] > 999)? '$'+ numberFormatter(data[i]):data[i]) + 
								((b)? '</strong>' : '')  + '</td></tr>')
						
						}else if(i)
							this.infoDebtstbody.append('<tr><td>'  + i +'</td><th><h3><strong>' + ((data[i] > 999)? '$'+ numberFormatter(data[i]):data[i]) + '</strong></h3></th></tr>')
	 	 			}

			 	}.bind(this));
			} else {
			 	Titan.popup.warning('ingrese el monto del abono');
			}
		}else {
		 	Titan.popup.warning('seleccione una deuda primero');
		}
	},

	calcularMinimo: function () {

		if (Titan.modules.Pagos.tablapagos.bootstrapTable('getSelections').length >=1) {

			//if (this.campo_abono.val()!='') {
				var a = WebService.post({
					route: 'deudor/calcularAbonoMinimo/',
					abono: this.campo_abono.val(),
					fecha: Titan.modules.Pagos.campoFechaLiquidacion.val(),
					debt: Titan.modules.Pagos.tablapagos.bootstrapTable('getSelections')[0],
				});

			 	a.done(	function  (response) {
			 			
			 		this.infoDebtstbody.html('');
			 		var data = response.liquidation[0];

			 		var datosResaltados = ['total Servicios', 'total Interes por cobrar', 'total del abono', 'gastos de cobranza'];
		 	 				console.log(response,datosResaltados);
					for(i in data){
						if(i != 'total del abono'){
							var b = (datosResaltados.contains(i))? true:false;

							this.infoDebtstbody.append('<tr><td>'+ 
								((b)? '<strong>' : '') + i + ((b)? '</strong>' : '') 
								+'</td><td>'+ ((b)? '<strong>' : '')  + 
								((data[i] > 999)? '$'+ numberFormatter(data[i]):data[i]) + 
								((b)? '</strong>' : '')  + '</td></tr>')
						
						}else if(i)
							this.infoDebtstbody.append('<tr><td>'  + i +'</td><th><h3><strong>' + ((data[i] > 999)? '$'+ numberFormatter(data[i]):data[i]) + '</strong></h3></th></tr>')
	 	 			}

			 	}.bind(this));
			//} else {
			 //	Titan.popup.warning('ingrese el monto del abono');
			//}
		}else {
		 	Titan.popup.warning('seleccione una deuda primero');
		}
	},


});
/*

 * @module  Codeudores

 *

 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)

 *

 * @license Derechos Reservados de Autor (C) IP Total Software S.A

 */



Titan.modules.create({



	name: 'Codeudores',

	

	/*

	 * @constructor

	 * @description inicia los componentes del módulo

	 */

	ready: function () {

		//init components

		this.container = $('#codeudor-container');

		this.tablaInforme = this.container.find('#tabla_codeudores');

		//this.tablaInforme.bootstrapTable();



		this.thead = this.tablaInforme.find('thead > tr').first();

		this.tbody = this.tablaInforme.find('tbody').first();

		this.descripcion = this.container.find('#descripcion');



		this.btnSave = this.container.find('#save');	

		console.log('cargando data codeudores');	 	

		this.informe();



	},



	/*

	 * @name initEvents

	 * @description inicia los eventos de los componentes del módulo

	 * @return {void}

	 */

	initEvents: function () {

		Titan.click('btnSave', 'save', this);

	},





	update_table: function () {		

		this.buscar(Titan.global['deudor_id']);

	},



	save: function () {



		var descripcion = this.descripcion.val();



		if ($.trim(descripcion) !='') {

		

			

			var params = {

				'route': 'deudor/save_reports', 

				'id_deudor': Titan.global['deudor_id'],

				'__u__': __u__,

				'description': descripcion

			};

			var a = WebService.post(params);



			a.done(function  (response) {



				if(response.StatusResult){

					this.descripcion.val('');

					this.update_table();

					Titan.popup.success('El reporte se guardó exitosamente');

				}else{

					Titan.popup.danger('Error al guardar el reporte');

				}

					

			}.bind(this));

		} else{

			Titan.popup.warning('Escriba primero el reporte');

		};

				

	},

	



	/**

	* carga la estructura de la tabla 

	*/

	informe:function(){



		console.log('informe metod');	 	

		var params = {

			route: 'crud/load', 
			nodata: true, 
			'data_table': 'cosigner'

		}



		var a = WebService.post(params);



	 	a.done(	function  (response) {

	 		console.log(response);	 	 		

	 		this.loadStruct(response.struct);

	 		this.tablaInforme.bootstrapTable('destroy');

    		this.tablaInforme.bootstrapTable();

	 	}.bind(this));



    },



    loadData: function (arreglo) {    	

    	this.tablaInforme.bootstrapTable('load', arreglo);

    },



    loadStruct:function(estructura){

    	for(var i in estructura){

    		if (i != 'id' &&i != 'debtor') 

    			this.thead.append('<th data-field="' + i + '">' + estructura[i].name+ '</th>');

    	}

    },



    buscar: function (id) {

		this.tbody.html('');

		var a = WebService.post({route: 'deudor/query_cosigners', 'id_deudor': id});	



		a.done(function(response){	

			if(response.StatusResult == 'OK'){

				this.descripcion.val('');

				console.log(response.cosigners);

				this.loadData(response.cosigners);	



			}else{

				this.tbody.html('');

				this.tablaInforme.bootstrapTable('destroy');

    			this.tablaInforme.bootstrapTable();

			}

				

		}.bind(this));   		

    		

	},  



	deshabilitar:function(sentinela){

		 this.descripcion.attr('disabled', 'disabled');

		 this.btnSave.attr('disabled', 'disabled');

		 this.tbody.html(' ');



	},



	habilitar:function(sentinela){

		 this.descripcion.removeAttr('disabled', 'disabled');

		 this.btnSave.removeAttr('disabled', 'disabled');

	}

});



/*
 * @module  index
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */
Titan.modules.create({
	name: 'index',
	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components
		Titan.view( 'llamadas', 'reportes_de_llamadas','informe_de_llamada_tab');
		Titan.view( 'liquidacion', 'informacion_del_deudor','informacion_Deudor_tab');
		Titan.view( 'liquidacion', 'pagos','pagos_tab');
		Titan.view( 'liquidacion', 'codeudores','codeudores_tab');
		Titan.view( 'liquidacion', 'informe_de_pagos','informe_pagos_tab');
		Titan.view( 'liquidacion', 'referencias','referencias_tab');
	},

});/*
 * @module  Login
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */
Titan.modules.create({

	name: 'Informacion_del_deudor',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components
		this.info_deudor_field = $('#busca_Deudor');
		this.info_deudor_field.mask('0#');
		this.btn_buscar = $('#btn_buscar');
		this.containerInfo = $('#content-information-deudor');
		this.panelInfo = $('#panel-content-info');
		this.nombre_deudor = $('#nombre');
		this.table = $('#tabla-info');
		
		this.select_sucursal = $('#select_sucursales');
		this.select_sucursal.hide();
	},

	/*
	 * @name initEvents
	 * @description inicia los eventos de los componentes del módulo
	 * @return {void}
	 */

	initEvents: function () {
		Titan.click('btn_buscar', 'ejecutarBusqueda', this);
		Titan.keypress('info_deudor_field', 'buscar', this);
		this.select_sucursal.on('change',  function(event) {
			 this.cargarData(this.select_sucursal.val());
		}.bind(this));	
	},


	ejecutarBusqueda: function () {
		if(this.info_deudor_field.val() == ''){
					Titan.popup.danger('Debe ingresar el número de cedula del deudor! ');
					this.panelInfo.hide();
				}else{
		var a = WebService.post({route: 'deudor/search_debtor', 'dni': this.info_deudor_field.val()});	

					a.done(function(data){

						if(data.StatusResult == 'OK'){
							//guardamos la informacion del deudor
							this.deudores = data.deudores;
							this.sucursales = data.sucursales;
							
							
							if(this.sucursales.length <= 1){
								this.cargarData(0);
								this.select_sucursal.hide();
							}else{
								this.select_sucursal.html("");
								this.select_sucursal.append("<option value='-1'> -- seleccione la sucursal -- </option>");
								
								for(i in this.sucursales)
									if(i < this.sucursales.length)
										this.select_sucursal.append("<option value='" + i +  "'>" + this.sucursales[i].name + "</option>");
								this.select_sucursal.show();
								
								this.limpiar();
							}

						}else{
							Titan.popup.info(data.ErrorMessage );
							Titan.modules['Reportes_de_llamadas'].deshabilitar();	
							this.panelInfo.hide();	
					     }	
				    }.bind(this));	
				}
	},
	
	buscar: function (e) {
		
		  var tecla = (document.all) ? e.keyCode : e.which;
		  if (tecla==13){
			  
			  console.log("buscando deudor ...");
				
				this.dato_encontrado = false;

				if(this.info_deudor_field.val() == ''){
					Titan.popup.danger('Debe ingresar el número de cedula del deudor! ');
					this.panelInfo.hide();
				}else{
					this.ejecutarBusqueda();
				}	
		  }
			
	},	

	cargarData: function (index) {
		console.log("cargando la informacion del deudor ...");
		this.dato_encontrado = false;
		this.deudor = this.deudores[index];
		Titan.global['deudor_id'] = this.deudor.id;
	    this.dato_encontrado = true;
	    
	    this.limpiar();
	   
	    var params = {
	    		route: 'deudor/search', 
	    		'dni': this.deudor.dni,
	    		'sucursal': this.sucursales[index].id,
	    	};
	    
	    var a = WebService.post(params);	

		a.done(function(data){

			if(data.StatusResult == 'OK'){
			    this.table.bootstrapTable('destroy');
			    this.containerInfo.html(''); 
			    
			    var deudorLast = data.deudor;
			    console.log(deudorLast.Sucursal.name);

			    if (deudorLast.status == '0') {
			    	this.panelInfo.addClass('panel-danger');

			    	Titan.popup.error('Este deudor ha sido deshabilitado en el sistema', 5000);
			    } else{
			    	this.panelInfo.removeClass('panel-danger');
			    }
			    
				for(i in deudorLast){
					if(deudorLast[i]){
						if(i != 'Código' &&i != 'id' &&i != 'status' )
							this.containerInfo.append('<tr><td>' + i + ':</td><td>' + ((typeof deudorLast[i] == 'object')? deudorLast[i].name : deudorLast[i]) + '</td></tr>');										
				    }					
			    }
				delete deudorLast;
			   
			   // this.table.bootstrapTable();
			    this.panelInfo.show();
			}
		}.bind(this));
		
		Titan.global['deudor'] = this.deudor;
		Titan.global['id_subsidiary'] = this.sucursales[index].id;
		Titan.global['id_deudor'] = this.deudores[index].id;
		
		
	    Titan.modules['Reportes_de_llamadas'].buscar(this.deudor.id);
	    Titan.modules['Reportes_de_llamadas'].habilitar();
		Titan.modules['Reportes_de_llamadas'].cancel();
		
	    Titan.modules['Codeudores'].buscar(this.deudor.id);
	    Titan.modules['Pagos'].buscar(this.deudor.dni);
	    Titan.modules['Informe_de_pagos'].buscar(this.deudor.id);
	    Titan.modules['Referencias'].buscar_personales(this.deudor.id);
	    Titan.modules['Referencias'].buscar_comerciales(this.deudor.id);
	    Titan.modules['Pagos'].habilitar();
		
	},	
	
	limpiar: function (){
		this.panelInfo.hide();
		 this.table.bootstrapTable('load', {});
		Titan.modules['Pagos'].limpiar();
		Titan.modules['Reportes_de_llamadas'].cancel();
	    //Titan.modules['Codeudores'].buscar(this.deudor.id);
	    
	    //Titan.modules['Informe_de_pagos'].buscar(this.deudor.id);
	    //Titan.modules['Referencias'].buscar_comerciales(this.deudor.id);
	},

});/*

 * @module  Login

 *

 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)

 *

 * @license Derechos Reservados de Autor (C) IP Total Software S.A

 */

Titan.modules.create({



	name: 'Informe_de_llamadas',



	/*

	 * @constructor

	 * @description inicia los componentes del módulo

	 */

	ready: function () {

		//init components

		this.container = $('#informe-de-llamadas-container');

		this.tablaInforme = this.container.find('#tabla_informe');

		//this.tablaInforme.bootstrapTable();



		this.thead = this.tablaInforme.find('thead > tr').first();

		this.tbody = this.tablaInforme.find('tbody').first();

		this.descripcion = this.container.find('#descripcion');



		this.btnSave = this.container.find('#save');	

		console.log('cargando data informes');	 	

		this.informe();



	},



	/*

	 * @name initEvents

	 * @description inicia los eventos de los componentes del módulo

	 * @return {void}

	 */

	initEvents: function () {

		Titan.click('btnSave', 'save', this);

	},





	update_table: function () {		

		console.log(' update_table update_table update_table update_table update_table');

		var id_del_deudor = Titan.modules['Informacion_del_deudor'].deudor.id;	

		this.buscar(id_del_deudor);



	},



	save: function () {



		var descripcion = this.descripcion.val();



		if ($.trim(descripcion) !='') {		

			var id = Titan.modules['Informacion_del_deudor'].deudor.id;

			

			var params = {

				'route': 'deudor/save_reports', 

				'id_deudor': id,

				'__u__': __u__,

				'description': descripcion

			}



			var a = WebService.post(params);



			a.done(function  (response) {



				if(response.StatusResult=='OK'){

					this.descripcion.val('');

					this.update_table();

					//Titan.popup.success('El reporte se guardó exitosamente');

				}else{

					Titan.popup.danger('Error al guardar el reporte');

				}

					

			}.bind(this));

		} else{

			Titan.popup.warning('Escriba primero el reporte');

		};

				

	},

	



	/**

	* carga la estructura de la tabla 

	*/

	informe:function(){



		var params = {

			route: 'crud/load', 
			nodata: true, 
			'data_table': 'report'

		}



		var a = WebService.post(params);



	 	a.done(	function  (response) {

	 		console.log(response);	 	 		

	 		this.loadStruct(response.struct);

	 		this.tablaInforme.bootstrapTable('destroy');

    		this.tablaInforme.bootstrapTable();

	 	}.bind(this));



    },



    loadData: function (arreglo) {    	

    	this.tablaInforme.bootstrapTable('load', arreglo);

    },



    loadStruct:function(estructura){

    	for(var i in estructura){

    		if (i != 'id' &&i != 'debtor' ) 

    			this.thead.append('<th data-field="' + i + '">' + estructura[i].name+ '</th>');

    	}

    },



    buscar: function (id) {

		this.tbody.html('');

		var a = WebService.post({route: 'deudor/query_reports', 'id_deudor': id});	



		a.done(function(response){	

			if(response.StatusResult == 'OK'){

				this.descripcion.val('');

				this.loadData(response.reports);	



			}else{

				this.tbody.html('');

				this.tablaInforme.bootstrapTable('destroy');

    			this.tablaInforme.bootstrapTable();

			}

				

		}.bind(this));   		

    		

	},  



	deshabilitar:function(sentinela){

		 this.descripcion.attr('disabled', 'disabled');

		 this.btnSave.attr('disabled', 'disabled');

		 this.tbody.html(' ');



	},



	habilitar:function(sentinela){

		 this.descripcion.removeAttr('disabled', 'disabled');

		 this.btnSave.removeAttr('disabled', 'disabled');

	}

});



Titan.modules.create({



	name: 'Informe_de_pagos',

	

	/*

	 * @constructor

	 * @description inicia los componentes del módulo

	 */

	ready: function () {

		//init components

		this.container = $('#informe-pagos-container');

		this.tabla_informe_pagos = this.container.find('#tabla_pagos');

		

		this.thead = this.tabla_informe_pagos.find('thead > tr').first();

		this.tbody = this.tabla_informe_pagos.find('tbody').first();		

		

		console.log('cargando data pagos');	 	

		this.informe();



	},



	/*

	 * @name initEvents

	 * @description inicia los eventos de los componentes del módulo

	 * @return {void}

	 */

	initEvents: function () {

	},





	update_table: function () {		

	},	



	/**

	* carga la estructura de la tabla 

	*/

	informe:function(){



		console.log('informe metod');	 	

		var params = {

			route: 'crud/load', 
			nodata: true, 
			'data_table': 'payment'

		}



		var a = WebService.post(params);



	 	a.done(	function  (response) {

	 		console.log(response);	 	 		

	 		this.loadStruct(response.struct);

	 		this.tabla_informe_pagos.bootstrapTable('destroy');

    		this.tabla_informe_pagos.bootstrapTable();

	 	}.bind(this));



    },



    loadData: function (arreglo) {    	

    	this.tabla_informe_pagos.bootstrapTable('load', arreglo);

    },



    loadStruct:function(estructura){

    	for(var i in estructura){

    		if (i != 'id' &&i != 'debtor') 

    			this.thead.append('<th data-field="' + i + '">' + estructura[i].name+ '</th>');

    	}

    },



    buscar: function (id) {



		this.tbody.html('');

		this.id_ = id;



		var a = WebService.post({route: 'pagos/query_payment', 'id_deudor': id});	



		a.done(function(response){	

			if(response.StatusResult == 'OK'){

				this.loadData(response.payment);

				

			}else{

				this.tbody.html('');

				this.tabla_informe_pagos.bootstrapTable('destroy');

    			this.tabla_informe_pagos.bootstrapTable();

			}

				

		}.bind(this));   		

    		

	},  



	

});



/*
 * @module  Pagos
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */
Titan.modules.create({
	name: 'Pagos',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		this.container = $('#informe-de-pagos-container');
		this.tablapagos= this.container.find('#tabla_pagos');
		this.thead = this.tablapagos.find('thead > tr').first();
		this.tbody = this.tablapagos.find('tbody').first();
		this.abono_deuda = this.container.find('#abono_deuda');
		this.abono_deuda.mask('0#');
		this.labelInfo = this.container.find('#monto');
		this.btnSave = this.container.find('#save');
		this.saldo_deuda= this.container.find('#saldo_deuda');
		this.infoDebts = this.container.find('#data-debts');
		this.infoDebtstbody = this.infoDebts.find('tbody').first();
		this.campoFechaLiquidacion = this.container.find('#date-liquidation');
		this.campoFechaLiquidacion.datepicker({
	      changeMonth: true,
	      changeYear: true
	    });

		this.btnCalcularLiquidacion = this.container.find('#btn-liquidation');
		this.infoDebtsManual = this.container.find('#data-debts-manual');
		this.infoDebtstbodyManual = this.infoDebtsManual.find('tbody').first();

		//liquidacion manual
		this.campoSucursales = this.container.find('#sucursales-deuda');
		this.campoFechaPagoManual = this.container.find('#fecha-deuda');
		this.campoFechaPagoManual.datepicker({
	      changeMonth: true,
	      changeYear: true
	    });
		this.campoSaldoManual = this.container.find('#saldo-deuda');
		this.campoSaldoManual.mask('0#');
		this.campoFechaLiquidacionManual = this.container.find('#fecha-liquidacion');
		this.campoFechaLiquidacionManual.datepicker({
	      changeMonth: true,
	      changeYear: true
	    });
		this.campoFechaLiquidacionManual.val(this.ultimoDiaDelMes());
		this.btnCalcularLiquidacionManual = this.container.find('#btn-fecha-liquidacion');
		Titan.view( 'liquidacion', 'abono','abonos_deuda');

		this.count = $("#badge_liquidacion");
		this.count.hide();	

		this.sucursales();
		this.informe();
	},



	initEvents: function () {

		Titan.click('btnSave', 'confirmationSave', this);

		Titan.click('btnCalcularLiquidacion', 'calcularLiquidacion', this);

		Titan.click('btnCalcularLiquidacionManual', 'calcularLiquidacionManual', this);

		//Titan.keypress('abono_deuda', 'loadAmount', this);

			

	},



	sucursales: function () {

		var a = WebService.post({route: 'query/sucursales'});



	 	a.done(	function  (response) {

	 		this.campoSucursales.html('');



	 		var sucursales  = response.sucursales;

	 		for (var i = sucursales.length - 1; i >= 0; i--) {

	 			var s = sucursales[i];

	 			this.campoSucursales.append('<option  >' + s.name + '</option>')

	 		}



	 	}.bind(this));

	},





	calcularLiquidacionManual: function () {



		if (this.campoSaldoManual.val() == '' || this.campoSaldoManual.val() <= '0') {

			Titan.popup.warning('Ingrese el saldo');

			return;

		}



		if (this.campoFechaPagoManual.val() == '') {

			Titan.popup.warning('elija la fecha del último pago');

			return;

		}



		



		var params = {

			route: 'deudor/calculateLiquidationManual', 

			'sucursal': this.campoSucursales.val(),

			'fechaPago': this.campoFechaPagoManual.val(),

			'saldo': this.campoSaldoManual.val(),

			'fechaLiquidacion': this.campoFechaLiquidacionManual.val(),

		}



		var a = WebService.post(params);



	 	a.done(	function  (response) {

	 		console.log(response);	

	 		this.infoDebtstbodyManual.html('');

	 		var data = response.liquidation;



	 		var datosResaltados = ['total Servicios', 'total Interes por cobrar', 'Procredito', 'gastos de cobranza'];



	 		for(k in data){

	 			if(k!='contains'){

	 				//this.infoDebtstbody.append('<tr><td>deuda #' + k + '</td><td></td></tr>')

 	 				

					for(i in data[k]){

						if(i != 'total por cobrar'){

							var b = (datosResaltados.contains(i))? true:false;



							this.infoDebtstbodyManual.append('<tr><td>'+ 

								((b)? '<strong>' : '') + i + ((b)? '</strong>' : '') 

								+'</td><td>'+ ((b)? '<strong>' : '')  + 

								((data[k][i] > 999)? '$'+ numberFormatter(data[k][i]):data[k][i]) + 

								((b)? '</strong>' : '')  + '</td></tr>')

						

						}else if(i)

							this.infoDebtstbodyManual.append('<tr><td>'  + i +'</td><th><h3><strong>' + ((data[k][i] > 999)? '$'+ numberFormatter(data[k][i]):data[k][i]) + '</strong></h3></th></tr>')

	 	 				

	 	 			}

 	 			}

 	 		}

	 		

	 	}.bind(this));

	},



	calcularLiquidacion: function () {



		if (Titan.modules.Pagos.tablapagos.bootstrapTable('getSelections').length >=1) {

			var params = {

				route: 'deudor/calculateLiquidation', 

				'debts': this.tablapagos.bootstrapTable('getSelections'),

				'fecha': this.campoFechaLiquidacion.val(),

			}



			var a = WebService.post(params);



		 	a.done(	function  (response) {

		 		console.log(response);	

		 		this.infoDebtstbody.html('');

		 		var data = response.liquidation;



		 		var datosResaltados = ['total Servicios', 'total Interes por cobrar', 'Procredito', 'gastos de cobranza'];



		 		for(k in data){

		 			if(k!='contains'){

		 				//this.infoDebtstbody.append('<tr><td>deuda #' + k + '</td><td></td></tr>')

	 	 				

						for(i in data[k]){

							if(i != 'total por cobrar'){

								var b = (datosResaltados.contains(i))? true:false;



								this.infoDebtstbody.append('<tr><td>'+ 

									((b)? '<strong>' : '') + i + ((b)? '</strong>' : '') 

									+'</td><td>'+ ((b)? '<strong>' : '')  + 

									((data[k][i] > 999)? '$'+ numberFormatter(data[k][i]):data[k][i]) + 

									((b)? '</strong>' : '')  + '</td></tr>')

							

							}else if(i)

								this.infoDebtstbody.append('<tr><td>'  + i +'</td><th><h3><strong>' + ((data[k][i] > 999)? '$'+ numberFormatter(data[k][i]):data[k][i]) + '</strong></h3></th></tr>')

		 	 				

		 	 			}

	 	 			}

	 	 		}

		 		

		 	}.bind(this));

		}else {

		 	Titan.popup.warning('seleccione una deuda primero');

		}

	},



	confirmationSave: function () {

		Titan.message.confirmation('Guardar Pago','Desea confirmar el pago',this.save, this);

	},



	update_table: function () {	

		var id_del_deudor = Titan.modules['Informacion_del_deudor'].deudor.id;	

		this.buscar(id_del_deudor);

	},


	ultimoDiaDelMes: function () {
		var today = new Date(); 
		var fecha = new Date(today.getFullYear(), today.getMonth()+1, 0);
		console.log(fecha);	 
		var dia = fecha.getDate();
		var mes = fecha.getMonth() + 1;
		var anno = fecha.getFullYear();
		fecha =  anno +'-' + (mes< 10 ?'0'+mes:mes)+ '-' +  (dia< 10 ?'0'+dia:dia);
		console.log(fecha);	 
		return fecha;
	},



	informe:function(){

		this.campoFechaLiquidacion.val(this.ultimoDiaDelMes()); 	

		console.log('informe metod');	 	

		var params = {

			route: 'crud/load', 
			nodata: true, 
			'data_table': 'debt'

		}



		var a = WebService.post(params);



	 	a.done(	function  (response) {

	 		console.log(response);	 	 		

	 		this.loadStruct(response.struct);

	 		this.tablapagos.bootstrapTable('destroy');

    		this.tablapagos.bootstrapTable();

	 	}.bind(this));



    },



	loadData: function (arreglo) {    	
		this.count.show(); 	
    	arreglo.length > 0? this.count.html(arreglo.length):this.count.hide();
    	this.tablapagos.bootstrapTable('load', arreglo);

    },



    loadStruct:function(estructura){



    	var fieldshiddens = ['id', 'debtor', 'status', 'dni'];



    	for(var i in estructura){

    		if (!fieldshiddens.contains(i)) 

    			this.thead.append('<th data-field="' + i + '" data-formatter="' + i + 'Formatter">' + estructura[i].name+ '</th>');

    			

    	}

    },



    buscar: function (dni) {



		this.tbody.html('');

		this.labelInfo.html('');

		this.abono_deuda.val('');

		console.log(dni);



		var a = WebService.post({route: 'deudor/query_debt', 'dni': dni});	



		a.done(function(response){	

			if(response.StatusResult == 'OK'){



				Titan.global['guardaSaldo'] = response.debts[0].amount;

				

				this.loadData(response.debts);		



				this.labelInfo.html( amountFormatter(response.total_));

				Titan.global['debt'] = response.debts[0];



				this.infoDebtstbody.html('');



				var data = response.data;

				for(i in data)

					if(i)

						this.infoDebtstbody.append('<tr><td>'  + i.replace(/_/mgi, ' ') +'</td><td> ' + ((data[i] > 999)? numberFormatter(data[i]):data[i]) + '</td></tr>')



				//this.infoDebts.bootstrapTable('destroy');

				//this.infoDebts.bootstrapTable();



			}else{

				this.tbody.html('');

				this.tablapagos.bootstrapTable('destroy');

    			this.tablapagos.bootstrapTable();

			}

				

		}.bind(this));   		

    		

	}, 



	save: function () {

		

		this.abono = parseInt( $.trim(this.abono_deuda.val()).valueOf());

		this.monto = parseInt( Titan.global['guardaSaldo'].valueOf());

		

		if (this.abono !='') {



			if(this.abono <= this.monto){							

				this.abono_deuda_ =  this.monto - this.abono;



				var params = {

					'route': 'deuda/save_debt', 

					'abono_deuda': this.abono_deuda_,

					'debt': Titan.global['debt'] 

				};

				var a = WebService.post(params);



				a.done(function  (response) {



					if(response.StatusResult){

						this.save_payment_debtor();

						this.update_table();

						Titan.global['guardaSaldo'] = this.abono_deuda_;

						Titan.popup.success('El abono se guardó exitosamente');

					}else{

						Titan.popup.danger('Error al guardar el abono');

					}



				}.bind(this));	

			}else{

				Titan.popup.danger('Error al guardar el abono');

			}						

		} else{

			Titan.popup.warning('Escriba primero el abono');

		};			

				

	},



	loadAmount:function(){



		this.abono_ = parseInt( $.trim(this.abono_deuda.val()).valueOf());

		this.monto_ = parseInt( Titan.global['guardaSaldo'].valueOf());		

		this.abono_deuda_ =  this.monto - this.abono;



		

    },



	formatAmount:function(amount){

		amount = "" + amount;

		var centavos;

		

		if (amount.contains('.')){

			var amountTotal = amount.split('.');

			var centavos = amountTotal.pop();

			amount = amountTotal.pop();

		}



		



		var tem = amount.split('');

		var z = tem.pop();

		var y = tem.pop();

		var x = tem.pop();



		var w = tem.pop();

		var v = tem.pop();

		var u = tem.pop();



		var t = tem.pop();

		var r = tem.pop();

		var s = tem.pop();



		//debugger;



		var str = '$';



		 str += ((s)?s:''); 

		 str += ((r)?r:''); 

		 str += ((t)?t:''); 

		 str += ((u)?u:''); 

		 str += ((v)?v:''); 

		 str += ((w)?w:''); 

		 str += ((w)?'.':''); 

		 str += ((x)?x:''); 

		 str += ((y)?y:''); 

		 str += ((z)?z:'');



		 return str;

    },



    save_payment_debtor: function () {





		this.abono = parseInt( $.trim(this.abono_deuda.val()).valueOf());

		this.monto = parseInt( Titan.global['guardaSaldo'].valueOf());

		this.abono_deuda_ =  this.monto - this.abono;

		this.id_del_deudor = Titan.modules['Informacion_del_deudor'].deudor.id;	



		var params = {

			'route': 'pagos/save_payment', 

			'id_deudor': this.id_del_deudor,

			'abono_': this.abono,

			'monto_': this.monto,

			'payme_debt': this.abono_deuda_

		};

		var a = WebService.post(params);



		console.log(this.id_del_deudor + "***" + this.abono + "***" + this.monto + "***" + this.abono_deuda_ );



		a.done(function  (response) {

			if(response.StatusResult = 'OK'){

				Titan.modules['Informe_de_pagos'].buscar(this.id_del_deudor);

			}else{

				

			}



		}.bind(this));						

				

	},



    deshabilitar:function(){

		this.abono_deuda.attr('readonly', 'readonly');

		this.btnSave.attr('disabled', 'disabled');

		this.abono_deuda.html('');

	},



	habilitar:function(){

		 this.abono_deuda.removeAttr('readonly', 'readonly');

		 this.btnSave.removeAttr('disabled');

	},

	

	limpiar:function(){

		this.tablapagos.bootstrapTable('load', {});

	},

	updateLiquidation : function() {

	},



});

Titan.modules.create({



	name: 'Referencias',

	

	/*

	 * @constructor

	 * @description inicia los componentes del módulo

	 */

	ready: function () {

		

		this.container = $('#referencias-container');

		

		this.tabl_ref_per= this.container.find('#tabla-referencias-personales');

		this.thead = this.tabl_ref_per.find('thead > tr').first();

		this.tbody = this.tabl_ref_per.find('tbody').first();



		this.tabl_ref_com= this.container.find('#tabla-referencias-comerciales');

		this.whead = this.tabl_ref_com.find('thead > tr').first();

		this.wbody = this.tabl_ref_com.find('tbody').first();	



		this.informe_persona();

		this.informe_business();



	},



	informe_persona:function(){



		console.log('informe_persona metod');	 	

		var params = {

			route: 'crud/load', 
			nodata: true, 

			'data_table': 'debtor_personal_reference'

		}



		var a = WebService.post(params);



	 	a.done(	function  (response) {

	 		console.log(response);	 	 		

	 		this.loadStruct_personal(response.struct);

	 		this.tabl_ref_per.bootstrapTable('destroy');

    		this.tabl_ref_per.bootstrapTable();

	 	}.bind(this));



    },



    informe_business:function(){



		console.log('informe_business metod');	 	

		var params = {

			route: 'crud/load', 
			nodata: true, 
			'data_table': 'debtor_business_reference'

		};



		var a = WebService.post(params);



	 	a.done(	function  (response) {

	 		console.log(response);	 	 		

	 		this.loadStruct_business(response.struct);

	 		this.tabl_ref_com.bootstrapTable('destroy');

    		this.tabl_ref_com.bootstrapTable();

	 	}.bind(this));



    },



    loadData_personal: function (arreglo) {    	

    	this.tabl_ref_per.bootstrapTable('load', arreglo);

    },



     loadData_business: function (arreglo) {    	

    	this.tabl_ref_com.bootstrapTable('load', arreglo);

    },



    loadStruct_personal:function(estructura){

    	for(var i in estructura){

    		if (i != 'id' &&i != 'debtor') 

    			this.thead.append('<th data-field="' + i + '">' + estructura[i].name+ '</th>');

    	}

    },



     loadStruct_business:function(estructura){

    	for(var i in estructura){

    		if (i != 'id' &&i != 'debtor') 

    			this.whead.append('<th data-field="' + i + '">' + estructura[i].name+ '</th>');

    	}

    },



    buscar_personales: function (id) {



		var a = WebService.post({route: 'referencias/query_payment_personales', 'id_deudor': id});	



		a.done(function(response){	

			if(response.StatusResult == 'OK'){

				this.loadData_personal(response.personal);

				

			}else{

				this.tbody.html('');

				this.tabl_ref_per.bootstrapTable('destroy');

    			this.tabl_ref_per.bootstrapTable();

			}				

		}.bind(this));   		

    		

	},  





	buscar_comerciales: function (id) {



		var a = WebService.post({route: 'referencias/query_payment_business', 'id_deudor': id});	



		a.done(function(response){	

			if(response.StatusResult == 'OK'){

				this.loadData_business(response.business);

				

			}else{

				this.wbody.html('');

				this.tabl_ref_com.bootstrapTable('destroy');

    			this.tabl_ref_com.bootstrapTable();

			}				

		}.bind(this));   		

    		

	}, 



	

});



/*
 * @module  Codeudores
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */
Titan.modules.create({
	name: 'Codeudores',
	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components
		this.container = $('#codeudor-container');
		this.tablaInforme = this.container.find('#tabla_codeudores');
		//this.tablaInforme.bootstrapTable();
		this.thead = this.tablaInforme.find('thead > tr').first();
		this.tbody = this.tablaInforme.find('tbody').first();
		this.descripcion = this.container.find('#descripcion');
		this.btnSave = this.container.find('#save');
		this.count = $("#badge_codeudores");
		this.count.hide();	
		this.informe();
	},

	/*
	 * @name initEvents
	 * @description inicia los eventos de los componentes del módulo
	 * @return {void}
	 */
	initEvents: function () {
		Titan.click('btnSave', 'save', this);
	},

	update_table: function () {		
		this.buscar(Titan.global['deudor_id']);
	},

	save: function () {
		var descripcion = this.descripcion.val();
		if ($.trim(descripcion) !='') {
			var params = {
				'route': 'deudor/save_reports', 
				'id_deudor': Titan.global['deudor_id'],
				'__u__': __u__,
				'description': descripcion
			};

			var a = WebService.post(params);
			a.done(function  (response) {
				if(response.StatusResult){
					this.descripcion.val('');
					this.update_table();
					Titan.popup.success('El reporte se guardó exitosamente');
				}else{
					Titan.popup.danger('Error al guardar el reporte');
				}
			}.bind(this));
		} else
			Titan.popup.warning('Escriba primero el reporte');
	},


	/**
	* carga la estructura de la tabla 
	*/
	informe:function(){

		var params = {
			route: 'crud/load', 
			nodata: true, 
			'data_table': 'cosigner'
		}
		var a = WebService.post(params);
	 	a.done(	function  (response) {

	 		this.loadStruct(response.struct);
	 		this.tablaInforme.bootstrapTable('destroy');
    		this.tablaInforme.bootstrapTable();
	 	}.bind(this));
    },


    loadData: function (arreglo) { 
    	this.count.show(); 	
    	arreglo.length > 0? this.count.html(arreglo.length):this.count.hide();
    	   	
    	this.tablaInforme.bootstrapTable('load', arreglo);
    },

    loadStruct:function(estructura){
    	for(var i in estructura){
    		if (i != 'id' &&i != 'debtor') 
    			this.thead.append('<th data-field="' + i + '">' + estructura[i].name+ '</th>');
    	}
    },

    buscar: function (id) {
		this.tbody.html('');
		var a = WebService.post({route: 'deudor/query_cosigners', 'id_deudor': id});	
		a.done(function(response){	
			if(response.StatusResult == 'OK'){
				this.descripcion.val('');
				this.loadData(response.cosigners);	
			}else{
				this.count.hide()
				this.tbody.html('');
				this.tablaInforme.bootstrapTable('destroy');
    			this.tablaInforme.bootstrapTable();
			}
		}.bind(this));   		
	},  

	deshabilitar:function(sentinela){
		 this.descripcion.attr('disabled', 'disabled');
		 this.btnSave.attr('disabled', 'disabled');
		 this.tbody.html(' ');
	},

	habilitar:function(sentinela){
		 this.descripcion.removeAttr('disabled', 'disabled');
		 this.btnSave.removeAttr('disabled', 'disabled');
	},

	limpiar: function (){
		this.tablaInforme.bootstrapTable('load', {});
	},

});



/*

 * @module  Pagos

 *

 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)

 *

 * @license Derechos Reservados de Autor (C) IP Total Software S.A

 */



Titan.modules.create({



	name : 'Compromisos',



	/*

	 * @constructor @description inicia los componentes del módulo

	 */

	ready : function() {



		this.container = $('#compromisos-de-pagos-container');



		this.tablapagos = this.container.find('#tabla_pagos');

		this.thead = this.tablapagos.find('thead > tr').first();

		this.tbody = this.tablapagos.find('tbody').first();

		this.abono_deuda = this.container.find('#abono_deuda');

		this.abono_deuda.mask('0#');

		this.labelInfo = this.container.find('#monto');

		this.btnSave = this.container.find('#save');

		this.saldo_deuda = this.container.find('#saldo_deuda');



		this.informe();



	},



	initEvents : function() {

		Titan.click('btnSave', 'confirmationSave', this);

		// Titan.keypress('abono_deuda', 'loadAmount', this);



	},



	confirmationSave : function() {

		Titan.message.confirmation('Guardar Pago', 'Desea confirmar el pago',

				this.save, this);

	},



	update_table : function() {

		var id_del_deudor = Titan.modules['Informacion_del_deudor'].deudor.id;

		this.buscar(id_del_deudor);

	},



	informe : function() {



		console.log('informe metod');

		var params = {

			route : 'crud/load',
			nodata: true, 
			'data_table' : 'debt'

		}



		var a = WebService.post(params);



		a.done(function(response) {

			console.log(response);

			this.loadStruct(response.struct);

			this.tablapagos.bootstrapTable('destroy');

			this.tablapagos.bootstrapTable();

		}.bind(this));



	},



	loadData : function(arreglo) {

		this.tablapagos.bootstrapTable('load', arreglo);

	},



	loadStruct : function(estructura) {

		for ( var i in estructura) {

			if (i != 'id' && i != 'debtor')

				this.thead.append('<th data-field="' + i + '" data-formatter="'

						+ i + 'Formatter">' + estructura[i].name + '</th>');



		}

	},



	buscar : function(id) {



		this.tbody.html(' ');

		this.labelInfo.html(' ');

		this.abono_deuda.val('');



		var a = WebService.post({

			route : 'deudor/query_debt',

			'id_deudor' : id

		});



		a.done(function(response) {

			if (response.StatusResult == 'OK') {



				Titan.global['guardaSaldo'] = response.debts[0].amount;



				this.loadData(response.debts);



				this.labelInfo.html(amountFormatter(response.total_));

				Titan.global['debt'] = response.debts[0];



			} else {

				this.tbody.html('');

				this.tablapagos.bootstrapTable('destroy');

				this.tablapagos.bootstrapTable();

			}



		}.bind(this));



	},



	save : function() {



		this.abono = parseInt($.trim(this.abono_deuda.val()).valueOf());

		this.monto = parseInt(Titan.global['guardaSaldo'].valueOf());



		if (this.abono != '') {



			if (this.abono <= this.monto) {

				this.abono_deuda_ = this.monto - this.abono;



				var params = {

					'route' : 'deuda/save_debt',

					'abono_deuda' : this.abono_deuda_,

					'debt' : Titan.global['debt']

				};

				var a = WebService.post(params);



				a.done(function(response) {



					if (response.StatusResult) {

						this.save_payment_debtor();

						this.update_table();

						Titan.global['guardaSaldo'] = this.abono_deuda_;

						Titan.popup.success('El abono se guardó exitosamente');

					} else {

						Titan.popup.danger('Error al guardar el abono');

					}



				}.bind(this));

			} else {

				Titan.popup.danger('Error al guardar el abono');

			}

		} else {

			Titan.popup.warning('Escriba primero el abono');

		}

		;



	},



	loadAmount : function() {



		this.abono_ = parseInt($.trim(this.abono_deuda.val()).valueOf());

		this.monto_ = parseInt(Titan.global['guardaSaldo'].valueOf());

		this.abono_deuda_ = this.monto - this.abono;



	},



	save_payment_debtor : function() {



		this.abono = parseInt($.trim(this.abono_deuda.val()).valueOf());

		this.monto = parseInt(Titan.global['guardaSaldo'].valueOf());

		this.abono_deuda_ = this.monto - this.abono;

		this.id_del_deudor = Titan.modules['Informacion_del_deudor'].deudor.id;



		var params = {

			'route' : 'pagos/save_payment',

			'id_deudor' : this.id_del_deudor,

			'abono_' : this.abono,

			'monto_' : this.monto,

			'payme_debt' : this.abono_deuda_

		};

		var a = WebService.post(params);



		console.log(this.id_del_deudor + "***" + this.abono + "***"

				+ this.monto + "***" + this.abono_deuda_);



		a.done(function(response) {

			if (response.StatusResult = 'OK') {

				Titan.modules['Informe_de_pagos'].buscar(this.id_del_deudor);

			} else {



			}



		}.bind(this));



	},



	deshabilitar : function() {

		this.abono_deuda.attr('readonly', 'readonly');

		this.btnSave.attr('disabled', 'disabled');

		this.abono_deuda.html('');

	},



	habilitar : function() {

		this.abono_deuda.removeAttr('readonly', 'readonly');

		this.btnSave.removeAttr('disabled');

	},

	

	limpiar : function() {



	},



});

/*
 * @module  index
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */

Titan.modules.create({
	name: 'index',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components
		Titan.view( 'llamadas', 'informacion_del_deudor','informacion_Deudor_tab');
		Titan.view( 'liquidacion', 'pagos','liquidacion');
		Titan.view( 'llamadas', 'codeudores','codeudores_tab');
		Titan.view( 'llamadas', 'referencias','referencias_tab');
		Titan.view( 'llamadas', 'reportes_de_llamadas','reportes_de_llamadas');
		Titan.modules['Reportes_de_llamadas'].info = false;
		/*
		Titan.view( 'llamadas', 'informe_de_pagos','informe_pagos_tab');
		Titan.view( 'llamadas', 'compromisos','informe_crud');
		*/
	},
});

/*
 * @module  Informacion_del_deudor
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */

Titan.modules.create({

	name : 'Informacion_del_deudor',

	/*
	 * @constructor @description inicia los componentes del módulo
	 */
	ready : function() {

		this.container = $('#deudores-container');
		this.btn_buscar = $('#btn_buscar');
		this.load_subsidiary = $('#load_subsidiary');

		this.field_one_date = $('#date_init_commitment');
		this.btn_find_commitments_one = $('#btn_find_commitments');

		this.field_range_date_init = $('#date_init_commitment_range');
		this.field_range_date_finish = $('#date_finish_commitment_range');
		this.btn_find_commitments_range = $('#btn_find_commitments_range');




	},

	/*
	 * @name initEvents @description inicia los eventos de los componentes del
	 * módulo @return {void}
	 */
	initEvents : function() {
		this.buscar_sucursal();
		Titan.click('btn_buscar', 'buscar', this);
		Titan.click('btn_find_commitments_one', 'findForOneDate', this);
		Titan.click('btn_find_commitments_range', 'findForTwoDate', this);

		this.load_subsidiary.on('change', function() {
			this.buscar();
		}.bind(this))
	},

	buscar_sucursal : function() {

		var a = WebService.post({
			route : 'deudor/search_subsidiary'
		});

		a.done(function(response) {

			if (response.StatusResult == 'OK') {
				sucursales_ = response.sucursal;
				this.id_sucursal = sucursales_.id;

				for (var j = 0; j < sucursales_.length; j++) {
					this.load_subsidiary.append('<option value="'
							+ sucursales_[j].id + '" >' + sucursales_[j].name
							+ '</option>');
				}
				this.buscar();
			}
		}.bind(this));

	},

	nextIndex : function() {
		this.index++;
		this.setSelectedIndex(this.index);
	},

	buscar : function() {
		this.lista = $('#deudores-container');
		this.lista.html('');
		this.guarda_Sucursal = this.load_subsidiary.val();

		var params = {
			route : 'deudor/query_debtor_subsidiary',
			'sucursal_id' : this.guarda_Sucursal
		};

		var a = WebService.post(params);

		a.done(function(response) {

			if (response.StatusResult == 'OK') {
				this.processRenspose(response);
			} else {
				this.tbody.html('');
			}

		}.bind(this));

	},



	findForOneDate : function() {
		this.lista = $('#deudores-container');
		this.lista.html('');

		var params = {
			route : 'deudor/query_debtor_commitment_one',
			'date_init' : this.field_one_date.val(),
		};

		var a = WebService.post(params);

		a.done(function(response) {

			if (response.StatusResult == 'OK') {
				if (response.commitments) {
					this.processRenspose(response);
					Titan.popup.success('Se encontraron deudores');
					$('#for_day').modal('hide');
				}
			} else {
				Titan.popup.warning(
						'No se encontraron deudores para esta fecha', 4000);
			}

		}.bind(this));

	},

	findForTwoDate : function() {
		this.lista = $('#deudores-container');
		this.lista.html('');

		var params = {
			route : 'deudor/query_debtor_commitment_two',
			'date_init' : this.field_range_date_init.val(),
			'date_finish' : this.field_range_date_finish.val(),
		};

		var a = WebService.post(params);

		a.done(function(response) {

			if (response.StatusResult == 'OK') {
				if (response.commitments) {
					this.processRenspose(response);
					Titan.popup.success('Se encontraron deudores');
					$('#for_range').modal('hide');
				}
			} else {
				Titan.popup.warning(
						'No se encontraron deudores para estas fechas', 4000);
			}

		}.bind(this));

	},

	processRenspose : function(response) {
		this.debtors = response.deudores;
		this.deudas = response.otrasDeudas;

		var data = [];

		for (var i = 0; i < this.debtors.length; i++) {
			var debtor = this.debtors[i];
			var debts = this.deudas[i];
			var amount = 0;

			if (debts != null)
				for (var k = debts.length - 1; k >= 0; k--)
					amount += parseInt(debts[k].amount);
			else
				console.log(debtor);

			data.push({

				l1 : (i + 1) + ') Nombre:',
				r1 : '',

				l2 : debtor.name + ' ' + debtor.last_name,
				r2 : '$' + numberFormatter(amount),

				l3 : 'Teléfono: ' + debtor.phone_number_1,
				r3 : 'Código: ' + debtor.id,

				l4 : 'Cédula: ',
				r4 : debtor.dni

			});

		}

		this.lista.listMenu('load', data);
		this.lista.listMenu('onClick', this.onClickLista.bind(this));
	},

	onClickLista : function(e) {

		var debtor = this.lista.listMenu('getSelected');
		var id = debtor.r3.match(/[0-9]+/gmi)[0];
		var dni = debtor.r4;

		this.index = this.lista.listMenu('getIndex');
		this.deudor = this.debtors[this.index];


		Titan.global['id_subsidiary'] = this.load_subsidiary.val();
		Titan.global['id_deudor'] = this.deudor.id;
		Titan.global['deudor'] = this.deudor;
		Titan.global['dni'] = dni;

		

		Titan.modules['Pagos'].buscar(dni);
		Titan.modules['Reportes_de_llamadas'].buscar(this.deudor.id);
		Titan.modules['Reportes_de_llamadas'].habilitar();
		Titan.modules['Reportes_de_llamadas'].cancel();
		Titan.modules['Codeudores'].buscar(this.deudor.id);
		Titan.modules['Referencias'].buscar_personales(this.deudor.id);

	},

	updateLiquidation : function() {

	},

	limpiar : function() {

	},

});Titan.modules.create({



	name: 'Informe_de_pagos',

	

	/*

	 * @constructor

	 * @description inicia los componentes del módulo

	 */

	ready: function () {

		//init components

		this.container = $('#informe-pagos-container');

		this.tabla_informe_pagos = this.container.find('#tabla_pagos');

		

		this.thead = this.tabla_informe_pagos.find('thead > tr').first();

		this.tbody = this.tabla_informe_pagos.find('tbody').first();		

		

		console.log('cargando data pagos');	 	

		this.informe();



	},



	/*

	 * @name initEvents

	 * @description inicia los eventos de los componentes del módulo

	 * @return {void}

	 */

	initEvents: function () {

	},





	update_table: function () {		

	},	



	/**

	* carga la estructura de la tabla 

	*/

	informe:function(){



		console.log('informe metod');	 	

		var params = {

			route: 'crud/load', 
			nodata: true, 
			'data_table': 'payment'

		}



		var a = WebService.post(params);



	 	a.done(	function  (response) {

	 		console.log(response);	 	 		

	 		this.loadStruct(response.struct);

	 		this.tabla_informe_pagos.bootstrapTable('destroy');

    		this.tabla_informe_pagos.bootstrapTable();

	 	}.bind(this));



    },



    loadData: function (arreglo) {    	

    	this.tabla_informe_pagos.bootstrapTable('load', arreglo);

    },



    loadStruct:function(estructura){

    	for(var i in estructura){

    		if (i != 'id' &&i != 'debtor') 

    			this.thead.append('<th data-field="' + i + '">' + estructura[i].name+ '</th>');

    	}

    },



    buscar: function (id) {



		this.tbody.html('');

		this.id_ = id;



		var a = WebService.post({route: 'pagos/query_payment', 'id_deudor': id});	



		a.done(function(response){	

			if(response.StatusResult == 'OK'){

				this.loadData(response.payment);

				

			}else{

				this.tbody.html('');

				this.tabla_informe_pagos.bootstrapTable('destroy');

    			this.tabla_informe_pagos.bootstrapTable();

			}

				

		}.bind(this));   		

    		

	},  



limpiar: function (){

		

	},

	

});



/*
 * @module  Pagos
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */

Titan.modules.create({

	name: 'Pagos',
	
	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {

		this.container = $('#informe-de-pagos-container');	
		this.formu = this.container.find('#image_upload_form');
	},

	initEvents: function () {	
		this.formu.on('submit',(this.save));
	},	 

	save: function (e) {	
		
        e.preventDefault();	

        $.ajax({
           url: "upload.php",
			type: "POST",
			data:  new FormData(this),
			contentType: false,
    	    cache: false,
			processData:false,
			success: function(data)
		    {
			$("#targetLayer").html(data);
		    },
		  	error: function() 
	    	{
	    	} 
        });
	},

limpiar: function (){
		
	},

});
Titan.modules.create({
	name: 'Referencias',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {

		this.container = $('#referencias-container');
		this.tabl_ref_per= this.container.find('#tabla-referencias-personales');
		this.thead = this.tabl_ref_per.find('thead > tr').first();
		this.tbody = this.tabl_ref_per.find('tbody').first();
		this.count = $("#badge_referencias");
		this.count.hide();
		this.informe_persona();
	},

	informe_persona:function(){
		var params = {
			route: 'crud/load', 
			nodata: true, 
			'data_table': 'debtor_personal_reference'
		}
		var a = WebService.post(params);
	 	a.done(	function  (response) {
	 		this.loadStruct_personal(response.struct);
	 		this.tabl_ref_per.bootstrapTable('destroy');
    		this.tabl_ref_per.bootstrapTable();
	 	}.bind(this));
    },

    loadData_personal: function (arreglo) {   
    	this.count.show(); 	
    	this.count.html(arreglo.length);
    	this.tabl_ref_per.bootstrapTable('load', arreglo);
    },

    loadStruct_personal:function(estructura){
    	for(var i in estructura){
    		if (i != 'id' &&i != 'debtor') 
    			this.thead.append('<th data-field="' + i + '">' + estructura[i].name+ '</th>');
    	}
    },

    buscar_personales: function (id) {
		var a = WebService.post({route: 'referencias/query_payment_personales', 'id_deudor': id});	
		a.done(function(response){	
			if(response.StatusResult == 'OK'){
				this.loadData_personal(response.personal);
			}else{
				this.count.hide()
				this.tbody.html('');
				this.tabl_ref_per.bootstrapTable('destroy');
    			this.tabl_ref_per.bootstrapTable();
			}				
		}.bind(this));   		
	},  

});/*
 * @module  Login
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */

Titan.modules.create({
	name: 'Reportes_de_llamadas',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components
		this.container = $('#reportes-de-llamadas-container');
		this.tablareportes = this.container.find('#tabla_reportes');
		this.thead = this.tablareportes.find('thead > tr').first();
		this.tbody = this.tablareportes.find('tbody').first();
	
		this.descripcion = this.container.find('#descripcion');
		this.selectEstadoDeuda = this.container.find('#estado-deuda');
		this.colorStatus = this.container.find('#status_color');
		this.campoReport = this.container.find('#id_reporte');
		
		this.btnSave = this.container.find('#save');
		this.btn_update = this.container.find('#update');	
		this.btn_cancel = this.container.find('#cancel');	
		this.btn_update.hide();	
		this.btn_cancel.hide();	

		this.table = $('#tabla-info');
		this.tablaResponsive = this.container.find('.table-responsive');//
		var h = this.tablaResponsive.css('height');
		this.table.attr('data-height', h.replace('px','') );
		this.containerInfo = $('#content-info-deudor');
		this.panelInfo = $('#panel-content-info');
		//si hay que cargar la informacion del deudor
		this.info = true;
		this.campoFechaCompromiso = this.container.find('#fecha-de-compromiso')
		this.reportes();
	},


	/*
	 * @name initEvents
	 * @description inicia los eventos de los componentes del módulo
	 * @return {void}
	 */
	initEvents: function () {

		Titan.click('btnSave', 'save', this);
		Titan.click('btn_update', 'update', this);
		Titan.click('btn_cancel', 'cancel', this);
		//this.tablareportes.on('click-row.bs.table', this.onClickTable.bind(this));

		this.campoFechaCompromiso.on('change',  function(event) {

			var params = {
				'id_deudor': Titan.global['id_deudor'] ,
				route: 'deuda/commitment', 
				'dateCommitment': this.campoFechaCompromiso.val(),
			}

			var a = WebService.post(params);
		 	a.done(	function  (response) {
		 		if(response.StatusResult)
		 			if(response.StatusResult == "OK")
		 				Titan.popup.success('Compromiso de pago guardado '  + this.campoFechaCompromiso.val());	
		 			else
		 				Titan.popup.error('Error al guardar el Compromiso de pago ' + response.StatusResult);	
		 		else
		 			Titan.popup.error('Error al guardar el Compromiso de pago');	

		 	}.bind(this));

		}.bind(this));	

		this.selectEstadoDeuda.on('change',  function(event) {

			var select = event.target;
			var color = $(select).find('option[value='+$(select).val()+']').attr('data-color');
			this.colorStatus.css('background-color', color);

			var params = {
				'id_deudor': Titan.global['id_deudor'] ,
				route: 'deuda/color', 
				'stauts_color': this.selectEstadoDeuda.val(),
			}

			var a = WebService.post(params);

		 	a.done(	function  (response) {
		 		if(response.StatusResult) {
		 			if(response.StatusResult == "OK"){
		 				Titan.popup.success('Estado guardado');	
		 				var module = Titan.modules['Informacion_del_deudor'];
		 				if(module.index){
							var debt = module.deudas[module.index];
							debt.status_color = this.selectEstadoDeuda.val();	
						}
						Titan.modules['Pagos'].buscar(Titan.modules['Informacion_del_deudor'].deudor.dni); 
		 			}else
		 				Titan.popup.error('Error al guardar el Estado' + response.StatusResult);	
		 		}else
		 			Titan.popup.error('Error desconocido al guardar el estado');	

		 	}.bind(this));

		}.bind(this));	

	},



	update_table: function () {		
		this.buscar(Titan.global['id_deudor'] );
	},

	onClickTable: function (e, row, $element) {
		this.btnSave.hide();	
        this.btn_update.show();
		this.btn_cancel.show();	
		this.descripcion.val(row.description);
        this.campoReport.val(row.id);
    },

	cancel: function () {		
		this.descripcion.val('');
        this.campoReport.val('');
        this.btnSave.show();	
        this.btn_update.hide();
		this.btn_cancel.hide();	
	},

	save: function () {
		var descripcion = this.descripcion.val();
		if ($.trim(descripcion) !='') {		

			var params = {
				'route': 'deudor/save_reports_calls', 
				'id_deudor': Titan.global['id_deudor'] ,
				'__u__': __u__,
				'stauts_color': this.selectEstadoDeuda.val(),
				'description': descripcion,
				'sucursal': Titan.global['id_subsidiary'],
			}

			var a = WebService.post(params);

			this.btnSave.html('<img src="img/ajax-loader.gif" />');
			this.btnSave.attr("disabled","disabled");
			a.done(function  (response) {
				if(response.StatusResult=='OK'){
					this.descripcion.val('');
					this.update_table();
				}else{
					Titan.popup.danger('Error al guardar el reporte');
				}

				this.btnSave.html('GUARDAR');
				this.btnSave.removeAttr("disabled");
			}.bind(this));

		} else
			Titan.popup.warning('Escriba primero el reporte');
	},

	update: function () {
		var descripcion = this.descripcion.val();
		var id_report = this.campoReport.val();
		if ($.trim(descripcion) !='') {		

			var params = {
				'route': 'deudor/update_reports_calls', 
				'id_deudor': Titan.global['id_deudor'] ,
				'id_report': id_report,
				'__u__': __u__,
				'description': descripcion,
				'sucursal': Titan.global['id_subsidiary'],
			}

			var a = WebService.post(params);

			a.done(function  (response) {

				if(response.StatusResult=='OK'){
					this.descripcion.val('');
					this.update_table();
					this.cancel();
				}else{
					Titan.popup.danger('Error al guardar el reporte');
				}

			}.bind(this));
		} else
			Titan.popup.warning('Escriba primero el reporte');
	},


	/**
	* carga la estructura de la tabla 
	*/
	reportes:function(){
		var params = {
			route: 'crud/load', 
			nodata: true, 
			'data_table': 'reports_calls_debtor'
		}

		var a = WebService.post(params);
	 	a.done(	function  (response) {
	 		this.loadStruct(response.struct);
	 		this.tablareportes.bootstrapTable('destroy');
    		this.tablareportes.bootstrapTable();
	 	}.bind(this));

	 	var params = {
			route: 'deuda/loadStatus'
		}
		var a = WebService.post(params);
	 	a.done(	function  (response) {
	 		this.colors = response.status;
	 		for (var i = 0; i < response.status.length; i++) {
	 			this.selectEstadoDeuda.append('<option data-color="' + response.status[i].color + '" value="'+response.status[i].id+'" style="background:' + response.status[i].color + '; padding: 8px 16px;">'+response.status[i].name+'</option>')
	 		}
	 	}.bind(this));
    },



    loadData: function (arreglo) {    	
    	
    	this.tablareportes.bootstrapTable('load', arreglo);

    },



    loadStruct:function(estructura){
    	Titan.loader.hide();
    	for(var i in estructura){

    		if (i != 'id' &&i != 'debtor'&&i != 'subsidiary') 

    			this.thead.append('<th data-field="' + i + '">' + estructura[i].name+ '</th>');

    	}

    },



    buscar: function (id) {
    	
    	this.tbody.html('');
		var a = WebService.post({route: 'deudor/query_reports_calls_debtor', 'id_deudor': id});	

		a.done(function(response){	
			if(response.StatusResult == 'OK'){
				this.descripcion.val('');
				this.loadData(response.reports);	
				this.campoFechaCompromiso.val((response.commitment)?response.commitment.date:'');
				Titan.global['deuda'] = response.deuda;
				Titan.global['id_deudor'] = response.deudor.id;
				Titan.global['deudor'] = response.deudor;
				this.selectEstadoDeuda.val(Titan.global['deuda'].status_color);
				var color = this.selectEstadoDeuda.find('option[value='+this.selectEstadoDeuda.val()+']').attr('data-color');
				this.colorStatus.css('background-color', color);
				this.deudor = Titan.global['deudor'];

				if(this.info){
					var a = WebService.post({route: 'deudor/search', 'dni': this.deudor.dni});	
					a.done(function(data){
						if(data.StatusResult == 'OK'){
							this.deudor = data.deudor;
						    this.table.bootstrapTable('destroy');
						    this.containerInfo = $('#content-info-deudor');
						    this.containerInfo.html(''); 

							for(i in this.deudor){
								if(this.deudor[i]){
									if(i != 'Código' &&i != 'id' &&i != 'status' )
										this.containerInfo.append('<tr><td>' + i + ':</td><td>' + ((typeof this.deudor[i] == 'object')? this.deudor[i].name : this.deudor[i]) + '</td></tr>');										
							    }					
						    }

						    this.table.bootstrapTable();
						    this.panelInfo.show();
					     }	
				    }.bind(this));	
				}

			}else{
				this.tbody.html('');
				this.tablareportes.bootstrapTable('destroy');
    			this.tablareportes.bootstrapTable();
			}
		}.bind(this));  
	},  


	deshabilitar:function(){
		 this.descripcion.attr('disabled', 'disabled');
		 this.btnSave.attr('disabled', 'disabled');
		 this.tbody.html(' ');
	},

	habilitar:function(sentinela){
		 this.descripcion.removeAttr('disabled', 'disabled');
		 this.btnSave.removeAttr('disabled', 'disabled');
	},

	limpiar:function(sentinela){
		this.tablareportes.bootstrapTable('load', {});
		this.deshabilitar();
	},
});/*
 * @module  Backup
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */
 Titan.modules.create({

 	name: 'Backup',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	 ready: function () {
		//init components
		this.buttonBackup = $('#buttonBackup');
		this.buttonDownloadBackup = $('#downloadBackup');
		this.buttonDownloadBackup.hide();		
		
	},

	/*
	 * @name initEvents
	 * @description inicia los eventos de los componentes del módulo
	 * @return {void}
	 */
	 initEvents: function () {
	 	Titan.click('buttonBackup', 'createBackup', this);
	 },

	 createBackup: function () {
	 
	 	var r = WebService.post({route: 'security/backup' });

	 	r.done(function  (response) {
	 		if (response.StatusResult == 'OK') {
	 			this.buttonDownloadBackup.attr('href', '//'+location.host+'/bluefolder_backend/'+response.path_backup);
	 			this.buttonDownloadBackup.attr('data-file', response.path_backup);
	 			this.buttonDownloadBackup.show('slow', function() {
	 				this.buttonDownloadBackup.effect('shake');
	 			}.bind(this));
	 			Titan.popup.success('Copia de seguridad creada');
	 		} else{
	 			Titan.popup.info('faliure');
	 		}
	 	}.bind(this));

	 },

	
});/*
 * @module  Login
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */
 Titan.modules.create({
 	name: 'Login',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	 ready: function () {
	 	if(Session.response) {
			this.init(Session.response);
			_database_name = Session.database_name;
		}

		//init components
		this.btnLogin = $('#buttonLogin');
		this.userLogin = $('#inputUser');
		this.passLogin = $('#inputPass');
		this.inputCompany = $('#inputCompany');
		this.btnTerminosCondiciones = $('#terms-cond');
	},

	/*
	 * @name initEvents
	 * @description inicia los eventos de los componentes del módulo
	 * @return {void}
	 */
	 initEvents: function () {

	 	Titan.click('btnLogin', 'initSession', this);

	 	Titan.keypress('userLogin', 'initSessionEnter', this);
	 	Titan.keypress('passLogin', 'initSessionEnter', this);
	 	Titan.keypress('inputCompany', 'initSessionEnter', this);

	 	Titan.click('btnTerminosCondiciones', 'openTerms', this);

	 },

	 initSessionEnter: function (e) {
		  var tecla = (document.all) ? e.keyCode : e.which;
		  if (tecla==13){
			  this.initSession();
		  }
	},	

	 openTerms: function () {
	 	Titan.message.confirmation('Términos y Condiciones', '<iframe src="docs/terminos-y-condiciones.pdf" type="application/pdf" width="100%" height="100%"></iframe>');
	 	$('.modal-body').css('height', '450px');
	 	$('.modal-dialog').addClass('modal-lg')
	 },

	 openTermsLogin: function (response) {
	 	Titan.message.confirmation('Términos y Condiciones', '<iframe src="docs/terminos-y-condiciones.pdf" type="application/pdf" width="100%" height="100%"></iframe>', this.acceptTermsAndConditions, this ,'Acepto', 'No estoy de acuerdo');
	 	$('.modal-body').css('height', '450px');
	 	$('.modal-dialog').addClass('modal-lg')
	 },

	/*
	 * @name initSession
	 * @description envia los datos al webservice login para la autenticacion ante el sistema
	 * @return {void}
	 */
	 initSession: function () {

	 	if($.trim(this.inputCompany.val()) ==''){
			Titan.popup.warning('Ingrese el nombre de la empresa');
			return;
		}

	 	_database_name = null;
	 	var r = WebService.post({route: 'superadmin/company_query', 'company_name': this.inputCompany.val() });

	 	r.done(function  (response) {
	 		if (response.StatusResult == 'OK') {
	 			this.loginModule(response);
	 		} else{
	 			Titan.popup.info('no se encontraron datos de la empresa ' + this.inputCompany.val());
	 		}
	 	}.bind(this));
	 },


	 loginModule: function (response) {

		if($.trim(this.userLogin.val()) ==''){
			Titan.popup.warning('Ingrese su nombre de usuario');
			return;
		}

		if($.trim(this.passLogin.val()) ==''){
			Titan.popup.warning('Ingrese su contraseña');
			return;
		}

		if($.trim(this.passLogin.val()) !='' && $.trim(this.userLogin.val()) !=''){
			_database_name = response.database_name;
			Session.database_name = response.database_name;

			var a = WebService.post({route: 'security/login', 'login[pass]': this.passLogin.val(), 'login[user]': this.userLogin.val() });
			a.done(function  (response) {
				Session.response = response;
				this.init(response);
			}.bind(this));
		}
	 },

	onrefresh: function () {		
		Titan.message.confirmation('¿Desea cerrar la sesión?', 'Si sale de la página la sesión se cerrará automáticamente', this.close, this ,'Cerrar sesión', 'Permanecer en el sistema');
		return false;
	},

	close: function () {
		Titan.modules['Admin'].closeSession();

	},

	init: function (response) {

	 	if(response.StatusResult == 'OK'){
			if (response.count_session <= 0) 
				this.openTermsLogin(response);
			else
				Titan.view(response.module, response.view);

				this.response= response;
				__u__ = response.__u__;
				__u__r=response.__u__r;
				__u__r_= response.__u__r_;
		}else{
			Titan.popup.error(response.ErrorMessage);
		}
	 },


	 /*
	 * @name initSession
	 * @description envia los datos al webservice login para la autenticacion ante el sistema
	 * @return {void}
	 */
	 acceptTermsAndConditions: function () {

	 	var r = WebService.post({route: 'security/terms', 'accept':this.response. __u__});
	 	r.done(function  (response) {
	 		if (response.StatusResult == 'OK') {
	 			Titan.view(this.response.module, this.response.view);
	 			Titan.popup.success('Gracias por aceptar los terminos y condiciones de la plataforma BlueFolder ' );
	 		} else{
	 			Titan.popup.warning('Debes aceptar los terminos y condiciones' + this.inputCompany.val() );
	 		}
	 	}.bind(this));
	 },

});


/*

var tryingToReload = false;
//on before unload
window.onbeforeunload = function(e){ 
	//Firefox and Safari gets argument directly.
    if (!e) {
    	//this is for IE
        e = window.event; 
    }
     // clicked on the close button for IE 
    if (e.clientY != undefined && e.clientY < 0){
        tryingToReload = false;
    }
	// select close from context menu from the right click on title bar on IE
    if (e.clientY != undefined && (e.clientY > 100 && e.clientY < 140))  {
        tryingToReload = false;
    }

    //user hasn't clicked on X close button or hasn't selected close from context menu 
    if (tryingToReload){ 
        tryingToReload = false;
    }

    Titan.modules['Admin'].closeSession();
    return;
}

//attach to key down event to detect the F5 key 
document.onkeydown = function(e){ 
    tryingToReload = false;
 	//Firefox and Safari gets argument directly.
    if (!e) 
    {
        e = window.event;
    }
 
    var key = e.keyCode ? e.keyCode : e.which;
 	//try
    try 
    {
    	//F5 Key detected
        if (key == 116) 
        {
            tryingToReload = true;
        }
    } catch (ex) {}
}
 

document.oncontextmenu = function(e){} //check for the right click
*//*
 * @module  Admin
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */

Titan.modules.create({
	name : 'Admin',
	/*
	 * @constructor @description inicia los componentes del módulo
	 */
	ready : function() {

		// init components
		this.btnMenu = $('#nav-toogle-menu');
		this.btnSalir = $('#salir-session');
		this.slideMenu = $('.menu-slide');
		this.slideMenu.hide();
		this.NavigationMenu = $('#Navigation-menu');
		var menus = __u__r_;

		for (i in menus) {
			if (i < menus.length) {
				this.NavigationMenu.append('<li class="menu-item"  data-id-m="'

						+ menus[i].id + '" data-module="'
						+ menus[i].frontend_module + '" data-view="'
						+ menus[i].frontend_view + '" data-table="'
						+ menus[i].backend_table + '" >'
						+ '<a  data-id-m="' + menus[i].id
						+ '" data-module="' + menus[i].frontend_module
						+ '" data-view="' + menus[i].frontend_view
						+ '" data-table="' + menus[i].backend_table
						+ '" id ="blue-folder-menu-' + menus[i].id + '" >'
						+ '<span class="glyphicon glyphicon-' + menus[i].icon+ '"></span> '
						+ menus[i].name + '</a></li>');
			}
		}

		this.menusItems = $('.menu-item');
		
		var link = this.NavigationMenu.find('a').first();
		_crud = link.attr('data-table');
		_id_m = link.attr('data-id-m');
		Titan.view(link.attr('data-module'), link.attr('data-view'), 'content-admin');

		Titan.loader = {};
		Titan.loader.show = function () {
			$('#loader-content').fadeIn('fast');
		};
		Titan.loader.hide = function () {
			$('#loader-content').fadeOut('fast');
		};

		if (link.attr('data-view') == 'crud')
			Titan.loader.show();
	},

	/*
	 * @name initEvents @description inicia los eventos de los componentes del
	 * módulo @return {void}
	 */
	initEvents : function() {
		Titan.click('btnMenu', 'loadMenu', this);
		Titan.click('btnSalir', 'closeSession', this);
		Titan.click('menusItems', 'clickMenu', this);
	},

	/*
	 * @name clickMenu @description carga la vista usuarios @return {void}
	 */
	clickMenu : function(e) {
		var link = $(e.target);
		if (link.attr('data-view') == 'crud')
			$('#loader-content').fadeIn('fast');

		_moduleObject = link;
		_crud = link.attr('data-table');
		_id_m = link.attr('data-id-m');

		// carga los html,css, javascript
		Titan.view(link.attr('data-module'), link.attr('data-view'), 'content-admin');
		this.slideMenu.toggle('slide');
		Titan.loader.show();
	},

	/*
	 * @name loadMenu @description carga la vista usuarios @return {void}
	 */
	loadMenu : function(e) {
		this.slideMenu.toggle('slide');
	},

	/*
	 * @name closeSession @description carga la vista usuarios @return {void}
	 */
	closeSession : function(e) {
		WebService.post({ route : 'security/logout'}).done(function(data) {
			delete Session.response;
			location.reload();
		});
	},
});/* * @module  Crud * * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz) * * @license Derechos Reservados de Autor (C) IP Total Software S.A */ Titan.modules.create({			name : 'Crud',			/*			 * 			 * @constructor			 * 			 * @description inicia los componentes del módulo			 * 			 */			ready : function() {				// init components				this.moduleContainer = $('#crud-container');				this.optionsCrud = this.moduleContainer.find('#options-crud');				this.context = this.moduleContainer.find('.contextmenu');				// para las llaves foraneas				this.modalCount = 0;				// la tabla				this.tablaResponsive = this.moduleContainer						.find('.table-responsive');//				this.tableCrud = this.moduleContainer.find('#table-crud');				var h = this.tablaResponsive.css('height');				console.log(h);				this.tableCrud.attr('data-height', h.replace('px', ''));				this.thead = this.tableCrud.find('thead > tr').first();				this.tbody = this.tableCrud.find('tbody').first();				// para el formulario				this.modalTitle = this.moduleContainer.find('#modal-crud .modal-title');				this.modal = this.moduleContainer.find('#modal-crud');				this.modal.on('hidden.bs.modal', function (e) {				  if (this.inputdni) {				  	this.inputdni.popover('hide');				  } 				}.bind(this));				this.totalContainer = this.moduleContainer.find('#total');				this.form = this.moduleContainer.find('.modal-body form');				// para el paginador				this.page = 1;				// cantidad de filas que se muestran el la tabla				this.totalRows = 100;				this.loadForPaginator = false;				this.filtrated = false;				this.paginatorContaier = this.moduleContainer						.find('#paginator');				this.index();			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			initEvents : function() {				/*				 * this.tableCrud.on('sort.bs.table', function () {				 * 				 * this.moduleContainer.find('td').attr('nowrap', 'nowrap');				 * 				 * this.moduleContainer.find('td').css('padding', '2px 8px');				 * 				 * 				 * 				 * }.bind(this));				 * 				 */			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			index : function() {				// buscamos los permisos para el modulo				function findMenu(source, name) {					for ( var k in source) {						if (source[k]) {							if (source[k].menu == name) {								return source[k];							}						}					}				}				var permissions = findMenu(__u__r, _id_m);				this.optionsCrud.html('');				if (permissions.p_create == 1) {					this.optionsCrud							.append('<button id="btn-new" title="Nuevo" class="btn btn-default" data-toggle="modal" data-target="#modal-crud">'									+									'<i class="glyphicon glyphicon-plus"></i> '									+									'</button>'							);				}				if (permissions.p_delete == 1) {					this.optionsCrud							.append('<button  id="btn-delete" class="btn btn-default" data-toggle="modal" >'									+									'<i class="glyphicon glyphicon-minus"></i> '									+									'</button>'							);				}				if (permissions.p_update == 1) {					this.optionsCrud							.append('<button  id="btn-edit"  title="Editar"  class="btn btn-default" data-toggle="modal" >'									+									'<i class="glyphicon glyphicon-edit"></i> '									+									'</button>'							);				}				this.optionsCrud						.append('<button  id="btn-filter"  title="Filtrar"  class="btn btn-default" data-toggle="modal">'								+								'<i class="glyphicon glyphicon-search"></i> ' +								'</button>'						);				var params = {					route : 'crud/load',					'data_table' : _crud				};				params.page = this.page;				params.totalRows = this.totalRows;				var a = WebService.post(params);				a						.done(function(data) {							if (!this.loadForPaginator) {								this.tableName = data.table;								this.loadStruct(data.struct);								this.tableCrud.bootstrapTable('destroy');								this.tableCrud.bootstrapTable();							}							this.tbody.html('');							// this.loadData(data.data);							this.tableName = data.table;							var dataTable = data.data;							for ( var i in dataTable) {								for ( var k in dataTable[i]) {									if (dataTable[i][k])										if ((typeof dataTable[i][k]) == 'object') {											if (dataTable[i][k]) {												if ('name' in dataTable[i][k])													dataTable[i][k] = ('last_name' in dataTable[i][k]) ? dataTable[i][k].name															+ ' '															+ dataTable[i][k].last_name															: dataTable[i][k].name;											}										}								}							}							this.tableCrud.bootstrapTable('destroy');							this.tableCrud.bootstrapTable();							if (_crud_mode == 'filter')								this.tableCrud										.bootstrapTable('load', dataTable);							else								this.tableCrud										.bootstrapTable('load', dataTable);							this.moduleContainer.find('td').attr('nowrap',									'nowrap');							this.totalContainer									.html('<b>Total de registros: </b>'											+ data.count);							// calculamos la cantida de paginas que tendra el							// paginador							this.numPags = Math.ceil(data.count									/ this.totalRows);							if (this.numPags < this.page) {								this.page = this.numPags;								this.moduleContainer.find(										'li[data-page="' + this.numPags + '"]')										.click();							} else {								if (!this.loadForPaginator) {									// $('li[data-page="'+this.numPags+'"]').click();									// this.page = this.numPags;									// this.loadForPaginator = true;								}							}							this.paginatorContaier.html('');							// creamos los botones del paginador							for (var i = 0; i < this.numPags; i++) {								this.paginatorContaier.append('<li data-page="'										+ (i + 1)										+ '" class="'										+ (((i + 1) == this.page) ? 'active'												: '') + '" ><a data-page="'										+ (i + 1) + '" href="#">' + (i + 1)										+ '</a></li>');							}							// buscamos todos los botones del paginador							var btnPaginator = this.paginatorContaier									.find('li');							// agregamos el evento a cada boton del paginador							$									.each(											btnPaginator,											function(index, val) {												$(val)														.off('click')														.on(																'click',																function(e) {																	Titan.loader.show();																	var btn = $(e.target);																	var btnPaginator = this.paginatorContaier																			.find('li');																	btnPaginator																			.removeClass('active');																	this.page = btn																			.attr('data-page');																	this																			.refresh();																	console																			.log((index + 1) == this.page);																}.bind(this));											}.bind(this));							// botones							this.btnSave = this.moduleContainer.find('#save');							this.btnNew = this.moduleContainer.find('#btn-new');							this.btnFilter = this.moduleContainer									.find('#btn-filter');							this.btnCancel = this.moduleContainer									.find('.btn-cancel');							this.btnDelete = this.moduleContainer									.find('#btn-delete');							this.btnTrash = this.moduleContainer									.find('.btn-trash');							this.btnEdit = this.moduleContainer									.find('.btn-edit');							this.btnEditOpen = this.moduleContainer									.find('#btn-edit');							Titan.click('btnSave', 'save', this);							Titan.click('btnDelete', 'modeDelete', this);							Titan.click('btnTrash', 'trash', this);							Titan.click('btnEdit', 'edit', this);							Titan.click('btnNew', 'modeNew', this);							Titan.click('btnFilter', 'modeFilter', this);							Titan.click('btnCancel', 'cancel', this);							Titan.click('btnEditOpen', 'edit', this);							Titan.loader.hide();							/*							 * 							 * $('input').typeahead({							 * 							 * hint: true,							 * 							 * highlight: true,							 * 							 * minLength: 1 }, {							 * 							 * name: 'states',							 * 							 * displayKey: 'value',							 * 							 * source: substringMatcher(states)							 * 							 * });							 * 							 * 							 * 							 * 							 * 							 * 							 * 							 * this.tableCrud.find('td').mousedown(function(e){							 * 							 * if( e.button == 2 ) {							 * 							 * $(e.target).click();							 * 							 * if							 * (this.tableCrud.bootstrapTable('getSelections').length >							 * 0) {							 * 							 * 							 * 							 * this.context.css({							 * 							 * left: e.pageX + 'px',							 * 							 * top: (e.pageY - 80) + 'px'							 * 							 * }); }							 * 							 * return false; }							 * 							 * return true;							 * 							 * }.bind(this));							 * 							 */						}.bind(this));			},			/*			 * 			 * @name loadViewUsuarios			 * 			 * @description carga la vista usuarios			 * 			 * @return {void}			 * 			 */			loadStruct : function(dataStruct) {				this.opcion = {};				for ( var i in dataStruct) {					if (i != -1) {						this.thead								.append('<th  data-halign="center" data-formatter="'										+ dataStruct[i].type										+ 'Formatter" data-field="'										+ i										+ '" data-sortable="true">'										+ dataStruct[i].name + '</th>');						switch (dataStruct[i].type) {						case 'foranea':							this.opcion[i] = dataStruct[i].foranea.list;							var options = dataStruct[i].foranea.list;							var html = '<div class="form-group "><label class="col-md-4 control-label" for="'									+ i									+ '"">'									+ dataStruct[i].name									+ '</label>';							var divContainerSelect = $('<div></div>');							var div = $('<div></div>');							div.addClass('col-md-7');							var selecthtml = $('<select id="' + i									+ '" data-type="' + i									+ '" class="form-control"></select>');							for (var j = 0; j < options.length; j++) {								selecthtml										.append('<option value="'												+ options[j].id												+ '" >'												+ (('last_name' in options[j]) ? options[j].name														+ ' '														+ options[j].last_name														: options[j].name)												+ '</option>');							}							div.append(selecthtml);							divContainerSelect.append(div);							html = html + divContainerSelect.html();							html = html + '</div>';							this.form.append(html);							break;						case 'checkbox':							this.form									.append('<div class="form-group ">'											+											'<label class="col-sm-4 control-label" >'											+ dataStruct[i].name											+ '</label>'											+											'<div class="col-sm-7 col-dsm-offset-1 slideThree">'											+											'<input type="'											+ dataStruct[i].type											+ '"  '											+ ((dataStruct[i].name == 'Id') ? 'readonly'													: '')											+ ' data-type="'											+ i											+ '"  id="'											+ i											+ '" '											+ ((dataStruct[i].name == 'Id') ? ''													: ' ') + '>' +											'<label for="' + i + '"></label>' +											'</div></div>');							// placeholder="Ingrese ' + dataStruct[i].name + '"							break;						case 'decimal':							this.form.append('<div class="form-group ">' +							'<label class="col-sm-4 control-label" >'									+ dataStruct[i].name + '</label>' +									'<div class="col-sm-7">' +									'<input type="number" min="0" max="100" step="0.1" '									+ ((i == 'id') ? 'readonly' : '')									+ ' data-type="' + i									+ '"  class="form-control"  '									+ ((dataStruct[i].name == 'Id') ? '' : ' ')									+ '>' +									'</div></div>');							// if (dataStruct[i].type == 'number') {};							// $('input[type="number"]').mask('0#');							// placeholder="Ingrese ' + dataStruct[i].name + '"							break;						case 'textarea': // <textarea class="form-control"							// rows="3"></textarea>							this.form									.append('<div class="form-group ">'											+											'<label class="col-sm-4 control-label" >'											+ dataStruct[i].name											+ '</label>'											+											'<div class="col-sm-7">'											+											'<textarea  data-type="'											+ i											+ '"  class="form-control" rows="6" ></textarea>'											+											'</div></div>');							// if (dataStruct[i].type == 'number') {};							// $('input[type="number"]').mask('0#');							// placeholder="Ingrese ' + dataStruct[i].name + '"							break;						default:													this.form.append('<div class="form-group ">' +							'<label class="col-sm-4 control-label" >'									+ dataStruct[i].name + '</label>' +									'<div class="col-sm-7">' +									'<input type="' + dataStruct[i].type									+ '"  ' + ((i == 'id') ? 'readonly' : '')									+ ' data-type="' + i									+ '"  class="form-control"  '									+ ((dataStruct[i].name == 'Id') ? '' : ' ')									+ '   ' + ((this.tableName == 'Deudor' && i == 'dni') ? 'data-container="body" data-trigger="manual" data-toggle="popover" data-placement="right" data-content="Esta cédula ya esta registrada en esta sucursal"' : ' ')+'>' +									'</div></div>');							if(this.tableName == 'Deudor' && i == 'dni') {								this.inputdni = $("input[data-type='dni']");								this.select_debtor_subsidiary = $("select[data-type='subsidiary']");																							this.inputdni.focusout( this.validate_dni.bind(this));																								this.select_debtor_subsidiary.on('change', this.validate_dni.bind(this));																}							// if (dataStruct[i].type == 'number') {};							// $('input[type="number"]').mask('0#');							// placeholder="Ingrese ' + dataStruct[i].name + '"							break;						}					}				}				;			},			/*			 * 			 * @name loadGrupoTrabajo			 * 			 * @description carga la vista grupos de trabajo			 * 			 * @return {void}			 * 			 */			 validate_dni : function(event) {			 	event.preventDefault();								var params = {};				params.route = "deudor/search_debtor_subsidiary";				params.dni = this.inputdni.val();				params.subsidiary =this.select_debtor_subsidiary.val();				if(params.dni.length > 0){					var a = WebService.post(params);					a.done(function(data) {						if (data.StatusResult == 'FALIURE') {														var text = "Esta cédula ya esta registrada en " + ((data.subsidiarys.length>1)? "otras": "una")+" sucursal" + ((data.subsidiarys.length>1)? "es": "")+"<ul>";							for (var j in data.subsidiarys) {								if(j < data.subsidiarys.length)								text += "<li>" + data.subsidiarys[j] +"</li>";							}							text+="</ul>";							this.inputdni.popover({container: 'body'});							this.inputdni.popover('show');							var popoverContent = $('.popover-content');							popoverContent.html(text );													}else{							this.inputdni.popover('hide');						}					}.bind(this));				}							 },			save : function() {				_cancel = false;				var params = {};				this.inputList = $('.modal-body input, .modal-body textarea');				$.each(this.inputList,						function(index, val) {							if ($(val).attr('type') == 'checkbox')								params[_crud + '[' + $(val).attr('data-type')										+ ']'] = ($(val).is(':checked')) ? 1										: 0;							else								params[_crud + '[' + $(val).attr('data-type')										+ ']'] = $(val).val();						});				this.selectList = $('.modal-body select');				$.each(this.selectList, function(index, val) {					params[_crud + '[' + $(val).attr('data-type') + ']'] = $(							val).val();					// params[''+_crud+'['+$(val).attr('data-type')+']'] =					// $(val).val();				});				switch (_crud_mode) {				case 'new':					params.route = 'crud/create';					break;				case 'edit':					params.route = 'crud/update/' + _idRow;					break;				case 'filter':					params.route = 'crud/filter';					break;				}				params.data_table = _crud;				var a = WebService.post(params);				a						.done(function(data) {							if (data.StatusResult == 'OK') {								$.each(this.inputList, function(index, val) {									$(val).val('');								});								switch (_crud_mode) {								case 'new':									Titan.popup											.success('Datos guardados exitosamente');									this.refresh();									break;								case 'edit':									Titan.popup											.success('Datos Actualizados exitosamente');									this.refresh();								case 'filter':									var dataTable = data.data;									for ( var i in dataTable) {										for ( var k in dataTable[i]) {											if (dataTable[i][k])												if ((typeof dataTable[i][k]) == 'object') {													if ('name' in dataTable[i][k]) {														console																.log(dataTable[i][k]);														dataTable[i][k] = ('last_name' in dataTable[i][k]) ? dataTable[i][k].name																+ ' '																+ dataTable[i][k].last_name																: dataTable[i][k].name;													}												}										}									}									this.tableCrud.bootstrapTable('load',											dataTable);									this.moduleContainer.find('td').attr(											'nowrap', 'nowrap');									this.filtrated = true;									this.btnFilter											.html('<i class="glyphicon glyphicon-remove-circle"></i> ');									break;								}							}						}.bind(this));			},			modeDelete : function(e) {				var rows = this.tableCrud.bootstrapTable('getSelections');				if (rows.length > 0) {					var row = rows[0];					_idRow = row.id;					Titan.message.confirmation('Confirmación',							'¿desea eliminar este registro?', this.deleteMode,							this, 'Aceptar', 'Cancelar');				} else {					Titan.popup.warning('Debes selecionar un registro primero');				}				;			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			deleteMode : function(e) {				var params = {};				params.route = 'crud/erase/' + _idRow;				params.data_table = _crud;				params.database_name = _database_name;				var a = WebService.post(params);				a.done(function(data) {					if (data.StatusResult == 'OK') {						Titan.popup.success('Datos borrados exitosamente');						this.loadForPaginator = true;						this.index();					} else {						Titan.popup.error('Error al  borrar los datos');					}				}.bind(this));			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			trash : function(e) {				_idRow = $(e.target).attr('data-id');			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			refresh : function(e) {				this.loadForPaginator = true;				this.index();			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			cancel : function(e) {				_cancel = true;			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			modeNew : function(e) {				_crud_mode = 'new';				this.modalTitle.html("Registrar " + this.tableName);				this.addSelectRequired();				this.cleanFields();			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			modeEdit : function(e) {				_crud_mode = 'edit';				this.modalTitle.html("Editar " + this.tableName);				this.addSelectRequired();			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			modeFilter : function(e) {				if (this.filtrated) {					this.btnFilter							.html('<i class="glyphicon glyphicon-search"></i> ');					this.paginatorContaier.find('li').first().click();					this.filtrated = false;				} else {					$('#modal-crud').modal('show');					_crud_mode = 'filter';					this.modalTitle.html("Buscar " + this.tableName);					this.removeSelectRequired();					this.cleanFields();				}			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			removeSelectRequired : function() {				this.comboboxs = $('#modal-crud').find('select');				this.comboboxs.each(function(index, el) {					$(el).find('option').first().prop('selected', true);					if ($(el).val() != '')						$(el).prepend('<option value=""></option>');					$(el).val(0);				});			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			cleanFields : function() {				this.inputs = $('#modal-crud').find('input');				this.inputs.each(function(index, el) {					$(el).val('');				});			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			addSelectRequired : function() {				this.comboboxs = $('#modal-crud').find('select');				this.comboboxs.each(function(index, el) {					$(el).find('option').first().prop('selected', true);					if ($(el).val() == '')						$(el).find('option').first().remove();				});			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 * 			 * 			 * createModal: function (name, columnas, lista) {			 * 			 * 			 * 			 * 			 * 			 * var id = 'myModalgenerate'+ this.modalCount ;			 * 			 * 			 * 			 * var html = '<!-- Modal -->'+ '<div class="modal fade" id="'+ id			 * +'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"			 * aria-hidden="true">'+ '<div class="modal-dialog">'+ '<div			 * class="modal-content">'+ '<div class="modal-header">'+ '<button			 * type="button" class="close" data-dismiss="modal"><span			 * aria-hidden="true">&times;</span><span class="sr-only">Cancelar</span></button>'+ '<h4 class="modal-title" id="myModalLabel">Selecciona</h4>'+ '</div>'+ '<div			 * class="modal-body">'+ '</div>'+ '<div class="modal-footer">'+ '<button			 * type="button" class="btn-cancel btn btn-default"			 * data-dismiss="modal">Cancelar</button>'+ '<button id="delete"			 * type="button" class="btn btn-primary">Aceptar</button>'+ '</div>'+ '</div>'+ '</div>'+ '</div>';			 * 			 * 			 * 			 * this.moduleContainer.append(html);			 * 			 * 			 * 			 * var body = this.moduleContainer.find('#'+id + ' .modal-body');			 * 			 * 			 * 			 * var htmlTable = '<div class="table-responsive">'+ '<table			 * id="table-crud" class="table table-hover ">'+ '<thead></thead>'+ '<tbody>'+ '</tbody>'+ '</table>'+ '</div>';			 * 			 * 			 * 			 * body.append(htmlTable);			 * 			 * 			 * 			 * //crear los nombres de las columnas			 * 			 * var thead = body.find('thead');			 * 			 * 			 * 			 * var row = $('<tr></tr>');			 * 			 * for(i in columnas){			 * 			 * if (i)			 * 			 * row.append('<th>' + i + '</th>'); }			 * 			 * 			 * 			 * thead.append(row);			 * 			 * 			 * 			 * //cargar los datos en las tablas			 * 			 * var tbody = body.find('tbody');			 * 			 * 			 * 			 * for(i in lista){			 * 			 * var row = $('<tr></tr>');			 * 			 * if (i){			 * 			 * for(k in lista[i]){			 * 			 * row.append('<td nowrap>' + lista[i][k] + '</td>'); } }			 * 			 * tbody.append(row); }			 * 			 * 			 * 			 * this.modalCount ++;			 * 			 * 			 * 			 * return id; },			 */			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			edit : function(e) {				var rows = this.tableCrud.bootstrapTable('getSelections');				if (rows.length > 0) {					_crud_mode = 'edit';					this.modalTitle.html("Editar " + this.tableName);					$('#modal-crud').modal('show');					var row = rows[0];					_idRow = row.id;					var params = {};					params.route = 'crud/edit/' + _idRow;					params.data_table = _crud;					var a = WebService.post(params);					a.done(function(data) {						row = data.data;						function findById(source, name) {							for ( var k in source) {								if (source[k]) {									if (((source[k].last_name) ? source[k].name											+ ' ' + source[k].last_name											: source[k].name) == name) {										return source[k];									}								}							}						}						for ( var i in row) {							var input_ = $('input[data-type=' + i + ']');							if (input_.length > 0) {								if (input_.attr('type') == 'checkbox') {									if (row[i] == 0) {										input_.attr('checked', false);									} else {										input_.attr('checked', true);									}								} else {									input_.val(row[i]);								}								;							} else {								var select = $('select[data-type=' + i + ']');								if (select.length > 0) {									/*									 * var result = findById(this.opcion[i],									 * row[i]);									 * 									 * console.log(result);									 * 									 * select.val(result.id);									 */									select.val(row[i]);								} else {									var textarea = $('textarea[data-type=' + i											+ ']');									if (textarea.length > 0) {										// var result = findById(this.opcion[i],										// row[i]);										console.log('entró');										textarea.val(row[i]);									}								}							}						}					});				} else {					Titan.popup.warning('Debes selecionar un registro primero');				}				;				/*				 * 				 * var params = {};				 * 				 * 				 * 				 * params.route = 'crud/edit/' + _idRow;				 * 				 * params.data_table = _crud;				 * 				 * 				 * 				 * var a = WebService.post(params);				 * 				 * 				 * 				 * a.done(function (data) {				 * 				 * 				 * 				 * if (data.StatusResult=='OK') {				 * 				 * 				 * 				 * 				 * 				 * 				 * 				 * for (var i in data.data) {				 * 				 * var input_ = $('input[data-type=' + i + ']');				 * 				 * if (input_.length>0)				 * 				 * input_.val(data.data[i]);				 * 				 * else{				 * 				 * var select = $('select[data-type=' + i + ']');				 * 				 * select.val(data.data[i]); } }				 * 				 * 				 * 				 * //this.btnCancel.click(); }				 * 				 * }.bind(this));				 * 				 * 				 * 				 */			},		});/*
 * @module  Abono
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DoweSoft
 */

Titan.modules.create({

	name: 'Abono',
	
	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components
		this.btn_calcular_abono = $('#btn_calcular_abono');
		this.btn_calcular_abono_minimo = $('#btn_calcular_abono_minimo');
		this.campo_abono = $('#monto-abono');
		this.campo_abono.mask('0#');
		this.infoDebts = $('#data_debts_abonos');
		this.infoDebtstbody = this.infoDebts.find('tbody').first();
	},

	/*
	 * @name initEvents
	 * @description inicia los eventos de los componentes del módulo
	 * @return {void}
	 */

	initEvents: function () {
		Titan.click('btn_calcular_abono', 'calcular', this);
		Titan.click('btn_calcular_abono_minimo', 'calcularMinimo', this);
	},

	calcular: function () {

		if (Titan.modules.Pagos.tablapagos.bootstrapTable('getSelections').length >=1) {

			if (this.campo_abono.val()!='') {
				var a = WebService.post({
					route: 'deudor/calcularAbono/',
					abono: this.campo_abono.val(),
					fecha: Titan.modules.Pagos.campoFechaLiquidacion.val(),
					debt: Titan.modules.Pagos.tablapagos.bootstrapTable('getSelections')[0],
				});

			 	a.done(	function  (response) {
			 			
			 		this.infoDebtstbody.html('');
			 		var data = response.liquidation[0];

			 		var datosResaltados = ['total Servicios', 'total Interes por cobrar', 'total del abono', 'gastos de cobranza'];
		 	 				console.log(response,datosResaltados);
					for(i in data){
						if(i != 'total del abono'){
							var b = (datosResaltados.contains(i))? true:false;

							this.infoDebtstbody.append('<tr><td>'+ 
								((b)? '<strong>' : '') + i + ((b)? '</strong>' : '') 
								+'</td><td>'+ ((b)? '<strong>' : '')  + 
								((data[i] > 999)? '$'+ numberFormatter(data[i]):data[i]) + 
								((b)? '</strong>' : '')  + '</td></tr>')
						
						}else if(i)
							this.infoDebtstbody.append('<tr><td>'  + i +'</td><th><h3><strong>' + ((data[i] > 999)? '$'+ numberFormatter(data[i]):data[i]) + '</strong></h3></th></tr>')
	 	 			}

			 	}.bind(this));
			} else {
			 	Titan.popup.warning('ingrese el monto del abono');
			}
		}else {
		 	Titan.popup.warning('seleccione una deuda primero');
		}
	},

	calcularMinimo: function () {

		if (Titan.modules.Pagos.tablapagos.bootstrapTable('getSelections').length >=1) {

			//if (this.campo_abono.val()!='') {
				var a = WebService.post({
					route: 'deudor/calcularAbonoMinimo/',
					abono: this.campo_abono.val(),
					fecha: Titan.modules.Pagos.campoFechaLiquidacion.val(),
					debt: Titan.modules.Pagos.tablapagos.bootstrapTable('getSelections')[0],
				});

			 	a.done(	function  (response) {
			 			
			 		this.infoDebtstbody.html('');
			 		var data = response.liquidation[0];

			 		var datosResaltados = ['total Servicios', 'total Interes por cobrar', 'total del abono', 'gastos de cobranza'];
		 	 				console.log(response,datosResaltados);
					for(i in data){
						if(i != 'total del abono'){
							var b = (datosResaltados.contains(i))? true:false;

							this.infoDebtstbody.append('<tr><td>'+ 
								((b)? '<strong>' : '') + i + ((b)? '</strong>' : '') 
								+'</td><td>'+ ((b)? '<strong>' : '')  + 
								((data[i] > 999)? '$'+ numberFormatter(data[i]):data[i]) + 
								((b)? '</strong>' : '')  + '</td></tr>')
						
						}else if(i)
							this.infoDebtstbody.append('<tr><td>'  + i +'</td><th><h3><strong>' + ((data[i] > 999)? '$'+ numberFormatter(data[i]):data[i]) + '</strong></h3></th></tr>')
	 	 			}

			 	}.bind(this));
			//} else {
			 //	Titan.popup.warning('ingrese el monto del abono');
			//}
		}else {
		 	Titan.popup.warning('seleccione una deuda primero');
		}
	},


});
/*

 * @module  Codeudores

 *

 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)

 *

 * @license Derechos Reservados de Autor (C) IP Total Software S.A

 */



Titan.modules.create({



	name: 'Codeudores',

	

	/*

	 * @constructor

	 * @description inicia los componentes del módulo

	 */

	ready: function () {

		//init components

		this.container = $('#codeudor-container');

		this.tablaInforme = this.container.find('#tabla_codeudores');

		//this.tablaInforme.bootstrapTable();



		this.thead = this.tablaInforme.find('thead > tr').first();

		this.tbody = this.tablaInforme.find('tbody').first();

		this.descripcion = this.container.find('#descripcion');



		this.btnSave = this.container.find('#save');	

		console.log('cargando data codeudores');	 	

		this.informe();



	},



	/*

	 * @name initEvents

	 * @description inicia los eventos de los componentes del módulo

	 * @return {void}

	 */

	initEvents: function () {

		Titan.click('btnSave', 'save', this);

	},





	update_table: function () {		

		this.buscar(Titan.global['deudor_id']);

	},



	save: function () {



		var descripcion = this.descripcion.val();



		if ($.trim(descripcion) !='') {

		

			

			var params = {

				'route': 'deudor/save_reports', 

				'id_deudor': Titan.global['deudor_id'],

				'__u__': __u__,

				'description': descripcion

			};

			var a = WebService.post(params);



			a.done(function  (response) {



				if(response.StatusResult){

					this.descripcion.val('');

					this.update_table();

					Titan.popup.success('El reporte se guardó exitosamente');

				}else{

					Titan.popup.danger('Error al guardar el reporte');

				}

					

			}.bind(this));

		} else{

			Titan.popup.warning('Escriba primero el reporte');

		};

				

	},

	



	/**

	* carga la estructura de la tabla 

	*/

	informe:function(){



		console.log('informe metod');	 	

		var params = {

			route: 'crud/load', 
			nodata: true, 
			'data_table': 'cosigner'

		}



		var a = WebService.post(params);



	 	a.done(	function  (response) {

	 		console.log(response);	 	 		

	 		this.loadStruct(response.struct);

	 		this.tablaInforme.bootstrapTable('destroy');

    		this.tablaInforme.bootstrapTable();

	 	}.bind(this));



    },



    loadData: function (arreglo) {    	

    	this.tablaInforme.bootstrapTable('load', arreglo);

    },



    loadStruct:function(estructura){

    	for(var i in estructura){

    		if (i != 'id' &&i != 'debtor') 

    			this.thead.append('<th data-field="' + i + '">' + estructura[i].name+ '</th>');

    	}

    },



    buscar: function (id) {

		this.tbody.html('');

		var a = WebService.post({route: 'deudor/query_cosigners', 'id_deudor': id});	



		a.done(function(response){	

			if(response.StatusResult == 'OK'){

				this.descripcion.val('');

				console.log(response.cosigners);

				this.loadData(response.cosigners);	



			}else{

				this.tbody.html('');

				this.tablaInforme.bootstrapTable('destroy');

    			this.tablaInforme.bootstrapTable();

			}

				

		}.bind(this));   		

    		

	},  



	deshabilitar:function(sentinela){

		 this.descripcion.attr('disabled', 'disabled');

		 this.btnSave.attr('disabled', 'disabled');

		 this.tbody.html(' ');



	},



	habilitar:function(sentinela){

		 this.descripcion.removeAttr('disabled', 'disabled');

		 this.btnSave.removeAttr('disabled', 'disabled');

	}

});



/*
 * @module  index
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */
Titan.modules.create({
	name: 'index',
	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components
		Titan.view( 'llamadas', 'reportes_de_llamadas','informe_de_llamada_tab');
		Titan.view( 'liquidacion', 'informacion_del_deudor','informacion_Deudor_tab');
		Titan.view( 'liquidacion', 'pagos','pagos_tab');
		Titan.view( 'liquidacion', 'codeudores','codeudores_tab');
		Titan.view( 'liquidacion', 'informe_de_pagos','informe_pagos_tab');
		Titan.view( 'liquidacion', 'referencias','referencias_tab');
	},

});/*
 * @module  Login
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */
Titan.modules.create({

	name: 'Informacion_del_deudor',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components
		this.info_deudor_field = $('#busca_Deudor');
		this.info_deudor_field.mask('0#');
		this.btn_buscar = $('#btn_buscar');
		this.containerInfo = $('#content-information-deudor');
		this.panelInfo = $('#panel-content-info');
		this.nombre_deudor = $('#nombre');
		this.table = $('#tabla-info');
		
		this.select_sucursal = $('#select_sucursales');
		this.select_sucursal.hide();
	},

	/*
	 * @name initEvents
	 * @description inicia los eventos de los componentes del módulo
	 * @return {void}
	 */

	initEvents: function () {
		Titan.click('btn_buscar', 'ejecutarBusqueda', this);
		Titan.keypress('info_deudor_field', 'buscar', this);
		this.select_sucursal.on('change',  function(event) {
			 this.cargarData(this.select_sucursal.val());
		}.bind(this));	
	},


	ejecutarBusqueda: function () {
		if(this.info_deudor_field.val() == ''){
					Titan.popup.danger('Debe ingresar el número de cedula del deudor! ');
					this.panelInfo.hide();
				}else{
		var a = WebService.post({route: 'deudor/search_debtor', 'dni': this.info_deudor_field.val()});	

					a.done(function(data){

						if(data.StatusResult == 'OK'){
							//guardamos la informacion del deudor
							this.deudores = data.deudores;
							this.sucursales = data.sucursales;
							
							
							if(this.sucursales.length <= 1){
								this.cargarData(0);
								this.select_sucursal.hide();
							}else{
								this.select_sucursal.html("");
								this.select_sucursal.append("<option value='-1'> -- seleccione la sucursal -- </option>");
								
								for(i in this.sucursales)
									if(i < this.sucursales.length)
										this.select_sucursal.append("<option value='" + i +  "'>" + this.sucursales[i].name + "</option>");
								this.select_sucursal.show();
								
								this.limpiar();
							}

						}else{
							Titan.popup.info(data.ErrorMessage );
							Titan.modules['Reportes_de_llamadas'].deshabilitar();	
							this.panelInfo.hide();	
					     }	
				    }.bind(this));	
				}
	},
	
	buscar: function (e) {
		
		  var tecla = (document.all) ? e.keyCode : e.which;
		  if (tecla==13){
			  
			  console.log("buscando deudor ...");
				
				this.dato_encontrado = false;

				if(this.info_deudor_field.val() == ''){
					Titan.popup.danger('Debe ingresar el número de cedula del deudor! ');
					this.panelInfo.hide();
				}else{
					this.ejecutarBusqueda();
				}	
		  }
			
	},	

	cargarData: function (index) {
		console.log("cargando la informacion del deudor ...");
		this.dato_encontrado = false;
		this.deudor = this.deudores[index];
		Titan.global['deudor_id'] = this.deudor.id;
	    this.dato_encontrado = true;
	    
	    this.limpiar();
	   
	    var params = {
	    		route: 'deudor/search', 
	    		'dni': this.deudor.dni,
	    		'sucursal': this.sucursales[index].id,
	    	};
	    
	    var a = WebService.post(params);	

		a.done(function(data){

			if(data.StatusResult == 'OK'){
			    this.table.bootstrapTable('destroy');
			    this.containerInfo.html(''); 
			    
			    var deudorLast = data.deudor;
			    console.log(deudorLast.Sucursal.name);

			    if (deudorLast.status == '0') {
			    	this.panelInfo.addClass('panel-danger');

			    	Titan.popup.error('Este deudor ha sido deshabilitado en el sistema', 5000);
			    } else{
			    	this.panelInfo.removeClass('panel-danger');
			    }
			    
				for(i in deudorLast){
					if(deudorLast[i]){
						if(i != 'Código' &&i != 'id' &&i != 'status' )
							this.containerInfo.append('<tr><td>' + i + ':</td><td>' + ((typeof deudorLast[i] == 'object')? deudorLast[i].name : deudorLast[i]) + '</td></tr>');										
				    }					
			    }
				delete deudorLast;
			   
			   // this.table.bootstrapTable();
			    this.panelInfo.show();
			}
		}.bind(this));
		
		Titan.global['deudor'] = this.deudor;
		Titan.global['id_subsidiary'] = this.sucursales[index].id;
		Titan.global['id_deudor'] = this.deudores[index].id;
		
		
	    Titan.modules['Reportes_de_llamadas'].buscar(this.deudor.id);
	    Titan.modules['Reportes_de_llamadas'].habilitar();
		Titan.modules['Reportes_de_llamadas'].cancel();
		
	    Titan.modules['Codeudores'].buscar(this.deudor.id);
	    Titan.modules['Pagos'].buscar(this.deudor.dni);
	    Titan.modules['Informe_de_pagos'].buscar(this.deudor.id);
	    Titan.modules['Referencias'].buscar_personales(this.deudor.id);
	    Titan.modules['Referencias'].buscar_comerciales(this.deudor.id);
	    Titan.modules['Pagos'].habilitar();
		
	},	
	
	limpiar: function (){
		this.panelInfo.hide();
		 this.table.bootstrapTable('load', {});
		Titan.modules['Pagos'].limpiar();
		Titan.modules['Reportes_de_llamadas'].cancel();
	    //Titan.modules['Codeudores'].buscar(this.deudor.id);
	    
	    //Titan.modules['Informe_de_pagos'].buscar(this.deudor.id);
	    //Titan.modules['Referencias'].buscar_comerciales(this.deudor.id);
	},

});/*

 * @module  Login

 *

 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)

 *

 * @license Derechos Reservados de Autor (C) IP Total Software S.A

 */

Titan.modules.create({



	name: 'Informe_de_llamadas',



	/*

	 * @constructor

	 * @description inicia los componentes del módulo

	 */

	ready: function () {

		//init components

		this.container = $('#informe-de-llamadas-container');

		this.tablaInforme = this.container.find('#tabla_informe');

		//this.tablaInforme.bootstrapTable();



		this.thead = this.tablaInforme.find('thead > tr').first();

		this.tbody = this.tablaInforme.find('tbody').first();

		this.descripcion = this.container.find('#descripcion');



		this.btnSave = this.container.find('#save');	

		console.log('cargando data informes');	 	

		this.informe();



	},



	/*

	 * @name initEvents

	 * @description inicia los eventos de los componentes del módulo

	 * @return {void}

	 */

	initEvents: function () {

		Titan.click('btnSave', 'save', this);

	},





	update_table: function () {		

		console.log(' update_table update_table update_table update_table update_table');

		var id_del_deudor = Titan.modules['Informacion_del_deudor'].deudor.id;	

		this.buscar(id_del_deudor);



	},



	save: function () {



		var descripcion = this.descripcion.val();



		if ($.trim(descripcion) !='') {		

			var id = Titan.modules['Informacion_del_deudor'].deudor.id;

			

			var params = {

				'route': 'deudor/save_reports', 

				'id_deudor': id,

				'__u__': __u__,

				'description': descripcion

			}



			var a = WebService.post(params);



			a.done(function  (response) {



				if(response.StatusResult=='OK'){

					this.descripcion.val('');

					this.update_table();

					//Titan.popup.success('El reporte se guardó exitosamente');

				}else{

					Titan.popup.danger('Error al guardar el reporte');

				}

					

			}.bind(this));

		} else{

			Titan.popup.warning('Escriba primero el reporte');

		};

				

	},

	



	/**

	* carga la estructura de la tabla 

	*/

	informe:function(){



		var params = {

			route: 'crud/load', 
			nodata: true, 
			'data_table': 'report'

		}



		var a = WebService.post(params);



	 	a.done(	function  (response) {

	 		console.log(response);	 	 		

	 		this.loadStruct(response.struct);

	 		this.tablaInforme.bootstrapTable('destroy');

    		this.tablaInforme.bootstrapTable();

	 	}.bind(this));



    },



    loadData: function (arreglo) {    	

    	this.tablaInforme.bootstrapTable('load', arreglo);

    },



    loadStruct:function(estructura){

    	for(var i in estructura){

    		if (i != 'id' &&i != 'debtor' ) 

    			this.thead.append('<th data-field="' + i + '">' + estructura[i].name+ '</th>');

    	}

    },



    buscar: function (id) {

		this.tbody.html('');

		var a = WebService.post({route: 'deudor/query_reports', 'id_deudor': id});	



		a.done(function(response){	

			if(response.StatusResult == 'OK'){

				this.descripcion.val('');

				this.loadData(response.reports);	



			}else{

				this.tbody.html('');

				this.tablaInforme.bootstrapTable('destroy');

    			this.tablaInforme.bootstrapTable();

			}

				

		}.bind(this));   		

    		

	},  



	deshabilitar:function(sentinela){

		 this.descripcion.attr('disabled', 'disabled');

		 this.btnSave.attr('disabled', 'disabled');

		 this.tbody.html(' ');



	},



	habilitar:function(sentinela){

		 this.descripcion.removeAttr('disabled', 'disabled');

		 this.btnSave.removeAttr('disabled', 'disabled');

	}

});



Titan.modules.create({



	name: 'Informe_de_pagos',

	

	/*

	 * @constructor

	 * @description inicia los componentes del módulo

	 */

	ready: function () {

		//init components

		this.container = $('#informe-pagos-container');

		this.tabla_informe_pagos = this.container.find('#tabla_pagos');

		

		this.thead = this.tabla_informe_pagos.find('thead > tr').first();

		this.tbody = this.tabla_informe_pagos.find('tbody').first();		

		

		console.log('cargando data pagos');	 	

		this.informe();



	},



	/*

	 * @name initEvents

	 * @description inicia los eventos de los componentes del módulo

	 * @return {void}

	 */

	initEvents: function () {

	},





	update_table: function () {		

	},	



	/**

	* carga la estructura de la tabla 

	*/

	informe:function(){



		console.log('informe metod');	 	

		var params = {

			route: 'crud/load', 
			nodata: true, 
			'data_table': 'payment'

		}



		var a = WebService.post(params);



	 	a.done(	function  (response) {

	 		console.log(response);	 	 		

	 		this.loadStruct(response.struct);

	 		this.tabla_informe_pagos.bootstrapTable('destroy');

    		this.tabla_informe_pagos.bootstrapTable();

	 	}.bind(this));



    },



    loadData: function (arreglo) {    	

    	this.tabla_informe_pagos.bootstrapTable('load', arreglo);

    },



    loadStruct:function(estructura){

    	for(var i in estructura){

    		if (i != 'id' &&i != 'debtor') 

    			this.thead.append('<th data-field="' + i + '">' + estructura[i].name+ '</th>');

    	}

    },



    buscar: function (id) {



		this.tbody.html('');

		this.id_ = id;



		var a = WebService.post({route: 'pagos/query_payment', 'id_deudor': id});	



		a.done(function(response){	

			if(response.StatusResult == 'OK'){

				this.loadData(response.payment);

				

			}else{

				this.tbody.html('');

				this.tabla_informe_pagos.bootstrapTable('destroy');

    			this.tabla_informe_pagos.bootstrapTable();

			}

				

		}.bind(this));   		

    		

	},  



	

});



/*
 * @module  Pagos
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */
Titan.modules.create({
	name: 'Pagos',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		this.container = $('#informe-de-pagos-container');
		this.tablapagos= this.container.find('#tabla_pagos');
		this.thead = this.tablapagos.find('thead > tr').first();
		this.tbody = this.tablapagos.find('tbody').first();
		this.abono_deuda = this.container.find('#abono_deuda');
		this.abono_deuda.mask('0#');
		this.labelInfo = this.container.find('#monto');
		this.btnSave = this.container.find('#save');
		this.saldo_deuda= this.container.find('#saldo_deuda');
		this.infoDebts = this.container.find('#data-debts');
		this.infoDebtstbody = this.infoDebts.find('tbody').first();
		this.campoFechaLiquidacion = this.container.find('#date-liquidation');
		this.campoFechaLiquidacion.datepicker({
	      changeMonth: true,
	      changeYear: true
	    });

		this.btnCalcularLiquidacion = this.container.find('#btn-liquidation');
		this.infoDebtsManual = this.container.find('#data-debts-manual');
		this.infoDebtstbodyManual = this.infoDebtsManual.find('tbody').first();

		//liquidacion manual
		this.campoSucursales = this.container.find('#sucursales-deuda');
		this.campoFechaPagoManual = this.container.find('#fecha-deuda');
		this.campoFechaPagoManual.datepicker({
	      changeMonth: true,
	      changeYear: true
	    });
		this.campoSaldoManual = this.container.find('#saldo-deuda');
		this.campoSaldoManual.mask('0#');
		this.campoFechaLiquidacionManual = this.container.find('#fecha-liquidacion');
		this.campoFechaLiquidacionManual.datepicker({
	      changeMonth: true,
	      changeYear: true
	    });
		this.campoFechaLiquidacionManual.val(this.ultimoDiaDelMes());
		this.btnCalcularLiquidacionManual = this.container.find('#btn-fecha-liquidacion');
		Titan.view( 'liquidacion', 'abono','abonos_deuda');

		this.count = $("#badge_liquidacion");
		this.count.hide();	

		this.sucursales();
		this.informe();
	},



	initEvents: function () {

		Titan.click('btnSave', 'confirmationSave', this);

		Titan.click('btnCalcularLiquidacion', 'calcularLiquidacion', this);

		Titan.click('btnCalcularLiquidacionManual', 'calcularLiquidacionManual', this);

		//Titan.keypress('abono_deuda', 'loadAmount', this);

			

	},



	sucursales: function () {

		var a = WebService.post({route: 'query/sucursales'});



	 	a.done(	function  (response) {

	 		this.campoSucursales.html('');



	 		var sucursales  = response.sucursales;

	 		for (var i = sucursales.length - 1; i >= 0; i--) {

	 			var s = sucursales[i];

	 			this.campoSucursales.append('<option  >' + s.name + '</option>')

	 		}



	 	}.bind(this));

	},





	calcularLiquidacionManual: function () {



		if (this.campoSaldoManual.val() == '' || this.campoSaldoManual.val() <= '0') {

			Titan.popup.warning('Ingrese el saldo');

			return;

		}



		if (this.campoFechaPagoManual.val() == '') {

			Titan.popup.warning('elija la fecha del último pago');

			return;

		}



		



		var params = {

			route: 'deudor/calculateLiquidationManual', 

			'sucursal': this.campoSucursales.val(),

			'fechaPago': this.campoFechaPagoManual.val(),

			'saldo': this.campoSaldoManual.val(),

			'fechaLiquidacion': this.campoFechaLiquidacionManual.val(),

		}



		var a = WebService.post(params);



	 	a.done(	function  (response) {

	 		console.log(response);	

	 		this.infoDebtstbodyManual.html('');

	 		var data = response.liquidation;



	 		var datosResaltados = ['total Servicios', 'total Interes por cobrar', 'Procredito', 'gastos de cobranza'];



	 		for(k in data){

	 			if(k!='contains'){

	 				//this.infoDebtstbody.append('<tr><td>deuda #' + k + '</td><td></td></tr>')

 	 				

					for(i in data[k]){

						if(i != 'total por cobrar'){

							var b = (datosResaltados.contains(i))? true:false;



							this.infoDebtstbodyManual.append('<tr><td>'+ 

								((b)? '<strong>' : '') + i + ((b)? '</strong>' : '') 

								+'</td><td>'+ ((b)? '<strong>' : '')  + 

								((data[k][i] > 999)? '$'+ numberFormatter(data[k][i]):data[k][i]) + 

								((b)? '</strong>' : '')  + '</td></tr>')

						

						}else if(i)

							this.infoDebtstbodyManual.append('<tr><td>'  + i +'</td><th><h3><strong>' + ((data[k][i] > 999)? '$'+ numberFormatter(data[k][i]):data[k][i]) + '</strong></h3></th></tr>')

	 	 				

	 	 			}

 	 			}

 	 		}

	 		

	 	}.bind(this));

	},



	calcularLiquidacion: function () {



		if (Titan.modules.Pagos.tablapagos.bootstrapTable('getSelections').length >=1) {

			var params = {

				route: 'deudor/calculateLiquidation', 

				'debts': this.tablapagos.bootstrapTable('getSelections'),

				'fecha': this.campoFechaLiquidacion.val(),

			}



			var a = WebService.post(params);



		 	a.done(	function  (response) {

		 		console.log(response);	

		 		this.infoDebtstbody.html('');

		 		var data = response.liquidation;



		 		var datosResaltados = ['total Servicios', 'total Interes por cobrar', 'Procredito', 'gastos de cobranza'];



		 		for(k in data){

		 			if(k!='contains'){

		 				//this.infoDebtstbody.append('<tr><td>deuda #' + k + '</td><td></td></tr>')

	 	 				

						for(i in data[k]){

							if(i != 'total por cobrar'){

								var b = (datosResaltados.contains(i))? true:false;



								this.infoDebtstbody.append('<tr><td>'+ 

									((b)? '<strong>' : '') + i + ((b)? '</strong>' : '') 

									+'</td><td>'+ ((b)? '<strong>' : '')  + 

									((data[k][i] > 999)? '$'+ numberFormatter(data[k][i]):data[k][i]) + 

									((b)? '</strong>' : '')  + '</td></tr>')

							

							}else if(i)

								this.infoDebtstbody.append('<tr><td>'  + i +'</td><th><h3><strong>' + ((data[k][i] > 999)? '$'+ numberFormatter(data[k][i]):data[k][i]) + '</strong></h3></th></tr>')

		 	 				

		 	 			}

	 	 			}

	 	 		}

		 		

		 	}.bind(this));

		}else {

		 	Titan.popup.warning('seleccione una deuda primero');

		}

	},



	confirmationSave: function () {

		Titan.message.confirmation('Guardar Pago','Desea confirmar el pago',this.save, this);

	},



	update_table: function () {	

		var id_del_deudor = Titan.modules['Informacion_del_deudor'].deudor.id;	

		this.buscar(id_del_deudor);

	},


	ultimoDiaDelMes: function () {
		var today = new Date(); 
		var fecha = new Date(today.getFullYear(), today.getMonth()+1, 0);
		console.log(fecha);	 
		var dia = fecha.getDate();
		var mes = fecha.getMonth() + 1;
		var anno = fecha.getFullYear();
		fecha =  anno +'-' + (mes< 10 ?'0'+mes:mes)+ '-' +  (dia< 10 ?'0'+dia:dia);
		console.log(fecha);	 
		return fecha;
	},



	informe:function(){

		this.campoFechaLiquidacion.val(this.ultimoDiaDelMes()); 	

		console.log('informe metod');	 	

		var params = {

			route: 'crud/load', 
			nodata: true, 
			'data_table': 'debt'

		}



		var a = WebService.post(params);



	 	a.done(	function  (response) {

	 		console.log(response);	 	 		

	 		this.loadStruct(response.struct);

	 		this.tablapagos.bootstrapTable('destroy');

    		this.tablapagos.bootstrapTable();

	 	}.bind(this));



    },



	loadData: function (arreglo) {    	
		this.count.show(); 	
    	arreglo.length > 0? this.count.html(arreglo.length):this.count.hide();
    	this.tablapagos.bootstrapTable('load', arreglo);

    },



    loadStruct:function(estructura){



    	var fieldshiddens = ['id', 'debtor', 'status', 'dni'];



    	for(var i in estructura){

    		if (!fieldshiddens.contains(i)) 

    			this.thead.append('<th data-field="' + i + '" data-formatter="' + i + 'Formatter">' + estructura[i].name+ '</th>');

    			

    	}

    },



    buscar: function (dni) {



		this.tbody.html('');

		this.labelInfo.html('');

		this.abono_deuda.val('');

		console.log(dni);



		var a = WebService.post({route: 'deudor/query_debt', 'dni': dni});	



		a.done(function(response){	

			if(response.StatusResult == 'OK'){



				Titan.global['guardaSaldo'] = response.debts[0].amount;

				

				this.loadData(response.debts);		



				this.labelInfo.html( amountFormatter(response.total_));

				Titan.global['debt'] = response.debts[0];



				this.infoDebtstbody.html('');



				var data = response.data;

				for(i in data)

					if(i)

						this.infoDebtstbody.append('<tr><td>'  + i.replace(/_/mgi, ' ') +'</td><td> ' + ((data[i] > 999)? numberFormatter(data[i]):data[i]) + '</td></tr>')



				//this.infoDebts.bootstrapTable('destroy');

				//this.infoDebts.bootstrapTable();



			}else{

				this.tbody.html('');

				this.tablapagos.bootstrapTable('destroy');

    			this.tablapagos.bootstrapTable();

			}

				

		}.bind(this));   		

    		

	}, 



	save: function () {

		

		this.abono = parseInt( $.trim(this.abono_deuda.val()).valueOf());

		this.monto = parseInt( Titan.global['guardaSaldo'].valueOf());

		

		if (this.abono !='') {



			if(this.abono <= this.monto){							

				this.abono_deuda_ =  this.monto - this.abono;



				var params = {

					'route': 'deuda/save_debt', 

					'abono_deuda': this.abono_deuda_,

					'debt': Titan.global['debt'] 

				};

				var a = WebService.post(params);



				a.done(function  (response) {



					if(response.StatusResult){

						this.save_payment_debtor();

						this.update_table();

						Titan.global['guardaSaldo'] = this.abono_deuda_;

						Titan.popup.success('El abono se guardó exitosamente');

					}else{

						Titan.popup.danger('Error al guardar el abono');

					}



				}.bind(this));	

			}else{

				Titan.popup.danger('Error al guardar el abono');

			}						

		} else{

			Titan.popup.warning('Escriba primero el abono');

		};			

				

	},



	loadAmount:function(){



		this.abono_ = parseInt( $.trim(this.abono_deuda.val()).valueOf());

		this.monto_ = parseInt( Titan.global['guardaSaldo'].valueOf());		

		this.abono_deuda_ =  this.monto - this.abono;



		

    },



	formatAmount:function(amount){

		amount = "" + amount;

		var centavos;

		

		if (amount.contains('.')){

			var amountTotal = amount.split('.');

			var centavos = amountTotal.pop();

			amount = amountTotal.pop();

		}



		



		var tem = amount.split('');

		var z = tem.pop();

		var y = tem.pop();

		var x = tem.pop();



		var w = tem.pop();

		var v = tem.pop();

		var u = tem.pop();



		var t = tem.pop();

		var r = tem.pop();

		var s = tem.pop();



		//debugger;



		var str = '$';



		 str += ((s)?s:''); 

		 str += ((r)?r:''); 

		 str += ((t)?t:''); 

		 str += ((u)?u:''); 

		 str += ((v)?v:''); 

		 str += ((w)?w:''); 

		 str += ((w)?'.':''); 

		 str += ((x)?x:''); 

		 str += ((y)?y:''); 

		 str += ((z)?z:'');



		 return str;

    },



    save_payment_debtor: function () {





		this.abono = parseInt( $.trim(this.abono_deuda.val()).valueOf());

		this.monto = parseInt( Titan.global['guardaSaldo'].valueOf());

		this.abono_deuda_ =  this.monto - this.abono;

		this.id_del_deudor = Titan.modules['Informacion_del_deudor'].deudor.id;	



		var params = {

			'route': 'pagos/save_payment', 

			'id_deudor': this.id_del_deudor,

			'abono_': this.abono,

			'monto_': this.monto,

			'payme_debt': this.abono_deuda_

		};

		var a = WebService.post(params);



		console.log(this.id_del_deudor + "***" + this.abono + "***" + this.monto + "***" + this.abono_deuda_ );



		a.done(function  (response) {

			if(response.StatusResult = 'OK'){

				Titan.modules['Informe_de_pagos'].buscar(this.id_del_deudor);

			}else{

				

			}



		}.bind(this));						

				

	},



    deshabilitar:function(){

		this.abono_deuda.attr('readonly', 'readonly');

		this.btnSave.attr('disabled', 'disabled');

		this.abono_deuda.html('');

	},



	habilitar:function(){

		 this.abono_deuda.removeAttr('readonly', 'readonly');

		 this.btnSave.removeAttr('disabled');

	},

	

	limpiar:function(){

		this.tablapagos.bootstrapTable('load', {});

	},

	updateLiquidation : function() {

	},



});

Titan.modules.create({



	name: 'Referencias',

	

	/*

	 * @constructor

	 * @description inicia los componentes del módulo

	 */

	ready: function () {

		

		this.container = $('#referencias-container');

		

		this.tabl_ref_per= this.container.find('#tabla-referencias-personales');

		this.thead = this.tabl_ref_per.find('thead > tr').first();

		this.tbody = this.tabl_ref_per.find('tbody').first();



		this.tabl_ref_com= this.container.find('#tabla-referencias-comerciales');

		this.whead = this.tabl_ref_com.find('thead > tr').first();

		this.wbody = this.tabl_ref_com.find('tbody').first();	



		this.informe_persona();

		this.informe_business();



	},



	informe_persona:function(){



		console.log('informe_persona metod');	 	

		var params = {

			route: 'crud/load', 
			nodata: true, 

			'data_table': 'debtor_personal_reference'

		}



		var a = WebService.post(params);



	 	a.done(	function  (response) {

	 		console.log(response);	 	 		

	 		this.loadStruct_personal(response.struct);

	 		this.tabl_ref_per.bootstrapTable('destroy');

    		this.tabl_ref_per.bootstrapTable();

	 	}.bind(this));



    },



    informe_business:function(){



		console.log('informe_business metod');	 	

		var params = {

			route: 'crud/load', 
			nodata: true, 
			'data_table': 'debtor_business_reference'

		};



		var a = WebService.post(params);



	 	a.done(	function  (response) {

	 		console.log(response);	 	 		

	 		this.loadStruct_business(response.struct);

	 		this.tabl_ref_com.bootstrapTable('destroy');

    		this.tabl_ref_com.bootstrapTable();

	 	}.bind(this));



    },



    loadData_personal: function (arreglo) {    	

    	this.tabl_ref_per.bootstrapTable('load', arreglo);

    },



     loadData_business: function (arreglo) {    	

    	this.tabl_ref_com.bootstrapTable('load', arreglo);

    },



    loadStruct_personal:function(estructura){

    	for(var i in estructura){

    		if (i != 'id' &&i != 'debtor') 

    			this.thead.append('<th data-field="' + i + '">' + estructura[i].name+ '</th>');

    	}

    },



     loadStruct_business:function(estructura){

    	for(var i in estructura){

    		if (i != 'id' &&i != 'debtor') 

    			this.whead.append('<th data-field="' + i + '">' + estructura[i].name+ '</th>');

    	}

    },



    buscar_personales: function (id) {



		var a = WebService.post({route: 'referencias/query_payment_personales', 'id_deudor': id});	



		a.done(function(response){	

			if(response.StatusResult == 'OK'){

				this.loadData_personal(response.personal);

				

			}else{

				this.tbody.html('');

				this.tabl_ref_per.bootstrapTable('destroy');

    			this.tabl_ref_per.bootstrapTable();

			}				

		}.bind(this));   		

    		

	},  





	buscar_comerciales: function (id) {



		var a = WebService.post({route: 'referencias/query_payment_business', 'id_deudor': id});	



		a.done(function(response){	

			if(response.StatusResult == 'OK'){

				this.loadData_business(response.business);

				

			}else{

				this.wbody.html('');

				this.tabl_ref_com.bootstrapTable('destroy');

    			this.tabl_ref_com.bootstrapTable();

			}				

		}.bind(this));   		

    		

	}, 



	

});



/*
 * @module  Codeudores
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */
Titan.modules.create({
	name: 'Codeudores',
	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components
		this.container = $('#codeudor-container');
		this.tablaInforme = this.container.find('#tabla_codeudores');
		//this.tablaInforme.bootstrapTable();
		this.thead = this.tablaInforme.find('thead > tr').first();
		this.tbody = this.tablaInforme.find('tbody').first();
		this.descripcion = this.container.find('#descripcion');
		this.btnSave = this.container.find('#save');
		this.count = $("#badge_codeudores");
		this.count.hide();	
		this.informe();
	},

	/*
	 * @name initEvents
	 * @description inicia los eventos de los componentes del módulo
	 * @return {void}
	 */
	initEvents: function () {
		Titan.click('btnSave', 'save', this);
	},

	update_table: function () {		
		this.buscar(Titan.global['deudor_id']);
	},

	save: function () {
		var descripcion = this.descripcion.val();
		if ($.trim(descripcion) !='') {
			var params = {
				'route': 'deudor/save_reports', 
				'id_deudor': Titan.global['deudor_id'],
				'__u__': __u__,
				'description': descripcion
			};

			var a = WebService.post(params);
			a.done(function  (response) {
				if(response.StatusResult){
					this.descripcion.val('');
					this.update_table();
					Titan.popup.success('El reporte se guardó exitosamente');
				}else{
					Titan.popup.danger('Error al guardar el reporte');
				}
			}.bind(this));
		} else
			Titan.popup.warning('Escriba primero el reporte');
	},


	/**
	* carga la estructura de la tabla 
	*/
	informe:function(){

		var params = {
			route: 'crud/load', 
			nodata: true, 
			'data_table': 'cosigner'
		}
		var a = WebService.post(params);
	 	a.done(	function  (response) {

	 		this.loadStruct(response.struct);
	 		this.tablaInforme.bootstrapTable('destroy');
    		this.tablaInforme.bootstrapTable();
	 	}.bind(this));
    },


    loadData: function (arreglo) { 
    	this.count.show(); 	
    	arreglo.length > 0? this.count.html(arreglo.length):this.count.hide();
    	   	
    	this.tablaInforme.bootstrapTable('load', arreglo);
    },

    loadStruct:function(estructura){
    	for(var i in estructura){
    		if (i != 'id' &&i != 'debtor') 
    			this.thead.append('<th data-field="' + i + '">' + estructura[i].name+ '</th>');
    	}
    },

    buscar: function (id) {
		this.tbody.html('');
		var a = WebService.post({route: 'deudor/query_cosigners', 'id_deudor': id});	
		a.done(function(response){	
			if(response.StatusResult == 'OK'){
				this.descripcion.val('');
				this.loadData(response.cosigners);	
			}else{
				this.count.hide()
				this.tbody.html('');
				this.tablaInforme.bootstrapTable('destroy');
    			this.tablaInforme.bootstrapTable();
			}
		}.bind(this));   		
	},  

	deshabilitar:function(sentinela){
		 this.descripcion.attr('disabled', 'disabled');
		 this.btnSave.attr('disabled', 'disabled');
		 this.tbody.html(' ');
	},

	habilitar:function(sentinela){
		 this.descripcion.removeAttr('disabled', 'disabled');
		 this.btnSave.removeAttr('disabled', 'disabled');
	},

	limpiar: function (){
		this.tablaInforme.bootstrapTable('load', {});
	},

});



/*

 * @module  Pagos

 *

 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)

 *

 * @license Derechos Reservados de Autor (C) IP Total Software S.A

 */



Titan.modules.create({



	name : 'Compromisos',



	/*

	 * @constructor @description inicia los componentes del módulo

	 */

	ready : function() {



		this.container = $('#compromisos-de-pagos-container');



		this.tablapagos = this.container.find('#tabla_pagos');

		this.thead = this.tablapagos.find('thead > tr').first();

		this.tbody = this.tablapagos.find('tbody').first();

		this.abono_deuda = this.container.find('#abono_deuda');

		this.abono_deuda.mask('0#');

		this.labelInfo = this.container.find('#monto');

		this.btnSave = this.container.find('#save');

		this.saldo_deuda = this.container.find('#saldo_deuda');



		this.informe();



	},



	initEvents : function() {

		Titan.click('btnSave', 'confirmationSave', this);

		// Titan.keypress('abono_deuda', 'loadAmount', this);



	},



	confirmationSave : function() {

		Titan.message.confirmation('Guardar Pago', 'Desea confirmar el pago',

				this.save, this);

	},



	update_table : function() {

		var id_del_deudor = Titan.modules['Informacion_del_deudor'].deudor.id;

		this.buscar(id_del_deudor);

	},



	informe : function() {



		console.log('informe metod');

		var params = {

			route : 'crud/load',
			nodata: true, 
			'data_table' : 'debt'

		}



		var a = WebService.post(params);



		a.done(function(response) {

			console.log(response);

			this.loadStruct(response.struct);

			this.tablapagos.bootstrapTable('destroy');

			this.tablapagos.bootstrapTable();

		}.bind(this));



	},



	loadData : function(arreglo) {

		this.tablapagos.bootstrapTable('load', arreglo);

	},



	loadStruct : function(estructura) {

		for ( var i in estructura) {

			if (i != 'id' && i != 'debtor')

				this.thead.append('<th data-field="' + i + '" data-formatter="'

						+ i + 'Formatter">' + estructura[i].name + '</th>');



		}

	},



	buscar : function(id) {



		this.tbody.html(' ');

		this.labelInfo.html(' ');

		this.abono_deuda.val('');



		var a = WebService.post({

			route : 'deudor/query_debt',

			'id_deudor' : id

		});



		a.done(function(response) {

			if (response.StatusResult == 'OK') {



				Titan.global['guardaSaldo'] = response.debts[0].amount;



				this.loadData(response.debts);



				this.labelInfo.html(amountFormatter(response.total_));

				Titan.global['debt'] = response.debts[0];



			} else {

				this.tbody.html('');

				this.tablapagos.bootstrapTable('destroy');

				this.tablapagos.bootstrapTable();

			}



		}.bind(this));



	},



	save : function() {



		this.abono = parseInt($.trim(this.abono_deuda.val()).valueOf());

		this.monto = parseInt(Titan.global['guardaSaldo'].valueOf());



		if (this.abono != '') {



			if (this.abono <= this.monto) {

				this.abono_deuda_ = this.monto - this.abono;



				var params = {

					'route' : 'deuda/save_debt',

					'abono_deuda' : this.abono_deuda_,

					'debt' : Titan.global['debt']

				};

				var a = WebService.post(params);



				a.done(function(response) {



					if (response.StatusResult) {

						this.save_payment_debtor();

						this.update_table();

						Titan.global['guardaSaldo'] = this.abono_deuda_;

						Titan.popup.success('El abono se guardó exitosamente');

					} else {

						Titan.popup.danger('Error al guardar el abono');

					}



				}.bind(this));

			} else {

				Titan.popup.danger('Error al guardar el abono');

			}

		} else {

			Titan.popup.warning('Escriba primero el abono');

		}

		;



	},



	loadAmount : function() {



		this.abono_ = parseInt($.trim(this.abono_deuda.val()).valueOf());

		this.monto_ = parseInt(Titan.global['guardaSaldo'].valueOf());

		this.abono_deuda_ = this.monto - this.abono;



	},



	save_payment_debtor : function() {



		this.abono = parseInt($.trim(this.abono_deuda.val()).valueOf());

		this.monto = parseInt(Titan.global['guardaSaldo'].valueOf());

		this.abono_deuda_ = this.monto - this.abono;

		this.id_del_deudor = Titan.modules['Informacion_del_deudor'].deudor.id;



		var params = {

			'route' : 'pagos/save_payment',

			'id_deudor' : this.id_del_deudor,

			'abono_' : this.abono,

			'monto_' : this.monto,

			'payme_debt' : this.abono_deuda_

		};

		var a = WebService.post(params);



		console.log(this.id_del_deudor + "***" + this.abono + "***"

				+ this.monto + "***" + this.abono_deuda_);



		a.done(function(response) {

			if (response.StatusResult = 'OK') {

				Titan.modules['Informe_de_pagos'].buscar(this.id_del_deudor);

			} else {



			}



		}.bind(this));



	},



	deshabilitar : function() {

		this.abono_deuda.attr('readonly', 'readonly');

		this.btnSave.attr('disabled', 'disabled');

		this.abono_deuda.html('');

	},



	habilitar : function() {

		this.abono_deuda.removeAttr('readonly', 'readonly');

		this.btnSave.removeAttr('disabled');

	},

	

	limpiar : function() {



	},



});

/*
 * @module  index
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */

Titan.modules.create({
	name: 'index',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components
		Titan.view( 'llamadas', 'informacion_del_deudor','informacion_Deudor_tab');
		Titan.view( 'liquidacion', 'pagos','liquidacion');
		Titan.view( 'llamadas', 'codeudores','codeudores_tab');
		Titan.view( 'llamadas', 'referencias','referencias_tab');
		Titan.view( 'llamadas', 'reportes_de_llamadas','reportes_de_llamadas');
		Titan.modules['Reportes_de_llamadas'].info = false;
		/*
		Titan.view( 'llamadas', 'informe_de_pagos','informe_pagos_tab');
		Titan.view( 'llamadas', 'compromisos','informe_crud');
		*/
	},
});

/*
 * @module  Informacion_del_deudor
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */

Titan.modules.create({

	name : 'Informacion_del_deudor',

	/*
	 * @constructor @description inicia los componentes del módulo
	 */
	ready : function() {

		this.container = $('#deudores-container');
		this.btn_buscar = $('#btn_buscar');
		this.load_subsidiary = $('#load_subsidiary');

		this.field_one_date = $('#date_init_commitment');
		this.btn_find_commitments_one = $('#btn_find_commitments');

		this.field_range_date_init = $('#date_init_commitment_range');
		this.field_range_date_finish = $('#date_finish_commitment_range');
		this.btn_find_commitments_range = $('#btn_find_commitments_range');




	},

	/*
	 * @name initEvents @description inicia los eventos de los componentes del
	 * módulo @return {void}
	 */
	initEvents : function() {
		this.buscar_sucursal();
		Titan.click('btn_buscar', 'buscar', this);
		Titan.click('btn_find_commitments_one', 'findForOneDate', this);
		Titan.click('btn_find_commitments_range', 'findForTwoDate', this);

		this.load_subsidiary.on('change', function() {
			this.buscar();
		}.bind(this))
	},

	buscar_sucursal : function() {

		var a = WebService.post({
			route : 'deudor/search_subsidiary'
		});

		a.done(function(response) {

			if (response.StatusResult == 'OK') {
				sucursales_ = response.sucursal;
				this.id_sucursal = sucursales_.id;

				for (var j = 0; j < sucursales_.length; j++) {
					this.load_subsidiary.append('<option value="'
							+ sucursales_[j].id + '" >' + sucursales_[j].name
							+ '</option>');
				}
				this.buscar();
			}
		}.bind(this));

	},

	nextIndex : function() {
		this.index++;
		this.setSelectedIndex(this.index);
	},

	buscar : function() {
		this.lista = $('#deudores-container');
		this.lista.html('');
		this.guarda_Sucursal = this.load_subsidiary.val();

		var params = {
			route : 'deudor/query_debtor_subsidiary',
			'sucursal_id' : this.guarda_Sucursal
		};

		var a = WebService.post(params);

		a.done(function(response) {

			if (response.StatusResult == 'OK') {
				this.processRenspose(response);
			} else {
				this.tbody.html('');
			}

		}.bind(this));

	},



	findForOneDate : function() {
		this.lista = $('#deudores-container');
		this.lista.html('');

		var params = {
			route : 'deudor/query_debtor_commitment_one',
			'date_init' : this.field_one_date.val(),
		};

		var a = WebService.post(params);

		a.done(function(response) {

			if (response.StatusResult == 'OK') {
				if (response.commitments) {
					this.processRenspose(response);
					Titan.popup.success('Se encontraron deudores');
					$('#for_day').modal('hide');
				}
			} else {
				Titan.popup.warning(
						'No se encontraron deudores para esta fecha', 4000);
			}

		}.bind(this));

	},

	findForTwoDate : function() {
		this.lista = $('#deudores-container');
		this.lista.html('');

		var params = {
			route : 'deudor/query_debtor_commitment_two',
			'date_init' : this.field_range_date_init.val(),
			'date_finish' : this.field_range_date_finish.val(),
		};

		var a = WebService.post(params);

		a.done(function(response) {

			if (response.StatusResult == 'OK') {
				if (response.commitments) {
					this.processRenspose(response);
					Titan.popup.success('Se encontraron deudores');
					$('#for_range').modal('hide');
				}
			} else {
				Titan.popup.warning(
						'No se encontraron deudores para estas fechas', 4000);
			}

		}.bind(this));

	},

	processRenspose : function(response) {
		this.debtors = response.deudores;
		this.deudas = response.otrasDeudas;

		var data = [];

		for (var i = 0; i < this.debtors.length; i++) {
			var debtor = this.debtors[i];
			var debts = this.deudas[i];
			var amount = 0;

			if (debts != null)
				for (var k = debts.length - 1; k >= 0; k--)
					amount += parseInt(debts[k].amount);
			else
				console.log(debtor);

			data.push({

				l1 : (i + 1) + ') Nombre:',
				r1 : '',

				l2 : debtor.name + ' ' + debtor.last_name,
				r2 : '$' + numberFormatter(amount),

				l3 : 'Teléfono: ' + debtor.phone_number_1,
				r3 : 'Código: ' + debtor.id,

				l4 : 'Cédula: ',
				r4 : debtor.dni

			});

		}

		this.lista.listMenu('load', data);
		this.lista.listMenu('onClick', this.onClickLista.bind(this));
	},

	onClickLista : function(e) {

		var debtor = this.lista.listMenu('getSelected');
		var id = debtor.r3.match(/[0-9]+/gmi)[0];
		var dni = debtor.r4;

		this.index = this.lista.listMenu('getIndex');
		this.deudor = this.debtors[this.index];


		Titan.global['id_subsidiary'] = this.load_subsidiary.val();
		Titan.global['id_deudor'] = this.deudor.id;
		Titan.global['deudor'] = this.deudor;
		Titan.global['dni'] = dni;

		

		Titan.modules['Pagos'].buscar(dni);
		Titan.modules['Reportes_de_llamadas'].buscar(this.deudor.id);
		Titan.modules['Reportes_de_llamadas'].habilitar();
		Titan.modules['Reportes_de_llamadas'].cancel();
		Titan.modules['Codeudores'].buscar(this.deudor.id);
		Titan.modules['Referencias'].buscar_personales(this.deudor.id);

	},

	updateLiquidation : function() {

	},

	limpiar : function() {

	},

});Titan.modules.create({



	name: 'Informe_de_pagos',

	

	/*

	 * @constructor

	 * @description inicia los componentes del módulo

	 */

	ready: function () {

		//init components

		this.container = $('#informe-pagos-container');

		this.tabla_informe_pagos = this.container.find('#tabla_pagos');

		

		this.thead = this.tabla_informe_pagos.find('thead > tr').first();

		this.tbody = this.tabla_informe_pagos.find('tbody').first();		

		

		console.log('cargando data pagos');	 	

		this.informe();



	},



	/*

	 * @name initEvents

	 * @description inicia los eventos de los componentes del módulo

	 * @return {void}

	 */

	initEvents: function () {

	},





	update_table: function () {		

	},	



	/**

	* carga la estructura de la tabla 

	*/

	informe:function(){



		console.log('informe metod');	 	

		var params = {

			route: 'crud/load', 
			nodata: true, 
			'data_table': 'payment'

		}



		var a = WebService.post(params);



	 	a.done(	function  (response) {

	 		console.log(response);	 	 		

	 		this.loadStruct(response.struct);

	 		this.tabla_informe_pagos.bootstrapTable('destroy');

    		this.tabla_informe_pagos.bootstrapTable();

	 	}.bind(this));



    },



    loadData: function (arreglo) {    	

    	this.tabla_informe_pagos.bootstrapTable('load', arreglo);

    },



    loadStruct:function(estructura){

    	for(var i in estructura){

    		if (i != 'id' &&i != 'debtor') 

    			this.thead.append('<th data-field="' + i + '">' + estructura[i].name+ '</th>');

    	}

    },



    buscar: function (id) {



		this.tbody.html('');

		this.id_ = id;



		var a = WebService.post({route: 'pagos/query_payment', 'id_deudor': id});	



		a.done(function(response){	

			if(response.StatusResult == 'OK'){

				this.loadData(response.payment);

				

			}else{

				this.tbody.html('');

				this.tabla_informe_pagos.bootstrapTable('destroy');

    			this.tabla_informe_pagos.bootstrapTable();

			}

				

		}.bind(this));   		

    		

	},  



limpiar: function (){

		

	},

	

});



/*
 * @module  Pagos
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */

Titan.modules.create({

	name: 'Pagos',
	
	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {

		this.container = $('#informe-de-pagos-container');	
		this.formu = this.container.find('#image_upload_form');
	},

	initEvents: function () {	
		this.formu.on('submit',(this.save));
	},	 

	save: function (e) {	
		
        e.preventDefault();	

        $.ajax({
           url: "upload.php",
			type: "POST",
			data:  new FormData(this),
			contentType: false,
    	    cache: false,
			processData:false,
			success: function(data)
		    {
			$("#targetLayer").html(data);
		    },
		  	error: function() 
	    	{
	    	} 
        });
	},

limpiar: function (){
		
	},

});
Titan.modules.create({
	name: 'Referencias',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {

		this.container = $('#referencias-container');
		this.tabl_ref_per= this.container.find('#tabla-referencias-personales');
		this.thead = this.tabl_ref_per.find('thead > tr').first();
		this.tbody = this.tabl_ref_per.find('tbody').first();
		this.count = $("#badge_referencias");
		this.count.hide();
		this.informe_persona();
	},

	informe_persona:function(){
		var params = {
			route: 'crud/load', 
			nodata: true, 
			'data_table': 'debtor_personal_reference'
		}
		var a = WebService.post(params);
	 	a.done(	function  (response) {
	 		this.loadStruct_personal(response.struct);
	 		this.tabl_ref_per.bootstrapTable('destroy');
    		this.tabl_ref_per.bootstrapTable();
	 	}.bind(this));
    },

    loadData_personal: function (arreglo) {   
    	this.count.show(); 	
    	this.count.html(arreglo.length);
    	this.tabl_ref_per.bootstrapTable('load', arreglo);
    },

    loadStruct_personal:function(estructura){
    	for(var i in estructura){
    		if (i != 'id' &&i != 'debtor') 
    			this.thead.append('<th data-field="' + i + '">' + estructura[i].name+ '</th>');
    	}
    },

    buscar_personales: function (id) {
		var a = WebService.post({route: 'referencias/query_payment_personales', 'id_deudor': id});	
		a.done(function(response){	
			if(response.StatusResult == 'OK'){
				this.loadData_personal(response.personal);
			}else{
				this.count.hide()
				this.tbody.html('');
				this.tabl_ref_per.bootstrapTable('destroy');
    			this.tabl_ref_per.bootstrapTable();
			}				
		}.bind(this));   		
	},  

});/*
 * @module  Login
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */

Titan.modules.create({
	name: 'Reportes_de_llamadas',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components
		this.container = $('#reportes-de-llamadas-container');
		this.tablareportes = this.container.find('#tabla_reportes');
		this.thead = this.tablareportes.find('thead > tr').first();
		this.tbody = this.tablareportes.find('tbody').first();
	
		this.descripcion = this.container.find('#descripcion');
		this.selectEstadoDeuda = this.container.find('#estado-deuda');
		this.colorStatus = this.container.find('#status_color');
		this.campoReport = this.container.find('#id_reporte');
		
		this.btnSave = this.container.find('#save');
		this.btn_update = this.container.find('#update');	
		this.btn_cancel = this.container.find('#cancel');	
		this.btn_update.hide();	
		this.btn_cancel.hide();	

		this.table = $('#tabla-info');
		this.tablaResponsive = this.container.find('.table-responsive');//
		var h = this.tablaResponsive.css('height');
		this.table.attr('data-height', h.replace('px','') );
		this.containerInfo = $('#content-info-deudor');
		this.panelInfo = $('#panel-content-info');
		//si hay que cargar la informacion del deudor
		this.info = true;
		this.campoFechaCompromiso = this.container.find('#fecha-de-compromiso')
		this.reportes();
	},


	/*
	 * @name initEvents
	 * @description inicia los eventos de los componentes del módulo
	 * @return {void}
	 */
	initEvents: function () {

		Titan.click('btnSave', 'save', this);
		Titan.click('btn_update', 'update', this);
		Titan.click('btn_cancel', 'cancel', this);
		//this.tablareportes.on('click-row.bs.table', this.onClickTable.bind(this));

		this.campoFechaCompromiso.on('change',  function(event) {

			var params = {
				'id_deudor': Titan.global['id_deudor'] ,
				route: 'deuda/commitment', 
				'dateCommitment': this.campoFechaCompromiso.val(),
			}

			var a = WebService.post(params);
		 	a.done(	function  (response) {
		 		if(response.StatusResult)
		 			if(response.StatusResult == "OK")
		 				Titan.popup.success('Compromiso de pago guardado '  + this.campoFechaCompromiso.val());	
		 			else
		 				Titan.popup.error('Error al guardar el Compromiso de pago ' + response.StatusResult);	
		 		else
		 			Titan.popup.error('Error al guardar el Compromiso de pago');	

		 	}.bind(this));

		}.bind(this));	

		this.selectEstadoDeuda.on('change',  function(event) {

			var select = event.target;
			var color = $(select).find('option[value='+$(select).val()+']').attr('data-color');
			this.colorStatus.css('background-color', color);

			var params = {
				'id_deudor': Titan.global['id_deudor'] ,
				route: 'deuda/color', 
				'stauts_color': this.selectEstadoDeuda.val(),
			}

			var a = WebService.post(params);

		 	a.done(	function  (response) {
		 		if(response.StatusResult) {
		 			if(response.StatusResult == "OK"){
		 				Titan.popup.success('Estado guardado');	
		 				var module = Titan.modules['Informacion_del_deudor'];
		 				if(module.index){
							var debt = module.deudas[module.index];
							debt.status_color = this.selectEstadoDeuda.val();	
						}
						Titan.modules['Pagos'].buscar(Titan.modules['Informacion_del_deudor'].deudor.dni); 
		 			}else
		 				Titan.popup.error('Error al guardar el Estado' + response.StatusResult);	
		 		}else
		 			Titan.popup.error('Error desconocido al guardar el estado');	

		 	}.bind(this));

		}.bind(this));	

	},



	update_table: function () {		
		this.buscar(Titan.global['id_deudor'] );
	},

	onClickTable: function (e, row, $element) {
		this.btnSave.hide();	
        this.btn_update.show();
		this.btn_cancel.show();	
		this.descripcion.val(row.description);
        this.campoReport.val(row.id);
    },

	cancel: function () {		
		this.descripcion.val('');
        this.campoReport.val('');
        this.btnSave.show();	
        this.btn_update.hide();
		this.btn_cancel.hide();	
	},

	save: function () {
		var descripcion = this.descripcion.val();
		if ($.trim(descripcion) !='') {		

			var params = {
				'route': 'deudor/save_reports_calls', 
				'id_deudor': Titan.global['id_deudor'] ,
				'__u__': __u__,
				'stauts_color': this.selectEstadoDeuda.val(),
				'description': descripcion,
				'sucursal': Titan.global['id_subsidiary'],
			}

			var a = WebService.post(params);

			this.btnSave.html('<img src="img/ajax-loader.gif" />');
			this.btnSave.attr("disabled","disabled");
			a.done(function  (response) {
				if(response.StatusResult=='OK'){
					this.descripcion.val('');
					this.update_table();
				}else{
					Titan.popup.danger('Error al guardar el reporte');
				}

				this.btnSave.html('GUARDAR');
				this.btnSave.removeAttr("disabled");
			}.bind(this));

		} else
			Titan.popup.warning('Escriba primero el reporte');
	},

	update: function () {
		var descripcion = this.descripcion.val();
		var id_report = this.campoReport.val();
		if ($.trim(descripcion) !='') {		

			var params = {
				'route': 'deudor/update_reports_calls', 
				'id_deudor': Titan.global['id_deudor'] ,
				'id_report': id_report,
				'__u__': __u__,
				'description': descripcion,
				'sucursal': Titan.global['id_subsidiary'],
			}

			var a = WebService.post(params);

			a.done(function  (response) {

				if(response.StatusResult=='OK'){
					this.descripcion.val('');
					this.update_table();
					this.cancel();
				}else{
					Titan.popup.danger('Error al guardar el reporte');
				}

			}.bind(this));
		} else
			Titan.popup.warning('Escriba primero el reporte');
	},


	/**
	* carga la estructura de la tabla 
	*/
	reportes:function(){
		var params = {
			route: 'crud/load', 
			nodata: true, 
			'data_table': 'reports_calls_debtor'
		}

		var a = WebService.post(params);
	 	a.done(	function  (response) {
	 		this.loadStruct(response.struct);
	 		this.tablareportes.bootstrapTable('destroy');
    		this.tablareportes.bootstrapTable();
	 	}.bind(this));

	 	var params = {
			route: 'deuda/loadStatus'
		}
		var a = WebService.post(params);
	 	a.done(	function  (response) {
	 		this.colors = response.status;
	 		for (var i = 0; i < response.status.length; i++) {
	 			this.selectEstadoDeuda.append('<option data-color="' + response.status[i].color + '" value="'+response.status[i].id+'" style="background:' + response.status[i].color + '; padding: 8px 16px;">'+response.status[i].name+'</option>')
	 		}
	 	}.bind(this));
    },



    loadData: function (arreglo) {    	
    	
    	this.tablareportes.bootstrapTable('load', arreglo);

    },



    loadStruct:function(estructura){
    	Titan.loader.hide();
    	for(var i in estructura){

    		if (i != 'id' &&i != 'debtor'&&i != 'subsidiary') 

    			this.thead.append('<th data-field="' + i + '">' + estructura[i].name+ '</th>');

    	}

    },



    buscar: function (id) {
    	
    	this.tbody.html('');
		var a = WebService.post({route: 'deudor/query_reports_calls_debtor', 'id_deudor': id});	

		a.done(function(response){	
			if(response.StatusResult == 'OK'){
				this.descripcion.val('');
				this.loadData(response.reports);	
				this.campoFechaCompromiso.val((response.commitment)?response.commitment.date:'');
				Titan.global['deuda'] = response.deuda;
				Titan.global['id_deudor'] = response.deudor.id;
				Titan.global['deudor'] = response.deudor;
				this.selectEstadoDeuda.val(Titan.global['deuda'].status_color);
				var color = this.selectEstadoDeuda.find('option[value='+this.selectEstadoDeuda.val()+']').attr('data-color');
				this.colorStatus.css('background-color', color);
				this.deudor = Titan.global['deudor'];

				if(this.info){
					var a = WebService.post({route: 'deudor/search', 'dni': this.deudor.dni});	
					a.done(function(data){
						if(data.StatusResult == 'OK'){
							this.deudor = data.deudor;
						    this.table.bootstrapTable('destroy');
						    this.containerInfo = $('#content-info-deudor');
						    this.containerInfo.html(''); 

							for(i in this.deudor){
								if(this.deudor[i]){
									if(i != 'Código' &&i != 'id' &&i != 'status' )
										this.containerInfo.append('<tr><td>' + i + ':</td><td>' + ((typeof this.deudor[i] == 'object')? this.deudor[i].name : this.deudor[i]) + '</td></tr>');										
							    }					
						    }

						    this.table.bootstrapTable();
						    this.panelInfo.show();
					     }	
				    }.bind(this));	
				}

			}else{
				this.tbody.html('');
				this.tablareportes.bootstrapTable('destroy');
    			this.tablareportes.bootstrapTable();
			}
		}.bind(this));  
	},  


	deshabilitar:function(){
		 this.descripcion.attr('disabled', 'disabled');
		 this.btnSave.attr('disabled', 'disabled');
		 this.tbody.html(' ');
	},

	habilitar:function(sentinela){
		 this.descripcion.removeAttr('disabled', 'disabled');
		 this.btnSave.removeAttr('disabled', 'disabled');
	},

	limpiar:function(sentinela){
		this.tablareportes.bootstrapTable('load', {});
		this.deshabilitar();
	},
});/*
 * @module  Backup
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */
 Titan.modules.create({

 	name: 'Backup',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	 ready: function () {
		//init components
		this.buttonBackup = $('#buttonBackup');
		this.buttonDownloadBackup = $('#downloadBackup');
		this.buttonDownloadBackup.hide();		
		
	},

	/*
	 * @name initEvents
	 * @description inicia los eventos de los componentes del módulo
	 * @return {void}
	 */
	 initEvents: function () {
	 	Titan.click('buttonBackup', 'createBackup', this);
	 },

	 createBackup: function () {
	 
	 	var r = WebService.post({route: 'security/backup' });

	 	r.done(function  (response) {
	 		if (response.StatusResult == 'OK') {
	 			this.buttonDownloadBackup.attr('href', '//'+location.host+'/bluefolder_backend/'+response.path_backup);
	 			this.buttonDownloadBackup.attr('data-file', response.path_backup);
	 			this.buttonDownloadBackup.show('slow', function() {
	 				this.buttonDownloadBackup.effect('shake');
	 			}.bind(this));
	 			Titan.popup.success('Copia de seguridad creada');
	 		} else{
	 			Titan.popup.info('faliure');
	 		}
	 	}.bind(this));

	 },

	
});/*
 * @module  Login
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */
 Titan.modules.create({
 	name: 'Login',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	 ready: function () {
	 	if(Session.response) {
			this.init(Session.response);
			_database_name = Session.database_name;
		}

		//init components
		this.btnLogin = $('#buttonLogin');
		this.userLogin = $('#inputUser');
		this.passLogin = $('#inputPass');
		this.inputCompany = $('#inputCompany');
		this.btnTerminosCondiciones = $('#terms-cond');
	},

	/*
	 * @name initEvents
	 * @description inicia los eventos de los componentes del módulo
	 * @return {void}
	 */
	 initEvents: function () {

	 	Titan.click('btnLogin', 'initSession', this);

	 	Titan.keypress('userLogin', 'initSessionEnter', this);
	 	Titan.keypress('passLogin', 'initSessionEnter', this);
	 	Titan.keypress('inputCompany', 'initSessionEnter', this);

	 	Titan.click('btnTerminosCondiciones', 'openTerms', this);

	 },

	 initSessionEnter: function (e) {
		  var tecla = (document.all) ? e.keyCode : e.which;
		  if (tecla==13){
			  this.initSession();
		  }
	},	

	 openTerms: function () {
	 	Titan.message.confirmation('Términos y Condiciones', '<iframe src="docs/terminos-y-condiciones.pdf" type="application/pdf" width="100%" height="100%"></iframe>');
	 	$('.modal-body').css('height', '450px');
	 	$('.modal-dialog').addClass('modal-lg')
	 },

	 openTermsLogin: function (response) {
	 	Titan.message.confirmation('Términos y Condiciones', '<iframe src="docs/terminos-y-condiciones.pdf" type="application/pdf" width="100%" height="100%"></iframe>', this.acceptTermsAndConditions, this ,'Acepto', 'No estoy de acuerdo');
	 	$('.modal-body').css('height', '450px');
	 	$('.modal-dialog').addClass('modal-lg')
	 },

	/*
	 * @name initSession
	 * @description envia los datos al webservice login para la autenticacion ante el sistema
	 * @return {void}
	 */
	 initSession: function () {

	 	if($.trim(this.inputCompany.val()) ==''){
			Titan.popup.warning('Ingrese el nombre de la empresa');
			return;
		}

	 	_database_name = null;
	 	var r = WebService.post({route: 'superadmin/company_query', 'company_name': this.inputCompany.val() });

	 	r.done(function  (response) {
	 		if (response.StatusResult == 'OK') {
	 			this.loginModule(response);
	 		} else{
	 			Titan.popup.info('no se encontraron datos de la empresa ' + this.inputCompany.val());
	 		}
	 	}.bind(this));
	 },


	 loginModule: function (response) {

		if($.trim(this.userLogin.val()) ==''){
			Titan.popup.warning('Ingrese su nombre de usuario');
			return;
		}

		if($.trim(this.passLogin.val()) ==''){
			Titan.popup.warning('Ingrese su contraseña');
			return;
		}

		if($.trim(this.passLogin.val()) !='' && $.trim(this.userLogin.val()) !=''){
			_database_name = response.database_name;
			Session.database_name = response.database_name;

			var a = WebService.post({route: 'security/login', 'login[pass]': this.passLogin.val(), 'login[user]': this.userLogin.val() });
			a.done(function  (response) {
				Session.response = response;
				this.init(response);
			}.bind(this));
		}
	 },

	onrefresh: function () {		
		Titan.message.confirmation('¿Desea cerrar la sesión?', 'Si sale de la página la sesión se cerrará automáticamente', this.close, this ,'Cerrar sesión', 'Permanecer en el sistema');
		return false;
	},

	close: function () {
		Titan.modules['Admin'].closeSession();

	},

	init: function (response) {

	 	if(response.StatusResult == 'OK'){
			if (response.count_session <= 0) 
				this.openTermsLogin(response);
			else
				Titan.view(response.module, response.view);

				this.response= response;
				__u__ = response.__u__;
				__u__r=response.__u__r;
				__u__r_= response.__u__r_;
		}else{
			Titan.popup.error(response.ErrorMessage);
		}
	 },


	 /*
	 * @name initSession
	 * @description envia los datos al webservice login para la autenticacion ante el sistema
	 * @return {void}
	 */
	 acceptTermsAndConditions: function () {

	 	var r = WebService.post({route: 'security/terms', 'accept':this.response. __u__});
	 	r.done(function  (response) {
	 		if (response.StatusResult == 'OK') {
	 			Titan.view(this.response.module, this.response.view);
	 			Titan.popup.success('Gracias por aceptar los terminos y condiciones de la plataforma BlueFolder ' );
	 		} else{
	 			Titan.popup.warning('Debes aceptar los terminos y condiciones' + this.inputCompany.val() );
	 		}
	 	}.bind(this));
	 },

});


/*

var tryingToReload = false;
//on before unload
window.onbeforeunload = function(e){ 
	//Firefox and Safari gets argument directly.
    if (!e) {
    	//this is for IE
        e = window.event; 
    }
     // clicked on the close button for IE 
    if (e.clientY != undefined && e.clientY < 0){
        tryingToReload = false;
    }
	// select close from context menu from the right click on title bar on IE
    if (e.clientY != undefined && (e.clientY > 100 && e.clientY < 140))  {
        tryingToReload = false;
    }

    //user hasn't clicked on X close button or hasn't selected close from context menu 
    if (tryingToReload){ 
        tryingToReload = false;
    }

    Titan.modules['Admin'].closeSession();
    return;
}

//attach to key down event to detect the F5 key 
document.onkeydown = function(e){ 
    tryingToReload = false;
 	//Firefox and Safari gets argument directly.
    if (!e) 
    {
        e = window.event;
    }
 
    var key = e.keyCode ? e.keyCode : e.which;
 	//try
    try 
    {
    	//F5 Key detected
        if (key == 116) 
        {
            tryingToReload = true;
        }
    } catch (ex) {}
}
 

document.oncontextmenu = function(e){} //check for the right click
*//*
 * @module  Admin
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */

Titan.modules.create({
	name : 'Admin',
	/*
	 * @constructor @description inicia los componentes del módulo
	 */
	ready : function() {

		// init components
		this.btnMenu = $('#nav-toogle-menu');
		this.btnSalir = $('#salir-session');
		this.slideMenu = $('.menu-slide');
		this.slideMenu.hide();
		this.NavigationMenu = $('#Navigation-menu');
		var menus = __u__r_;

		for (i in menus) {
			if (i < menus.length) {
				this.NavigationMenu.append('<li class="menu-item"  data-id-m="'

						+ menus[i].id + '" data-module="'
						+ menus[i].frontend_module + '" data-view="'
						+ menus[i].frontend_view + '" data-table="'
						+ menus[i].backend_table + '" >'
						+ '<a  data-id-m="' + menus[i].id
						+ '" data-module="' + menus[i].frontend_module
						+ '" data-view="' + menus[i].frontend_view
						+ '" data-table="' + menus[i].backend_table
						+ '" id ="blue-folder-menu-' + menus[i].id + '" >'
						+ '<span class="glyphicon glyphicon-' + menus[i].icon+ '"></span> '
						+ menus[i].name + '</a></li>');
			}
		}

		this.menusItems = $('.menu-item');
		
		var link = this.NavigationMenu.find('a').first();
		_crud = link.attr('data-table');
		_id_m = link.attr('data-id-m');
		Titan.view(link.attr('data-module'), link.attr('data-view'), 'content-admin');

		Titan.loader = {};
		Titan.loader.show = function () {
			$('#loader-content').fadeIn('fast');
		};
		Titan.loader.hide = function () {
			$('#loader-content').fadeOut('fast');
		};

		if (link.attr('data-view') == 'crud')
			Titan.loader.show();
	},

	/*
	 * @name initEvents @description inicia los eventos de los componentes del
	 * módulo @return {void}
	 */
	initEvents : function() {
		Titan.click('btnMenu', 'loadMenu', this);
		Titan.click('btnSalir', 'closeSession', this);
		Titan.click('menusItems', 'clickMenu', this);
	},

	/*
	 * @name clickMenu @description carga la vista usuarios @return {void}
	 */
	clickMenu : function(e) {
		var link = $(e.target);
		if (link.attr('data-view') == 'crud')
			$('#loader-content').fadeIn('fast');

		_moduleObject = link;
		_crud = link.attr('data-table');
		_id_m = link.attr('data-id-m');

		// carga los html,css, javascript
		Titan.view(link.attr('data-module'), link.attr('data-view'), 'content-admin');
		this.slideMenu.toggle('slide');
		Titan.loader.show();
	},

	/*
	 * @name loadMenu @description carga la vista usuarios @return {void}
	 */
	loadMenu : function(e) {
		this.slideMenu.toggle('slide');
	},

	/*
	 * @name closeSession @description carga la vista usuarios @return {void}
	 */
	closeSession : function(e) {
		WebService.post({ route : 'security/logout'}).done(function(data) {
			delete Session.response;
			location.reload();
		});
	},
});/* * @module  Crud * * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz) * * @license Derechos Reservados de Autor (C) IP Total Software S.A */ Titan.modules.create({			name : 'Crud',			/*			 * 			 * @constructor			 * 			 * @description inicia los componentes del módulo			 * 			 */			ready : function() {				// init components				this.moduleContainer = $('#crud-container');				this.optionsCrud = this.moduleContainer.find('#options-crud');				this.context = this.moduleContainer.find('.contextmenu');				// para las llaves foraneas				this.modalCount = 0;				// la tabla				this.tablaResponsive = this.moduleContainer						.find('.table-responsive');//				this.tableCrud = this.moduleContainer.find('#table-crud');				var h = this.tablaResponsive.css('height');				console.log(h);				this.tableCrud.attr('data-height', h.replace('px', ''));				this.thead = this.tableCrud.find('thead > tr').first();				this.tbody = this.tableCrud.find('tbody').first();				// para el formulario				this.modalTitle = this.moduleContainer.find('#modal-crud .modal-title');				this.modal = this.moduleContainer.find('#modal-crud');				this.modal.on('hidden.bs.modal', function (e) {				  if (this.inputdni) {				  	this.inputdni.popover('hide');				  } 				}.bind(this));				this.totalContainer = this.moduleContainer.find('#total');				this.form = this.moduleContainer.find('.modal-body form');				// para el paginador				this.page = 1;				// cantidad de filas que se muestran el la tabla				this.totalRows = 100;				this.loadForPaginator = false;				this.filtrated = false;				this.paginatorContaier = this.moduleContainer						.find('#paginator');				this.index();			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			initEvents : function() {				/*				 * this.tableCrud.on('sort.bs.table', function () {				 * 				 * this.moduleContainer.find('td').attr('nowrap', 'nowrap');				 * 				 * this.moduleContainer.find('td').css('padding', '2px 8px');				 * 				 * 				 * 				 * }.bind(this));				 * 				 */			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			index : function() {				// buscamos los permisos para el modulo				function findMenu(source, name) {					for ( var k in source) {						if (source[k]) {							if (source[k].menu == name) {								return source[k];							}						}					}				}				var permissions = findMenu(__u__r, _id_m);				this.optionsCrud.html('');				if (permissions.p_create == 1) {					this.optionsCrud							.append('<button id="btn-new" title="Nuevo" class="btn btn-default" data-toggle="modal" data-target="#modal-crud">'									+									'<i class="glyphicon glyphicon-plus"></i> '									+									'</button>'							);				}				if (permissions.p_delete == 1) {					this.optionsCrud							.append('<button  id="btn-delete" class="btn btn-default" data-toggle="modal" >'									+									'<i class="glyphicon glyphicon-minus"></i> '									+									'</button>'							);				}				if (permissions.p_update == 1) {					this.optionsCrud							.append('<button  id="btn-edit"  title="Editar"  class="btn btn-default" data-toggle="modal" >'									+									'<i class="glyphicon glyphicon-edit"></i> '									+									'</button>'							);				}				this.optionsCrud						.append('<button  id="btn-filter"  title="Filtrar"  class="btn btn-default" data-toggle="modal">'								+								'<i class="glyphicon glyphicon-search"></i> ' +								'</button>'						);				var params = {					route : 'crud/load',					'data_table' : _crud				};				params.page = this.page;				params.totalRows = this.totalRows;				var a = WebService.post(params);				a						.done(function(data) {							if (!this.loadForPaginator) {								this.tableName = data.table;								this.loadStruct(data.struct);								this.tableCrud.bootstrapTable('destroy');								this.tableCrud.bootstrapTable();							}							this.tbody.html('');							// this.loadData(data.data);							this.tableName = data.table;							var dataTable = data.data;							for ( var i in dataTable) {								for ( var k in dataTable[i]) {									if (dataTable[i][k])										if ((typeof dataTable[i][k]) == 'object') {											if (dataTable[i][k]) {												if ('name' in dataTable[i][k])													dataTable[i][k] = ('last_name' in dataTable[i][k]) ? dataTable[i][k].name															+ ' '															+ dataTable[i][k].last_name															: dataTable[i][k].name;											}										}								}							}							this.tableCrud.bootstrapTable('destroy');							this.tableCrud.bootstrapTable();							if (_crud_mode == 'filter')								this.tableCrud										.bootstrapTable('load', dataTable);							else								this.tableCrud										.bootstrapTable('load', dataTable);							this.moduleContainer.find('td').attr('nowrap',									'nowrap');							this.totalContainer									.html('<b>Total de registros: </b>'											+ data.count);							// calculamos la cantida de paginas que tendra el							// paginador							this.numPags = Math.ceil(data.count									/ this.totalRows);							if (this.numPags < this.page) {								this.page = this.numPags;								this.moduleContainer.find(										'li[data-page="' + this.numPags + '"]')										.click();							} else {								if (!this.loadForPaginator) {									// $('li[data-page="'+this.numPags+'"]').click();									// this.page = this.numPags;									// this.loadForPaginator = true;								}							}							this.paginatorContaier.html('');							// creamos los botones del paginador							for (var i = 0; i < this.numPags; i++) {								this.paginatorContaier.append('<li data-page="'										+ (i + 1)										+ '" class="'										+ (((i + 1) == this.page) ? 'active'												: '') + '" ><a data-page="'										+ (i + 1) + '" href="#">' + (i + 1)										+ '</a></li>');							}							// buscamos todos los botones del paginador							var btnPaginator = this.paginatorContaier									.find('li');							// agregamos el evento a cada boton del paginador							$									.each(											btnPaginator,											function(index, val) {												$(val)														.off('click')														.on(																'click',																function(e) {																	Titan.loader.show();																	var btn = $(e.target);																	var btnPaginator = this.paginatorContaier																			.find('li');																	btnPaginator																			.removeClass('active');																	this.page = btn																			.attr('data-page');																	this																			.refresh();																	console																			.log((index + 1) == this.page);																}.bind(this));											}.bind(this));							// botones							this.btnSave = this.moduleContainer.find('#save');							this.btnNew = this.moduleContainer.find('#btn-new');							this.btnFilter = this.moduleContainer									.find('#btn-filter');							this.btnCancel = this.moduleContainer									.find('.btn-cancel');							this.btnDelete = this.moduleContainer									.find('#btn-delete');							this.btnTrash = this.moduleContainer									.find('.btn-trash');							this.btnEdit = this.moduleContainer									.find('.btn-edit');							this.btnEditOpen = this.moduleContainer									.find('#btn-edit');							Titan.click('btnSave', 'save', this);							Titan.click('btnDelete', 'modeDelete', this);							Titan.click('btnTrash', 'trash', this);							Titan.click('btnEdit', 'edit', this);							Titan.click('btnNew', 'modeNew', this);							Titan.click('btnFilter', 'modeFilter', this);							Titan.click('btnCancel', 'cancel', this);							Titan.click('btnEditOpen', 'edit', this);							Titan.loader.hide();							/*							 * 							 * $('input').typeahead({							 * 							 * hint: true,							 * 							 * highlight: true,							 * 							 * minLength: 1 }, {							 * 							 * name: 'states',							 * 							 * displayKey: 'value',							 * 							 * source: substringMatcher(states)							 * 							 * });							 * 							 * 							 * 							 * 							 * 							 * 							 * 							 * this.tableCrud.find('td').mousedown(function(e){							 * 							 * if( e.button == 2 ) {							 * 							 * $(e.target).click();							 * 							 * if							 * (this.tableCrud.bootstrapTable('getSelections').length >							 * 0) {							 * 							 * 							 * 							 * this.context.css({							 * 							 * left: e.pageX + 'px',							 * 							 * top: (e.pageY - 80) + 'px'							 * 							 * }); }							 * 							 * return false; }							 * 							 * return true;							 * 							 * }.bind(this));							 * 							 */						}.bind(this));			},			/*			 * 			 * @name loadViewUsuarios			 * 			 * @description carga la vista usuarios			 * 			 * @return {void}			 * 			 */			loadStruct : function(dataStruct) {				this.opcion = {};				for ( var i in dataStruct) {					if (i != -1) {						this.thead								.append('<th  data-halign="center" data-formatter="'										+ dataStruct[i].type										+ 'Formatter" data-field="'										+ i										+ '" data-sortable="true">'										+ dataStruct[i].name + '</th>');						switch (dataStruct[i].type) {						case 'foranea':							this.opcion[i] = dataStruct[i].foranea.list;							var options = dataStruct[i].foranea.list;							var html = '<div class="form-group "><label class="col-md-4 control-label" for="'									+ i									+ '"">'									+ dataStruct[i].name									+ '</label>';							var divContainerSelect = $('<div></div>');							var div = $('<div></div>');							div.addClass('col-md-7');							var selecthtml = $('<select id="' + i									+ '" data-type="' + i									+ '" class="form-control"></select>');							for (var j = 0; j < options.length; j++) {								selecthtml										.append('<option value="'												+ options[j].id												+ '" >'												+ (('last_name' in options[j]) ? options[j].name														+ ' '														+ options[j].last_name														: options[j].name)												+ '</option>');							}							div.append(selecthtml);							divContainerSelect.append(div);							html = html + divContainerSelect.html();							html = html + '</div>';							this.form.append(html);							break;						case 'checkbox':							this.form									.append('<div class="form-group ">'											+											'<label class="col-sm-4 control-label" >'											+ dataStruct[i].name											+ '</label>'											+											'<div class="col-sm-7 col-dsm-offset-1 slideThree">'											+											'<input type="'											+ dataStruct[i].type											+ '"  '											+ ((dataStruct[i].name == 'Id') ? 'readonly'													: '')											+ ' data-type="'											+ i											+ '"  id="'											+ i											+ '" '											+ ((dataStruct[i].name == 'Id') ? ''													: ' ') + '>' +											'<label for="' + i + '"></label>' +											'</div></div>');							// placeholder="Ingrese ' + dataStruct[i].name + '"							break;						case 'decimal':							this.form.append('<div class="form-group ">' +							'<label class="col-sm-4 control-label" >'									+ dataStruct[i].name + '</label>' +									'<div class="col-sm-7">' +									'<input type="number" min="0" max="100" step="0.1" '									+ ((i == 'id') ? 'readonly' : '')									+ ' data-type="' + i									+ '"  class="form-control"  '									+ ((dataStruct[i].name == 'Id') ? '' : ' ')									+ '>' +									'</div></div>');							// if (dataStruct[i].type == 'number') {};							// $('input[type="number"]').mask('0#');							// placeholder="Ingrese ' + dataStruct[i].name + '"							break;						case 'textarea': // <textarea class="form-control"							// rows="3"></textarea>							this.form									.append('<div class="form-group ">'											+											'<label class="col-sm-4 control-label" >'											+ dataStruct[i].name											+ '</label>'											+											'<div class="col-sm-7">'											+											'<textarea  data-type="'											+ i											+ '"  class="form-control" rows="6" ></textarea>'											+											'</div></div>');							// if (dataStruct[i].type == 'number') {};							// $('input[type="number"]').mask('0#');							// placeholder="Ingrese ' + dataStruct[i].name + '"							break;						default:													this.form.append('<div class="form-group ">' +							'<label class="col-sm-4 control-label" >'									+ dataStruct[i].name + '</label>' +									'<div class="col-sm-7">' +									'<input type="' + dataStruct[i].type									+ '"  ' + ((i == 'id') ? 'readonly' : '')									+ ' data-type="' + i									+ '"  class="form-control"  '									+ ((dataStruct[i].name == 'Id') ? '' : ' ')									+ '   ' + ((this.tableName == 'Deudor' && i == 'dni') ? 'data-container="body" data-trigger="manual" data-toggle="popover" data-placement="right" data-content="Esta cédula ya esta registrada en esta sucursal"' : ' ')+'>' +									'</div></div>');							if(this.tableName == 'Deudor' && i == 'dni') {								this.inputdni = $("input[data-type='dni']");								this.select_debtor_subsidiary = $("select[data-type='subsidiary']");																							this.inputdni.focusout( this.validate_dni.bind(this));																								this.select_debtor_subsidiary.on('change', this.validate_dni.bind(this));																}							// if (dataStruct[i].type == 'number') {};							// $('input[type="number"]').mask('0#');							// placeholder="Ingrese ' + dataStruct[i].name + '"							break;						}					}				}				;			},			/*			 * 			 * @name loadGrupoTrabajo			 * 			 * @description carga la vista grupos de trabajo			 * 			 * @return {void}			 * 			 */			 validate_dni : function(event) {			 	event.preventDefault();								var params = {};				params.route = "deudor/search_debtor_subsidiary";				params.dni = this.inputdni.val();				params.subsidiary =this.select_debtor_subsidiary.val();				if(params.dni.length > 0){					var a = WebService.post(params);					a.done(function(data) {						if (data.StatusResult == 'FALIURE') {														var text = "Esta cédula ya esta registrada en " + ((data.subsidiarys.length>1)? "otras": "una")+" sucursal" + ((data.subsidiarys.length>1)? "es": "")+"<ul>";							for (var j in data.subsidiarys) {								if(j < data.subsidiarys.length)								text += "<li>" + data.subsidiarys[j] +"</li>";							}							text+="</ul>";							this.inputdni.popover({container: 'body'});							this.inputdni.popover('show');							var popoverContent = $('.popover-content');							popoverContent.html(text );													}else{							this.inputdni.popover('hide');						}					}.bind(this));				}							 },			save : function() {				_cancel = false;				var params = {};				this.inputList = $('.modal-body input, .modal-body textarea');				$.each(this.inputList,						function(index, val) {							if ($(val).attr('type') == 'checkbox')								params[_crud + '[' + $(val).attr('data-type')										+ ']'] = ($(val).is(':checked')) ? 1										: 0;							else								params[_crud + '[' + $(val).attr('data-type')										+ ']'] = $(val).val();						});				this.selectList = $('.modal-body select');				$.each(this.selectList, function(index, val) {					params[_crud + '[' + $(val).attr('data-type') + ']'] = $(							val).val();					// params[''+_crud+'['+$(val).attr('data-type')+']'] =					// $(val).val();				});				switch (_crud_mode) {				case 'new':					params.route = 'crud/create';					break;				case 'edit':					params.route = 'crud/update/' + _idRow;					break;				case 'filter':					params.route = 'crud/filter';					break;				}				params.data_table = _crud;				var a = WebService.post(params);				a						.done(function(data) {							if (data.StatusResult == 'OK') {								$.each(this.inputList, function(index, val) {									$(val).val('');								});								switch (_crud_mode) {								case 'new':									Titan.popup											.success('Datos guardados exitosamente');									this.refresh();									break;								case 'edit':									Titan.popup											.success('Datos Actualizados exitosamente');									this.refresh();								case 'filter':									var dataTable = data.data;									for ( var i in dataTable) {										for ( var k in dataTable[i]) {											if (dataTable[i][k])												if ((typeof dataTable[i][k]) == 'object') {													if ('name' in dataTable[i][k]) {														console																.log(dataTable[i][k]);														dataTable[i][k] = ('last_name' in dataTable[i][k]) ? dataTable[i][k].name																+ ' '																+ dataTable[i][k].last_name																: dataTable[i][k].name;													}												}										}									}									this.tableCrud.bootstrapTable('load',											dataTable);									this.moduleContainer.find('td').attr(											'nowrap', 'nowrap');									this.filtrated = true;									this.btnFilter											.html('<i class="glyphicon glyphicon-remove-circle"></i> ');									break;								}							}						}.bind(this));			},			modeDelete : function(e) {				var rows = this.tableCrud.bootstrapTable('getSelections');				if (rows.length > 0) {					var row = rows[0];					_idRow = row.id;					Titan.message.confirmation('Confirmación',							'¿desea eliminar este registro?', this.deleteMode,							this, 'Aceptar', 'Cancelar');				} else {					Titan.popup.warning('Debes selecionar un registro primero');				}				;			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			deleteMode : function(e) {				var params = {};				params.route = 'crud/erase/' + _idRow;				params.data_table = _crud;				params.database_name = _database_name;				var a = WebService.post(params);				a.done(function(data) {					if (data.StatusResult == 'OK') {						Titan.popup.success('Datos borrados exitosamente');						this.loadForPaginator = true;						this.index();					} else {						Titan.popup.error('Error al  borrar los datos');					}				}.bind(this));			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			trash : function(e) {				_idRow = $(e.target).attr('data-id');			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			refresh : function(e) {				this.loadForPaginator = true;				this.index();			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			cancel : function(e) {				_cancel = true;			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			modeNew : function(e) {				_crud_mode = 'new';				this.modalTitle.html("Registrar " + this.tableName);				this.addSelectRequired();				this.cleanFields();			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			modeEdit : function(e) {				_crud_mode = 'edit';				this.modalTitle.html("Editar " + this.tableName);				this.addSelectRequired();			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			modeFilter : function(e) {				if (this.filtrated) {					this.btnFilter							.html('<i class="glyphicon glyphicon-search"></i> ');					this.paginatorContaier.find('li').first().click();					this.filtrated = false;				} else {					$('#modal-crud').modal('show');					_crud_mode = 'filter';					this.modalTitle.html("Buscar " + this.tableName);					this.removeSelectRequired();					this.cleanFields();				}			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			removeSelectRequired : function() {				this.comboboxs = $('#modal-crud').find('select');				this.comboboxs.each(function(index, el) {					$(el).find('option').first().prop('selected', true);					if ($(el).val() != '')						$(el).prepend('<option value=""></option>');					$(el).val(0);				});			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			cleanFields : function() {				this.inputs = $('#modal-crud').find('input');				this.inputs.each(function(index, el) {					$(el).val('');				});			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			addSelectRequired : function() {				this.comboboxs = $('#modal-crud').find('select');				this.comboboxs.each(function(index, el) {					$(el).find('option').first().prop('selected', true);					if ($(el).val() == '')						$(el).find('option').first().remove();				});			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 * 			 * 			 * createModal: function (name, columnas, lista) {			 * 			 * 			 * 			 * 			 * 			 * var id = 'myModalgenerate'+ this.modalCount ;			 * 			 * 			 * 			 * var html = '<!-- Modal -->'+ '<div class="modal fade" id="'+ id			 * +'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"			 * aria-hidden="true">'+ '<div class="modal-dialog">'+ '<div			 * class="modal-content">'+ '<div class="modal-header">'+ '<button			 * type="button" class="close" data-dismiss="modal"><span			 * aria-hidden="true">&times;</span><span class="sr-only">Cancelar</span></button>'+ '<h4 class="modal-title" id="myModalLabel">Selecciona</h4>'+ '</div>'+ '<div			 * class="modal-body">'+ '</div>'+ '<div class="modal-footer">'+ '<button			 * type="button" class="btn-cancel btn btn-default"			 * data-dismiss="modal">Cancelar</button>'+ '<button id="delete"			 * type="button" class="btn btn-primary">Aceptar</button>'+ '</div>'+ '</div>'+ '</div>'+ '</div>';			 * 			 * 			 * 			 * this.moduleContainer.append(html);			 * 			 * 			 * 			 * var body = this.moduleContainer.find('#'+id + ' .modal-body');			 * 			 * 			 * 			 * var htmlTable = '<div class="table-responsive">'+ '<table			 * id="table-crud" class="table table-hover ">'+ '<thead></thead>'+ '<tbody>'+ '</tbody>'+ '</table>'+ '</div>';			 * 			 * 			 * 			 * body.append(htmlTable);			 * 			 * 			 * 			 * //crear los nombres de las columnas			 * 			 * var thead = body.find('thead');			 * 			 * 			 * 			 * var row = $('<tr></tr>');			 * 			 * for(i in columnas){			 * 			 * if (i)			 * 			 * row.append('<th>' + i + '</th>'); }			 * 			 * 			 * 			 * thead.append(row);			 * 			 * 			 * 			 * //cargar los datos en las tablas			 * 			 * var tbody = body.find('tbody');			 * 			 * 			 * 			 * for(i in lista){			 * 			 * var row = $('<tr></tr>');			 * 			 * if (i){			 * 			 * for(k in lista[i]){			 * 			 * row.append('<td nowrap>' + lista[i][k] + '</td>'); } }			 * 			 * tbody.append(row); }			 * 			 * 			 * 			 * this.modalCount ++;			 * 			 * 			 * 			 * return id; },			 */			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			edit : function(e) {				var rows = this.tableCrud.bootstrapTable('getSelections');				if (rows.length > 0) {					_crud_mode = 'edit';					this.modalTitle.html("Editar " + this.tableName);					$('#modal-crud').modal('show');					var row = rows[0];					_idRow = row.id;					var params = {};					params.route = 'crud/edit/' + _idRow;					params.data_table = _crud;					var a = WebService.post(params);					a.done(function(data) {						row = data.data;						function findById(source, name) {							for ( var k in source) {								if (source[k]) {									if (((source[k].last_name) ? source[k].name											+ ' ' + source[k].last_name											: source[k].name) == name) {										return source[k];									}								}							}						}						for ( var i in row) {							var input_ = $('input[data-type=' + i + ']');							if (input_.length > 0) {								if (input_.attr('type') == 'checkbox') {									if (row[i] == 0) {										input_.attr('checked', false);									} else {										input_.attr('checked', true);									}								} else {									input_.val(row[i]);								}								;							} else {								var select = $('select[data-type=' + i + ']');								if (select.length > 0) {									/*									 * var result = findById(this.opcion[i],									 * row[i]);									 * 									 * console.log(result);									 * 									 * select.val(result.id);									 */									select.val(row[i]);								} else {									var textarea = $('textarea[data-type=' + i											+ ']');									if (textarea.length > 0) {										// var result = findById(this.opcion[i],										// row[i]);										console.log('entró');										textarea.val(row[i]);									}								}							}						}					});				} else {					Titan.popup.warning('Debes selecionar un registro primero');				}				;				/*				 * 				 * var params = {};				 * 				 * 				 * 				 * params.route = 'crud/edit/' + _idRow;				 * 				 * params.data_table = _crud;				 * 				 * 				 * 				 * var a = WebService.post(params);				 * 				 * 				 * 				 * a.done(function (data) {				 * 				 * 				 * 				 * if (data.StatusResult=='OK') {				 * 				 * 				 * 				 * 				 * 				 * 				 * 				 * for (var i in data.data) {				 * 				 * var input_ = $('input[data-type=' + i + ']');				 * 				 * if (input_.length>0)				 * 				 * input_.val(data.data[i]);				 * 				 * else{				 * 				 * var select = $('select[data-type=' + i + ']');				 * 				 * select.val(data.data[i]); } }				 * 				 * 				 * 				 * //this.btnCancel.click(); }				 * 				 * }.bind(this));				 * 				 * 				 * 				 */			},		});/*
 * @module  Login
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */

Titan.modules.create({
	name: 'Reportes_de_llamadas',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components
		this.container = $('#reportes-de-llamadas-container');
		this.tablareportes = this.container.find('#tabla_reportes');
		this.thead = this.tablareportes.find('thead > tr').first();
		this.tbody = this.tablareportes.find('tbody').first();
	
		this.descripcion = this.container.find('#descripcion');
		this.selectEstadoDeuda = this.container.find('#estado-deuda');
		this.colorStatus = this.container.find('#status_color');
		this.campoReport = this.container.find('#id_reporte');
		
		this.btnSave = this.container.find('#save');
		this.btn_update = this.container.find('#update');	
		this.btn_cancel = this.container.find('#cancel');	
		this.btn_update.hide();	
		this.btn_cancel.hide();	

		this.table = $('#tabla-info');
		this.tablaResponsive = this.container.find('.table-responsive');//
		var h = this.tablaResponsive.css('height');
		this.table.attr('data-height', h.replace('px','') );
		this.containerInfo = $('#content-info-deudor');
		this.panelInfo = $('#panel-content-info');
		//si hay que cargar la informacion del deudor
		this.info = true;
		this.campoFechaCompromiso = this.container.find('#fecha-de-compromiso')
		this.reportes();
	},


	/*
	 * @name initEvents
	 * @description inicia los eventos de los componentes del módulo
	 * @return {void}
	 */
	initEvents: function () {

		Titan.click('btnSave', 'save', this);
		Titan.click('btn_update', 'update', this);
		Titan.click('btn_cancel', 'cancel', this);
		//this.tablareportes.on('click-row.bs.table', this.onClickTable.bind(this));

		this.campoFechaCompromiso.on('change',  function(event) {

			var params = {
				'id_deudor': Titan.global['id_deudor'] ,
				route: 'deuda/commitment', 
				'dateCommitment': this.campoFechaCompromiso.val(),
			}

			var a = WebService.post(params);
		 	a.done(	function  (response) {
		 		if(response.StatusResult)
		 			if(response.StatusResult == "OK")
		 				Titan.popup.success('Compromiso de pago guardado '  + this.campoFechaCompromiso.val());	
		 			else
		 				Titan.popup.error('Error al guardar el Compromiso de pago ' + response.StatusResult);	
		 		else
		 			Titan.popup.error('Error al guardar el Compromiso de pago');	

		 	}.bind(this));

		}.bind(this));	

		this.selectEstadoDeuda.on('change',  function(event) {

			var select = event.target;
			var color = $(select).find('option[value='+$(select).val()+']').attr('data-color');
			this.colorStatus.css('background-color', color);

			var params = {
				'id_deudor': Titan.global['id_deudor'] ,
				route: 'deuda/color', 
				'stauts_color': this.selectEstadoDeuda.val(),
			}

			var a = WebService.post(params);

		 	a.done(	function  (response) {
		 		if(response.StatusResult) {
		 			if(response.StatusResult == "OK"){
		 				Titan.popup.success('Estado guardado');	
		 				var module = Titan.modules['Informacion_del_deudor'];
		 				if(module.index){
							var debt = module.deudas[module.index];
							debt.status_color = this.selectEstadoDeuda.val();	
						}
						Titan.modules['Pagos'].buscar(Titan.modules['Informacion_del_deudor'].deudor.dni); 
		 			}else
		 				Titan.popup.error('Error al guardar el Estado' + response.StatusResult);	
		 		}else
		 			Titan.popup.error('Error desconocido al guardar el estado');	

		 	}.bind(this));

		}.bind(this));	

	},



	update_table: function () {		
		this.buscar(Titan.global['id_deudor'] );
	},

	onClickTable: function (e, row, $element) {
		this.btnSave.hide();	
        this.btn_update.show();
		this.btn_cancel.show();	
		this.descripcion.val(row.description);
        this.campoReport.val(row.id);
    },

	cancel: function () {		
		this.descripcion.val('');
        this.campoReport.val('');
        this.btnSave.show();	
        this.btn_update.hide();
		this.btn_cancel.hide();	
	},

	save: function () {
		var descripcion = this.descripcion.val();
		if ($.trim(descripcion) !='') {		

			var params = {
				'route': 'deudor/save_reports_calls', 
				'id_deudor': Titan.global['id_deudor'] ,
				'__u__': __u__,
				'stauts_color': this.selectEstadoDeuda.val(),
				'description': descripcion,
				'sucursal': Titan.global['id_subsidiary'],
			}

			var a = WebService.post(params);

			this.btnSave.html('<img src="img/ajax-loader.gif" />');
			this.btnSave.attr("disabled","disabled");
			a.done(function  (response) {
				if(response.StatusResult=='OK'){
					this.descripcion.val('');
					this.update_table();
				}else{
					Titan.popup.danger('Error al guardar el reporte');
				}

				this.btnSave.html('GUARDAR');
				this.btnSave.removeAttr("disabled");
			}.bind(this));

		} else
			Titan.popup.warning('Escriba primero el reporte');
	},

	update: function () {
		var descripcion = this.descripcion.val();
		var id_report = this.campoReport.val();
		if ($.trim(descripcion) !='') {		

			var params = {
				'route': 'deudor/update_reports_calls', 
				'id_deudor': Titan.global['id_deudor'] ,
				'id_report': id_report,
				'__u__': __u__,
				'description': descripcion,
				'sucursal': Titan.global['id_subsidiary'],
			}

			var a = WebService.post(params);

			a.done(function  (response) {

				if(response.StatusResult=='OK'){
					this.descripcion.val('');
					this.update_table();
					this.cancel();
				}else{
					Titan.popup.danger('Error al guardar el reporte');
				}

			}.bind(this));
		} else
			Titan.popup.warning('Escriba primero el reporte');
	},


	/**
	* carga la estructura de la tabla 
	*/
	reportes:function(){
		var params = {
			route: 'crud/load', 
			nodata: true, 
			'data_table': 'reports_calls_debtor'
		}

		var a = WebService.post(params);
	 	a.done(	function  (response) {
	 		this.loadStruct(response.struct);
	 		this.tablareportes.bootstrapTable('destroy');
    		this.tablareportes.bootstrapTable();
	 	}.bind(this));

	 	var params = {
			route: 'deuda/loadStatus'
		}
		var a = WebService.post(params);
	 	a.done(	function  (response) {
	 		this.colors = response.status;
	 		for (var i = 0; i < response.status.length; i++) {
	 			this.selectEstadoDeuda.append('<option data-color="' + response.status[i].color + '" value="'+response.status[i].id+'" style="background:' + response.status[i].color + '; padding: 8px 16px;">'+response.status[i].name+'</option>')
	 		}
	 	}.bind(this));
    },



    loadData: function (arreglo) {    	
    	
    	this.tablareportes.bootstrapTable('load', arreglo);

    },



    loadStruct:function(estructura){
    	Titan.loader.hide();
    	for(var i in estructura){

    		if (i != 'id' &&i != 'debtor'&&i != 'subsidiary') 

    			this.thead.append('<th data-field="' + i + '">' + estructura[i].name+ '</th>');

    	}

    },



    buscar: function (id) {
    	
    	this.tbody.html('');
		var a = WebService.post({route: 'deudor/query_reports_calls_debtor', 'id_deudor': id});	

		a.done(function(response){	
			if(response.StatusResult == 'OK'){
				this.descripcion.val('');
				this.loadData(response.reports);	
				this.campoFechaCompromiso.val((response.commitment)?response.commitment.date:'');
				Titan.global['deuda'] = response.deuda;
				Titan.global['id_deudor'] = response.deudor.id;
				Titan.global['deudor'] = response.deudor;
				this.selectEstadoDeuda.val(Titan.global['deuda'].status_color);
				var color = this.selectEstadoDeuda.find('option[value='+this.selectEstadoDeuda.val()+']').attr('data-color');
				this.colorStatus.css('background-color', color);
				this.deudor = Titan.global['deudor'];

				if(this.info){
					var a = WebService.post({route: 'deudor/search', 'dni': this.deudor.dni});	
					a.done(function(data){
						if(data.StatusResult == 'OK'){
							this.deudor = data.deudor;
						    this.table.bootstrapTable('destroy');
						    this.containerInfo = $('#content-info-deudor');
						    this.containerInfo.html(''); 

							for(i in this.deudor){
								if(this.deudor[i]){
									if(i != 'Código' &&i != 'id' &&i != 'status' )
										this.containerInfo.append('<tr><td>' + i + ':</td><td>' + ((typeof this.deudor[i] == 'object')? this.deudor[i].name : this.deudor[i]) + '</td></tr>');										
							    }					
						    }

						    this.table.bootstrapTable();
						    this.panelInfo.show();
					     }	
				    }.bind(this));	
				}

			}else{
				this.tbody.html('');
				this.tablareportes.bootstrapTable('destroy');
    			this.tablareportes.bootstrapTable();
			}
		}.bind(this));  
	},  


	deshabilitar:function(){
		 this.descripcion.attr('disabled', 'disabled');
		 this.btnSave.attr('disabled', 'disabled');
		 this.tbody.html(' ');
	},

	habilitar:function(sentinela){
		 this.descripcion.removeAttr('disabled', 'disabled');
		 this.btnSave.removeAttr('disabled', 'disabled');
	},

	limpiar:function(sentinela){
		this.tablareportes.bootstrapTable('load', {});
		this.deshabilitar();
	},
});/*
 * @module  Abono
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DoweSoft
 */

Titan.modules.create({

	name: 'Abono',
	
	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components
		this.btn_calcular_abono = $('#btn_calcular_abono');
		this.btn_calcular_abono_minimo = $('#btn_calcular_abono_minimo');
		this.campo_abono = $('#monto-abono');
		this.campo_abono.mask('0#');
		this.infoDebts = $('#data_debts_abonos');
		this.infoDebtstbody = this.infoDebts.find('tbody').first();
	},

	/*
	 * @name initEvents
	 * @description inicia los eventos de los componentes del módulo
	 * @return {void}
	 */

	initEvents: function () {
		Titan.click('btn_calcular_abono', 'calcular', this);
		Titan.click('btn_calcular_abono_minimo', 'calcularMinimo', this);
	},

	calcular: function () {

		if (Titan.modules.Pagos.tablapagos.bootstrapTable('getSelections').length >=1) {

			if (this.campo_abono.val()!='') {
				var a = WebService.post({
					route: 'deudor/calcularAbono/',
					abono: this.campo_abono.val(),
					fecha: Titan.modules.Pagos.campoFechaLiquidacion.val(),
					debt: Titan.modules.Pagos.tablapagos.bootstrapTable('getSelections')[0],
				});

			 	a.done(	function  (response) {
			 			
			 		this.infoDebtstbody.html('');
			 		var data = response.liquidation[0];

			 		var datosResaltados = ['total Servicios', 'total Interes por cobrar', 'total del abono', 'gastos de cobranza'];
		 	 				console.log(response,datosResaltados);
					for(i in data){
						if(i != 'total del abono'){
							var b = (datosResaltados.contains(i))? true:false;

							this.infoDebtstbody.append('<tr><td>'+ 
								((b)? '<strong>' : '') + i + ((b)? '</strong>' : '') 
								+'</td><td>'+ ((b)? '<strong>' : '')  + 
								((data[i] > 999)? '$'+ numberFormatter(data[i]):data[i]) + 
								((b)? '</strong>' : '')  + '</td></tr>')
						
						}else if(i)
							this.infoDebtstbody.append('<tr><td>'  + i +'</td><th><h3><strong>' + ((data[i] > 999)? '$'+ numberFormatter(data[i]):data[i]) + '</strong></h3></th></tr>')
	 	 			}

			 	}.bind(this));
			} else {
			 	Titan.popup.warning('ingrese el monto del abono');
			}
		}else {
		 	Titan.popup.warning('seleccione una deuda primero');
		}
	},

	calcularMinimo: function () {

		if (Titan.modules.Pagos.tablapagos.bootstrapTable('getSelections').length >=1) {

			//if (this.campo_abono.val()!='') {
				var a = WebService.post({
					route: 'deudor/calcularAbonoMinimo/',
					abono: this.campo_abono.val(),
					fecha: Titan.modules.Pagos.campoFechaLiquidacion.val(),
					debt: Titan.modules.Pagos.tablapagos.bootstrapTable('getSelections')[0],
				});

			 	a.done(	function  (response) {
			 			
			 		this.infoDebtstbody.html('');
			 		var data = response.liquidation[0];

			 		var datosResaltados = ['total Servicios', 'total Interes por cobrar', 'total del abono', 'gastos de cobranza'];
		 	 				console.log(response,datosResaltados);
					for(i in data){
						if(i != 'total del abono'){
							var b = (datosResaltados.contains(i))? true:false;

							this.infoDebtstbody.append('<tr><td>'+ 
								((b)? '<strong>' : '') + i + ((b)? '</strong>' : '') 
								+'</td><td>'+ ((b)? '<strong>' : '')  + 
								((data[i] > 999)? '$'+ numberFormatter(data[i]):data[i]) + 
								((b)? '</strong>' : '')  + '</td></tr>')
						
						}else if(i)
							this.infoDebtstbody.append('<tr><td>'  + i +'</td><th><h3><strong>' + ((data[i] > 999)? '$'+ numberFormatter(data[i]):data[i]) + '</strong></h3></th></tr>')
	 	 			}

			 	}.bind(this));
			//} else {
			 //	Titan.popup.warning('ingrese el monto del abono');
			//}
		}else {
		 	Titan.popup.warning('seleccione una deuda primero');
		}
	},


});
/*

 * @module  Codeudores

 *

 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)

 *

 * @license Derechos Reservados de Autor (C) IP Total Software S.A

 */



Titan.modules.create({



	name: 'Codeudores',

	

	/*

	 * @constructor

	 * @description inicia los componentes del módulo

	 */

	ready: function () {

		//init components

		this.container = $('#codeudor-container');

		this.tablaInforme = this.container.find('#tabla_codeudores');

		//this.tablaInforme.bootstrapTable();



		this.thead = this.tablaInforme.find('thead > tr').first();

		this.tbody = this.tablaInforme.find('tbody').first();

		this.descripcion = this.container.find('#descripcion');



		this.btnSave = this.container.find('#save');	

		console.log('cargando data codeudores');	 	

		this.informe();



	},



	/*

	 * @name initEvents

	 * @description inicia los eventos de los componentes del módulo

	 * @return {void}

	 */

	initEvents: function () {

		Titan.click('btnSave', 'save', this);

	},





	update_table: function () {		

		this.buscar(Titan.global['deudor_id']);

	},



	save: function () {



		var descripcion = this.descripcion.val();



		if ($.trim(descripcion) !='') {

		

			

			var params = {

				'route': 'deudor/save_reports', 

				'id_deudor': Titan.global['deudor_id'],

				'__u__': __u__,

				'description': descripcion

			};

			var a = WebService.post(params);



			a.done(function  (response) {



				if(response.StatusResult){

					this.descripcion.val('');

					this.update_table();

					Titan.popup.success('El reporte se guardó exitosamente');

				}else{

					Titan.popup.danger('Error al guardar el reporte');

				}

					

			}.bind(this));

		} else{

			Titan.popup.warning('Escriba primero el reporte');

		};

				

	},

	



	/**

	* carga la estructura de la tabla 

	*/

	informe:function(){



		console.log('informe metod');	 	

		var params = {

			route: 'crud/load', 
			nodata: true, 
			'data_table': 'cosigner'

		}



		var a = WebService.post(params);



	 	a.done(	function  (response) {

	 		console.log(response);	 	 		

	 		this.loadStruct(response.struct);

	 		this.tablaInforme.bootstrapTable('destroy');

    		this.tablaInforme.bootstrapTable();

	 	}.bind(this));



    },



    loadData: function (arreglo) {    	

    	this.tablaInforme.bootstrapTable('load', arreglo);

    },



    loadStruct:function(estructura){

    	for(var i in estructura){

    		if (i != 'id' &&i != 'debtor') 

    			this.thead.append('<th data-field="' + i + '">' + estructura[i].name+ '</th>');

    	}

    },



    buscar: function (id) {

		this.tbody.html('');

		var a = WebService.post({route: 'deudor/query_cosigners', 'id_deudor': id});	



		a.done(function(response){	

			if(response.StatusResult == 'OK'){

				this.descripcion.val('');

				console.log(response.cosigners);

				this.loadData(response.cosigners);	



			}else{

				this.tbody.html('');

				this.tablaInforme.bootstrapTable('destroy');

    			this.tablaInforme.bootstrapTable();

			}

				

		}.bind(this));   		

    		

	},  



	deshabilitar:function(sentinela){

		 this.descripcion.attr('disabled', 'disabled');

		 this.btnSave.attr('disabled', 'disabled');

		 this.tbody.html(' ');



	},



	habilitar:function(sentinela){

		 this.descripcion.removeAttr('disabled', 'disabled');

		 this.btnSave.removeAttr('disabled', 'disabled');

	}

});



/*
 * @module  index
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */
Titan.modules.create({
	name: 'index',
	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components
		Titan.view( 'llamadas', 'reportes_de_llamadas','informe_de_llamada_tab');
		Titan.view( 'liquidacion', 'informacion_del_deudor','informacion_Deudor_tab');
		Titan.view( 'liquidacion', 'pagos','pagos_tab');
		Titan.view( 'liquidacion', 'codeudores','codeudores_tab');
		Titan.view( 'liquidacion', 'informe_de_pagos','informe_pagos_tab');
		Titan.view( 'liquidacion', 'referencias','referencias_tab');
	},

});/*
 * @module  Login
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */
Titan.modules.create({

	name: 'Informacion_del_deudor',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components
		this.info_deudor_field = $('#busca_Deudor');
		this.info_deudor_field.mask('0#');
		this.btn_buscar = $('#btn_buscar');
		this.containerInfo = $('#content-information-deudor');
		this.panelInfo = $('#panel-content-info');
		this.nombre_deudor = $('#nombre');
		this.table = $('#tabla-info');
		
		this.select_sucursal = $('#select_sucursales');
		this.select_sucursal.hide();
	},

	/*
	 * @name initEvents
	 * @description inicia los eventos de los componentes del módulo
	 * @return {void}
	 */

	initEvents: function () {
		Titan.click('btn_buscar', 'ejecutarBusqueda', this);
		Titan.keypress('info_deudor_field', 'buscar', this);
		this.select_sucursal.on('change',  function(event) {
			 this.cargarData(this.select_sucursal.val());
		}.bind(this));	
	},


	ejecutarBusqueda: function () {
		if(this.info_deudor_field.val() == ''){
					Titan.popup.danger('Debe ingresar el número de cedula del deudor! ');
					this.panelInfo.hide();
				}else{
		var a = WebService.post({route: 'deudor/search_debtor', 'dni': this.info_deudor_field.val()});	

					a.done(function(data){

						if(data.StatusResult == 'OK'){
							//guardamos la informacion del deudor
							this.deudores = data.deudores;
							this.sucursales = data.sucursales;
							
							
							if(this.sucursales.length <= 1){
								this.cargarData(0);
								this.select_sucursal.hide();
							}else{
								this.select_sucursal.html("");
								this.select_sucursal.append("<option value='-1'> -- seleccione la sucursal -- </option>");
								
								for(i in this.sucursales)
									if(i < this.sucursales.length)
										this.select_sucursal.append("<option value='" + i +  "'>" + this.sucursales[i].name + "</option>");
								this.select_sucursal.show();
								
								this.limpiar();
							}

						}else{
							Titan.popup.info(data.ErrorMessage );
							Titan.modules['Reportes_de_llamadas'].deshabilitar();	
							this.panelInfo.hide();	
					     }	
				    }.bind(this));	
				}
	},
	
	buscar: function (e) {
		
		  var tecla = (document.all) ? e.keyCode : e.which;
		  if (tecla==13){
			  
			  console.log("buscando deudor ...");
				
				this.dato_encontrado = false;

				if(this.info_deudor_field.val() == ''){
					Titan.popup.danger('Debe ingresar el número de cedula del deudor! ');
					this.panelInfo.hide();
				}else{
					this.ejecutarBusqueda();
				}	
		  }
			
	},	

	cargarData: function (index) {
		console.log("cargando la informacion del deudor ...");
		this.dato_encontrado = false;
		this.deudor = this.deudores[index];
		Titan.global['deudor_id'] = this.deudor.id;
	    this.dato_encontrado = true;
	    
	    this.limpiar();
	   
	    var params = {
	    		route: 'deudor/search', 
	    		'dni': this.deudor.dni,
	    		'sucursal': this.sucursales[index].id,
	    	};
	    
	    var a = WebService.post(params);	

		a.done(function(data){

			if(data.StatusResult == 'OK'){
			    this.table.bootstrapTable('destroy');
			    this.containerInfo.html(''); 
			    
			    var deudorLast = data.deudor;
			    console.log(deudorLast.Sucursal.name);

			    if (deudorLast.status == '0') {
			    	this.panelInfo.addClass('panel-danger');

			    	Titan.popup.error('Este deudor ha sido deshabilitado en el sistema', 5000);
			    } else{
			    	this.panelInfo.removeClass('panel-danger');
			    }
			    
				for(i in deudorLast){
					if(deudorLast[i]){
						if(i != 'Código' &&i != 'id' &&i != 'status' )
							this.containerInfo.append('<tr><td>' + i + ':</td><td>' + ((typeof deudorLast[i] == 'object')? deudorLast[i].name : deudorLast[i]) + '</td></tr>');										
				    }					
			    }
				delete deudorLast;
			   
			   // this.table.bootstrapTable();
			    this.panelInfo.show();
			}
		}.bind(this));
		
		Titan.global['deudor'] = this.deudor;
		Titan.global['id_subsidiary'] = this.sucursales[index].id;
		Titan.global['id_deudor'] = this.deudores[index].id;
		
		
	    Titan.modules['Reportes_de_llamadas'].buscar(this.deudor.id);
	    Titan.modules['Reportes_de_llamadas'].habilitar();
		Titan.modules['Reportes_de_llamadas'].cancel();
		
	    Titan.modules['Codeudores'].buscar(this.deudor.id);
	    Titan.modules['Pagos'].buscar(this.deudor.dni);
	    Titan.modules['Informe_de_pagos'].buscar(this.deudor.id);
	    Titan.modules['Referencias'].buscar_personales(this.deudor.id);
	    Titan.modules['Referencias'].buscar_comerciales(this.deudor.id);
	    Titan.modules['Pagos'].habilitar();
		
	},	
	
	limpiar: function (){
		this.panelInfo.hide();
		 this.table.bootstrapTable('load', {});
		Titan.modules['Pagos'].limpiar();
		Titan.modules['Reportes_de_llamadas'].cancel();
	    //Titan.modules['Codeudores'].buscar(this.deudor.id);
	    
	    //Titan.modules['Informe_de_pagos'].buscar(this.deudor.id);
	    //Titan.modules['Referencias'].buscar_comerciales(this.deudor.id);
	},

});/*

 * @module  Login

 *

 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)

 *

 * @license Derechos Reservados de Autor (C) IP Total Software S.A

 */

Titan.modules.create({



	name: 'Informe_de_llamadas',



	/*

	 * @constructor

	 * @description inicia los componentes del módulo

	 */

	ready: function () {

		//init components

		this.container = $('#informe-de-llamadas-container');

		this.tablaInforme = this.container.find('#tabla_informe');

		//this.tablaInforme.bootstrapTable();



		this.thead = this.tablaInforme.find('thead > tr').first();

		this.tbody = this.tablaInforme.find('tbody').first();

		this.descripcion = this.container.find('#descripcion');



		this.btnSave = this.container.find('#save');	

		console.log('cargando data informes');	 	

		this.informe();



	},



	/*

	 * @name initEvents

	 * @description inicia los eventos de los componentes del módulo

	 * @return {void}

	 */

	initEvents: function () {

		Titan.click('btnSave', 'save', this);

	},





	update_table: function () {		

		console.log(' update_table update_table update_table update_table update_table');

		var id_del_deudor = Titan.modules['Informacion_del_deudor'].deudor.id;	

		this.buscar(id_del_deudor);



	},



	save: function () {



		var descripcion = this.descripcion.val();



		if ($.trim(descripcion) !='') {		

			var id = Titan.modules['Informacion_del_deudor'].deudor.id;

			

			var params = {

				'route': 'deudor/save_reports', 

				'id_deudor': id,

				'__u__': __u__,

				'description': descripcion

			}



			var a = WebService.post(params);



			a.done(function  (response) {



				if(response.StatusResult=='OK'){

					this.descripcion.val('');

					this.update_table();

					//Titan.popup.success('El reporte se guardó exitosamente');

				}else{

					Titan.popup.danger('Error al guardar el reporte');

				}

					

			}.bind(this));

		} else{

			Titan.popup.warning('Escriba primero el reporte');

		};

				

	},

	



	/**

	* carga la estructura de la tabla 

	*/

	informe:function(){



		var params = {

			route: 'crud/load', 
			nodata: true, 
			'data_table': 'report'

		}



		var a = WebService.post(params);



	 	a.done(	function  (response) {

	 		console.log(response);	 	 		

	 		this.loadStruct(response.struct);

	 		this.tablaInforme.bootstrapTable('destroy');

    		this.tablaInforme.bootstrapTable();

	 	}.bind(this));



    },



    loadData: function (arreglo) {    	

    	this.tablaInforme.bootstrapTable('load', arreglo);

    },



    loadStruct:function(estructura){

    	for(var i in estructura){

    		if (i != 'id' &&i != 'debtor' ) 

    			this.thead.append('<th data-field="' + i + '">' + estructura[i].name+ '</th>');

    	}

    },



    buscar: function (id) {

		this.tbody.html('');

		var a = WebService.post({route: 'deudor/query_reports', 'id_deudor': id});	



		a.done(function(response){	

			if(response.StatusResult == 'OK'){

				this.descripcion.val('');

				this.loadData(response.reports);	



			}else{

				this.tbody.html('');

				this.tablaInforme.bootstrapTable('destroy');

    			this.tablaInforme.bootstrapTable();

			}

				

		}.bind(this));   		

    		

	},  



	deshabilitar:function(sentinela){

		 this.descripcion.attr('disabled', 'disabled');

		 this.btnSave.attr('disabled', 'disabled');

		 this.tbody.html(' ');



	},



	habilitar:function(sentinela){

		 this.descripcion.removeAttr('disabled', 'disabled');

		 this.btnSave.removeAttr('disabled', 'disabled');

	}

});



Titan.modules.create({



	name: 'Informe_de_pagos',

	

	/*

	 * @constructor

	 * @description inicia los componentes del módulo

	 */

	ready: function () {

		//init components

		this.container = $('#informe-pagos-container');

		this.tabla_informe_pagos = this.container.find('#tabla_pagos');

		

		this.thead = this.tabla_informe_pagos.find('thead > tr').first();

		this.tbody = this.tabla_informe_pagos.find('tbody').first();		

		

		console.log('cargando data pagos');	 	

		this.informe();



	},



	/*

	 * @name initEvents

	 * @description inicia los eventos de los componentes del módulo

	 * @return {void}

	 */

	initEvents: function () {

	},





	update_table: function () {		

	},	



	/**

	* carga la estructura de la tabla 

	*/

	informe:function(){



		console.log('informe metod');	 	

		var params = {

			route: 'crud/load', 
			nodata: true, 
			'data_table': 'payment'

		}



		var a = WebService.post(params);



	 	a.done(	function  (response) {

	 		console.log(response);	 	 		

	 		this.loadStruct(response.struct);

	 		this.tabla_informe_pagos.bootstrapTable('destroy');

    		this.tabla_informe_pagos.bootstrapTable();

	 	}.bind(this));



    },



    loadData: function (arreglo) {    	

    	this.tabla_informe_pagos.bootstrapTable('load', arreglo);

    },



    loadStruct:function(estructura){

    	for(var i in estructura){

    		if (i != 'id' &&i != 'debtor') 

    			this.thead.append('<th data-field="' + i + '">' + estructura[i].name+ '</th>');

    	}

    },



    buscar: function (id) {



		this.tbody.html('');

		this.id_ = id;



		var a = WebService.post({route: 'pagos/query_payment', 'id_deudor': id});	



		a.done(function(response){	

			if(response.StatusResult == 'OK'){

				this.loadData(response.payment);

				

			}else{

				this.tbody.html('');

				this.tabla_informe_pagos.bootstrapTable('destroy');

    			this.tabla_informe_pagos.bootstrapTable();

			}

				

		}.bind(this));   		

    		

	},  



	

});



/*
 * @module  Pagos
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */
Titan.modules.create({
	name: 'Pagos',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		this.container = $('#informe-de-pagos-container');
		this.tablapagos= this.container.find('#tabla_pagos');
		this.thead = this.tablapagos.find('thead > tr').first();
		this.tbody = this.tablapagos.find('tbody').first();
		this.abono_deuda = this.container.find('#abono_deuda');
		this.abono_deuda.mask('0#');
		this.labelInfo = this.container.find('#monto');
		this.btnSave = this.container.find('#save');
		this.saldo_deuda= this.container.find('#saldo_deuda');
		this.infoDebts = this.container.find('#data-debts');
		this.infoDebtstbody = this.infoDebts.find('tbody').first();
		this.campoFechaLiquidacion = this.container.find('#date-liquidation');
		this.campoFechaLiquidacion.datepicker({
	      changeMonth: true,
	      changeYear: true
	    });

		this.btnCalcularLiquidacion = this.container.find('#btn-liquidation');
		this.infoDebtsManual = this.container.find('#data-debts-manual');
		this.infoDebtstbodyManual = this.infoDebtsManual.find('tbody').first();

		//liquidacion manual
		this.campoSucursales = this.container.find('#sucursales-deuda');
		this.campoFechaPagoManual = this.container.find('#fecha-deuda');
		this.campoFechaPagoManual.datepicker({
	      changeMonth: true,
	      changeYear: true
	    });
		this.campoSaldoManual = this.container.find('#saldo-deuda');
		this.campoSaldoManual.mask('0#');
		this.campoFechaLiquidacionManual = this.container.find('#fecha-liquidacion');
		this.campoFechaLiquidacionManual.datepicker({
	      changeMonth: true,
	      changeYear: true
	    });
		this.campoFechaLiquidacionManual.val(this.ultimoDiaDelMes());
		this.btnCalcularLiquidacionManual = this.container.find('#btn-fecha-liquidacion');
		Titan.view( 'liquidacion', 'abono','abonos_deuda');

		this.count = $("#badge_liquidacion");
		this.count.hide();	

		this.sucursales();
		this.informe();
	},



	initEvents: function () {

		Titan.click('btnSave', 'confirmationSave', this);

		Titan.click('btnCalcularLiquidacion', 'calcularLiquidacion', this);

		Titan.click('btnCalcularLiquidacionManual', 'calcularLiquidacionManual', this);

		//Titan.keypress('abono_deuda', 'loadAmount', this);

			

	},



	sucursales: function () {

		var a = WebService.post({route: 'query/sucursales'});



	 	a.done(	function  (response) {

	 		this.campoSucursales.html('');



	 		var sucursales  = response.sucursales;

	 		for (var i = sucursales.length - 1; i >= 0; i--) {

	 			var s = sucursales[i];

	 			this.campoSucursales.append('<option  >' + s.name + '</option>')

	 		}



	 	}.bind(this));

	},





	calcularLiquidacionManual: function () {



		if (this.campoSaldoManual.val() == '' || this.campoSaldoManual.val() <= '0') {

			Titan.popup.warning('Ingrese el saldo');

			return;

		}



		if (this.campoFechaPagoManual.val() == '') {

			Titan.popup.warning('elija la fecha del último pago');

			return;

		}



		



		var params = {

			route: 'deudor/calculateLiquidationManual', 

			'sucursal': this.campoSucursales.val(),

			'fechaPago': this.campoFechaPagoManual.val(),

			'saldo': this.campoSaldoManual.val(),

			'fechaLiquidacion': this.campoFechaLiquidacionManual.val(),

		}



		var a = WebService.post(params);



	 	a.done(	function  (response) {

	 		console.log(response);	

	 		this.infoDebtstbodyManual.html('');

	 		var data = response.liquidation;



	 		var datosResaltados = ['total Servicios', 'total Interes por cobrar', 'Procredito', 'gastos de cobranza'];



	 		for(k in data){

	 			if(k!='contains'){

	 				//this.infoDebtstbody.append('<tr><td>deuda #' + k + '</td><td></td></tr>')

 	 				

					for(i in data[k]){

						if(i != 'total por cobrar'){

							var b = (datosResaltados.contains(i))? true:false;



							this.infoDebtstbodyManual.append('<tr><td>'+ 

								((b)? '<strong>' : '') + i + ((b)? '</strong>' : '') 

								+'</td><td>'+ ((b)? '<strong>' : '')  + 

								((data[k][i] > 999)? '$'+ numberFormatter(data[k][i]):data[k][i]) + 

								((b)? '</strong>' : '')  + '</td></tr>')

						

						}else if(i)

							this.infoDebtstbodyManual.append('<tr><td>'  + i +'</td><th><h3><strong>' + ((data[k][i] > 999)? '$'+ numberFormatter(data[k][i]):data[k][i]) + '</strong></h3></th></tr>')

	 	 				

	 	 			}

 	 			}

 	 		}

	 		

	 	}.bind(this));

	},



	calcularLiquidacion: function () {



		if (Titan.modules.Pagos.tablapagos.bootstrapTable('getSelections').length >=1) {

			var params = {

				route: 'deudor/calculateLiquidation', 

				'debts': this.tablapagos.bootstrapTable('getSelections'),

				'fecha': this.campoFechaLiquidacion.val(),

			}



			var a = WebService.post(params);



		 	a.done(	function  (response) {

		 		console.log(response);	

		 		this.infoDebtstbody.html('');

		 		var data = response.liquidation;



		 		var datosResaltados = ['total Servicios', 'total Interes por cobrar', 'Procredito', 'gastos de cobranza'];



		 		for(k in data){

		 			if(k!='contains'){

		 				//this.infoDebtstbody.append('<tr><td>deuda #' + k + '</td><td></td></tr>')

	 	 				

						for(i in data[k]){

							if(i != 'total por cobrar'){

								var b = (datosResaltados.contains(i))? true:false;



								this.infoDebtstbody.append('<tr><td>'+ 

									((b)? '<strong>' : '') + i + ((b)? '</strong>' : '') 

									+'</td><td>'+ ((b)? '<strong>' : '')  + 

									((data[k][i] > 999)? '$'+ numberFormatter(data[k][i]):data[k][i]) + 

									((b)? '</strong>' : '')  + '</td></tr>')

							

							}else if(i)

								this.infoDebtstbody.append('<tr><td>'  + i +'</td><th><h3><strong>' + ((data[k][i] > 999)? '$'+ numberFormatter(data[k][i]):data[k][i]) + '</strong></h3></th></tr>')

		 	 				

		 	 			}

	 	 			}

	 	 		}

		 		

		 	}.bind(this));

		}else {

		 	Titan.popup.warning('seleccione una deuda primero');

		}

	},



	confirmationSave: function () {

		Titan.message.confirmation('Guardar Pago','Desea confirmar el pago',this.save, this);

	},



	update_table: function () {	

		var id_del_deudor = Titan.modules['Informacion_del_deudor'].deudor.id;	

		this.buscar(id_del_deudor);

	},


	ultimoDiaDelMes: function () {
		var today = new Date(); 
		var fecha = new Date(today.getFullYear(), today.getMonth()+1, 0);
		console.log(fecha);	 
		var dia = fecha.getDate();
		var mes = fecha.getMonth() + 1;
		var anno = fecha.getFullYear();
		fecha =  anno +'-' + (mes< 10 ?'0'+mes:mes)+ '-' +  (dia< 10 ?'0'+dia:dia);
		console.log(fecha);	 
		return fecha;
	},



	informe:function(){

		this.campoFechaLiquidacion.val(this.ultimoDiaDelMes()); 	

		console.log('informe metod');	 	

		var params = {

			route: 'crud/load', 
			nodata: true, 
			'data_table': 'debt'

		}



		var a = WebService.post(params);



	 	a.done(	function  (response) {

	 		console.log(response);	 	 		

	 		this.loadStruct(response.struct);

	 		this.tablapagos.bootstrapTable('destroy');

    		this.tablapagos.bootstrapTable();

	 	}.bind(this));



    },



	loadData: function (arreglo) {    	
		this.count.show(); 	
    	arreglo.length > 0? this.count.html(arreglo.length):this.count.hide();
    	this.tablapagos.bootstrapTable('load', arreglo);

    },



    loadStruct:function(estructura){



    	var fieldshiddens = ['id', 'debtor', 'status', 'dni'];



    	for(var i in estructura){

    		if (!fieldshiddens.contains(i)) 

    			this.thead.append('<th data-field="' + i + '" data-formatter="' + i + 'Formatter">' + estructura[i].name+ '</th>');

    			

    	}

    },



    buscar: function (dni) {



		this.tbody.html('');

		this.labelInfo.html('');

		this.abono_deuda.val('');

		console.log(dni);



		var a = WebService.post({route: 'deudor/query_debt', 'dni': dni});	



		a.done(function(response){	

			if(response.StatusResult == 'OK'){



				Titan.global['guardaSaldo'] = response.debts[0].amount;

				

				this.loadData(response.debts);		



				this.labelInfo.html( amountFormatter(response.total_));

				Titan.global['debt'] = response.debts[0];



				this.infoDebtstbody.html('');



				var data = response.data;

				for(i in data)

					if(i)

						this.infoDebtstbody.append('<tr><td>'  + i.replace(/_/mgi, ' ') +'</td><td> ' + ((data[i] > 999)? numberFormatter(data[i]):data[i]) + '</td></tr>')



				//this.infoDebts.bootstrapTable('destroy');

				//this.infoDebts.bootstrapTable();



			}else{

				this.tbody.html('');

				this.tablapagos.bootstrapTable('destroy');

    			this.tablapagos.bootstrapTable();

			}

				

		}.bind(this));   		

    		

	}, 



	save: function () {

		

		this.abono = parseInt( $.trim(this.abono_deuda.val()).valueOf());

		this.monto = parseInt( Titan.global['guardaSaldo'].valueOf());

		

		if (this.abono !='') {



			if(this.abono <= this.monto){							

				this.abono_deuda_ =  this.monto - this.abono;



				var params = {

					'route': 'deuda/save_debt', 

					'abono_deuda': this.abono_deuda_,

					'debt': Titan.global['debt'] 

				};

				var a = WebService.post(params);



				a.done(function  (response) {



					if(response.StatusResult){

						this.save_payment_debtor();

						this.update_table();

						Titan.global['guardaSaldo'] = this.abono_deuda_;

						Titan.popup.success('El abono se guardó exitosamente');

					}else{

						Titan.popup.danger('Error al guardar el abono');

					}



				}.bind(this));	

			}else{

				Titan.popup.danger('Error al guardar el abono');

			}						

		} else{

			Titan.popup.warning('Escriba primero el abono');

		};			

				

	},



	loadAmount:function(){



		this.abono_ = parseInt( $.trim(this.abono_deuda.val()).valueOf());

		this.monto_ = parseInt( Titan.global['guardaSaldo'].valueOf());		

		this.abono_deuda_ =  this.monto - this.abono;



		

    },



	formatAmount:function(amount){

		amount = "" + amount;

		var centavos;

		

		if (amount.contains('.')){

			var amountTotal = amount.split('.');

			var centavos = amountTotal.pop();

			amount = amountTotal.pop();

		}



		



		var tem = amount.split('');

		var z = tem.pop();

		var y = tem.pop();

		var x = tem.pop();



		var w = tem.pop();

		var v = tem.pop();

		var u = tem.pop();



		var t = tem.pop();

		var r = tem.pop();

		var s = tem.pop();



		//debugger;



		var str = '$';



		 str += ((s)?s:''); 

		 str += ((r)?r:''); 

		 str += ((t)?t:''); 

		 str += ((u)?u:''); 

		 str += ((v)?v:''); 

		 str += ((w)?w:''); 

		 str += ((w)?'.':''); 

		 str += ((x)?x:''); 

		 str += ((y)?y:''); 

		 str += ((z)?z:'');



		 return str;

    },



    save_payment_debtor: function () {





		this.abono = parseInt( $.trim(this.abono_deuda.val()).valueOf());

		this.monto = parseInt( Titan.global['guardaSaldo'].valueOf());

		this.abono_deuda_ =  this.monto - this.abono;

		this.id_del_deudor = Titan.modules['Informacion_del_deudor'].deudor.id;	



		var params = {

			'route': 'pagos/save_payment', 

			'id_deudor': this.id_del_deudor,

			'abono_': this.abono,

			'monto_': this.monto,

			'payme_debt': this.abono_deuda_

		};

		var a = WebService.post(params);



		console.log(this.id_del_deudor + "***" + this.abono + "***" + this.monto + "***" + this.abono_deuda_ );



		a.done(function  (response) {

			if(response.StatusResult = 'OK'){

				Titan.modules['Informe_de_pagos'].buscar(this.id_del_deudor);

			}else{

				

			}



		}.bind(this));						

				

	},



    deshabilitar:function(){

		this.abono_deuda.attr('readonly', 'readonly');

		this.btnSave.attr('disabled', 'disabled');

		this.abono_deuda.html('');

	},



	habilitar:function(){

		 this.abono_deuda.removeAttr('readonly', 'readonly');

		 this.btnSave.removeAttr('disabled');

	},

	

	limpiar:function(){

		this.tablapagos.bootstrapTable('load', {});

	},

	updateLiquidation : function() {

	},



});

Titan.modules.create({



	name: 'Referencias',

	

	/*

	 * @constructor

	 * @description inicia los componentes del módulo

	 */

	ready: function () {

		

		this.container = $('#referencias-container');

		

		this.tabl_ref_per= this.container.find('#tabla-referencias-personales');

		this.thead = this.tabl_ref_per.find('thead > tr').first();

		this.tbody = this.tabl_ref_per.find('tbody').first();



		this.tabl_ref_com= this.container.find('#tabla-referencias-comerciales');

		this.whead = this.tabl_ref_com.find('thead > tr').first();

		this.wbody = this.tabl_ref_com.find('tbody').first();	



		this.informe_persona();

		this.informe_business();



	},



	informe_persona:function(){



		console.log('informe_persona metod');	 	

		var params = {

			route: 'crud/load', 
			nodata: true, 

			'data_table': 'debtor_personal_reference'

		}



		var a = WebService.post(params);



	 	a.done(	function  (response) {

	 		console.log(response);	 	 		

	 		this.loadStruct_personal(response.struct);

	 		this.tabl_ref_per.bootstrapTable('destroy');

    		this.tabl_ref_per.bootstrapTable();

	 	}.bind(this));



    },



    informe_business:function(){



		console.log('informe_business metod');	 	

		var params = {

			route: 'crud/load', 
			nodata: true, 
			'data_table': 'debtor_business_reference'

		};



		var a = WebService.post(params);



	 	a.done(	function  (response) {

	 		console.log(response);	 	 		

	 		this.loadStruct_business(response.struct);

	 		this.tabl_ref_com.bootstrapTable('destroy');

    		this.tabl_ref_com.bootstrapTable();

	 	}.bind(this));



    },



    loadData_personal: function (arreglo) {    	

    	this.tabl_ref_per.bootstrapTable('load', arreglo);

    },



     loadData_business: function (arreglo) {    	

    	this.tabl_ref_com.bootstrapTable('load', arreglo);

    },



    loadStruct_personal:function(estructura){

    	for(var i in estructura){

    		if (i != 'id' &&i != 'debtor') 

    			this.thead.append('<th data-field="' + i + '">' + estructura[i].name+ '</th>');

    	}

    },



     loadStruct_business:function(estructura){

    	for(var i in estructura){

    		if (i != 'id' &&i != 'debtor') 

    			this.whead.append('<th data-field="' + i + '">' + estructura[i].name+ '</th>');

    	}

    },



    buscar_personales: function (id) {



		var a = WebService.post({route: 'referencias/query_payment_personales', 'id_deudor': id});	



		a.done(function(response){	

			if(response.StatusResult == 'OK'){

				this.loadData_personal(response.personal);

				

			}else{

				this.tbody.html('');

				this.tabl_ref_per.bootstrapTable('destroy');

    			this.tabl_ref_per.bootstrapTable();

			}				

		}.bind(this));   		

    		

	},  





	buscar_comerciales: function (id) {



		var a = WebService.post({route: 'referencias/query_payment_business', 'id_deudor': id});	



		a.done(function(response){	

			if(response.StatusResult == 'OK'){

				this.loadData_business(response.business);

				

			}else{

				this.wbody.html('');

				this.tabl_ref_com.bootstrapTable('destroy');

    			this.tabl_ref_com.bootstrapTable();

			}				

		}.bind(this));   		

    		

	}, 



	

});



/*
 * @module  Codeudores
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */
Titan.modules.create({
	name: 'Codeudores',
	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components
		this.container = $('#codeudor-container');
		this.tablaInforme = this.container.find('#tabla_codeudores');
		//this.tablaInforme.bootstrapTable();
		this.thead = this.tablaInforme.find('thead > tr').first();
		this.tbody = this.tablaInforme.find('tbody').first();
		this.descripcion = this.container.find('#descripcion');
		this.btnSave = this.container.find('#save');
		this.count = $("#badge_codeudores");
		this.count.hide();	
		this.informe();
	},

	/*
	 * @name initEvents
	 * @description inicia los eventos de los componentes del módulo
	 * @return {void}
	 */
	initEvents: function () {
		Titan.click('btnSave', 'save', this);
	},

	update_table: function () {		
		this.buscar(Titan.global['deudor_id']);
	},

	save: function () {
		var descripcion = this.descripcion.val();
		if ($.trim(descripcion) !='') {
			var params = {
				'route': 'deudor/save_reports', 
				'id_deudor': Titan.global['deudor_id'],
				'__u__': __u__,
				'description': descripcion
			};

			var a = WebService.post(params);
			a.done(function  (response) {
				if(response.StatusResult){
					this.descripcion.val('');
					this.update_table();
					Titan.popup.success('El reporte se guardó exitosamente');
				}else{
					Titan.popup.danger('Error al guardar el reporte');
				}
			}.bind(this));
		} else
			Titan.popup.warning('Escriba primero el reporte');
	},


	/**
	* carga la estructura de la tabla 
	*/
	informe:function(){

		var params = {
			route: 'crud/load', 
			nodata: true, 
			'data_table': 'cosigner'
		}
		var a = WebService.post(params);
	 	a.done(	function  (response) {

	 		this.loadStruct(response.struct);
	 		this.tablaInforme.bootstrapTable('destroy');
    		this.tablaInforme.bootstrapTable();
	 	}.bind(this));
    },


    loadData: function (arreglo) { 
    	this.count.show(); 	
    	arreglo.length > 0? this.count.html(arreglo.length):this.count.hide();
    	   	
    	this.tablaInforme.bootstrapTable('load', arreglo);
    },

    loadStruct:function(estructura){
    	for(var i in estructura){
    		if (i != 'id' &&i != 'debtor') 
    			this.thead.append('<th data-field="' + i + '">' + estructura[i].name+ '</th>');
    	}
    },

    buscar: function (id) {
		this.tbody.html('');
		var a = WebService.post({route: 'deudor/query_cosigners', 'id_deudor': id});	
		a.done(function(response){	
			if(response.StatusResult == 'OK'){
				this.descripcion.val('');
				this.loadData(response.cosigners);	
			}else{
				this.count.hide()
				this.tbody.html('');
				this.tablaInforme.bootstrapTable('destroy');
    			this.tablaInforme.bootstrapTable();
			}
		}.bind(this));   		
	},  

	deshabilitar:function(sentinela){
		 this.descripcion.attr('disabled', 'disabled');
		 this.btnSave.attr('disabled', 'disabled');
		 this.tbody.html(' ');
	},

	habilitar:function(sentinela){
		 this.descripcion.removeAttr('disabled', 'disabled');
		 this.btnSave.removeAttr('disabled', 'disabled');
	},

	limpiar: function (){
		this.tablaInforme.bootstrapTable('load', {});
	},

});



/*

 * @module  Pagos

 *

 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)

 *

 * @license Derechos Reservados de Autor (C) IP Total Software S.A

 */



Titan.modules.create({



	name : 'Compromisos',



	/*

	 * @constructor @description inicia los componentes del módulo

	 */

	ready : function() {



		this.container = $('#compromisos-de-pagos-container');



		this.tablapagos = this.container.find('#tabla_pagos');

		this.thead = this.tablapagos.find('thead > tr').first();

		this.tbody = this.tablapagos.find('tbody').first();

		this.abono_deuda = this.container.find('#abono_deuda');

		this.abono_deuda.mask('0#');

		this.labelInfo = this.container.find('#monto');

		this.btnSave = this.container.find('#save');

		this.saldo_deuda = this.container.find('#saldo_deuda');



		this.informe();



	},



	initEvents : function() {

		Titan.click('btnSave', 'confirmationSave', this);

		// Titan.keypress('abono_deuda', 'loadAmount', this);



	},



	confirmationSave : function() {

		Titan.message.confirmation('Guardar Pago', 'Desea confirmar el pago',

				this.save, this);

	},



	update_table : function() {

		var id_del_deudor = Titan.modules['Informacion_del_deudor'].deudor.id;

		this.buscar(id_del_deudor);

	},



	informe : function() {



		console.log('informe metod');

		var params = {

			route : 'crud/load',
			nodata: true, 
			'data_table' : 'debt'

		}



		var a = WebService.post(params);



		a.done(function(response) {

			console.log(response);

			this.loadStruct(response.struct);

			this.tablapagos.bootstrapTable('destroy');

			this.tablapagos.bootstrapTable();

		}.bind(this));



	},



	loadData : function(arreglo) {

		this.tablapagos.bootstrapTable('load', arreglo);

	},



	loadStruct : function(estructura) {

		for ( var i in estructura) {

			if (i != 'id' && i != 'debtor')

				this.thead.append('<th data-field="' + i + '" data-formatter="'

						+ i + 'Formatter">' + estructura[i].name + '</th>');



		}

	},



	buscar : function(id) {



		this.tbody.html(' ');

		this.labelInfo.html(' ');

		this.abono_deuda.val('');



		var a = WebService.post({

			route : 'deudor/query_debt',

			'id_deudor' : id

		});



		a.done(function(response) {

			if (response.StatusResult == 'OK') {



				Titan.global['guardaSaldo'] = response.debts[0].amount;



				this.loadData(response.debts);



				this.labelInfo.html(amountFormatter(response.total_));

				Titan.global['debt'] = response.debts[0];



			} else {

				this.tbody.html('');

				this.tablapagos.bootstrapTable('destroy');

				this.tablapagos.bootstrapTable();

			}



		}.bind(this));



	},



	save : function() {



		this.abono = parseInt($.trim(this.abono_deuda.val()).valueOf());

		this.monto = parseInt(Titan.global['guardaSaldo'].valueOf());



		if (this.abono != '') {



			if (this.abono <= this.monto) {

				this.abono_deuda_ = this.monto - this.abono;



				var params = {

					'route' : 'deuda/save_debt',

					'abono_deuda' : this.abono_deuda_,

					'debt' : Titan.global['debt']

				};

				var a = WebService.post(params);



				a.done(function(response) {



					if (response.StatusResult) {

						this.save_payment_debtor();

						this.update_table();

						Titan.global['guardaSaldo'] = this.abono_deuda_;

						Titan.popup.success('El abono se guardó exitosamente');

					} else {

						Titan.popup.danger('Error al guardar el abono');

					}



				}.bind(this));

			} else {

				Titan.popup.danger('Error al guardar el abono');

			}

		} else {

			Titan.popup.warning('Escriba primero el abono');

		}

		;



	},



	loadAmount : function() {



		this.abono_ = parseInt($.trim(this.abono_deuda.val()).valueOf());

		this.monto_ = parseInt(Titan.global['guardaSaldo'].valueOf());

		this.abono_deuda_ = this.monto - this.abono;



	},



	save_payment_debtor : function() {



		this.abono = parseInt($.trim(this.abono_deuda.val()).valueOf());

		this.monto = parseInt(Titan.global['guardaSaldo'].valueOf());

		this.abono_deuda_ = this.monto - this.abono;

		this.id_del_deudor = Titan.modules['Informacion_del_deudor'].deudor.id;



		var params = {

			'route' : 'pagos/save_payment',

			'id_deudor' : this.id_del_deudor,

			'abono_' : this.abono,

			'monto_' : this.monto,

			'payme_debt' : this.abono_deuda_

		};

		var a = WebService.post(params);



		console.log(this.id_del_deudor + "***" + this.abono + "***"

				+ this.monto + "***" + this.abono_deuda_);



		a.done(function(response) {

			if (response.StatusResult = 'OK') {

				Titan.modules['Informe_de_pagos'].buscar(this.id_del_deudor);

			} else {



			}



		}.bind(this));



	},



	deshabilitar : function() {

		this.abono_deuda.attr('readonly', 'readonly');

		this.btnSave.attr('disabled', 'disabled');

		this.abono_deuda.html('');

	},



	habilitar : function() {

		this.abono_deuda.removeAttr('readonly', 'readonly');

		this.btnSave.removeAttr('disabled');

	},

	

	limpiar : function() {



	},



});

/*
 * @module  index
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */

Titan.modules.create({
	name: 'index',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components
		Titan.view( 'llamadas', 'informacion_del_deudor','informacion_Deudor_tab');
		Titan.view( 'liquidacion', 'pagos','liquidacion');
		Titan.view( 'llamadas', 'codeudores','codeudores_tab');
		Titan.view( 'llamadas', 'referencias','referencias_tab');
		Titan.view( 'llamadas', 'reportes_de_llamadas','reportes_de_llamadas');
		Titan.modules['Reportes_de_llamadas'].info = false;
		/*
		Titan.view( 'llamadas', 'informe_de_pagos','informe_pagos_tab');
		Titan.view( 'llamadas', 'compromisos','informe_crud');
		*/
	},
});

/*
 * @module  Informacion_del_deudor
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */

Titan.modules.create({

	name : 'Informacion_del_deudor',

	/*
	 * @constructor @description inicia los componentes del módulo
	 */
	ready : function() {

		this.container = $('#deudores-container');
		this.btn_buscar = $('#btn_buscar');
		this.load_subsidiary = $('#load_subsidiary');

		this.field_one_date = $('#date_init_commitment');
		this.btn_find_commitments_one = $('#btn_find_commitments');

		this.field_range_date_init = $('#date_init_commitment_range');
		this.field_range_date_finish = $('#date_finish_commitment_range');
		this.btn_find_commitments_range = $('#btn_find_commitments_range');




	},

	/*
	 * @name initEvents @description inicia los eventos de los componentes del
	 * módulo @return {void}
	 */
	initEvents : function() {
		this.buscar_sucursal();
		Titan.click('btn_buscar', 'buscar', this);
		Titan.click('btn_find_commitments_one', 'findForOneDate', this);
		Titan.click('btn_find_commitments_range', 'findForTwoDate', this);

		this.load_subsidiary.on('change', function() {
			this.buscar();
		}.bind(this))
	},

	buscar_sucursal : function() {

		var a = WebService.post({
			route : 'deudor/search_subsidiary'
		});

		a.done(function(response) {

			if (response.StatusResult == 'OK') {
				sucursales_ = response.sucursal;
				this.id_sucursal = sucursales_.id;

				for (var j = 0; j < sucursales_.length; j++) {
					this.load_subsidiary.append('<option value="'
							+ sucursales_[j].id + '" >' + sucursales_[j].name
							+ '</option>');
				}
				this.buscar();
			}
		}.bind(this));

	},

	nextIndex : function() {
		this.index++;
		this.setSelectedIndex(this.index);
	},

	buscar : function() {
		this.lista = $('#deudores-container');
		this.lista.html('');
		this.guarda_Sucursal = this.load_subsidiary.val();

		var params = {
			route : 'deudor/query_debtor_subsidiary',
			'sucursal_id' : this.guarda_Sucursal
		};

		var a = WebService.post(params);

		a.done(function(response) {

			if (response.StatusResult == 'OK') {
				this.processRenspose(response);
			} else {
				this.tbody.html('');
			}

		}.bind(this));

	},



	findForOneDate : function() {
		this.lista = $('#deudores-container');
		this.lista.html('');

		var params = {
			route : 'deudor/query_debtor_commitment_one',
			'date_init' : this.field_one_date.val(),
		};

		var a = WebService.post(params);

		a.done(function(response) {

			if (response.StatusResult == 'OK') {
				if (response.commitments) {
					this.processRenspose(response);
					Titan.popup.success('Se encontraron deudores');
					$('#for_day').modal('hide');
				}
			} else {
				Titan.popup.warning(
						'No se encontraron deudores para esta fecha', 4000);
			}

		}.bind(this));

	},

	findForTwoDate : function() {
		this.lista = $('#deudores-container');
		this.lista.html('');

		var params = {
			route : 'deudor/query_debtor_commitment_two',
			'date_init' : this.field_range_date_init.val(),
			'date_finish' : this.field_range_date_finish.val(),
		};

		var a = WebService.post(params);

		a.done(function(response) {

			if (response.StatusResult == 'OK') {
				if (response.commitments) {
					this.processRenspose(response);
					Titan.popup.success('Se encontraron deudores');
					$('#for_range').modal('hide');
				}
			} else {
				Titan.popup.warning(
						'No se encontraron deudores para estas fechas', 4000);
			}

		}.bind(this));

	},

	processRenspose : function(response) {
		this.debtors = response.deudores;
		this.deudas = response.otrasDeudas;

		var data = [];

		for (var i = 0; i < this.debtors.length; i++) {
			var debtor = this.debtors[i];
			var debts = this.deudas[i];
			var amount = 0;

			if (debts != null)
				for (var k = debts.length - 1; k >= 0; k--)
					amount += parseInt(debts[k].amount);
			else
				console.log(debtor);

			data.push({

				l1 : (i + 1) + ') Nombre:',
				r1 : '',

				l2 : debtor.name + ' ' + debtor.last_name,
				r2 : '$' + numberFormatter(amount),

				l3 : 'Teléfono: ' + debtor.phone_number_1,
				r3 : 'Código: ' + debtor.id,

				l4 : 'Cédula: ',
				r4 : debtor.dni

			});

		}

		this.lista.listMenu('load', data);
		this.lista.listMenu('onClick', this.onClickLista.bind(this));
	},

	onClickLista : function(e) {

		var debtor = this.lista.listMenu('getSelected');
		var id = debtor.r3.match(/[0-9]+/gmi)[0];
		var dni = debtor.r4;

		this.index = this.lista.listMenu('getIndex');
		this.deudor = this.debtors[this.index];


		Titan.global['id_subsidiary'] = this.load_subsidiary.val();
		Titan.global['id_deudor'] = this.deudor.id;
		Titan.global['deudor'] = this.deudor;
		Titan.global['dni'] = dni;

		

		Titan.modules['Pagos'].buscar(dni);
		Titan.modules['Reportes_de_llamadas'].buscar(this.deudor.id);
		Titan.modules['Reportes_de_llamadas'].habilitar();
		Titan.modules['Reportes_de_llamadas'].cancel();
		Titan.modules['Codeudores'].buscar(this.deudor.id);
		Titan.modules['Referencias'].buscar_personales(this.deudor.id);

	},

	updateLiquidation : function() {

	},

	limpiar : function() {

	},

});Titan.modules.create({



	name: 'Informe_de_pagos',

	

	/*

	 * @constructor

	 * @description inicia los componentes del módulo

	 */

	ready: function () {

		//init components

		this.container = $('#informe-pagos-container');

		this.tabla_informe_pagos = this.container.find('#tabla_pagos');

		

		this.thead = this.tabla_informe_pagos.find('thead > tr').first();

		this.tbody = this.tabla_informe_pagos.find('tbody').first();		

		

		console.log('cargando data pagos');	 	

		this.informe();



	},



	/*

	 * @name initEvents

	 * @description inicia los eventos de los componentes del módulo

	 * @return {void}

	 */

	initEvents: function () {

	},





	update_table: function () {		

	},	



	/**

	* carga la estructura de la tabla 

	*/

	informe:function(){



		console.log('informe metod');	 	

		var params = {

			route: 'crud/load', 
			nodata: true, 
			'data_table': 'payment'

		}



		var a = WebService.post(params);



	 	a.done(	function  (response) {

	 		console.log(response);	 	 		

	 		this.loadStruct(response.struct);

	 		this.tabla_informe_pagos.bootstrapTable('destroy');

    		this.tabla_informe_pagos.bootstrapTable();

	 	}.bind(this));



    },



    loadData: function (arreglo) {    	

    	this.tabla_informe_pagos.bootstrapTable('load', arreglo);

    },



    loadStruct:function(estructura){

    	for(var i in estructura){

    		if (i != 'id' &&i != 'debtor') 

    			this.thead.append('<th data-field="' + i + '">' + estructura[i].name+ '</th>');

    	}

    },



    buscar: function (id) {



		this.tbody.html('');

		this.id_ = id;



		var a = WebService.post({route: 'pagos/query_payment', 'id_deudor': id});	



		a.done(function(response){	

			if(response.StatusResult == 'OK'){

				this.loadData(response.payment);

				

			}else{

				this.tbody.html('');

				this.tabla_informe_pagos.bootstrapTable('destroy');

    			this.tabla_informe_pagos.bootstrapTable();

			}

				

		}.bind(this));   		

    		

	},  



limpiar: function (){

		

	},

	

});



/*
 * @module  Pagos
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */

Titan.modules.create({

	name: 'Pagos',
	
	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {

		this.container = $('#informe-de-pagos-container');	
		this.formu = this.container.find('#image_upload_form');
	},

	initEvents: function () {	
		this.formu.on('submit',(this.save));
	},	 

	save: function (e) {	
		
        e.preventDefault();	

        $.ajax({
           url: "upload.php",
			type: "POST",
			data:  new FormData(this),
			contentType: false,
    	    cache: false,
			processData:false,
			success: function(data)
		    {
			$("#targetLayer").html(data);
		    },
		  	error: function() 
	    	{
	    	} 
        });
	},

limpiar: function (){
		
	},

});
Titan.modules.create({
	name: 'Referencias',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {

		this.container = $('#referencias-container');
		this.tabl_ref_per= this.container.find('#tabla-referencias-personales');
		this.thead = this.tabl_ref_per.find('thead > tr').first();
		this.tbody = this.tabl_ref_per.find('tbody').first();
		this.count = $("#badge_referencias");
		this.count.hide();
		this.informe_persona();
	},

	informe_persona:function(){
		var params = {
			route: 'crud/load', 
			nodata: true, 
			'data_table': 'debtor_personal_reference'
		}
		var a = WebService.post(params);
	 	a.done(	function  (response) {
	 		this.loadStruct_personal(response.struct);
	 		this.tabl_ref_per.bootstrapTable('destroy');
    		this.tabl_ref_per.bootstrapTable();
	 	}.bind(this));
    },

    loadData_personal: function (arreglo) {   
    	this.count.show(); 	
    	this.count.html(arreglo.length);
    	this.tabl_ref_per.bootstrapTable('load', arreglo);
    },

    loadStruct_personal:function(estructura){
    	for(var i in estructura){
    		if (i != 'id' &&i != 'debtor') 
    			this.thead.append('<th data-field="' + i + '">' + estructura[i].name+ '</th>');
    	}
    },

    buscar_personales: function (id) {
		var a = WebService.post({route: 'referencias/query_payment_personales', 'id_deudor': id});	
		a.done(function(response){	
			if(response.StatusResult == 'OK'){
				this.loadData_personal(response.personal);
			}else{
				this.count.hide()
				this.tbody.html('');
				this.tabl_ref_per.bootstrapTable('destroy');
    			this.tabl_ref_per.bootstrapTable();
			}				
		}.bind(this));   		
	},  

});/*
 * @module  Backup
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */
 Titan.modules.create({

 	name: 'Backup',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	 ready: function () {
		//init components
		this.buttonBackup = $('#buttonBackup');
		this.buttonDownloadBackup = $('#downloadBackup');
		this.buttonDownloadBackup.hide();		
		
	},

	/*
	 * @name initEvents
	 * @description inicia los eventos de los componentes del módulo
	 * @return {void}
	 */
	 initEvents: function () {
	 	Titan.click('buttonBackup', 'createBackup', this);
	 },

	 createBackup: function () {
	 
	 	var r = WebService.post({route: 'security/backup' });

	 	r.done(function  (response) {
	 		if (response.StatusResult == 'OK') {
	 			this.buttonDownloadBackup.attr('href', '//'+location.host+'/bluefolder_backend/'+response.path_backup);
	 			this.buttonDownloadBackup.attr('data-file', response.path_backup);
	 			this.buttonDownloadBackup.show('slow', function() {
	 				this.buttonDownloadBackup.effect('shake');
	 			}.bind(this));
	 			Titan.popup.success('Copia de seguridad creada');
	 		} else{
	 			Titan.popup.info('faliure');
	 		}
	 	}.bind(this));

	 },

	
});/*
 * @module  Login
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */
 Titan.modules.create({
 	name: 'Login',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	 ready: function () {
	 	if(Session.response) {
			this.init(Session.response);
			_database_name = Session.database_name;
		}

		//init components
		this.btnLogin = $('#buttonLogin');
		this.userLogin = $('#inputUser');
		this.passLogin = $('#inputPass');
		this.inputCompany = $('#inputCompany');
		this.btnTerminosCondiciones = $('#terms-cond');
	},

	/*
	 * @name initEvents
	 * @description inicia los eventos de los componentes del módulo
	 * @return {void}
	 */
	 initEvents: function () {

	 	Titan.click('btnLogin', 'initSession', this);

	 	Titan.keypress('userLogin', 'initSessionEnter', this);
	 	Titan.keypress('passLogin', 'initSessionEnter', this);
	 	Titan.keypress('inputCompany', 'initSessionEnter', this);

	 	Titan.click('btnTerminosCondiciones', 'openTerms', this);

	 },

	 initSessionEnter: function (e) {
		  var tecla = (document.all) ? e.keyCode : e.which;
		  if (tecla==13){
			  this.initSession();
		  }
	},	

	 openTerms: function () {
	 	Titan.message.confirmation('Términos y Condiciones', '<iframe src="docs/terminos-y-condiciones.pdf" type="application/pdf" width="100%" height="100%"></iframe>');
	 	$('.modal-body').css('height', '450px');
	 	$('.modal-dialog').addClass('modal-lg')
	 },

	 openTermsLogin: function (response) {
	 	Titan.message.confirmation('Términos y Condiciones', '<iframe src="docs/terminos-y-condiciones.pdf" type="application/pdf" width="100%" height="100%"></iframe>', this.acceptTermsAndConditions, this ,'Acepto', 'No estoy de acuerdo');
	 	$('.modal-body').css('height', '450px');
	 	$('.modal-dialog').addClass('modal-lg')
	 },

	/*
	 * @name initSession
	 * @description envia los datos al webservice login para la autenticacion ante el sistema
	 * @return {void}
	 */
	 initSession: function () {

	 	if($.trim(this.inputCompany.val()) ==''){
			Titan.popup.warning('Ingrese el nombre de la empresa');
			return;
		}

	 	_database_name = null;
	 	var r = WebService.post({route: 'superadmin/company_query', 'company_name': this.inputCompany.val() });

	 	r.done(function  (response) {
	 		if (response.StatusResult == 'OK') {
	 			this.loginModule(response);
	 		} else{
	 			Titan.popup.info('no se encontraron datos de la empresa ' + this.inputCompany.val());
	 		}
	 	}.bind(this));
	 },


	 loginModule: function (response) {

		if($.trim(this.userLogin.val()) ==''){
			Titan.popup.warning('Ingrese su nombre de usuario');
			return;
		}

		if($.trim(this.passLogin.val()) ==''){
			Titan.popup.warning('Ingrese su contraseña');
			return;
		}

		if($.trim(this.passLogin.val()) !='' && $.trim(this.userLogin.val()) !=''){
			_database_name = response.database_name;
			Session.database_name = response.database_name;

			var a = WebService.post({route: 'security/login', 'login[pass]': this.passLogin.val(), 'login[user]': this.userLogin.val() });
			a.done(function  (response) {
				Session.response = response;
				this.init(response);
			}.bind(this));
		}
	 },

	onrefresh: function () {		
		Titan.message.confirmation('¿Desea cerrar la sesión?', 'Si sale de la página la sesión se cerrará automáticamente', this.close, this ,'Cerrar sesión', 'Permanecer en el sistema');
		return false;
	},

	close: function () {
		Titan.modules['Admin'].closeSession();

	},

	init: function (response) {

	 	if(response.StatusResult == 'OK'){
			if (response.count_session <= 0) 
				this.openTermsLogin(response);
			else
				Titan.view(response.module, response.view);

				this.response= response;
				__u__ = response.__u__;
				__u__r=response.__u__r;
				__u__r_= response.__u__r_;
		}else{
			Titan.popup.error(response.ErrorMessage);
		}
	 },


	 /*
	 * @name initSession
	 * @description envia los datos al webservice login para la autenticacion ante el sistema
	 * @return {void}
	 */
	 acceptTermsAndConditions: function () {

	 	var r = WebService.post({route: 'security/terms', 'accept':this.response. __u__});
	 	r.done(function  (response) {
	 		if (response.StatusResult == 'OK') {
	 			Titan.view(this.response.module, this.response.view);
	 			Titan.popup.success('Gracias por aceptar los terminos y condiciones de la plataforma BlueFolder ' );
	 		} else{
	 			Titan.popup.warning('Debes aceptar los terminos y condiciones' + this.inputCompany.val() );
	 		}
	 	}.bind(this));
	 },

});


/*

var tryingToReload = false;
//on before unload
window.onbeforeunload = function(e){ 
	//Firefox and Safari gets argument directly.
    if (!e) {
    	//this is for IE
        e = window.event; 
    }
     // clicked on the close button for IE 
    if (e.clientY != undefined && e.clientY < 0){
        tryingToReload = false;
    }
	// select close from context menu from the right click on title bar on IE
    if (e.clientY != undefined && (e.clientY > 100 && e.clientY < 140))  {
        tryingToReload = false;
    }

    //user hasn't clicked on X close button or hasn't selected close from context menu 
    if (tryingToReload){ 
        tryingToReload = false;
    }

    Titan.modules['Admin'].closeSession();
    return;
}

//attach to key down event to detect the F5 key 
document.onkeydown = function(e){ 
    tryingToReload = false;
 	//Firefox and Safari gets argument directly.
    if (!e) 
    {
        e = window.event;
    }
 
    var key = e.keyCode ? e.keyCode : e.which;
 	//try
    try 
    {
    	//F5 Key detected
        if (key == 116) 
        {
            tryingToReload = true;
        }
    } catch (ex) {}
}
 

document.oncontextmenu = function(e){} //check for the right click
*//*
 * @module  Admin
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */

Titan.modules.create({
	name : 'Admin',
	/*
	 * @constructor @description inicia los componentes del módulo
	 */
	ready : function() {

		// init components
		this.btnMenu = $('#nav-toogle-menu');
		this.btnSalir = $('#salir-session');
		this.slideMenu = $('.menu-slide');
		this.slideMenu.hide();
		this.NavigationMenu = $('#Navigation-menu');
		var menus = __u__r_;

		for (i in menus) {
			if (i < menus.length) {
				this.NavigationMenu.append('<li class="menu-item"  data-id-m="'

						+ menus[i].id + '" data-module="'
						+ menus[i].frontend_module + '" data-view="'
						+ menus[i].frontend_view + '" data-table="'
						+ menus[i].backend_table + '" >'
						+ '<a  data-id-m="' + menus[i].id
						+ '" data-module="' + menus[i].frontend_module
						+ '" data-view="' + menus[i].frontend_view
						+ '" data-table="' + menus[i].backend_table
						+ '" id ="blue-folder-menu-' + menus[i].id + '" >'
						+ '<span class="glyphicon glyphicon-' + menus[i].icon+ '"></span> '
						+ menus[i].name + '</a></li>');
			}
		}

		this.menusItems = $('.menu-item');
		
		var link = this.NavigationMenu.find('a').first();
		_crud = link.attr('data-table');
		_id_m = link.attr('data-id-m');
		Titan.view(link.attr('data-module'), link.attr('data-view'), 'content-admin');

		Titan.loader = {};
		Titan.loader.show = function () {
			$('#loader-content').fadeIn('fast');
		};
		Titan.loader.hide = function () {
			$('#loader-content').fadeOut('fast');
		};

		if (link.attr('data-view') == 'crud')
			Titan.loader.show();
	},

	/*
	 * @name initEvents @description inicia los eventos de los componentes del
	 * módulo @return {void}
	 */
	initEvents : function() {
		Titan.click('btnMenu', 'loadMenu', this);
		Titan.click('btnSalir', 'closeSession', this);
		Titan.click('menusItems', 'clickMenu', this);
	},

	/*
	 * @name clickMenu @description carga la vista usuarios @return {void}
	 */
	clickMenu : function(e) {
		var link = $(e.target);
		if (link.attr('data-view') == 'crud')
			$('#loader-content').fadeIn('fast');

		_moduleObject = link;
		_crud = link.attr('data-table');
		_id_m = link.attr('data-id-m');

		// carga los html,css, javascript
		Titan.view(link.attr('data-module'), link.attr('data-view'), 'content-admin');
		this.slideMenu.toggle('slide');
		Titan.loader.show();
	},

	/*
	 * @name loadMenu @description carga la vista usuarios @return {void}
	 */
	loadMenu : function(e) {
		this.slideMenu.toggle('slide');
	},

	/*
	 * @name closeSession @description carga la vista usuarios @return {void}
	 */
	closeSession : function(e) {
		WebService.post({ route : 'security/logout'}).done(function(data) {
			delete Session.response;
			location.reload();
		});
	},
});/* * @module  Crud * * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz) * * @license Derechos Reservados de Autor (C) IP Total Software S.A */ Titan.modules.create({			name : 'Crud',			/*			 * 			 * @constructor			 * 			 * @description inicia los componentes del módulo			 * 			 */			ready : function() {				// init components				this.moduleContainer = $('#crud-container');				this.optionsCrud = this.moduleContainer.find('#options-crud');				this.context = this.moduleContainer.find('.contextmenu');				// para las llaves foraneas				this.modalCount = 0;				// la tabla				this.tablaResponsive = this.moduleContainer						.find('.table-responsive');//				this.tableCrud = this.moduleContainer.find('#table-crud');				var h = this.tablaResponsive.css('height');				console.log(h);				this.tableCrud.attr('data-height', h.replace('px', ''));				this.thead = this.tableCrud.find('thead > tr').first();				this.tbody = this.tableCrud.find('tbody').first();				// para el formulario				this.modalTitle = this.moduleContainer.find('#modal-crud .modal-title');				this.modal = this.moduleContainer.find('#modal-crud');				this.modal.on('hidden.bs.modal', function (e) {				  if (this.inputdni) {				  	this.inputdni.popover('hide');				  } 				}.bind(this));				this.totalContainer = this.moduleContainer.find('#total');				this.form = this.moduleContainer.find('.modal-body form');				// para el paginador				this.page = 1;				// cantidad de filas que se muestran el la tabla				this.totalRows = 100;				this.loadForPaginator = false;				this.filtrated = false;				this.paginatorContaier = this.moduleContainer						.find('#paginator');				this.index();			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			initEvents : function() {				/*				 * this.tableCrud.on('sort.bs.table', function () {				 * 				 * this.moduleContainer.find('td').attr('nowrap', 'nowrap');				 * 				 * this.moduleContainer.find('td').css('padding', '2px 8px');				 * 				 * 				 * 				 * }.bind(this));				 * 				 */			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			index : function() {				// buscamos los permisos para el modulo				function findMenu(source, name) {					for ( var k in source) {						if (source[k]) {							if (source[k].menu == name) {								return source[k];							}						}					}				}				var permissions = findMenu(__u__r, _id_m);				this.optionsCrud.html('');				if (permissions.p_create == 1) {					this.optionsCrud							.append('<button id="btn-new" title="Nuevo" class="btn btn-default" data-toggle="modal" data-target="#modal-crud">'									+									'<i class="glyphicon glyphicon-plus"></i> '									+									'</button>'							);				}				if (permissions.p_delete == 1) {					this.optionsCrud							.append('<button  id="btn-delete" class="btn btn-default" data-toggle="modal" >'									+									'<i class="glyphicon glyphicon-minus"></i> '									+									'</button>'							);				}				if (permissions.p_update == 1) {					this.optionsCrud							.append('<button  id="btn-edit"  title="Editar"  class="btn btn-default" data-toggle="modal" >'									+									'<i class="glyphicon glyphicon-edit"></i> '									+									'</button>'							);				}				this.optionsCrud						.append('<button  id="btn-filter"  title="Filtrar"  class="btn btn-default" data-toggle="modal">'								+								'<i class="glyphicon glyphicon-search"></i> ' +								'</button>'						);				var params = {					route : 'crud/load',					'data_table' : _crud				};				params.page = this.page;				params.totalRows = this.totalRows;				var a = WebService.post(params);				a						.done(function(data) {							if (!this.loadForPaginator) {								this.tableName = data.table;								this.loadStruct(data.struct);								this.tableCrud.bootstrapTable('destroy');								this.tableCrud.bootstrapTable();							}							this.tbody.html('');							// this.loadData(data.data);							this.tableName = data.table;							var dataTable = data.data;							for ( var i in dataTable) {								for ( var k in dataTable[i]) {									if (dataTable[i][k])										if ((typeof dataTable[i][k]) == 'object') {											if (dataTable[i][k]) {												if ('name' in dataTable[i][k])													dataTable[i][k] = ('last_name' in dataTable[i][k]) ? dataTable[i][k].name															+ ' '															+ dataTable[i][k].last_name															: dataTable[i][k].name;											}										}								}							}							this.tableCrud.bootstrapTable('destroy');							this.tableCrud.bootstrapTable();							if (_crud_mode == 'filter')								this.tableCrud										.bootstrapTable('load', dataTable);							else								this.tableCrud										.bootstrapTable('load', dataTable);							this.moduleContainer.find('td').attr('nowrap',									'nowrap');							this.totalContainer									.html('<b>Total de registros: </b>'											+ data.count);							// calculamos la cantida de paginas que tendra el							// paginador							this.numPags = Math.ceil(data.count									/ this.totalRows);							if (this.numPags < this.page) {								this.page = this.numPags;								this.moduleContainer.find(										'li[data-page="' + this.numPags + '"]')										.click();							} else {								if (!this.loadForPaginator) {									// $('li[data-page="'+this.numPags+'"]').click();									// this.page = this.numPags;									// this.loadForPaginator = true;								}							}							this.paginatorContaier.html('');							// creamos los botones del paginador							for (var i = 0; i < this.numPags; i++) {								this.paginatorContaier.append('<li data-page="'										+ (i + 1)										+ '" class="'										+ (((i + 1) == this.page) ? 'active'												: '') + '" ><a data-page="'										+ (i + 1) + '" href="#">' + (i + 1)										+ '</a></li>');							}							// buscamos todos los botones del paginador							var btnPaginator = this.paginatorContaier									.find('li');							// agregamos el evento a cada boton del paginador							$									.each(											btnPaginator,											function(index, val) {												$(val)														.off('click')														.on(																'click',																function(e) {																	Titan.loader.show();																	var btn = $(e.target);																	var btnPaginator = this.paginatorContaier																			.find('li');																	btnPaginator																			.removeClass('active');																	this.page = btn																			.attr('data-page');																	this																			.refresh();																	console																			.log((index + 1) == this.page);																}.bind(this));											}.bind(this));							// botones							this.btnSave = this.moduleContainer.find('#save');							this.btnNew = this.moduleContainer.find('#btn-new');							this.btnFilter = this.moduleContainer									.find('#btn-filter');							this.btnCancel = this.moduleContainer									.find('.btn-cancel');							this.btnDelete = this.moduleContainer									.find('#btn-delete');							this.btnTrash = this.moduleContainer									.find('.btn-trash');							this.btnEdit = this.moduleContainer									.find('.btn-edit');							this.btnEditOpen = this.moduleContainer									.find('#btn-edit');							Titan.click('btnSave', 'save', this);							Titan.click('btnDelete', 'modeDelete', this);							Titan.click('btnTrash', 'trash', this);							Titan.click('btnEdit', 'edit', this);							Titan.click('btnNew', 'modeNew', this);							Titan.click('btnFilter', 'modeFilter', this);							Titan.click('btnCancel', 'cancel', this);							Titan.click('btnEditOpen', 'edit', this);							Titan.loader.hide();							/*							 * 							 * $('input').typeahead({							 * 							 * hint: true,							 * 							 * highlight: true,							 * 							 * minLength: 1 }, {							 * 							 * name: 'states',							 * 							 * displayKey: 'value',							 * 							 * source: substringMatcher(states)							 * 							 * });							 * 							 * 							 * 							 * 							 * 							 * 							 * 							 * this.tableCrud.find('td').mousedown(function(e){							 * 							 * if( e.button == 2 ) {							 * 							 * $(e.target).click();							 * 							 * if							 * (this.tableCrud.bootstrapTable('getSelections').length >							 * 0) {							 * 							 * 							 * 							 * this.context.css({							 * 							 * left: e.pageX + 'px',							 * 							 * top: (e.pageY - 80) + 'px'							 * 							 * }); }							 * 							 * return false; }							 * 							 * return true;							 * 							 * }.bind(this));							 * 							 */						}.bind(this));			},			/*			 * 			 * @name loadViewUsuarios			 * 			 * @description carga la vista usuarios			 * 			 * @return {void}			 * 			 */			loadStruct : function(dataStruct) {				this.opcion = {};				for ( var i in dataStruct) {					if (i != -1) {						this.thead								.append('<th  data-halign="center" data-formatter="'										+ dataStruct[i].type										+ 'Formatter" data-field="'										+ i										+ '" data-sortable="true">'										+ dataStruct[i].name + '</th>');						switch (dataStruct[i].type) {						case 'foranea':							this.opcion[i] = dataStruct[i].foranea.list;							var options = dataStruct[i].foranea.list;							var html = '<div class="form-group "><label class="col-md-4 control-label" for="'									+ i									+ '"">'									+ dataStruct[i].name									+ '</label>';							var divContainerSelect = $('<div></div>');							var div = $('<div></div>');							div.addClass('col-md-7');							var selecthtml = $('<select id="' + i									+ '" data-type="' + i									+ '" class="form-control"></select>');							for (var j = 0; j < options.length; j++) {								selecthtml										.append('<option value="'												+ options[j].id												+ '" >'												+ (('last_name' in options[j]) ? options[j].name														+ ' '														+ options[j].last_name														: options[j].name)												+ '</option>');							}							div.append(selecthtml);							divContainerSelect.append(div);							html = html + divContainerSelect.html();							html = html + '</div>';							this.form.append(html);							break;						case 'checkbox':							this.form									.append('<div class="form-group ">'											+											'<label class="col-sm-4 control-label" >'											+ dataStruct[i].name											+ '</label>'											+											'<div class="col-sm-7 col-dsm-offset-1 slideThree">'											+											'<input type="'											+ dataStruct[i].type											+ '"  '											+ ((dataStruct[i].name == 'Id') ? 'readonly'													: '')											+ ' data-type="'											+ i											+ '"  id="'											+ i											+ '" '											+ ((dataStruct[i].name == 'Id') ? ''													: ' ') + '>' +											'<label for="' + i + '"></label>' +											'</div></div>');							// placeholder="Ingrese ' + dataStruct[i].name + '"							break;						case 'decimal':							this.form.append('<div class="form-group ">' +							'<label class="col-sm-4 control-label" >'									+ dataStruct[i].name + '</label>' +									'<div class="col-sm-7">' +									'<input type="number" min="0" max="100" step="0.1" '									+ ((i == 'id') ? 'readonly' : '')									+ ' data-type="' + i									+ '"  class="form-control"  '									+ ((dataStruct[i].name == 'Id') ? '' : ' ')									+ '>' +									'</div></div>');							// if (dataStruct[i].type == 'number') {};							// $('input[type="number"]').mask('0#');							// placeholder="Ingrese ' + dataStruct[i].name + '"							break;						case 'textarea': // <textarea class="form-control"							// rows="3"></textarea>							this.form									.append('<div class="form-group ">'											+											'<label class="col-sm-4 control-label" >'											+ dataStruct[i].name											+ '</label>'											+											'<div class="col-sm-7">'											+											'<textarea  data-type="'											+ i											+ '"  class="form-control" rows="6" ></textarea>'											+											'</div></div>');							// if (dataStruct[i].type == 'number') {};							// $('input[type="number"]').mask('0#');							// placeholder="Ingrese ' + dataStruct[i].name + '"							break;						default:													this.form.append('<div class="form-group ">' +							'<label class="col-sm-4 control-label" >'									+ dataStruct[i].name + '</label>' +									'<div class="col-sm-7">' +									'<input type="' + dataStruct[i].type									+ '"  ' + ((i == 'id') ? 'readonly' : '')									+ ' data-type="' + i									+ '"  class="form-control"  '									+ ((dataStruct[i].name == 'Id') ? '' : ' ')									+ '   ' + ((this.tableName == 'Deudor' && i == 'dni') ? 'data-container="body" data-trigger="manual" data-toggle="popover" data-placement="right" data-content="Esta cédula ya esta registrada en esta sucursal"' : ' ')+'>' +									'</div></div>');							if(this.tableName == 'Deudor' && i == 'dni') {								this.inputdni = $("input[data-type='dni']");								this.select_debtor_subsidiary = $("select[data-type='subsidiary']");																							this.inputdni.focusout( this.validate_dni.bind(this));																								this.select_debtor_subsidiary.on('change', this.validate_dni.bind(this));																}							// if (dataStruct[i].type == 'number') {};							// $('input[type="number"]').mask('0#');							// placeholder="Ingrese ' + dataStruct[i].name + '"							break;						}					}				}				;			},			/*			 * 			 * @name loadGrupoTrabajo			 * 			 * @description carga la vista grupos de trabajo			 * 			 * @return {void}			 * 			 */			 validate_dni : function(event) {			 	event.preventDefault();								var params = {};				params.route = "deudor/search_debtor_subsidiary";				params.dni = this.inputdni.val();				params.subsidiary =this.select_debtor_subsidiary.val();				if(params.dni.length > 0){					var a = WebService.post(params);					a.done(function(data) {						if (data.StatusResult == 'FALIURE') {														var text = "Esta cédula ya esta registrada en " + ((data.subsidiarys.length>1)? "otras": "una")+" sucursal" + ((data.subsidiarys.length>1)? "es": "")+"<ul>";							for (var j in data.subsidiarys) {								if(j < data.subsidiarys.length)								text += "<li>" + data.subsidiarys[j] +"</li>";							}							text+="</ul>";							this.inputdni.popover({container: 'body'});							this.inputdni.popover('show');							var popoverContent = $('.popover-content');							popoverContent.html(text );													}else{							this.inputdni.popover('hide');						}					}.bind(this));				}							 },			save : function() {				_cancel = false;				var params = {};				this.inputList = $('.modal-body input, .modal-body textarea');				$.each(this.inputList,						function(index, val) {							if ($(val).attr('type') == 'checkbox')								params[_crud + '[' + $(val).attr('data-type')										+ ']'] = ($(val).is(':checked')) ? 1										: 0;							else								params[_crud + '[' + $(val).attr('data-type')										+ ']'] = $(val).val();						});				this.selectList = $('.modal-body select');				$.each(this.selectList, function(index, val) {					params[_crud + '[' + $(val).attr('data-type') + ']'] = $(							val).val();					// params[''+_crud+'['+$(val).attr('data-type')+']'] =					// $(val).val();				});				switch (_crud_mode) {				case 'new':					params.route = 'crud/create';					break;				case 'edit':					params.route = 'crud/update/' + _idRow;					break;				case 'filter':					params.route = 'crud/filter';					break;				}				params.data_table = _crud;				var a = WebService.post(params);				a						.done(function(data) {							if (data.StatusResult == 'OK') {								$.each(this.inputList, function(index, val) {									$(val).val('');								});								switch (_crud_mode) {								case 'new':									Titan.popup											.success('Datos guardados exitosamente');									this.refresh();									break;								case 'edit':									Titan.popup											.success('Datos Actualizados exitosamente');									this.refresh();								case 'filter':									var dataTable = data.data;									for ( var i in dataTable) {										for ( var k in dataTable[i]) {											if (dataTable[i][k])												if ((typeof dataTable[i][k]) == 'object') {													if ('name' in dataTable[i][k]) {														console																.log(dataTable[i][k]);														dataTable[i][k] = ('last_name' in dataTable[i][k]) ? dataTable[i][k].name																+ ' '																+ dataTable[i][k].last_name																: dataTable[i][k].name;													}												}										}									}									this.tableCrud.bootstrapTable('load',											dataTable);									this.moduleContainer.find('td').attr(											'nowrap', 'nowrap');									this.filtrated = true;									this.btnFilter											.html('<i class="glyphicon glyphicon-remove-circle"></i> ');									break;								}							}						}.bind(this));			},			modeDelete : function(e) {				var rows = this.tableCrud.bootstrapTable('getSelections');				if (rows.length > 0) {					var row = rows[0];					_idRow = row.id;					Titan.message.confirmation('Confirmación',							'¿desea eliminar este registro?', this.deleteMode,							this, 'Aceptar', 'Cancelar');				} else {					Titan.popup.warning('Debes selecionar un registro primero');				}				;			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			deleteMode : function(e) {				var params = {};				params.route = 'crud/erase/' + _idRow;				params.data_table = _crud;				params.database_name = _database_name;				var a = WebService.post(params);				a.done(function(data) {					if (data.StatusResult == 'OK') {						Titan.popup.success('Datos borrados exitosamente');						this.loadForPaginator = true;						this.index();					} else {						Titan.popup.error('Error al  borrar los datos');					}				}.bind(this));			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			trash : function(e) {				_idRow = $(e.target).attr('data-id');			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			refresh : function(e) {				this.loadForPaginator = true;				this.index();			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			cancel : function(e) {				_cancel = true;			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			modeNew : function(e) {				_crud_mode = 'new';				this.modalTitle.html("Registrar " + this.tableName);				this.addSelectRequired();				this.cleanFields();			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			modeEdit : function(e) {				_crud_mode = 'edit';				this.modalTitle.html("Editar " + this.tableName);				this.addSelectRequired();			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			modeFilter : function(e) {				if (this.filtrated) {					this.btnFilter							.html('<i class="glyphicon glyphicon-search"></i> ');					this.paginatorContaier.find('li').first().click();					this.filtrated = false;				} else {					$('#modal-crud').modal('show');					_crud_mode = 'filter';					this.modalTitle.html("Buscar " + this.tableName);					this.removeSelectRequired();					this.cleanFields();				}			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			removeSelectRequired : function() {				this.comboboxs = $('#modal-crud').find('select');				this.comboboxs.each(function(index, el) {					$(el).find('option').first().prop('selected', true);					if ($(el).val() != '')						$(el).prepend('<option value=""></option>');					$(el).val(0);				});			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			cleanFields : function() {				this.inputs = $('#modal-crud').find('input');				this.inputs.each(function(index, el) {					$(el).val('');				});			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			addSelectRequired : function() {				this.comboboxs = $('#modal-crud').find('select');				this.comboboxs.each(function(index, el) {					$(el).find('option').first().prop('selected', true);					if ($(el).val() == '')						$(el).find('option').first().remove();				});			},			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 * 			 * 			 * createModal: function (name, columnas, lista) {			 * 			 * 			 * 			 * 			 * 			 * var id = 'myModalgenerate'+ this.modalCount ;			 * 			 * 			 * 			 * var html = '<!-- Modal -->'+ '<div class="modal fade" id="'+ id			 * +'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"			 * aria-hidden="true">'+ '<div class="modal-dialog">'+ '<div			 * class="modal-content">'+ '<div class="modal-header">'+ '<button			 * type="button" class="close" data-dismiss="modal"><span			 * aria-hidden="true">&times;</span><span class="sr-only">Cancelar</span></button>'+ '<h4 class="modal-title" id="myModalLabel">Selecciona</h4>'+ '</div>'+ '<div			 * class="modal-body">'+ '</div>'+ '<div class="modal-footer">'+ '<button			 * type="button" class="btn-cancel btn btn-default"			 * data-dismiss="modal">Cancelar</button>'+ '<button id="delete"			 * type="button" class="btn btn-primary">Aceptar</button>'+ '</div>'+ '</div>'+ '</div>'+ '</div>';			 * 			 * 			 * 			 * this.moduleContainer.append(html);			 * 			 * 			 * 			 * var body = this.moduleContainer.find('#'+id + ' .modal-body');			 * 			 * 			 * 			 * var htmlTable = '<div class="table-responsive">'+ '<table			 * id="table-crud" class="table table-hover ">'+ '<thead></thead>'+ '<tbody>'+ '</tbody>'+ '</table>'+ '</div>';			 * 			 * 			 * 			 * body.append(htmlTable);			 * 			 * 			 * 			 * //crear los nombres de las columnas			 * 			 * var thead = body.find('thead');			 * 			 * 			 * 			 * var row = $('<tr></tr>');			 * 			 * for(i in columnas){			 * 			 * if (i)			 * 			 * row.append('<th>' + i + '</th>'); }			 * 			 * 			 * 			 * thead.append(row);			 * 			 * 			 * 			 * //cargar los datos en las tablas			 * 			 * var tbody = body.find('tbody');			 * 			 * 			 * 			 * for(i in lista){			 * 			 * var row = $('<tr></tr>');			 * 			 * if (i){			 * 			 * for(k in lista[i]){			 * 			 * row.append('<td nowrap>' + lista[i][k] + '</td>'); } }			 * 			 * tbody.append(row); }			 * 			 * 			 * 			 * this.modalCount ++;			 * 			 * 			 * 			 * return id; },			 */			/*			 * 			 * @name initEvents			 * 			 * @description inicia los eventos de los componentes del módulo			 * 			 * @return {void}			 * 			 */			edit : function(e) {				var rows = this.tableCrud.bootstrapTable('getSelections');				if (rows.length > 0) {					_crud_mode = 'edit';					this.modalTitle.html("Editar " + this.tableName);					$('#modal-crud').modal('show');					var row = rows[0];					_idRow = row.id;					var params = {};					params.route = 'crud/edit/' + _idRow;					params.data_table = _crud;					var a = WebService.post(params);					a.done(function(data) {						row = data.data;						function findById(source, name) {							for ( var k in source) {								if (source[k]) {									if (((source[k].last_name) ? source[k].name											+ ' ' + source[k].last_name											: source[k].name) == name) {										return source[k];									}								}							}						}						for ( var i in row) {							var input_ = $('input[data-type=' + i + ']');							if (input_.length > 0) {								if (input_.attr('type') == 'checkbox') {									if (row[i] == 0) {										input_.attr('checked', false);									} else {										input_.attr('checked', true);									}								} else {									input_.val(row[i]);								}								;							} else {								var select = $('select[data-type=' + i + ']');								if (select.length > 0) {									/*									 * var result = findById(this.opcion[i],									 * row[i]);									 * 									 * console.log(result);									 * 									 * select.val(result.id);									 */									select.val(row[i]);								} else {									var textarea = $('textarea[data-type=' + i											+ ']');									if (textarea.length > 0) {										// var result = findById(this.opcion[i],										// row[i]);										console.log('entró');										textarea.val(row[i]);									}								}							}						}					});				} else {					Titan.popup.warning('Debes selecionar un registro primero');				}				;				/*				 * 				 * var params = {};				 * 				 * 				 * 				 * params.route = 'crud/edit/' + _idRow;				 * 				 * params.data_table = _crud;				 * 				 * 				 * 				 * var a = WebService.post(params);				 * 				 * 				 * 				 * a.done(function (data) {				 * 				 * 				 * 				 * if (data.StatusResult=='OK') {				 * 				 * 				 * 				 * 				 * 				 * 				 * 				 * for (var i in data.data) {				 * 				 * var input_ = $('input[data-type=' + i + ']');				 * 				 * if (input_.length>0)				 * 				 * input_.val(data.data[i]);				 * 				 * else{				 * 				 * var select = $('select[data-type=' + i + ']');				 * 				 * select.val(data.data[i]); } }				 * 				 * 				 * 				 * //this.btnCancel.click(); }				 * 				 * }.bind(this));				 * 				 * 				 * 				 */			},		});