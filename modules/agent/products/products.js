/*
 * @module  index
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
		

		  this.loadProducts()

	},
	
	/*
	 * @name search
	 * @description get the observation of report call id past to params
	 * @return {void}
	 */
	 init: function(reportId, clientId, client) {
	 	this.reportId = reportId
	 	this.clientId = clientId
	 	this.city = client.city

	 	this.refreshProducts({products: this.productsArray})

	 	if (this.interval) {
	 		clearInterval(this.interval)
	 	}
	 	this.interval = setInterval(this.calculatePrice.bind(this), 200)

	 	if (!reportId) {
	 		this.field.hide()
	 	}

	 },

	 /*
	  * @name loadProducts
	  * @description description
	  * @return {void}
	  */
	  loadProducts: function() {
		WebService.post({ 'route': 'agent/getProducts'  }).done(this.refreshProducts.bind(this));
	 
	  },

	  /*
	   * @name refreshProducts
	   * @description description
	   * @return {void}
	   */
	   refreshProducts: function(data) {
	   	
	  		this.productsList.empty()
	  		this.productsArray = data.products

	  		for (var i = 0; i < data.products.length; i++) {
	  			let product = data.products[i]
	  			this.printProduct(product, i)
	  		}

	  		this.search.jFilter({
			    container: this.productsList,
			    findBy: 'a',
			    hide: 'a',
			    minsize: 3,
			});

	   },


	   /*
	    * @name printProduct
	    * @description description
	    * @return {void}
	    */
	    printProduct: function(product, index) {

	    	product.description = product.description || ''

	    	let html = `
	    	<div>	
	 			<a href="#" class="list-group-item" on-click="onClickProduct" data-index="${index}">
			    	<h4 class="list-group-item-heading">${product.description.capitalize()}</h4>
			    	<p class="list-group-item-text"><label>COD: ${product.sap_code}</label> - ${product.measure} <label>X ${product.units}uni</label><br/>precio: $ ${numberFormatter(product.price)}</p>
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
	  		this.printProductOrder(product)
	  		console.log(product)

			

	    
	     },


	     /*
	    * @name printProduct
	    * @description description
	    * @return {void}
	    */
	    printProductOrder: function(product) {

	    	let html = `
	    	<div>	
	 			<a href="#" class="list-group-item" data-code="${product.sap_code}" data-id="${product.id}" data-price="${product.price}">
	 				<input  type="number" class="form-control count" min="1" on-change="sync" data-code="${product.sap_code}">

			    	<h4 class="list-group-item-heading">${product.description}</h4>
					<p  class="list-group-item-text"><label>COD: ${product.sap_code}</label> - ${product.measure}  <label>X ${product.units}uni</label><br/>precio: $<span>${numberFormatter(product.price)}</span></p>
			    	
			    	<div class="btn btn-default clear" on-click="onClearProduct"><i class="material-icons"> clear </i></div>
			  	</a>
			</div>
	    	`

	  		this.productsOrder.appendTitan(html)


	   
	    },

	    /*
	     * @name sync
	     * @description description
	     * @return {void}
	     */
	     sync: function(elem, count) {
	     	let code = elem.attr('data-code')
	     	celuweb({id: code, type: "product", count: count})
	     },

	    /*
	     * @name calculatePrice
	     * @description description
	     * @return {void}
	     */
	     calculatePrice: function() {
	     	

	     	let total = 0


	     	let products = this.productsOrder.find('.list-group-item')

	     	for (var i = 0; i < products.length; i++) {
				 let p = $(products[i])
				 
	     		let count = parseInt(p.find('.count').val()) || 0
	     		let price = parseInt(p.attr('data-price')) || 0

				total += price * count

	     	}



	     	this.priceTotal.text(numberFormatter(total))

	     	this.totalOrder = total
	    
	     },

	    /*
	     * @name onClearProduct
	     * @description description
	     * @return {void}
	     */
	     onClearProduct: function(elem) {
	     	
	     	elem.parent().parent().remove()
	    
	     },


	     /*
	      * @name saveOrder
	      * @description description
	      * @return {void}
	      */
	      saveOrder: function() {
	      	
	     	let products = this.productsOrder.find('.list-group-item')

	     	this.productsOrderArray = []

	     	for (var i = 0; i < products.length; i++) {
	     		let p = $(products[i])		

	     		let productId = p.attr('data-id')
	     		let code = p.attr('data-code')
	     		let count = p.find('.count').first()
	     		let quantity = count.val()

	     		
	     		this.productsOrderArray.push({
	     			product: productId,
	     			quantity: quantity,
	     		})

	     		if (quantity <= 0) {
	     			count.addClass('alert-error')
	     		}else{
	     			count.removeClass('alert-error')
	     		}
	     	}

	     	let error  = this.productsOrder.find('.alert-error')

	     	if (error.length > 0) {
	     		Titan.popup.warning('Todos los productos del pedido deben llevar una cantidad, revisa los espacios en rojo.', 6000)
	     		return;
	     	}

	 		Titan.message.confirmation('Confirmación', '¿Desea guardar el pedido?', this.onSaveOrder ,this)

	      },


	      /*
	       * @name onSaveOrder
	       * @description description
	       * @return {void}
	       */
	       onSaveOrder: function() {
	       	
				WebService.post({ 'route': 'agent/saveOrder/' + this.clientId + '/' + this.reportId, 
					user: Titan.getUser(),
					'price': this.totalOrder,
					products: this.productsOrderArray,   
				}).done(this.clearOrder.bind(this));
	      
	       },


	      /*
	       * @name clearOrder
	       * @description description
	       * @return {void}
	       */
	       clearOrder: function() {
	       	
	      		this.productsOrder.empty();
	     		Titan.popup.success('Pedido guardado!')
	 			Titan.app.agent.history_products.loadProducts()
	     		

	       },


	

});