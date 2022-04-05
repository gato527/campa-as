/*
 * @module  Login
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */
 Titan.modules.create({
 	name: 'Permission',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	 ready: function () {
        Titan.loader.show();


	 	this.selectRoles = this.get('#roles');
	 	this.appsContainer = this.get('#apps');

	 	WebService.post({ route: 'permission/getPermisionAplication' }).done(this.onLoadPermission.bind(this));

	},

	/*
	 * @name initEvents
	 * @description inicia los eventos de los componentes del módulo
	 * @return {void}
	 */
	 initEvents: function () {

		this.selectRoles.on('change', this.onChangeRol.bind(this));

	 },

	 /*
	 * @name: onChangeRol
	 * @description: al cambiar el rol
	 * @return {void}
	 */
	 onChangeRol : function() {
	 	Titan.loader.show()
	 	var rolId = this.selectRoles.val();
	 	WebService.post({ route: 'permission/getPermisionRol/' + rolId }).done(this.printPermission.bind(this));
	},

	/*
	* @name: printPermission
	* @description: pintar los permisos
	* @return {void}
	*/
	printPermission : function(data){

	 	var rolId = this.selectRoles.val();

		this.appsContainer.empty();
	 	this.printApps(this.apps);

	 	if (data.permissions) {
		 	for (var i = 0; i < data.permissions.length; i++) {
		 		var permission = data.permissions[i];

		 		if (permission.rol.id == rolId) {

		 			var appId = permission.menu.id;

		 			var containerApp = this.appsContainer.find('#app-' + appId );

		 			var checkCreate = containerApp.find('.p_create');
		 			var checkUpdate = containerApp.find('.p_update');
		 			var checkDelete = containerApp.find('.p_delete');

		 			var checkOpen = containerApp.find('.permission-open');
					checkOpen.prop('checked', 'checked');

		 			var p_create = parseInt(permission.p_create);
					var p_delete = parseInt(permission.p_delete);
					var p_update = parseInt(permission.p_update);

					
					if (p_create) {
						checkCreate.prop('checked', 'checked');
					}


					if (p_update) {
						checkUpdate.prop('checked', 'checked');
					}

					if (p_delete) {
						checkDelete.prop('checked', 'checked');
					}
		 		}
		 	}
	 	}

	 	Titan.loader.hide()
	},

	 /*
	 * @name: onLoadPermission
	 * @description: al cargar los permisos y las aplicaciones
	 * @return {void}
	 */
	 onLoadPermission : function(data){
	 	if (data.StatusResult == 'OK') {


	 		this.permissions = data.permission;
	 		this.apps = data.apps;

	 		
	 		
	 		this.printRoles(data.roles);

 		} else{
 			Titan.popup.info('no se encontraron datos de las apps ');
 		}
	 },

	 /*
	 * @name: printRoles
	 * @description: pinta los roles para agregarle los permisos
	 * @param roles array de objeto con la informacion de los roles 
	 * @return {void}
	 */
	 printRoles : function(roles){
	 	
	 	for (var i = 0; i < roles.length; i++) {
	 		var rol = roles[i];

	 		this.selectRoles.append('<option value="' + rol.id + '"  >' + rol.name + '</option>');
	 	}

	 	this.printPermission({ permissions: this.permissions });

	 },


 	/*
	 * @name: printApps
	 * @description: pinta las app para agregarle los permisos
	 * @param apps array de objeto con la informacion de las apps 
	 * @return {void}
	 */
	 printApps : function(apps){
	 	
	 	for (var i = 0; i < apps.length; i++) {
	 		var app = apps[i];

	 		this.appsContainer.append(this.printApp( app));
	 	}

	 	var inputs = this.appsContainer.find('.checkbox input');
		inputs.on('change', this.onChangeCheckPermissions.bind(this));
	 	

	 },


	 /*
	 * @name: onChangeCheckPermissions
	 * @description: al cambiar un permiso de una aplicacion
	 * @return {void}
	 */
	 onChangeCheckPermissions : function(e){
	 	var el = $(e.target);

	 	var isOpen = el.hasClass('permission-open');

	 	el = el.hasClass('box') ? el : el.parent();
	 	el = el.hasClass('box') ? el : el.parent();
	 	el = el.hasClass('box') ? el : el.parent();
	 	el = el.hasClass('box') ? el : el.parent();


 		var checkCreate = el.find('.p_create');
		var checkUpdate = el.find('.p_update');
		var checkDelete = el.find('.p_delete');

		var checkOpen = el.find('.permission-open');
		var p_open = checkOpen.prop('checked');

		var p_create = checkCreate.prop('checked');
		var p_update = checkUpdate.prop('checked');
		var p_delete = checkDelete.prop('checked');

		

	 	var rolId = this.selectRoles.val();
	 	var app = el.attr('data-id');

	 	var data = {

	 		route: 'permission/savePermisionAplication' ,
			p_create: p_create? 1 : 0, 
			p_update: p_update? 1 : 0, 
			p_delete: p_delete? 1 : 0, 

		 	rolId: parseInt(rolId), 
		 	app: parseInt(app), 
	 	};


		if (!p_open && isOpen) {
			checkCreate.removeProp('checked');
			checkUpdate.removeProp('checked');
			checkDelete.removeProp('checked');

		
			data.route =  'permission/deletePermisionAplication';
	 		WebService.post(data).done(this.onSavePermission.bind(this));
		} else {

			if (p_create || p_update || p_delete ) {
				checkOpen.prop('checked', 'checked');
			}

		 	WebService.post(data).done(this.onSavePermission.bind(this));
		}


		
		

	 },

	 /*
	 * @name: onSavePermission
	 * @description: al guardar un permiso
	 * @return {void}
	 */
	 onSavePermission : function( data ){
	 	
	 },

 	/*
	 * @name: printApps
	 * @description: pinta una de las app para agregarle los permisos
	 * @param app array de objeto con la informacion de las app 
	 * @return {void}
	 */
	 printApp : function(app) {


	 		var html = [
			  	'<div class="col-sm-6 col-md-4">',
			    	'<div class="box box-primary" id="app-' + app.id + '" data-id="' + app.id + '" >',
			      		'<div class="box-header">',
			        		'<label><div class="checkbox checkbox-success"><input title="Permiso de visualización" data-id="' + app.id + '" class="permission-open" type="checkbox"><label><div class="fugue fugue-' + app.icon + '"></div>' + app.name + '</label></div></label>',
			      		'</div>',
			    		
			    		'<div class="box-body">',
			 				'<div class="checkbox checkbox-success"><input  data-id="' + app.id + '" class="p_create" type="checkbox"><label>Crear</label></div>',
			 				'<div class="checkbox checkbox-success"><input  data-id="' + app.id + '" class="p_update" type="checkbox"><label>Actualizar</label></div>',
			 				'<div class="checkbox checkbox-success"><input  data-id="' + app.id + '" class="p_delete" type="checkbox"><label>Eliminar</label></div>',
				      	'</div>',
			    	'</div>',
			  	'</div>'].join('');

			return html;

	 },

	 

	
});

