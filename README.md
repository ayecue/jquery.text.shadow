# cssReader (jQuery Plugin)
* Author: ayecue
* Version: 1.4b
* Language: Javascript
* Framework: jQuery
* JSPerf: http://jsperf.com/testingtextshaodwieyouknow/11


## Description:
A simple text-shadow plugin for the IE. This plugin will be faster than the normal jQuery text shadow plugin. There's also a new feature where you can add multiple text-shadows to one element.

### Examples:

	//Add text-shadow with the properties in the CSS file
	$('#my_element').textShadow();
	
	//Add text-shadow with own properties
	$('#my_element').textShadow({x:0,y:1,color:'#FFF'});
	
	//Add multiple text-shadows with own properties
	$('#my_element').textShadow([{x:0,y:1,color:'#FFF'},{x:1,y:0,color:'red'}]);
	
	//Add text-shadow with own properties and the properties in the CSS file
	$('#my_element').textShadow({color:'#FFF'},true);
	
	
	//Return an array with all properties given
	$('#my_element').textShadowParse('0 1px 0 #FFF');
	
	
	//Remove every text-shadow of an element
	$('#my_element').textShadowRemove();
	
	//Remove the text-shadow which got index: 1
	$('#my_element').textShadowRemove(1);
