(function(e){var t=[function(e){return{x:0,y:0}},function(e){return{x:e[0],y:e[0]}},function(e){return{x:e[0],y:e[1]}},function(e){return{x:e[0],y:e[1],radius:e[2]}}];e.extend(e,{textShadowParseEx:function(n){var r=n.match(/(^|\s)-?(\d+)(?=[a-z%]+|\s|$)/gi),i=n.match(/#[\da-f]{3,6}|(?:rgb|hsb)a?\(.*?\)|[a-z]+/i),s={x:0,y:0,radius:0,color:i[0]||"transparent"},o=r.length||0,u=i.length||0;if(o>0||u>0){e.extend(s,t[Math.min(3,o)](r));if(!s.x&&!s.y&&!s.radius||s.color=="transparent")e.extend(s,{x:0,y:0,radius:0,color:null})}return s},textShadowParse:function(e){var t=e.split(","),n=t.length;if(n>0){var r=[];while(n--)r.push(this.textShadowParseEx(t[n]));return r}return[this.textShadowParseEx(e)]}});e.fn.textShadowParse=function(t){return e.textShadowParse(t)}})(jQuery);$.browser.msie?function(e){var t=function(t){var n=document.createElement("span");return e.extend(this,{append:function(){var e=t.childNodes;for(var r=0,i=e.length;r<i;r++)if(!/jQueryTextShadow/i.test(e[r].className))n.appendChild(e[r].cloneNode(true));t.appendChild(n);if((t.offsetHeight||t.clientHeight)<(n.offsetHeight||n.clientHeight))n.style.width=parseInt(n.style.width)+1+"px"},set:function(t){n.className="jQueryTextShadow index"+t.index;try{e.extend(n.style,{padding:t.padding,width:t.width+"px",position:"absolute",zIndex:"-1",color:t.color,left:t.posX+"px",top:t.posY+"px"})}catch(r){return false}if(t.radius!=0)n.style.filter=t.opacity!=null?"progid:DXImageTransform.Microsoft.Blur(pixelradius="+parseInt(t.radius)+", enabled='true', makeShadow='true', ShadowOpacity="+t.opacity+")":"progid:DXImageTransform.Microsoft.Blur(pixelradius="+parseInt(t.radius)+", enabled='true')";return true},destroy:function(){if(n.parentNode)t.removeChild(n)}})};e.extend(t,{prepareParent:e.browser.version<8?function(e){e.style.zoom=1;e.style.zIndex=0;if(e.currentStyle["position"]!="absolute")e.style.position="relative"}:function(e){e.style.zIndex=0;if(e.currentStyle["position"]!="absolute")e.style.position="relative"},getIndex:function(e,n){if(!("textShadowController"in e)){t.prepareParent(e);e.textShadowController={stackSize:1,stack:[n],freeSize:0,free:[]};return 0}var r=e.textShadowController.freeSize>0?e.textShadowController.free[--e.textShadowController.freeSize]:e.textShadowController.stackSize++;e.textShadowController.stack[r]=n;return r},add:function(e,n){if(n.x==0&&n.y==0&&n.radius==0)return false;var r=e.currentStyle,i=new t(e),s=t.getIndex(e,i),o={padding:r["padding"],width:Math.max(0,(e.offsetWidth||e.clientWidth)-parseInt(r["padding-left"])-parseInt(r["padding-right"])),color:n.color!=null?n.color:e.style.color,posX:-parseInt(n.radius)+parseInt(n.x),posY:-parseInt(n.radius)+parseInt(n.y),radius:n.radius||0,index:s};i.set(o)?i.append():t.remove(e,s)},remove:function(e,t){if(t in e.textShadowController.stack){e.textShadowController.stack[t].destroy();e.textShadowController.stack[t]=null;delete e.textShadowController.stack[t];e.textShadowController.free[e.textShadowController.freeSize++]=t;return true}return false},addMethods:{0:function(n){for(var r=0,i=n.length;r<i;r++){var s=e.textShadowParse(n[r].currentStyle["text-shadow"]);for(var o=0,u=s.length;o<u;o++)t.add(n[r],s[o])}},1:function(n,r){for(var i=0,s=n.length;i<s;i++){if("length"in r)for(var o=0,u=r.length;o<u;o++)t.add(n[i],e.extend({x:0,y:0,radius:0,color:null},r[o]));else t.add(n[i],e.extend({x:0,y:0,radius:0,color:null},r))}},2:function(n,r){for(var i=0,s=n.length;i<s;i++){var o=e.textShadowParse(n[i].currentStyle["text-shadow"]),u=Math.max(r.length||0,o.length);if(u>0){while(u--)t.add(n[i],r[u]&&o[u]?e.extend(r[u],o[u]):r[u]?r[u]:o[u])}else t.add(n[i],e.extend(r,o[0]))}}}});e.extend(e.fn,{textShadow:function(e,n){var r=arguments.length;if(r in t.addMethods)t.addMethods[r](this,e)},textShadowRemove:function(e){for(var n=0,r=this.length;n<r;n++){var i=this[n];if("textShadowController"in i){if(arguments.length>0)t.remove(i,e);else for(var n=0,r=i.textShadowController.stack.length;n<r;n++)t.remove(i,n)}}}})}(jQuery):function(e){e.extend(e.fn,{textShadow:function(){return true},textShadowRemove:function(){return true}})}(jQuery)