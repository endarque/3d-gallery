/*
	krpano - super simple html5 text TEXTAREA plugin
*/

var krpanoplugin = function()
{
	var local = this;

	var krpano = null;
	var plugin = null;
	
	var inputelement = null;

	local.registerplugin = function(krpanointerface, pluginpath, pluginobject)
	{
		krpano = krpanointerface;
		plugin = pluginobject;
		inputelement = document.createElement("TEXTAREA");
		inputelement.placeholder = pluginobject.placeholder ? pluginobject.placeholder : 'Enter Text Here...';
		inputelement.style.width  = "100%";
		inputelement.style.height = "100%";
		inputelement.style.fontSize = "12px"
		inputelement.style.backgroundColor = "#333333"
		inputelement.style.color = "#FFFFFF"
		inputelement.style.fontFamily = "Verdana"
		inputelement.style.lineHeight = "20px"
		inputelement.style.padding = "10px"
		inputelement.style.borderColor = "#FFFFFF"
		inputelement.style.borderWidth = "1px"
		inputelement.spellcheck = false;

		plugin.registerattribute("textSM", "", text_set, text_get);
		plugin.registerattribute("onchanged", null);
		
		inputelement.addEventListener("change", text_changed, true);
		
		plugin.sprite.appendChild(inputelement);
	}

	local.unloadplugin = function()
	{
		plugin = null;
		krpano = null;
	}
	
	function text_set(newtext)
	{
		inputelement.value = newtext;
	}
	
	function text_get()
	{
		return inputelement.value;
	}
	
	function text_changed()
	{
		krpano.call(plugin.onchanged, plugin);
	}
};


