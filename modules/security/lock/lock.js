/*
 * @module  Login
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */
 Titan.modules.create({
 	name: 'Lock',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	 ready: function () {

		//init components
		this.btnLogin =this.get('#buttonLogin');
		this.userLogin =this.get('#inputUser');
		this.passLogin =this.get('#inputPass');
		this.inputCompany =this.get('#inputCompany');

		this.otherUser =this.get('#other-user');


		this.btnTerminosCondiciones = $('#terms-cond');

		//botones de ocultar los formularios
		this.btn_login_company = this.get('btn_login_company');
		this.btn_login_debtor = this.get('btn_login_debtor');

		//boton login usuarios
		this.buttonLoginUser = this.get('buttonLoginUser');
		//campos login usuarios
		this.inputDni = this.get('inputDni');
		this.inputPin = this.get('inputPin');

		//ocultamos los formularios de login
		this.login_company_form = this.get('login_company');
		this.login_company_form.hide();

		this.login_debtor_form = this.get('login_debtor');
		this.login_debtor_form.hide();

		this.imgPerfil = this.get('#img-perfil');
		this.loadImagePerfil();

		this.containerUsername = this.get('.user-logo p');

		var user = Session.response.__u_d;
		var rol = Session.response.__u__r_o;
		if (user && rol) {
			this.containerUsername.html(user.name + '<br><small>'+ rol.name +'</small>');

			this.userLogin.val(user.login);

			this.passLogin.focus();

		} else {
			this.closeSession();
		}


	},

	/*
	 * @name initEvents
	 * @description inicia los eventos de los componentes del módulo
	 * @return {void}
	 */
	 initEvents: function () {

	 	Titan.click('btnLogin', 'initSession', this);

	 	//evento para mostrar formularios
	 	Titan.click('btn_login_company', 'login_company', this);
	 	Titan.click('btn_login_debtor', 'login_debtor', this);
	 	Titan.click('buttonLoginUser', 'loginUser', this);


	 	Titan.keypress('userLogin', 'initSessionEnter', this);
	 	Titan.keypress('passLogin', 'initSessionEnter', this);
	 	Titan.keypress('inputCompany', 'initSessionEnter', this);

	 	Titan.click('btnTerminosCondiciones', 'openTerms', this);
	 	Titan.click('otherUser', 'closeSession', this);

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


	 /*
	 * @name loadImagePerfil
	 * @description describe la function
	 * @params data, respuesta del servidor
	 * @return {void}
	 */
	loadImagePerfil: function () {

		var urlImage = 'img/uploads/users/' + Session.response.__u__ + '.png';

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

	 loginUser: function (e) {
	 	alert('eka');
	 },

	 login_company: function (e) {
	 	/*
	 	Request.host = 'http://190.216.202.34:8080';

	 	var params = {
	 		tpl: 'conn2json',
	 		start: 1,
	 		'SID=A=16@O=Start@X':  3.448457 +'@Y='+ '-76.537147' , //3.448457, -76.537147
	 		'ZID=A=16@O=Destination@X': 3.479085 +'@Y=' + '-76.525732', //3.479085, -76.525732
	 		'json_maxobstjects' : 5,
	 		'REQ0HafasNumCons0': 4,
	 		'REQ0HafasNumCons1': 0
	 	}
	 	//3.491508, -76.513029
	 	Request.post('bin/ajax-getstop.bin/hny?start=1&tpl=suggest2json&REQ0JourneyStopsS0A=7&REQ0JourneyStopsB=12&S=',{});
	 	*/
	 	this.login_company_form.show('slow');
	 	this.login_debtor_form.hide();
	 },

	 login_debtor: function (e) {
	 	this.login_debtor_form.show('slow');
	 	this.login_company_form.hide();
	 },

	 initSessionEnter: function (e) {
	 	var tecla = (document.all) ? e.keyCode : e.which;
	 	if (tecla==13){
	 		this.initSession();
	 	}
	 },

	 openTerms: function () {
	 	Titan.message.confirmationModal('Términos y Condiciones', '<iframe src="docs/terminos-y-condiciones.pdf" type="application/pdf" width="100%" height="100%"></iframe>');
	 	$('.modal-body').css('height', '450px');
	 	$('.modal-dialog').addClass('modal-lg')
	 },

	 openTermsLogin: function (response) {
	 	Titan.message.confirmationModal('Términos y Condiciones', '<iframe src="docs/terminos-y-condiciones.pdf" type="application/pdf" width="100%" height="100%"></iframe>', this.acceptTermsAndConditions, this ,'Acepto', 'No estoy de acuerdo');
	 	$('.modal-body').css('height', '450px');
	 	$('.modal-dialog').addClass('modal-lg')
	 },

	/*
	 * @name initSession
	 * @description envia los datos al webservice login para la autenticacion ante el sistema
	 * @return {void}
	 */
	 initSession: function () {

	 	if($.trim(this.inputCompany.val()) ==''){
	 		Titan.popup.warning('Ingrese el nombre de la empresa');
	 		return;
	 	}

	 	_database_name = null;
	 	var r = WebService.post({route: 'superadmin/company_query', 'company_name': this.inputCompany.val() });

	 	r.done(function  (response) {
	 		if (response.StatusResult == 'OK') {
	 			this.loginModule(response);
	 			this.contract_end_date = response.contract_end_date;
	 			this.mayor = response.mayor;
	 			this.m = response.m;
	 		} else{
	 			Titan.popup.info('no se encontraron datos de la empresa ' + this.inputCompany.val());
	 		}
	 	}.bind(this));
	 },


	 loginModule: function (response) {

	 	if($.trim(this.userLogin.val()) ==''){
	 		Titan.popup.warning('Ingrese su nombre de usuario');
	 		return;
	 	}

	 	if($.trim(this.passLogin.val()) ==''){
	 		Titan.popup.warning('Ingrese su contraseña');
	 		return;
	 	}

	 	if($.trim(this.passLogin.val()) !='' && $.trim(this.userLogin.val()) !=''){
	 		_database_name = response.database_name;
	 		Session.database_name = response.database_name;

	 		var a = WebService.post({route: 'security/login', 'login[pass]': this.passLogin.val(), 'login[user]': this.userLogin.val() });
	 		a.done(function  (response) {
	 			Session.response = response;
	 			this.init(response);
	 		}.bind(this));
	 	}
	 },

	 onrefresh: function () {
	 	Titan.message.confirmation('¿Desea cerrar la sesión?', 'Si sale de la página la sesión se cerrará automáticamente', this.close, this ,'Cerrar sesión', 'Permanecer en el sistema');
	 	return false;
	 },

	 close: function () {
	 	Titan.modules['Admin'].closeSession();

	 },

	 init: function (response) {

	 	if(response.StatusResult == 'OK'){

			var mess = (this.m > 0)? (this.m + ' mes' +((this.m > 1)? 'es':'') +'  y '): '';

	 		var html = '<h2 class="information">Su cuenta se encuentra con <b> ' + mess + this.contract_end_date + ' días </b>de mora</h2></br>' +
	 			'<img class="img-responsive" alt="Responsive image" src="img/icons/debt-account.jpg">';


	 		if (response.__u__r_o == '3') {
	 			if (this.contract_end_date >= 10) {
	 				if (this.mayor) {
	 					Titan.message.info('Redfolder información', html , this.close, this ,'Cerrar sesión', 'Permanecer en el sistema');
					}
	 			}
	 		}


	 		if (response.count_session <= 0)
	 			this.openTermsLogin(response);
	 		else
	 			Titan.view(response.module, response.view);

	 		this.response= response;
	 		Titan.getUser = function () {
	 			return __u__;
	 		}
	 		Titan.getUserData = function () {
	 			return __u_d;
	 		}

	 		Titan.getUserRol = function () {
	 			return __u__r_o;
	 		}
	 		__u__ = response.__u__;
	 		__u_d = response.__u_d;
	 		__u__r=response.__u__r;
	 		__u__r_= response.__u__r_;

	 		__u__r_o = response.__u__r_o;
	 	}else{
	 		Titan.popup.error(response.ErrorMessage);
	 	}
	 },


	 /*
	 * @name initSession
	 * @description envia los datos al webservice login para la autenticacion ante el sistema
	 * @return {void}
	 */
	 acceptTermsAndConditions: function () {

	 	var r = WebService.post({route: 'security/terms', 'accept':this.response. __u__});
	 	r.done(function  (response) {
	 		if (response.StatusResult == 'OK') {
	 			Titan.view(this.response.module, this.response.view);
	 			Titan.popup.success('Gracias por aceptar los terminos y condiciones de la plataforma BlueFolder ' );
	 		} else{
	 			Titan.popup.warning('Debes aceptar los terminos y condiciones' + this.inputCompany.val() );
	 		}
	 	}.bind(this));
	 },

	});


/*

var tryingToReload = false;
//on before unload
window.onbeforeunload = function(e){
	//Firefox and Safari gets argument directly.
    if (!e) {
    	//this is for IE
        e = window.event;
    }
     // clicked on the close button for IE
    if (e.clientY != undefined && e.clientY < 0){
        tryingToReload = false;
    }
	// select close from context menu from the right click on title bar on IE
    if (e.clientY != undefined && (e.clientY > 100 && e.clientY < 140))  {
        tryingToReload = false;
    }

    //user hasn't clicked on X close button or hasn't selected close from context menu
    if (tryingToReload){
        tryingToReload = false;
    }

    Titan.modules['Admin'].closeSession();
    return;
}

//attach to key down event to detect the F5 key
document.onkeydown = function(e){
    tryingToReload = false;
 	//Firefox and Safari gets argument directly.
    if (!e)
    {
        e = window.event;
    }

    var key = e.keyCode ? e.keyCode : e.which;
 	//try
    try
    {
    	//F5 Key detected
        if (key == 116)
        {
            tryingToReload = true;
        }
    } catch (ex) {}
}


document.oncontextmenu = function(e){} //check for the right click
*/
