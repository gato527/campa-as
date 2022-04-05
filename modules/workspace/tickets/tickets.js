/*
 * @module  Perfil
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */

 Titan.modules.create({
 	name : 'Tickets',
	/*
	 * @constructor @description inicia los componentes del módulo
	 */
	 ready : function() {

	
	 	this.refresh()
		
		
	},

	/*
	 * @name save
	 * @description description
	 * @return {void}
	 */
	 save: function() {

	 	if (this.priority.val() == '') {
	 		return
	 	}

	 	if (this.description.val() == '') {
	 		return
	 	}
	 	
	 	
		WebService.post({ 
	 		route : 'tickets/save', 
	 		'ticket[priority]': this.priority.val(),
	 		'ticket[description]': this.description.val(),
	 		'ticket[user]': Titan.getUser(),
	 	}).done(this.onCreate.bind(this));

	 	this.priority.val('')
	 	this.description.val('')

	 	this.get('#myModalTickets').modal('hide')


	 },

	 /*
	  * @name onCreate
	  * @description description
	  * @return {void}
	  */
	  onCreate: function() {
	  	swal("Información!", "El ticket se guardó correctamente!", "success");
	 	this.refresh()
	  },


	 /*
	  * @name refresh
	  * @description description
	  * @return {void}
	  */
	  refresh: function() {
	  	
		 WebService.post({ 
		 		route : 'tickets/getAll', 
	 	}).done(this.onRefresh.bind(this));
	  },


	  /*
	   * @name onRefresh
	   * @description description
	   * @return {void}
	   */
	   onRefresh: function(data) {

	   		let counter = {
	   			'1': 0,
	   			'2': 0,
	   			'3': 0,
	   			'0': 0,
	   		}

	   		this.panel_0.html('')
	   		this.panel_1.html('')
	   		this.panel_2.html('')
	   		this.panel_3.html('')


	   		for (var i = 0; i < data.tickets.length; i++) {
	   			let t = data.tickets[i]
	  			


	  			this['panel_' + t.priority].append(`
	  				<div class="sticky taped" >
	  					<small>${dateFormatter(t.date_report)}</small>
	  					<br>
	  					<br>
						<p>
							${t.description}
						</p>

						<label>Att: -- ${t.user.name}</label>
					</div>


	  			`)

	  			counter[t.priority] += 1

	   		}

	   		this.count_0.text(counter['0'])
	   		this.count_1.text(counter['1'])
	   		this.count_2.text(counter['2'])
	   		this.count_3.text(counter['3'])
	   	
	   },

});