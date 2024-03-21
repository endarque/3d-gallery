
function Pano(){
	this.krpano1 = null;
	this.onloadComplete = false;
}
Pano.prototype = {
	"init" : function(target_layer, vr_key){
		var _self = this;
		embedpano({
			id : "krpanoSWFObject_" + vr_key,
			xml : "/static/vr/vr/xml/tour_" + vr_key + ".xml",
			target : target_layer, 
			consolelog : false,		
			passQueryParameters : true, 		
			//webglsettings:{preserveDrawingBuffer:true},
			onready : _pano.krpano_onready_callback
		});
	},
	
	"krpano_onready_callback" : function(krpano_interface){
		_pano.krpano1 = krpano_interface;
		_pano.krpano1.set('events.onloadcomplete', 'js(_pano.loadComplete());');
		_pano.krpano1.set('events.onexitfullscreen', 'js(_pano.exitFullscreen());');

		/*if (g360.bgmusic != ""){
			_pano.krpano1.set('events.onenterfullscreen', 'js(_pano.soundcontrol(1));');
			//_pano.krpano1.set('events.onexitfullscreen', 'js(_pano.soundcontrol(2));');
		}*/

	},
	"viewCountUp" : function(){
		var hotspot_nm = '';
		$.each(_pano.krpano1.get('hotspot').getArray(), function(){
			if (this.title == 'view_cnt') {
				hotspot_nm = this.name;
				return false;
			}
		});
		
		if (hotspot_nm) {
			var viewcount = top.rs.info.viewcount;
			var settings = {
					from: 0,
					to: viewcount,
					speed: 1000,
					refreshInterval: 100,
					decimals: 0,
					formatter: function(value, settings) {
						return value.toFixed(settings.decimals).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					},
					onUpdate: null,
					onComplete: null
			};
			
			var loops = Math.ceil(settings.speed / settings.refreshInterval),
				increment = (settings.to - settings.from) / loops;
			
			var	loopCount = 0,
				value = settings.from;
				
			if (window.viewcnt_interval) {
				clearInterval(window.viewcnt_interval);
			}
			window.viewcnt_interval = setInterval(updateTimer, settings.refreshInterval);
	
			render(value);
	
			function updateTimer() {
				value += increment;
				loopCount++;
	
				render(value);
	
				if (loopCount >= loops) {
					clearInterval(window.viewcnt_interval);
					value = settings.to;
				}
			}
	
			function render(value) {
				var formattedValue = settings.formatter.call(this, value, settings);
				_pano.krpano1.set('hotspot[' + hotspot_nm + '].html', formattedValue);
			}
			
						
		}
	},
	"customDisplay" : function(){
		var hotspot_nm = '';
		// YTN 방송페스티벌
		$.each(_pano.krpano1.get('hotspot').getArray(), function(){
			if (this.title == 'custom_display') {
				hotspot_nm = this.name;
				return false;
			}
		});
		
		if (hotspot_nm == '') return;
		
		// D-Day 계산
		var dday = new Date(2022,6,21).getTime();
		var today = new Date().getTime();
		var gap = dday - today;
		var day = Math.ceil(gap / (1000 * 60 * 60 *24));
		
		if (day > 0) {
			_pano.krpano1.set('hotspot[' + hotspot_nm + '].html', 'D-' + day);
		} else {
			// D-Day
			_pano.krpano1.set('hotspot[' + hotspot_nm + '].css', 'font-family:Arial; font-weight: bold; color:#ffffff; font-size:17px;');
			_pano.krpano1.set('hotspot[' + hotspot_nm + '].html', 'D-Day');
		}
	},
	"loadComplete" : function(){

		// 롤오버 텍스트 효과 수정
		_pano.krpano1.call('set(textstyle[STYLE1_LinkSM].font, "Noto Sans KR")');
		_pano.krpano1.call('set(textstyle[STYLE1_LinkSM].padding, "8 20 8")');
		_pano.krpano1.call('set(textstyle[STYLE1_LinkSM].yoffset, "60")');
		_pano.krpano1.call('set(textstyle[STYLE1_LinkSM].backgroundalpha, "0.8")');
		_pano.krpano1.call('set(textstyle[STYLE1_LinkSM].backgroundcolor, "0x000000")');

		// 비디오 재생중일 때 사운드 중지
		if (_pano.krpano1.get('action[video_openAdhs]')) {
			_pano.krpano1.set('action[video_openAdhs].content', 'pausesound(bgsnd);\n' + _pano.krpano1.get('action[video_openAdhs]').content);				
		}
		if (_pano.krpano1.get('action[videoplayer_close]')) {
			_pano.krpano1.set('action[videoplayer_close].content', _pano.krpano1.get('action[videoplayer_close]').content + "if(get(layer[snd2].crop) == '0|0|50|50', resumesound(bgsnd));");				
		}
		_pano.krpano1.call('skin_hideskin()');	// 아이콘 표시 안되도록 처리
		_pano.krpano1.set('layer[volume_finger].visible', false)
		_pano.krpano1.set('action[iframe_add_hotspot].content',"\n\tif(webvr.isenabled,,\n\t\tjscall('rs.vrIframeOpen()');\n\t\taddlayer(freim_bg_Adhs);\n\t\tlayer[freim_bg_Adhs].loadstyle(freim_bg_Adhs);\n\t\tset(layer[freim_bg_Adhs].onclick, callwith(layer[close_freim_url_addhs], onclick); );\n\t\ttween(layer[freim_bg_Adhs].alpha, 1);\n\t\tset(layer[fon_zad_plan_adhs].enabled, true);\n\t\ttween(layer[fon_zad_plan_adhs].alpha, 1);\n\t\tset(closA,%1);\n\t\tremovelayer(%1);\n\t\taddlayer(%1);\n\t\tlayer[%1].loadstyle(frame_html);\n\t\tset(layer[%1].parent, %2);\n\t\tset(layer[close_freim_url_addhs].parent, %1);\n\t\tset(layer[close_freim_url_addhs].onclick, \tset(visible,false);\n\t\t\t\t\t\t\t\t\ttween(layer[%1].alpha, 0); \n\t\t\t\t\t\t\t\t\ttween(layer[freim_bg_Adhs].alpha, 0);\n\t\t\t\t\t\t\t\t\tset(layer[fon_zad_plan_adhs].enabled, false);\n\t\t\t\t\t\t\t\t\ttween(layer[fon_zad_plan_adhs].alpha, 0);\n\t\t\t\t\t\t\t\t\tjscall('rs.vrIframeClose()');\n\t\t\t\t\t\t\t\t\tdelayedcall(0.3,removelayer(%1);removelayer(freim_bg_Adhs););\n\t\t\t);\n\t\tset(layer[close_freim_url_addhs].visible, true);\n\t\ttween(layer[%1].alpha, 1);\n\t\tif(device.html5,\n\t      if(device.ios,\t\n\t\t\t\tset(iPad_hs1,'[div style=\"position:absolute; right:0; bottom:0; left:0; top:0; overflow-y: scroll; -webkit-overflow-scrolling:touch;\"]');\n\t\t\t\tset(iPad_hs2,'[/div]'); \n\t\t\t\t,\n\t\t\t\tset(iPad_hs1,'');\n\t\t\t\tset(iPad_hs2,'');\n\t\t\t );\n\t\t\ttxtadd(iframecode,get(iPad_hs1),'[iframe  id=\"krpano_iframe_'\n\t\t\t\t\t\t  ,%1,'\" width=\"100%\" height=\"100%\" allowtransparency=\"true\" src=\"',%3,'\" frameborder=\"0\" allow-same-origin allow=autoplay allowfullscreen][/iframe]',get(iPad_hs2));\n\t\t\t\t\tcopy(layer[%1].html, iframecode);\n\t\t\t\t\tset(layer[%1].padding, 0);\n\t\t\t\t\tset(layer[%1].url, 'textfield.swf');\n\t\t\t\t\tset(layer[%1].interactivecontent, true);\n\t\t\t\t\tset(layer[%1].onloaded, iframe_resize(%1); );\n\t\t\t\t\t,\n\t\t\t\t\tshowlog();\n\t\t\t\t\ttrace(error,'Iframe is not working in flash mode!');\n\t\t\t);\n\t\t);\n\t");
		
		$('#vr_layer').addClass('show');
		rs.isVrLoadCompleted = true;
		if (_pano.krpano1.get('WebVR') != null) _pano.krpano1.get('WebVR').vr_cursor_enabled = false;
		//this.viewCountUp();
		this.customDisplay();
		// 아래 항목들은 최초 로딩시에만 수행되고, Scene전환될 때는 수행하지 않음
		if (!this.onloadComplete) {
			_pano.krpano1.set('layer[snd2].visible', false);
			_pano.krpano1.set('plugin[snd3].visible', false);
			
			this.onloadComplete = true;
		}
	}, 
	
	"soundcontrol" : function(opt){
		if (g360.bgmusic != "") {
			if (opt == 1){
				_pano.krpano1.call("playsound(bgsnd, '"+g360.bgmusic+"', 0); set(events[currentpano].onnewpano,null)");
				_pano.krpano1.set('layer[snd2].crop', '0|0|50|50');
			}else{
				_pano.krpano1.call("stopsound(bgsnd)");
				_pano.krpano1.set('layer[snd2].crop', '0|50|50|50');
			}
		}
	},
	
	"exitFullscreen" : function(){
		// 사운드제어
		/*if (g360.bgmusic != "") {
			_pano.soundcontrol(0);
			_pano.krpano1.set('layer[snd2].visible', false);			
		}*/
		
		_pano.krpano1.set('plugin[snd3].visible', false);
		
		// VR 상세보기 화면 닫기
		_pano.krpano1.call('callwith(layer[close_freim_url_addhs], onclick)');
		
		// 모바일에서 fullscreen 하는 경우 감싸고 있는 레이어를 숨길 수가 없어 VR갤러리 보다 높은 z-index는 모두 숨김처리
		// vr_layer에 클릭 이벤트도 해제 후 다시 걸어준다
		$('#vr_layer').off('click').on('click', function(){
    		window.showFullScreen();
    	});
		
		$('#vr_area').removeClass('ios-fullscreen');
		$('#vr_area').removeClass('fullscreen');
		$('#vr_layer').find('.vr-area-upper').show();
		$('#vr_layer').find('.text-area').show();
		$('#main-banner-area').show();
		$('#header').show();
		
		clearInterval(window.fs_check);
	}
}