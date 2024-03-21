//PAGE LOADER
$(window).on("load", function () {
	"use strict";
});


(function($){
    "use strict";
    let $window = $(window);
    let body = $("body");
    let $root = $("html, body");

    $window.on("scroll", function () {
    	if (window.rs && window.rs.isVrLoadCompleted) {
    		var scroll_ck = $(document).height() - $(window).height() - 200;
    		if ($(window).scrollTop() > scroll_ck) {
    			$('#vr_layer').removeClass('show');
    		} else {
    			$('#vr_layer').addClass('show');
    		}
    	}
    });

    // VR 로드하는 부분
    window.loadRentalInfo = function(vr_key){
        $('#vr_layer').show();
		$('#vr_layer .vr-subject').html('ART BONGBONG TEST SAMPLE');

        setTimeout(function(){
			window._pano = new Pano();
			_pano.init('vr_area', vr_key);
			$('#vr_layer').on('click', function(){
				window.showFullScreen();
			});
		}, 1000);
    }

    window.showFullScreen = function() {
        $('#vr_layer').off('click');

        _pano.krpano1.set('plugin[snd3].visible', true);

        // ios는 krpano 전체화면 지원되지 않음
        if (/iphone|ipad/i.test(navigator.userAgent)) {
            $('#vr_area').addClass('ios-fullscreen');
            $('#vr_layer').find('.vr-area-upper').hide();
            $('#vr_layer').find('.text-area').hide();
            $('#main-banner-area').hide();
            $('#header').hide();
            $('#btn_vr_back').show();
            _pano.soundcontrol(1);

            $('#btn_vr_back').off().on('click', function(){
                _pano.exitFullscreen();
            });

            return;
        }

        $('#vr_area').addClass('fullscreen');
        $('#vr_layer').find('.vr-area-upper').hide();
        $('#vr_layer').find('.text-area').hide();
        $('#main-banner-area').hide();
        $('#header').hide();

        _pano.krpano1.set('fullscreen', true);

        // VR전체화면 - 작품상세 - 유튜브에서 전체화면 후 전체화면 해제 시 VR전체화면 해제 이벤트가 수행되지 않아 별도로 체크하는 로직 추가함
        // kakaotalk 웹뷰에서는 fullscreen 체크가 안되므로 처리하지 않음
        if (navigator.userAgent.indexOf('KAKAOTALK') >= 0) {

        } else {
            window.fs_check = setInterval(fullScreenCheck(), 1000);
        }
    }

    window.fullScreenCheck = function() {
		if (document.fullscreen == false) {
			_pano.exitFullscreen();
			clearInterval(window.fs_check);
		}
	}
})(jQuery);