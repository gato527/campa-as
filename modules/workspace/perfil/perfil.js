/*
 * @module  Perfil
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */

 Titan.modules.create({
 	name : 'Perfil',
	/*
	 * @constructor @description inicia los componentes del módulo
	 */
	 ready : function() {

	 	var user = Titan.getUserData();
	 	var rol = Titan.getUserRol();
		
		this.imgPerfil = this.get('#img-perfil');
		this.userName = this.get('.widget-user-username');
		this.userRol = this.get('.widget-user-desc');
		this.modalChangeImage = this.get('#modal-change-perfil');

		this.modalChangeImage.on('shown.bs.modal', this.onLoadModal.bind(this));



		this.userName.text(user.name);
		this.userRol.text(rol.name);

		this.uploadCrop = this.get('#upload-demo').croppie({
			viewport: {
				width: 160,
				height: 160,
				type: 'square'
			},
			enableExif: true
		});

		this.get('#upload').on('change', this.onChangeUpload.bind(this));

		this.get('.upload-result').on('click', function (ev) {

			this.uploadCrop.croppie('result', {
				type: 'canvas',
				size: 'viewport'
			}).then(function (resp) {

				WebService.post({route: 'perfil/saveImage/' + Titan.getUser(), 'base64img': resp }) .done(this.onSaveImage.bind(this));

			}.bind(this));
		}.bind(this));

		this.loadImagePerfil();

		this.onReadyImageDef = $.Deferred();


		/* login facebook */

		 // This is called with the results from from FB.getLoginStatus().
  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      testAPI();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  window.fbAsyncInit = function() {
  FB.init({
    appId      : '1301734203180867',
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.8' // use graph api version 2.8
  });

  // Now that we've initialized the JavaScript SDK, we call 
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    });
  }
		
	},

	/*
	 * @name onChangeUpload
	 * @description al iniciar a cambiar la imagen
	 * @params e, evento
	 * @return {void}
	 */
	onChangeUpload: function ( e ) {
		this.readFile(e.target); 
	 	
	},

	/*
	 * @name readFile
	 * @description describe la function
	 * @params data, respuesta del servidor
	 * @return {void}
	 */
	readFile: function ( input ) {
		
		if (input.files && input.files[0]) {
	        var reader = new FileReader();
	        
	        reader.onload = this.onLoadImage.bind(this);
	        reader.readAsDataURL(input.files[0]);

	        this.modalChangeImage.modal('show');
	    }
	    else {
	        swal("Sorry - you're browser doesn't support the FileReader API");
	    }

	 	
	},

	/*
	 * @name onLoadImage
	 * @description al cargar la imagen nueva
	 * @params data, respuesta del servidor con la imagen
	 * @return {void}
	 */
	onLoadImage: function ( data ) {

	 	this.get('.upload-demo').addClass('ready');
	 	this.imageData = data.target.result;

	 	this.onReadyImageDef.resolve();


	},
		

	/*
	 * @name onLoadModal
	 * @description describe la function
	 * @params data, respuesta del servidor
	 * @return {void}
	 */
	onLoadModal: function ( data ) {

		this.onReadyImageDef.then(function(argument) {
			
			this.uploadCrop.croppie('bind', {
	    		url: this.imageData
	    	}).then(function(){
	    		console.log('jQuery bind complete');
	        });		
		}.bind(this));
	 	
	},
		
	/*
	 * @name onReadyImage
	 * @description describe la function
	 * @params data, respuesta del servidor
	 * @return {void}
	 */
	onReadyImage: function ( data ) {
		
	 	
	},
		
		

	/*
	 * @name onSaveImage
	 * @description describe la function
	 * @params data, respuesta del servidor
	 * @return {void}
	 */
	onSaveImage: function ( data ) {
		Titan.app.workspace.admin.loadImagePerfil();
		this.loadImagePerfil();
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
	 	// Titan.click('btnMenu', 'loadMenu', this);
	 },

	});