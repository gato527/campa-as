/*
 * @module  index
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */
Titan.modules.create({
	name: 'index',
	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components
        this.inputFecha[0].valueAsDate = new Date();


        this.today = moment().format('YYYY-MM-DD')

		this.managers = {};
		this.containerItemActivity = this.get('#listActivityUser');
		WebService.post({ 'route': 'monitoring/getAllManagers/'+ this.today    }).done(this.getAllManagers.bind(this));

	},

	 /**
	 * @name onchangeDay
	 * @description description
	 * @params data Server response
	 * @return {void}
	 */
	onchangeDay: function  (elem, val) {
	    this.today = val
		WebService.post({ 'route': 'monitoring/getAllManagers/'+ this.today   }).done(this.getAllManagers.bind(this));

	},

	 /**
	 * @name getAllManagers
	 * @description description
	 * @params data Server response
	 * @return {void}
	 */
	getAllManagers: function  (data) {

	  	data.managers = data.managers.sort((a, b) => b.name - a.name);

	  	this.managetList.empty()
	    for (var i = 0; i < data.managers.length; i++) {
	    	let manager = data.managers[i]

	    	this.printManager(manager , i)
	    }

	    this.get('.manager').first().click()





	},


	 /**
	 * @name printManager
	 * @description description
	 * @params data Server response
	 * @return {void}
	 */
	printManager: function  (manager , i) {

		let causales = [
			"PEDIDO",
			"PEDIDO PQR",
		 	"PQR",
		 	"VOLVER A LLAMAR",
		 	"PEDIDO CON VENDEDOR",
		 	"COMPRA OTRA MARCA"
		]


		manager.clients = manager.clients || []
		manager.calls = manager.calls || []
		this.managers[manager.id] = manager

		let efectivos = manager.clients.filter(client => client.causal.trim() == "PEDIDO"  || client.causal.trim() == "PEDIDO PQR"  || client.causal.trim() == "PQR"  || client.causal.trim() == "VOLVER A LLAMAR"  ||  client.causal.trim() == "PEDIDO CON VENDEDOR"  || client.causal.trim() == "COMPRA OTRA MARCA")
		let noefectivos = manager.clients.filter(client => client.causal.trim() != "PEDIDO"  && client.causal.trim() != "PEDIDO PQR"  && client.causal.trim() != "PQR"  && client.causal.trim() != "VOLVER A LLAMAR"  &&  client.causal.trim() != "PEDIDO CON VENDEDOR"  && client.causal.trim() != "COMPRA OTRA MARCA")

		if (manager.clients.length) {

	    	let urlImage = `img/uploads/users/${manager.id}.png?${new Date().getTime()}`


		    this.managetList.appendTitan(`

		    	<li class="manager" on-click="onClickManager" data-index="${manager.id}">
					<label>${manager.name.toName()}</label>

					<!-- image and name -->
					<div class="photo">
						<img class="profile-photo" src="${urlImage}" onError='ImgErrorVideo(this);'>
					</div>

					<!-- efectivos  -->
					<div class="clients">
						<div title="Clientes asignados" class="ind all">
							<i class="material-icons"> supervised_user_circle </i>
							${manager.clients.length}
						</div>
						<div title="Clientes efectivos" class="ind efectivos">
							<i class="material-icons"> star </i>
							${efectivos.length}
						</div>
						<div title="Clientes no efectivos" class="ind noefectivos">
							<i class="material-icons"> star_border </i>
							${noefectivos.length}
						</div>
					</div>

				</li>

		    `)
		}
	},


	 /**
	 * @name onClickManager
	 * @description description
	 * @params data Server response
	 * @return {void}
	 */
	onClickManager: function  (elem, even, index) {
	    let manager = this.managers[index]

	    this.name.text(manager.name.toName())
	    let urlImage = `img/uploads/users/${index}.png?${new Date().getTime()}`
	    this.photo.attr('src', urlImage);


	    this.get('.manager').removeClass('active')
	    elem.addClass('active')

	    console.log('manager', manager)


	    this.panelDetails.hide('fade').show('fade');

	    this.printManagerDetails(manager)

			/*Obtiene la información del login_log-*/
			var html = '';
			var itemDate;
			this.timeActivity = {'0':moment.duration(0), '1':moment.duration(0)};
			var currentState;
			if(manager.loginLog.length > 0){
				html += '<div class="container-list-activity">';
				var calcDate = moment(manager.loginLog[0].hour, 'HH:mm:ss');
				currentState = manager.loginLog[0].state;
				for(var i = 0, len = manager.loginLog.length; i < len; i++){
					itemDate = moment(manager.loginLog[i].hour, 'HH:mm:ss');
					if(currentState !== manager.loginLog[i].state){
						this.timeActivity[currentState].add(moment.duration(calcDate.diff(itemDate)));
					currentState = manager.loginLog[i].state;
						calcDate = itemDate;
					}
					html += '<li class="item-causal"><span class="numb">' + itemDate.format('hh:mm:ss') + '<small>' + itemDate.format('a') + '</small></span>' + ((manager.loginLog[i].state === '1')?'Inicio de sesión':'Inactividad') + '</li>';
				}
				html += '</div>';
				var hoursActivity = Math.abs(this.timeActivity[1].hours());
				hoursActivity = ((hoursActivity < 10)? '0'+ hoursActivity: hoursActivity);
				var minutesActivity = Math.abs(this.timeActivity[1].minutes());
				minutesActivity = ((minutesActivity < 10)? '0'+ minutesActivity: minutesActivity);
				var secondsActivity = Math.abs(this.timeActivity[1].seconds());
				secondsActivity = ((secondsActivity < 10)? '0'+ secondsActivity: secondsActivity);

				var hoursInactivity = Math.abs(this.timeActivity[0].hours());
				hoursInactivity = ((hoursInactivity < 10)? '0'+ hoursInactivity: hoursInactivity);
				var minutesInactivity = Math.abs(this.timeActivity[0].minutes());
				minutesInactivity = ((minutesInactivity < 10)? '0'+ minutesInactivity: minutesInactivity);
				var secondsInactivity = Math.abs(this.timeActivity[0].seconds());
				secondsInactivity = ((secondsInactivity < 10)? '0'+ secondsInactivity: secondsInactivity);

				html += '<li class="divider"></li><li class="item-causal"><span class="numb">' + hoursActivity + ':' + minutesActivity + ':' + secondsActivity + '</span> Tiempo laborado</li>';
				html += '<li class="divider"></li><li class="item-causal"><span class="numb">' + hoursInactivity + ':' + minutesInactivity + ':' + secondsInactivity + '</span> Tiempo inactivo</li>';

			}
			this.containerItemActivity.html(html);

			/*-Obtiene la información del login_log-*/


	},


	 /**
	 * @name printManagerDetails
	 * @description description
	 * @params data Server response
	 * @return {void}
	 */
	printManagerDetails: function  (manager) {

		let totalAtendidosHoy = 0

		let efectivos = manager.clients.filter(client => client.causal.trim() == "PEDIDO"  || client.causal.trim() == "PEDIDO PQR"  || client.causal.trim() == "PQR"  || client.causal.trim() == "VOLVER A LLAMAR"  ||  client.causal.trim() == "PEDIDO CON VENDEDOR"  || client.causal.trim() == "COMPRA OTRA MARCA")
		let noefectivos = manager.clients.filter(client => client.causal.trim() != "PEDIDO"  && client.causal.trim() != "PEDIDO PQR"  && client.causal.trim() != "PQR"  && client.causal.trim() != "VOLVER A LLAMAR"  &&  client.causal.trim() != "PEDIDO CON VENDEDOR"  && client.causal.trim() != "COMPRA OTRA MARCA")

		let clientsByCausalArr = {}

		for (var i = 0; i < manager.clients.length; i++) {
			let c = manager.clients[i]

			c.causal = c.causal.trim() == '' ? 'Sin Causal' : c.causal.trim()

			if (!clientsByCausalArr[c.causal.trim()] ) {
				clientsByCausalArr[c.causal.trim()] = []
			}
			clientsByCausalArr[c.causal.trim()].push(c)
		}

		let callsToday = {}
		for (var i = 0; i < manager.calls.length; i++) {
			let c = manager.calls[i]
			callsToday[c.client] = c
		}



		let keys = Object.keys(clientsByCausalArr)
		keys = keys.sort()

		this.listCausales.empty()
		this.listCausalesOpe.empty()


		for (var i = 0; i < keys.length; i++) {
			let clients = clientsByCausalArr[keys[i]]

			let clientsToday = clients.filter(client => callsToday[client.id]  )


			totalAtendidosHoy += clientsToday.length;
			this.listCausales.append(`
				<li class="item-causal"> <span class="numb">${clients.length}</span> ${keys[i]} <i class="material-icons"> star </i></li>
			`)

			let porcentaje = parseInt(regla_de_tres( clients.length, clientsToday.length))



			this.listCausalesOpe.append(`
				<li class="item-causal">
					<span class="numb numb-large">${clientsToday.length} <small>/${clients.length}</small></span> ${keys[i]} <i class="material-icons"> star </i>

					<!-- progress bar -->
					<span class="progress-num">${porcentaje}%</span>
					<div class="progress">
					  <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="${porcentaje}" aria-valuemin="0" aria-valuemax="100" style="width: ${porcentaje}%">

					  </div>
					</div>

				</li>
			`)

		}

		this.listCausales.append(`
			<li class="divider"></li>
			<li class="item-causal"> <span class="numb" >${manager.clients.length}</span> Total asignado </li>
		`)


		// totalInd
		this.totalInd.html(`${totalAtendidosHoy}<small>/${manager.clients.length}</small>`)
		let avance = parseFloat(regla_de_tres( manager.clients.length, totalAtendidosHoy)).toFixed(2)

		avance = isNaN(avance)? 0: avance;

		this.porAvanceContainer.html(`
			<h1>${avance}%</h1>
			<!-- progress bar -->
			<div class="progress">
			  <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="${avance}" aria-valuemin="0" aria-valuemax="100" style="width: ${avance}%">
			  </div>
			</div>

		`)

		// pedidos
		this.vPedidos.html(`${manager.pedidos.length}<small>/${manager.clients.length}</small>`)


		let avancePedidos = parseFloat(regla_de_tres( manager.clients.length, manager.pedidos.length)).toFixed(2)
		avancePedidos = isNaN(avancePedidos)? 0: avancePedidos;


		this.porPedidosContainer.html(`
			<h1 class="mini">${avancePedidos}%</h1>
			<!-- progress bar -->
			<div class="progress">
			  <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="${avancePedidos}" aria-valuemin="0" aria-valuemax="100" style="width: ${avancePedidos}%">
			  </div>
			</div>

		`)















	},

});
