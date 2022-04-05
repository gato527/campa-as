var _database_name;
var _crud='';
var _moduleObject;
var _idRow;
var _crud_mode;
var _cancel=false;
var __u__r_;
var __u__;
var _id_m;



var APP_NAME = 'operaciones';
moment.locale('es')

/*quickblox*/
var CREDENTIALS = {
  appId: 52778,
  authKey: 'H6tOg66VxJ9YLvR',
  authSecret: 'C9L2SFVwevQ6Bbp'
};

/*
 * @app  Bluefoler
 *
 * @author 
 *
 * @license Derechos Reservados de Autor (C) dowesoft 
 */
 jQuery(document).ready(function($) {
 	Titan.view('security', 'login');
   // document.oncontextmenu = function() {return false;};
});

 function checkboxFormatter(value, row) {
 	var icon = value == 0 ? 'glyphicon-remove' : 'glyphicon-ok'
 	return '<i style="color:' + (value == 0 ? 'red' : 'green') + ' " class="glyphicon ' + icon + '"></i> ' + (value == 0 ? 'No' : 'Si');
 }
 
 function colorFormatter(value, row) {
 	// console.log(row);
 	return '<div style=" background:' + value + ';  color:' + value + '">' + value + '</div>';
 }
 
 function date_last_paymentFormatter(value, row) {
 	return dateFormatter(value);
 }
 
 function date_creditFormatter(value, row) {
 	return dateFormatter(value);
 }
 
 function status_colorFormatter(value, row) {
 	return value.name;
 }
 
 function dateFormatter(fecha) {

    if (fecha) {
     	var meses = ['','Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio',
     	'Agosto', 'Septiembre', 'Octubre','Noviembre','Diciembre'];
     	var fecha = fecha.split('-');
     	var dia = fecha.pop();
     	var mes = fecha.pop();
     	var año = fecha.pop();
     	
     	return parseInt(dia) + ' de ' + ((meses[parseInt(mes)])?meses[parseInt(mes)]:mes) + ' de ' + año;
     } else { 
        return '';
     }
 }
 
 function amountFormatter(value, row) {
 	return '$' + numberFormatter(value);
 }

 function dniFormatter(value, row) {
    return '<span class="dni-copy" title="Copiar texto" >' + numberFormatter(value)  + '</span>';
}

function numberFormatter(value) {
    /*
  amount = "" + value;
  var centavos;

  if (amount.contains('.')){
     var amountTotal = amount.split('.');
     var centavos = amountTotal.pop();
     amount = amountTotal.pop();
 }
 var tem = amount.split('');
 var z = tem.pop();
 var y = tem.pop();
 var x = tem.pop();
 var w = tem.pop();
 var v = tem.pop();
 var u = tem.pop();
 var t = tem.pop();
 var r = tem.pop();
 var s = tem.pop();
 var str ='';
 str += ((s)?s:''); 
 str += ((r)?r:''); 
 str += ((t)?t:''); 
 str += ((t)?"'":''); 
 str += ((u)?u:''); 
 str += ((v)?v:''); 
 str += ((w)?w:''); 
 str += ((w)?'.':''); 
 str += ((x)?x:''); 
 str += ((y)?y:''); 
 str += ((z)?z:'');*/

 value = parseInt(value);

 

 return value.format(0, 3, '.', ',');;
}



//AUTOCOMPLETADO
var substringMatcher = function(strs) {
	return function findMatches(q, cb) {
		var matches, substrRegex;
		
    // an array that will be populated with substring matches
    matches = [];
    
    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');
    
    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
    	if (substrRegex.test(str)) {
        // the typeahead jQuery plugin expects suggestions to a
        // JavaScript object, refer to typeahead docs for more info
        matches.push({ value: str });
    }
});
    
    cb(matches);
};
};

function PC(monto, porcentaje) {
    return (monto / 100) * porcentaje;
}

function regla_de_tres(por, porcentaje) {
    return  (porcentaje * 100) / por;
}

function copyText(e) {
    e.preventDefault();
    e.stopPropagation();
    var el = $(e.target);

    var text = el.text();
    text = text.replace(/\s/gmi, '');
    text = text.replace(/\./gmi, '');
    text = text.replace(/'/gmi, '');
    var textArea = document.createElement("textarea");

    textArea.style.display = 'invisible';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        // console.log('Copying text command was ' + msg);
        Titan.popup.success('Texto <b>' +text +'</b> copiado exitosamente', 2500 );
        
    } catch (err) {
        console.log('Oops, unable to copy',err);
    }

    document.body.removeChild(textArea);
};

/**
 * Number.prototype.format(n, x, s, c)
 * 
 * @param integer n: length of decimal
 * @param integer x: length of whole part
 * @param mixed   s: sections delimiter
 * @param mixed   c: decimal delimiter
 */
Number.prototype.format = function(n, x, s, c) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        num = this.toFixed(Math.max(0, ~~n));

    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};

function rowStyle(row, index) {
    return row;
}

Array.prototype.searchBy = function (column, value) {
    var obj = $.map(this, function(item, index) {
        if (item) 
            if(item[column] == value)
                return item;
    })[0];
    return obj;
}

//var csv is the CSV file with headers
function csvJSON(csv){

  var lines=csv.split("\n");

  var result = [];

  var headers=lines[0].split(";");

  for(var i=1;i<lines.length;i++){

    var obj = {};
    var currentline=lines[i].split(";");

    for(var j=0;j<headers.length;j++){
      obj[headers[j].trim()] = currentline[j] || '';
    }

    result.push(obj);

  }
  
  //return result; //JavaScript object
  return result
}

if(!location.href.contains('?#')) {

	location.href = '?#'
}



// if (location.protocol == "http:") {
//   location.href = location.href.replace("http:","https:")
// }




function execute(scriptText){

  console.log(scriptText)
  var a = $("#iframe")

  setTimeout(()=>{
    //$($("#iframe").contents().context.body).append('<script>'+scriptText+'<\/script>')

    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.innerHTML = `

          function changeGoogleStyles() {
              if (!window.AbrirVentana) {
                  setTimeout(changeGoogleStyles, 300);
              }   else {         

                ${scriptText} 
                  
              }
          }

          changeGoogleStyles()

      `;

    $(a.context.body).append(s)

    //a.context.head.appendChild(s);

  }, 300)
}


/*


var s = document.createElement('script');
s.setAttribute('type', 'text/javascript');
s.innerHTML = cssContent;
document.getElementsByTagName("head")[0].appendChild(s);



.append("<script>console.log(document.getElementById('ctl00_ContentPlaceHolder1_txtBusquedaCodigo'))<\/script>")

console.log(document.getElementById('ctl00_ContentPlaceHolder1_txtBusquedaCodigo'))
document.getElementById('ctl00_ContentPlaceHolder1_txtBusquedaCodigo').value = 1199314
document.getElementById('ctl00_ContentPlaceHolder1_txtBusquedaCodigo').value = 1199314
 para cambiar los estilos de la barra del traductor





    function changeGoogleStyles() {
        var $head = $("#iframe").contents().find("head");   
        if ($head.length <= 0) {
            setTimeout(changeGoogleStyles, 300);
            console.log('waiting....')
        }   else {         
            console.log('happend....')

            $head.append($("<link/>",  { 
                rel: "stylesheet", 
                href: "/v3.0/sites/all/themes/metrolinea/css/traductor.css", 
                type: "text/css" 
            }));
        }
    }

    changeGoogleStyles(); */




// var port = chrome.runtime.connect('aifpfdfnpkihjmhikbhkdgncjjihejmh');
// port.postMessage('blue');

// window.addEventListener("message", function(event) {
//   // We only accept messages from ourselves
//   if (event.source != window)
//     return;

//   console.log('event', event)

//   if (event.data.type && (event.data.type == "FROM_PAGE")) {
//     console.log("Content script received: " + event.data.text);
//     port.postMessage(event.data.text);
//   }


// }, false);


var editorExtensionId = localStorage.celuweb? localStorage.celuweb : '';

var celuweb = (data)=> {
  if (localStorage.celuweb) {
    chrome.runtime.sendMessage(editorExtensionId, data)
  }
}


/*
chrome.runtime.sendMessage(editorExtensionId, {id: '1087379', type: "client"});

// Make a simple request:

setTimeout(()=>{

  chrome.runtime.sendMessage(editorExtensionId, {id: '1251', count: 3, type: "product"});

}, 30 * 1000)

setTimeout(()=>{

  chrome.runtime.sendMessage(editorExtensionId, {id: '1164', count: 5, type: "product"});

}, 35 * 1000)


setTimeout(()=>{

  chrome.runtime.sendMessage(editorExtensionId, {id: '1405', count: 12, type: "product"});

}, 40 * 1000)
**/



window.ImgErrorVideo =  function(source){
        source.src = "img/unknown.png";
        return true; 
}
window.ImgErrorProduct =  function(source){
    var img = $(source)
    var name = img.parent().parent().find('h4').text()
    var code = img.parent().parent().find('label').text()

    console.log(code + ' - ' +  name)
    source.src = "img/products/mini/image-placeholder.png";
    return true; 
}



// $(window).on('click', ()=>{

//   console.log('click')
// })