/*
 * @module  index
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */
Titan.modules.create({
	name: 'Detail',
	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components
		
	 	this.modalDetailProduct.modal('show')

	  	console.log(this.params.product)
	  	console.log(this.params)

	  	this.sap.text(this.params.product.sap_code)
	  	this.image.attr('src',"img/products/detail/"+this.params.product.sap_code+".png")

	  	

	},
	

	

});