/*
 * @module  index
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */

Titan.modules.create({
	name: 'user',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components


		
	},

	 /**
	 * @name search
	 * @description description
	 * @params data Server response
	 * @return {void} 
	 */
	search: function  (user) {

		this.params.user = user

		this.username.text(user.name)

		let dialog = [ this.params.user.id, __u__]
		dialog = dialog.sort().join('-')

		this.dialog = {
			id: md5(dialog),
			from : __u__,
			to : this.params.user.id,
		}

		this.interval = setInterval(this.refresh.bind(this), 1000)
		this.mode = 'text'

		WebService.post({ 'route': 'chat/getMessages', dialog: this.dialog.id, user:__u__ }).done(this.loadedMessages.bind(this));
	    
	},

	 /**
	 * @name refresh
	 * @description description
	 * @params data Server response
	 * @return {void} 
	 */
	refresh: function  (data) {
		WebService.post({ 'route': 'chat/getNewMessages', dialog: this.dialog.id, lastMessage: this.lastMessageId || 0 , user:__u__ }).done(this.loadedMessages.bind(this));
	    
	},

	 /**
	 * @name loadedMessages
	 * @description description
	 * @params data Server response
	 * @return {void} 
	 */
	loadedMessages: function  (data) {

		data.messages = data.messages || []
		if (!data.refresh) {
			this.listBubbles.empty()
		}

		for (var i = data.messages.length - 1; i >= 0; i--) {
			this.printMessage(data.messages[i])
		}
	    
	},




	 /**
	 * @name onBack
	 * @description description
	 * @params data Server response
	 * @return {void} 
	 */
	onBack: function  (data) {
	    this.params.onclose()
		this.listBubbles.empty()

	    clearInterval(this.interval)
	},

	 /**
	 * @name onSaveMessage
	 * @description description
	 * @return {void} 
	 */
	onSaveMessage: function  () {
	    let message = this.message.val()

	    let dialog =  { 
			type: this.mode,
			message: message,
			... this.dialog
		}


		if (this.infoFile) {
			this.uploadFile(dialog)
		} else {
			WebService.post({ 
				'route': 'chat/saveMessage',
				'dialog': dialog,
			 }).done(this.savedMessage.bind(this));
		}




	},

	 /**
	 * @name uploadFile
	 * @description description
	 * @params data Server response
	 * @return {void} 
	 */
	uploadFile: function  (dialog) {
		var formData = new FormData();
		formData.append('route', 'chat/saveAttach');
		formData.append('database_name', _database_name);
		formData.append('dialog', JSON.stringify(dialog));
		formData.append('attach', this.infoFile); 

		$.ajax({
		    url: WebService.host,
		    data: formData,
		    type: 'POST',
		    contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
		    processData: false, // NEEDED, DON'T OMIT THIS
		    // ... Other options like success and etc
		}).done((data)=>{
			if (data.error) {
				this.error.text(data.error)
				this.error.show('fade')
				this.cancelFile()
				setTimeout(()=> {this.error.hide('fade')}, 4000);
			} else {
				this.message.val('')
				this.cancelFile()
			}
		})
	    
	},

	 /**
	 * @name onSaveMessageEnter
	 * @description description
	 * @return {void} 
	 */
	onSaveMessageEnter: function (elem, value, e) {

	 	var tecla = (document.all) ? e.keyCode : e.which;
	 	if (tecla==13){
	 		this.onSaveMessage();
	 	}
	 },	


	 /**
	 * @name savedMessage
	 * @description description
	 * @params data Server response
	 * @return {void} 
	 */
	savedMessage: function  (data) {

		if (data.StatusResult == "OK") {
			this.message.val('')
			this.cancelFile()
		}
	    
	},


	 /**
	 * @name printMessage
	 * @description description
	 * @params data Server response
	 * @return {void} 
	 */
	printMessage: function  (message) {

		this.lastMessageId = message.id 

		if (this.get('.bubble-'+ message.id).length == 0) {

			let bubbleClass = message.user_from == __u__? 'right': 'left'

		    this.listBubbles.appendTitan(`
		    	<div class="bubble bubble-${message.id} bubble-${bubbleClass} ${ message.type == 'attach' ? `bubble-attach` : '' }">
					<div class="bubble-text">${message.message} ${ message.type == 'attach' ? `<span class="material-icons"> description </span>` : '' }</div>
					${ message.type == 'attach' ? `<a href="docs/attachments/${message.chat_attach.path}" filename="${message.chat_attach.name}" download="${message.chat_attach.name}">Descargar</a>` : '' }
					<div class="bubble-hour">${message.created_at ? moment(message.created_at).format('h:mm a') : moment().format('h:mm a')}</div>
				</div>
		    `)

		    var node = this.listBubbles[0]
	        node.scrollTop = node.scrollHeight

        }
	},


	 /**
	 * @name onSelectedFile
	 * @description description
	 * @params data Server response
	 * @return {void} 
	 */
	onSelectedFile: function  (elem, value, event) {

		if (event.target.files[0]) {
			this.infoFile = event.target.files[0]
		    this.message.val(event.target.files[0].name)
		    this.btnAttach.hide('fade')
		    this.btnCancelAttach.show('fade')
			this.mode = 'attach'

		}
	},

	 /**
	 * @name openFile
	 * @description description
	 * @params data Server response
	 * @return {void} 
	 */
	openFile: function  (data) {
		this.file.click()

	},

	 /**
	 * @name cancelFile
	 * @description description
	 * @params data Server response
	 * @return {void} 
	 */
	cancelFile: function  (data) {
	    this.file.val('')
	    this.message.val('')
		this.btnAttach.show('fade')
		this.btnCancelAttach.hide('fade')
		this.mode = 'text'
		this.infoFile = null
	},

});

