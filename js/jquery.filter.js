/* 
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz)
 * @date 07-Mar-2016
 * @version 1.0 
 */





(function( $ ){

jQuery.extend({
    highlight: function (node, re, nodeName, className) {
        if (node.nodeType === 3) {
            var match = node.data.match(re);
            if (match) {
                var highlight = document.createElement(nodeName || 'span');
                highlight.className = className || 'highlight';
                var wordNode = node.splitText(match.index);
                wordNode.splitText(match[0].length);
                var wordClone = wordNode.cloneNode(true);
                highlight.appendChild(wordClone);
                wordNode.parentNode.replaceChild(highlight, wordNode);
                return 1; //skip added node in parent
            }
        } else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
                !/(script|style)/i.test(node.tagName) && // ignore script and style nodes
                !(node.tagName === nodeName.toUpperCase() && node.className === className)) { // skip if already highlighted
            for (var i = 0; i < node.childNodes.length; i++) {
                i += jQuery.highlight(node.childNodes[i], re, nodeName, className);
            }
        }
        return 0;
    }
});

jQuery.fn.unhighlight = function (options) {
    var settings = { className: 'highlight', element: 'span' };
    jQuery.extend(settings, options);

    return this.find(settings.element + "." + settings.className).each(function () {
        var parent = this.parentNode;
        parent.replaceChild(this.firstChild, this);
        parent.normalize();
    }).end();
};

jQuery.fn.highlight = function (words, options) {
    var settings = { className: 'highlight', element: 'span', caseSensitive: false, wordsOnly: false };
    jQuery.extend(settings, options);

    if (words.constructor === String) {
        words = [words];
    }
    words = jQuery.grep(words, function(word, i){
      return word != '';
    });
    words = jQuery.map(words, function(word, i) {
      return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    });
    if (words.length == 0) { return this; };

    var flag = settings.caseSensitive ? "" : "i";
    var pattern = "(" + words.join("|") + ")";
    if (settings.wordsOnly) {
        pattern = "\\b" + pattern + "\\b";
    }
    var re = new RegExp(pattern, flag);

    return this.each(function () {
        jQuery.highlight(this, re, settings.element, settings.className);
    });
};

    
   $.fn.jFilter = function(opc) {

    if (!String.prototype.contains) {
      String.prototype.contains = function (c) {
         return this.indexOf(c) != -1
      }
    }

    if (opc.highlight) {

      var style = 'span.highlight {background: #fdf59a;}'
      var s = document.createElement('style');
      s.setAttribute('type', 'text/css');
      s.innerHTML = style;
      document.getElementsByTagName("head")[0].appendChild(s);

    }

    if (typeof opc.container  == 'string') {
      opc.container = $(opc.container);
    }

       var findId = function( el ){
            if(el.attr('id') === opc.hide.replace('#','')){
               return el;
            }
            return findId(el.parent());
         };

         var findClass = function( el ){
            if(el.hasClass(opc.hide.replace('.',''))){
               return el;
            }
            return findClass(el.parent());
         };

          var findElement = function( el, parent ){
            var elment = parent.find(opc.hide);
            if(elment.length > 0){
               return el;
            }
            return findElement(parent, parent.parent());
         };

        var  onSearch = function(event) {
          event.preventDefault();

          var text = $(event.target).val();
          $.each(opc.container.find(opc.findBy) , function(index, el) {

            var str = $(el).html();

            str = str.replace(/<[\w-:="';. _(),#.]+>/gmi, "");
            str = str.replace(/<\/[\w-:="';. _(),#.]+>/gmi, "");   

            str = str.toLowerCase();  
          
           
            if (opc.hide.contains('#')) {
               el = findId($(el));
            } else if (opc.hide.contains('.')) {
               el = findClass($(el));
            } else {
                el = findElement($(el), $(el).parent());
            }

            if(str.contains(text.toLowerCase())){
               el.show();
              if (opc.highlight) {
                $(el).unhighlight(text)
                $(el).highlight(text)
              }
            } else{
               el.hide();
            }
          });

          opc.container.find('#jfilter-message').remove();
          if (opc.container.find(opc.hide).not('[style="display: none;"]').length <= 0 
            &&  opc.message) {
            opc.container.append('<div id="jfilter-message">' + opc.message + '</div>')
          } 
         };
        
      var input = this;
      input.on('keyup', onSearch);

      return this;
   }; 
})( jQuery );