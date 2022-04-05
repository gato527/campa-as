/*
 * @module  Backup
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */
 Titan.modules.create({

 	name: 'Template',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	 ready: function () {
		//init components
		this.getContainer().removeClass('module-container')
		
        if (this.params.question) {
        	this.loadQuestion(this.params.question)
        }

	},

	/*
	 * @name initEvents
	 * @description inicia los eventos de los componentes del módulo
	 * @return {void}
	 */
	 initEvents: function () {

	 },

	
	


	 /*
	  * @name onAddAnswer
	  * @description description
	  * @return {void}
	  */
	  onAddAnswer: function() {

	  	let html =  `
	  	<div class="form-group">
			<div class="radio ">
				<label> <input type="radio" name="radio-name"> <span contenteditable class="answer">un año muy largo</span></label><i on-click="onRemoveAnswer" class="material-icons pull-right"> close </i>
			</div>
		</div>`

		this.form.appendTitan(html)
	  	
	 	
	  },

	  /*
	  * @name onAddAnswer
	  * @description description
	  * @return {void}
	  */
	  loadAnswer: function(answer) {

	  	let html =  `
	  	<div class="form-group">
			<div class="radio ">
				<label> <input type="radio" name="radio-name"> <span contenteditable class="answer">${answer}</span></label><i on-click="onRemoveAnswer" class="material-icons pull-right"> close </i>
			</div>
		</div>`

		this.form.appendTitan(html)
	  	
	 	
	  },


	  /*
	   * @name onRemoveAnswer
	   * @description description
	   * @return {void}
	   */
	   onRemoveAnswer: function(element) {
	   	
	  		element.parent().parent().remove()
	   },

	    /**
	    * @name getJson
	    * @description description
	    * @return {void} 
	    */
	    getJson: function  () {


	    	let answers = this.get('.answer')
	    	let answersArr = []
	    	for (var i = 0; i < answers.length; i++) {
	    		answersArr.push($(answers[i]).text())
	    	}

	    	return {
	    		mode: this.params.question? 'edit': 'create',
	    		type: this.name.toLowerCase(),
	    		title: this.title.text(),
	    		answers: answersArr,
	    	}
	       
	    },


	     /**
	     * @name toString
	     * @description description
	     * @return {void} 
	     */
	     toString: function  () {
	        JSON.stringify(this.getJson())
	     },

	      /**
	      * @name loadQuestion
	      * @description description
	      * @return {void} 
	      */
	      loadQuestion: function  (question) {
	        this.title.text(question.title)
	        this.form.empty()
			for (var i = 0; i < question.answers.length; i++) {
	    		this.loadAnswer(question.answers[i])
	    	}

	      },

	
});