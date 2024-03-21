function RentalService (rental_info){
	this.ART_FILTER_MAX_CNT = 8;	// 작가 최대 8명까지만 표시
	this.info = rental_info;
	this.isArtistInit = false;
	this.isCustomVR = false;
	this.artistlist = {};	// 중복제거된 작가 리스트
	this.artistlist_byemail = {};	// 이메일키로 찾는 변수
	this.duplCheck();
	this.artistListDrag = false;	// 아티스트 리스트를 드래그 중인지 확인
	
	this.changeTop = 0;
	
	//this.init();
}


RentalService.prototype = {
		
	"init" : function(){
		
	},
	
	// 로고를 별도로 설정한 경우 로고파일 변경
	"setLogo" : function(){
		if (this.info.logo_url) {
			$('#top_logo_w').attr('src', this.info.logo_url);
			//$('#top_logo_b').attr('src', this.info.logo_url).css('filter', 'invert(1)');
			$('#top_logo_b').attr('src', this.info.logo_url.replace(/\./g, '_invert.'));
		}
	},
	
	// 대관 타입별 텍스트를 표시한다
	"drawRentalText" : function(){
		if (!g360.rental_text) return;
		
		var rt = g360.rental_text;
		$('.rental-txt-art').text(rt.rental_art);
		$('.rental-txt-artist').text(rt.rental_artist);
		$('.rental-txt-visitor').text(rt.rental_visitor);
		$('.rental-txt-group').text(rt.rental_group);
		$('.rental-txt-count').text(rt.rental_count);
		$('.rental-txt-express').text(rt.rental_express);

		// 방명록 타이틀
		var memo_arr = rt.rental_memo1.split(' ');
		
		// 문장을 앞, 중간, 끝 으로 나눔 (Say Hello From Guest)
		var first = '', middle = '', last = '';
		for (var i=0 ; i<memo_arr.length ; i++) {
			if (i==0) {
				first = memo_arr[i];
			} else if (i==memo_arr.length-1) {
				last = memo_arr[i];
			} else {
				middle += ' ' + memo_arr[i];
			}
		}
		var _html = 
			'<div class="font-weight-light" style="display:inline;">' +
			'	<div class="visitor-title-quotes"><div>' + first.substring(0,2) + '</div><div class="visitor-title-quotes-back"><img src="/resource/rental/img/visitor_quotes.png"></div></div>' + first.substr(2) +	middle + '</div> ' + 
			'<div class="visitor-title-deco"><div>' + last + '</div></div></h2>';

		$('#visitor_title').html(_html);
		
		
		// 방명록 글 작성 제목
		$('.rental-txt-memo2').text(rt.rental_memo2);

		
		// 작가 상세
		$('.rental-txt-content2').text(rt.content2);
		$('.rental-txt-tab1').text(rt.tab1);
		$('.rental-txt-group').text(rt.group);
		$('.rental-txt-sch').text(rt.sch);
		$('.rental-txt-prize').text(rt.prize);
		$('.rental-txt-loc').text(rt.loc);
		$('.rental-txt-carr').text(rt.carr);
		
		// 작품 상세
		$('.rental-txt-tab2').text(rt.tab2);
		
		$('.rental-detail-header').text(g360.lang == 'ko' ? '상세보기' : 'Detail');
	},
	
	"getEmail" : function(email) {
		return email.substring(0, email.lastIndexOf("_"));
	},
	
	"duplCheck" : function() {
		// --------- artistlist와 imagelist의 중복제거 ---------
		var _self = this;
		
		// 이름 오름차순으로 정렬
		this.info.artistlist.sort(function(a,b){
			var num_regex = /^(\d*)/g;
			
			var a_num = parseInt(a.name.match(num_regex)[0] || "0", 10);
			var b_num = parseInt(b.name.match(num_regex)[0] || "0", 10);
			
			var res = 0;
			if (a_num != b_num) {
				// 앞 번호가 숫자인 경우 
				res = (a_num == 0 || a_num > b_num ? 1 : -1);
			} else {
				res = (a.name > b.name ? 1 : -1);
			}
			
			return res;
		});
		
		// 중복 작가 리스트 제거
		_self.artistlist = {};
		$.each(this.info.artistlist, function(){
			_self.artistlist[this.artistkey] = this;
		});
		this.info.artistlist = [];
		$.each(_self.artistlist, function() {
			_self.info.artistlist.push(this);
		});
		
		
		// 작가를 이메일로 찾을 수 있도록 변수 셋팅
		_self.artistlist_byemail = {};
    	$.each(this.info.artistlist, function(){
    		//artistkey[$.trim(this.name)] = this.artistkey;
    		_self.artistlist_byemail[this.email] = {
    			'name' : this.name,
    			'name_eng' : this.name_eng
    		}
    	});
		
		// 커스텀VR 여부 판단해서 imagelist 구조 맞추기
		if (!this.info.imagelist[0].filekey) {
			this.isCustomVR = true;
			var imglist_arr = [];
			$.each(this.info.imagelist, function(){
				$.each(this, function(){
					$.each(this, function(){
						imglist_arr.push(this);
					});
				});
			});
			this.info.imagelist = imglist_arr;
		}
		
		// 중복 이미지 제거
		var duplck = {};
		$.each(this.info.imagelist, function(){
			duplck[this.filekey] = this;
		});
		this.info.imagelist = [];
		$.each(duplck, function() {
			_self.info.imagelist.push(this);
		});
	},
	
	"setGroupList" : function(){
		var _self = this;
		
		$('#nav_group').hide();
		$('#side_nav_group').hide();
		
		
		var group_code = this.info.info.group_code;
		if (group_code) {
			$('#nav_group').show();
			$('#side_nav_group').show();
		} else {
			return;
		}
		
		/*
		$('#nav_group, #side_nav_group').off().on('click', function(){
			_self.showGroupList(group_code);
			$('#group_list_layer').show();
			$('body').addClass('overflow-hidden');
			g360.history_record_rental("group_list_close");
		});
		
		$('#group_list_close').off().on('click', function(){
			$('body').removeClass('overflow-hidden');
			$('#group_list_layer').fadeOut();
			$('#group_list').empty();
		});
		*/
		
		// 새로운 그룹 페이지를 레이어로 처리
		$('#nav_group, #side_nav_group').off().on('click', function(){
			$('#btn_sideNavClose').click(); // side close
			_self.showGroupList(group_code);
			$('body').addClass('overflow-hidden');
			g360.history_record_rental("group_list_close");
		});
	},
	"setVR" : function(delay) {
		
		var _self = this;

		$('#vr_layer').show();
		
		$('#vr_layer .vr-subject').html(_self.info.title);
	    
		setTimeout(function(){			
			window._pano = new Pano();
			_pano.init('vr_area', vr_key);
			$('#vr_layer').on('click', function(){
				_self.showFullscreen();
			});
		}, delay);
	    	    
	},
	"vrDetailBugFix" : function(){
		// VR 상세페이지에서 작품선택시 감싸고 있는 Wrapper Position값 재설정
		$('#krpano_iframe_IFRAME_HTML').parent().parent().parent().parent().addClass('ie-bugfix');
	},
	"vrIframeOpen" : function(){
		// VR내에서 IFRAME 열릴 때
		if (/iphone|ipad/i.test(navigator.userAgent)) {
			$('#btn_vr_back').hide();	
		}
	},
	"vrIframeClose" : function(){
		// VR내에서 IFRAME 닫힐 때
		if (/iphone|ipad/i.test(navigator.userAgent)) {
			$('#btn_vr_back').show();	
		}
	},
	"showFullscreen" : function(){
		//alert('전체화면으로 전환됩니다');
		$('#vr_layer').off('click');
		
		if (g360.bgmusic != ""){
			_pano.krpano1.set('layer[snd2].visible', true);			
		}
		
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
				/*
				if (g360.bgmusic != ""){
					_pano.krpano1.set('layer[snd2].visible', false);			
				}
				$('#vr_area').removeClass('ios-fullscreen');
				$('#header').show();
				$('#btn_vr_back').hide();
				_pano.soundcontrol(0);
				
				$('#vr_layer').on('click', function(){
		    		rs.showFullscreen();
		    	});
		    	*/
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
			this.fs_check = setInterval(this.fullScreenCheck, 1000);
		}
	},
	"fullScreenCheck" : function() {
		if (document.fullscreen == false) {
			_pano.exitFullscreen();
			clearInterval(this.fs_check);
		}
	},
	"setMainSlide" : function() {

		// --------- 메인 슬라이더 ---------
		let wrap = $('#rev_main');
		var _self = this;
		
		var img_list = [];
		
		// 사용자가 선택한 image가 있는 경우 해당 이미지만 표시
		if (this.info.main_image && this.info.main_image.length > 0) {
			$.each(this.info.imagelist, function(){
				if ($.inArray(this.filekey, _self.info.main_image) != -1){
					img_list.push(this);					
				}
			});
		}
		
		// 선택한 이미지가 없으면 전체 이미지로 처리
		if (img_list.length == 0) {
			img_list = this.info.imagelist.slice();
		}
		
		// 이미지 리스트 랜덤 표시
		g360.arrayShuffle(img_list);
		
		// 메인 슬라이드 src 셋팅
		var max_disp = $('#rev_main ul li').length;
		
		$.each(img_list, function(idx, val){
			//3개까지만 표시
			if (idx > max_disp) return false;
			
			var filekey = this.filekey;
			//var folder = filekey.split("_")[0];
			var folder = _self.getEmail(filekey);
			var image_url = "/artimage/" + folder + "/art/1920/" + filekey + ".jpg?open?ver=" + new Date().getTime();
			
			var $li = wrap.find('ul li').eq(idx);
			$li.find('img').attr('src', image_url);
			
			if (_self.artistlist_byemail[folder]) {
				// 작가명이나 작가영문명 수정된 경우 최신정보를 가져오기 위해 artistlist에서 정보를 가져옴
				if (_self.artistlist_byemail[folder].name) {
					$li.find('.artist-name').html(_self.artistlist_byemail[folder].name);
				}
				if (_self.artistlist_byemail[folder].name_eng) {
					// 한글명과 영문명이 다른경우만 표시
					if (_self.artistlist_byemail[folder].name != _self.artistlist_byemail[folder].name_eng) {
						$li.find('.artist-name-eng').html(_self.artistlist_byemail[folder].name_eng);						
					}
				}
				if (val.name) $li.find('.art-name').html('<div>' + val.name + '</div>');
			} else {
				if (val.artist) $li.find('.artist-name').html(val.artist);
				if (val.artist_eng && val.artist != val.artist_eng) $li.find('.artist-name-eng').html(val.artist_eng);				
				if (val.name) $li.find('.art-name').html('<div>' + val.name + '</div>');				
			}
			
		});
		
		// 이미지에 src 셋팅 안된경우 삭제 처리
		for (var i=max_disp-1 ; i>=0 ; i--) {
			var $img = wrap.find('ul li').eq(i).find('img');
			if (!$img.attr('src')) {
				$img.parent().remove();
			}
		}
		
	    wrap.show().revolution({
	        sliderType: "standard",
	        jsFileLocation: "/resource/js/rental/lib/revolution/",
	        sliderLayout: "fullscreen",
	        dottedOverlay: "none",
	        delay: 9000,
	        navigation: {
	            keyboardNavigation: "off",
	            keyboard_direction: "horizontal",
	            mouseScrollNavigation: "off",
	            mouseScrollReverse: "default",
	            onHoverStop: "off",
	            touch: {
	                touchenabled: "on",
	                swipe_threshold: 75,
	                swipe_min_touches: 1,
	                swipe_direction: "horizontal",
	                drag_block_vertical: false
	            },
	            bullets: {
	                enable: true,
	                hide_onmobile: true,
	                style: "numbered",
	                hide_onleave: false,
	                hide_under: 767,
	                direction: "vertical",
	                h_align: "left",
	                v_align: "center",
	                h_offset: 20,
	                v_offset: 0,
	                space: 5,
	                tmp: '<div class="tp-bullet-number"><span class="tp-count">{{param1}}</span><span class="tp-bullet-line"></span></div>'
	            },
	            arrows: {
	                style: "",
	                enable: false,
	            }
	        },
	        viewPort: {
	            enable: true,
	            outof: "pause",
	            visible_area: "80%",
	            presize: false
	        },
	        responsiveLevels: [1240, 1024, 778, 480],
	        visibilityLevels: [1240, 1024, 778, 480],
	        gridwidth: [1140, 1024, 768, 480],
	        gridheight: [660, 650, 600, 490],
	        lazyType: "none",
	        parallax: {
	            type: "mouse",
	            origo: "slidercenter",
	            speed: 2000,
	            speedbg: 0,
	            speedls: 0,
	            //levels: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 20, 25, 55],
	            disable_onmobile: "on"
	        },
	        shadow: 0,
	        spinner: "off",
	        stopLoop: "off",
	        stopAfterLoops: -1,
	        stopAtSlide: -1,
	        shuffle: "off",
	        autoHeight: "off",
	        hideThumbsOnMobile: "off",
	        hideSliderAtLimit: 0,
	        hideCaptionAtLimit: 0,
	        hideAllCaptionAtLimit: 0,
	        debugMode: false,
	        fallbacks: {
	            simplifyAll: "off",
	            nextSlideOnWindowFocus: "off",
	            disableFocusListener: false,
	        }
	    });
	},
	"setExhibitionInfo" : function() {
		// --------- 전시회 정보 ---------
		let wrap = $('#exhibition');
		var title = wrap.find('.exhi-title');
		var express = wrap.find('.exhi-express');
		title.html(this.info.title.replace(/_{3}/g, "<br>"));
		express.html(this.info.express.replace(/\r\n|\n/g, '<br/>'));
		
		// 대표 이미지 설정
		if (this.info.bgimg) {
			$('#vr_rental_img').attr('src', this.info.bgimg);			
		}
	},
	"setCounter" : function() {
		// --------- 방문자 수 카운트 ---------
		var wrap = $('#counters');
		var visitor_cnt = this.info.viewcount;
		var art_cnt = this.info.imagelist.length;
		
		if (isNaN(visitor_cnt)) visitor_cnt = 0; 
		wrap.find('.visitor-cnt').data('to', visitor_cnt);
		wrap.find('.art-cnt').data('to', art_cnt);
		
		
	    wrap.find(".container").appear(function () {
	       wrap.find(".count_nums").countTo();
	    });		
		
	},
	"setArtList" : function() {
		// artistlist (filter) 셋팅  
    	var _self = this;
    	var $filter = $('#mosaic_filter');
    	var disp_cnt = 0;
    	var artistkey = {};
    	$.each(this.info.artistlist, function(){
    		//artistkey[$.trim(this.name)] = this.artistkey;
    		artistkey[this.email] = this.artistkey;
    		disp_cnt++;
    		//if (disp_cnt <= _self.ART_FILTER_MAX_CNT) {
    		// 작가 필터 표시 개수 제한없이 표시
    		if (true) {
    			var _html = 
    				'<div data-filter=".' + this.artistkey + '" class="cbp-filter-item">' +
    				'	<span>' + $.trim(this.name) + '</span>' +
    				'</div>';
    			$filter.append(_html);    			
    		}
    	});
    	
    	// 작가가 1명인 경우 필터 표시할 필요 없음
    	if (this.info.artistlist.length == 1) {
    		$filter.hide();
    	}
    	
    	
		// imagelist 셋팅   	
    	var $list = $('#grid_mosaic');
    	$.each(this.info.imagelist, function(){
    		var _key = '';    		
    		//var _email = this.filekey.split('_')[0];
    		var _email = _self.getEmail(this.filekey);
    		var _src = g360.preview_img_path(_email, this.filekey);
    		
    		// 이메일을 키로 구분
    		if (artistkey[_email]) {
    			_key = artistkey[_email];	
    		}
    		
    		// artistlist에 마지막 작품 src저장 (작가 이미지 없는 경우 뿌려주기 위함)
    		if (_self.artistlist[_key]) {
    			_self.artistlist[_key].last_art_src = _src;
    		}
    		 
    		// 작가명
    		var artist_name = '';
    		if (_self.artistlist_byemail[_email]) {
    			artist_name = _self.artistlist_byemail[_email].name;
    		} else {
    			artist_name = this.artist;
    		}
    		
    		var mp4_name = this.art_mp4_filename || '';
    		var _html = 
    			'<div class="cbp-item ' + _key + '" data-artkey="' + this.filekey + '" data-mp4="' + mp4_name + '">' +
    			'	<a><img src="' + _src + '"></a>' +
    			'	<div class="img-art-detail">' +
    			'		<h4 class="text-light font-weight-light">' + artist_name + '</h4>' +
    			'		<h3 class="img-art-title">' + this.name + '</h3>' +
    			'	</div>' +
    			'</div>';
    		$list.append(_html);
    	});
    	
    	
	    $list.cubeportfolio({
	        filters: "#mosaic_filter",
	        layoutMode: 'grid',
	        defaultFilter: "*",
	        animationType: 'rotateSides',
	        gapHorizontal: 0,
	        gapVertical: 0,
	        gridAdjustment: 'responsive',
	        mediaQueries: [{
	            width: 1500,
	            cols: 3,
	        }, {
	            width: 1100,
	            cols: 3,
	        }, {
	            width: 767,
	            cols: 2,
	        }, {
	            width: 480,
	            cols: 1,
	        }]
	    });
	    
	    
	    if ($(window).outerWidth() >= 567) {
	    	
	    	var isSafari = navigator.userAgent.indexOf("Chrome") == -1 && navigator.userAgent.indexOf("Safari") != -1; 
	    	
	    	if (!isSafari) {
	    		$("#gallery .cbp-item").hover3d({
					selector: ".cbp-item-wrapper",
					shine: false
				});
	    	} 
	    	
	    }

	    $("#gallery .cbp-item").on('click', function(){
	    	var artkey = $(this).data('artkey');
	    	var detail_url = "/rental/art_detail.jsp?id=" + artkey;
	    	var mp4_name = $(this).data('mp4');
	    	
	    	
	    	if (_self.info.type == 'pfizer' && mp4_name != '') {
	    		var _email = mp4_name.substring(0, mp4_name.lastIndexOf('_'));
				var video_src = g360.video_path(_email, mp4_name);
				$('body').addClass('overflow-hidden');
				g360.showVideo(video_src, true);
	    		return;
	    	}
	    	
			$('#art_detail_wrapper').load(detail_url, function(){
				//g360.history_record("curie_historyback");g360.history_record("curie_historyback");
				$('#art_detail_layer').fadeIn();
				$('#art_detail_header').show();
				$('body').addClass('overflow-hidden');
			});
	    });
	    
	},
	"artistDetailScrollEvent" : function() {
		var _self = this;
		if (_self.scene_1 && _self.scene_1.destroy) {_self.scene_1.destroy(true);}
		if (_self.scene_2 && _self.scene_2.destroy) {_self.scene_2.destroy(true);}
		
		var pic_wrapper = $('#artist_pic_wrapper').get(0)
		_self.scene_1 = new ScrollMagic.Scene({triggerElement:pic_wrapper, offset:(window.innerWidth < 1200 ? -50 : -60)})
			.setPin(pic_wrapper)
			.addTo(_self.artist_controller);

		// 메뉴 고정
		_self.scene_2 = new ScrollMagic.Scene({triggerElement:"#artist_tab", offset:(window.innerWidth < 1200 ? -50 : -60)})
			.setPin("#artist_tab")
			.addTo(_self.artist_controller);
	},
	
	"setArtistList" : function() {
		var _self = this;
		var _html = '';
		var $list = $('.artist-list');
		var $list_text = $('#artist_info_text_list');
		$.each(this.info.artistlist, function(idx, val){
			var artist_img = '';
			
			if (this.photoimage_profile) {
				artist_img = g360.user_photo_thum_url(this.email) + '?open&ver=' + this.photoimage_profile_version;
			} else {
				artist_img = this.last_art_src;
			}
			
			// 상단에 썸네일 이미지 표시
			var $thumb = $('<div class="artist-thumb-img"></div>');
			$thumb.data('artistkey', this.artistkey);
			$thumb.css('background-image', 'url(' + artist_img + ')');				
			$list.append($thumb);
			
			// 작가 정보 표시
			var $infos = $('<li class="artist-' + this.artistkey + '"></li>');
			if(this.name_eng==""){
				$infos.append('<div class="artist-info-ename animate__animated">' + this.name + '</div>');
			}else{
				$infos.append('<div class="artist-info-ename animate__animated">' + this.name_eng + '</div>');
				$infos.append('<div class="artist-info-name animate__animated">' + (this.name_eng != this.name ? this.name : '') + '</div>');
			}
			$infos.append('<div class="artist-info-content animate__animated">' + this.content.replace(/\r\n|\n/g, '<br>') + '</div>');
			$infos.append('<div class="btn-artist-detail animate__animated btn-rect">' + (g360.lang == 'ko' ? '자세히 보기' : 'View more') + '</div>');
			$list_text.append($infos);
			
			// 작가 영문명 넘치는 현상 처리 
			_self.changeFontSize($infos.find('.artist-info-ename'), ($(window).outerWidth() < 567 ? 90 : 150));
			_self.changeFontSize($infos.find('.artist-info-name'), 30);
		});
		
		// 표시할 작가 1명이면 작가 사진을 크게 표시
		if (this.info.artistlist.length == 1) {
			$('.artist-thumb-img').addClass('active');
		} else {
			// 작가가 2명 이상인 경우 맨 마지막 사용자로 캐러셀이 안되 빈 값 넣기
			var $thumb = $('<div class="artist-thumb-img blank"></div>');
			$list.append($thumb);
		}
		
		// 작가 리스트 캐러셀 적용
		$list.owlCarousel({
			autoWidth:true,
			loop:false,
			dots:false,
			nav: this.info.artistlist.length > 1 ? true : false,
		    margin:50,
		    onDrag:function(){
		    	_self.artistListDrag = true;
		    },
		    onDragged:function(){
		    	_self.artistListDrag = false;
		    }
		});
		
		// 첫번째 작가를 표시
		_self.selectArtist(_self.info.artistlist[0].artistkey);
		
		
		// 마우스 오버시 작가 정보 표시
		$('.artist-thumb-img').on('mouseenter', function(){
			// 빈 값은 처리 안함
			if ($(this).hasClass('blank')) return;
			
			// 캐러셀 이동중에는 처리 안함
			if (_self.artistListDrag) return;
			
			var cur_key = $(this).data('artistkey');
			_self.selectArtist(cur_key);
		});
		
		// 작가 상세보기
		$('.btn-artist-detail').on('click', function(){
			_self.showArtistDetail(_self.displayArtistkey);
			$('#artist_detail_layer').fadeIn();
			$('#artist_detail_header').show();
			$('body').addClass('overflow-hidden');
			g360.history_record_rental("artist_detail_header");
		});
		
		// 작가 상세보기 닫기
		$('#artist_detail_header').on('click', function(){
			$('#artist_detail_layer').hide();
			$('body').removeClass('overflow-hidden');
		});
		
		
		// 창 리사이즈 시 작가명 사이즈 체크
		$(window).off('resize.artistname_check').on('resize.artistname_check', function(){
			_self.name_check = setTimeout(function(){
				clearTimeout(_self.name_check);
				var $list_text = $('#artist_info_text_list');
				$('#artist_info_text_list li').each(function(){
					_self.changeFontSize($(this).find('.artist-info-ename'), ($(window).outerWidth() < 567 ? 90 : 150));
					_self.changeFontSize($(this).find('.artist-info-name'), 30);
				});
			}, 1000); //interval 1s
		});
	},
	"changeFontSize" : function($el, h) {
		// 폰트 사이즈 초기화
		$el.css('font-size', '');
		
		var fs = $el.css('font-size');
		if (!fs) return;
		
		var cnt = 0;
		
		// 높이가 설정값 이하로 나오도록 폰트 사이즈 조정
		while ($el.height() > h) {
			cnt++;
			if (cnt > 100) break;
			
			var fs = parseInt($el.css('font-size')) - 1;
			if (fs < 12) break;
			
			
			$el.css('font-size', fs + 'px');
		}
	},
	"selectArtist" : function(artistkey) {
		var _self = this;
		var $list_text = $('#artist_info_text_list');
		var artistinfo = _self.artistlist[artistkey];
		var tmpkey = artistkey;
		
		// displayArtistKey : 현재 표시중인 artist
		// reqArtiskey : 변환 요청한 artist
		
		if (_self.displayArtistkey == artistkey) return;
		
		_self.reqArtistkey = artistkey;
		
		var img_src = '';
		
		if (artistinfo.photoimage_profile) {
			img_src = g360.user_photo_color_url(artistinfo.email) + '?open&ver=' + artistinfo.photoimage_profile_version;
		} else {
			img_src = artistinfo.last_art_src;
		}
		
		var artistOriImg = new Image();
		artistOriImg.artistkey = artistkey;
		artistOriImg.onload = function(){
			// 로딩 완료 시점에 이벤트 객체와 요청했던 키가 같아야만 뿌려준다.
			if (this.artistkey != _self.reqArtistkey) return;
			
			$('.artist-detail-img').css('background-image', 'url(' + this.src + ')');
			
			var before_li = $list_text.find('.artist-' + _self.displayArtistkey);
			before_li.find('.artist-info-ename').removeClass('fadeInLeftSmall');
			before_li.find('.artist-info-name').removeClass('fadeInLeftSmall');
			before_li.find('.artist-info-content').removeClass('fadeInLeftSmall');
			before_li.find('.btn-artist-detail').removeClass('fadeInLeftSmall');
			//before_li.css('z-index', '0');
			$list_text.find('li').css('z-index', '0');
			
			var after_li = $list_text.find('.artist-' + artistkey);
			after_li.find('.artist-info-ename').addClass('fadeInLeftSmall');
			after_li.find('.artist-info-name').addClass('fadeInLeftSmall');
			after_li.find('.artist-info-content').addClass('fadeInLeftSmall');
			after_li.find('.btn-artist-detail').addClass('fadeInLeftSmall');
			after_li.css('z-index', '1');
			
			_self.displayArtistkey = artistkey;
		}
		artistOriImg.src = img_src;
		
		
		
		// 배경이미지 셋팅
		//var artist_ori_img = g360.user_photo_color_url(artistinfo.email) + '?open&ver=' + artistinfo.photoimage_profile_version;
		//$('.artist-detail-img').css('background-image', 'url(' + artist_ori_img + ')');
		
		
	},
	
	"setArtistInfo" : function(artist_info){
		// 내용 초기화
		$('.pricing-list').mCustomScrollbar('destroy');
		$('#artist_info').trigger('destroy.owl.carousel');
		$('#artist_info').empty();
		
		var _html = '';
		var rt = g360.rental_text;
		
		// 소속 및 단체
		if (artist_info.group && artist_info.group.length > 0) {
			_html = 
			'<div class="item">' +
			'	<div class="col-md-12">' +
			'		<div class="pricing-item wow fadeInUp animated" data-wow-delay="300ms">' +
			'			<h3 class="font-light darkcolor"><img src="/img/rental/multiple-users.png" class="ico"/>' + rt.group + '</h3>' +
			'			<ul id="artist_group" class="pricing-list">';
			'			</ul>' +
			'		</div>' +
			'	</div>' +
			'</div>';
			$("#artist_info").append(_html);
			
			$.each(artist_info.group, function(){
				var arr = [];
				if (this.title) arr.push(this.title);
				if (this.dept) arr.push(this.dept);
				if (this.jobtitle) arr.push(this.jobtitle);
				$('#artist_group').append('<li>' + arr.join(' ') + '</li>');
			});
		}
		
		// 학력 정보
		if (artist_info.education && artist_info.education.length > 0) {
			_html = 
			'<div class="item">' +
			'	<div class="col-md-12">' +
			'		<div class="pricing-item wow fadeInUp animated" data-wow-delay="380ms">' +
			'			<h3 class="font-light darkcolor"><img src="/img/rental/graduate.png" class="ico"/>' + rt.sch + '</h3>' +
			'			<ul id="artist_edu" class="pricing-list">';
			'			</ul>' +
			'		</div>' +
			'	</div>' +
			'</div>';
			$("#artist_info").append(_html);
			
			$.each(artist_info.education, function(){
				var arr = [];
				if (this.end) arr.push(this.end);
				if (this.schoolname) arr.push(this.schoolname);
				if (this.major) arr.push(this.major);

				//1644번째줄 이용 //이거안씀 
				if (this.level&&(this.level!="etc"&&this.level!="기타")) arr.push(this.level);
				if (this.status) arr.push(this.status);
				
				//if (this.level + this.status) arr.push(this.level + this.status);
				$('#artist_edu').append('<li>' + arr.join(' ') + '</li>');
			});
		}
		
		// 수상 경력
		if (artist_info.career && artist_info.career.length > 0) {
			_html = 
			'<div class="item">' +
			'	<div class="col-md-12">' +
			'		<div class="pricing-item wow fadeInUp animated" data-wow-delay="460ms">' +
			'			<h3 class="font-light darkcolor"><img src="/img/rental/trophy.png" class="ico"/>' + rt.prize + '</h3>' +
			'			<ul id="artist_career" class="pricing-list">';
			'			</ul>' +
			'		</div>' +
			'	</div>' +
			'</div>';
			$("#artist_info").append(_html);
			
			$.each(artist_info.career, function(){
				var arr = [];
				if (this.term) arr.push(this.term);
				if (this.title) arr.push(this.title);
				$('#artist_career').append('<li>' + arr.join(' ') + '</li>');
			});
		}
		
		// 전시 경력
		if (artist_info.display && artist_info.display.length > 0) {
			_html = 
			'<div class="item">' +
			'	<div class="col-md-12">' +
			'		<div class="pricing-item wow fadeInUp animated" data-wow-delay="520ms">' +
			'			<h3 class="font-light darkcolor"><img src="/img/rental/medal.png" class="ico"/>' + rt.carr + '</h3>' +
			'			<ul id="artist_display" class="pricing-list">';
			'			</ul>' +
			'		</div>' +
			'	</div>' +
			'</div>';
			$("#artist_info").append(_html);
			
			$.each(artist_info.display, function(){
				var arr = [];
				if (this.term) arr.push(this.term);
				if (this.title) arr.push(this.title);
				$('#artist_display').append('<li>' + arr.join(' ') + '</li>');
			});
		}
		
		// 스크롤 처리
		$('.pricing-list').mCustomScrollbar({				
			theme:"minimal-dark",
			mouseWheelPixels: 400,
			mouseWheel:{ preventDefault: false },
			autoExpandScrollbar: true,
		});			
				
	    $("#artist_info").owlCarousel({
	        items: 3,
	        autoplay: true,
	        autoplayTimeout: 3000,
	        smartSpeed: 1000, // 스크롤 속도
	        autoplayHoverPause: true,
	        //loop: true,
	        margin: 0,
	        padding: 0,
	        dots: true,
	        nav: false,
	        responsive: {
	            1280: {
	                items: 3,
	            },
	            980: {
	                items: 3,
	            },
	            600: {
	                items: 2,
	            },
	            0: {
	                items: 1,
	            },
	        }
	    });
	    
	},
	
	"setDbook" : function(){	
		
		var _self = this;
		$("#dbook").hide();
		$('#nav_dbook').hide();
		$('#side_nav_dbook').hide();
			
		var $page_wrap = $('.dbook-page-wrap');
		var delay = 220;
		
		// D-book 설정되어 있는지 체크하여 처리
		var dbook_info = this.info.info;
		if (!dbook_info.dbook_filename) {	
			// DBook을 사용하지 않는 경우 샘플 Dbook 뿌려줌
			if (!g360.isM() && g360.UserInfo && g360.UserInfo.email == window.owner){
			//if (window.showdbook == 'T') {
				var dbook_sample_text = (g360.lang == 'ko' ? '해당 영역은 D-BOOK의 샘플 이미지입니다.</br>(샘플 이미지 영역은 관리자 외 방문객에게는 노출되지 않습니다.)' : 'The area is a sample image of D-BOOK.</br>(The sample image area is not diplayed to non-administrator visitors.)');
				$('#dbook_edit').html(dbook_sample_text);
				
				
				$page_wrap.find('img').remove();
				$('#dbook_page_0').attr('src', '/resource/rental/img/dbook_front.jpg');
				for (var i=1 ; i<4 ; i++) {
					delay += 80;
					$page_wrap.append($('<img src="/resource/rental/img/dbook_content_0' + i + '.jpg' + '" class="wow animate__fadeInRight animate__animated" data-wow-delay="' + delay + 'ms">'));
				}
				$('#dbook_detail_view').hide();
				$("#dbook").show();
			}
			return;	
		}
		
		var email = this.info.email;
		var dbook_url = g360.dbook_path(email, dbook_info.dbook_filename);
		var thum_path = '/artimage/' + email + '/dbook/dbook_images/' + this.info.dockey;
		
		$('#dbook_page_0').attr('src', thum_path + '/0.png?open&ver=' + dbook_info.dbook_version);
		
		var cnt = dbook_info.dbook_page_count;
		
		// 상세페이지 3개 표시
		$page_wrap.find('img').remove();
		for (var i=1 ; i<cnt ; i++) {
			if (i>3) break;
			delay += 80;
			$page_wrap.append($('<img src="' + thum_path + '/' + i + '.png?open&ver=' + dbook_info.dbook_version + '" class="wow animate__fadeInRight animate__animated" data-wow-delay="' + delay + 'ms">'));
		}
	//	debugger;
	//	$('#dbook_detail_view').attr('href', dbook_url).show();
		var image_array = new Array();
		for (var k = 0; k < cnt; k++){
			var obj = new Object();
			obj.src = thum_path + "/" + k + ".png?open&ver=" + dbook_info.dbook_version;
			obj.thumb = thum_path + "/thumbnail/" + k + ".png?open&ver=" + dbook_info.dbook_version ;
			image_array.push(obj);
		}				
		
		
		$(".flipbook-overlay").empty();
		
		if (typeof(rs.info.dbookurl) != "undefined" && rs.info.dbookurl != ""){
			
		}else{
			$("#dbook_detail_view").off().show();
			$("#dbook_detail_view").flipBook({
				pages:image_array,			
				lightBox:true,
				lightBoxFullscreen:false,	
				thumbnailsOnStart:false,
				deeplinkingPrefix:"book1_",
				
			//	lightboxStartPage: 0,
				viewMode: 'webgl',
				shadows:true,
				shadowOpacity:0.2,
				pageHardness:1.2,
				coverHardness:1.2,
				pageRoughness:1,
				pageMetalness:0,
				pageSegmentsW:6,
				antialias:false,
				pan:0,
				tilt:-0,
				panMax:20,
				panMin:-20,
				tiltMax:0,
				tiltMin:-60,
				rotateCameraOnMouseDrag:true,
				aspectRatio:2, 
				currentPage:{"enabled":true,"title":"Current page","vAlign":"top","hAlign":"left","order":""},
				btnFirst:{"enabled":true,"title":"First Page","vAlign":"","hAlign":"","order":"","icon":"fa-angle-double-left","icon2":"first_page"},			
				btnPrev:{"enabled":false,"title":"Previous Page","vAlign":"","hAlign":"","order":"","icon":"fa-chevron-left","icon2":"chevron_left"},
				btnNext:{"enabled":false,"title":"Next Page","vAlign":"","hAlign":"","order":"","icon":"fa-chevron-right","icon2":"chevron_right"},
				btnLast:{"enabled":true,"title":"Last Page","vAlign":"","hAlign":"","order":"","icon":"fa-angle-double-right","icon2":"last_page"},
				btnAutoplay:{"enabled":false,"title":"Autoplay","vAlign":"","hAlign":"","order":"","icon":"fa-play","iconAlt":"fa-pause","icon2":"play_arrow","iconAlt2":"pause"},
				btnZoomIn:{"enabled":false,"title":"Zoom in","vAlign":"","hAlign":"","order":"","icon":"fa-plus","icon2":"zoom_in"},
				btnZoomOut:{"enabled":false,"title":"Zoom out","vAlign":"","hAlign":"","order":"","icon":"fa-minus","icon2":"zoom_out"},
				btnToc:{"enabled":false,"title":"Table of Contents","vAlign":"","hAlign":"","order":"","icon":"fa-list-ol","icon2":"toc"},
				btnThumbs:{"enabled":true,"title":"Pages","vAlign":"","hAlign":"","order":"","icon":"fa-th-large","icon2":"view_module"},
				btnShare:{"enabled":false,"title":"Share","vAlign":"","hAlign":"","order":"","icon":"fa-share-alt","icon2":"share"},
				btnPrint:{"enabled":false,"title":"Print","vAlign":"","hAlign":"","order":"","icon":"fa-print","icon2":"print"},
				btnDownloadPages:{"enabled":false,"title":"Download pages","vAlign":"","hAlign":"","order":"","icon":"fa-download","icon2":"file_download"},
				btnDownloadPdf:{"enabled":false, "url":"https:\/\/www.gallery360.co.kr\/test\/deploy\/download1.pdf"},
				btnSound:{"enabled":true,"title":"Sound","vAlign":"","hAlign":"","order":"","icon":"fa-volume-up","iconAlt":"fa-volume-off","icon2":"volume_up","iconAlt2":"volume_mute"},
				btnExpand:{"enabled":true,"title":"Toggle fullscreen","vAlign":"","hAlign":"","order":"","icon":"fa-expand","iconAlt":"fa-compress","icon2":"fullscreen","iconAlt2":"fullscreen_exit"},
				btnSelect:{"enabled":false,"title":"Select tool","vAlign":"","hAlign":"","order":"","icon":"fas fa-i-cursor","icon2":"text_format"},
				btnSearch:{"enabled":false},
				btnBookmark:{"enabled":false,"title":"Bookmark","vAlign":"","hAlign":"","order":"","icon":"fas fa-bookmark","icon2":"bookmark"},			
				layout:1,
				skin:"dark",
				icons:"font awesome",
				useFontAwesome5:true,
				skinColor:"",
				skinBackground:"",
				backgroundColor: 'rgb(016, 016, 016)',
				backgroundTransparent:false
		      });
		}
		
		
			
		
		$("#dbook_detail_view").on("click", function(){
	
			if (typeof(rs.info.dbookurl) != "undefined" && rs.info.dbookurl != ""){
				var url = rs.info.dbookurl;
				window.open(url);
						
				return false;
			}else{
				g360.FullScreen_Open();
				var xscroll = $(window).scrollTop();			
				window.rs.changeTop = xscroll + 120;
			}
			
		});
		
		$('#nav_dbook').show();
		$('#side_nav_dbook').show();
		$("#dbook").show();
		
	},
	
	"changePosition" : function(){
		if (window.rs.changeTop) {
			$("html, body").scrollTop(window.rs.changeTop);			
		}
		window.rs.changeTop = null;
	},
	
	"setVisitor" : function() {
		var _self = this;
		
		if (this.info.memo == 'F') return;
		
		// 방명록 불러오기
		var url = "/load_memo.mon?rr=" + this.info.dockey + "&ak=&start=0&perpage=10";
		$.ajax({
			dataType : "json",
			contentType : "application/json; charset=utf-8",
			url : url,
			success : function(res){
				
				$('#visitor_slider .testimonial-text p').mCustomScrollbar('destroy');
				$("#visitor_slider").trigger('destroy.owl.carousel');
				$("#visitor_slider").empty();
				
				var _html = '';
				var _src, _comment, _name, _reviewkey;
				var cnt = 0;
				
				if (res.length > 1) {
					var data = res.splice(1);
					$.each(data, function(){
						// 최대 9개까지 표시
						if (cnt >= 9) {
							$('#btn_review_more').show();
							return false;
						} else {
							$('#btn_review_more').hide();
						}
						
						// 작품에 남긴 방명록인 경우
						if (this.art_key) {
							// 작은 사이즈의 버전 관리되는 작품으로 대체되어야 함 (TODO)
							var filekey = this.art_key;
							//var folder = filekey.split("_")[0];
							var folder = _self.getEmail(filekey);
							_src = "/artimage/" + folder + "/art/preview/" + filekey + ".jpg?open";
							
						} else {
							// 대관에 남긴 방명록인 경우
							_src = $('#exhibition .image img').attr('src');
						}
						
						_comment = this.content.replace(/(?:\r\n|\r|\n)/g, '<br />');
						_name = this.title;
						_reviewkey = this['_id']['$oid'];
						_html = _self.reviewFormat(_src, _comment, _name, _reviewkey);
						$("#visitor_slider").append(_html);
						cnt++;
					});
				}
				
				// 방명록이 3개 이하인 경우는 축하글을 띄워준다
				if (cnt < 3) {
					_src = $('#exhibition .image img').attr('src');
					_comment = '대관 서비스 오픈을 진심으로 축하드립니다.';
					_name = 'Gallery360';
					_html = _self.reviewFormat(_src, _comment, _name, 'default');  
					$("#visitor_slider").append(_html);
				}
				
				// 방명록 스크롤 처리
				$('#visitor_slider .testimonial-text p').mCustomScrollbar({				
					theme:"minimal-dark",
					mouseWheelPixels: 400,
					mouseWheel:{ preventDefault: false },
					autoExpandScrollbar: true,
				});
				
				$("#visitor_slider").owlCarousel({
			        items: 1,
			        loop: false,
			        margin: 0,
			        dots: true,
			        nav: false,
			        dotsEach: true,
			        responsive: {
			            1280: {
			                items: 3
			            },
			            980: {
			                items: 3
			            },
			            600: {
			                items: 2
			            },
			            320: {
			                items: 1
			            },
			        }
			    });
				
				
			},
			error : function(e){
				
			}
		});

		
		// 이벤트 바인딩을 1번만 수행하기 위한 변수 추가
		if (!_self.is_visitor_event_bind) {
			
			$('#btn_review_more').on('click', function(){
				_self.loadReviewAll();
			});
			
			//$('#review_all_layer .btn-popup-close').on('click', function(){
			$('#review_all_layer').on('click', function(){	// 레이어를 클릭하면 닫히도록 변경
				//_self.hideBlockUI();
				$('#review_all_list').cubeportfolio('destroy');
				$('#review_all_layer').hide();
				if (!_self.is_body_scroll_hidden) {
					$('body').removeClass('overflow-hidden');
				}
				_self.is_body_scroll_hidden = false;
			});
			
			$('#review_all_list').on('click', function(){
				return false;
			});
			
			// 방명록 등록하기 이벤트
			$('#visitor_submit').on('click', function(){
				var usernm = $.trim($('#visitor_name').val());
				var msg = $.trim($('#visitor_msg').val());
				var pass = $.trim($('#visitor_pass').val());
				
				
				if (usernm == '') {
					g360.showToastMsg(g360.lang == 'ko' ? '이름을 입력해 주세요' : 'Please enter your name');
					//alert('이름을 입력해주세요');
					return false;
				}
				
				if (msg == '') {
					g360.showToastMsg(g360.lang == 'ko' ? '내용을 입력해 주세요' : 'Please enter the message');
					//alert('내용을 입력해주세요');
					return false;
				}
				
				if (pass == '') {
					g360.showToastMsg(g360.lang == 'ko' ? '패스워드를 입력해 주세요' : 'Please enter your password');
					//alert('패스워드를 입력해주세요');
					return false;
				}
				
				if ($('#visitor_pass').val().indexOf(' ') >= 0) {
					g360.showToastMsg(g360.lang == 'ko' ? '패스워드에는 공백을 입력할 수 없습니다' : 'Password cannot contain spaces');
					//alert('패스워드에는 공백을 입력할 수 없습니다');
					$('#visitor_pass').val('');
					$('#visitor_pass').focus();
					return false;
				}
				
				_self.registerReview();
			});
			
			_self.is_visitor_event_bind = true;
		}
		
	},
	
	"loadReviewAll" : function(artkey) {
		var _self = this;
		$('#review_all_list').empty();
		$('#review_all_layer').show();
		
		if ($('body').hasClass('overflow-hidden')) {
			_self.is_body_scroll_hidden = true;
		} else {
			$('body').addClass('overflow-hidden');
		}
		
		g360.history_record_rental('review_all_layer');
		
		// 방명록 불러오기
		var url = "/load_memo.mon?rr=" + this.info.dockey + "&start=0&perpage=1000&ak=";
		if (artkey) url += artkey;
		$.ajax({
			dataType : "json",
			contentType : "application/json; charset=utf-8",
			url : url,
			success : function(res){
				
				$("#review_all_list").empty();
				
				var _html = '';
				var _src, _comment, _name, _reviewkey;
				var cnt = 0;
				
				if (res.length > 1) {
					var data = res.splice(1);
					$.each(data, function(){
						// 작품에 남긴 방명록인 경우
						if (this.art_key) {
							var filekey = this.art_key;
							//var folder = filekey.split("_")[0];
							var folder = _self.getEmail(filekey);
							_src = "/artimage/" + folder + "/art/preview/" + filekey + ".jpg?open";
							
						} else {
							// 대관에 남긴 방명록인 경우
							_src = $('#exhibition .image img').attr('src');
						}
						
						_comment = this.content.replace(/(?:\r\n|\r|\n)/g, '<br />');
						_name = this.title;
						_reviewkey = this['_id']['$oid'];
						_html = _self.reviewFormat(_src, _comment, _name, (artkey ? 'art' : 'default') ); // 삭제 안되도록 default로 키를 넘김
						$("#review_all_list").append(_html);
						cnt++;
					});
				}
				
				// cbp-item 구분값을 갇기 위해 클래스 추가
				$("#review_all_list .item").addClass('cbp-item');
				
				/*
				// init 완료 후 스크롤 처리 
				$("#review_all_list").on('initComplete.cbp', function(){
					// 방명록 스크롤 처리
			    	$('#review_all_list .testimonial-text p').mCustomScrollbar({				
			    		theme:"minimal-dark",
			    		mouseWheelPixels: 400,
			    		mouseWheel:{ preventDefault: false },
			    		autoExpandScrollbar: true,
			    	});
				});
				*/
				
				$("#review_all_list").cubeportfolio({
			        layoutMode: 'grid',
			        defaultFilter: '*',
			        animationType: "quicksand",
			        gapHorizontal: 0,
			        gapVertical: 0,
			        gridAdjustment: "responsive",
			        mediaQueries: [{
			            width: 1500,
			            cols: 4,
			        }, {
			            width: 1100,
			            cols: 4
			        }, {
			            width: 800,
			            cols: 3
			        }, {
			            width: 480,
			            cols: 2
			        }, {
			            width: 320,
			            cols: 1
			        }],
			    });
				
				
			}
		});
		
		
	},
	
	"setFooter" : function() {
		var _self = this;
		var hostinfo = _self.info.info;
		if (!hostinfo) return;
		
		$('#host_label').text(g360.lang == 'ko' ? '주최' : 'Host');
		$('#host_name').html(hostinfo.host);
		
		
		// 푸터 정보 초기화
		$('#host_tel').parent().hide();
		$('#host_email').parent().hide();
		$('.host-sns-wrapper').hide();
		$('.host-sns-facebook').removeClass('show');
		$('.host-sns-twitter').removeClass('show');
		$('.host-sns-blog').removeClass('show');
		$('.host-sns-instagram').removeClass('show');
		$('.host-sns-youtube').removeClass('show');
				
		
		if (hostinfo.tel) {
			$('#host_tel').html(hostinfo.tel);
			$('#host_tel').parent().show();
		}
		if (hostinfo.email) {
			$('#host_email').html(hostinfo.email);
			$('#host_email').parent().show();
		}
		
		// SNS 설정
		var flag = false;
		if (hostinfo.facebook) {
			$('.host-sns-facebook').addClass('show');
			flag = true;
		}
		if (hostinfo.twitter) {
			$('.host-sns-twitter').addClass('show');
			flag = true;
		}
		if (hostinfo.blog) {
			$('.host-sns-blog').addClass('show');
			flag = true;
		}
		if (hostinfo.instagram) {
			$('.host-sns-instagram').addClass('show');
			flag = true;
		}
		if (hostinfo.youtube) {
			$('.host-sns-youtube').addClass('show');
			flag = true;
		}
		if (flag) {
			$('.host-sns-wrapper').show();
		}
		
		
		//사업자 정보 클릭시
		$("#pop1").on("click", function(){			
		      var url = "http://www.ftc.go.kr/info/bizinfo/communicationViewPopup.jsp?wrkr_no=8288801007";
		      g360.open_subwin(url, "750", "800", false, "info", false);
		});
		//이용약관 취급 클릭시
		$("#pop2").on("click", function(){
			var url = g360.lang == 'ko' ? '/m/privacy' : '/m/privacy_en';
			g360.open_subwin(url, "1250", "800", false, "info", false);
		});
		//개인정보 취급 클릭시
		$("#pop3").on("click", function(){
			var url = g360.lang == 'ko' ? '/m/terms' : '/m/terms_en';		
				g360.open_subwin(url, "1250", "800", false, "info", false);
		});
		
		if (g360.lang == 'ko') {
			$('#footer_ko').show();
		} else {
			$('#footer_us').show();
			$('.signmanu').hide();
		}
		
	},
	
	// 방명록 등록
	"registerReview" : function(artkey){
		var _self = this;
		
		var field = {
			name: (artkey ? 'art_review_name' : 'visitor_name'),
			msg: (artkey ? 'art_review_msg' : 'visitor_msg'),
			pass: (artkey ? 'art_review_pass' : 'visitor_pass'),
		}
		
		var usernm = $.trim($('#'+field.name).val());
		var msg = $.trim($('#'+field.msg).val());
		var pass = $('#'+field.pass).val();
		
		var json = {
			title : usernm,
			content : msg,
			password : pass,
			rental_roomkey : _self.info.dockey	
		} 
		
		if (artkey) {
			json.art_key = artkey;
		}
		
		var data = JSON.stringify(json);
		
		
		
		var url = "/save_memo.mon";
		$.ajax({
			type : "POST",
			dataType : "json",
			contentType : "application/json; charset=utf-8",
			data : data,
			url : url,
			success : function(res){
				if (res.result == "OK"){
					g360.showToastMsg(g360.lang == "ko" ? "방명록이 등록되었습니다." : "Registration completed.", 3000);
					//alert("방명록이 등록되었습니다.");
					
					
					if (artkey) {
						// 작품상세에서 등록한 경우
						gArtD.hideReviewLayer();
						gArtD.drawReview();
						
						// 메인도 처리함
						_self.setVisitor();
					} else {
						
						/*
						// 메인에서 등록한 경우
						var _src = $('#exhibition .image img').attr('src');
						var _html = _self.reviewFormat(_src, msg, usernm);
						$('#visitor_slider').trigger('add.owl.carousel', [_html, 0]);
						$('#visitor_slider').trigger('to.owl.carousel', [0, 300]);
						*/
						
						// add하는 코어 소스가 정상적으로 동작하지 않아 새로 불러와 뿌려줌
						_self.setVisitor();
					}
					
				}else{
					g360.showToastMsg(g360.lang == "ko" ? "저장시 오류가 발생하였습니다." : "Error Occurred.");
					//alert("저장시 오류가 발생하였습니다.");
				}
				$('#btn_pass_cancel').click();
			},
			error : function(e){
				//g360.gAlert("Info","오류가 발생하였습니다.", "blue", "top");
			}
		});
		
		$('#'+field.name).val('');
		$('#'+field.msg).val('');
		$('#'+field.pass).val('');
	},
	
	"reviewFormat" : function(src, comment, name, reviewkey) {
		var btn_del = '';
		if (reviewkey != 'default' && reviewkey != 'art') {
			btn_del = '<div class="testimonial-del" onclick="rs.showPassDialog(\'' + reviewkey + '\')"></div>';
		}
		
		var img_html = '';
		if (reviewkey != 'art') {
			img_html = '<div class="testimonial-photo"><div class="photo" style="background-image:url(' + src + ')"></div></div>';
		}
		
		var res = 
		'<div class="item">' +
		'	<div class="testimonial-wrapp">' + img_html + 
		'		<div class="testimonial-text">' + btn_del +
		'			<p class="bottom40">"<span>' + comment.replace(/(?:\r\n|\r|\n)/g, '<br />') + '</span>"</p>' +
		'			<h4 class="darkcolor author-name">- ' + name + '</h4>' +
		'		</div>' +
		'	</div>' +
		'</div>';
		return res;
	},
	
	"showPassDialog" : function(reviewkey, is_artdetail) {
		var _self = this;
		_self.showBlockUI();
		$('#password_layer').show();
		$('#visitor_password').focus();
		

		
		$('#btn_pass_ok').off().on('click', function(){
			var pass = $('#visitor_password').val();
			
			$.ajax({
				url : "/delete_memo.mon" + "?key=" + reviewkey + "&pw=" + pass,
				success : function(res){
					if (res.result == "OK"){
						g360.showToastMsg(g360.lang == "ko" ? "선택하신 방명록이 삭제되었습니다." : "Message has been deleted.");
						$('#visitor_password').val('');
						
						if (is_artdetail) {
							gArtD.drawReview();
						}
						
						_self.setVisitor();							
						
						$('#btn_pass_cancel').click();
					}else{
						g360.showToastMsg(g360.lang == "ko" ? "패스워드가 맞지 않습니다." : "Password does not match.");
					}
				},
				error : function(e){

				}
			});
		});
		
		$('#btn_pass_cancel').off().on('click', function(){
			_self.hideBlockUI();
			$('#password_layer').hide();
			$('#visitor_password').val('');
		});
		
		_self.isPassEventInit = true;
	},
	
	"showArtistDetail" : function(artistkey) {
		var _self = this;
		
		var data = this.artistlist[artistkey];
		var sep;
		var src_artist_ori = g360.user_photo_color_url(data.email);	//오리지널 이미지
		var src_artist = g360.user_photo_profile_url(data.email);	//사이즈에 맞춰 자른 이미지
				
		// 버전 정보 추가
		src_artist_ori += (data.photoimage_profile_version ? '?open&ver=' + data.photoimage_profile_version : '');
		src_artist += (data.photoimage_profile_version_full ? '?open&ver=' + data.photoimage_profile_version_full : '');
		
		var css_url = '';
		
		if (data.photoimage_profile_full) {
			css_url = 'url(' + src_artist + ')';
		} else if (data.photoimage_profile) {
			css_url = 'url(' + src_artist_ori + ')';
		} else {
			css_url = 'url(' + data.last_art_src + ')'
		}
		
		//$('#artist_pic_wrapper').css('background-image', 'url(' + src_artist + '),url(' + src_artist_ori + ')');
		$('#artist_pic_wrapper').css('background-image', css_url);
		$('#artist_info_name').html(data.nickname);
		$('#artist_info_ename').html(data.name_eng);
		$('#artist_info_birth').html(data.birth);
		$('#artist_info_content1 p').html(g360.textToHtml_Body(data.content));
		if (data.content2) {
			$('#artist_info_content2 p').html(g360.textToHtml_Body(data.content2));
			$('#artist_info_content2').show();
		} else {
			$('#artist_info_content2').hide();
		}
			
		
		// 소속 및 단체
		var group = '';
		sep = '';
		$.each(data.group, function(){
			group += sep;
			group += this.title;
			group += this.dept ? ' ' + this.dept : '';
			group += this.jobtitle ? ' ' + this.jobtitle : '';
			sep = '\n';
		});
		if (group == '') {
			$('#artist_info_group').hide();
			group = '정보없음';
		} else {
			$('#artist_info_group').show();
		}
		$('#artist_info_group p').html(g360.textToHtml_Body(group));
		
		// 학력
		var edu = '';
		sep = '';
		$.each(data.education, function(){
			edu += sep;
			
			var ch_end = $.trim(this.end);
			if(ch_end!=""){
				edu += this.end + '  ';	
			}
			
			edu += this.schoolname;
			edu += this.major ? '  ' + this.major : '';
			edu += this.level ? ('  ' + (this.level!="etc"&&this.level!="기타" ? this.level : '')) : '';
			edu += ' '+this.status;
			sep = '\n';
		});
		if (edu == '') {
			$('#artist_info_education').hide();
			edu = '정보없음';
		} else {
			$('#artist_info_education').show();
		}
		$('#artist_info_education p').html(g360.textToHtml_Body(edu));
		
		// 경력
		var career = '';
		sep = '';
		if (!data.career || data.career.length == 0) {
			$('#artist_info_career').hide();
			career = '정보없음';
		} else {
			career = '<table class="artist-career-table" style="width:100%;">';
			career += '<colgroup><col style="width:$width$px;" /><col style="width:auto;" /></colgroup>';
			$.each(data.career, function(){
				career += '<tr>';
				career += '<td style="width:80px">' + this.term + '</td>';
				career += '<td>' + g360.textToHtml_Body(this.title) + '</td>';
				career += '</tr>';
				if (this.term) sep = 'T';
			});
			career += '</table>';
			career = career.replace(/\$width\$/g, (sep == 'T' ? '40' : '0'));
			$('#artist_info_career').show();
		};
		$('#artist_info_career p').html(career);
		
		// 소장처 정보
		var cert = '';
		sep = '';
		if (!data.cert || data.cert.length == 0) {
			$('#artist_info_cert').hide();
			cert = '정보없음';
		} else {
			cert = '<table class="artist-career-table">';
			cert += '<colgroup><col style="width:$width$px;" /><col style="width:auto;" /></colgroup>';
			$.each(data.cert, function(){
				cert += '<tr>';
				cert += '<td>' + g360.textToHtml_Body(this.certname) + '</td>';
				cert += '</tr>';
				if (this.term) sep = 'T';
			});
			cert += '</table>';
			cert = cert.replace(/\$width\$/g, (sep == 'T' ? '40' : '0'));
			$('#artist_info_cert').show();
		};
		$('#artist_info_cert p').html(cert);
		
		// 전시 및 프로젝트 경력
		var display = '';
		sep = '';
		if (!data.display || data.display.length == 0) {
			$('#artist_info_display').hide();
			display = '정보없음';
		} else {
			display = '<table class="artist-career-table">';
			display += '<colgroup><col style="width:$width$px;" /><col style="width:auto;" /></colgroup>';
			$.each(data.display, function(){
				display += '<tr>';
				display += '<td style="width:80px">' + this.term + '</td>';
				display += '<td>' + g360.textToHtml_Body(this.title) + '</td>';
				display += '</tr>';
				if (this.term) sep = 'T';
			});
			display += '</table>';
			display = display.replace(/\$width\$/g, (sep == 'T' ? '40' : '0'));
			$('#artist_info_display').show();
		};
		$('#artist_info_display p').html(display);
		

		// 애니메이션 효과 때문에 스크롤처리에 timeout 설정
		setTimeout(function(){
			$('.artist-view-section').scrollTop(0);
		}, 100);
		
	},
	
	"showGroupList" : function(code){
		// 그룹 html 생성
		this.createGroupHtml(code);
		
		// 그룹 제목
		$('.grp-title').html(g360.textToHtml_Body(this.info.info.group_title));
		
		// 그룹 링크
		var $link_btn = $('<b><span class="hidden">링크 복사</span></b>');
		$link_btn.on('click', function(){
			var link_url = location.protocol + '//' + location.host + '/rental/group_list.jsp?key=' + code;
			g360.copyToClipboard(link_url);	
		});
		
		
		//$('#group_list_title').append($link_btn);
		$('.grp-title').append($link_btn);
		
		
		// 그룹 설명
		$('#group_list_comm').html(g360.textToHtml_Body(this.info.info.group_content));
		
		// 리스트 불러오기
		this.getGroupList(code);
	},
	"createGroupHtml" : function(code){
		var _self = this;
		var group_html = 
			'<div id="group_list_layer" class="group-exhibition-map">' +
			'	<div class="grp-header">' +
			'		<div class="center-box">' +
			'			<h2 class="logo-rental-sub">GROUP EXHIBITION</h2>' +
			'			<div class="grp-search-mobile"><span></span><span></span></div>' +
			'			<div id="btn_group_close" class="close-btn"><span></span><span></span></div>' +
			'		</div>' +
			'	</div>' +
			'	<div class="grp-list-wrap">' +
			'		<div class="center-box">' +
			'			<div class="grp-title-box">' +
			'				<h3 id="group_list_title" class="grp-title animate__animated animate__fadeInUp"></h3>' +
			'				<p id="group_list_comm" class="grp-detail animate__animated animate__fadeInUp"></p>' +
			'			</div>' +
						
			'			<div class="grp-search">' +
			'				<h3 class="grp-title"></h3>' +
			'				<b class="grp-total-view">' + (g360.lang == 'ko'?'누적 관람객 수':'View count') + ' : <span id="group_viewcount"></span></b>' +
			'				<form class="group-search-box">' +
			'					<div>' +
			'						<div class="group-search-input">' +
			'							<input id="rental_search_txt" type="search" placeholder="' + (g360.lang == 'ko' ? '검색어를 입력해 주세요' : 'Search') + '">' +
			'							<button id="btn_rental_search_reset" type="reset" value="erase"><span></span><span></span></button>' +
			'						</div>' +
			'						<button id="btn_rental_search" type="button" value="search"></button>' +
			'					</div>' +
			'				</form>' +
			'			</div>' +
		
			'			<div id="group_list" class="grp-events"></div>' +
			'		</div>' +
			'	</div>' +
			'</div>';
		$('body').append(group_html);
		
		/*
		 * 이벤트 바인딩
		 */
		
		// 닫기, 모바일 닫기
		$('#btn_group_close').on('click', function(){			
			// 모바일 닫기
			var is_mobile = $('.group-search-box .center-box').length;
			if (is_mobile) {
				
				// 검색 결과창에서 닫기 누른 경우 이전으로 되돌아가기
				if (_self.is_search_result) {
					$('#rental_search_txt').val('');
					_self.getGroupList(code);
					$(this).removeClass('searchOn');
					$('.grp-search .group-search-box').hide();
	                $('.grp-search-mobile').animate({
	                    opacity: '1',
	                    left: '0'
	                });
				} else {
					if ($(this).hasClass('searchOn')) {
						// 검색창이 열린경우 검색창 닫기
						$(this).removeClass('searchOn');
						$('.grp-search .group-search-box').hide();
		                $('.grp-search-mobile').animate({
		                    opacity: '1',
		                    left: '0'
		                });
					} else {
						// 검색창이 닫힌경우 레이어 닫기
						$('body').removeClass('overflow-hidden');
						$('#group_list_layer').fadeOut(function(){
							$('#group_list_layer').remove();
							$(window).off('scroll.grp mousewheel.grp resize.grp');
						});
					}
				}
				
				
			} else {
				
				// 일반 닫기
				$('body').removeClass('overflow-hidden');
				$('#group_list_layer').fadeOut(function(){
					$('#group_list_layer').remove();
					$(window).off('scroll.grp mousewheel.grp resize.grp');
				});
				
			}
		});
		
		// 검색어 입력
		$('#rental_search_txt').on('keydown', function(e){
			if (e.keyCode == 13) {
				var qry = $.trim($('#rental_search_txt').val());
				if (qry != '') {
					_self.getGroupList(code, qry);
				}
				return false;
			}
		});
		// 검색 버튼
		$('#btn_rental_search').on('click', function(e){
			var qry = $.trim($('#rental_search_txt').val());
			if (qry != '') {
				_self.getGroupList(code, qry);
			}
		});
		
		// 검색 닫기
		$('#btn_rental_search_reset').on('click', function(){
			_self.getGroupList(code);
			$('#rental_search_txt').focus();
		});
		
		// 스크롤에 따라 상단 헤더 변경하기
		$(window).off('scroll.grp mousewheel.grp').on({
            'scroll.grp mousewheel.grp': function() {
                var searchPosition = $('.grp-search').position().top;
                var getTop = parseInt($('.grp-search').css('top').replace('px', ''), 10) - 10;               
                
                
                if (searchPosition == getTop) {
                    $('.grp-search .grp-title').slideDown(200);
                }

                if (searchPosition > getTop) {
                    $('.grp-search .grp-title').hide(200);
                }
            }
        });
		
		$(window).off('resize.grp').on('resize.grp', function() {
            if ($(window).width() <= 768) {
                $('.group-search-box>div').addClass('center-box');
            } else {
                $('.group-search-box>div').removeClass('center-box');
                $('.grp-search .group-search-box').show();
            }
        });
		
		//MOBILE 검색버튼
        $('.grp-search-mobile').on('click', function() {
            $(this).animate({
                opacity: '0',
                left: '30px'
            });
            $('.group-exhibition-map .close-btn').addClass('searchOn');
            $('.grp-search .group-search-box').fadeIn();
            $('#rental_search_txt').focus();
        });       
		
		$(window).resize();
		
		
	},
	"getGroupList" : function(code, query){
		// 그룹 리스트
		//console.log(code);
		var $list = $('#group_list');
		var url = "/load_group_list.mon";
		var qry = '';
		
		if (query) {
			qry = query;
			$('#btn_rental_search_reset').show();
			$('#btn_rental_search').addClass('on');
			this.is_search_result = true;
		} else {
			$('#btn_rental_search_reset').hide();
			$('#btn_rental_search').removeClass('on');
			this.is_search_result = false;
		}
		
		var data = JSON.stringify({
			code : code,
			q_str : qry
		})
		
		var viewcount = 0;
		
		$list.empty();
		
		return $.ajax({
			type : "POST",
			dataType: "json",
			contenType : "application/json; charset=utf-8",
			data : data,
			url : url,
			success : function(res){
				//console.log(res);
				if (res.length == 0) {
					if (qry != '') {
						$list.append('<div class="grp-no-result">' + (g360.lang == 'ko' ? '검색 결과가 없습니다.' : 'No search result.') + '</div>');
					} else {
						alert("그룹핑된 대관이 아닙니다.");
					}
					return;
				}
				
				res.sort(function(a,b){
					var num_regex = /^(\d*)/g;
					var a_titl = parseInt(a.title.match(num_regex)[0] || "0", 10);
					var b_titl = parseInt(b.title.match(num_regex)[0] || "0", 10);
					
					var res = 0;
					if (a_titl != b_titl) {
						// 앞 번호가 숫자인 경우 
						res = (a_titl == 0 || a_titl > b_titl ? 1 : -1);
					} else {
		                // 둘 다 문자인 경우
						res = (a.title > b.title ? 1 : -1);
					}
					
					return res;

				});
				
				$.each(res, function(i){
					var rental_obj = this;
					//1~5까지 랜덤숫자
					var random = Math.floor( Math.random() * 5 + 1 );
					var $li = $(
						'<div class="grp-exhi-box animate__animated animate__fadeIn" style="animation-delay:0.' + random + 's">' +
					    '	<div class="grp-thumb" style="background-image: url(' + rental_obj.service_image + ')">' +
					    '	  	<a href="#">' +
					    '			<div class="grp-exhi-info">' +
					    '				<p class="grp-exhi-title">' + g360.textToHtml_Body(rental_obj.title) + '</p>' +
		                '				<p class="grp-exhi-detail">' + g360.textToHtml_Body(rental_obj.express) + '</p>' +
					    '			</div>' +
					    '			<div class="border-box"></div>' +
					    '		</a>' +
					    '	</div>' +
					    '</div>'
					);
					$li.on('click', function(){
						var open_url = location.protocol + '//' + location.host + '/v/' + rental_obj.short_url;
						window.open(open_url);
					});
					$list.append($li);
					
					if (!isNaN(rental_obj.viewcount)) {
						viewcount += rental_obj.viewcount;					
					}
				});
								
				$('#group_viewcount').text(g360.numberComma(viewcount));
				$('#group_list_layer').show();
			},
			error : function(e){
				alert("오류가 발생했습니다.");
				console.log(e);
			}
			
		});
	},
	
	"showGroupList_bak" : function(code) {
		var _html = '';
		
		// 그룹 제목
		$('#group_list_title').html(g360.textToHtml_Body(this.info.info.group_title));
		
		// 그룹 링크
		var $link_btn = $('<span class="btn-group-link"></span>');
		$link_btn.on('click', function(){
			var link_url = location.protocol + '//' + location.host + '/rental/group_list.jsp?key=' + code;
			g360.copyToClipboard(link_url);	
		});
		
		$('#group_list_title').append($link_btn);
		
		// 그룹 설명
		$('#group_list_comm').html(g360.textToHtml_Body(this.info.info.group_content));
		
		// 그룹 리스트
		var $list = $('#group_list');
		var url = "/load_group_list.mon";	
		
		var data = JSON.stringify({
			code : code
		});
		
		var viewcount = 0;
		$.ajax({
			type : "POST",
			dataType: "json",
			contenType : "application/json; charset=utf-8",
			data : data,
			url : url,
			success : function(res){

				res.sort(function(a,b){
					var sub_a = a.title.replace(/\s*/g, ' ');
					var sub_b = b.title.replace(/\s*/g, ' ');
					 return sub_a < sub_b ? -1 : sub_a > sub_b ? 1 : 0;
				});
				
				$.each(res, function(i){
					var rental_obj = this;
					var random = Math.floor( Math.random() * 5 + 1 );
					var $li = $(
						'<li class="select_group-list_rental animate__animated animate__fadeIn" style="animation-delay:0.' + random + 's">' +
					    '	<div class="imgbox_group-list_rental" style="background-image: url(' + rental_obj.service_image + ')">' +
					    '	  	<div class="imgbox-blank"></div>' +
					    '		<span>' +
					    '			<h4>' + g360.textToHtml_Body(rental_obj.title) + '</h4>' +
		                '			<p>' + g360.textToHtml_Body(rental_obj.express) + '</p>' +
		                '			<div class="rental-view-cnt"><img src="/img/rental_landing/icon-rental-view.png">&nbsp;&nbsp;' + g360.numberComma(rental_obj.viewcount) + '</div>' +
					    '		</span>' +
					    '	</div>' +
					    '</li>'
					);
					$li.on('click', function(){
						var open_url = location.protocol + '//' + location.host + '/v/' + rental_obj.short_url;
						window.open(open_url);
					});
					$list.append($li);
					
					if (!isNaN(rental_obj.viewcount)) {
						viewcount += rental_obj.viewcount;					
					}
				});
				
				$('#group_viewcount').text(g360.numberComma(viewcount));
			},
			error : function(e){
				console.log(e);
			}
			
		});
			
		
	},
	
	"setVoteMenu" : function(){
		if (this.info.info.vote != 'T') return;
		
		var $vote_li = $('<li class="nav-item"><a class="nav-link" href="javascript:rs.showVoteResultLayer();">Vote</a></li>');
		$('.navbar-nav').prepend($vote_li);
	},
	
	"showVoteResultLayer" : function(){
		var _self = this;
		this.showBlockUI();
		
		var is_sms = (this.info.info.vote_method == '2' || this.info.info.vote_method == '3' ? true : false);
		var prefix = (is_sms ? 'sms_' : '');
		
		
		var help = 
		`<div class="vote-ly">
			<div id="btn_vote_close" class="btn-close"><span></span><span></span></div>
			<div class="vote-content-wrap">
				<div class="W-con">
			        <div class="cen-con">
			            <p class="tit fw-900"><b class="p-color fw-900">작품 투표방법</b>을 한눈에!</p>
			            <p class="s-tit">투표 전에 작품 투표방법을 확인하세요</p>
			            
			            <div id="vote_help_slick" class="slick-container">
			                <div class="item">
			                    <img class="pc" src="/resource/rental/img/vote/step01.png" alt="투표방법">
			                    <img class="m" src="/resource/rental/img/vote/step01_m.png" alt="투표방법">
			                    <p class="con-txt">작품 리스트에서 <b class="p-color">투표하고자 하는 작품을 선택</b>해주세요.</p>
			                </div>
			                <div class="item">
			                    <img class="pc" src="/resource/rental/img/vote/step02.png" alt="투표방법">
			                    <img class="m" src="/resource/rental/img/vote/step02_m.png" alt="투표방법">
			                    <p class="con-txt">선택 작품의 <b class="p-color">상세페이지에서 투표하기를 클릭</b>하세요.</p>
			                </div>
			                <div class="item">
			                    <img class="pc" src="/resource/rental/img/vote/${prefix}step03.png" alt="투표방법">
			                    <img class="m" src="/resource/rental/img/vote/${prefix}step03_m.png" alt="투표방법">
			                    <p class="con-txt">인증번호를 받기 위한 <b class="p-color">${is_sms?'휴대폰 번호':'이메일 주소'}를 입력</b>해주세요.</p>
			                </div>
			                <div class="item">
			                    <img class="pc" src="/resource/rental/img/vote/${prefix}step04.png" alt="투표방법">
			                    <img class="m" src="/resource/rental/img/vote/${prefix}step04_m.png" alt="투표방법">
			                    <p class="con-txt">${is_sms?'휴대폰 번호로':'이메일로'} 전달 받은 <b class="p-color">인증번호를 입력한 후 투표하기 버튼을 클릭</b>해주세요.</p>
			                </div>
			                <div class="item">
			                    <img class="pc" src="/resource/rental/img/vote/step05.png" alt="투표방법">
			                    <img class="m" src="/resource/rental/img/vote/step05_m.png" alt="투표방법">
			                    <p class="con-txt"><b class="p-color">투표가 완료</b> 되었습니다!</p>
			                </div>
			            </div>
			        </div>
			    </div>
			</div>
	    </div>`;
		
		var help_en =
		`<div class="vote-ly">
			<div id="btn_vote_close" class="btn-close"><span></span><span></span></div>
			<div class="vote-content-wrap">
				<div class="W-con">
			        <div class="cen-con">
			            <p class="tit fw-900">How to <b class="p-color fw-900">vote!</b></p>
			            <p class="s-tit">Check how to vote before you vote.</p>
			            
			            <div id="vote_help_slick" class="slick-container">
			                <div class="item">
			                    <img class="pc" src="/resource/rental/img/vote/step01_eng.png" alt="Voting method">
			                    <img class="m" src="/resource/rental/img/vote/step01_m_eng.png" alt="Voting method">
			                    <p class="con-txt">Please <b class="p-color">select the artwork you want to vote</b> for from the list of artworks.</p>
			                </div>
			                <div class="item">
			                    <img class="pc" src="/resource/rental/img/vote/step02_eng.png" alt="Voting method">
			                    <img class="m" src="/resource/rental/img/vote/step02_m_eng.png" alt="Voting method">
			                    <p class="con-txt">Click <b class="p-color">vote on the detail page</b> of the selected artwork.</p>
			                </div>
			                <div class="item">
			                    <img class="pc" src="/resource/rental/img/vote/${prefix}step03_eng.png" alt="Voting method">
			                    <img class="m" src="/resource/rental/img/vote/${prefix}step03_m_eng.png" alt="Voting method">
			                    <p class="con-txt">Please <b class="p-color">enter your ${is_sms?'mobile phone number':'email address'}</b> to reveice the varify code.</p>
			                </div>
			                <div class="item">
			                    <img class="pc" src="/resource/rental/img/vote/${prefix}step04_eng.png" alt="Voting method">
			                    <img class="m" src="/resource/rental/img/vote/${prefix}step04_m_eng.png" alt="Voting method">
			                    <p class="con-txt">Please <b class="p-color">enter the verify code</b> you received by ${is_sms?'mobile':'email'} and <b class="p-color">click vote button.</b></p>
			                </div>
			                <div class="item">
			                    <img class="pc" src="/resource/rental/img/vote/step05_eng.png" alt="Voting method">
			                    <img class="m" src="/resource/rental/img/vote/step05_m_eng.png" alt="Voting method">
			                    <p class="con-txt">The vote has been <b class="p-color">completed!</b></p>
			                </div>
			            </div>
			        </div>
			    </div>
		    </div>
		</div>`;
		
		var $help = $(g360.lang == 'ko' ? help : help_en);
		
		// 투표 종료된 경우 투표하기 도움말 표시 안함
		if (_self.info.info.vote_end == 'T') {
			help = '<div class="vote-ly"><div id="btn_vote_close" class="btn-close white"><span></span><span></span></div><div class="vote-content-wrap"></div></div>';
			$help = $(help);
		}
		
		$('body').append($help);
		$('#btn_vote_close').on('click', function(){
			$('.vote-ly').remove();
			_self.hideBlockUI();
		});
		$('#vote_help_slick').slick();
		g360.history_record_rental("btn_vote_close");
		
		this.voteResultProc();

	},
	
	"voteResultProc" : function(){
		var _self = this;
		
		if (this.info.info.vote_open != 'T') {
			if (g360.UserInfo == null) return;
			if (g360.UserInfo.email != owner) return;
		}
		
		if (this.info.info.group_code) {
			
			// 그룹정보를 가져온 경우 두 번호출 안되도록 처리
			if (typeof(this.vote_group) != 'undefined') {
				
				this.getVoteResult(this.info.dockey, this.vote_group.length > 1 ? true : false);
				
			} else {

				// 그룹에 대한 정보들을 가져옴
				$.ajax({
					type : "POST",
					dataType: "json",
					contenType : "application/json; charset=utf-8",
					data : JSON.stringify({code:this.info.info.group_code, q_str : ''}),
					url : '/load_group_list.mon',
					success : function(res){
						var gp = [];
						
						res.sort(function(a,b){
							var num_regex = /^(\d*)/g;
							var a_titl = parseInt(a.title.match(num_regex)[0] || "0", 10);
							var b_titl = parseInt(b.title.match(num_regex)[0] || "0", 10);
							
							var res = 0;
							if (a_titl != b_titl) {
								// 앞 번호가 숫자인 경우 
								res = (a_titl == 0 || a_titl > b_titl ? 1 : -1);
							} else {
				                // 둘 다 문자인 경우
								res = (a.title > b.title ? 1 : -1);
							}
							
							return res;
						});
						
						// 투표 기능 활성화된 대관만 처리
						$.each(res, function(){
							if (this.vote == 'T') {
								gp.push(this);
							}
						});
						
						// vote_group 초기셋팅
						_self.vote_group = gp;
												
						_self.getVoteResult(_self.info.dockey, _self.vote_group.length > 1 ? true : false);
						
					},
					error : function(e){
						console.log('rs.voteResultProc Error', e);
					}
					
				});
			}

		} else {
			this.getVoteResult(this.info.dockey, false);
		}
	},
	"getVoteResult" : function(r_key, is_group) {
		var _self = this;
		$.ajax({
			url : '/check_vote_result.mon?rk=' + r_key + '&group=' + (is_group ? 'T' : 'F'),
			success: function(res){
				_self.showVoteResult(r_key, res, is_group);					
			}
		});
	},
	
	"showVoteResult" : function(r_key, data, is_group) {
		$('.vote-ly .W-con.bottom').remove();
		
		// 그룹처리
		var sel_html = '';
		var subj = this.info.title;
		
		if (typeof(this.vote_group) != 'undefined' && this.vote_group.length > 1) {
			
			// 제목 가져오기
			if (is_group) {
				subj = this.info.info.group_title;
			} else {
				$.each(this.vote_group, function(){
					if (this.dockey == r_key) {
						subj = this.title;
						return false;
					}
				});
			}
			
			sel_html += '<select name="sources" id="vote_select" class="vote-select sources" placeholder="' + subj + '">';
			sel_html += '	<option value="group"' + (is_group ?  ' class="selection"' : '') + '>' + this.info.info.group_title + '</option>';
			$.each(this.vote_group, function(){
				sel_html += '<option value="' + this.dockey + '"' + (this.dockey == r_key && is_group == false ? ' class="selection"' : '') + '>' + this.title + '</option>';
			});
			sel_html += '</select>';
		}

		var html = 
		'<div class="W-con bottom">' +
		'	<div class="cen-con">' +
		'		<p class="tit fw-900">'+ (g360.lang == 'ko' ? '투표현황 보기' : 'View voting status') +'</p>';
		
		html += g360.lang == 'ko' ?
		'		<p class="s-tit">' + subj + '<br class="br_pc"><b class="p-color">투표 현황을 공개</b> 합니다.</p>':
		'		<p class="s-tit"><b class="p-color">Announce the voting status</b> of <br class="br_pc">' + subj + '</p>';
		
		html +=
		'		<div class="status">' +
		'			<p class="votes"><b style="color:red; padding-right: 5px;">♥ </b> ' + (g360.lang == 'ko'?'총 투표수':'Total votes cast') + ':<b style="padding-left:5px;">' + g360.numberComma(data.totalcount) + (g360.lang == 'ko'?'표':' votes') + '</b></p>';
		html += sel_html;
		html +=
		'		</div>';
		
		html += this.getVoteRank(data);
		
		html +=
		'</div>';
		
		$('.vote-content-wrap').append(html);
		
		this.voteEventBind();
	},
	
	"getVoteRankTop" : function(data){
	
		// 3개 이하인 경우 표시 안함
		if (data.list.length < 3) return '';
		
		// 동점이 있는 경우 상단 순위 표시 안함
		if (data.list[0].vote == data.list[1].vote ||
			data.list[0].vote == data.list[2].vote ||
			data.list[1].vote == data.list[2].vote) {
			return '';
		}
		
		// 3,4위 동점이면 표시 안함
		if (data.list.length > 3 && data.list[2].vote == data.list[3].vote) {
			return '';
		}
		
		var art_src_1 = g360.preview_img_path(this.getEmail(data.list[0].art_key), data.list[0].art_key);
		var art_src_2 = g360.preview_img_path(this.getEmail(data.list[1].art_key), data.list[1].art_key);
		var art_src_3 = g360.preview_img_path(this.getEmail(data.list[2].art_key), data.list[2].art_key);
		
		var html = '';
		html +=
			'		<div class="rank-area">' +
			'			<ul class="rank-box second">' +
			'				<li class="rank">2nd</li>' +
			'				<li class="name mb-15">' + data.list[1].artist + '</li>' +
			'				<li class="pic-area">' +
			'					<div class="m-pic"><img src="' + art_src_2 + '" data-artkey="' + data.list[1].art_key + '" class="art-link"></div>' +
			(data.list[1].photoimage_profile ? '<div class="s-pic"><img src="' + g360.user_photo_thum_url(this.getEmail(data.list[1].art_key)) + '?ver=' + data.list[1].photoimage_profile_version + '"></div>' : '') +
			'				</li>' +
			'				<li class="noa">' + data.list[1].title + '</li>' +
			'				<li class="nov"><b class="f-red">♥</b> ' + g360.numberComma(data.list[1].vote) + '</li>' +
			'			</ul>' +
			'			<ul class="rank-box winner">' +
			'				<li class="rank winner">1st</li>' +
			'				<li class="name mb-15">' + data.list[0].artist + '</li>' +
			'				<li class="pic-area">' +
			'					<div class="m-pic"><img src="' + art_src_1 + '" data-artkey="' + data.list[0].art_key + '" class="art-link"></div>' +
			(data.list[0].photoimage_profile ? '<div class="s-pic"><img src="' + g360.user_photo_thum_url(this.getEmail(data.list[0].art_key)) + '?ver=' + data.list[0].photoimage_profile_version + '"></div>' : '') +
			'				</li>' +
			'				<li class="noa">' + data.list[0].title + '</li>' +
			'				<li class="nov"><b class="f-red">♥</b> ' + g360.numberComma(data.list[0].vote) + '</li>' +
			'			</ul>' +
			'			<ul class="rank-box third">' +
			'				<li class="rank">3rd</li>' +
			'				<li class="name mb-15">' + data.list[2].artist + '</li>' +
			//'				<!-- <li class="s-name">Ilsam Park</li> -->' +
			'				<li class="pic-area">' +
			'					<div class="m-pic"><img src="' + art_src_3 + '" data-artkey="' + data.list[2].art_key + '" class="art-link"></div>' +
			(data.list[2].photoimage_profile ? '<div class="s-pic"><img src="' + g360.user_photo_thum_url(this.getEmail(data.list[2].art_key)) + '?ver=' + data.list[2].photoimage_profile_version + '"></div>' : '') +
			'				</li>' +
			'				<li class="noa">' + data.list[2].title + '</li>' +
			'				<li class="nov"><b class="f-red">♥</b> ' + g360.numberComma(data.list[2].vote) + '</li>' +
			'			</ul>' +
			'		</div>';
		return html; 
		
	},
	
	"getVoteRank" : function(data){
		
		var top_html = this.getVoteRankTop(data);
		var html = '';
		var vote_cnt = 0;
		var list = data.list;
		var rank = 0;
		
		// 상단에 뿌려놓은 데이터가 있는 경우
		if (top_html != '') {
			if (data.list.length == 3) return top_html;
			list = list.splice(3);
			rank += 3;
		}	
		
		var ty = data.type == ""? 1:parseInt(data.type);
		ty = ty==1?'Artist':(ty==2?'Presenter':(ty==3?'Student':'Company'));
		
		html +=
		'		<div class="rank-table">' +
		'			<table>' +
		'				<thead>' +
		'					<tr>' +
		'						<th>Ranking</th>' +
		'						<th>Title / '+ ty +'</th>' +
//		'						<th>Title/Artist</th>'+
		'						<th style="width: 15%">Total votes cast</th>' +
		'					</tr>' +
		'				</thead>' +
		'				<tbody>';
		
		$.each(list, function(idx, val){
			// 공동 순위 체크
			if (vote_cnt != val.vote) {
				vote_cnt = val.vote;
				rank++;
			}
			
			html +=
			'				<tr>' +
			'					<td>' + rank + '</td>' +
			'					<td>' +
			'						<b class="art-link" data-artkey="' + val.art_key + '">' + val.title + '</b>' +
			'						<div class="artist_div">'+
			'							<div class="artist_sub">'+ty+'</div>'+
			'							<p class="artist"><span class="rank-eng">' + val.artist + '</span></p>' +
			'						</div>'+
			'					</td>' +
			'					<td>' + g360.numberComma(val.vote) + '</td>' +
			'				</tr>';
		});
		
		// 테이블에 표시할 데이터가 없는 경우
		if (list.length == 0) { 
			html += '<tr><td colspan="3" style="height:130px;line-height:130px;">'+(g360.lang == 'ko' ? '현재 투표된 내용이 없습니다.' : 'There are currently no votes.')+'</td></tr>';
		}
		
		html +=
		'				</tbody>' +
		'			</table>' +
		'		</div>';
		return top_html + html;
	},
	
	"voteEventBind" : function(){
		var _self = this;
		$(".vote-select").each(function() {
			var classes = $(this).attr("class"),
				id = $(this).attr("id"),
				name = $(this).attr("name");
			var template = '<div class="' + classes + '">';
			template += '<span class="vote-select-trigger">' + $(this).attr("placeholder") + '</span>';
			template += '<div class="vote-options">';
			$(this).find("option").each(function() {
				var cls = $(this).attr("class") ? $(this).attr("class") : '';
				if ($(this).hasClass('selection')) {
					$('#vote_select').val($(this).attr("value"));
				}
				template += '<span class="vote-option ' + cls + '" data-value="' + $(this).attr("value") + '">' + $(this).html() + '</span>';
			});
			template += '</div></div>';

			$(this).wrap('<div class="vote-select-wrapper"></div>');
			$(this).hide();
			$(this).after(template);
		});
		$(".vote-option:first-of-type").hover(function() {
			$(this).parents(".vote-options").addClass("option-hover");
		}, function() {
			$(this).parents(".vote-options").removeClass("option-hover");
		});
		$(".vote-select-trigger").on("click", function() {
			$('html').one('click', function() {
				$(".vote-select").removeClass("opened");
			});
			$(this).parents(".vote-select").toggleClass("opened");
			event.stopPropagation();
		});
		
		$(".vote-option").on("click", function() {
			var r_key = $(this).data('value');
			if ($('#vote_select').val() == r_key) {
				$(this).parents(".vote-select").removeClass("opened");
			} else {
				if (r_key == 'group') {
					_self.getVoteResult(_self.info.dockey, true);
				} else {
					_self.getVoteResult(r_key, false);					
				}
			}
		});
		
		// 스크롤상단이 투표현황 보기인 경우 X버튼 흰색으로 변경
		var $vote_result = $('.W-con.bottom'); 
		$('.vote-ly').on('scroll', function(){
			var pos = $vote_result.position().top;
			if (pos < 20) {
				$('#btn_vote_close').addClass('white');
			} else {
				$('#btn_vote_close').removeClass('white');
			}
		});
		
	},
	
	"showBlockUI" : function(){
		if (!$('.blockui').is(':visible')) {
			$('.blockui').show();
			$('body').addClass('overflow-hidden');
		}
	},
	"hideBlockUI" : function(remove_pass){
		$('.blockui').hide();
		if (!remove_pass) $('body').removeClass('overflow-hidden');
	},
	"hideLoading" : function(){
		$('.loader').fadeOut(800);
	    $('.side-menu').removeClass('opacity-0');
	},
	"showLoadingTop" : function(msg){
		$('#loader_top').show();
		if (msg) {
			$('#loading_msg').text(msg);			
		}
	},
	"hideLoadingTop" : function(){
		$('#loader_top').hide();
	}
	
}


if (document.addEventListener) {
    document.addEventListener('webkitfullscreenchange', exitHandler, false);
    document.addEventListener('mozfullscreenchange', exitHandler, false);
    document.addEventListener('fullscreenchange', exitHandler, false);
    document.addEventListener('MSFullscreenChange', exitHandler, false);
}



function exitHandler() {
    if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
    	//console.log("exitHandler")
    	//console.log($(document).find("[data-name=btnClose]"));
    	$(document).find("[data-name=btnClose]").click();
    	
    	//$(".flipbook-overlay").hide();
    	//window.location.hash="";
    }
}