/////////////////////////////////////////////////////////////////////////////
///
///     vr_control.js
///     krpano vr tour를 생성하고 관리하는 함수들 모음
///     2023-05-22 jongwon Chung
///
/////////////////////////////////////////////////////////////////////////////

function krPano(isAdmin) {
    this.pano = null;
    this.firstLoad = isAdmin;
}

// s3 경로
// vr/gallery/gallery_{UUID}/tour_sample.xml
krPano.prototype.init = function(layer, id) {
    var _self = this;

    // krpano xml 불러오기
    embedpano({
        id : "artbonbonVrGallery" + id,
        // xml : https://abb-public-dev.s3.ap-northeast-2.amazonaws.com/vrgallery/gallery/gallery_" + id + "/tour_sample.xml
        xml : "static/sample/templates/" + id + "/tour_sample.xml?no_cache=%random%", // 이 경로를 s3 경로로 수정해줘야함
        target : layer,
        consolelog : true,
        passQueryParameters : true,
        onready : _tour.onReady
    });
}

krPano.prototype.onReady = function(pano) {
    // 생성된 krpano 정보를 컨트롤하기 위해 할당
    // krpano에 관한 컨트롤은 해당 object로 하면된다.
    // ex). _tour.panoObject.set(..)
    // 관련 함수는 krpano document 참조
    // console.log('onReady');
    window._tour.panoObject = pano;
    window._tour.panoObject.set('events.onexitfullscreen', 'js(_tour.exitFullScreen());');
    window._tour.panoObject.set('events.onloadcomplete', 'js(_tour.onLoadComplete());');
    window._tour.panoObject.set('events.onenterfullscreen', 'js(_tour.enterFullScreen());');
}

krPano.prototype.setSound = function (val) {
    if (_artbonbon.bgm == null || _artbonbon.bgm == '') return;

    if (val == 0) {
        window._tour.panoObject.call('playsound(bgm, "'+ _artbonbon.bgm + '", true);');
        window._tour.panoObject.set('layer[sound].crop', '0|0|104|104');
    }
    else {
        window._tour.panoObject.call('stopsound(bgm)');
        window._tour.panoObject.set('layer[sound].crop', '104|0|104|104');
    }
}

krPano.prototype.enterFullScreen = function () {
    // console.log('enterfullscreen');

    // playsound
    window._tour.setSound(0);
}

krPano.prototype.exitFullScreen = function () {
    // console.log('exitFullScreen');
    // 전체 화면이 꺼지면 작품 상세보기 팝업을 닫는다.
    window._tour.panoObject.call('callwith(layer[popup_bg], onclick)');
    // 사운드 종료
    window._tour.setSound(1);

    // vr_layer에 클릭 이벤트도 해제 후 다시 걸어준다.
    $('#vrGallery_layer').off('click').on('click', function(){
        _artbonbon.panoFullScreen();
    });

    // fullscreen이 아닐 경우 event layer를 숨긴다.
    window._tour.panoObject.set('plugin[exit].visible', false);
    window._tour.panoObject.set('plugin[sound].visible', false);
    window._tour.panoObject.set('plugin[gallery_info].visible', false);

    $('#vrGallery_area').removeClass('ios-fullscreen');
    $('#vrGallery_area').removeClass('fullscreen');
    $('#vrGallery_layer').removeClass('show');
}

krPano.prototype.onLoadComplete = function () {
    // console.log('onLoadComplete');
    // 여기서 배포 버전에 맞는 back URL을 입력 해준다.
    window._tour.panoObject.call('def(reqUrl, string, /detail?id=0)');
    // window._tour.panoObject.call('def(reqUrl, string, http://192.168.1.144:3000/vr/10/26?layout=vr)');
}