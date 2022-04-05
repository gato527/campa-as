/*
 * @module  Choose Login
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */
 Titan.modules.create({
 	name: 'Products',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	 ready: function () {
		//init components

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
	 	
		
		WebService.post({ 'route': 'import/saveProducts' , products: this.products }).done(this.onSavedClients.bind(this))

	 },

	 /*
	  * @name onSavedClients
	  * @description response the server to save products
	  * @return {void}
	  */
	  onSavedClients: function(response) {
	  	
	 
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


	 			this.products = resultCsv


	 			Titan.loader.hide()
	 			Titan.popup.info('Verifica la información y luego presiona en importar.', 6000)

		    }
		    // start reading the file. When it is done, calls the onload event defined above.
		    reader.readAsText(file, 'utf-8')
		    event.target.value = ''

		    }, 1000)



	 	} else {
	 		this.btnFile.find('span').text('Seleccionar un archivo');
	 	}
	  	
	 },




});