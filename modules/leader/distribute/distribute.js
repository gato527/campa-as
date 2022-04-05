/*
 * @module  index
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */
Titan.modules.create({
	name: 'Distribute',
	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components
			

		this.info.hide()
		this.result.hide()
		this.containerCity.hide()

		this.load()

	  	this.distributeArray = []

	},


	 /*
	  * @name load
	  * @description description
	  * @return {void}
	  */
	  load: function() {
		WebService.post({ 'route': 'distribute/getAllCities' }).done(this.refresh.bind(this));
	 
	  },

	  /*
	   * @name refresh
	   * @description description
	   * @return {void}
	   */
	   refresh: function(data) {
	   	
	  		// this.citiesTable.empty()
	  		// this.cities = data.cities || []

	  		// this.nameDay.text(data.day)

	  		// for (var i = 0; i < this.cities.length; i++) {
	  		// 	let city = data.cities[i]
	  		// 	this.printCity(city, i)
	  		// }


	  		this.managersTable.empty()
	  		this.managers = data.managers

	  		for (var i = 0; i < this.managers.length; i++) {
	  			let manager = data.managers[i]
	  			this.printManager(manager, i)
	  		}


	  		if (data.calls) {
	  			this.btnDistribute.remove()

	  			this.citiesTableResult.empty()

	  			for (var i = 0; i < data.calls.length; i++) {
		     		let city  = data.calls[i]

		     		let info = {
		     			city: city.city,
		     			day: city.day,
		     			distribute: city.quantity,
		     		}


		     		this.printCityResult(info)
		     	}

		     	for (var i = 0; i < this.managers.length; i++) {
		  			let manager = data.managers[i]
		  			if (manager.turn != '-1') {
		  				this.managersTable.find('#manager' + manager.id).click()
		  			}
		  		}




	  			this.info.show()
				this.result.show()

				this.containerDays.hide()

	  		}

	  		let days = [
	  		 "DOMINGO",
			 "LUNES",
			 "MARTES",
			 "MIERCOLES",
			 "JUEVES",
			 "VIERNES",
			 "SABADO"
			]

	  		this.daysTable.empty()
	  		
	  		for (var i = 0; i < days.length; i++) {
	  			let day = days[i]
	  			this.printDay(day, i)
	  		}


	   },

	   	  /*
	   * @name refresh
	   * @description description
	   * @return {void}
	   */
	   refreshCities: function(data) {
			this.containerCity.show()
	   		
	  		this.citiesTable.empty()
	  		this.cities = data.cities || []		


	  		let total = 0 

	  		for (var i = 0; i < this.cities.length; i++) {
	  			let city = data.cities[i]
	  			this.printCity(city, i)

	  			total += parseInt(city.id)
	  		}

	  		this.nameDay.text(numberFormatter(total))

	   },


	   /*
	    * @name printCity
	    * @description description
	    * @return {void}
	    */
	    printCity: function(city, index) {
	    	let html = $(`
	    		<tr>
	    			<td>${city.id}</td><td><div class="checkbox checkbox-success"><input on-change="changeCities" data-city="${city.city}" type="checkbox"><label>${city.city}</label></div></td>
				</tr>
	    	`)

	  		this.citiesTable.appendTitan(html)
	    },


	    /*
	     * @name changeCities
	     * @description description
	     * @return {void}
	     */
	     changeCities: function() {
	     	
	     	let cities = this.citiesTable.find('tr input:checked')
	     	
	     	let arraycities = []
	     	let arraySql = []

	     	for (var i = 0; i < cities.length; i++) {
	     		let ckeck = $(cities[i])
	     		arraycities.push( ckeck.attr('data-city') )
	     		arraySql.push( `city LIKE "%${ckeck.attr('data-city')}%"` )
	     	}

	     	// console.log('arraySql', arraySql.join(' OR '))
	     	// console.log('arraycities', arraycities.join(', '))
	     	this.arraycities = arraycities.join(', ')
	     	this.citiesql = arraySql.join(' OR ')
	    
	     },


	     /*
	      * @name addCalls
	      * @description description
	      * @return {void}
	      */
	      addCalls: function() {
	      	let html = $(`
	    		<tr>
	    			<td>${this.daySelected}</td>
	    			<td>${this.arraycities}</td>
				</tr>

	    	`)
	  		this.distributeTable.appendTitan(html)

	  		this.distributeArray.push({
	  			day: this.daySelected,
	  			cities: this.arraycities,
	  			sql: this.citiesql,
	  		})

	      },


	    /*
	    * @name printDay
	    * @description description
	    * @return {void}
	    */
	    printDay: function(day, index) {
	    	let html = $(`
	    		<tr>
	    			<td><div class="checkbox checkbox-success"><input on-change="changeDays" data-day="${day}" type="checkbox"><label><div class="fugue fugue-user"></div>${day}</label></div></td>
				</tr>

	    	`)

	  		this.daysTable.appendTitan(html)
	    },

	    /*
	     * @name changeDays
	     * @description description
	     * @return {void}
	     */
	     changeDays: function(elemen) {
	     	if (elemen.val()== 'on') {

		     	let day = elemen.parent().text()
		     	this.daysTable.find('tr input:checked').removeProp('checked')
		     	elemen.prop('checked', true)

		     	console.log('day', day)
		     	//let days = this.daysTable.find('tr input:checked')
		     	let days = [day]
		     	
		     	let arrayDays = []
		     	let arraySql = []
		     	for (var i = 0; i < days.length; i++) {
		     		arrayDays.push( days[i] )
		     		arraySql.push( `day LIKE "%${days[i]}%"` )
		     	}

		     	console.log('arraySql', arraySql.join(' OR '))
		     	console.log('arrayDays', arrayDays.join(', '))

		     	this.daySelected = day

				WebService.post({ 'route': 'distribute/saveDistributeDay', sql: arraySql.join(' OR '), days:  arrayDays.join(', ')}).done(this.onSaveDays.bind(this));
			}
	    
	     },

	     /*
	      * @name onSaveDays
	      * @description description
	      * @return {void}
	      */
	      onSaveDays: function() {
	      	
			WebService.post({ 'route': 'distribute/getAllCities' }).done(this.refreshCities.bind(this));
	     
	      },

	    /*
	    * @name printManager
	    * @description description
	    * @return {void}
	    */
	    printManager: function(manager, index) {
	    	let html = $(`
	    		<tr>
	    			<td>${manager.id}</td>
	    			<td><div class="checkbox checkbox-success"><input id="manager${manager.id}" type="checkbox"><label><div class="fugue fugue-user"></div>${manager.name}</label></div></td>
				</tr>

	    	`)

	  		this.managersTable.appendTitan(html)
	    },


	    /*
	    * @name printCityResult
	    * @description description
	    * @return {void}
	    */
	    printCityResult: function(city, index) {
	    	let html = $(`
	    		<tr><td>${city.day}</td><td>${city.city}</td></tr>

	    	`)

	  		this.citiesTableResult.appendTitan(html)
	    },


	    /*
	     * @name distributeCalls
	     * @description description
	     * @return {void}
	     */
	     distributeCalls: function() {

	  		this.citiesTableResult.empty()



			// http://stackoverflow.com/questions/962802#962890
			function shuffle(array) {
			  var tmp, current, top = array.length;
			  if(top) while(--top) {
			    current = Math.floor(Math.random() * (top + 1));
			    tmp = array[current];
			    array[current] = array[top];
			    array[top] = tmp;
			  }
			  return array;
			}


	     	
	     	let managers = this.managersTable.find('tr input:checked')
	     	let managersArray = []
	     	
	     	for (var turns = [], i = 0; i < managers.length; ++i) {
	     		turns[i] = i
	     	}

			turns = shuffle(turns)
	     	
	     	for (var i = 0; i < managers.length; i++) {
	     		let m  = $(managers[i])

	     		let managerId = m.parent().parent().parent().find('td').first().text()
	     		managersArray.push({manager: managerId, turn: turns[i]})
	     	};


	     	if (managersArray.length <= 0) {
	     		Titan.popup.warning('Seleccione el ó los agentes antes de distribuir.', 6000)
	     		return
	     	}


	     	let countManagers = managersArray.length

	     	//let distributeArray  = []

			// for (var i = 0; i < this.cities.length; i++) {
	  //    		let city  = this.cities[i]

	  //    		let count = city.id // calls by city per day

	  //    		let countByCity =  Math.ceil(count/countManagers)

	  //    		let data = {
	  //    			city: city.city,
	  //    			total: city.id,
	  //    			distribute: countByCity,
	  //    		}
	  //    		distributeArray.push(data)

	  //    		this.printCityResult(data)

	  //    	}

	     	

	     	//console.log(this.distributeArray)
			//WebService.post({ 'route': 'distribute/saveDistribute', managers: managersArray, cities:  distributeArray}).done(this.onSaveDistribute.bind(this));
			WebService.post({ 
				route: 'distribute/saveDistribute', 
				managers: managersArray, 
				cities:  this.distributeArray
			}).done(this.onSaveDistribute.bind(this));

	     	

	    
	     },


	     /*
	      * @name onSaveDistribute
	      * @description description
	      * @return {void}
	      */
	      onSaveDistribute: function() {
	      		
				this.info.show()
				this.result.show()
	  			this.btnDistribute.remove()
	     	
	      },

	        /**
	    * @name clearCalls
	    * @description description
	    * @params data Server response
	    * @return {void} 
	    */
	    clearCalls: function  (data) {

	    	Titan.message.confirmation('Confirmación', '¿Desea cancelar la distribución de clientes actual?', (result)=>{
	    			
					WebService.post({ 'route': 'distribute/clearDistribute' }).done(()=>{
						Titan.message.info('información','La distribución de clientes actual se eliminó, presiona en "Repartir llamadas" en el menú.')
					});

	   		},this, "Aceptar", "Cancelar")
	       
	    },
	

});