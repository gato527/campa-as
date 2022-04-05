/*
 * @module  InfoDebtor
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */
 Titan.modules.create({

 	name: 'Sms_count',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	 ready: function () {

		//init components

		this.loadGraphics()

	},



	/*
	 * @name initEvents
	 * @description inicia los eventos de los componentes del módulo
	 * @return {void}
	 */
	 initEvents: function () {
	 },

	/*
     * @name loadGraphics
     * @description description
     * @return {void}
     */
     loadGraphics: function() {
     	WebService.post({
	 		route: 'sms/graphicsMonth'
	 	}).done(this.onloadedGraphics.bind(this));
    
     },


     /*
      * @name onloadedGraphics
      * @description description
      * @return {void}
      */
      onloadedGraphics: function(data) {

	      let {rows} = data

	      let x = ['x']
	      let data1 = ['SMS']

	      let days = {}
	      let groups = []

	      let total = 0
	      for (var i = 0; i < rows.length; i++) {
	      	// x.push(rows[i].DATE)

	      	if (!days[rows[i].DATE]) {
	      		days[rows[i].DATE] = [rows[i].DATE, rows[i].totalCount]
	      		groups.push(rows[i].DATE)
	      	} else {
	      		days[rows[i].DATE].push(rows[i].totalCount)
	      	}

	      	// data1.push(rows[i].totalCount)
	      	total += rows[i].totalCount
	      }

	      this.total.text(total)

	      let values = Object.values(days)

	      
			var chart = c3.generate({
		   		bindto: '#chart-sms',
			    data: {
			        // x: 'x',
			       // xFormat: '%B %d, %Y', // 'xFormat' can be used as custom format of 'x'
			        columns: values,
			        type: 'bar',
			        // groups: [
			        //     groups
			        // ]
			    },

			});


      	
      },


       /**
       * @name onGenerate
       * @description description
       * @params data Server response
       * @return {void} 
       */
       onGenerate: function  (data) {

          	WebService.post({
		 		route: 'sms/graphicsByMonth',
		 		dateInit: this.dateInit.val(),
		 		dateEnd: this.dateEnd.val(),
		 	}).done(this.onloadedGraphics.bind(this));
       },

});