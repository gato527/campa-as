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


	},


	 /*
	  * @name load
	  * @description description
	  * @return {void}
	  */
	  load: function() {
		WebService.post({ 'route': 'leader/getAllCities' }).done(this.refresh.bind(this));
	 
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
		     			total: city.total,
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
	    		<tr><td>${city.id}</td><td>${city.city}</td></tr>

	    	`)

	  		this.citiesTable.appendTitan(html)
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
	     	let days = this.daysTable.find('tr input:checked')
	     	
	     	let arrayDays = []
	     	let arraySql = []
	     	for (var i = 0; i < days.length; i++) {
	     		let ckeck = $(days[i])
	     		arrayDays.push( ckeck.attr('data-day') )
	     		arraySql.push( `day LIKE "%${ckeck.attr('data-day')}%"` )
	     	}

	     	console.log('arraySql', arraySql.join(' OR '))
	     	console.log('arrayDays', arrayDays.join(', '))

			WebService.post({ 'route': 'leader/saveDistributeDay', sql: arraySql.join(' OR '), days:  arrayDays.join(', ')}).done(this.onSaveDays.bind(this));

	    
	     },

	     /*
	      * @name onSaveDays
	      * @description description
	      * @return {void}
	      */
	      onSaveDays: function() {
	      	
				WebService.post({ 'route': 'leader/getAllCities' }).done(this.refreshCities.bind(this));
	     
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
	    		<tr><td>${city.distribute}</td><td>${city.city}</td></tr>

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

	     	let distributeArray  = []

			for (var i = 0; i < this.cities.length; i++) {
	     		let city  = this.cities[i]

	     		let count = city.id // calls by city per day

	     		let countByCity =  Math.ceil(count/countManagers)

	     		let data = {
	     			city: city.city,
	     			total: city.id,
	     			distribute: countByCity,
	     		}
	     		distributeArray.push(data)

	     		this.printCityResult(data)

	     	}


			WebService.post({ 'route': 'leader/saveDistribute', managers: managersArray, cities:  distributeArray}).done(this.onSaveDistribute.bind(this));

	     	

	    
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
	

});