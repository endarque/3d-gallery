	// По умолчанию
	// backgroundcolor="#ffffff"	
	// value="10" 
	// min="0" 
	// max="1" 
	// step="0.01" 
	// onchanged=""
 		
var krpanoplugin = function()
{	
	var local = this;

	var krpano = null;
	var plugin = null;
	
	var slaider = null;
	var vvod = null;	

	local.registerplugin = function(krpanointerface, pluginpath, pluginobject)
	{
		krpano = krpanointerface;
		plugin = pluginobject;

		// *************  слайдер ***********************
		
		// подключить стиль css. Путь css_slaider.path прописан в  style_addhs.xml
		var css_sl = krpano.get("css_slaider.path"); 
		includeCSS(css_sl);	
		
		slaider = document.createElement("input");
		slaider.type = "range";
		slaider.setAttribute("class", "slider_adhs");
	
		// когда атрибут будет задан из xml или через интерфейс set, будет вызвана функция setter с новым значением
		// когда значение атрибута будет прочитано, будет вызвана функция getter для возврата значения
		plugin.registerattribute("value", "", text_set, text_get);
		plugin.registerattribute("onchanged", null);
		
		
		plugin.registerattribute("min", "", min_set, min_get);
		plugin.registerattribute("max", "", max_set, max_get);
		plugin.registerattribute("step", "", step_set, step_get);
		plugin.registerattribute("backgroundcolor", "", bg_get, bg_get);
		
		// style
		// Отнимаем место под строку ввода
		var width2 = +plugin.width - 55 + 'px';
		slaider.style.width = width2;
		slaider.step = "0.01";
		slaider.min = "0";
		slaider.max = "1";
		slaider.value = "0.5";
		
		 
		slaider.addEventListener("input", text_input, true);

		plugin.sprite.appendChild(slaider);
		
		slaider.addEventListener("mousedown", function(e){ e.stopPropagation(); }, true);
	
		
		// *************  окно ввода ***********************
		
		vvod = document.createElement("input");
		vvod.type = "text";
		vvod.setAttribute("class", "vvod_adhs");
		 
		vvod.addEventListener("input", text_input2, true);
		
		plugin.sprite.appendChild(vvod);
		
		vvod.value = slaider.value;
	 
		  
	}
	

	local.unloadplugin = function()
	{
		plugin = null;
		krpano = null;
	}
	
	
	// Установить бегунок. из krpano - set(layer[name].value
	function text_set(newtext)
	{	
		slaider.value = newtext;  	
		setTimeout(text_get, 1); // задержка на выполнение для передачи в строку
	}
	// Передать значение в value слоя при перетаскивании бегунка.
	function text_get()
	{	
		vvod.value = slaider.value;
		return slaider.value;	 
	}
	// Вывод значения через onchanged. тащим бегунок, вводим в строку.
	function text_input()
	{
		vvod.value = slaider.value;
		krpano.call(plugin.onchanged, plugin); 
	
	}
	// Ввод значения со строки в value слайдера
	function text_input2()
	{
		slaider.value = vvod.value;
		krpano.call(plugin.onchanged, plugin);	
	}
	
	
	// ---------------------------------------------------------------
	
	// минимальное значение
	function min_get(newtext) {
		 slaider.min = newtext;
	}
	function min_set(newtext){
		 slaider.min = newtext;
	}
	// Максимальное значение
	function max_get(newtext){
		 slaider.max = newtext;
	}	
	function max_set(newtext){
		 slaider.max = newtext; 
	}
	// Шаг
	function step_get(newtext){
		 slaider.step = newtext;
	}
	function step_set(newtext){
		 slaider.step = newtext; 
	}
	// Цвет фона слайдера
	function bg_get(newtext){
		 slaider.style.background = newtext;  
	}	
	 
	// Подключение стиля css
	let head = window.document.getElementsByTagName('head')[0]

	function includeCSS(aFile, aRel){
		let style = window.document.createElement('link')
		style.href = aFile
		style.rel = aRel || 'stylesheet'
		head.appendChild(style)
	}
	

	function test(){
		 console.log(888);  
	}	
	
};
