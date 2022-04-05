/*
 * @module  index
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */
Titan.modules.create({
	name: 'History_products',
	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components
		

	},
	
	/*
	 * @name search
	 * @description get the observation of report call id past to params
	 * @return {void}
	 */
	 init: function(clientId) {
	 	this.clientId = clientId
		this.loadProducts()
	 },

	 /*
	  * @name loadProducts
	  * @description description
	  * @return {void}
	  */
	  loadProducts: function() {
		WebService.post({ 'route': 'agent/getOrderAndProductsHistory/' + this.clientId  }).done(this.refreshProducts.bind(this));
	 
	  },

	  /*
	   * @name refreshProducts
	   * @description description
	   * @return {void}
	   */
	   refreshProducts: function(data) {
	   	
	  		this.productsList.empty()
	  		this.listOrder.empty()


	  		this.productsArray = data.products

	  		for (var i = 0; i < data.products.length; i++) {
	  			let product = data.products[i].product
	  			this.printProduct(product, i)
	  		}

	  		data.orders = data.orders || []

	  		for (var i = 0; i < data.orders.length; i++) {
	  			let product = data.orders[i]
	  			this.printOrder(product, i)
	  		}

	  		
        	this.productsList.animate({ scrollTop: 0 }, "slow")
        	this.listOrder.animate({ scrollTop: 0 }, "slow")
	  		


	   },

	     /*
	    * @name printOrder
	    * @description description
	    * @return {void}
	    */
	    printOrder: function(order, index) {

	    	let html = `
	    	<div>	
	 			<a href="#" class="list-group-item" data-index="${order.id}" on-click="loadOrder">
					<h4 class="list-group-item-heading">${dateFormatter(order.date)} - <span> <small>${moment(order.created_at).fromNow()}</small></span></h4>

					<p class="list-group-item-text"><label>Valor: $${numberFormatter(order.price)} </label></p>
				</a>
			</div>
	    	`

	  		this.listOrder.appendTitan(html)
	   
	    },


	    /*
	     * @name loadOrder
	     * @description description
	     * @return {void}
	     */
	     loadOrder: function(elem, event, orderId) {

			WebService.post({ 'route': 'agent/getHistoryOrder/' + orderId  }).done(this.onLoadHistory.bind(this));
	    	
	     },


	     /*
	      * @name onLoadHistory
	      * @description description
	      * @return {void}
	      */
	      onLoadHistory: function(data) {
	      	console.log(data)

	      	this.dialogHistory.modal('show')

	      	let products = data.products || []
	      	this.productsListHistory.empty()
	      	
	      	for (var i = 0; i < products.length; i++) {
	      		let product = products[i]	
	      		this.printProductHistory(product, i)
	      	}
	     
	      },


	   /*
	    * @name printProduct
	    * @description description
	    * @return {void}
	    */
	    printProduct: function(product, index) {

	    	let html = `
	    	<div>	
	 			<a href="#" class="list-group-item" on-click="onClickProduct" data-index="${index}">
			    	<h4 class="list-group-item-heading">${product.description}</h4>
			    	<p class="list-group-item-text"><label>COD: ${product.sap_code}</label> - ${product.measure}  <label>X ${product.units}uni </p>
			  	</a>
			</div>
	    	`

	  		this.productsList.appendTitan(html)
	   
	    },

	    /*
	     * @name onClickProduct
	     * @description description
	     * @return {void}
	     */
	     onClickProduct: function(elem, event, index) {

	     	let product = this.productsArray[index]

	     	//Titan.app.listprice.products.printProductOrder(product.product)
	  		console.log(product)
	    
	     },



	      /*
	    * @name printProductHistory
	    * @description description
	    * @return {void}
	    */
	    printProductHistory: function(productData, index) {

	    	let { aproduct, quantity, sap_code, price} = productData

	    	let html = `
	    	<div>	
	 			<a href="#" class="list-group-item" >
			    	<h4 class="quantity">${quantity}</h4>
			    	<h4 class="list-group-item-heading">${aproduct.Nombre}</h4>
			    	<p class="list-group-item-text"><label>COD: ${parseInt(sap_code)}</label> - $${numberFormatter(price)}</p>
			  	</a>
			</div>
	    	`

	  		this.productsListHistory.appendTitan(html)
	   
	    },


});