/*
 * @module  Backup
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */
 Titan.modules.create({

 	name: 'Designer',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	 ready: function () {
		//init components
		
		
		this.addContextMenuMiniPage()
		Titan.view( 'encuestas', 'addquestion', 'containerListQuestion', {});


    	this.get('.question-container').sortable({
	 		connectWith: ".question-container",
 			stop: this.stopDragApp.bind(this),
 			placeholder: "portlet-placeholder",
	 	});

	 	this.pageSelected = 1
	 	this.refresh()
	},


	/**
	  * refresh poll
	  * @return {void} 
	  */
	 refresh: function (question) {

	 	

	 	WebService.post({route: 'poll/allPoll' }).done((response) => {

	 		if (response.StatusResult == 'OK') {

			 	this.pageContainer.empty()
	 			for (var i = response.polls.length - 1; i >= 0; i--) {
	 				
	      			this.addQuestion(response.polls[i], response.poll)
	 			}

	 			this.get("#poll-" + response.selected ).find('.btn-check').addClass('btn-success')

	 		} else{
	 			Titan.popup.info('faliure');
	 		}
	 	});

	 },


	 /**
	 * @name addContextMenuMiniPage
	 * @description description
	 * @return {void} 
	 */
	 addContextMenuMiniPage: function  () {
	      let miniPages = this.get('.mini-page')

	
	 },

	  /**
	  * @name deletePage
	  * @description description
	  * @return {void} 
	  */
	  deletePage: function  (index) {
	    this.pageSelected = index
	  	Titan.message.confirmation('Eliminar página', '<br/><br/> ¿Deseas eliminar la pregunta?', this.onDelete, this, 'Aceptar', 'Cancelar')


	  },


	 /**
	 * @name stopDragApp
	 * @description description
	 * @params data Server response
	 * @return {void} 
	 */
	 stopDragApp: function  (data) {
	    
	   this.refresCounterQuestions()


	 },

	  /**
	  * @name onRemoveQuestion
	  * @description description
	  * @params data Server response
	  * @return {void} 
	  */
	  onRemoveQuestion: function  (element) {
	    this.selectedQuestion = element.parent().parent()
	  	Titan.message.confirmation('Eliminar pregunta', this.selectedQuestion.find('p').text() + '<br/><br/> ¿Deseas eliminar la pregunta?', this.onDelete, this, 'Aceptar', 'Cancelar')

	  },

	   /**
	   * @name onDelete
	   * @description description
	   * @params data Server response
	   * @return {void} 
	   */
	   onDelete: function  () {
	      	this.selectedQuestion.remove()
	   		this.refresCounterQuestions()
			Titan.popup.info('La pregunta fue eliminada exitosamente.')

	   },


	  /**
	  * @name refresCounterQuestions
	  * @description description
	  * @params data Server response
	  * @return {void} 
	  */
	  refresCounterQuestions: function  () {
	    let questions = this.get('#pages .question')

	    for (var i = 0; i < questions.length; i++) {
	    	let question = $(questions[i])
	    	question.find('.index-question').text(i+1)
	    }

	  },


	 /**
	 * @name onClickPage
	 * @description description
	 * @params data Server response
	 * @return {void} 
	 */
	 onClickPage: function  (element) {
	    this.get('.page').removeClass('active')
	    element.addClass('active')
	    this.get('.mini-page').removeClass('active')

 		let index = element.attr('data-index')
	    let minipage  = this.get('.mini-page[data-index="'+index+'"]')
	    minipage.addClass('active')
	    this.minimap.animate({scrollTop: minipage.offset().top  }, 'slow');
	    this.pageSelected = index

	 },


	 /**
	 * @name onClickMiniPage
	 * @description description
	 * @params data Server response
	 * @return {void} 
	 */
	 onClickMiniPage: function  (element) {
	    this.get('.mini-page').removeClass('active')
	    element.addClass('active')
	    this.get('.page').removeClass('active')

	    let index = element.attr('data-index')
	    let page  = this.get('.page[data-index="'+index+'"]')
	    page.addClass('active')

	    console.log(index, this.pages.scrollTop())
	    console.log(index, page.position().top)
	    this.pages.animate({scrollTop: this.pages.scrollTop() + page.position().top  }, 'slow');

	    this.pageSelected = index
	 },

	 

	/*
	 * @name addQuestion
	 * @description description
	 * @return {void}
	 */
	 addQuestion: function(question) {
	 	let html = `<div id="poll-${question.id}" class="question" data-json="${Base64.encode(JSON.stringify(question))}"  >
					<span class="index-question"></span> 
					<p>${question.title}</p>
					<div class="tools">
						<!--<button type="button" class="btn btn-flat" on-click="onEditQuestion">
							<i class="material-icons">edit</i>
						</button>
						<button type="button" class="btn btn-flat" on-click="onRemoveQuestion">
							<i class="material-icons">close</i>
						</button>-->
						<button type="button" class="btn btn-check btn-flat " on-click="onSelectDefaultQuestion" data-index="${question.id}">
							<i class="material-icons">check</i>
						</button>
					</div>
				</div>`;

	    this.get('.page').removeClass('active')
		let page  = this.get('.page[data-index="'+this.pageSelected+'"]')
	    page.addClass('active')

	    if (question.mode == 'edit') {
	    	this.selectedQuestion.replaceWithTitan(html, this)
	    } else {
	    	this.pageContainer.appendTitan(html, this)
	    }


	   	this.refresCounterQuestions()


	 },

	


	 /*
	  * @name closeList
	  * @description description
	  * @return {void}
	  */
	  closeList: function() {
	  	
	  },

	/*
	 * @name initEvents
	 * @description inicia los eventos de los componentes del módulo
	 * @return {void}
	 */
	 initEvents: function () {
	 },

	 createBackup: function () {
	 
	 	var r = WebService.post({route: 'security/backup' });

	 	r.done(function  (response) {
	 		if (response.StatusResult == 'OK') {
	 		} else{
	 			Titan.popup.info('faliure');
	 		}
	 	}.bind(this));

	 },


	  /**
	  * @name onEditQuestion
	  * @description description
	  * @return {void} 
	  */
	  onEditQuestion: function  (element) {
	     this.selectedQuestion = element.parent().parent()
	     let question = Base64.decode(this.selectedQuestion.attr('data-json'));
	     Titan.app.encuestas.addquestion.editQuestion(JSON.parse(question))
	  },



	  /**
	  * @name onSelectDefaultQuestion
	  * @description description
	  * @return {void} 
	  */
	  onSelectDefaultQuestion: function  (element, event , index) {
	  	
	  	this.get('.btn-check').removeClass('btn-success')
	  	element.addClass('btn-success')
		WebService.post({ 'route': 'configuracion/save', settings: [{ keydata: 'poll-selected', value: index }] }).done(this.onSaveSettings.bind(this));

	  },

	   /**
	   * @name onSaveSettings
	   * @description description
	   * @params data Server response
	   * @return {void} 
	   */
	  onSaveSettings: function  (data) {
	  	if(data.StatusResult){
			if (data.StatusResult == "FALIURE") {
				Titan.popup.info('no hay cambios que guardar');
			} else {
				Titan.popup.success('Las configuraciones se guardaron exitosamente!');
			}
		} else {
			Titan.popup.danger('Error al guardar los datos');
		}
	  },




	   /**
	   * @name onAddPage
	   * @description description
	   * @return {void} 
	   */
	   onAddPage: function  () {
	   		let index = this.pages.find('.page').length
	        this.insertPage(index, 'after')
	   },


	  /**
	  * @name insertPage
	  * @description description
	  * @return {void} 
	  */
	  insertPage: function  (indexCurrent, location) {

	  		let page  = this.get('.page[data-index="'+indexCurrent+'"]')

	        let html = `<div data-index="3" class="page" on-click="onClickPage">
				<p class="index-page">Página 3</p>
				<div class="question-container">
				pagina insertada
				</div>
			</div>`

			this.miniPages.appendTitan(`
				<div  data-index="1" class="mini-page" on-click="onClickMiniPage">
					1
				</div>
				`)



			if (location == 'before'){
				page.beforeTitan(html)
			}

			if (location == 'after'){
				page.afterTitan(html)
			}
			
			this.refresCounterPages()
			this.refresSorterPages()
			this.addContextMenuMiniPage()

			if (location == 'before'){
	  			this.selectIndexPage(indexCurrent)
			}

			if (location == 'after'){
	  			this.selectIndexPage(parseInt(indexCurrent) + 1 )
			}



	  },

	   /**
	   * @name selectIndexPage
	   * @description description
	   * @return {void} 
	   */
	   selectIndexPage: function  (index) {
	        this.get('.page').removeClass('active')
			let page  = this.get('.page[data-index="'+index+'"]')
		    page.addClass('active')
	    	this.pageSelected = index

	    	this.get('.mini-page').removeClass('active')
			let minipage  = this.get('.mini-page[data-index="'+index+'"]')
	    	minipage.addClass('active')

	    	this.pages.animate({scrollTop: this.pages.scrollTop() + page.position().top  }, 'slow');

	   },

	   /**
	   * @name refresSorterPages
	   * @description description
	   * @return {void} 
	   */
	   refresSorterPages: function  () {
	        this.get('.question-container').sortable({
		 		connectWith: ".question-container",
		 		//handle: "order",
	 			stop: this.stopDragApp.bind(this),
	 			placeholder: "portlet-placeholder",
		 	});
	   },

	    /**
	    * @name refresCounterPages
	    * @description description
	    * @return {void} 
	    */
	    refresCounterPages: function  () {
	        let pages = this.get('#pages .page')

		    for (var i = 0; i < pages.length; i++) {
		    	let page = $(pages[i])
		    	page.find('.index-page').text("Página " + ( i+1))
		    	page.attr('data-index',  i+1);
		    }

		    let miniPages = this.get('#miniPages .mini-page')

		    for (var i = 0; i < miniPages.length; i++) {
		    	let miniPage = $(miniPages[i])
		    	miniPage.text( i+1)
		    	miniPage.attr('data-index',  i+1);
		    }


	    },

	
});