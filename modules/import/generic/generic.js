
/*
 * @module  Choose Login
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */
 Titan.modules.create({
 	name: 'generic',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	 ready: function () {
		//init components
        this.tableImport = this.get('#table-import');
        this.tableImport.bootstrapTable();

		Titan.loader.hide()
	},

	/*
	 * @name initEvents
	 * @description inicia los eventos de los componentes del módulo
	 * @return {void}
	 */
	 initEvents: function () {

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
	 * @name import
	 * @description description
	 * @return {void}
	 */
	 import: function() {
	 	
		
		WebService.post({ 'route': 'import/saveClient' , clients:JSON.stringify( this.clients) }).done(this.onSavedClients.bind(this))

	 },

	 /*
	  * @name onSavedClients
	  * @description response the server to save clients
	  * @return {void}
	  */
	  onSavedClients: function(data) {
	  	
	 	if(data.StatusResult){
			swal('Información', 'La importación finalizó exitosamente!');
		} else {
			Titan.popup.danger('Error al guardar los datos');
		}
	  },

	 /*
	  * @name onChangeFile
	  * @description describe la function
	  * @params data, respuesta del servidor
	  * @return {void}
	  */
	 onChangeFile: function (elem, val,  event ) {

	 
	 	if (event.target.files.length > 0) {
	 		this.btnFile.find('span').text(event.target.files[0].name);
	 		Titan.loader.show()

	 		setTimeout(()=>{


		    let file = event.target.files[0]

		    let reader = new FileReader();
		    reader.onload = ()=> {
		        console.log('import:  ',{ 
		          messageFile: 'Leyendo el archivo ...'
		        })
		        let csv = reader.result

		        let resultCsv = csvJSON(csv)
				debugger

	 			this.tableImport.bootstrapTable('load', resultCsv);

	 			this.clients = resultCsv


	 			Titan.loader.hide()
	 			Titan.popup.info('Verifica la información y luego presiona en importar.', 6000)

		    }
		    // start reading the file. When it is done, calls the onload event defined above.
		    reader.readAsText(file, 'ISO-8859-1')
		    event.target.value = ''

		    }, 1000)



	 	} else {
	 		this.btnFile.find('span').text('Seleccionar un archivo');
	 	}
	  	
	 },




});