
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

		inputelement = document.createElement("input");
		inputelement.type = "number";
		inputelement.min = "0";
		
		inputelement.style.width  = "100%";
		inputelement.style.height = "110%";
		inputelement.style.fontSize = "12px"
		inputelement.style.backgroundColor = "#EEEEEE"
		inputelement.style.color = "#000000"
		inputelement.style.borderColor = "#FFFFFF"
		inputelement.style.borderWidth = "0px"
		inputelement.style.outline = "none"
	
		
		plugin.registerattribute("textSM", "", text_set, text_get);
		plugin.registerattribute("onchanged", null);
		
		inputelement.addEventListener("change", text_changed, true);

		plugin.sprite.appendChild(inputelement);
		
		inputelement.addEventListener("mousedown", function(e){ e.stopPropagation(); }, true);

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

