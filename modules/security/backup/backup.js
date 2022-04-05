/*
 * @module  Backup
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */
 Titan.modules.create({

 	name: 'Backup',

	/*
	 * @constructor
	 * @description inicia los componentes del módulo
	 */
	 ready: function () {
		//init components
		this.buttonBackup = $('#buttonBackup');
		this.buttonDownloadBackup = $('#downloadBackup');
		this.buttonDownloadBackup.hide();		
		Titan.loader.hide();
	},

	/*
	 * @name initEvents
	 * @description inicia los eventos de los componentes del módulo
	 * @return {void}
	 */
	 initEvents: function () {
	 	Titan.click('buttonBackup', 'createBackup', this);
	 },

	 createBackup: function () {
	 
	 	var r = WebService.post({route: 'security/backup' });

	 	r.done(function  (response) {
	 		if (response.StatusResult == 'OK') {
	 			this.buttonDownloadBackup.attr('href',  response.path_backup);
	 			this.buttonDownloadBackup.attr('data-file', response.path_backup);
	 			this.buttonDownloadBackup.show('slow', function() {
	 				this.buttonDownloadBackup.effect('shake');
	 			}.bind(this));
	 			Titan.popup.success('Copia de seguridad creada');
	 		} else{
	 			Titan.popup.info('faliure');
	 		}
	 	}.bind(this));

	 },

	
});