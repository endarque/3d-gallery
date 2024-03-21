/////////////////////////////////////////////////////////////////////////////
///
///     gallery_functions.js
///     artbonbon gallery를 만드는 함수들의 집합
///     2023-05-22 jongwon Chung
///
/////////////////////////////////////////////////////////////////////////////


function artbonbon() {
    // 여기에 변수 선언
    this.bgm = null;
    // 경로 수정 필요함. 현재는 static/sample/gallery_components/bgm/bgm01.mp3
    // python - flask 환경에 맞는 경로 nuxt에 맞게 수정 **
    this.bgm = 'static/sample/gallery_components/bgm/bgm01.mp3';
}

artbonbon.prototype.init = function() {

}

// krpano tour를 생성하는 함수
artbonbon.prototype.setPano = function(id, delay, isAdmin) {

    var _self = this;

    // vr layer show
    $('#vrGallery_layer').show();
    // UI 에 따라서 변경
    $('#vrGallery_layer .vr-subject').html('');

    setTimeout(function(){
        window._tour = new krPano(isAdmin);
        // create vr gallery. used layer id & vr id
        // _tour.init(layer_id, vr_id);
        window._tour.init('vrGallery_area', id);
        $('#vrGallery_layer').on('click', function(){
            _self.panoFullScreen();
        });
    }, delay);
}

artbonbon.prototype.panoFullScreen = function() {

    // console.log((navigator.userAgent));
    $('#vrGallery_layer').off('click');

    if (!window._tour.firstLoad) {
        window._tour.panoObject.call('tipViewOpen()');
        window._tour.firstLoad = true;
    }

    // ios의 경우 자동적으로 판정해서 fullscreen 처리
    if (/iphone|ipad/i.test(navigator.userAgent)) {
        // console.log('ios fullscreen');

        window._tour.panoObject.set('plugin[exit].visible', true);
        window._tour.panoObject.set('plugin[sound].visible', true);
        window._tour.panoObject.set('plugin[gallery_info].visible', true);

        // ios 는 전체화면 개념이 아니므로 따로 이벤트를 할당해 준다.
        window._tour.panoObject.set('plugin[exit].onclick', 'js(_tour.exitFullScreen());');

        // 사운드 재생
        window._tour.setSound(0);

        $('#vrGallery_layer').addClass('show');
        $('#vrGallery_area').addClass('ios-fullscreen');

        return;
    }

    if(/Android/i.test(navigator.userAgent)) {
        // console.log('android');
    }

    $('#vrGallery_layer').addClass('show');
    $('#vrGallery_area').addClass('fullscreen');

    // fullscreen 으로 전환
    window._tour.panoObject.set('fullscreen', true);

    // fullscreen 일 경우 plugin 을 보여준다.
    window._tour.panoObject.set('plugin[exit].visible', true);
    window._tour.panoObject.set('plugin[sound].visible', true);
    window._tour.panoObject.set('plugin[gallery_info].visible', true);

    _artbonbon.changeAdministratorMode();
    // _artbonbon.changeImage('hotspot_1', 'static/vr/vr/xml/vrgallery/sample/sample_1/image/jiwon@pabloarts.com-spl-1676953986890_7c295d4e67c6f672c2187c84ff1b7fdf.1060280-1676968304480_shadow.jpg?ver=1677484285546');
    // _artbonbon.rotateImage('hotspot_1');
}

// 관리자 모드로 변경
// hotspot에 배정된 onclick event를 작품등록으로 변경해 준다.
artbonbon.prototype.changeAdministratorMode = function() {
    console.log('call');
    window._tour.panoObject.call(
        "for(set(i,0),i LT hotspot.count,inc(i), set(hotspot[get(i)].onclick, addPicture();););"
    );
}

// filepath를 입력하면 동적으로 변경 가능
// ajax 비동기 통신으로 특정 hotspot 의 정보를 수정할 수 있다.
// hotspot name, url 등을 가져와야함.
artbonbon.prototype.changeImage = function(hotspot_name, imgPath) {

    window._tour.panoObject.set("hotspot[" + hotspot_name + "].url", imgPath);
}

artbonbon.prototype.rotateImage = function(hotspot_name) {

    console.log(window._tour.panoObject.get('hotspot[hotspot_1_back]'));
    var width = window._tour.panoObject.get('hotspot[' + hotspot_name + '_back]');
    var height = window._tour.panoObject.get('hotspot[' + hotspot_name + '_back]');
    console.log(width, height);
    window._tour.panoObject.set('hotspot[' + hotspot_name + '].width', height);
    window._tour.panoObject.set('hotspot[' + hotspot_name + '].height', width);
}