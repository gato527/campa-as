/*
 * @module  Choose Login
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */
 Titan.modules.create({
 	name: 'Sms_masive',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	 ready: function () {
		//init components
        
	    /* formulario de subir archivo */
	    this.btnFile  = this.get('.btn-file');
	    this.fileInput  = this.get('#file-import');

        /* select de sucursales */
        this.load_subsidiary = this.get('#load_subsidiary');
	 	this.btnReset.hide()
	 	this.btnSend.hide()

		this.step = 0;
		this.next()
	},

	/*
	 * @name next
	 * @description description
	 * @return {void}
	 */
	 next: function() {
	 	this.get('.step').hide('fade')

	 	setTimeout(()=>{
	 		++this.step
	 		this.get('.step-' + this.step).show('fade')
	 	}, 800)
	 },

	 /*
	  * @name back
	  * @description description
	  * @return {void}
	  */
	  back: function() {
	 	this.get('.step').hide('fade')

	 	setTimeout(()=>{
	 		--this.step
	 		this.get('.step-' + this.step).show('fade')
	 	}, 800)
	  },

	/*
	 * @name changeSubsidiary
	 * @description inicia los eventos de los componentes del módulo
	 * @return {void}
	 */
	 changeSubsidiary: function (elem, value) {
	 	this.subsidiaryName.text(this.subsidiaries[value])
	 },

	/*
	 * @name onSelectFile
	 * @description describe la function
	 * @params data, respuesta del servidor
	 * @return {void}
	 */
	onSelectFile: function ( data ) {
		this.fileInput.click()
	},


	 /*
	  * @name onChangeFile
	  * @description describe la function
	  * @params data, respuesta del servidor
	  * @return {void}
	  */
	 onChangeFile: function ( elem, val, e ) {

		this.table.html('')
		this.message.text('')

	 	if (e.target.files.length > 0) {
	 		this.btnFile.text(e.target.files[0].name);
	 	
	 		let file = e.target.files[0]
	 		var reader = new FileReader();
	 		var rABS = true;
            
            reader.onload = (e)=> {
          
                var data = e.target.result;

                let sheet = Papa.parse(data, {
					delimiter: ";"
				})

				/*
                if (!rABS) data = new Uint8Array(data);
                
                var workbook = XLSX.read(data, { type: rABS ? 'binary' : 'array' });
                var first_sheet_name = workbook.SheetNames[0];
                console.log("sheet name ", first_sheet_name);

                 DO SOMETHING WITH workbook HERE 

                var sheet = excelToJSON(workbook.Sheets[workbook.SheetNames[0]])
                console.log("sheet  ", sheet);

                let shet1 = JSON.stringify(sheet.data)*/
                this.sheet = sheet	


                let headers = [ 'Celular', 'Mensaje a enviar']

               	let headersSheet = sheet.data.shift()

               	debugger

               	if (headersSheet.length != headers.length) {
               		this.message.text('El archivo no es coherente con la plantilla descargada por favor rellene los valores en esta plantilla.')
                	this.fileInput.val('')
                	this.message.addClass('error')
               		return
               	} else {
                	this.message.removeClass('error')
               	}


               	let errors = headers.map((key)=>{

               		if (headers[key] != headersSheet[key] ) {
               			return {
               				headerFail: headersSheet[key],
               				headerOk: headers[key],
               				key: key
               			}
               		};

               	}).filter((obj)=>{
               		return obj != undefined
               	})

               	console.log('errors', errors)



               	if (errors.length > 0) {

               		let rows = errors.map((header)=>{
							return `  
							<tr>
							  <th scope="row">${header.key}</th>
						      <td>${header.headerOk}</td>
						      <td>${header.headerFail}</td>
						    </tr>`
						})
               		let table = `
               		<div class="alert alert-danger" role="alert"><i class="material-icons">
					report_problem
					</i>  Algunas columnas del excel parecen estar incorrectas.</div>
               		<table class="table table-hover">
					  <thead>
					    <tr>
					      <th scope="col">Columna</th>
					      <th scope="col">Correcto</th>
					      <th scope="col">Incorrecto</th>
					    </tr>
					  </thead>
					  <tbody>
					    
				    	${rows.join('')}
				    
					  </tbody>
					</table>`

					this.table.html(table)
               	} else {
               		this.loadTableExcel(headers, sheet.data)
               		this.message.text('Revise la información del excel, si es correcta presione en "Enviar Mensajes".')
	 				this.btnSend.show()

               	}



                this.fileInput.val('')

            }

            if (rABS){
				reader.readAsBinaryString(file); 
			} else { 
				reader.readAsArrayBuffer(file);
			}
	 	} else {
	 		this.btnFile.text('Seleccionar un archivo');
	 	}
	},


	 /**
	 * @name resetForNewLoad
	 * @description description
	 * @return {void} 
	 */
	 resetForNewLoad: function  () {
	    this.fileInput.val('')
	 	this.btnFile.text('Seleccionar un archivo');
		this.table.html('')
		this.rows = []
		this.load_subsidiary.val('');
	 	this.subsidiaryName.text('')
	 	this.btnReset.hide()
	 	this.options.show()
		this.containerMessage.empty()
	 	this.tableReport.empty()
	 	this.btnFile.show()
	 	this.btnSend.show()
		this.back()
	 },


	 /*
	  * @name importDebtors
	  * @description description
	  * @return {void}
	  */
	  importDebtors: function() {

		var subsidiary = this.load_subsidiary.val();
	 	this.btnSend.hide()
		this.containerMessage.html('Se inicio el envió esto puede tardar unos minutos ...');
	  	
		WebService.post({ 
			route : 'sms/masive',
			debtors: JSON.stringify(this.rows),
			user: __u__,
		}).done( (data)=>{

			this.containerMessage.html('<div class="alert alert-primary" role="alert">Los Sms fueron enviados con éxito</div>');

	 		var list = $('<ul class="list-group">');

	 		for (var i = 0; i < data.debtors.length; i++) {
	 			var d = data.debtors[i];
	 			list.append('<li class="list-group-item list-group-item-' + (d.startsWith('NO')? 'danger':'success'  )+'">' + d + '</li>');
	 		}
 
	 		this.containerMessage.append(list);
	 		this.tableReport.empty()

	 		this.btnReset.show()
	 		this.options.hide()
	 		this.btnFile.hide()
        	this.message.text('')

	 		this.btnSend.show()


		});
	 	
	  },


	 /*
	  * @name loadTableExcel
	  * @description description
	  * @return {void}
	  */
	  loadTableExcel: function(headers, rows) {

	  	this.tableReport.bootstrapTable('destroy')
	  	var cols = [];

	 	for (var i= 0; i < headers.length; i++) {
	 		if (headers[i]){
	 			cols.push(this.getCols(headers[i].trim(), headers[i].trim()));
	 		}
	 	}


	 	let parseJson = (row)=>{
          let  newObject = {}
            row.map((val,i)=>newObject[headers[i].trim()]=val)
            return newObject
        }


	 	for (var i= 0; i < rows.length; i++) {
	 		if (rows[i] && rows[i].join('').trim() != ""){
	 			rows[i] = parseJson(rows[i])
	 		} else {
	 			rows.splice(i,1)
	 		}
	 	}

	 	this.tableReport.bootstrapTable({
	 		cache: false,
	 		striped: true,
	 		showColumns: false,
	 		minimumCountColumns: 2,
	 		clickToSelect: false,
	 		columns: cols,
	 		data: rows,
	 	});

	 	this.rows = rows
	  },

	  getCols: function(col, index){

	 	return {
	 		class: '',
	 		field: index,
	 		title: col,
	 		align: 'center',
	 		sortable: true
	 	}
	 },
	 	
});