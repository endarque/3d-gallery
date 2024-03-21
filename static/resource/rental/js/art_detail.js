function ArtDetail(){
	this.wrapper = $('#art_detail_wrapper');
	this.cur_id = '';
	this.cur_art_info = null;
	this.audio = null;
	this.is_vr = false; // VR화면에서 열었는지 여부
	this.use_3d = false;
	this.use_fyuse = false;
	this.use_img = true;
}

ArtDetail.prototype = {
	"init" : function(id, is_vr){
		var _self = this;
		_self.cur_id = id;
		
		// 로딩 전 상세화면 숨김처리
		$('#art_detail_wrapper').css('opacity', 0);

		
		this.getArtInfo(id).always(function(){
			// 비디오를 바로 띄우는 경우
			if (window.rs && rs.info && rs.info.type == 'pfizer' && _self.cur_art_info.art_mp4_filename) {
				
				// 비디오 재생시 백그라운드 음악 관련 처리
				try {
					var top_pano = top._pano || top.__pano1 || '';
					if (top_pano) {
						top_pano.krpano1.call('pausesound(bgsnd)');
						if (top_pano.krpano1.get('layer[close_freim_url_addhs]')){
							top_pano.krpano1.set('layer[close_freim_url_addhs].onclick', top_pano.krpano1.get('layer[close_freim_url_addhs].onclick') + "if(get(layer[snd2].crop) == '0|0|50|50', resumesound(bgsnd));");
						}						
					}
				} catch(e){}
				
				$('body').addClass('video-only');
				var _email = _self.cur_art_info.art_mp4_filename.substring(0, _self.cur_art_info.art_mp4_filename.lastIndexOf('_'));
				var video_src = g360.video_path(_email, _self.cur_art_info.art_mp4_filename);
				g360.showVideo(video_src);
				
				var video_promise = $('#video_layer video').get(0).play();
				if (video_promise !== undefined) {
					video_promise.then(function(){
						
					}).catch(function(){
						// 자동재생 안되는 경우
						var $play_mask = $('<div style="width: 100%;height: 100%;position: absolute;top: 0;left: 0;background: rgba(0,0,0,0.5);"><div style="color: #fff;font-size:16px;position: absolute;width:95%;text-align:center;top: 50%;left: 50%;transform: translate(-50%,-50%);">터치하시면 동영상이 재생됩니다</div></div>');
						$('#video_layer .video_wrapper').prepend($play_mask);
						$play_mask.on('click', function(){
							$('#video_layer video').get(0).play();
							$play_mask.remove();
						});
					});
					
				}
				return;
			}
			
			$('#art_detail_wrapper').show();
			clearTimeout(_self.loader);
			_self.eventBind();
			_self.dispInfo();
			_self.drawRentalText();
			rs.hideLoadingTop();
			
			// 로딩 완료 후 상세화면 표시
			$('#art_detail_wrapper').css('opacity', 1);							
		});
		
		
		
		// VR에서 작품상세 오픈했는지 여부
		if (is_vr) {
			_self.is_vr = true;
			$('body').addClass('vr-detail');
			
			// VR 작품상세는 iframe에서 띄워지므로 이벤트 바인드를 새로 한다
			$('#review_all_layer').on('click', function(){
				$('#review_all_layer').hide();
				$('#review_all_list').cubeportfolio('destroy');
			});
		}
			
		g360.history_record_rental("art_detail_header");
	},
	"drawRentalText" : function(){
		// 대관 타입별 텍스트 설정
		var rt = g360.rental_text;
		var t1_txt, t2_txt;
		
		
		if (g360.lang == 'ko') {
			t1_txt = (rs.info.info.rental_type != '4' ? rt.tab1 + '소개' : rt.tab1);
			t2_txt = (rs.info.info.rental_type != '4' ? rt.tab2 + '소개' : rt.tab2 + '정보');
		} else {
			t1_txt = 'About ' + rt.tab1;
			t2_txt = 'About ' + rt.tab2;
		}
		
		$('#art_detail_wrapper').find('.rental-txt-artist').text(rt.rental_artist + '.');
		$('#art_detail_wrapper').find('.rental-txt-tab1').text(t1_txt);
		$('#art_detail_wrapper').find('.rental-txt-tab2').text(t2_txt);
		$('#art_detail_wrapper').find('.rental-txt-tab3').text(rt.tab3);
		$('#review_reg_layer').find('.rental-txt-memo2').text(rt.rental_memo2);
		
		// 일반전시 타입이 아니면 장르, 재료 등 숨김처리
		if (rs.info.info.rental_type && rs.info.info.rental_type != '1') {
			this.wrapper.find('.curie_info .info_genre').closest('dl').hide();
			this.wrapper.find('.curie_info .info_material').closest('dl').hide();
		}
		
		$('.btn_msg').text(g360.lang=='ko'?'방명록 남기기':'Add Message');
		
	},
	"dispInfo" : function() {
		var _self = this;
		var disp_idx = 0;
		var has_artist_info = true;
		var has_art_info = true;
		
		// 작품 소개 정보가 없는 경우 숨김 처리
		if (_self.wrapper.find('.curie_view_info:eq(0)').html() == '') {
			_self.wrapper.find('.curie_view_tab li:eq(0)').hide();
			has_art_info = false;
		}
		
		if (_self.wrapper.find('.curie_view_info:eq(1)').html() == '') {
			_self.wrapper.find('.curie_view_tab li:eq(1)').hide();
			has_artist_info = false;
		}
		
		if (has_art_info) {
			disp_idx = 0;
		} else if (has_artist_info) {
			disp_idx = 1;
		} else {
			disp_idx = 2;
		}
		
		// 방명록 숨김선택 처리
		if (rs.info && rs.info.memo == 'F') {
			_self.wrapper.find('.curie_view_tab li:eq(2)').remove();
			_self.wrapper.find('.curie_link').remove();
		} 
		
		// 상세정보 숨김
		if (rs.info && rs.info.detail_display == '1') {
			// 좌측 상세 정보, 사이즈 정보 숨김
			_self.wrapper.find('.info_size').hide();
			_self.wrapper.find('.curie_info').hide();
		}
		
		// 각각의 탭 숨김 
		if (rs.info && rs.info.tab1 == 'F') {
			_self.wrapper.find('.curie_view_tab li:eq(0)').hide();
		}
		if (rs.info && rs.info.tab2 == 'F') {
			_self.wrapper.find('.curie_view_tab li:eq(1)').hide();
		}
		if (rs.info && rs.info.tab3 == 'F') {
			_self.wrapper.find('.curie_view_tab li:eq(2)').hide();
		}
		// 탭 영역  숨김
		if (rs.info && rs.info.tab == 'F') {
			_self.wrapper.find('.curie_view_tab').hide(); 
		}
		
		_self.wrapper.find('.curie_view_tab li:eq(' + disp_idx + ')').click();
	},
	"getArtInfo" : function(id){		
		var _self = this;
		return $.ajax({
			url: '/select_art_info_rental.mon?dockey=' + id,
			success: function(data){
				_self.cur_art_info = data;
				
				_self.drawArtInfo(data);
				
				/*
				var _tmp = $('<div></div>')
							.data('url', g360.preview_img_path(data.email, data.art_img_filename))
							.data('width', parseInt(data.art_width) * 10)
							.data('height', parseInt(data.art_height) * 10);
				*/
				//setTimeout(function(){_self._selectPicture(_tmp);}, 200);
			} 
		});
	},
	"hideArtDetail" : function(){
		var _self = this;
		$('#art_detail_layer').hide();
		
		// 로딩중 수행중지
		if (_self.loader) clearTimeout(_self.loader);
		
		// 오디오 처리 중지
		if (g360.time_interval) clearInterval(g360.time_interval);
		g360.time_interval = null;
		
		// 확대보기 수행중지
		if (_self.zoomProc) clearTimeout(_self.zoomProc);
		
		_self.wrapper.empty();
		$('body').removeClass('overflow-hidden');
		
		// Fyuse 사용하는 경우 메모리 클리어 (전역 변수 처리)
		if (_self.use_fyuse) {
			FYU.removeAll();
		}
		
		$(window).off('resize.3d_check');
	},
	"eventBind" : function(){
		var _self = this;
		
		// 헤더 이벤트 처리
		$('#art_detail_header').off().on('click', function(){
			_self.hideArtDetail();
		});
		
		// 확대보기 이미지 다운로드 진행상황을 확인하기 위해 Image객체 함수 추가
		Image.prototype.load = function(url) {
			var thisImg = this;
			var xmlHTTP = new XMLHttpRequest();
			xmlHTTP.open('GET', url, true);
			xmlHTTP.responseType = 'arraybuffer';
			xmlHTTP.onload = function(e) {
				var blob = new Blob([this.response]);
				thisImg.src = window.URL.createObjectURL(blob);
			};
			xmlHTTP.onprogress = function(e) {
				thisImg.completedPercentage = parseInt((e.loaded / e.total) * 100);
				if (typeof(thisImg.progress) == 'function') {
					thisImg.progress(thisImg.completedPercentage, e.total);
				}
			};
			xmlHTTP.onloadstart = function() {
				thisImg.completedPercentage = 0;
			};
			xmlHTTP.send();
		};
		Image.prototype.completedPercentage = 0;
		
		
		// 확대보기
		if (_self.use_img) {
			$('.curie_img img').on('click', function(){
				
				$('.blockui').addClass('opacity-9').show();
				
				var mz = g360.maxZindex();
				$('#art_zoom_detail').empty();
				$('#art_zoom_wrapper').css('z-index', mz+1).show();
				
				var img_url = '/artimage/' + _self.cur_art_info.email + '/art/' + _self.cur_art_info.dockey;
				img_url += '?open&ver=' + _self.cur_art_info.version;
				
				
				var loading_html = 
					'<div class="detail-loading">' +
					'	<img src="/img/BI_loading-2.gif" />' +
					'	<div class="progress-border">' +
					'		<div class="progress-bar"></div>' +
					'	</div>' +
					'	<span class="progress-text">준비중..</span>' +
					'</div>';
				
				
				var overlay = $('#art_zoom_detail');
				var loading = $(loading_html);
				
				var img_obj = new Image();
				//var $panzoom = $('<img src="' + img_url + '" style="max-width:100%;">');
				var $panzoom = $(img_obj).css('max-width', '100%');
				var $range = $("#art_zoom_header .zoom-range");		
				
				function getImgStartScale() {
					var ava_w = window.innerWidth;
					var ava_h = window.innerHeight - $('#art_zoom_header').height() - 20;
					var ratio_w = ava_w / img_obj.width;
					var ratio_h = ava_h / img_obj.height;
					var ratio = Math.floor( Math.min(ratio_w, ratio_h) * 100 ) / 100;
					
					return ratio;
				}
				
				function init_panzoom() {
					var start_scale = getImgStartScale();
					var min_scale = (start_scale * 0.5).toFixed(1);
					var max_scale = (start_scale * 3).toFixed(1); 
					$panzoom.panzoom({
						$zoomRange: $range,
						cursor: 'pointer',
						startTransform: 'scale(' + start_scale + ')',
						minScale: min_scale, //절반 크기로 축소되도록 처리
						maxScale: max_scale, //최대 3배까지 
						increment: 0.1,
						rangeStep: 0.05
					});
					$panzoom.on('panzoompan', position_correction);
					$panzoom.on('panzoomzoom', position_correction);
					
					
					$(window).off('resize.panzoom_resize').on('resize.panzoom_resize', function() {
						$panzoom.css('margin-top', parseInt((overlay.innerHeight() - $panzoom.outerHeight()) / 2, 10));
						position_correction();
					});
					
					
					overlay.on('mousewheel', function(e) {
						e.preventDefault();
						var delta = e.delta || e.originalEvent.wheelDelta;
						var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
						$panzoom.panzoom('zoom', zoomOut);
					});
					
				}
				function position_correction() {
					var pp = $panzoom.parent(), 
					p_h = pp.innerHeight(), 
					p_w = pp.innerWidth(), 
					m = $panzoom.panzoom('getMatrix'), 
					r = m[0], 
					x = m[4], 
					y = m[5], 
					h = $panzoom.height() * r, 
					w = $panzoom.width() * r, 
					t_x, 
					t_y;
					if (w <= p_w) {
						x = 0;
					} else {
						t_x = parseInt((w - p_w) / 2, 10);
						if (x < -t_x) {
							x = -t_x;
						} else if (x > t_x) {
							x = t_x;
						}
					}
					if (h <= p_h) {
						y = 0;
					} else {
						t_y = parseInt((h - p_h) / 2, 10);
						if (y < -t_y) {
							y = -t_y;
						} else if (y > t_y) {
							y = t_y;
						}
					}
					$panzoom.panzoom('pan', x, y, {
						silent: true
					});
				}
				$range.hide();
				//$('body').addClass('overflow-hidden');
				overlay.append(loading);
				$panzoom.css('opacity', '0');
				$panzoom.css('transform', 'none').appendTo(overlay);
				
				
				// 구현부
				$panzoom.on('load', function() {
					_self.zoomProc = setTimeout(function(){
						loading.remove();
						$range.show();
						$panzoom.css('margin-top', parseInt((overlay.innerHeight() - $panzoom.outerHeight()) / 2, 10));
						$panzoom.css('opacity', '1');
						init_panzoom();						
					}, 500);
				});
				$panzoom.on('error', function(){
					var $nothing = $('<div>' + (g360.lang == 'ko' ? '상세 이미지가 없습니다' : 'Nothing detail image') + '</div>');
					$nothing.css({
						'position': 'absolute',
						'top': '50%',
						'left': '50%',
						'transform': 'translate(-50%, -50%)',
						'color': '#fff',
						'font-size': '22px'
					});
					loading.remove();
					overlay.append($nothing);
				});
				
				var prog_bar = loading.find('.progress-bar');
				var prog_txt = loading.find('.progress-text');
				img_obj.progress = function(per, total){
					var txt = (per >= 100 ? 'Loading..' : per + '%');
					if (per >= 100) per = 99;
					prog_bar.css('width', per + '%');
					prog_txt.text(txt);
				};
				img_obj.load(img_url);
				
				
				$(document).off('touchmove.imgzoom').on('touchmove.imgzoom', function(e) {});
				
				
				g360.history_record_rental("btn_art_zoom_close");
				return false;
			});
		}
		
		
		$('#btn_art_zoom_close').off('click').on('click', function(){
			$('.blockui').removeClass('opacity-9').hide();
			//$('body').removeClass('overflow-hidden');
			$('#art_zoom_wrapper').hide();

			// 메모리 릴리즈
			window.URL.revokeObjectURL($('#art_zoom_detail img').get(0).src)
			$('#art_zoom_detail').empty();
			
			$(window).off('resize.panzoom_resize');
			$(document).off('touchmove.imgzoom');
		});
		
		if (_self.is_vr) {
			$('.zoom-title').on('click', function(){
				$('#btn_art_zoom_close').click();
			});
		}
		
		// ArtImgage
		_self.wrapper.find('.btn_artimg').on('click', function(){
			if ($(this).hasClass('on')) return;
			$('.curie_img img').show();
			$('#art3d_layer').hide();
			$('#fyuse_layer').hide();
			$('.curie_view').removeClass('art-3d');
			$(this).addClass('on');
			_self.wrapper.find('.btn_3d').removeClass('on');
			_self.wrapper.find('.btn_fyuse').removeClass('on');
		});
		
		// 3D
		_self.wrapper.find('.btn_3d').on('click', function(){
			if ($(this).hasClass('on')) return;
			if ($('#art3d_layer iframe').attr('src') == '') {
				// 부드러운 화면전환을 위해 setTimeout 설정
				setTimeout(function(){$('#art3d_layer iframe').attr('src', _self.d3_url);}, 500);
			}
			$('.curie_img img').hide();
			$('#art3d_layer').show();
			$('#fyuse_layer').hide();
			$('.curie_view').addClass('art-3d');
			$(this).addClass('on');
			_self.wrapper.find('.btn_artimg').removeClass('on');
			_self.wrapper.find('.btn_fyuse').removeClass('on');
		});
		
		// Fyuse
		_self.wrapper.find('.btn_fyuse').on('click', function(){
			if ($(this).hasClass('on')) return;
			$('.curie_img img').hide();
			$('#art3d_layer').hide();
			$('#fyuse_layer').show();
			$('.curie_view').removeClass('art-3d');
			// 퓨즈가 셋팅 안되어 있으면 셋팅
			if ($('#fyuse_layer').find('.fy_wrppr').length == 0) {
				FYU.add(_self.fyuse_id, "fyuse_layer", {
					intro: 2,	//0:표시 안함, 1:중앙, 2:하단
					nologo: 1,	//0:Fyuse로고 표시, 1:로고 표시 안함
					msg: '화면을 좌우로 움직여 보세요'
				});					
			}
			
			FYU.resizeAll();
			$(this).addClass('on');
			_self.wrapper.find('.btn_artimg').removeClass('on');
			_self.wrapper.find('.btn_3d').removeClass('on');
		});
		
		// 3D 또는 Fyuse 사용시 데스탑 화면 <-> 모바일 화면 전환되는 경우 처리
		if (_self.use_3d || _self.use_fyuse) {
			$(window).off('resize.3d_check').on('resize.3d_check', function(){
				
				
				// Mobile -> Descktop 전환체크
				if ( $('#curie_img_wrap').is(':visible') ) {
					
					if (_self.use_3d) {
						
						
						if ($('#m_curie_img_wrap').find('#art3d_layer').length > 0) {
							
							// 작은 창사이즈에서 3D 페이지를 전체보기로 띄우는 경우
							if (document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement) {
								$('.m_curie_img').show();
								return;
							}
							
							$('#curie_img_wrap').prepend($('#art3d_layer'));
							$('#art3d_layer').css('height', '');
						}
					}
					
					if (_self.use_fyuse) {
						if ($('#m_curie_img_wrap').find('#fyuse_layer').length > 0) {
							$('#curie_img_wrap').prepend($('#fyuse_layer'));
							$('#fyuse_layer').css('height', '');
						}
					}
					
				// Descktop -> Mobile 전환체크
				} else {

					if (_self.use_3d) {
						if ($('#curie_img_wrap').find('#art3d_layer').length > 0) {
							$('#m_curie_img_wrap').prepend($('#art3d_layer'));
							$('#art3d_layer').css('height', '500px');
						}
					}
					
					if (_self.use_fyuse) {
						if ($('#curie_img_wrap').find('#fyuse_layer').length > 0) {
							$('#m_curie_img_wrap').prepend($('#fyuse_layer'));
							$('#fyuse_layer').css('height', '500px');
						}
					}
				}
				
				
			});
		}
		
		// 방명록 동록하기
		_self.wrapper.find('.btn_review_register').on('click', function(){
			_self.showReviewLayer(_self.cur_id);
			g360.history_record_rental("art_review_close");
		});
		
		// 삭제하기
		$('#review_reg_layer .btn-popup-close').off().on('click', function(){
			_self.hideReviewLayer();
		});
		
		
		// 음성 플레이
		_self.wrapper.find('.btn_sound').on('click', function(){
			var top_pano = top._pano || top.__pano1 || '';
			
			try {
				if ($(this).hasClass('on')) {
					if ($(this).hasClass('pause')) {
						_self.audio.play();
						_self.getAudioTime();
						if (g360.time_interval) clearInterval(g360.time_interval);
						g360.time_interval = null;
						g360.time_interval = setInterval(function(){_self.getAudioTime();}, 1000);
						$(this).removeClass('pause');

						//bgm 잠시멈춤
						_self.vrSoundControl();
					} else {
						_self.audio.pause();
						if (g360.time_interval) clearInterval(g360.time_interval);
						g360.time_interval = null;
						$(this).addClass('pause');
						
						//bgm 다시플레이
						if(top_pano){
							if (top_pano.krpano1.get('layer[snd2].crop') == '0|0|50|50') top_pano.krpano1.call('resumesound(bgsnd)'); 
						}
						
					}
					
				} else {
					if (_self.audio.play) {
						_self.audio.play();
						_self.getAudioTime();
						g360.time_interval = setInterval(function(){_self.getAudioTime();}, 1000);
						$(this).addClass('on');
						
						//bgm 잠시멈춤
						_self.vrSoundControl();
					} else {
						g360.gAlert("Error","지원되지 않는 브라우져입니다", "red", "left");
						return;
					}
				}
				
			}catch(ex){}
		});
		
		// 동영상 플레이
		_self.wrapper.find('.btn_video').on('click', function(){
			// 오디오 재생중이면 중지
			_self.stopAudio();
			
			var _email = _self.cur_art_info.art_mp4_filename.substring(0, _self.cur_art_info.art_mp4_filename.lastIndexOf('_'));
			var video_src = g360.video_path(_email, _self.cur_art_info.art_mp4_filename);
			g360.showVideo(video_src);
			
			_self.vrSoundControl();
		});
		
		// 유튜브 플레이
		_self.wrapper.find('.btn_youtube').on('click', function(){
			// 오디오 재생중이면 중지
			_self.stopAudio();
			
			var src = _self.cur_art_info.art_yutube.replace(/youtu.be/g, 'www.youtube.com/embed');
			
			// 주소를 그대로 복사한 경우 아래 로직
			if (src.indexOf('/watch')) {
				src = src.replace(/\/watch\?v=/g, '/embed/');
				src = src.replace(/&.*$/g, '');
			}
			g360.showYoutube(src);
			
			_self.vrSoundControl();
		});
		
		// 포트폴리오 클릭
		_self.wrapper.find('.btn_portfolio').on('click', function(){
			var url = g360.portfolio_path(_self.cur_art_info.email, _self.cur_art_info.art_portfolio);
			window.open(url);
		});
		
		// 탭 클릭
		_self.wrapper.find('.curie_view_tab li').on('click', function(){
			if ($(this).hasClass('on')) return;
			
			var idx = $(this).index();
			_self.wrapper.find('.curie_view_tab li').removeClass('on');
			_self.wrapper.find('.curie_view_tab li:eq(' + idx + ')').addClass('on');
			_self.wrapper.find('.curie_view_info').hide();
			_self.wrapper.find('.curie_view_info:eq(' + idx + ')').show();
			
			if (idx == 2) {
				_self.wrapper.find('.curie_link').show();
				if (!_self.review_init){
					_self.drawReview();
				}	
			} else {
				_self.wrapper.find('.curie_link').hide();
			}
		});
		
		// 방명록 전체보기 이벤트
		$('#art_review_more').on('click', function(){
			rs.loadReviewAll(_self.cur_id);
		});
		
		// 방명록 등록하기 이벤트 (방명록 레이어는 메인에 있으면 rentalservice js의 registerReview 함수를 공유한다)
		$('#art_review_submit').off().on('click', function(){
			var usernm = $.trim($('#art_review_name').val());
			var msg = $.trim($('#art_review_msg').val());
			var pass = $.trim($('#art_review_pass').val());
			
			if (usernm == '') {
				g360.showToastMsg(g360.lang == 'ko' ? '이름을 입력해주세요' : 'Please enter your name');
				//alert('이름을 입력해주세요');
				return false;
			}
			
			if (msg == '') {
				g360.showToastMsg(g360.lang == 'ko' ? '내용을 입력해주세요' : 'Please enter the message');
				//alert('내용을 입력해주세요');
				return false;
			}
			
			if (pass == '') {
				g360.showToastMsg(g360.lang == 'ko' ? '패스워드를 입력해주세요' : 'Please enter your password');
				//alert('패스워드를 입력해주세요');
				return false;
			}
			
			if ($('#art_review_pass').val().indexOf(' ') >= 0) {
				g360.showToastMsg(g360.lang == 'ko' ? '패스워드에는 공백을 입력할 수 없습니다' : 'Password cannot contain spaces');
				//alert('패스워드에는 공백을 입력할 수 없습니다');
				$('#art_review_pass').val('');
				$('#art_review_pass').focus();
				return false;
			}
					
			rs.registerReview(_self.cur_id);
		});
	},
	"stopAudio" : function(){
		var _self = this;
		if (_self.wrapper.find('.btn_sound').hasClass('on')) {
			if (_self.wrapper.find('.btn_sound').hasClass('pause')) {
				
			} else {
				_self.audio.pause();
				if (g360.time_interval) clearInterval(g360.time_interval);
				g360.time_interval = null;
				_self.wrapper.find('.btn_sound').addClass('pause');
			}
		}
	},
	"transLangGenre" : function(txt){
		return txt
			.replace(/회화/g, 'Painting')
			.replace(/판화/g, 'Engraving')
			.replace(/조형/g, 'Sculpture')
			.replace(/사진/g, 'Photography')
			.replace(/디지털아트/g, 'Digital Art')
			.replace(/공예/g, 'Craft');
	},
	"transLangSource" : function(txt){
		return txt
			.replace(/캔버스/g, 'Canvas')
			.replace(/유채/g, 'Oil paint')
			.replace(/아크릴/g, 'Acrylic paint')
			.replace(/수채/g, 'Watercolor');
	},
	"drawArtInfo" : function(data){
		$('.curie_right').hide();
		
		var _self = this;
		var genre = data.art_genre_etc ? data.art_genre.replace(/기타/g, '') + data.art_genre_etc : data.art_genre;
		var source = data.art_source_etc ? data.art_source.replace(/기타/g, '') + data.art_source_etc : data.art_source;
		var img_src = g360.preview_img_path(data.email, data.dockey);
		var size = "";
		
		if (g360.lang != 'ko') {
			genre = this.transLangGenre(genre);
			source = this.transLangSource(source);
		}
		
		//사이즈
		if (data.art_height && data.art_width && rs.info.info.rental_type == '1') {	//크기 정보가 있는 경우만 표시함
			if(data.art_genre=="조형"){
				size = data.art_height + ' x ' + data.art_width + ' x ' + data.art_height2 + 'cm';
			}else{
				if (data.art_hosu == null || g360.lang == 'us'){
					size = data.art_height + ' x ' + data.art_width + 'cm';
				}else{
					size = data.art_height + ' x ' + data.art_width + 'cm (' + data.art_hosu + '호)';
				}
			}
		}
		
	
		if (data.art_mp3_filename) {
			_self.wrapper.find('.remain-time').text('');
			_self.wrapper.find('.btn_sound').show();
			_self.wrapper.find('.curie_top_btns').removeClass('no-btn');
			
			var _email = data.art_mp3_filename.substring(0, data.art_mp3_filename.lastIndexOf('_'));
			var audio_src = g360.audio_path(_email, data.art_mp3_filename);
			//audio_src = "/test/mblue4444@gmail.com-spl-1560342398964_dad65ea30d924796d2ecacd4ee23c2e4.231933.mp3";
			//audio_src = "https://www.gallery360.co.kr/artimage/mblue4444@gmail.com-spl-1560342398964/art_mp3/mblue4444@gmail.com-spl-1560342398964_dad65ea30d924796d2ecacd4ee23c2e4.231933";
			var $audio = $('<audio></audio>');
			$audio.attr('src', audio_src);
			
			_self.wrapper.find('.btn_sound').append($audio);
			_self.audio = $audio.get(0);
			
			// 종료시 이벤트
			$audio.on('ended', function(){
				if (g360.time_interval) clearInterval(g360.time_interval);
				g360.time_interval = null;
				_self.wrapper.find('.btn_sound').removeClass('on');
				_self.wrapper.find('.remain-time').text('');
			});
		}
		
		if (data.art_mp4_filename) {
			_self.wrapper.find('.btn_video').show();
			_self.wrapper.find('.curie_top_btns').removeClass('no-btn');
		}
		if (data.art_yutube) {
			_self.wrapper.find('.btn_youtube').show();
			_self.wrapper.find('.curie_top_btns').removeClass('no-btn');
		}
		if (data.art_portfolio) {
			_self.wrapper.find('.btn_portfolio').show();
			_self.wrapper.find('.curie_top_btns').removeClass('no-btn');
		}
			
		
		_self.wrapper.find('#curie_detail_info_title').text(g360.TextToHtml(data.art_title));
		_self.wrapper.find('.curie_right .info_size').text(size);
		_self.wrapper.find('.curie_info .info_author').text(g360.TextToHtml(data.art_artist));
		_self.wrapper.find('.curie_info .info_year').text(data.art_date_year);
		_self.wrapper.find('.curie_info .info_genre').text(g360.TextToHtml(genre));
		_self.wrapper.find('.curie_info .info_material').text(g360.TextToHtml(source));
		_self.wrapper.find('.curie_view_info:eq(0)').html(g360.textToHtml_Body(data.art_express));
		//_self.wrapper.find('.curie_view_info:eq(1)').html(g360.TextToHtml(data.art_curator_express));
		
		
		//구매하기, 문의하기 버튼 추가, 투표하기 버튼 추가
		var vote_use = (rs.info.info.vote == 'T' && rs.info.info.vote_end != 'T' ? true : false);
		
		if ( data.sale_url || (data.purchase_req == 'Y') || vote_use) {
			var $btn_art_wrap = $('<div class="btn-art-wrap"></div>');
			_self.wrapper.find('.curie_view_info:eq(0)').append($btn_art_wrap);
			
			// 문의하기
			if (data.purchase_req == 'Y') {
				var $btn_qna = $('<div class="btn_art_qna btn-art-bottom">' + (g360.lang == 'ko' ? '문의하기' : 'Contact Us') + '</div>');
				$btn_art_wrap.append($btn_qna);
				
				var $q_layer = $('#buy_qna_layer');
				
				$btn_qna.off().on('click', function(){
	
					rs.showBlockUI();
					$q_layer.find('.bqp-img img').attr('src', img_src);
					$q_layer.find('.bqp-name').text(g360.TextToHtml(data.art_title));
					$q_layer.find('.bqp-size').text(size);
					$q_layer.find('.bqp-maker').text(g360.TextToHtml(data.art_artist));
					$q_layer.find('.bqp-seller').text(g360.TextToHtml(rs.info.info.host));
					
					$q_layer.find('.buy-query-name').val('');
					$q_layer.find('.buy-query-email').val('');
					$q_layer.find('.buy-query-number').val('');
					$q_layer.find('.buy-query-stmt').val('');
					
					$q_layer.show(0).addClass('show');
					$q_layer.scrollTop(0);
				});
				$q_layer.find('.buy-query-close').off().on('click', function(){
					rs.hideBlockUI(true);
					$q_layer.removeClass('show').hide();
				});
				
				// 문의하기 버튼
				$('#btn_query_submit').off().on('click', function(){
					
					var q_nm = $.trim($q_layer.find('.buy-query-name').val());
					var q_email = $.trim($q_layer.find('.buy-query-email').val());
					var q_num = $.trim($q_layer.find('.buy-query-number').val());
					var q_msg = $.trim($q_layer.find('.buy-query-stmt').val());
					
					if (q_nm == '') {
						$q_layer.find('.buy-query-name').focus();
						g360.showToastMsg((g360.lang == 'ko' ? '이름을 입력하세요' : 'Please enter your name'), 3000);
						return;
					}
					if (q_email == '') {
						$q_layer.find('.buy-query-email').focus();
						g360.showToastMsg((g360.lang == 'ko' ? '이메일을 입력하세요' : 'Please enter your email'), 3000);
						return;
					}
					if (q_msg == '') {
						$q_layer.find('.buy-query-stmt').focus();
						g360.showToastMsg((g360.lang == 'ko' ? '문의글을 입력하세요' : 'Please enter your inquiry'), 3000);
						return;
					}
					
					var q_data = JSON.stringify({
						name : q_nm,
						email : q_email,
						number : q_num,
						msg : q_msg,
						dockey : _self.cur_id
					});
					
					var url = g360.root_path + "/Rental_purchase_send.mon";
					
					$.ajax({
						type: "POST",
						data: q_data,
						dataType: "json",
						contentType: "application/json; charset=utf-8",
						url: url,
						success: function(){							
							g360.showToastMsg((g360.lang == 'ko' ? '문의글이 등록되었습니다' : 'Your inquiry has been registered'), 3000);
							rs.hideBlockUI(true);
							$q_layer.removeClass('show').hide();
						}
					});
				});
			}
			
			// 투표하기
			if (vote_use) {
				var $btn_vote = $('<div class="btn_art_vote btn-art-bottom">' + (g360.lang == 'ko' ? '투표하기' : 'Vote') + '</div>');
				$btn_art_wrap.append($btn_vote);
				$btn_vote.on('click', function(){
					if (rs.info.info.vote_method == '2') { //twilio
						_self.showSmsVoteLayer('twilio');
					} else if(rs.info.info.vote_method == '3'){ //일반문자
						_self.showSmsVoteLayer();
					} else {
						_self.showVoteLayer();						
					}
				});
			}
			
			//==============================================
			
			// 구매하기
			if (data.sale_url) {
				
				//ajax
				$.ajax({
					url: g360.root_path+"/add_option_check.mon",
					type: "POST",
					data: JSON.stringify({value:data.sale_selectbox}),
					contentType: "application/json",
					success: function(data2){
						
						//버튼 타입 체크
						var sel_type = "";
						sel_type = g360.lang == 'ko' ? data2.text : data2.text_eng;
						
						var $btn_buy = $('<div class="btn_art_buy btn-art-bottom">'+sel_type+'</div>');
						$btn_art_wrap.append($btn_buy);
						$btn_buy.on('click', function(){
							window.open(data.sale_url);
						});
						
					},
					error: function(e) {
						console.log("에러발생 (add_option_check)")
					}
				});
				
				
			}
			

		}
		
		
		
		var $wrap_el;
		var is_mobile = false;
		
		if ($(window).outerWidth() > 1000) {
			$wrap_el = $('#curie_img_wrap');
		} else {
			is_mobile = true;
			$wrap_el = $('#m_curie_img_wrap');
		}
		

		/*
		 * 상세 화면 표시 조건
		 * 1. 3D 파일이 있는 경우 3D 표시
		 * 2. Fyuse 등록된 경우 Fyuse 표시 (URL잘못 입력한 경우는 패스)
		 * 3. 상세 이미지 표시
		 * 4. 3D와 Fyuse 두개 모두 사용하는 경우 3D를 우선으로 표시 하고 화면 전환할 수 있도록 버튼 표시
		 * 
		 * 상세 화면 표시 조건 변경 (201016)
		 * 1. 이미지 최우선 표시
		 * 2. 3D 또는 Fyuse 설정시 이미지 버튼과 3D, Fyuse 버튼 표시
		 */
		
		if (data.art_d3_filename) {
			var d3_url = "/3d/3d.jsp?key="+data.dockey;
			//$('.curie_img img').remove();
			$wrap_el.prepend('<div id="art3d_layer" class="art3d-layer" style="display:none;"></div>');
			$('#art3d_layer').append('<iframe src="" scrolling="no" frameborder="0" style="position:relative; height:100%; width:100%"></iframe>');
			if (is_mobile) {
				$('#art3d_layer').css('height', '500px');				
			}
			//$('.curie_view').addClass('art-3d');
			_self.d3_url = d3_url;
			_self.use_3d = true;
			//_self.use_img = false;
		}
		
		if (data.art_fuse) {
			var regex = /https:\/\/(?:www\.)?fyu\.se\/v\/(.*$)/i;
			var fyuse_url = data.art_fuse;
			var _match = fyuse_url.match(regex);
			
			// URL을 정상적으로 입력한 경우
			if (_match && _match.length == 2) {
				//$('.curie_img img').remove();
				$wrap_el.prepend('<div id="fyuse_layer" class="fyuse-layer" style="display:none;"></div>');
				
				if (is_mobile) {
					$('#fyuse_layer').css('height', '500px');					
				}

				_self.fyuse_id = _match[1];
				_self.use_fyuse = true;
				//_self.use_img = false;
			}
		}
		
		_self.wrapper.find('.curie_img img').attr('src', img_src);
		$('#curie_img_wrap img').css('visibility', 'hidden');
		$('#curie_img_wrap img').addClass('animated-fast');		
		
		// 이미지 로딩이 완료되면 표시 (이미지 로딩이 느린 경우 우측 화면 밀림 현상 방지)
		$('#curie_img_wrap').imagesLoaded(function(){
			$('.curie_right').show();
			$('#curie_img_wrap img').css('visibility', 'visible');
			$('#curie_img_wrap img').addClass('fadeInLeftCustom');
		});
		
		/*
		setTimeout(function(){
			$('#curie_img_wrap img').css('visibility', 'visible');
			$('#curie_img_wrap img').addClass('fadeInLeftCustom');
		}, 200);
		*/
		
		$('#m_curie_img_wrap img').addClass('animated-fast fadeInLeft');
		
		if (_self.use_3d || _self.use_fyuse) {
			_self.wrapper.find('.btn_artimg').addClass('on').show();
			_self.wrapper.find('.curie_top_btns').removeClass('no-btn');

			if (_self.use_3d) {
				$('#art3d_layer').addClass('fadeInLeft animated-fast');
				_self.wrapper.find('.btn_3d').show();				
			}
			
			if (_self.use_fyuse) {
				$('#fyuse_layer').addClass('fadeInLeft animated-fast');
				_self.wrapper.find('.btn_fyuse').show();				
			}
		}
		
		/*
		// 3D와 Fyuse를 동시에 사용하는 경우 (이 때만 버튼 표시)
		if (_self.use_3d && _self.use_fyuse) {
			$('#art3d_layer').addClass('fadeInLeft animated-fast');
			$('#art3d_layer').show();
			$('#fyuse_layer').addClass('fadeInLeft animated-fast');
			
			_self.wrapper.find('.btn_3d').addClass('on').show();
			_self.wrapper.find('.btn_fyuse').show();
			_self.wrapper.find('.curie_top_btns').removeClass('no-btn');
			
		// 3D만 있는 경우
		} else if (_self.use_3d) {
			$('#art3d_layer').show();
			
		// Fyuse만 있는 경우
		} else if (_self.use_fyuse) {
			$('#fyuse_layer').show();
			FYU.add(_match[1], "fyuse_layer", {
				intro: 2,	//0:표시 안함, 1:중앙, 2:하단
	            nologo: 1,	//0:Fyuse로고 표시, 1:로고 표시 안함
	            msg: '화면을 좌우로 움직여 보세요'
			});
			
		// 상세이미지만 있는 경우
		} else {
			_self.wrapper.find('.curie_img img').attr('src', img_src);
		}
		*/

				
		
		if (data.art_artist && data.art_artist != '') {
			_self.wrapper.find('.curie_info .info_author').closest('dl').show();
		}
		if (data.art_date_year && data.art_date_year != '') {
			_self.wrapper.find('.curie_info .info_year').closest('dl').show();
		}
		if (genre != '') {
			_self.wrapper.find('.curie_info .info_genre').closest('dl').show();
		}
		if (source != '') {
			_self.wrapper.find('.curie_info .info_material').closest('dl').show();
		}
		
		// 작가 정보 그리기
		_self.drawArtistInfo(data.artkey.split('-')[0]);
		
		// 방명록 정보 그리기 (미리 그리지 않고 클릭할 때 데이터 가져오는 방식으로 변경함)
		//_self.drawReview(data.artkey);
		

		// 작품 소개 레이어 표시
		_self.wrapper.find('.curie_view_info:eq(0)').show();
	},
	"drawArtistInfo": function(artist_key){
		var rt = g360.rental_text;
		var artist_info = rs.artistlist[artist_key];
		if (!artist_info) return;
		
		var _wrapper = $('#art_detail_artist_info');
		var _html = '';
		
		// 작가소개
		if (artist_info.content && $.trim(artist_info.content) != '') {
			_html =
				'<div class="artist_info_wrapper">' + g360.textToHtml_Body(artist_info.content) + '</div>';
			
			_wrapper.append(_html);
		}
		
		// 작가소개
		if (artist_info.content2 && $.trim(artist_info.content2) != '') {
			_html =
				'<div class="artist_info_wrapper">' + g360.textToHtml_Body(artist_info.content2) + '</div>';
			
			_wrapper.append(_html);
		}
		
		// 소속 및 단체
		if (artist_info.group && artist_info.group.length > 0 && rt.group) {
			_html =
				'<div class="artist_info_wrapper">' +
				'	<div class="artist_info_title"><img src="/img/rental/multiple-users.png"><span>' + rt.group + '</span></div>' +
				'	<ul id="art_detail_artist_group" class="artist_info_content">' +
				'	</ul>' +
				'</div>';
			
			_wrapper.append(_html);
				
			$.each(artist_info.group, function(){
				var arr = [];
				if (this.title) arr.push(this.title);
				if (this.dept) arr.push(this.dept);
				if (this.jobtitle) arr.push(this.jobtitle);
				$('#art_detail_artist_group').append('<li>' + arr.join(' ') + '</li>');
			});
		}
		
		// 학력 정보
		if (artist_info.education && artist_info.education.length > 0 && rt.sch) {
			_html =
				'<div class="artist_info_wrapper">' +
				'	<div class="artist_info_title"><img src="/img/rental/graduate.png"><span>' + rt.sch + '</span></div>' +
				'	<ul id="art_detail_artist_edu" class="artist_info_content">' +
				'	</ul>' +
				'</div>';
			
			_wrapper.append(_html);
				
			$.each(artist_info.education, function(){
				var arr = [];
				if (this.end) arr.push(this.end);
				if (this.schoolname) arr.push(this.schoolname);
				if (this.major) arr.push(this.major);
				if (this.level + this.status){
					var level = this.level + this.status;
					if(level.indexOf("기타")==-1){
						arr.push(this.level + this.status);						
					}else{
						arr.push(this.status);				
					}
				}
				$('#art_detail_artist_edu').append('<li>' + arr.join(' ') + '</li>');
			});
		}
		
		// 수상 경력
		if (artist_info.career && artist_info.career.length > 0 && rt.prize) {
			_html =
				'<div class="artist_info_wrapper">' +
				'	<div class="artist_info_title"><img src="/img/rental/trophy.png"><span>' + rt.prize + '</span></div>' +
				'	<ul id="art_detail_artist_career" class="artist_info_content">' +
				'	</ul>' +
				'</div>';
			
			_wrapper.append(_html);
				
			$.each(artist_info.career, function(){
				var arr = [];
				if (this.term) arr.push(this.term);
				if (this.title) arr.push(this.title);
				$('#art_detail_artist_career').append('<li>' + arr.join(' ') + '</li>');
			});
		}
		
		// 전시 경력
		if (artist_info.display && artist_info.display.length > 0 && rt.carr) {
			_html = 
				'<div class="artist_info_wrapper">' +
				'	<div class="artist_info_title"><img src="/img/rental/medal.png"><span>' + rt.carr + '</span></div>' +
				'	<ul id="art_detail_artist_display" class="artist_info_content">' +
				'	</ul>' +
				'</div>';
			
			_wrapper.append(_html);
			
			$.each(artist_info.display, function(){
				var arr = [];
				if (this.term) arr.push(this.term);
				if (this.title) arr.push(this.title);
				$('#art_detail_artist_display').append('<li>' + arr.join(' ') + '</li>');
			});
		}
		
	},
	"drawReview": function(){
		var _self = this;
				
		// 기존에 정보가 있으면 비워주기
		if ($('#art_detail_visitor .testimonial-text p.mCustomScrollbar').length > 0) {
			$('#art_detail_visitor .testimonial-text p').mCustomScrollbar('destroy');
		} 
		
		$("#art_detail_visitor").trigger('destroy.owl.carousel');
		$("#art_detail_visitor").empty();
		
		// 방명록 불러오기
		var url = "/load_memo.mon?rr=" + rs.info.dockey + "&ak=" + _self.cur_id + "&start=0&perpage=10";
		$.ajax({
			dataType : "json",
			contentType : "application/json; charset=utf-8",
			url : url,
			success : function(res){
				if (res.length > 1) {
					var data = res.splice(1);
					var _html = '';
					var _src = '';
					
					$.each(data, function(){
						_html = 
							'<div class="item">' +
							'	<div class="testimonial-wrapp">' +							
							'		<div class="testimonial-text">' +
							'			<div class="testimonial-del" onclick="rs.showPassDialog(\'' + this['_id']['$oid'] + '\', true)"></div>' +		
							'			<p class="bottom40">"<span>' + this.content.replace(/(?:\r\n|\r|\n)/g, '<br />') + '</span>"</p>' +
							'			<h4 class="darkcolor author-name">- ' + this.title + '</h4>' +
							'		</div>' +
							'	</div>' +
							'</div>';
						
						$("#art_detail_visitor").append(_html);
					});
					
					// 방명록 스크롤 처리
					$('#art_detail_visitor .testimonial-text p').mCustomScrollbar({				
						theme:"minimal-dark",
						mouseWheelPixels: 400,
						mouseWheel:{ preventDefault: false },
						autoExpandScrollbar: true,
					});
					
					// 특정 개수 이상이면 전체보기 버튼 표시
					if (res[0].totalcount > 10) {
						$('#art_review_more').show();
					}
					
					
					$("#art_detail_visitor").owlCarousel({
				        //items: 3,
				        loop: false,
				        margin: 0,
				        dots: true,
				        nav: false,
				        dotsEach: true,
				        responsive: {
				        	1600: {
				        		//items: 3
				        		autoWidth: true
				        	},
				        	1441: {
				        		items: 1
				        	},
				            1281: {
				                items: 2
				            },
				            1001: {
				                items: 1
				            },
				            600: {
				                items: 2
				            },
				            320: {
				                items: 1
				            },
				        },
				        onInitialized: function(data){
				        	_self.review_init = true;
				        }
				    });

				} 
			},
			error : function(e){
				
			}
		});
	},
	"showReviewLayer" : function(id) {
		rs.showBlockUI();
		$('#art_review_name').val('');
		$('#art_review_msg').val('');
		$('#art_review_pass').val('');
		$('#review_reg_layer').show();
	},
	"hideReviewLayer" : function() {
		rs.hideBlockUI(true);
		$('#review_reg_layer').hide();
	},
	"getAudioTime": function(){
		var _self = this;
		var total = parseInt(_self.audio.duration);
		var remain = _self.audio.duration - _self.audio.currentTime;
		remain = parseInt(remain);
		var m = parseInt(remain / 60);
		var s = remain - m * 60;
		
		_self.wrapper.find('.remain-time').text('- ' + m + ':' + (s < 10 ?'0'+s:s));
	},
	"showVoteLayer": function(){
		var _self = this;
		
		if (this.is_vr) {
			var top_pano = top._pano || top.__pano1 || '';
			if (top_pano) {
				top_pano.krpano1.set('layer[close_freim_url_addhs].visible', false);
			}
		}
		
		var html =
			'<div class="vote-wrap">' +
			'	<div id="btn_vote_close" class="vote-close"><span></span><span></span></div>' +
			'	<h1>' + (g360.lang == 'ko' ? '투표하기' : 'Vote') + '</h1>' +
			'	<div class="vote-tab">' +
			'		<div id="vote_mail" class="vote-panel">' +
			'			<p>' + (g360.lang == 'ko' ? '투표를 위해 이메일 주소를 입력해 주세요.' : 'Pelase enter your email address to vote.') + '</p>' +
			'			<input type="email" id="vote_email" placeholder="eg) gallery360@gallery360.co.kr">' +
			'			<p class="noti-vote"></p>' +
			'			<a id="btn_otp_send" class="vote-tab-btn">' + (g360.lang == 'ko' ? '다음 단계' : 'Next') + '</a>' +
			'		</div>' +
		
			'		<div id="vote_verify" class="vote-panel" style="display:none;">' +
			(g360.lang == 'ko' ?
					'	<p><b class="findpw-user"></b>로 인증번호를 전송하였습니다. 받으신 인증번호를 입력하여 투표를 완료해 주세요.</p>' :
					'	<p>The verify code has been sent to <b class="findpw-user"></b> Please complete the voting by entering the verify code.</p>') +
					
			'			<input type="number" id="vote_otp" placeholder="' + (g360.lang == 'ko' ? '인증번호' : 'Verify Code') + '" min="0" max="999999">' +
			'			<p class="noti-vote"></p>' +
			'			<a id="btn_vote_send" class="vote-tab-btn">' + (g360.lang == 'ko' ? '투표하기' : 'Vote') + '</a>' +
			'			<b id="btn_otp_resend" class="resend-code">' + (g360.lang == 'ko' ? '인증번호 재전송하기' : 'Resend OTP') + '</b>' +
			'		</div>' +
		
			'		<div id="vote_cert" class="vote-panel" style="display:none;">' +
			'			<p>' + (g360.lang == 'ko' ? '투표가 완료되었습니다!' : 'The vote has been completed.') + '</p>' +
			'			<div id="btn_vote_ok" class="vote-finish">' + (g360.lang == 'ko' ? '확인' : 'Vote completed') + '</div>' +
			'		</div>' +
		
			'	</div>' +
			'</div>';
		
		var $vote_layer = $(html).appendTo('body');

		rs.showBlockUI();
		$vote_layer.addClass('show');
		
		
		// 닫기, 확인
		$('#btn_vote_close, #btn_vote_ok').on('click', function(){
			_self.hideVoteLayer();
		});
		
		
		// 투표하기 OTP발송
		$('#btn_otp_send').on('click', function(){
			if ($(this).hasClass('process')) return;
			
			$('#vote_email').val($.trim($('#vote_email').val()));
			var vote_email = $('#vote_email').val();

			var $info = $(this).closest('.vote-panel').find('.noti-vote');
			$info.text('');
			
			if (vote_email == '') {
				$info.text(g360.lang == 'ko' ? '이메일 주소를 입력하세요.' : 'Pelase enter your email address');
				$('#vote_email').focus();				
				return;
			}
			
			if (!g360.validateEmail(vote_email)) {
				$info.text(g360.lang == 'ko' ? '올바른 이메일형식이 아닙니다.' : 'Invalid email address');
				return;
			}
			
			var data = JSON.stringify({
				rental_key : rs.info.dockey,
				art_key : _self.cur_art_info.dockey,
				artist : g360.textToHtml(_self.cur_art_info.art_artist),
				title : g360.textToHtml(_self.cur_art_info.art_title),
				email : vote_email
			});
			
			var url = g360.root_path + "/vote_mail.mon";
			
			$.ajax({
				type: "POST",
				data: data,
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				beforeSend: function(){
					$('#btn_otp_send').addClass('process');
				},
				url: url,
				success: function(res){
					
					
					if (res.result == 'over count') {
						$info.text(g360.lang == 'ko' ? '최대 투표 횟수를 초과하였습니다.' : 'Maximum number of votes exceeded.');
						$('#btn_otp_send').removeClass('process');
						return;
					}else if (res.result == 'different type') {
						$info.text(g360.lang == 'ko' ? '올바른 경로의 투표가 아닙니다.' : 'This is not the right way to vote.');
						$('#btn_otp_send').removeClass('process');
						return;
					}else if (res.result == 'already vote') {
						$info.text(g360.lang == 'ko' ? '이미 투표한 작품입니다.' : 'Already has been voted.');
						$('#btn_otp_send').removeClass('process');
						return;
					} else if (res.result == 'F') {
						$info.text(g360.lang == 'ko' ? '오류가 발생했습니다.' : 'An error has occurred.');
						$('#btn_otp_send').removeClass('process');
						return;
					} 
					
					// 정상 발송인 경우
					$vote_layer.find('.findpw-user').text(vote_email);
					$('#vote_mail').hide();
					$('#vote_verify').show();
				}
			});
		});
		
		$('#vote_email').on('keydown', function(e){
			var $info = $(this).closest('.vote-panel').find('.noti-vote');
			$info.text('');
			
			if (e.keyCode == 13) {
				$('#btn_otp_send').click();
			}
		});
		
		
		// 투표하기
		$('#btn_vote_send').on('click', function(){
			var vote_email = $('#vote_email').val();
			var $info = $(this).closest('.vote-panel').find('.noti-vote');
			$info.text('');
			
			var code = $('#vote_otp').val();
			
			if (code == '') {
				$info.text(g360.lang == 'ko' ? '인증번호를 입력하세요.' : 'Please enter the OTP number.');
				$('#vote_otp').focus();
				return;
			}
			
			var data = JSON.stringify({
				rental_key : rs.info.dockey,
				art_key : _self.cur_art_info.dockey,
				email : vote_email,
				sec : code
			});			
			
			var url = g360.root_path + "/vote_process.mon";
			
			$.ajax({
				type: "POST",
				data: data,
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				url: url,
				success: function(res){							
					if (res.result == 'miss sec') {
						$info.text(g360.lang == 'ko' ? '유효하지 않은 인증번호입니다.' : 'Invalid OTP number.');
						return;
					} else if (res.result == 'T') {
						// 정상 처리된 경우
						$('#vote_verify').hide();
						$('#vote_cert').show();
					}
				}
			});
		});
		
		
		$('#vote_otp').on('keydown', function(e){
			var $info = $(this).closest('.vote-panel').find('.noti-vote');
			$info.text('');
			
			if (e.keyCode == 13) {
				$('#btn_vote_send').click();
			}
		});
		
		
		// 인증번호 재전송하기
		$('#btn_otp_resend').on('click', function(){
			if ($(this).hasClass('process')) {
				return;
			}

			$(this).addClass('process').css('opacity','0.3');
			
			var vote_email = $('#vote_email').val();
			var data = JSON.stringify({
				rental_key : rs.info.dockey,
				art_key : _self.cur_art_info.dockey,
				artist : g360.textToHtml(_self.cur_art_info.art_artist),
				title : g360.textToHtml(_self.cur_art_info.art_title),
				email : vote_email
			});
			
			var url = g360.root_path + "/vote_mail.mon";
			
			$.ajax({
				type: "POST",
				data: data,
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				url: url,
				success: function(res){							
					if (res.result == 'T') {
						g360.showToastMsg(g360.lang == 'ko' ? '인증번호를 재전송하였습니다.' : 'OTP number has been resend.', 3000);
					} else {
						g360.showToastMsg(g360.lang == 'ko' ? '전송중 오류가 발생했습니다.' : 'Error occurred during transfer.', 3000);
					}
					
					setTimeout(function(){
						$('#btn_otp_resend').removeClass('process').css('opacity','1');
					}, 4000);
				}
			});
		});		
	},
	"showSmsVoteLayer": function(ty){
		var _self = this;

		if (this.is_vr) {
			var top_pano = top._pano || top.__pano1 || '';
			if (top_pano) {
				top_pano.krpano1.set('layer[close_freim_url_addhs].visible', false);
			}
		}
		
		var html =
			'<div class="vote-wrap sms">' +
			'	<div id="btn_vote_close" class="vote-close"><span></span><span></span></div>' +
			'	<h1>' + (g360.lang == 'ko' ? '투표하기' : 'Vote') + '</h1>' +
			'	<div class="vote-tab">' +
			'		<div id="vote_sms" class="vote-panel">' +
			'			<p>' + (g360.lang == 'ko' ? '투표를 위해 휴대폰 인증을 진행해 주세요.' : 'Please proceed with mobile phone verification for voting.') + '</p>' +
			'			<label>' + (g360.lang == 'ko' ? '이름' : 'Name') + '</label>' +
			'			<input type="text" id="vote_name" placeholder="' + (g360.lang == 'ko' ? '이름을 입력하세요' : 'Please enter your name') + '">' +
			'			<p class="noti-vote name"></p>' +
			'			<label>' + (g360.lang == 'ko' ? '전화번호' : 'Mobile') + '</label>' +
			'			<input type="number" id="vote_phone" placeholder="' + (g360.lang == 'ko' ? '‘-’없이 숫자만 입력하세요' : 'Enter only numbers without ‘-’') + '">' +
			'			<p class="noti-vote"></p>' +
			'			<a id="btn_otp_send" class="vote-tab-btn">' + (g360.lang == 'ko' ? '인증번호 발송' : 'Request a code') + '</a>' +
			'			<div style="font-size: 11px;margin-top: 18px;color: gray;">[개인 정보 제 3자 제공 및 위탁 동의]<br>	본 투표 참여시 『(주)머니투데이방송』 에 이벤트 진행 및 경품 배송 활용의 목적으로 개인 정보(이름/전화번호)가 제공되오며, 이벤트 종료 후 즉시 파기됩니다.</div>' + 
			'		</div>' +
		
			'		<div id="vote_verify" class="vote-panel" style="display:none;">' +
			(g360.lang == 'ko' ?
					'	<p><b class="findpw-user"></b>로 인증번호를 전송하였습니다. 받으신 인증번호를 입력하여 투표를 완료해 주세요.</p>' :
					'	<p>The verify code has been sent to <b class="findpw-user"></b> Please complete the voting by entering the verify code.</p>') +
					
			'			<input type="number" id="vote_otp" placeholder="' + (g360.lang == 'ko' ? '인증번호' : 'Verify Code') + '" min="0" max="999999">' +
			'			<p class="noti-vote"></p>' +
			'			<a id="btn_vote_send" class="vote-tab-btn">' + (g360.lang == 'ko' ? '투표하기' : 'Vote') + '</a>' +
			'			<div class="otp-resend-wrap"><b id="btn_otp_resend" class="resend-code">' + (g360.lang == 'ko' ? '인증번호 재전송하기' : 'Resend OTP') + '</b><span id="vote_auth_time"></span></div>' +
			'		</div>' +
		
			'		<div id="vote_cert" class="vote-panel" style="display:none;">' +
			'			<p>' + (g360.lang == 'ko' ? '투표가 완료되었습니다!' : 'The vote has been completed.') + '</p>' +
			'			<div id="btn_vote_ok" class="vote-finish">' + (g360.lang == 'ko' ? '확인' : 'Vote completed') + '</div>' +
			'		</div>' +
		
			'	</div>' +
			'</div>';
		
		var $vote_layer = $(html).appendTo('body');

		rs.showBlockUI();
		$vote_layer.addClass('show');
		
		
		$('#vote_phone').on('keydown', function(e){			
			if ( (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105) ){
				// 숫자
				
				// 11자리 이상 입력하는 경우 입력안되도록 제어
				if (($(this).val() + '').length >= 11) {
					return false;
				}
			} else if (e.keyCode == 35 || e.keyCode == 36 || e.keyCode == 37 || e.keyCode == 39){
				// 좌, 우, Home, End
			} else if (e.keyCode == 8 || e.keyCode == 46){
				// 백스페이스, Del
			} else {
				return false;
			}			
		});
		
		// 닫기, 확인
		$('#btn_vote_close, #btn_vote_ok').on('click', function(){
			_self.hideVoteLayer();
		});
		
		
		// 투표하기 OTP발송
		$('#btn_otp_send').on('click', function(){
			if ($(this).hasClass('process')) return;
			
			$('#vote_name').val($.trim($('#vote_name').val()));
			var vote_name = $('#vote_name').val();
			var vote_phone = $('#vote_phone').val();
			
			var $info_nm = $(this).closest('.vote-panel').find('.noti-vote.name');
			var $info = $(this).closest('.vote-panel').find('.noti-vote:not(.name)');
			$info_nm.text('');
			$info.text('');
			
			if (vote_name == '') {
				$info_nm.text(g360.lang == 'ko' ? '이름을 입력하세요.' : 'Pelase enter your name');
				$('#vote_name').focus();				
				return;
			}
			
			if (vote_phone == '') {
				$info.text(g360.lang == 'ko' ? '전화번호를 입력하세요.' : 'Pelase enter your mobile phone');
				return;
			}
			ty = ty == 'twilio'? ty : 'origin';
			
			var data = JSON.stringify({
				rental_key 	: rs.info.dockey,
				art_key 	: _self.cur_art_info.dockey,
				artist 		: g360.textToHtml(_self.cur_art_info.art_artist),
				title 		: g360.textToHtml(_self.cur_art_info.art_title),
				user_name 	: vote_name,
				phone_num 	: vote_phone,
				lang 		: g360.lang,
				country 	: '+82',
				send_type	: ty
			});
			
			var url = g360.root_path + "/vote_sms.mon";
			
			$.ajax({
				type: "POST",
				data: data,
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				beforeSend: function(){
					$('#btn_otp_send').addClass('process');
				},
				url: url,
				success: function(res){
					if (res.result == 'over count') {
						$info.text(g360.lang == 'ko' ? '최대 투표 횟수를 초과하였습니다.' : 'Maximum number of votes exceeded.');
						$('#btn_otp_send').removeClass('process');
						return;
					} else if (res.result == 'already vote') {
						$info.text(g360.lang == 'ko' ? '이미 투표한 작품입니다.' : 'Already has been voted.');
						$('#btn_otp_send').removeClass('process');
						return;
					} else if (res.result == 'F') {
						$info.text(g360.lang == 'ko' ? '오류가 발생했습니다.' : 'An error has occurred.');
						$('#btn_otp_send').removeClass('process');
						return;
					} 
					
					// 정상 발송인 경우
					var pretty_num = vote_phone.replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/,"$1-$2-$3");
					$vote_layer.find('.findpw-user').text(pretty_num);
					$('#vote_sms').hide();
					$('#vote_verify').show();
					
					_self.sms_auth_time = 120;
					$('#btn_otp_resend').addClass('process');
					
					// 인증시간 처리
					_self.ck_auth_time = setInterval(function(){
						if (_self.sms_auth_time <= 0) {
							// 재전송 가능하도록 처리
							$('#btn_otp_resend').removeClass('process');
							$('#vote_auth_time').text('');
							clearInterval(_self.ck_auth_time);
						} else {
							_self.sms_auth_time = _self.sms_auth_time - 1;
							var _min = parseInt(_self.sms_auth_time / 60);
							var _sec = _self.sms_auth_time % 60;
							if (_min> 0 && _sec < 10) _sec = '0' + _sec;
							
							var disp_time = (_min > 0 ? _min + ':' + _sec : _sec);
							$('#vote_auth_time').text(disp_time);
						}
					}, 1000);
				}
			});
		});
		
		$('#vote_phone').on('keydown', function(e){
			var $info = $(this).closest('.vote-panel').find('.noti-vote');
			$info.text('');
			
			if (e.keyCode == 13) {
				$('#btn_otp_send').click();
			}
		});
		
		
		// 투표하기
		$('#btn_vote_send').on('click', function(){
			var vote_phone = $('#vote_phone').val();
			var $info = $(this).closest('.vote-panel').find('.noti-vote');
			$info.text('');
			
			var code = $('#vote_otp').val();
			
			if (code == '') {
				$info.text(g360.lang == 'ko' ? '인증번호를 입력하세요.' : 'Please enter the OTP number.');
				$('#vote_otp').focus();
				return;
			}
			
			var data = JSON.stringify({
				rental_key : rs.info.dockey,
				art_key : _self.cur_art_info.dockey,
				email : vote_phone,
				sec : code
			});			
			
			var url = g360.root_path + "/vote_process.mon";
			
			$.ajax({
				type: "POST",
				data: data,
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				url: url,
				success: function(res){							
					if (res.result == 'miss sec') {
						$info.text(g360.lang == 'ko' ? '유효하지 않은 인증번호입니다.' : 'Invalid OTP number.');
						return;
					} else if (res.result == 'T') {
						// 정상 처리된 경우
						$('#vote_verify').hide();
						$('#vote_cert').show();
					}
				}
			});
		});
		
		
		$('#vote_otp').on('keydown', function(e){
			var $info = $(this).closest('.vote-panel').find('.noti-vote');
			$info.text('');
			
			if (e.keyCode == 13) {
				$('#btn_vote_send').click();
			}
		});
		
		
		// 인증번호 재전송하기
		$('#btn_otp_resend').on('click', function(){
			if ($(this).hasClass('process')) {
				return;
			}

			$(this).addClass('process');
			
			var vote_name = $('#vote_name').val();
			var vote_phone = $('#vote_phone').val();
			var data = JSON.stringify({
				rental_key : rs.info.dockey,
				art_key : _self.cur_art_info.dockey,
				artist : g360.textToHtml(_self.cur_art_info.art_artist),
				title : g360.textToHtml(_self.cur_art_info.art_title),
				user_name 	: vote_name,
				phone_num 	: vote_phone,
				lang 		: g360.lang,
				country 	: '+82'
			});
			
			var url = g360.root_path + "/vote_sms.mon";
			
			$.ajax({
				type: "POST",
				data: data,
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				url: url,
				success: function(res){							
					if (res.result == 'T') {
						g360.showToastMsg(g360.lang == 'ko' ? '인증번호를 재전송하였습니다.' : 'OTP number has been resend.', 3000);
						
						_self.sms_auth_time = 120;
						$('#btn_otp_resend').addClass('process');
						
						// 인증시간 처리
						_self.ck_auth_time = setInterval(function(){
							if (_self.sms_auth_time <= 0) {
								// 재전송 가능하도록 처리
								$('#btn_otp_resend').removeClass('process');
								$('#vote_auth_time').text('');
								clearInterval(_self.ck_auth_time);
							} else {
								_self.sms_auth_time = _self.sms_auth_time - 1;
								var _min = parseInt(_self.sms_auth_time / 60);
								var _sec = _self.sms_auth_time % 60;
								if (_min> 0 && _sec < 10) _sec = '0' + _sec;
								
								var disp_time = (_min > 0 ? _min + ':' + _sec : _sec);
								$('#vote_auth_time').text(disp_time);
							}
						}, 1000);
						
					} else {
						g360.showToastMsg(g360.lang == 'ko' ? '전송중 오류가 발생했습니다.' : 'Error occurred during transfer.', 3000);
					}
				}
			});
		});		
	},
	"hideVoteLayer": function(){
		var $vote_layer = $('.vote-wrap');
		rs.hideBlockUI(true);
		$vote_layer.remove();
		
		if (this.is_vr) {
			var top_pano = top._pano || top.__pano1 || '';
			if (top_pano) {
				top_pano.krpano1.set('layer[close_freim_url_addhs].visible', true);
			}
		}
	},
	
	"vrSoundControl" : function(call_from){
		var _self = this;

		if (!this.is_vr) return;
		
		var top_pano = top._pano || top.__pano1 || '';
		if (!top_pano) return;
		
		// VR 배경음악이 재생중이 아니면 수행안함
		//0|0|50|50:재생중, 0|50|50|50:일시정지
		if (top_pano.krpano1.get('layer[snd2].crop') != '0|0|50|50') return;

		
		// IFRAME 닫는 경우 배경음악 다시 재생
		top_pano.krpano1.call('pausesound(bgsnd)');
		if (top_pano.krpano1.get('layer[close_freim_url_addhs]')){
			top_pano.krpano1.set('layer[close_freim_url_addhs].onclick', top_pano.krpano1.get('layer[close_freim_url_addhs].onclick') + "if(get(layer[snd2].crop) == '0|0|50|50', resumesound(bgsnd));");
		}
		
		// VR에서 작품상세 비디오 재생 클릭한 경우
		$('#video_header').on('click', function(){
			if (top_pano.krpano1.get('layer[snd2].crop') == '0|0|50|50') top_pano.krpano1.call('resumesound(bgsnd)'); 
		});							
		
	}
}
