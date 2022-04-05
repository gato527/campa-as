/*
 * @module  Crud
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */
Titan.modules.create({
    name: 'Crud',
    /*
     * 
     * @constructor
     * 
     * @description inicia los componentes del módulo
     * 
     */
    ready: function() {
        // init components

        Titan.loader.show();

        this.moduleContainer = this.get('#crud-container-' + this.params.id);
        this.optionsCrud = this.moduleContainer.find('#options-crud-' + this.params.id);
        this.context = this.moduleContainer.find('.contextmenu');

        // para las llaves foraneas
        this.modalCount = 0;
        // la tabla
        debugger
        this.tablaResponsive = this.moduleContainer.find('.table-responsive'); //
        this.tableCrud = this.moduleContainer.find('#table-crud');

        if (this.params.id.indexOf('foreing_data') >= 0) {
            this.tableCrud.attr('data-single-select', true);
        }

        var h = this.tablaResponsive.css('height');
        if (h == '100%') {
            h = '520';
        }
        this.tableCrud.attr('data-height', h.replace('px', ''));
        this.thead = this.tableCrud.find('thead > tr').first();
        this.tbody = this.tableCrud.find('tbody').first();

        // para el formulario
        this.modal = this.moduleContainer.find('#modal-crud-' + this.params.id);
        this.modalTitle = this.modal.find('.modal-title');
        this.modalBody = this.modal.find('.modal-body');

        this.totalContainer = this.moduleContainer.find('#total');
        this.form = this.moduleContainer.find('.modal-body form');
        // para el paginador
        this.page = 1;
        // cantidad de filas que se muestran el la tabla
        this.totalRows = 50;
        this.loadForPaginator = false;
        this.filtrated = false;
        this.paginatorContaier = this.moduleContainer.find('#paginator');

        this.nextPage = this.paginatorContaier.find('#next-page');
        this.backPage = this.paginatorContaier.find('#back-page');
        this.lastPage = this.paginatorContaier.find('#last-page');
        this.firstPage = this.paginatorContaier.find('#first-page');

        this.inputPage = this.paginatorContaier.find('#input-page');
        this.numPagsContainer = this.paginatorContaier.find('#num-pages');

        Titan.click('firstPage', 'onFirstPage', this);
        Titan.click('backPage', 'onBackPage', this);
        Titan.keyup('inputPage', 'onInputPage', this);
        Titan.click('nextPage', 'onNextPage', this);
        Titan.click('lastPage', 'onLastPage', this);

        this.index();

        this.modalForeing = this.get('#modal-crud-foreing-' + this.params.id);
        this.modalForeingBody = this.get('#body-foreing-' + this.params.id);
        this.modalForeingTitle = this.get('#title-foreing-' + this.params.id);
        this.btnSelectForeing = this.get('#btn-select-foraing-' + this.params.id);
        this.btnCancelForeing = this.get('#btn-cancel-foraing-' + this.params.id);



        /* buscamos los permisos para el modulo*/
        this.optionsCrud.html('');

        this.optionsCrud.append('<button  id="btn-filter"  title="Búsqueda avanzada"  class="btn btn-default">' +
            '<div class="fugue fugue-funnel"></div>Búsqueda avanzada' +
            '</button>'
        );

        this.optionsCrud.append('<button  id="btn-refresh"  title="Actualizar"  class="btn btn-default">' +
            '<div class="fugue fugue-arrow-circle-double"></div>Actualizar' +
            '</button>'
        );

        if (this.params.permissions) {
            if (this.params.permissions.p_create == 1) {
                this.optionsCrud
                    .append('<button id="btn-new" title="Nuevo" class="btn btn-default" >' +
                        '<div class="fugue fugue-plus"></div>Nuevo' +
                        '</button>'
                    );
            }
            if (this.params.permissions.p_delete == 1) {
                this.optionsCrud
                    .append('<button  id="btn-delete" class="btn btn-default" data-toggle="modal" >' +
                        '<div class="fugue fugue-eraser"></div>Borrar' +
                        '</button>'
                    );
            }
            if (this.params.permissions.p_update == 1) {
                this.optionsCrud
                    .append('<button  id="btn-edit"  title="Editar"  class="btn btn-default" >' +
                        '<div class="fugue fugue-pencil"></div>Editar' +
                        '</button>'
                    );
            }
        }

         /* botones */
        this.btnSave = this.moduleContainer.find('#save');
        this.btnSave = this.moduleContainer.find('#save');
        this.btnNew = this.moduleContainer.find('#btn-new');
        this.btnFilter = this.moduleContainer.find('#btn-filter');
        this.btnRefresh = this.moduleContainer.find('#btn-refresh');
        this.btnCancel = this.moduleContainer.find('.btn-cancel');
        this.btnDelete = this.moduleContainer.find('#btn-delete');
        this.btnTrash = this.moduleContainer.find('.btn-trash');
        this.btnEdit = this.moduleContainer.find('.btn-edit');
        this.btnEditOpen = this.moduleContainer.find('#btn-edit');

    },

    /**
     * @name initEvents
     * @description inicia los eventos de los componentes del módulo
     * @return {void}
     */
    initEvents: function() {
  	 	Titan.click('btnSave', 'save', this);
        Titan.click('btnDelete', 'modeDelete', this);
        Titan.click('btnTrash', 'trash', this);
        Titan.click('btnEdit', 'edit', this);
        Titan.click('btnNew', 'modeNew', this);
        Titan.click('btnFilter', 'modeFilter', this);
        Titan.click('btnRefresh', 'refresh', this);
        Titan.click('btnCancel', 'cancel', this);
        Titan.click('btnEditOpen', 'edit', this);
    },


    /*
     * @name onFirstPage
     * @description describe la function
     * @params data, respuesta del servidor
     * @return {void}
     */
    onFirstPage: function(data) {
        if (this.page != 1) {
            this.page = 1;
            this.refresh();
        }

    },

    /*
     * @name onBackPage
     * @description describe la function
     * @params data, respuesta del servidor
     * @return {void}
     */
    onBackPage: function(data) {

        if (this.page > 1) {
            this.page -= 1;
            this.refresh();
        }

    },

    /*
     * @name onInputPage
     * @description describe la function
     * @params data, respuesta del servidor
     * @return {void}
     */
    onInputPage: function(data) {

    },

    /*
     * @name onNextPage
     * @description describe la function
     * @params data, respuesta del servidor
     * @return {void}
     */
    onNextPage: function(data) {
        if (this.page < this.numPags) {
            this.page += 1;
            this.refresh();
        }

    },

    /*
     * @name onLastPage
     * @description describe la function
     * @params data, respuesta del servidor
     * @return {void}
     */
    onLastPage: function(data) {
        if (this.page != this.numPags) {
            this.page = this.numPags;
            this.refresh();
        }

    },

    /**
     * @name initEvents
     * @description inicia los eventos de los componentes del módulo
     * @return {void}
     */
    index: function() {

        Titan.loader.show();

        var params = {
            route: 'crud/load',
            data_table: this.params.table,
	        page : this.page,
	        totalRows : this.totalRows,
	    };
        WebService.post(params).done(this.onLoadCrud.bind(this));
    },

    /*
     * @name: onLoadCrud
     * @description: al cargar la estructura y data del crud
     * @return {void}
     */
    onLoadCrud: function(data) {

    	/* se refresca las cabeceras */
        if (!this.loadForPaginator) {
            this.tableName = data.table;
            this.struct = data.struct;
            this.loadStruct(this.struct);
            this.tableCrud.bootstrapTable('destroy');
            this.tableCrud.bootstrapTable();
        }

        this.tbody.html('');
        // this.loadData(data.data);
        
        this.tableName = data.table;

        /* cargamos los datos de la tabla */
        this.setData(data.data);

        this.tableCrud.bootstrapTable('uncheckAll');


        this.totalContainer.html('<b>Total de registros: </b>' + data.count);
        // calculamos la cantida de paginas que tendra el
        // paginador
        this.numPags = Math.ceil(data.count / this.totalRows);

        this.numPagsContainer.text(this.numPags);

        var dnis = this.get('.dni-copy');
        dnis.on('click', copyText);


       

        Titan.loader.hide();
    },

    /*
    * @name: setData
    * @description: ingresalos datos a la tabla
    * @params dataTable, los registros de la tabla
    * @return {void}
    */
    setData : function(dataTable){
    	for (var i in dataTable) {
            for (var k in dataTable[i]) {
                if (dataTable[i][k])
                    if ((typeof dataTable[i][k]) == 'object') {
                        if (dataTable[i][k]) {

                            if (this.struct[k].type == 'foranea') {
                                if (this.struct[k].dao) {
                                    if (this.struct[k].dao.column) {
                                        dataTable[i][k] = dataTable[i][k][this.struct[k].dao.column];
                                    }
                                } else if ('name' in dataTable[i][k])
                                    dataTable[i][k] = ('last_name' in dataTable[i][k]) ? dataTable[i][k].name +
                                    ' ' +
                                    dataTable[i][k].last_name :
                                    dataTable[i][k].name;

                            }
                        }
                    }
            }
        }
        this.tableCrud.bootstrapTable('destroy');
        this.tableCrud.bootstrapTable();

        this.dataTable = dataTable;

        if (this.crudMode == 'filter')
            this.tableCrud.bootstrapTable('load', dataTable);
        else
            this.tableCrud.bootstrapTable('load', dataTable);

        this.moduleContainer.find('td').attr('nowrap', 'nowrap');

    },

    /**
     * @name loadStruct
     * @description carga la estructura del formulario
     * @return {void}
     */
    loadStruct: function(dataStruct) {

        this.dataStruct = dataStruct;

        this.form.html("");
        this.opcion = {};
        for (var i in dataStruct) {
            if (i != -1) {

                var structField = dataStruct[i];

                var size = 0;
                var message = false;
                if (structField.dao) {
                    var size = structField.dao.size;
                }

                var formater = dataStruct[i].type + 'Formatter';

                formater = (window[formater]) ? formater : '';

                formaterField = i + 'Formatter';

                formater = (window[formaterField]) ? formaterField : formater;


                this.thead
                    .append('<th  data-halign="center" data-formatter="' +
                        formater +
                        '" data-field="' +
                        i +
                        '" data-sortable="true">' +
                        dataStruct[i].name + '</th>');
                switch (dataStruct[i].type) {
                    case 'foranea':

                        this.form.append('<div class="form-group ">' +
                            '<label class="col-sm-4 control-label" >' +
                            dataStruct[i].name + '</label>' +
                            '<div class="col-sm-7">' +
                            '<div class="input-group foreing">' +
                            '<input readonly id="input-foraing-' + dataStruct[i].table + '"  type="' + dataStruct[i].type +
                            '"  ' + ((i == 'id') ? 'readonly' : '') +
                            ' data-type="' + i +
                            '"  class="form-control"  ' +
                            ((dataStruct[i].name == 'Id') ? '' : ' ') +
                            '   ' + ((this.tableName == 'Deudor' && i == 'dni') ? 'data-container="body" data-trigger="manual" data-toggle="popover" data-placement="right" data-content="Esta cédula ya esta registrada en esta sucursal"' : ' ') + '>' +
                            '<div class="input-group-btn">' +
                            '<button id="btn-foraing-' + dataStruct[i].table + '" data-name="' + dataStruct[i].name + '"  data-table="' + dataStruct[i].table + '" type="button" class="btn btn-default"><span class="glyphicon glyphicon-list" aria-hidden="true"  data-table="' + dataStruct[i].table + '" ></span> Seleccione</button>' +
                            '</div>' +
                            '</div>' +
                            '</div></div>');

                        var btnForaing = this.form.find('#btn-foraing-' + dataStruct[i].table);
                        btnForaing.on('click', this.onClickForaing.bind(this));


                        break;
                    case 'checkbox':
                        this.form
                            .append('<div class="form-group ">' +
                                '<label class="col-sm-4 control-label" >' +
                                dataStruct[i].name +
                                '</label>' +
                                '<div class="col-sm-7 col-dsm-offset-1 ">' +
                                '<input type="' +
                                dataStruct[i].type +
                                '"  ' +
                                ((dataStruct[i].name == 'Id') ? 'readonly' :
                                    '') +
                                ' data-type="' +
                                i +
                                '"  id="' +
                                i +
                                '" ' +
                                ((dataStruct[i].name == 'Id') ? '' :
                                    ' ') + '>' +
                                '<label for="' + i + '"></label>' +
                                '</div></div>');
                        break;
                    case 'decimal':
                        this.form.append('<div class="form-group ">' +
                            '<label class="col-sm-4 control-label" >' +
                            dataStruct[i].name + '</label>' +
                            '<div class="col-sm-7">' +
                            '<input type="number" min="0" max="100" step="0.1" ' +
                            ((i == 'id') ? 'readonly' : '') +
                            ' data-type="' + i +
                            '"  class="form-control"  ' +
                            ((dataStruct[i].name == 'Id') ? '' : ' ') +
                            '>' +
                            '</div></div>');
                        break;
                    case 'textarea':
                        this.form
                            .append('<div class="form-group ">' +
                                '<label class="col-sm-4 control-label" >' +
                                dataStruct[i].name +
                                '</label>' +
                                '<div class="col-sm-7">' +
                                '<textarea  data-type="' +
                                i +
                                '" ' + ((size) ? 'maxlength=' + size : '') + ' class="form-control" rows="6" ></textarea>' +
                                '</div></div>');

                        break;
                    default:

                        this.form.append('<div class="form-group ">' +
                            '<label class="col-sm-4 control-label" >' +
                            dataStruct[i].name + '</label>' +
                            '<div class="col-sm-7">' +
                            '<input ' + ((size) ? 'maxlength=' + size : '') + ' type="' + dataStruct[i].type +
                            '"  ' + ((i == 'id') ? 'readonly' : '') +
                            ' data-type="' + i +
                            '"  class="form-control"  ' +
                            ((dataStruct[i].name == 'Id') ? '' : ' ') +
                            '   ' + ((this.tableName == 'Deudor' && i == 'dni') ? 'data-container="body" data-trigger="manual" data-toggle="popover" data-placement="right" data-content="Esta cédula ya esta registrada en esta sucursal"' : ' ') + '>' +
                            '</div></div>');
                        if (this.tableName == 'Deudor' && i == 'dni') {
                            this.inputdni = $("input[data-type='dni']");
                            this.select_debtor_subsidiary = $("select[data-type='subsidiary']");

                        }
                        break;
                }
            }
        };
    },


    /*
     * @name onClickForaing
     * @description ocurre al presionar el boton para cargar una foranéa
     * @return {void}
     */
    onClickForaing: function(e) {

        this.modalForeingBody.empty();

        var btn = $(e.target);
        var table = btn.attr('data-table');
        var name = btn.attr('data-name');
        this.modalForeingTitle.html(name);

        var params = {
            id: 'foreing_data_' + table,
            module: 'workspace',
            view: 'crud',
            table: table
        };
        Titan.view(params.module, params.view, this.modalForeingBody, {
            id: params.id,
            table: params.table
        });

        this.modalForeing.modal('show');

        this.tableForaing = table;

        this.btnSelectForeing.off('click');
        this.btnSelectForeing.on('click', this.onClickSelectForaing.bind(this));


        this.btnCancelForeing.off('click');
        this.btnCancelForeing.on('click', this.onClickCancelForaing.bind(this));


    },

    /*
     * @name onClickSelectForaing
     * @description describe la function
     * @return {void}
     */
    onClickSelectForaing: function(e) {


        var crud = Titan.app.workspace['crud_foreing_data_' + this.tableForaing];
        var row = crud.getSelectedRow();
        if (row) {
            var input = this.form.find('#input-foraing-' + this.tableForaing);
            input.val(row.name);
            input.attr('data-value', row.id);

            this.modalForeing.modal('hide');
        }


    },
    /*
     * @name onClickCancelForaing
     * @description describe la function
     * @return {void}
     */
    onClickCancelForaing: function(e) {

        this.modalForeing.modal('hide');
    },


    /*
     * @name getSelectedRow
     * @description describe la function
     * @return {object} la informacion de toda la fila seleccionada o null en caso de no haber selecionado nada aun
     */
    getSelectedRow: function(params) {
        var rows = this.tableCrud.bootstrapTable('getSelections');
        if (rows.length > 0) {
            return rows[0];
        } else {
            return null;
        }
    },

    /*
     * @name getSelectedRows
     * @description describe la function
     * @return {object} la informacion de toda la fila seleccionada o null en caso de no haber selecionado nada aun
     */
    getSelectedRows: function(params) {
        var rows = this.tableCrud.bootstrapTable('getSelections');
        if (rows.length > 0) {
            return rows;
        } else {
            return [];
        }
    },


    /*
     * @name clearErros
     * @description se encarga de limpiar los errores para crear o editar un nuevo rgistro
     * @return {void}
     */
    clearErros: function() {
        this.modal.find('.has-error').removeClass('has-error');
        this.modal.find('.error').remove();

    },


    save: function() {
        var params = {};
        this.inputList = this.modal.find('.modal-body input, .modal-body textarea');

        var firstFieldError = null;

        var error = false;
        /* sacamos los valores de los campos y los validamos */
        $.each(this.inputList, function(index, val) {
            if ($(val).attr('type') == 'checkbox') {
                params[this.params.table + '[' + $(val).attr('data-type') + ']'] = ($(val).is(':checked')) ? 1 : 0;
            } else if ($(val).attr('type') == 'foranea') {
                params[this.params.table + '[' + $(val).attr('data-type') + ']'] = $(val).attr('data-value');
            } else {

                var field = $(val);
                var data = field.attr('data-type');
                var value = $(field).val();

                var structField = this.dataStruct[data];

                var message = false;
                if (structField.dao) {
                    var size = structField.dao.size;
                    var validate = structField.dao.validate;
                    if (this.crudMode != 'filter') {
                        if (validate) {
                            if (validate.contains(',')) {
                                var validations = validate.split(',');
                                for (var i = 0; i < validations.length; i++) {
                                    var validation = validations[i];
                                    message = this.validate(value, validation);
                                }
                            } else {
                                var validation = validate;
                                message = this.validate(value, validation);
                            }
                        }
                    }

                    var divError = field.parent().parent().find('.error');

                    if (message) {
                        if (!firstFieldError) {
                            firstFieldError = field;
                        }
                        error = true;
                        field.parent().addClass('has-error');
                        if (divError.length > 0) {
                            divError.text(message);
                        } else {
                            var div = $('<div>');
                            div.addClass('col-md-7 col-md-offset-4 error');
                            field.parent().parent().append(div.append(message));
                        }
                    } else {
                        divError.remove();
                        field.parent().removeClass('has-error');

                    }


                }

                params[this.params.table + '[' + $(val).attr('data-type') + ']'] = $(val).val();
            }
        }.bind(this));

        this.selectList = $('.modal-body select');

        $.each(this.selectList, function(index, val) {


            params[this.params.table + '[' + $(val).attr('data-type') + ']'] = $(
                val).val();
            // params[''+_crud+'['+$(val).attr('data-type')+']'] =
            // $(val).val();
        }.bind(this));

        if (!error) {

            _cancel = false;


            switch (this.crudMode) {
                case 'new':
                    params.route = 'crud/create';
                    break;
                case 'edit':
                    params.route = 'crud/update/' + this.idRow;
                    break;
                case 'filter':
                    params.route = 'crud/filter';
                    break;
            }
            params.data_table = this.params.table;
            var a = WebService.post(params);
            a.done(function(data) {
                if (data.StatusResult == 'OK') {
                    $.each(this.inputList, function(index, val) {
                        $(val).val('');
                    });

                    var row = data.data;
                    /*for(var i in row) {
				 				if (typeof row[i] ==	 'object') {
					 				if (row[i].name) {
					 					row[i] = row[i].name;
						 			} else {
						 				row[i] = row[i].id;
						 			}
					 			}
				 			}*/

                    switch (this.crudMode) {
                        case 'new':
                            Titan.popup.success('Datos guardados exitosamente');
                            // var index = this.dataTable.length;
                            this.refresh();
                            // this.tableCrud.bootstrapTable('insertRow', {index: index, row: row});

                            break;
                        case 'edit':

                            var ids = $.map(this.dataTable, function(item, index) {
                                if (item.id == data.data.id) {
                                    return index;
                                }
                            });

                            var index = ids[0];
                            Titan.popup.success('Datos Actualizados exitosamente');
                            this.refresh();
                            // this.tableCrud.bootstrapTable('updateRow', {index: index, row: row});
                            break;
                        case 'filter':
                            var dataTable = data.data;
                            for (var i in dataTable) {
                                for (var k in dataTable[i]) {
                                    if (dataTable[i][k])
                                        if ((typeof dataTable[i][k]) == 'object') {
                                            if ('name' in dataTable[i][k]) {
                                                console
                                                    .log(dataTable[i][k]);
                                                dataTable[i][k] = ('last_name' in dataTable[i][k]) ? dataTable[i][k].name +
                                                    ' ' +
                                                    dataTable[i][k].last_name :
                                                    dataTable[i][k].name;
                                            }
                                        }
                                }
                            }
                            this.tableCrud.bootstrapTable('load', dataTable);


                            this.moduleContainer.find('td').attr('nowrap', 'nowrap');
                            this.filtrated = true;
                            this.btnFilter.html('<div class="fugue fugue-cross"></div> Cancelar filtro');
                            break;
                    }
                    // this.modal.modal('hide');
                    this.modal.hide('fade');

                } else {
                    if ('ErrorMessage' in data) {
                        Titan.message.error("Mensaje", data.ErrorMessage);
                    }
                }
            }.bind(this));
        } else {
            firstFieldError.focus();
        }
    },



    modeDelete: function(e) {
        var rows = this.getSelectedRows();
        if (rows.length > 0) {
            var row = rows[0];
            this.idRow = row.id;

            var msj = (rows.length <= 1) ? '¿desea eliminar este registro?' : '¿desea eliminar estos registros?';
            Titan.message.confirmation('Confirmación', msj, this.deleteMode,
                this, 'Si', 'No');
        } else {
            Titan.popup.warning('Debes selecionar un registro primero');
        };
    },


    /*
     * @name validate
     * @description describe la function
     * @params data, respuesta del servidor
     * @return {void}
     */
    validate: function(value, validation) {
        var regex = Titan.validate[validation].expression;
        if (regex.test(value)) {
            return false;
        } else {
            return Titan.validate[validation].message;
        }
    },


    /*
     * 
     * @name initEvents
     * 
     * @description inicia los eventos de los componentes del módulo
     * 
     * @return {void}
     * 
     */
    deleteMode: function(e) {
        var params = {};
        params.route = 'crud/erase/' + this.idRow;
        params.data_table = this.params.table;
        params.database_name = _database_name;

        var ids = this.getSelectedRows();

        var ids = $.map(ids, function(item, index) {
            return item.id;
        });

        params.ids = ids;

        var msj = (ids.length <= 1) ? 'El registro ha sido borrado exitosamente.' : 'Los registros han sido borrados exitosamente.';

        var a = WebService.post(params);
        a.done(function(data) {
            if (data.StatusResult == 'OK') {
                Titan.popup.success(msj);
                this.loadForPaginator = true;
                this.index();
            } else {
                if ('ErrorMessage' in data) {
                    Titan.popup.error("Error!", data.ErrorMessage);
                }
            }
        }.bind(this));
    },
    /*
     * 
     * @name initEvents
     * 
     * @description inicia los eventos de los componentes del módulo
     * 
     * @return {void}
     * 
     */
    trash: function(e) {
        this.idRow = $(e.target).attr('data-id');
    },
    /*
     * 
     * @name initEvents
     * 
     * @description inicia los eventos de los componentes del módulo
     * 
     * @return {void}
     * 
     */
    refresh: function(e) {
        this.loadForPaginator = true;
        this.index();
        this.inputPage.val(this.page);
    },
    /*
     * 
     * @name initEvents
     * 
     * @description inicia los eventos de los componentes del módulo
     * 
     * @return {void}
     * 
     */
    cancel: function(e) {
        _cancel = true;
        // this.modal.modal('hide');
        this.modal.hide('fade');

    },
    /*
     * 
     * @name initEvents
     * 
     * @description inicia los eventos de los componentes del módulo
     * 
     * @return {void}
     * 
     */
    modeNew: function(e) {
        this.crudMode = 'new';
        this.modalTitle.html("Registrar " + this.tableName);
        this.addSelectRequired();
        this.cleanFields();
        // debugger
        this.modal.show('fade');
    },
    /*
     * 
     * @name initEvents
     * 
     * @description inicia los eventos de los componentes del módulo
     * 
     * @return {void}
     * 
     */
    modeEdit: function(e) {
        this.crudMode = 'edit';
        this.modalTitle.html("Editar " + this.tableName);
        this.addSelectRequired();
    },
    /*
     * 
     * @name initEvents
     * 
     * @description inicia los eventos de los componentes del módulo
     * 
     * @return {void}
     * 
     */
    modeFilter: function(e) {
        if (this.filtrated) {
            this.btnFilter.html('<div class="fugue fugue-funnel"></div>Búsqueda avanzada');
            this.filtrated = false;
            this.refresh();

        } else {
            // $('#modal-crud-' + this.params.id).modal('show');

            this.crudMode = 'filter';
            this.modalTitle.html("Buscar " + this.tableName);
            this.removeSelectRequired();
            this.cleanFields();
            this.modal.show('fade');

        }
    },
    /*
     * 
     * @name initEvents
     * 
     * @description inicia los eventos de los componentes del módulo
     * 
     * @return {void}
     * 
     */
    removeSelectRequired: function() {
        this.comboboxs = $('#modal-crud-' + this.params.id).find('select');
        this.comboboxs.each(function(index, el) {
            $(el).find('option').first().prop('selected', true);
            if ($(el).val() != '')
                $(el).prepend('<option value=""></option>');
            $(el).val(0);
        });
    },
    /*
     * 
     * @name initEvents
     * 
     * @description inicia los eventos de los componentes del módulo
     * 
     * @return {void}
     * 
     */
    cleanFields: function() {
        this.inputs = $('#modal-crud-' + this.params.id).find('input');
        this.inputs.each(function(index, el) {
            $(el).val('');
        });
    },
    /*
     * 
     * @name initEvents
     * 
     * @description inicia los eventos de los componentes del módulo
     * 
     * @return {void}
     * 
     */
    addSelectRequired: function() {
        setTimeout(function() { this.modalBody.scrollTop(0); }.bind(this), 10);
        this.clearErros();

        this.comboboxs = this.get('#modal-crud-' + this.params.id).find('select');
        this.comboboxs.each(function(index, el) {
            $(el).find('option').first().prop('selected', true);
            if ($(el).val() == '')
                $(el).find('option').first().remove();
        });
    },

    edit: function(e) {
        var rows = this.tableCrud.bootstrapTable('getSelections');

        if (rows.length >= 2 ) {
            Titan.popup.warning('Debes selecionar un solo registro para poder editarlo.', 32000);
            return;
        }

        if (rows.length > 0) {
            this.crudMode = 'edit';

            this.modalTitle.html("Editar " + this.tableName);

            //$('#modal-crud-' + this.params.id).modal('show');
            this.modal.show('fade');

            var row = rows[0];
            this.idRow = row.id;
            var params = {};
            params.route = 'crud/edit/' + this.idRow;
            params.data_table = this.params.table;;
            var a = WebService.post(params);
            a.done(function(data) {
                row = data.data;

                function findById(source, name) {
                    for (var k in source) {
                        if (source[k]) {
                            if (((source[k].last_name) ? source[k].name +
                                    ' ' + source[k].last_name :
                                    source[k].name) == name) {
                                return source[k];
                            }
                        }
                    }
                }
                for (var i in row) {
                    var input_ = $('input[data-type=' + i + ']');
                    if (input_.length > 0) {
                        if (input_.attr('type') == 'checkbox') {
                            if (row[i] == 0) {
                                input_.attr('checked', false);
                            } else {
                                input_.attr('checked', true);
                            }
                        } else if (input_.attr('type') == 'foranea') {
                            input_.val(row[i].name);
                            input_.attr('data-value', row[i].id);
                        } else {
                            input_.val(row[i]);
                        }
                    } else {
                        var select = $('select[data-type=' + i + ']');
                        if (select.length > 0) {
                            /*
                             * var result = findById(this.opcion[i],
                             * row[i]);
                             * 
                             * console.log(result);
                             * 
                             * select.val(result.id);
                             */
                            select.val(row[i]);
                        } else {
                            var textarea = $('textarea[data-type=' + i +
                                ']');
                            if (textarea.length > 0) {
                                // var result = findById(this.opcion[i],
                                // row[i]);
                                console.log('entró');
                                textarea.val(row[i]);
                            }
                        }
                    }
                }
            });
        } else {
            Titan.popup.warning('Debes selecionar un registro primero');
        };

    },
});