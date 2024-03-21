function gRental_Edit(){	
	gRT_Address = this;
}

gRental_Edit.prototype = {		

	"init" : function(){
		var _self = this;		


        window.showdbook = "T";

//		$("#dbook_edit").on('click', function(){
//			gRE.open_info_change();
//			return false;
//		});
		
		
		$('#main_edit').on('click', function(){
			gRE.open_main_change();
		});
		/*
		if (showdbook == "T"){
			$("#dbook").show();
		}
		
		//업로드 클릭시
		$('#btn_dbook_upload, .dbook-file-info').on('click', function(){
			$('#dbook_upload_file').click();
		});
		$('#dbook_upload_file').on('change', function(){
			var file = this.files[0];
			if (!file) return;
			
			if (file.type != 'application/pdf') {
				alert('PDF 파일을 선택해 주세요.');
				$(this).val('');
				return;
			}
			
			$('#dbook_upload_fileinfo').text(file.name);
			$('#dbook_upload_progress').css('width', '0');
			$('#dbook_upload_percent').text('[ 0% ]');
		});
		//확인 버튼 클릭 시 업로드 및 공개/비공개 여부 처리
		$('#btn_dbook_save').on('click', function(){
			//공개 비공개 여부 선택
			
			
			
			//PDF 파일 선택한 경우 업로드
			if ($('#dbook_upload_file').get(0).files && $('#dbook_upload_file').get(0).files[0]) {
				
				if (_self.upload_status == 'ing') {
					return;
				}
				
				_self.upload_status = 'ing';
				var file = $('#dbook_upload_file').get(0).files[0];
				var fd = new FormData();
				fd.append('file', file, file.name);

				var img_height = 0;
				$.ajax({
					type: 'POST',
					data: fd,
					url: '/FileUpload_Rental_PDF.gu',
					contentType : false,
					processData: false,
					beforeSend: function(){
						$('.dbook-page-wrap img').css('opacity', 0);
						img_height = $('.dbook-page-wrap').find('img').addClass('before_img').eq(0).height(); 
					},
					xhr: function() {
						var xhr = $.ajaxSettings.xhr();
						xhr.upload.onprogress = function(e) { // 진행상황 표시
							var percent = Math.floor(e.loaded * 100 / e.total);
							var text_info = '';
							
							if (percent == 100) {
								text_info = 'D-Book 생성중';
							} else {
								text_info = percent + '% 업로드중';
							}
							$('#dbook_upload_progress').css('width', percent + '%');
							$('#dbook_upload_percent').text('[ ' + text_info + ' ]');
						};
						return xhr;
					},
					success: function(data) {
						var res = JSON.parse(data);
						if (res.result == 'OK') {
							$('.dbook-front').hide();
							
							$('#dbook_upload_percent').text('[ 업로드 완료 ]');
							var pdf_url = g360.dbook_path(g360.UserInfo.email, res.filename);
							var thum_path = '/artimage/' + g360.UserInfo.email + '/dbook/dbook_images/';
							
							
							$('#dbook_page_0').attr('src', thum_path + '0.png');
							
							var $page_wrap = $('.dbook-page-wrap');
							$page_wrap.find('.before_img').width(0).height(img_height);
							$page_wrap.append($('<img src="' + thum_path + '1.png' + '" class="wow fadeInRight animated" data-wow-delay="300ms">'));
							$page_wrap.append($('<img src="' + thum_path + '2.png' + '" class="wow fadeInRight animated" data-wow-delay="380ms">'));
							$page_wrap.append($('<img src="' + thum_path + '3.png' + '" class="wow fadeInRight animated" data-wow-delay="460ms">'));												
							
							setTimeout(function(){
								$('.dbook-front').show();
								$page_wrap.find('.before_img').remove();
							}, 300);
						} else {
							$('#dbook_upload_percent').text('[ 업로드 실패 ]');
						}
					},
					error: function(data){
						$('#dbook_upload_percent').text('[ 업로드 실패 ]');
						console.log(data);
					}
				}).always(function(){
					_self.upload_status = '';
				});;				
			} else {
				alert('PDF 파일을 선택해 주세요.');
			}
		});
		*/
		
		//PDF 업로드 클릭시
		$('#reg_btn_dbook_upload, #reg_dbook_upload_fileinfo').on('click', function(){
			$('#reg_dbook_upload_file').click();
		});
		
		$('#reg_dbook_upload_file').on('change', function(){
			var file = this.files[0];
			if (!file) return;
			
			if (file.type != 'application/pdf') {
				alert('PDF 파일을 선택해 주세요.');
				$(this).val('');
				return;
			}
			
			$('#reg_dbook_upload_fileinfo').val(file.name);
			$('#reg_dbook_upload_progress').css('width', '0');
		});
		
		$('#reg_btn_dbook_del').on('click', function(){
			$('#reg_dbook_upload_fileinfo').val('');
			$('#reg_dbook_upload_file').val('');
		});
			
	
		$(".list_tp-imgpick li").on("click", function(){
			//이미지 레이어에서 이미지를 선택 했을때...
			var img_src = $(this).find("img").attr("src");
		
			var data = JSON.stringify({
				vr_key : window.rs.info.dockey,
				bg_img : img_src
			});
			
			var url = "/update_rental_info_bgimg.mon";
			$.ajax({
				type : "POST",
				dataType : "json",
				contentType : "application/json; charset=utf-8",
				data : data,
				url : url,
				success : function(res){
					if (res.result == "OK"){			
						$('#vr_rental_img').attr('src', img_src);
						gRE.vr_popup_close();
					}else{
						gRE.gAlert("Info","오류가 발생하였습니다.", "blue", "top");
					}
				},
				error : function(e){
					gRE.gAlert("Info","오류가 발생하였습니다.", "blue", "top");
				}
			});
			
		});
		
		
		
		// 그룹코드 생성
		$('#reg_btn_group_create').on('click', function(){
			$('#rental_blockui').show();
			
			// 컨펑창 셋팅
			$('#rental_confirm_title').text('그룹 코드 생성');
			$('#rental_confirm_comm').text('그룹명');
			$('#rental_cf_content_wrap').show();
			
			
			
			$('#rental_confirm_btn_ok').off().on('click', function(){
				var title = $.trim($('#rental_confirm_input').val());
				var content = $.trim($('#rental_confirm_content').val());
				
				if (title.replace(/\s*/g, '') == '') {
					alert('제목을 입력해주세요');
					$('#rental_confirm_input').focus();
					return;
				}
				
				var url = "/create_group_code.mon"
				var data = JSON.stringify({
					title : title,
					content: content
				});
				
				$.ajax({
					type : "POST",
					dataType: "json",
					contenType : "application/json; charset=utf-8",
					data : data,
					url : url,
					success : function(res){
						if (res.result == 'OK') {
							$('#reg_group_info').val(res.code + ' (' + g360.textToHtml(res.title) + ')');
							$('#reg_group_code').val(res.code);
							$('#reg_group_title').val(g360.textToHtml(res.title));
							$('#reg_group_content').val(g360.textToHtml(res.content));
							$('#reg_group_owner').val(g360.UserInfo.email);
							
							$('#btn_group_link').show();
							$('#reg_group_info_wrap').show();
							$('#reg_group_btn_wrap').hide();
							
							$('#rental_confirm_input').val('');
							$('#rental_confirm_content').val('');
							$('#rental_confirm_layer').hide();
							$('#rental_blockui').hide();
						} else {
							alert('코드 생성중 오류가 발생했습니다.');
						}						
					},
					error : function(e){
						alert('코드 생성중 오류가 발생했습니다.');
					}
				});
				
			});
			$('#rental_confirm_layer').show();
			$('#rental_confirm_input').focus();
		});
		
		// 그룹코드 검색
		$('#reg_btn_group_search').on('click', function(){
			$('#rental_blockui').show();
			
			// 컨펌창 셋팅
			$('#rental_confirm_title').text('그룹 코드 검색');
			$('#rental_confirm_comm').text('그룹 코드를 입력해주세요.');
			$('#rental_cf_content_wrap').hide();
			
			$('#rental_confirm_btn_ok').off().on('click', function(){
				var code = $.trim($('#rental_confirm_input').val());
				
				if (code.replace(/\s*/g, '') == '') {
					alert('그룹 코드를 입력해주세요');
					$('#rental_confirm_input').focus();
					return;
				}
				
				var url = "/search_rental_code.mon";
				var data = JSON.stringify({
					code : code
				});
				
				$.ajax({
					type : "POST",
					dataType: "json",
					contenType : "application/json; charset=utf-8",
					data : data,
					url : url,
					success : function(res){
						if (res.result == 'OK') {
							$('#reg_group_info').val(code + ' (' + g360.textToHtml(res.group_title) + ')');
							$('#reg_group_code').val(code);
							$('#reg_group_title').val(g360.textToHtml(res.group_title));
							$('#reg_group_content').val(g360.textToHtml(res.group_content));
							if (res.group_owner) {
								$('#reg_group_owner').val(res.group_owner);
							} else {
								$('#reg_group_owner').val('');
							}
							
							$('#btn_group_link').show();
							$('#reg_group_info_wrap').show();
							$('#reg_group_btn_wrap').hide();
							
							$('#rental_confirm_input').val('');
							$('#rental_confirm_layer').hide();
							$('#rental_blockui').hide();
						} else {
							alert('존재하지 않는 그룹 코드 입니다.');
						}		
					},
					error : function(e){
						alert(e);
					}
					
				});
			});
			$('#rental_confirm_layer').show();
			$('#rental_confirm_input').focus();
		});
		
		// 그룹코드 삭제
		$('#reg_btn_group_del').on('click', function(){
			$('#reg_group_info').val('');
			$('#reg_group_code').val('');
			$('#reg_group_title').val('');
			$('#reg_group_content').val('');
			$('#reg_group_owner').val('');
			$('#reg_group_btn_wrap').show();
			$('#reg_group_info_wrap').hide();
			$('#btn_group_link').hide();
		});
		
		// 그룹편집
		$('#reg_btn_group_edit').on('click', function(){
			var owner = $('#reg_group_owner').val();
			
			if (owner != '') {
				if (g360.UserInfo.email != owner) {
					alert('그룹 소유주만 편집가능합니다.');
					return;
				}				
			} else {
				// 편집 기능 전에 저장한 사용자는 owner비교 안하고 편집 가능하도록 한다
			}
			
			$('#rental_blockui').show();
			
			// 컨펑창 셋팅
			$('#rental_confirm_title').text('그룹 정보 편집');
			$('#rental_confirm_comm').text('그룹명');
			$('#rental_cf_content_wrap').show();
			
			$('#rental_confirm_input').val($('#reg_group_title').val());
			$('#rental_confirm_content').val($('#reg_group_content').val());
			
			$('#rental_confirm_btn_ok').off().on('click', function(){
				var title = $.trim($('#rental_confirm_input').val());
				var content = $.trim($('#rental_confirm_content').val());
				
				if (title.replace(/\s*/g, '') == '') {
					alert('제목을 입력해주세요');
					$('#rental_confirm_input').focus();
					return;
				}
				
				
				var url = "/update_group_code.mon"
				var data = JSON.stringify({
					code : $('#reg_group_code').val(),
					title : title,
					content: content
				});
				
				$.ajax({
					type : "POST",
					dataType: "json",
					contenType : "application/json; charset=utf-8",
					data : data,
					url : url,
					success : function(res){
						if (res.result == 'OK') {
							$('#reg_group_info').val(res.code + ' (' + g360.textToHtml(res.title) + ')');
							$('#reg_group_title').val(g360.textToHtml(res.title));
							$('#reg_group_content').val(g360.textToHtml(res.content));
														
							$('#rental_confirm_input').val('');
							$('#rental_confirm_content').val('');
							$('#rental_confirm_layer').hide();
							$('#rental_blockui').hide();
							
							// 업데이트 안해도 정보가 변경되므로 바로 반영해준다.
							rs.info.info.group_title = res.title;
							rs.info.info.group_content = res.content;
						} else {
							alert('그룹 편집 중 오류가 발생했습니다.');
						}						
					},
					error : function(e){
						alert('그룹 편집 중 오류가 발생했습니다.');
					}
				});
				
			});
			$('#rental_confirm_layer').show();
			$('#rental_confirm_input').focus();
		});
		
		// 컨펌창 취소 버튼
		$('#rental_confirm_btn_cancel').on('click', function(){
			$('#rental_blockui').hide();
			$('#rental_confirm_input').val('');
			$('#rental_confirm_content').val('');
			$('#rental_confirm_layer').hide();
		});
		
		// 그룹링크
		$('#btn_group_link').on('click', function(){
			
			if ($('#reg_group_code').val()) {
				var link_url = location.protocol + '//' + location.host + '/rental/group_list.jsp?key=' + $('#reg_group_code').val();
				g360.copyToClipboard(link_url);
			} else {
				alert('그룹이 설정되어 있지 않습니다');
			}
		});
		
	},
	
	
	
	"open_subwin" : function(url, width, height, scrollbars, win_name, resizable){
		var opt_scrollbars = (scrollbars == null)?"yes":scrollbars;
		var opt_resizable = (resizable == null)?"yes":resizable;
		var window_name = (win_name == null)?"subwin":win_name;
		//var winFeature = set_center(width, height) + ",menubar=no,resizable=no ,scrollbars="+opt_scrollbars;
		var winFeature = gRE.set_center(width, height) + ",menubar=no,resizable="+opt_resizable+",scrollbars="+opt_scrollbars;
		var subwin = window.open(url, window_name, winFeature);
		return subwin;
	},
	
	"set_center" : function(win_width, win_height){
		winx = Math.ceil((screen.availWidth - win_width) / 2);
		winy = Math.ceil((screen.availHeight - win_height) / 2);
		return "left=" + winx + ",top=" + winy + ",width=" + win_width + ",height=" + win_height;
	},
	
	"body_scroll_show" : function(){
		$("body").css("overflow-y", "auto");
	},
	
	"body_scroll_hide" : function(){
		$("body").css("overflow", "hidden");
	},
	

	"open_main_change" : function(){
		gRE.body_scroll_hide();
		$('#main_img_select_title').html(g360.lang == 'ko' ? '메인 이미지 선택' : 'Select main image');
		$('#main_img_select_comment').html(g360.lang == 'ko' ? '선택된 이미지만 메인에 표시됩니다.' : 'Only the selected image is displayed in the main.');
		$('#main_image_list').empty();
		
		var _html = '';
		$.each(rs.info.imagelist, function(){
    		var _key = '';    		
    		var _email = this.filekey.substring(0, this.filekey.lastIndexOf("_"));
    		var _src = g360.preview_img_path(_email, this.filekey);
    		
    		var _cls = 'image';
    		if (rs.info.main_image && rs.info.main_image.length) {
    			if ($.inArray(this.filekey, rs.info.main_image) != -1){
    				_cls += ' selected';
    			}
    		}
    		_html += 
    			'<div class="image-wrap">' +
    			'	<div class="' + _cls + '" data-artkey="' + this.filekey + '" style="background-image:url(' + _src + ')">' +
    			'		<div class="line"></div>' +
    			'		<div class="info">' + this.name + '</div>' +
    			'		<div class="bg"></div>' +
    			'		<div class="ck"></div>' +
    			'	</div>' +
    			'</div>';
		});
		
		$('#main_image_list').html(_html);
		
		// 이벤트 처리
		$('#main_image_list .image').on('click', function(){
			$(this).toggleClass('selected');
		});
		
		// 저장
		$('#select_main_layer .btn-ok').off().on('click', function(){
			gRE.save_main_select();
		});
		
		$("#select_main_layer").show();
		$('.select-main-container').scrollTop(0);
	},
	"save_main_select" : function() {
		var sel_imgs = [];
		$('#main_image_list .image.selected').each(function(){
			sel_imgs.push($(this).data('artkey'));
		});

		var json_data = {
			main_image: sel_imgs,
			rentalkey: rs.info.dockey
		};
		
		var data = JSON.stringify(json_data);
		
		var url = "/rental_main_image_select.mon";
		$.ajax({
			type : "POST",
			dataType : "json",
			contentType : "application/json; charset=utf-8",
			data : data,			
			url : url,
			success : function(res){
				if (res.result == "OK"){			
					gRE.gAlert("Info", (g360.lang == 'ko'?"정상적으로 반영되었습니다.":"Successfully reflected."), "blue", "top", function(){
						location.reload();						
					});
				}else{
					gRE.gAlert("Info",(g360.lang == "ko"?"오류가 발생하였습니다.":"An error has occurred."), "blue", "top");
				}
			},
			error : function(e){
				gRE.gAlert("Info",(g360.lang == "ko"?"오류가 발생하였습니다.":"An error has occurred."), "blue", "top");
			}
		});
	},
	
	"open_image_change" : function(){
		gRE.body_scroll_hide();
		var bar = "<span class='title-deco'></span>";
		
		$("#vrgallery_popup_title_rental").html(bar + (g360.lang == 'ko'?'전시 이미지 선택':'Select exhibition image'));		
		$("#select_vr_layer").show();		
		
	},
	
	"open_info_change" : function(){
		//기존 데이터를 세팅한다.
		gRE.edit_init();
		
		var bar = "<span class='title-deco'></span>";
		
		$("#vrgallery_popup_title_rental2").html(bar + "전시 주최자 정보 입력");		
		$("#select_vr_layer2").show();	
	},
	
	"close_edit_layer" : function() {
		gRE.body_scroll_show();
		$('.layer_account').hide();
	},
	
	"vr_popup_close" : function(){
		gRE.body_scroll_show();
		$("#select_vr_layer").hide();	
	},
	
	"vr_popup_close2" : function(){
		
		gRE.body_scroll_show();
		$("#select_vr_layer2").hide();	
	},
	
	"edit_init" : function(){
	
		gRE.body_scroll_hide();
		
		var info = window.rs.info.info;
		
		var rental_type = info.rental_type;
		if (!rental_type || rental_type == '') rental_type = '1';
		
		//$("#host").val(info.host);
		//functions.js
		$("#host").val(g360.textToHtml(info.host));
		
		$("#tel").val(info.tel);
		$("#email").val(info.email);
		$("#facebook").val(info.facebook);
		$("#twitter").val(info.twitter);
		$("#blog").val(info.blog);
		$("#instagram").val(info.instagram);
		$("#youtube").val(info.youtube);
		$("#reg_dbook_upload_fileinfo").val(g360.textToHtml(info.dbook_ori_filename));
		$("#reg_dbook_upload_file").val('');
		$('#reg_dbook_upload_progress').css('width', '0%');
		$('input:radio[name="homepage_public"]:radio[value="' + window.rs.info.open_homepage + '"]').prop('checked', true);
		$('input:radio[name="marketing_agreement"]:radio[value="' + info.marketing_agreement + '"]').prop('checked', true);
		$('input:radio[name="rental_type_setting"]:radio[value="' + rental_type + '"]').prop('checked', true);
		//$('input:radio[value="' + window.rs.info.open_homepage + '"]').prop('checked', true);
		
		if (info.group_code) {
			$('#reg_group_info').val(info.group_code + ' (' + g360.textToHtml(info.group_title) + ')');
			$('#reg_group_code').val(info.group_code);
			$('#reg_group_title').val(g360.textToHtml(info.group_title));
			$('#reg_group_content').val(g360.textToHtml(info.group_content));
			$('#reg_group_info_wrap').show();
			$('#reg_group_btn_wrap').hide();
			$('#btn_group_link').show();
			
			if (info.group_owner) {
				$('#reg_group_owner').val(info.group_owner);
				if (info.group_owner == g360.UserInfo.email) {
					$('#reg_btn_group_edit').show();
				}
			}
		} else {
			$('#reg_group_info').val('');
			$('#reg_group_code').val('');
			$('#reg_group_title').val('');
			$('#reg_group_content').val('');
			$('#reg_group_owner').val('');
			$('#reg_group_info_wrap').hide();
			$('#reg_group_btn_wrap').show();
		}
	},
	
	"dbook_upload_check" : function(){
		
		debugger;
		var _self = this;
		
		if ($("#host").val() == ""){
			alert("정보입력");
			gRE.gAlert_focus("Info","주최자 및 단체명 정보는 반드시 입력하셔야합니다.", "blue", "top", "host");
			return false;
		}
		
		if ($("#tel").val() == ""){
			gRE.gAlert_focus("Info","대표번호 정보는 반드시 입력하셔야합니다.", "blue", "top", "tel");
			return false;
		}
		
		if ($("#email").val() == ""){
			gRE.gAlert_focus("Info","이메일 정보는 반드시 입력하셔야합니다.", "blue", "top", "email");
			return false;
		}
		
		if (!$('#reg_dbook_upload_file').get(0).files || !$('#reg_dbook_upload_file').get(0).files[0]) {
			// 파일을 업로드하지 않았으면 기존 값을 그대로 넘김
			var info = window.rs.info.info;
			var dbook_info;
			
			if ($('#reg_dbook_upload_fileinfo').val() == '') {
				dbook_info = {
					'count': 0,
					'filename': '',
					'ori_filename': '',
					'version': ''
				};
				
				// 삭제된 경우
				if (info.dbook_ori_filename) {
					dbook_info.is_dbook_change = true;
				}
			} else {
				dbook_info = {
					'count': info.dbook_page_count,
					'filename': info.dbook_filename,
					'ori_filename': info.dbook_ori_filename,
					'version': info.dbook_version
				};
			}
			
			_self.save_info(dbook_info);
			return;
		}
		
		//PDF 파일 선택한 경우 업로드
		if (_self.upload_status == 'ing') {
			return;
		}
		
		_self.upload_status = 'ing';
		var file = $('#reg_dbook_upload_file').get(0).files[0];
		var fd = new FormData();
		fd.append('key', window.rs.info.dockey);
		fd.append('file', file, file.name);
		

		$.ajax({
			type: 'POST',
			data: fd,
			url: '/FileUpload_Rental_PDF.gu',
			contentType : false,
			processData: false,
			beforeSend: function(){
				 window.rs.showLoadingTop('D-Book 업로드 중 (0%)');
			},
			xhr: function() {
				var xhr = $.ajaxSettings.xhr();
				xhr.upload.onprogress = function(e) { // 진행상황 표시
					var percent = Math.floor(e.loaded * 100 / e.total);
					var text_info = '';
					$('#reg_dbook_upload_progress').css('width', percent + '%');
					
					if (percent == 100) {
						text_info = 'D-Book 생성 중 ...';
					} else {
						text_info = 'D-Book 업로드 중 (' + percent + '%)';
					}
					window.rs.showLoadingTop(text_info);
				};
				return xhr;
			},
			success: function(data) {
				return data;
			},
			error: function(data){
				return data;
			}
		}).then(
			function(data){
				var res = JSON.parse(data);
				if (res.result == 'OK') {
					res.ori_filename = file.name;
					res.version = (new Date()).getTime();
					res.is_dbook_change = true;
					_self.save_info(res);
				} else {
					alert('D-Book 생성 중 오류가 발생했습니다.');
					$('#reg_dbook_upload_progress').css('width', '0');
					window.rs.hideLoadingTop();
				}
				_self.upload_status = '';
			},
			function(data){
				_self.upload_status = '';
				alert('PDF 업로드 중 오류가 발생했습니다.');
				$('#reg_dbook_upload_progress').css('width', '0');
				window.rs.hideLoadingTop();
			}
		);

	},
	
	"save_info" : function(dbook_info){
				
		var json_data = {
			vr_key			: window.rs.info.dockey,
			host 			: $("#host").val(),
			tel 			: $("#tel").val(),
			email 			: $("#email").val(),
			facebook 		: $("#facebook").val(),
			twitter 		: $("#twitter").val(),
			blog 			: $("#blog").val(),
			instagram 		: $("#instagram").val(),
			youtube 		: $("#youtube").val(),
			group_code 		: $("#reg_group_code").val(),
			group_title 	: $("#reg_group_title").val(),
			group_content	: $("#reg_group_content").val(),
			group_owner		: $("#reg_group_owner").val(),
			
			
			open_homepage 	: $('input:radio[name="homepage_public"]:checked').val(),
			marketing_agreement : $('input:radio[name="marketing_agreement"]:checked').val(),
			rental_type		: $('input:radio[name="rental_type_setting"]:checked').val(),
			type 			: "update"
		}
		
		if (dbook_info) {
			json_data.dbook_page_count = dbook_info.count;
			json_data.dbook_filename = dbook_info.filename;
			json_data.dbook_ori_filename = dbook_info.ori_filename;
			json_data.dbook_version = dbook_info.version;
		}
		
		var data = JSON.stringify(json_data);
		
		
		var url = "/update_rental_info.mon";
		$.ajax({
			type : "POST",
			dataType : "json",
			contentType : "application/json; charset=utf-8",
			data : data,
			url : url,
			beforeSend: function(){
				window.rs.showLoadingTop('대관 생성 중 ...');				
			},
			success : function(res){
				if (res.result == "OK"){
					
					// 렌탈 타입이 변경되면 리로딩
					if (window.rs.info.info.rental_type != json_data.rental_type) {
						location.reload();
						return;
					}
					
					window.rs.info.info = JSON.parse(data);
					window.rs.info.open_homepage = json_data.open_homepage;

					gRE.vr_popup_close2();
					
					$("#host_name").html($("#host").val());
					$("#host_tel").html($("#tel").val());
					$("#host_email").html($("#email").val());		
					$("#reg_dbook_upload_file").val('');
					
					window.rs.setFooter();
					
					if (dbook_info.is_dbook_change) {
						window.rs.setDbook();
					}
					window.rs.setGroupList();
										
				}else{
					gRE.gAlert("Info","오류가 발생하였습니다.", "blue", "top");
				}
			},
			error : function(e){
				gRE.gAlert("Info","오류가 발생하였습니다.", "blue", "top");
			}
		}).always(function(){
			window.rs.hideLoadingTop();
		});
	},
	
	
	
	"gAlert" : function(title, content, type, animation, callback){
		
		type = "default";
		title = " ";
		animation = "top";
		$.alert({
			title : title,
			content : content + "<hr>",
			type : type,
			closeIcon : true,
			closeIconClass : "fa fa-close",
			columnClass : "small",
			backgroundDismiss: true,
			animation : animation,
			animateFromElement : false,
			escapeKey : true,
			animationBounce : 2,
			buttons : {
				OK : {
					keys: ['enter'],
					text : "확인",		
					btnClass : "btn-"+type,
					action : function(){
						if (callback) callback();
					}
				}				
			}
		});
	},
	
	"gAlert_focus" : function(title, content, type, animation, id){
		
		type = "default";
		title = " ";
		animation = "top";
		$.alert({
			title : title,
			content : content + "<hr>",
			type : type,
			closeIcon : true,
			closeIconClass : "fa fa-close",
			columnClass : "small",
			backgroundDismiss: true,
			animation : animation,
			animateFromElement : false,
			escapeKey : true,
			animationBounce : 2,
			buttons : {
				OK : {
					keys: ['enter'],
					text : "확인",		
					btnClass : "btn-"+type,
					action : function(){						
					}
				}				
			},
			onDestroy: function () {
				if (id != "" && typeof(id) != "undefined"){
					$("#" + id).focus();
				}
				
		    },
		});
	}
	
	

}

var gRE = new gRental_Edit();
gRE.init();
	
	
$(document).on('ready', function() {
    $("div.list-wrap_tp-imgpick>ul>li").on("click", function(){
        $('li.select_tp-imgpick').removeClass('on');
        $(this).addClass('on');
    });
});  
	
	
	
	
	
	


















