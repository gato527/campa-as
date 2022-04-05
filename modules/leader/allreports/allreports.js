/*
 * @module  Allreports
 *
 * @author edwinandeka@gmail.com (Edwin Ramiro Ospina Ruiz)
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */

Titan.modules.create({
    name: "Allreports",
    /*
     * @constructor @description inicia los componentes del módulo
     */
    ready: function () {},

    /*
     * @name dataReport
     * @description description
     * @return {void}
     */
    process: function (elem) {
        if (this.reportSelected) {
            WebService.post({
                route: "allreports/" + this.reportSelected,
                initDate: this.initDate.val(),
                endDate: this.endDate.val(),
            }).done(this.onReport.bind(this));
        } else {
            Titan.popup.info("Selecione el tipo de reporte");
        }
    },

    /**
     * @name onReport
     * @description description
     * @params data Server response
     * @return {void}
     */
    onReport: function (data) {
        // let { headers, report} = data
        // let reportData = '';

        // reportData += Object.values(headers).join(';') + '\n';

        // Object.values(report).map((row) => {
        //   	let rowData = Object.keys(headers).map(h => row[h])
        // 	reportData += rowData.join(';') + '\n'
        // })

        // var csvData = new Blob(["\ufeff",reportData], {encoding:"UTF-8",type:"text/csv;charset=UTF-8"});
        // saveAs(csvData, this.nameReport +".csv", true);

        let { headers, report } = data;
        let reportData = "sep=,\n";

        if (!data.report) {
            toast("No hay resultados para la consulta");
            return;
        }

        reportData += Object.values(headers).join(",") + "\n";

        Object.values(report).map((row) => {
            let rowData = Object.keys(headers).map((h) => {
                return (row[h] + "").replace(/\n/gim, "");
            });
            reportData += rowData.join(",") + "\n";
        });

        // var csvData = new Blob(["\ufeff",  reportData], { encoding: "UTF-8", type: "application/vnd.ms-excel" });
	    var csvData = new Blob([reportData], {encoding:"UTF-8", type:"text/csv;charset=UTF-8"});
	    // var csvData = new Blob(["\ufeff",reportData], {encoding:"UTF-8",type:"text/csv;charset=UTF-8"});
        saveAs(csvData, this.nameReport + ".csv", true);
    },

    /**
     * @name onSelectReport
     * @description description
     * @params data Server response
     * @return {void}
     */
    onSelectReport: function (elem, val) {
        this.reportSelected = val;
        this.nameReport = elem.find(":selected").text().replace(/\s/gim, "-");

        let isDates = elem.find(":selected").attr("data-date");

        this.initDate.val("");
        this.endDate.val("");

        if (isDates == "show") {
            this.initDate.parent().css("display", "inline-block");
            this.endDate.parent().css("display", "inline-block");
        } else {
            this.initDate.parent()[isDates]();
            this.endDate.parent()[isDates]();
        }
    },
});
