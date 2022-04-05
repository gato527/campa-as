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
		
	  	this.productsArray = {}
	  	this.discounsArray = {}
 
	  	this.search.jFilter({
		    container: this.productsList,
		    findBy: 'a',
		    hide: 'a',
		    minsize: 3,
		    highlight: true,
		});

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
	 	this.client = client

	 	// this.refreshProducts({products: this.productsArray})

	 	if (this.interval) {
	 		clearInterval(this.interval)
	 	}
	 	this.interval = setInterval(this.calculatePrice.bind(this), 200)

	 	if (!reportId) {
	 		this.field.hide()
	 	}

		this.productsArray = {}
	  	this.discounsArray = {}
	 	this.loadProducts()

	 },

	 /*
	  * @name loadProducts
	  * @description description
	  * @return {void}
	  */
	  loadProducts: function() {
		WebService.post({ 'route': 'listprice/getDiscountList', 
			clientCode: this.client.client_code,
		}).done(this.refreshDiscounts.bind(this));

		
	 
	  },

	   /**
	   * @name refreshDiscounts
	   * @description description
	   * @params data Server response
	   * @return {void} 
	   */
	  refreshDiscounts: function  (data) {

	  		// 11
	  		let A888PRODH = data.A888PRODH || []
	  		let A888KONDM = data.A888KONDM || []
	  		let A888MATNR = data.A888MATNR || []
	  		this.addDiscounts(A888PRODH)
	  		this.addDiscounts(A888KONDM)
	  		this.addDiscounts(A888MATNR)

	  		// 10
	  		let A972PRODH = data.A972PRODH || []
	  		let A972KONDM = data.A972KONDM || []
	  		let A972MATNR = data.A972MATNR || []
	  		this.addDiscounts(A972PRODH)
	  		this.addDiscounts(A972KONDM)
	  		this.addDiscounts(A972MATNR)


	  		// 09
	   		let A987PRODH = data.A987PRODH || []
	  		let A987KONDM = data.A987KONDM || []
	  		let A987MATNR = data.A987MATNR || []
	  		this.addDiscounts(A987PRODH)
	  		this.addDiscounts(A987KONDM)
	  		this.addDiscounts(A987MATNR)

	  		// 08
	  		let A685MATNR = data.A685MATNR || []
	  		this.addDiscounts(A685MATNR)

	  		// 07
	  		let A981PRODH = data.A981PRODH || []
	  		let A981KONDM = data.A981KONDM || []
	  		let A981MATNR = data.A981MATNR || []
	  		this.addDiscounts(A981PRODH)
	  		this.addDiscounts(A981KONDM)
	  		this.addDiscounts(A981MATNR)

	  		// 06
	  		let A968PRODH = data.A968PRODH || []
	  		let A968KONDM = data.A968KONDM || []
	  		let A968MATNR = data.A968MATNR || []
	  		this.addDiscounts(A968PRODH)
	  		this.addDiscounts(A968KONDM)
	  		this.addDiscounts(A968MATNR)

	  		// 05
	  		let A687PRODH = data.A687PRODH || []
	  		let A687KONDM = data.A687KONDM || []
	  		let A687MATNR = data.A687MATNR || []
	  		this.addDiscounts(A687PRODH)
	  		this.addDiscounts(A687KONDM)
	  		this.addDiscounts(A687MATNR)

	  		// 04
	  		let A967PRODH = data.A967PRODH || []
	  		let A967KONDM = data.A967KONDM || []
	  		let A967MATNR = data.A967MATNR || []
	  		this.addDiscounts(A967PRODH)
	  		this.addDiscounts(A967KONDM)
	  		this.addDiscounts(A967MATNR)

	  		// 03
	  		let A974PRODH = data.A974PRODH || []
	  		let A974KONDM = data.A974KONDM || []
	  		let A974MATNR = data.A974MATNR || []
	  		this.addDiscounts(A974PRODH)
	  		this.addDiscounts(A974KONDM)
	  		this.addDiscounts(A974MATNR)

	  		// 02
	  		let A678PRODH = data.A678PRODH || []
	  		let A678KONDM = data.A678KONDM || []
	  		let A678MATNR = data.A678MATNR || []
	  		this.addDiscounts(A678PRODH)
	  		this.addDiscounts(A678KONDM)
	  		this.addDiscounts(A678MATNR)


	  		// 01
	  		let A971PRODH = data.A971PRODH || []
	  		let A971KONDM = data.A971KONDM || []
	  		let A971MATNR = data.A971MATNR || []
	  		this.addDiscounts(A971PRODH)
	  		this.addDiscounts(A971KONDM)
	  		this.addDiscounts(A971MATNR)

	  		console.log(Object.values(this.discounsArray))

			WebService.post({ 'route': 'listprice/getProductsList' }).done(this.refreshProducts.bind(this));
	  	},


		/**
		* @name addDiscounts
		* @description description
		* @params data Server response
		* @return {void} 
		*/
		addDiscounts: function  (products) {
			for (var i = 0; i < products.length; i++) {
				let p = products[i]
				if (!this.discounsArray[parseInt(p.Codigo)+'']) {
					this.discounsArray[parseInt(p.Codigo)+''] = p
					this.discounsArray[parseInt(p.Codigo)+''].precio = parseInt(this.discounsArray[parseInt(p.Codigo)+''].precio) 
				} else {
					this.discounsArray[parseInt(p.Codigo)+''].precio = parseInt(this.discounsArray[parseInt(p.Codigo)+''].precio) + parseInt(p.precio)
				}
			}
		},



	  /*
	   * @name refreshProducts
	   * @description description
	   * @return {void}
	   */
	   refreshProducts: function(data) {
	   	
	  		this.productsList.empty()


	  		let A888PRODH = data.A888PRODH || []
	  		let A888KONDM = data.A888KONDM || []
	  		let A888MATNR = data.A888MATNR || []

	  		let A972PRODH = data.A972PRODH || []
	  		let A972KONDM = data.A972KONDM || []
	  		let A972MATNR = data.A972MATNR || []


	  		this.addProducts(A888PRODH)
	  		this.addProducts(A888KONDM)
	  		this.addProducts(A888MATNR)

	  		this.addProducts(A972PRODH)
	  		this.addProducts(A972KONDM)
	  		this.addProducts(A972MATNR)

	  		console.log(Object.keys(this.productsArray).length)
	  		console.log(Object.values(this.productsArray))





	
			WebService.post({ 'route': 'listprice/getListByClient' ,
				clientCode: this.client.client_code,
			}).done(this.loadClientProducts.bind(this));


	   },

	    /**
	    * @name addProducts
	    * @description description
	    * @params data Server response
	    * @return {void} 
	    */
	   addProducts: function  (products) {
			for (var i = 0; i < products.length; i++) {
	  			let p = products[i]
	  			this.productsArray[parseInt(p.Codigo)+''] = p
	  		}
	   },

	    /**
	    * @name loadClientProducts
	    * @description description
	    * @params data Server response
	    * @return {void} 
	    */
	   loadClientProducts: function  (data) {

	   		// 09
	   		let A987PRODH = data.A987PRODH || []
	  		let A987KONDM = data.A987KONDM || []
	  		let A987MATNR = data.A987MATNR || []
	  		this.addProducts(A987PRODH)
	  		this.addProducts(A987KONDM)
	  		this.addProducts(A987MATNR)

	  		// 08
	  		let A685MATNR = data.A685MATNR || []
	  		this.addProducts(A685MATNR)

	  		// 07
	  		let A981PRODH = data.A981PRODH || []
	  		let A981KONDM = data.A981KONDM || []
	  		let A981MATNR = data.A981MATNR || []
	  		this.addProducts(A981PRODH)
	  		this.addProducts(A981KONDM)
	  		this.addProducts(A981MATNR)

	  		// 06
	  		let A968PRODH = data.A968PRODH || []
	  		let A968KONDM = data.A968KONDM || []
	  		let A968MATNR = data.A968MATNR || []
	  		this.addProducts(A968PRODH)
	  		this.addProducts(A968KONDM)
	  		this.addProducts(A968MATNR)

	  		// 05
	  		let A687PRODH = data.A687PRODH || []
	  		let A687KONDM = data.A687KONDM || []
	  		let A687MATNR = data.A687MATNR || []
	  		this.addProducts(A687PRODH)
	  		this.addProducts(A687KONDM)
	  		this.addProducts(A687MATNR)

	  		// 04
	  		let A967PRODH = data.A967PRODH || []
	  		let A967KONDM = data.A967KONDM || []
	  		let A967MATNR = data.A967MATNR || []
	  		this.addProducts(A967PRODH)
	  		this.addProducts(A967KONDM)
	  		this.addProducts(A967MATNR)

	  		// 03
	  		let A974PRODH = data.A974PRODH || []
	  		let A974KONDM = data.A974KONDM || []
	  		let A974MATNR = data.A974MATNR || []
	  		this.addProducts(A974PRODH)
	  		this.addProducts(A974KONDM)
	  		this.addProducts(A974MATNR)

	  		// 02
	  		let A678PRODH = data.A678PRODH || []
	  		let A678KONDM = data.A678KONDM || []
	  		let A678MATNR = data.A678MATNR || []
	  		this.addProducts(A678PRODH)
	  		this.addProducts(A678KONDM)
	  		this.addProducts(A678MATNR)


	  		// 01
	  		let A971PRODH = data.A971PRODH || []
	  		let A971KONDM = data.A971KONDM || []
	  		let A971MATNR = data.A971MATNR || []
	  		this.addProducts(A971PRODH)
	  		this.addProducts(A971KONDM)
	  		this.addProducts(A971MATNR)
	  		

	  		// console.log(Object.keys(this.productsArray).length)
	  		let products = Object.values(this.productsArray)

	  		for (var i = 0; i < products.length; i++) {
	  			

	  			products[i].sap_code = parseInt(products[i].Codigo)
	  			products[i].price = products[i].precio
	  			products[i].description = products[i].Nombre

	  			this.printProduct(products[i], i)
	  		}

	  		this.productsArray = products
	       
	   },


	   /*
	    * @name printProduct
	    * @description description
	    * @return {void}
	    */
	    printProduct: function(product, index) {

	    	let discount = this.discounsArray[product.sap_code]
			let porcentageDiscount = 0;
	    	product.precio = parseInt(product.precio) 

	    	if (discount) {
	    		

	    		porcentageDiscount = discount.precio/100

	    		let price = product.precio 
	    		discount = PC(price, porcentageDiscount)
	    		product.precio = product.precio
	    		product.discount = parseInt(discount)

	    		product.price = discount ? product.precio + product.discount : product.precio;

	    	}

	    	let iva = parseInt(product.Iva) //: "19"
	    	product.valueIva = parseInt(PC(product.price, iva))
	    	product.priceTotal = parseInt(product.price) + parseInt(product.valueIva)




	    	product.description = product.description || ''

	    	let html = `
	    	<div>	
	 			<a href="#" class="list-group-item" >
	 				<div class="img-product" on-click="onClickProductDetail"  data-index="${index}">	
	 					<img src="img/products/mini/${product.sap_code}.png" onError='ImgErrorProduct(this);' />	
			  		</div>
	 				<div class="description" on-click="onClickProduct" data-index="${index}" >	
			    		<h5 class="list-group-item-heading">${product.sap_code} - ${product.description.capitalize()}</h5>
			    		 <h5><small>IVA ${iva}%: $${numberFormatter(product.valueIva)} Precio sin IVA: $ ${numberFormatter(product.price)}<br/>precio:</small>$ ${numberFormatter(product.priceTotal)}</h5>
			    		${ discount ? `<small class="discount">${porcentageDiscount * -1}% Descuento: $${numberFormatter(product.discount * -1)}</small>` : ''}
			  		</div>
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
	     * @name onClickProductDetail
	     * @description description
	     * @return {void}
	     */
	     onClickProductDetail: function(elem, event, index) {

	     	let product = this.productsArray[index]

			

			Titan.view('listprice', 'detail', this.productsModal, {product: product})

	    
	     },



	     /*
	    * @name printProduct
	    * @description description
	    * @return {void}
	    */
	    printProductOrder: function(product) {

	    	let html = `
	    	<div>	
	 			<a href="#" class="list-group-item" data-json="${Base64.encode(JSON.stringify(product)) }" data-code="${product.sap_code}" data-id="${product.id}" data-price="${product.priceTotal}" >
	 				
	 				<img src="img/products/mini/${product.sap_code}.png" />	
	 				<input  type="number" class="form-control count" min="1" on-change="sync" data-code="${product.sap_code}">

			    	<h4 class="list-group-item-heading">${product.description}</h4>
					<p  class="list-group-item-text"><label>COD: ${product.sap_code}</label><br/>precio: $<span>${numberFormatter(product.priceTotal)}</span></p>
			    	
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

	     	// debugger
	     	let code = elem.attr('data-code')
	     	let price = elem.attr('data-price')
	     	// this.orderProductlist.push({id: code, type: "product", count: count, price: price })
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

	     	let total_iva = 0
	     	let total_base = 0

	     	for (var i = 0; i < products.length; i++) {
	     		let p = $(products[i])		

	     		let productId = p.attr('data-id')
	     		let code = p.attr('data-code')
	     		let price = p.attr('data-price')
	     		let json = p.attr('data-json')
	     		let count = p.find('.count').first()
	     		let quantity = parseInt(count.val())

	     		if (quantity <= 0) {
	     			count.addClass('alert-error')
	     		}else{
	     			count.removeClass('alert-error')
	     		}

	     		let jsonVal = JSON.parse(Base64.decode(json))

	     		console.log('jsonVal', jsonVal)

	     		total_iva += jsonVal.valueIva * quantity
	     		total_base += jsonVal.precio * quantity

	     		this.productsOrderArray.push({
	     			product: productId,
	     			quantity: quantity,
	     			code: code,
	     			price: price,
	     			json: jsonVal,
	     		})

	     		
	     	}


	     	this.total_iva = total_iva
	     	this.total_base = total_base

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
					client: this.client,
					price: this.totalOrder,
					total_iva: this.total_iva,
	     			total_base: this.total_base,
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