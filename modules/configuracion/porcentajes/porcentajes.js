/*
 * @module  settings
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */
 Titan.modules.create({
 	name: 'Porcentajes',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	 ready: function () {


	 	/* Cargamos las configuraciones */
		WebService.post({ 'route': 'configuracion/load' }).done(this.loadSettings.bind(this));
	 	
	 },

	 initEvents: function () {	
	 },

	 /*
	  * @name loadSettings
	  * @description carga en los diferentes campos los valores de las configuraciones guardadas 
	  * @params data, respuesta del servidor
	  * @return {void}
	  */
	 loadSettings: function ( data ) {
	 	
	 	var settings = data.settings;
	 	
	  	$.each(settings, function(index, val) {
	  		var setting = this.get('[data-setting="' +  val.keydata + '"]');
	  		setting.val(val.value);
	 	}.bind(this));
	 },
	 	
	/*
	 * @name save
	 * @description envía los datos a guardar al servidor
	 * @return {void}
	 */
	 save:function(){

	 	var settings = this.get('[data-setting]');

	 	var settingsData = $.map(settings, function(val, index ) {
	 		var el = $(val);
	 		return { keydata: el.attr('data-setting'), value: el.val() };
	 	});

	 	/* Guardamos las configuraciones */
		WebService.post({ 'route': 'configuracion/save', settings: settingsData }).done(this.onSaveSettings.bind(this));

	 },

	 /*
	  * @name onSaveSettings
	  * @description al terminar de guardar las configuraciones
	  * @params data, respuesta del servidor
	  * @return {void}
	  */
	 onSaveSettings: function ( data ) {
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
	 	
});