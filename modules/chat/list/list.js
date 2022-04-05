/*
 * @module  index
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) IP Total Software S.A
 */

Titan.modules.create({
	name: 'list',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	ready: function () {
		//init components
		
		



		WebService.post({ 'route': 'chat/getUsers' }).done(this.loadedUsers.bind(this));


		// Let's check if the browser supports notifications
	    if (!("Notification" in window)) {
	      console.log("This browser does not support desktop notification");
	    } else if (Notification.permission !== "granted") {
	       this.requestNotify()
	    }  

	    this.refresh()
	    // this.interval = setInterval(this.refresh.bind(this), 2000)


		Titan.view( 'chat', 'user', this.chat, { onclose: this.closeActiveChat.bind(this)} );

	},

	 /**
	 * @name closeChat
	 * @description description
	 * @params data Server response
	 * @return {void} 
	 */
	closeChat: function  (data) {
	    this.get('.chat-container').hide('fade')
	},

	 /**
	 * @name openChat
	 * @description description
	 * @params data Server response
	 * @return {void} 
	 */
	openChat: function  (data) {
	    this.get('.chat-container').show('fade')
	},

	 /**
	 * @name refresh
	 * @description description
	 * @params data Server response
	 * @return {void} 
	 */
	refresh: function  (data) {
		WebService.post({ 'route': 'chat/checkByNewMessages', user:__u__ }).done(this.loadedMessages.bind(this));
	    
	},

	 /**
	 * @name loadedMessages
	 * @description description
	 * @params data Server response
	 * @return {void} 
	 */
	loadedMessages: function  (data) {

		data.messages = data.messages || []

		this.badge.text(data.messages.length);

		if (data.messages.length > 0) {
			this.badge.show('fade');
		} else {
			this.badge.hide('fade');
		}

		this.get('.chat-user-badge').hide()

		for (var i = data.messages.length - 1; i >= 0; i--) {
			let msg = data.messages[i]
			let badge = this.get(`.chat-user-badge.badge-${msg.user_from}`).hide()
			badge.text(msg.count)
			badge.show();
		}


		this.get('.chat-user-online').removeClass('online')

		for (var i = data.online.length - 1; i >= 0; i--) {
			let user = data.online[i]
			let badge = this.get(`.online-${user.user}`)
			badge.addClass('online')
		}
	    
	},

	 /**
	 * @name requestNotify
	 * @description description
	 * @params data Server response
	 * @return {void} 
	 */
	requestNotify: function  (data) {
	    // Let's check if the browser supports notifications
	    if (!("Notification" in window)) {
	      console.log("This browser does not support desktop notification");
	    } else if (Notification.permission !== "denied") {
	      // Otherwise, we need to ask the user for permission
	      Notification.requestPermission(function (permission) {
	        // If the user accepts, let's create a notification
	        if (permission === "granted") {
	        }
	      })
	    }
			
	},

	 /**
	 * @name loadedUsers
	 * @description description
	 * @params data Server response
	 * @return {void} 
	 */
	loadedUsers: function  (data) {

		this.users = {}

		for (var i = 0; i < data.users.length; i++) {
			this.users[data.users[i].id] = data.users[i]
			this.printUser(data.users[i])
		}
	    
	},

	 /**
	 * @name printUser
	 * @description description
	 * @params data Server response
	 * @return {void} 
	 */
	printUser: function  (user) {

		if (__u__ != user.id) {
		    this.listUsers.appendTitan(`
		    	<div class="chat-user" on-click="onClickUser" data-index="${user.id}">
					<span class="material-icons"> account_circle </span>
					${user.name.toName()}
					<div class="chat-rol">${user.rol.name.toName()}</div>
					<div class="chat-user-badge badge-${user.id}">${5}</div>
					<div class="chat-user-online online-${user.id}"></div>
					<div class="chat-user-time time-${user.id}">${user.chat_user? moment(user.chat_user.heartbeat).fromNow(): 'Nunca'}</div>
				</div>
		    `)
	    }
	},

	 /**
	 * @name onClickUser
	 * @description description
	 * @params data Server response
	 * @return {void} 
	 */
	onClickUser: function  (elem, even, userId) {

		let user = this.users[userId]
		Titan.app.chat.user.search(user)
		//Titan.view( 'chat', 'user', this.chat, {name: user.name.toName(), user: user , onclose: this.closeActiveChat.bind(this)} );
		this.chat.show('fade')
	    
	},


	 /**
	 * @name closeActiveChat
	 * @description description
	 * @params data Server response
	 * @return {void} 
	 */
	closeActiveChat: function  (data) {
		this.chat.hide('fade')
	},













});

