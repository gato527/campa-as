var dataTempListMenu = {};
var EventTempListMenu = {};
var $indexItem = 1;


jQuery.fn.listMenu = function (method, data) {
	$id = $(this).attr('id');
	var $list = $(this);
	

	if ( typeof list == 'array')
		list = list[0];

	switch(method){
		case 'load':

		 	$indexItem = 1;

			if (data) {
				if (dataTempListMenu[$id]) {
					dataTempListMenu[$id] = dataTempListMenu[$id].concat(data);
				} else {
					dataTempListMenu[$id] = data;
				}
				for(k in data)
					if(k < data.length)
						listMenuLoad(data[k]);
			} else{
				console.error('not found param data for load    listMenu("load" , data);');
			};
			
			break;

			case 'append':
			if (data) {
				if (dataTempListMenu[$id]) {
					dataTempListMenu[$id] = dataTempListMenu[$id].concat(data);
				} else {
					dataTempListMenu[$id] = data;
				}
				for(k in data)
					if(k < data.length)
						listMenuLoad(data[k]);
			} else{
				console.error('not found param data for load    listMenu("load" , data);');
			};
			
			break;

		case 'getIndex':
			return getIndex();
		break;

		case 'getData':
			return dataTempListMenu[$id];
		break;
		case 'getSelected':
			return (dataTempListMenu[$id][getIndex()])?dataTempListMenu[$id][getIndex()]:{};
		break;

		case 'getSelectedHtml':
			return getIndexHtml();
		break;

		case 'next':
			next();
			break;
			
		case 'back':
			back();
		break;

		case 'onClick':
			if (typeof data == 'function') {
				EventTempListMenu[$id] = data;
			}else{
				console.error('not found param function,  listMenu("onClick" , function);');
			}
			
		break;
	}



	function listMenuLoad (argData) {
		

		function addDiv(container, index) {
			var $tem = $('<div class="'+index+'"></div>');
			$tem.append(argData[index]);
			container.append($tem);
		}

		var $containerMain = $('<div class="list-menu-container"></div>');

		//contenedores
		
		for (var i = 1; i <= 4; i++) {
			var $containerTem = $('<div  id="list-menu-container'+ $indexItem +'" class="list-menu-container'+ i +'"></div>');
			
			if (argData['l'+i]) 
				addDiv($containerTem, 'l'+i);
			
			if (argData['r'+i]) 
				addDiv($containerTem, 'r'+i);

			$containerMain.append($containerTem);
			$indexItem++;
		}

		$list.append($containerMain);

		$list.find('.list-menu-container').unbind('click').on('click', function(e) {
			$list.find('.list-menu-container').removeClass('active');
			$(this).addClass('active');
			if (EventTempListMenu[$id]) 
				EventTempListMenu[$id](e);
		});
	}

	function getIndex() {
		var listOptions = $list.find('.list-menu-container');
		if ("eka".contains){}else{
			String.prototype.contains = function(it) { return this.indexOf(it) != -1; };
		} 
		var indexTem = -1;
		$.each(listOptions, function(index, val) {
			if ($(val).attr('class').contains('active')){
				indexTem = index;
			}
		});
		return indexTem;

	}


	function next() {
		if (getIndex() != -1) {
			var index = getIndex();
			$($list.find('.list-menu-container')[index+1]).click();
		}else{
			$list.find('.list-menu-container').first().click();
		}
	}

	function back() {
		if (getIndex() != -1) {
			var index = getIndex();
			$($list.find('.list-menu-container')[index-1]).click();
		}else{
			$list.find('.list-menu-container').first().click();
		}
	}

	function getIndexHtml() {
		var listOptions = $list.find('.list-menu-container');
		if ("eka".contains){}else{
			String.prototype.contains = function(it) { return this.indexOf(it) != -1; };
		} 
		var htmlTem = '';
		$.each(listOptions, function(index, val) {
			if ($(val).attr('class').contains('active')){
				htmlTem = val;
			}
		});

		if (data) {
			if (data == true) 
				return $(htmlTem);
		}
		return htmlTem;

	}
};


