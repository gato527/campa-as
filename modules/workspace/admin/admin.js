/*
 * @module  Admin
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */

 Titan.modules.create({
 	name : 'Admin',
	/*
	 * @constructor @description inicia los componentes del módulo
	 */
	 ready : function() {

		// init components
		this.btnMenu = this.get('#nav-toogle-menu');
		this.btnSalir = this.get('#salir-session');
		this.slideMenu = this.get('.menu-slide');

		this.containerUsername = this.get('.user-logo p');

		this.titleApp = this.get('#title-app');
		this.mainContent = this.get('.main-content');

		this.imgPerfil = this.get('#img-perfil');



		this.containerUserLogo = this.get('#perfil');
		Titan.click('containerUserLogo', 'onClickLogo', this);


		var user = Titan.getUserData();
		var rol = Titan.getUserRol();
		this.containerUsername.html(user.name + '<br><small>'+ rol.name +'</small>');



		this.navigationMenu = this.get('#Navigation-menu');
		this.contentAdmin = this.get('#content-admin');


		this.search = this.get('#search');

		this.search.jFilter({
		    container: this.slideMenu,
		    findBy: '.menu-item',
		    hide: '.menu-item'
		 });

		var menus = __u__r_;

		for (i in menus) {
			if (i < menus.length) {

				if (menus[i]) {

				this.navigationMenu.append('<li class="menu-item" title="'
					+ menus[i].name + '"  data-id-m="'
					+ menus[i].id + '" data-module="'
					+ menus[i].frontend_module + '" data-view="'
					+ menus[i].frontend_view + '" data-table="'
					+ menus[i].backend_table + '" >'
					+ '<a  data-id-m="' + menus[i].id
					+ '" data-module="' + menus[i].frontend_module
					+ '" data-view="' + menus[i].frontend_view
					+ '" data-table="' + menus[i].backend_table
					+ '" id ="blue-folder-menu-' + menus[i].id + '" >'
					+ '<div class="fugue fugue-'+menus[i].icon +'"></div><span>	'
					//+ '<span class="glyphicon glyphicon-' + menus[i].icon+ '"></span> '
					+ menus[i].name + '</span></a></li>');
				}
			}
		}

		this.navigationMenu.find('[data-toggle="tooltip"]').tooltip();

		this.menusItems = $('.menu-item');

		// var link = this.navigationMenu.find('a').first();
		// _crud = link.attr('data-table');
		// _id_m = link.attr('data-id-m');

		// Titan.view(link.attr('data-module'), link.attr('data-view'), 'content-admin', { id: _id_m});
		// Titan.view('workspace', 'perfil', 'content-admin' );



		Titan.loader = {};
		Titan.loader.show = function () {
			$('#loader-content').show('fade');
		};
		Titan.loader.hide = function () {
			$('#loader-content').hide('fade');
		};

		Titan.loader.hide();



		// if (link.attr('data-view') == 'crud')
			// Titan.loader.show();
			//
		setTimeout(function(){
		// this.get('#Navigation-menu').find('a').first().click();
		// var params = {
	 // 		id: '35',
	 // 		module: 'workspace',
	 // 		view: 'crud',
	 // 		title: 'Perfil'
	 // 		table: 'user',
	 // 		permissions: {}
	 // 	};

		// this.openApp('35', params);

		}.bind(this), 2000);

		this.loadImagePerfil();

		this.onClickLogo();


		if (Titan.getUserRol().name == "Agente de ventas") {
			$('body').addClass('agent')
		}


	    /*Agregar timmer*/
	    this.inactivity = setTimeout(this.completeTimeInactivity.bind(this), __u__t_s);
	    $('body').on('click', function(){
	      clearTimeout(this.inactivity);
	      this.inactivity = setTimeout(this.completeTimeInactivity.bind(this), __u__t_s);
	    }.bind(this));
	    /*-Agregar timmer-*/

		Titan.view( 'chat', 'list', this.chatContainer, {} );
	    

	},

  /*
	 * @name completeTimeInactivity
	 * @description ejecuta el logout cuando esta inactivo
	 * @return {void}
	 */
	completeTimeInactivity: function () {
    	this.closeSession();
  	},


	/*
	 * @name onClickLogo
	 * @description carga el modulo de perfil
	 * @params data, respuesta del servidor
	 * @return {void}
	 */
	onClickLogo: function () {

		var params = {
	 		id: '74',
	 		module: 'agent',
	 		view: 'diary',
	 		title: 'CALL IN ACTION - Operaciones - Agenda',
	 		table: '',
	 		permissions: {}
	 	};

		this.openApp('74', params);

	},



	/*
	 * @name loadImagePerfil
	 * @description describe la function
	 * @params data, respuesta del servidor
	 * @return {void}
	 */
	loadImagePerfil: function () {

		var urlImage = 'img/uploads/users/' + Titan.getUser() + '.png';

		 $.ajax({
	        type: "HEAD",
	        async: true,
	        url: urlImage,
	    }).done(function(){
	        var d = new Date();
			var n = d.getTime();
			this.imgPerfil.attr('src', urlImage + '?'+n);
	    }.bind(this));
	},


	/*
	 * @name initEvents @description inicia los eventos de los componentes del
	 * módulo @return {void}
	 */
	 initEvents : function() {
	 	Titan.click('btnMenu', 'loadMenu', this);
	 	Titan.click('btnSalir', 'closeSession', this);
	 	Titan.click('menusItems', 'clickMenu', this);
	 },

	/*
	 * @name clickMenu @description carga la vista usuarios @return {void}
	 */
	 clickMenu : function(e) {
	 	this.menusItems.removeClass('active');

	 	var el = $(e.target);
	 	if (!el.is('li')) {
	 		el = el.parent();
	 	}
	 	if (!el.is('li')) {
	 		el = el.parent();
	 	}

	 	el.addClass('active');
	 	el.addClass('open-app');

	 	//if (el.attr('data-view') == 'crud')
	 	//	$('#loader-content').fadeIn('fast');

	 	_moduleObject = el;
	 	_crud = el.attr('data-table');
	 	_id_m = el.attr('data-id-m');

	 	var appId = el.attr('data-id-m');


		var permissions = this.findPermision(__u__r, _id_m);

	 	var params = {
	 		id: el.attr('data-id-m'),
	 		module: el.attr('data-module'),
	 		view: el.attr('data-view'),
	 		table: el.attr('data-table'),
	 		title: el.html(),
	 		permissions: permissions
	 	};

	 	this.openApp(appId, params);


		// carga los html,css, javascript

		// this.slideMenu.toggle('slide');

		//Titan.loader.hide();

	},

	/*
	 * @name findPermision
	 * @description describe la function
	 * @return {void}
	 */
	findPermision: function (source, name) {
		for ( var k in source) {
			if (source[k]) {
				if (source[k].menu == name) {
					return source[k];
				}
			}
		}

	},

	/*
	 * @name openAppById
	 * @description abre una app pasado el id
	 * @return {void}
	 */
	openAppById: function (appId) {
		var data = __u__r_.searchBy('id',appId);

		var permissions = this.findPermision(__u__r, appId);

	 	var params = {
	 		id: appId,
	 		module:  data['frontend_module'],
	 		view:  data['frontend_view'],
	 		table:  data['backend_table'],
	 		title: data['name'],
	 		permissions: permissions
	 	};

	 	this.openApp(appId, params);

	},


	/*
	 * @name openApp
	 * @description describe la function
	 * @return {void}
	 */
	openApp: function (appId, params) {

		if (params.view == 'crud') {
			this.titleApp.html(params.title + '<small>Registro de información</small>' + '<small class="pull-right"><div class="fugue fugue-home"></div> Home > ' + params.title + '</small>');
		}else {
			this.titleApp.html(params.title + '<small class="pull-right"><div class="fugue fugue-home"></div> Home > ' + params.title + '</small>');
		}

		var apps = this.contentAdmin.find('.app-container');
	 	apps.hide();

	 	var appContainer = this.contentAdmin.find('#content-app-' + appId);
	 	if (appContainer.length > 0) {
	 		appContainer.show();
	 		/* comentar */
	 		 Titan.view(params.module, params.view , 'content-app-' + appId, params);
	 	} else {
	 		var html = '<div class="app-container" id="content-app-' + appId + '"></div>';

	 		this.contentAdmin.append(html);
	 		Titan.view(params.module, params.view , 'content-app-' + appId, params);
	 	}

	},


	/*
	 * @name loadMenu @description carga la vista usuarios @return {void}
	 */
	 loadMenu : function(e) {
	 	//var r = WebService.post({route: 'import/calcular', database_name: 'dowesoft_duverneysuarez' });

	 	this.mainContent.toggleClass('toggle-slide-menu');
	 },

	/*
	 * @name closeSession @description carga la vista usuarios @return {void}
	 */
	 closeSession : function(e) {
	 	WebService.post({ route : 'security/logout', 'userId': __u__}).done(function(data) {
	 		delete Session.response;
	 		delete Titan.token;
	 		delete Titan.signature;
	 		location.reload();
	 	});
	 },
	});
