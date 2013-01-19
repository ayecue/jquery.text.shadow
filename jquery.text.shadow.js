/*
 * Plugin: jquery.text.shadow
 * Version: 1.4a
 *
 * Description:
 * - Improved text-shadow plugin for jQuery.
 */
(function($){
	var methods=[function(rx){return {x:0,y:0};},function(rx){return {x:rx[0],y:rx[0]};},function(rx){return {x:rx[0],y:rx[1]};},function(rx){return {x:rx[0],y:rx[1],radius:rx[2]};}];
	$.extend($,{
		textShadowParseEx:function(value){
			var position=value.match(/(^|\s)-?(\d+)(?=[a-z%]*)/gi),
				color=value.match(/#[0-9a-f]+|(?:rgb|hsb)a?\([^\)]*\)|\b[a-z]+\b/i),
				shadow={x:0,y:0,radius:0,color:color[0] || 'transparent'},
				posLength=position.length || 0,
				colorLength=color.length || 0;
			
			if (posLength>0 || colorLength>0)
			{
				$.extend(shadow,methods[Math.min(3,posLength)](position));
				if ((!shadow.x && !shadow.y && !shadow.radius) || shadow.color == 'transparent')
					$.extend(shadow,{x:0,y:0,radius:0,color:null});
			}
			
			return shadow;
		},
		textShadowParse:function(str){
			var values=str.split(','),index=values.length;
		
			if (index>0)
			{
				var stack=[];
			
				while(index--)
					stack.push(this.textShadowParseEx(values[index]))

				return stack;
			}
			
			return [this.textShadowParseEx(str)];
		}
	});
	$.fn.textShadowParse=function(value){
		return $.textShadowParse(value);
	}
})(jQuery);
$.browser.msie 
	? (function($){
		var textShadow=function(element){
			var shadowElement=document.createElement('span');
		
			return $.extend(this,{
				append:function(){
					var nodes=element.childNodes;
					for (var i=0,il=nodes.length;i<il;i++)
						if (! /jQueryTextShadow/i.test(nodes[i].className))
							shadowElement.appendChild(nodes[i].cloneNode(true));
						
					element.appendChild(shadowElement);
					
					if ((element.offsetHeight || element.clientHeight)<(shadowElement.offsetHeight || shadowElement.clientHeight))
							shadowElement.style.width=(parseInt(shadowElement.style.width)+1)+'px';
				},
				set:function(options){
					shadowElement.className='jQueryTextShadow index'+options.index;

					try
					{
						$.extend(shadowElement.style,{
							padding:options.padding,
							width:options.width+'px',
							position:'absolute',
							zIndex:'-1',
							color:options.color,
							left:options.posX+'px',
							top:options.posY+'px'
						});
					} 
					catch(e) {return false;}

					if (options.radius!=0)
						shadowElement.style.filter=options.opacity!=null 
							? 'progid:DXImageTransform.Microsoft.Blur(pixelradius='+parseInt(options.radius)+', enabled=\'true\', makeShadow=\'true\', ShadowOpacity='+options.opacity+')'
							: 'progid:DXImageTransform.Microsoft.Blur(pixelradius='+parseInt(options.radius)+', enabled=\'true\')';
							
					return true;
				},
				destroy:function(){
					if (shadowElement.parentNode) element.removeChild(shadowElement);
				}
			});
		};
		$.extend(textShadow,{
			prepareParent:$.browser.version<8 
				? function (element) {
					element.style.zoom=1;
					element.style.zIndex=0;
					if (element.currentStyle['position']!='absolute') element.style.position='relative';
				} 
				: function (element) {;
					element.style.zIndex=0;
					if (element.currentStyle['position']!='absolute') element.style.position='relative';
				},
			getIndex:function(el,shadow)
			{
				if (!('textShadowController' in el))
				{
					textShadow.prepareParent(el);
					el.textShadowController={stackSize:1,stack:[shadow],freeSize:0,free:[]};
					
					return 0;
				}
				
				var index=el.textShadowController.freeSize>0 ? el.textShadowController.free[--el.textShadowController.freeSize] : el.textShadowController.stackSize++;
				el.textShadowController.stack[index]=shadow;
				
				return index;
			},
			add:function(el,props){
				if (props.x==0 && props.y==0 && props.radius==0) return false;
			
				var style=el.currentStyle,
					shadow=new textShadow(el),
					index=textShadow.getIndex(el,shadow),
					config={
					padding:style["padding"],
					width:Math.max(0,(el.offsetWidth || el.clientWidth)-parseInt(style['padding-left'])-parseInt(style['padding-right'])),
					color:props.color!=null ? props.color : el.style.color,
					posX:(-parseInt(props.radius)+parseInt(props.x)),
					posY:(-parseInt(props.radius)+parseInt(props.y)),
					radius: props.radius || 0,
					index: index
				};
				
				shadow.set(config) ? shadow.append() : textShadow.remove(el,index);	
			},
			remove:function(el,textShadowIndex){
				if (textShadowIndex in el.textShadowController.stack)
				{
					el.textShadowController.stack[textShadowIndex].destroy();
					el.textShadowController.stack[textShadowIndex]=null;
					delete el.textShadowController.stack[textShadowIndex];
					el.textShadowController.free[el.textShadowController.freeSize++]=textShadowIndex;
					
					return true;
				}
				
				return false;
			},
			addMethods:{
				0:function(c){
					for (var index=0,indexLength=c.length;index<indexLength;index++)
					{
						var parse=$.textShadowParse(c[index].currentStyle['text-shadow']);
						for (var j=0,jl=parse.length;j<jl;j++)
							textShadow.add(c[index],parse[j]);
					}
				},
				1:function(c,options){
					for (var index=0,indexLength=c.length;index<indexLength;index++)
					{
						if ("length" in options)
							for (var j=0,jl=options.length;j<jl;j++)
								textShadow.add(c[index],$.extend({x:0,y:0,radius:0,color:null},options[j]));
						else
							textShadow.add(c[index],$.extend({x:0,y:0,radius:0,color:null},options));
					}
				},
				2:function(c,options){
					for (var index=0,indexLength=c.length;index<indexLength;index++)
					{
						var parse=$.textShadowParse(c[index].currentStyle['text-shadow']),
							j=Math.max(options.length || 0,parse.length);
					
						if (j>0)
						{
							while(j--)
								textShadow.add(c[index],(options[j] && parse[j]) 
															? $.extend(options[j],parse[j]) 
															: (options[j])
																? options[j]
																: parse[j]);
						}
						else
							textShadow.add(c[index],$.extend(options,parse[0]));
					}
				}
			}
		});
		$.extend($.fn,{
			textShadow:function(options,auto){
				var argsLength=arguments.length;
			
				if (argsLength in textShadow.addMethods)
					textShadow.addMethods[argsLength](this,options);
			},
			textShadowRemove:function(textShadowIndex){
				for (var index=0,indexLength=this.length;index<indexLength;index++)
				{
					var el=this[index];
					if ('textShadowController' in el)
					{
						if (arguments.length>0)
							textShadow.remove(el,textShadowIndex);
						else
							for (var index=0,indexLength=el.textShadowController.stack.length;index<indexLength;index++)
								textShadow.remove(el,index);
					}
				}
			}
		});
	})(jQuery)
	: (function($){
		$.extend($.fn,{
			textShadow:function(){return true},
			textShadowRemove:function(){return true}
		});
	})(jQuery);
