/*
 * @module  index
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */
Titan.modules.create({
	name: 'Find_order',
	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components

		this.ordersDate[0].defaultValue = moment().format('YYYY-MM-DD')

		this.refresh()

	},




	/*
	* @name refresh
	* @description description
	* @return {void}
	*/
	refresh: function() {

		this.containerErrors.hide()

		Titan.loader.show()
	WebService.post({ 
		'route': 'leader/findOrders', 
		orderdate: this.ordersDate.val(),
	}).done(this.onLoadClients.bind(this))

	},

	/*
	* @name onLoadClients
	* @description description
	* @return {void}
	*/
	onLoadClients: function(data) {


		
		this.list.empty()


		for (var i = 0; i < data.orders.length; i++) {
			this.printOrder(data.orders[i], i)
		}

		if (data.errors.length > 0) {
				this.containerErrors.show('slow')
				this.numErrors.text(data.errors.length)
		} else {
				this.containerErrors.hide()
		}

		this.containerLinks.empty()
		for (var i = 0; i < data.errors.length; i++) {
			this.printError(data.errors[i], i)
		}


			Titan.loader.hide()


	},

	 /*
	* @name printError
	* @description description
	* @return {void}
	*/
	printError: function(error, index) {

		this.containerLinks.appendTitan(`<div class="link">${error.document} - ${error.message}</div>`)
		let order = this.get('#'+error.document)
		order.addClass('error-order')

		order.find('.errors-display').append(`
			<div class="alert alert-danger" role="alert">
			  ${error.message}
			</div>
		`)
	},

	 /**
	 * @name onLinkOrder
	 * @description description
	 * @params data Server response
	 * @return {void} 
	 */
	onLinkOrder: function  (elem, even, index) {
	    console.log(elem.data('doc'))
	},

	/*
	* @name printOrder
	* @description description
	* @return {void}
	*/
	printOrder: function(order, index) {
			
		// console.log(index)
		// console.log(order)

		let productshtml = ''

		order.products = order.products || []

		for (var i = 0; i < order.products.length; i++) {
			let p = order.products[i]

			if (p) {
				productshtml += `
					${p.quantity} -  <b>${parseInt(p.sap_code)}</b> - ${p.aproduct? p.aproduct.Nombre: 'Desconocido'} 
			        <br>
				`
			}

			
		}

		moment.locale('es')
		let day  = moment().format('dddd')

		let hours = moment(order.date +' 15:00', 'YYYY-MM-DD HH:mm').diff(moment(), 'hours')
			// console.log("hours", hours)
			// console.log("day", day)

			// console.log(order.sync_harinera)
			// console.log(order.sync_harinera)
			// WEB20200831TE24306
		this.list.prependTitan(`
			<div class="order row" id="${order.sync_code == '' || !order.sync_code? '': order.sync_code}">

		        <div class="col-md-4">
		          <div class="client-order">
		            <b>Cliente</b>
		            <br>
		            <br>
		            ${order.client.name}
		            <br>
		            <b>${order.client.day}</b>
		            <b>${order.client.city}</b>
		            <br>
		            Código: ${order.client.client_code}
		             <br>
		            <div class="user">Agente: ${order.user.name}</div>
		          </div>
		        </div>
		        <div class="col-md-5">
		          <div class="detail-order">
		            <b>Pedido: ${order.id}</b><br>
		            <b class="price">Valor: $${numberFormatter(order.price)} </b>${ parseInt(order.price) > 50000 && parseInt(order.price) < 150000? '<span class="material-icons warning" title="Pedido mayor a $50.000"> warning </span>': ''} ${ parseInt(order.price) > 150000? `<span class="material-icons error ${parseInt(order.price) > 300000?  'big': ''}" title="Pedido mayor a $${parseInt(order.price) > 300000?  '300': '150'}.000"> error </span>`: ''}

		            <div  class="code">Código: <span>${order.sync_code == '' || !order.sync_code? '': order.sync_code}</span></div>
		            <br>
		            <br>
		            ${productshtml}
		            <br>
		            ${hours > 10 && order.client.day.toLowerCase() != day? `<input type="date" on-change="onChangeDateOrder" data-order="${order.id}" min="${moment().format('YYYY-MM-DD')}"  value="${order.date}" />`: ''}
		          </div>
		        </div>
		        <div class="col-md-3">
		          <div class="delivery-order">
		            <b>Estado</b>
		            <br>
		            <br>
		            
		            <div class="check-container"><div class="check ${order.sync_code == '' || !order.sync_code? 'open': ''}"></div>  Entregado</div>
		            <div class="check-container  ${ (!order.sync_harinera || order.sync_harinera == 0) && (order.sync_code != '' && order.sync_code)? 'warnning': ''}"><div class="check ${ !order.sync_harinera || order.sync_harinera == 0? 'open': ''}"></div>Cargado al SAP</div>
		            

		            <div class="count ${(order.sync_code == '' || !order.sync_code) &&  (!order.sync_harinera || order.sync_harinera == 0)? 'warnning': ''}">${index + 1}</div>



		            <div class="updated">útima actualización: ${moment( order.updated_at ).fromNow()}</div>

		            
		          </div>
		        </div>

		        <div class="col-md-12 errors-display">


		      	</div>
		      </div>

		`)

	},


	 /**
	 * @name onChangeDateOrder
	 * @description description
	 * @params data Server response
	 * @return {void} 
	 */
	onChangeDateOrder: function  (elem, val, event) {
	    
		this.newdate = val
	   swal({
	        title: '¿Estas seguro?',
	        text:
	            `Deseas cambiar la fecha del pedido para el día ${dateFormatter(val)}
	            `,
	        icon: 'question',
	        showCancelButton: true,
	        // cancelButtonColor: '#d33',
	        confirmButtonText: 'Si',
	        cancelButtonText: 'No'
	    },
		(isConfirm)=> {
		  if (isConfirm) {

			WebService.post({ 
				'route': 'leader/changeDateOrder', 
				orderdate: val,
				orderId: elem.attr('data-order'),
			}).done(this.onChangedDateOrder.bind(this))



		    // swal("Deleted!", "Your imaginary file has been deleted.", "success");
		  } 
		})


	},

	 /**
	 * @name onChangedDateOrder
	 * @description description
	 * @params data Server response
	 * @return {void} 
	 */
	onChangedDateOrder: function  (data) {
	    
		
		this.ordersDate.val(this.newdate)
	    this.refresh()

	    toast("La fecha del pedido fue actualizada.");
	},


	 /**
	 * @name filterAll
	 * @description description
	 * @params data Server response
	 * @return {void} 
	 */
	filterAll: function  (data) {
	    this.list.find('.order').show()
	},

 	/**
	 * @name filterAll
	 * @description description
	 * @params data Server response
	 * @return {void} 
	 */
	filterOnlyErrors: function  (data) {
	    this.list.find('.order').hide()
	    this.list.find('.error-order').show()
	    
	},


});