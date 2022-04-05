/*
 * @module  Backup
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */
 Titan.modules.create({

 	name: 'Addquestion',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	 ready: function () {
		//init components
		
	},

	/*
	 * @name initEvents
	 * @description inicia los eventos de los componentes del módulo
	 * @return {void}
	 */
	 initEvents: function () {

	 },



	 /*
	  * @name onAddQuestion
	  * @description description
	  * @return {void}
	  */
	  onAddQuestion: function(element) {
	  	
	  	let view = element.attr('data-view');
		Titan.view( 'questions', view, 'containerQuestion', {});

		this.typeQuestion = view
		this.addQuestionModal.modal('show')
	 
	  },

	   /**
	   * @name editQuestion
	   * @description description
	   * @return {void} 
	   */
	   editQuestion: function  (question) {

			this.typeQuestion = question.type
		   	Titan.view( 'questions', question.type, 'containerQuestion', {question: question});
			this.addQuestionModal.modal('show')
	        
	   },


	   /**
	   * @name addQuestionDesigner
	   * @description description
	   * @params data Server response
	   * @return {void} 
	   */
	   addQuestionDesigner: function  () {
	      let question = Titan.app.questions[this.typeQuestion].getJson()


	      this.save(question)


	   },


	    /**
	  * save poll
	  * @return {void} 
	  */
	 save: function (question) {
	 
	 	WebService.post({route: 'poll/savePoll', question: question }).done((response) => {

	 		if (response.StatusResult == 'OK') {
	      		Titan.app.encuestas.designer.refresh()

	 		} else{
	 			Titan.popup.info('faliure');
	 		}
	 	});

	 },

	
});