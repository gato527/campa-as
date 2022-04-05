/*
 * @module  InfoDebtor
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */
 Titan.modules.create({

 	name: 'Sms_statistics',

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
	 		route: 'sms/graphics'
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

	      let total = 0
	      for (var i = 0; i < rows.length; i++) {
	      	x.push(rows[i].DATE)
	      	data1.push(rows[i].totalCount)
	      	total += rows[i].totalCount
	      }

	      this.total.text(total)


			var chart = c3.generate({
		   		bindto: '#chart-sms',
			    data: {
			        x: 'x',
			       // xFormat: '%B %d, %Y', // 'xFormat' can be used as custom format of 'x'
			        columns: [x, data1]
			    },
			    axis: {
			        x: {
			            type: 'timeseries',
			            tick: {
			                format: '%B %d, %Y'
			            },
			    		data_xLocaltime: true
			        }
			    },
			});


      	
      },

});