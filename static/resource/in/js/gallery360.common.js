$(document).ready(function(){

});

var g360 = null;                       //gallery360.common.js
var IMP = window.IMP; // 생략가능

function gallery360(root_path, userinfo){
	_this = this;	

	this.domain = ''; //운영서버 하드코딩 (추후 빈값으로 변경)
	
	try{
		this.UserInfo = userinfo;		
		this.root_path = root_path;
		
		this.history = false;
		this.isPopupVROpen = "F";
		this.lang = this.getLang();
	}catch(e){
	    alert(e);
	}
	
}

gallery360.prototype = {
	"getLang" : function(){
		var lang = 'ko';
		var user_lang = localStorage.getItem('user_lang');
		if (user_lang) {
			lang = user_lang == 'ko' ? 'ko' : 'us';
		} else {
			// 2. 브라우저 언어
			var browser_lang = navigator.language;
			if (browser_lang) {
				browser_lang = navigator.language.toLowerCase().substring(0,2);
				lang = browser_lang == 'ko' ? 'ko' : 'us';
			}
		}
		return lang;
	},
	"load_init" : function(call_type){
		//var user_lang = g360.UserInfo.email + "_lang";
		/*
		var  lang = localStorage.getItem("user_lang");
		var c_lang = 'ko.json';
		var text = "";
		var cl = 'ko';
		
		if(lang!=null){
			c_lang = lang+".json";
			cl = lang;
		}
		
		if(cl=="ko"){
			text = " Korean";
		}else if(cl=="us"){
			text = " English";
		}
		*/
		
		// 1. 사용자가 설정한 언어
		var lang = this.getLang();
		var c_lang = lang+'.json';
		
		var text = lang == 'ko' ? 'Korean' : 'English';
		
		
		$("#flag_img").removeClass().addClass("flag-icon").addClass("flag-icon-"+lang);
		$("#flag_txt").text(text);
		
				
		var url = g360.root_path + "/resource/in/lang/"+c_lang+"?ver=230106";
		//debugger;
		console.log(url);
		$.ajax({
			type : "GET",
			url : url,
			async : false,
			contentType : "application/json; charset=utf-8",
			success : function(res){	
				//한,영 언어변경
				g360.in_lang = res;
				      
				//내부자 load_init : 대관관리 페이지 내 로그인 상태확인 
				if(!g360.UserInfo){
					
					g360.gConfirm3(g360.in_lang.Alert_session,function(){
						location.href = location.protocol  + '//' + location.host + "/m/login";
					});

//					g360.gAlert("",g360.in_lang.Alert_session,"","","");
					
//					setTimeout(() => {
//						location.href = location.protocol  + '//' + location.host + "/m/login";
//					}, 2000);
					return false;
				}
				
				//로그인 했을경우 결제한 고객인지 확인
				if(!g360.UserInfo.rental_level && g360.UserInfo.role!="admin"){

					//payment_record 확인
					if(!g360.UserInfo.payment_record){
						
						location.href = location.protocol  + '//' + location.host + "/m/payment";
						
//						g360.gConfirm3(g360.in_lang.Alert_unpaid,function(){
//							location.href = location.protocol  + '//' + location.host + "/m/payment";
//						});
						
						return false;
						
					}
				
				}else if(g360.UserInfo.role!="admin"){
					//결제는 했는데 rental_opt이 1~3일 경우, 파일안올렸는지 확인 (get)
				
					$.ajax({
						type : "GET",
						url : g360.root_path + "/opt_zip_chk.mon",
						contentType : "application/json; charset=utf-8",
						success : function(data){
							
							if(data.res == false){
								//debugger;
								location.href = location.protocol  + '//' + location.host + "/m/payment";
								
//								g360.gAlert("","양식에 맞춰 파일을 먼저 업로드 해주세요.","","","");
//								
//								setTimeout(() => {
//									location.href = location.protocol  + '//' + location.host + "/m/payment";
//								}, 2000);
								
								return false;
							}
						}
					});						
					
				}
				
				//타입설정 확인
				var rental_type = g360.UserInfo.type;
				var on_complete;
				if (!rental_type || rental_type == '') {
					// 타입 설정을 안한 경우 타입을 먼저 설정하도록 한다.
					// 최초 설정시에는 레이어를 닫을 수 없도록 닫기 버튼 숨김
					//$("#ty_change").click();
					
					on_complete = function(){$("#notype").modal('show');}
					
				}
				
				var url2 = g360.root_path + "/rental_text_check.mon?id="+g360.UserInfo.type+"_"+g360.in_lang.Lang;
				$.ajax({
					type : "GET",
					url : url2,
					contentType : "application/json; charset=utf-8",
					success : function(res){
						
						//console.log("res");
						//console.log(g360.in_lang.Lang);
						
						//타입 언어변경 
						g360.in_lang_ex = res;	
						//console.log(g360.in_lang_ex);
						
						//언어 세팅
						g360.init_text_setting();
						
						if(call_type){
							var res_data = {
									result : "ok",
									callback : on_complete
							}
							call_type(res_data);
						}
						
					}
				});
				
			},
			error : function(e){
				g360.error_alert();
			}
		})
		
		g360.history_record("main");	
		
/*		$("#change_type11").on("click",function(){
			$("#large").show();
		})*/
		
		if(g360.UserInfo.payment_record && g360.UserInfo.rental_level == ""){
			
		}else{

			$("#go_main").on("click", function(){
				
				$("li.nav-item").removeClass('active');
				$("#go_home").addClass('active');
				
				g360.load_page("/JSP/in/service/main.jsp");
			});	
			
			$("#go_home").on("click", function(){

				$("li.nav-item").removeClass('active');
				$("#go_home").addClass('active');
				
				g360.load_page("/JSP/in/service/main.jsp");
			});
			
			$("#go_artistList").on("click", function(){

				$("li.nav-item").removeClass('active');
				$("#go_artistList").addClass('active');
				g360.history_record($(this).attr('id'));
				g360.load_page("/JSP/in/service/artistList.jsp");
			});
			
			$("#go_artList").on("click", function(){

				$("li.nav-item").removeClass('active');
				$("#go_artList").addClass('active');
				g360.history_record($(this).attr('id'));
				g360.load_page("/JSP/in/service/artList.jsp");
			});
			
			$("#go_vrList").on("click", function(){

				$("li.nav-item").removeClass('active');
				$("#go_vrList").addClass('active');
				g360.history_record($(this).attr('id'));
				g360.load_page("/JSP/in/service/vrList.jsp");
			});
			
			$("#go_rentalList").on("click", function(){

				$("li.nav-item").removeClass('active');
				$("#go_rentalList").addClass('active');
				g360.history_record($(this).attr('id'));
				g360.load_page("/JSP/in/service/rentalList.jsp");
			});
			
			$("#go_memoList").on("click", function(){

				$("li.nav-item").removeClass('active');
				$("#go_memoList").addClass('active');
				g360.history_record($(this).attr('id'));
				g360.load_page("/JSP/in/service/memoList.jsp");
			});
			
			
			$("#go_VoteStatus").on("click", function(){
				//g360.gAlert("",g360.in_lang.Alert_Prepare,"","","");
				
				$("li.nav-item").removeClass('active');
				$("#go_VoteStatus").addClass('active');
				g360.history_record($(this).attr('id'));
				g360.load_page("/JSP/in/service/voteStatus.jsp");
				
			});
			
			$("#go_addressList").on("click", function(){
				
				$("li.nav-item").removeClass('active');
				$("#go_addressList").addClass('active');
				g360.history_record($(this).attr('id'));
				g360.load_page("/JSP/in/service/addressList.jsp");
			});
			
			$("#go_sendList").on("click", function(){

				$("li.nav-item").removeClass('active');
				$("#go_sendList").addClass('active');
				g360.history_record($(this).attr('id'));
				g360.load_page("/JSP/in/service/sendList.jsp");
			});

			
			
			$("#go_artistReg").on("click", function(){
				g360.history_record($(this).attr('id'));
				g360.load_page("/JSP/in/service/artistReg.jsp");
			});
			
			$("#go_artReg").on("click", function(){
				g360.history_record($(this).attr('id'));
				g360.load_page("/JSP/in/service/artReg.jsp");
			});
			
			
			$("#go_vrReg").on("click", function(){
				g360.history_record($(this).attr('id'));
				g360.load_page("/JSP/in/service/vrReg.jsp");
			});
			
			$(".go_rentalReg").on("click", function(){
//				>> 데이터 불러오기 
				//1. etc_common에 정보삽입
				g360.rentalInfoAdd();
				//2. vr클릭시 대관정보 작성으로 이동
			});

		}
		
		
		$("#go_approvalOpt").on("click", function(){

			$("li.nav-item").removeClass('active');
			$("#go_approvalOpt").addClass('active');
			
			g360.load_page("/JSP/in/service/approvalOpt.jsp");
		});
		
		$("#go_approvalList").on("click", function(){

			$("li.nav-item").removeClass('active');
			$("#go_approvalList").addClass('active');
			
			g360.load_page("/JSP/in/service/approvalList.jsp");
		});
		
		$("#go_profile").on("click", function(){
			g360.load_page("/JSP/in/service/profile.jsp");
		});		
		
	},

	
	"rentalInfoAdd": function(){
		
		
		// 미등록 vr 출력
		var url = g360.root_path + "/load_vr_before_rental.mon";
		$.ajax({
			type : "GET",
			dataType : "json",
			contentType : "application/json; charset=utf-8",
			url : url,
			success : function(data){
				
				if(data.length == 0){
					g360.gAlert("",g360.in_lang.Alert19_Exhibit,"","","");
					return false;
				}
				
                var html = ``;
                var image_url = "";
                
				for (var i = 0 ; i < data.length; i++){
					
					var info = data[i];
					image_url = "/vrgallery/" + info.email + "/" +  info.dockey + "/pano_f.jpg?t=" + new Date().getTime();
					
	                html+= 
	                `<div class="col-xl-2 col-lg-4 col-sm-6 select-tp-vr" data="${info.dockey}" data2="${info.short_url}">
	                    <div class="card tit-bg-dark mt-2">
                            <div class="si-img height-265">
                                <img class="card-img-top img-fluid" src="${image_url}"/>
                            </div>
	                        <div class="card-body media">
	                            <h4 class="card-title mb-0">
	                                <a href="regist-rental.html" class="blog-title-truncate text-body-heading">${info.title}</a>
	                            </h4>
	                        </div>
	                    </div>
	                </div>`
						
				}

		        $("#rL_xlarge_List").html(html);       
		        
		        //대관클릭시 2단계로 이동
		        $(".select-tp-vr").on("click", function(){
		        	var dockey = $(this).attr("data");
		        	g360.rental_key = $(this).attr("data");
		        	g360.rental_short_url = $(this).attr("data2");
		        	//console.log(g360.rental_key);
		        	//console.log(g360.rental_short_url);
		        	g360.load_page("/JSP/in/service/rentalReg.jsp");
		        });
		        
		        //모달닫기 (강제적용)
//		        $(".rentalModalclose").on("click",function(){
//		        	$("#rL_xlarge").hide();
//		        })
		        
		        $("#rL_xlarge").modal('show');
		        
			}, 
			error : function(e){
			    console.log(e);
				g360.error_alert();
			}
		});
		
	},

	"init_text_setting" : function(){
		/* class="in_lang_키값" */
//		var in_lang_size = Object.keys(g360.in_lang).length;
		
//		var {key_in, value_in} = "";
//		for(var i=0; i<in_lang_size; i++){
//			key_in = Object.keys(g360.in_lang)[i];
//			value_in = Object.values(g360.in_lang)[i];
//			$(".in_lang_"+key_in).text(value_in);
//		}
		
		//$("#icon_main").text(g360.in_lang.home);
		
		//사이드 메뉴
		$(".in_lang_Main").text(g360.in_lang.Main);
		$(".in_lang_Admin_of_VR_rental").text(g360.in_lang.Admin_of_VR_rental);
		
		//타입설정 변경
		$(".in_lang_Artist_List").text(g360.in_lang_ex.tab1_list);
		$(".in_lang_Art_List").text(g360.in_lang_ex.tab2_list);
		//$(".in_lang_Artist_List").text(g360.in_lang.Artist_List);
		//$(".in_lang_Art_List").text(g360.in_lang.Art_List);
		
		$(".in_lang_VR_List").text(g360.in_lang.VR_List);
		$(".in_lang_Rental_List").text(g360.in_lang.Rental_List);
		$(".in_lang_Account_Info").text(g360.in_lang.Account_Info);
		$(".in_lang_Memo_List").text(g360.in_lang.Memo_List);
		$(".in_lang_View_voting_status").text(g360.in_lang.View_voting_status);
		$(".in_lang_Address_List").text(g360.in_lang.Address_List);
		$(".in_lang_Send_List").text(g360.in_lang.Send_List);
		$(".in_lang_Approval_Opt").text(g360.in_lang.Approval_Opt);
		$(".in_lang_Approval_List").text(g360.in_lang.Approval_List);
		$(".in_lang_Sign_in").text(g360.in_lang.Sign_in);
		$(".in_lang_Sign_out").text(g360.in_lang.Sign_out);
		$(".in_lang_MyInfo").text(g360.in_lang.MyInfo);
		
		//상단바 툴팁
		$(".in_lang_Register_Artist").attr("data-original-title", g360.in_lang_ex.btn1);
		$(".in_lang_Register_Artwork").attr("data-original-title", g360.in_lang_ex.btn2);
		$(".in_lang_Create_VR").attr("data-original-title", g360.in_lang.Create_VR);
		$(".in_lang_Start_VR_exhibit").attr("data-original-title", g360.in_lang.Start_VR_exhibit);
		$(".in_lang_Video_Guide").attr("data-original-title", g360.in_lang.Video_Guide);
		
		//vr갤러리 선택
		$("#myModalLabel16").text(g360.in_lang.Select_Rental_1);
		
		//선택한 타입확인
		$("#retalType").text(g360.in_lang_ex.select);
		
	},
	
	"goHome" : function(){
			//g360.LoadPage("body_content", g360.root_path + "/JSP/in/main/main.jsp");
			//g360.LoadPage_Top("top_content", g360.root_path + "/main/main_top.jsp", call_type);
			//g360.LoadPage_Content("body_content", g360.root_path + "/main/main_content.jsp");  //최초 로딩시만 이 함수를 사용하고 GNB클릭시는 그냥 LoadPage를 호출해야 한다.
	},
	
	"load_page" : function(path, callback){
		g360.LoadPage("body_content", g360.root_path + path, callback); 
	},
	
	"LoadPage" : function(id, url, callback){
		
		$("#"+id).load(url, function(response, status, xhr){
			
			if (status == "error"){
				var msg = "Site Error : "; 
				g360.gAlert("Error",msg + xhr.status + " " + xhr.statusText, "red", "left");
				
			}else if (status == "success"){
				$("#"+id).show();
				
				 if (feather) {
		        	 feather.replace({
			                width: 14,
			                height: 14
			            });
		        }
				
				if (typeof(callback) == 'function') {
					callback();
				}
				
			//	$("#bottom_content").show();
			}
		});
	},
	
//	"gConfirm":function(msg, callback){
//		
//		$.confirm({
//			title : " ",
//			content : msg +"<hr>",
//			type : "default",  
//			closeIcon : true,
//			closeIconClass : "fa fa-close",
//			columnClass : "small",  
//			animation : "top", 
//			animateFromElement : false,
//			closeAnimation : "scale",
//			animationBounce : 1,	
//			backgroundDismiss: false,
//			escapeKey : false,
//			buttons : {		
//				confirm : {
//					keys: ['enter'],
//					text : "확인",
//					btnClass : "btn-default",
//					action : function(){
//						if (callback) callback();
//					}
//				},
//				cancel : {
//					keys: ['esc'],
//					text : "취소",
//					btnClass : "btn-default",
//					action : function(){
//						
//					}
//				}
//			}
//		});	
//		
//	},
	
	"gConfirm2" : function(title, content, callback){
		// 타이틀 + 내용
		//내용, ok눌렀을때 결과
        Swal.fire({
          title: title,
    	  html: content,
          showCancelButton: true,
          confirmButtonText: g360.in_lang.Ok,
          cancelButtonText: g360.in_lang.Cancel,
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-outline-danger ml-1'
          },
          buttonsStyling: false
          
        }).then(function (result) {
          if (result.value) {
        	  if(callback) callback();
          }
        });
        
		
	},
	
	"gConfirm3":function(msg, callback){
		// 취소버튼 없음
		//내용, ok눌렀을때 결과
        Swal.fire({
    	  html: msg,
          showCancelButton: false,
          confirmButtonText: g360.in_lang.Ok,
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-outline-danger ml-1'
          },
          buttonsStyling: false,
          backdrop: 'rgba(0,0,0,1)'
        	  
        }).then(function (result) {
        	if (typeof(callback) == 'function') {
    			callback();
    		} 
        });
        
	},
	
	"gConfirm":function(msg, callback){
		// 내용만 전달할 때 
		//내용, ok눌렀을때 결과
        Swal.fire({
    	  html: msg,
          showCancelButton: true,
          confirmButtonText: g360.in_lang.Ok,
          cancelButtonText: g360.in_lang.Cancel,
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-outline-danger ml-1'
          },
          buttonsStyling: false
          
        }).then(function (result) {
          if (result.value) {
        	  if(callback) callback();
          }
        });
        
	},
	
	"LoadPage_Content" : function(id, url){
		$("#"+id).load(url, function(response, status, xhr){
			if (status == "error"){
				var msg = "Site Error : "; 
				g360.gAlert("Error",msg + xhr.status + " " + xhr.statusText, "red", "left");
			}else if (status == "success"){
				g360.LoadPage("bottom_content", g360.root_path + "/main/main_bottom.jsp");
			}
		});
	},
	

	
	"logout" : function(){
		location.href = g360.root_path + "/logout.do";	
	},
	
	"login" : function(){
		location.href = g360.root_path  + "/login.html";
	},
	
	
	
	"scroll_Top" : function(){
		$("html, body").animate({ scrollTop: 0 }, "fast");
	},
	
	"scroll_position" : function(to){
		$("html, body").animate({ scrollTop: to }, "fast");
	},
	
	
	
	"isM" : function(){
		var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false;
		return isMobile
	},
	
	"photo_image_change" : function(){
		//주변 다른 이미지도 수정
		var url = g360.user_photo_url(g360.UserInfo.email) + "?open&ver=" + new Date().getTime();
		g360.UserInfo.photoimage = g360.UserInfo.email;
		
		var gubun = g360.UserInfo.gubun;
		var url2 = g360.user_photo_url_none(gubun);
		var bgimg = "url('"+url+"'), url('" +url2+ "')";
		//내부자 - main.jsp(메인) / index.jsp(상단)
		$("#in_main_user_image").attr("src",url);
		$("#in_main_user_image2").attr("src",url);
		$("#account-upload-img").attr("src",url);
		
		
		$("#main_user_image").css("background-image", bgimg);
		$("#main_user_image2").css("background-image", bgimg);
		
		$("#r_main_user_image").css("background-image", bgimg);
		$("#r_main_user_image2").css("background-image", bgimg);
		
		$("#mobile_user_img").css("background-image", bgimg);
		$("#mobile_user_img2").css("background-image", bgimg);
	},
	
	"login_hide" : function(){
		//정상적으로 로그인 되었을 경우
		
		if (typeof(g360.UserInfo.photoimage) != "undefined"){
			//이미지 o
			var url = g360.user_photo_url(g360.UserInfo.email) + "?open&ver=" + new Date().getTime();
			
			var gubun = g360.UserInfo.gubun;
			var url2 = g360.user_photo_url_none(gubun);
			var bgimg = "url('"+url+"'), url('" +url2+ "')";
			
			//내부자 - main.jsp(메인) / index.jsp(상단)
			$("#in_main_user_image").attr("src",url);
			$("#in_main_user_image2").attr("src",url);
			$("#user_Name").text(g360.UserInfo.nickname);
			
			
			//메인
			$("#main_user_image").css("background-image", bgimg);
			//상단 
			$("#main_user_image2").css("background-image", bgimg);

			$("#r_main_user_image").css("background-image", bgimg);
			$("#r_main_user_image2").css("background-image", bgimg);
			
			$("#mobile_user_img").css("background-image", bgimg);
			$("#mobile_user_img2").css("background-image", bgimg);
			
			

		}else{
			//이미지 x
			var gubun = g360.UserInfo.gubun;
			var res = g360.user_photo_url_none(gubun);
			var bgimg = "url('"+res+"')";
			var bgimg2 = "url('"+res.replace(".svg","2.svg")+"')";
			
			//내부자 - main.jsp(메인) / index.jsp(상단)
			$("#in_main_user_image").attr("src",res);
			$("#in_main_user_image2").attr("src",res);
			$("#user_Name").text(g360.UserInfo.nickname);
			
			$("#main_user_image").css("background-image", bgimg2);
			$("#main_user_image2").css("background-image", bgimg2);
			
			$("#r_main_user_image").css("background-image", bgimg);
			$("#r_main_user_image2").css("background-image", bgimg);
			
			$("#mobile_user_img").css("background-image", bgimg2);
			$("#mobile_user_img2").css("background-image", bgimg2);
			
		//	$("#main_user_image2").attr("src", res);
			$("#main_user_image2").attr("onerror", "g360.user_photo_url_none_draw(this)");
			
		}
		
	

	},
	
	"login_check" : function(){
		
		//현재 로그인 되어 있는지 판단한다.
		var isAccess = "F";
		console.log(isAccess);
		if (g360.UserInfo != null) {			
			var url = g360.root_path + "/access_check.mon";
			$.ajax({
				type : "GET",
				dataType : "json",
				async : false,
				cache : false,
				contentType : "application/json; charset=utf-8",
				url : url,
				success : function(data){
					
					if (data.access == "YES"){
						isAccess = "T";
					}else{
						alert("장시간 미사용하여 자동 로그 아웃 되었습니다. 재로그인 하시고 시도 해주시기 바랍니다.");
					}
				},
				error : function(e){
					g360.error_alert();
				}
			})
		}
		
		if (isAccess == "T"){
			return true;
		}else{
			return false;
		}
	},
	
	"history_record_rental" : function(before){

		try{
			if (g360.history == false){
				var stateObj = {before : before};
				history.pushState(stateObj, "", location.href);
				history.pushState(stateObj, "", location.href);
			}
		}catch(e){}
		
	},
	
	// 배열 섞기
	"arrayShuffle" : function(a){
	    var j, x, i;
	    for (i = a.length - 1; i > 0; i--) {
	        j = Math.floor(Math.random() * (i + 1));
	        x = a[i];
	        a[i] = a[j];
	        a[j] = x;
	    }
	    return a;		
	},
	
	"error_alert" : function(){
		g360.gAlert("Error", g360.in_lang.Error_alert, "red", "left");
		
	},
	
	"body_scroll_show" : function(){
		//$("body").removeClass("hidden-scroll");
		this.showBodyScroll();
	},
	
	"body_scroll_hide" : function(){
		$("body").addClass("hidden-scroll");
	},
	
	
	"common_alert" : function(title, message, width){		
		// 호출 하는 방법
			if (typeof width == "undefined"){
				width = "300px";
			}
	
			$('<div title="' + title + '" style="width:400px">' + message + '</div>').dialog({
			      modal: true,
			      width : width,
				  show: {effect: "fade", duration: 500 },
				  hide: { effect: 'fade', duration: 400 },
			      buttons: {
			        Ok: function() {
			          $( this ).dialog( "close" );
			        }
			      }
			});		
		},
		
	
			
	"common_confirm" : function (title, message){
		//호출하는 방법
		//	$.when(kJS.common_confirm("Confirm", "999999999999999")).then(
		//  	function(status) {
		//    		if (status == "Yes") {
		//    		}
		//  	}
		//	);	
		
		var def = $.Deferred();

		$('<div title="' + title + '">' + message + '</div>').dialog({
		    modal: true,
		    title: title,
		    resizable: false,
		    bgiframe: false,
		    show: {effect: "fade", duration: 500 },
		    hide: { effect: 'fade', duration: 400 },
		    buttons: {
		        Yes: function () {
		            $(this).dialog("close");
		            def.resolve("Yes");
		        },
		        No: function () {
		            $(this).dialog("close");
		            def.resolve("No");
		        }
		    }
		});
		return def.promise();
	},
	
	"validateEmail" : function(sEmail){
		
		var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
		if (filter.test(sEmail)) {
		return true;
		}
		else {
		return false;
		}
	},	
	
	"setCookie" : function(c_name, value, exdays){
		var exdate=new Date();

		exdate.setDate(exdate.getDate() + exdays);

		var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());

		document.cookie=c_name + "=" + c_value;
	},
	
	
	"getCookie" : function(c_name){
		var i,x,y,ARRcookies=document.cookie.split(";");

		for (i=0;i<ARRcookies.length;i++)

		{

		  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));

		  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);

		  x=x.replace(/^\s+|\s+$/g,"");

		  if (x==c_name)

			{

			return unescape(y);

			}

		  }
	},
	
	
	
	"iso_date_convert" : function(dx){
		var date = new Date(dx);
		var year = date.getFullYear();
		var month = date.getMonth()+1;
		var dt = date.getDate();

		if (dt < 10) {
		  dt = '0' + dt;
		}
		if (month < 10) {
		  month = '0' + month;
		}
		
		return year + "-" + month + "-" + dt ;

		
	},
	
	"comma" : function(num){
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	},
	
	
	"TextToHtml" : function(str){
		if (!str) return '';
		str = str.replace(/&lt;/gi,"<").replace(/&gt;/gi,">");
		str = str.replace(/&#40;/gi,"(").replace(/&#41;/gi,")");
		str = str.replace(/&\#39;/gi,"'");
		return str.replace(/(?:\r\n|\r|\n)/g, '<br />');
	},
	
	"TextToHtml_Body" : function(str){
		if (!str) return '';
		str = str.replace(/&lt;/gi,"<").replace(/&gt;/gi,">");
		str = str.replace(/&#40;/gi,"(").replace(/&#41;/gi,")");
		str = str.replace(/&\#39;/gi,"'");
		str = str.replace(/&nbsp;/gi," ");
		return str;
		/*str = str.replace(/ /gi,"&nbsp;");*/
		/*return str.replace(/(?:\r\n|\r|\n)/g, '<br />');*/
	},
	
	"textToHtml" : function(str){
		if (!str) return '';
		str = str.replace(/&lt;/gi,"<").replace(/&gt;/gi,">");
		str = str.replace(/&#40;/gi,"(").replace(/&#41;/gi,")");
		str = str.replace(/&\#39;/gi,"'");
		return str;
	},
	
	"textToHtml_Body" : function(str){
		if (!str) return '';
		//&lt; &gt;를 변환하면 html로 인식되므로 주석처리함
		//str = str.replace(/&lt;/gi,"<").replace(/&gt;/gi,">");
		str = str.replace(/&#40;/gi,"(").replace(/&#41;/gi,")");
		str = str.replace(/&\#39;/gi,"'");
		str = str.replace(/  /gi," &nbsp;");
		return str.replace(/(?:\r\n|\r|\n)/g, '<br />');
	},	
	
	"wrap_calendar" : function(id, targetid){
		$("#"+ id).datepicker(
				{
	                dateFormat: 'yy-mm-dd' //Input Display Format 변경
	                ,showOtherMonths: true //빈 공간에 현재월의 앞뒤월의 날짜를 표시
	                ,showMonthAfterYear:true //년도 먼저 나오고, 뒤에 월 표시
	                ,changeYear: true //콤보박스에서 년 선택 가능
	                ,changeMonth: true //콤보박스에서 월 선택 가능                
	            //   ,showOn: "both" //button:버튼을 표시하고,버튼을 눌러야만 달력 표시 ^ both:버튼을 표시하고,버튼을 누르거나 input을 클릭하면 달력 표시  
	            //    ,buttonImage: "http://jqueryui.com/resources/demos/datepicker/images/calendar.gif" //버튼 이미지 경로
	           //    ,buttonImageOnly: true //기본 버튼의 회색 부분을 없애고, 이미지만 보이게 함
	            //    ,buttonText: "선택" //버튼에 마우스 갖다 댔을 때 표시되는 텍스트                
	                ,yearSuffix: "년" //달력의 년도 부분 뒤에 붙는 텍스트
	                ,monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'] //달력의 월 부분 텍스트
	                ,monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'] //달력의 월 부분 Tooltip 텍스트
	                ,dayNamesMin: ['일','월','화','수','목','금','토'] //달력의 요일 부분 텍스트
	                ,dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'] //달력의 요일 부분 Tooltip 텍스트			
				,
				 onSelect: function( newText ){
		              $("#" + targetid).text("‘" + newText + "’");
		         }
	            }
	           
		)
	},
	
	
	"setWon" : function(pWon){
		 var won  = (pWon+"").replace(/,/g, "");
		    var arrWon  = ["원", "만원", "억", "조", "경", "해", "자", "양", "구", "간", "정"];
		    var changeWon = "";
		    var pattern = /(-?[0-9]+)([0-9]{4})/;
		    while(pattern.test(won)) {                   
		        won = won.replace(pattern,"$1,$2");
		    }
		    var arrCnt = won.split(",").length-1;
		    for(var ii=0; ii<won.split(",").length; ii++) {
		        if(arrWon[arrCnt] == undefined) {
		            g360.gAlert("Error", "값의 수가 너무 큽니다." , "red", "left");
		            break;
		        }
		  var tmpwon=0;
		  for(i=0;i<won.split(",")[ii].length;i++){
		   var num1 = won.split(",")[ii].substring(i,i+1);
		   tmpwon = tmpwon+Number(num1);
		  }
		  if(tmpwon > 0){
		    changeWon += won.split(",")[ii]+arrWon[arrCnt]; //55억0000만0000원 이런 형태 방지 0000 다 짤라 버린다
		  }
		        arrCnt--;
		    }
		 return changeWon;
	},
			
		
	"dateDiff3" : function(check_in, check_out){
	    var firstDate = new Date(check_in.replace('-' , '/'));
	    var secondDate = new Date(check_out.replace('-' , '/'));    
	    var diffDays = Math.abs((firstDate.getTime() - secondDate.getTime()) / 86400000);
	    return diffDays;
	},
	
		
	"dateDiff" : function(_date1, _date2){
		
	    var diffDate_1 = _date1 instanceof Date ? _date1 : new Date(_date1);
	    var diffDate_2 = _date2 instanceof Date ? _date2 : new Date(_date2);
	 
	    diffDate_1 = new Date(diffDate_1.getFullYear(), diffDate_1.getMonth()+1, diffDate_1.getDate());
	    diffDate_2 = new Date(diffDate_2.getFullYear(), diffDate_2.getMonth()+1, diffDate_2.getDate());
	 
	    var diff = Math.abs(diffDate_2.getTime() - diffDate_1.getTime());
	    diff = Math.ceil(diff / (1000 * 3600 * 24));
	 
	    return diff;
	},
				
	"filedownload" : function(){

		var mod = g360.filedownload_mod;
		var email = g360.filedownload_email;
		var filename = g360.filedownload_filename;
		filename = encodeURIComponent(filename);
		
		var url = g360.root_path + "/DownloadFile?mod="+mod+"&file="+filename+"&email="+email;
		location.href = url;
	},
	
	"preview_img" : function(filename, email, mod){
		
		
		$("#image_title").text("Image Viewer");
		
		g360.body_scroll_hide();
		var url = "";
		if (filename.substring(0,3) == "ai_"){
			//AI페인터로 요청한 경우
			filename = filename.substring(3, filename.length);
			url = "/artimage/" + email + "/artRequest_AI/result/"+filename+"_out.jpg";
		}else{
			url = "/artimage/" + email + "/"+mod+"/" + filename;
		}
		
		
	//	var url = "/artimage/" + email + "/"+mod+"/" + filename;
		
		$("#popup_file_download").show();
		g360.filedownload_mod = mod;
		g360.filedownload_email = email;
		g360.filedownload_filename = filename;
		
		$("#preview_image_src").attr("src",url);
		$("#preview_image_src").css("max-height", "750px");
		
	//	g360.body_scroll_hide();
		$("#image_preview").show();			
		////////////////////////////////////////////////////////////////////
		$("#image_preview").popup({
			onclose: function(){		
				g360.body_scroll_show();
			}
		});
		
		var inx = g360.maxZindex();
		$("#image_preview").css("z-index", parseInt(inx) + 1);
		
		$("#image_preview").popup('show');		
		$('#image_preview').position({
		    of: $(window)
		});
		
		
		
	},
	
	"preview_img_direct" : function(url, email, mod){
		
		$("#popup_file_download2").show();
		
		g360.history_record("preview_img_close");g360.history_record("preview_img_close");
		
		//이미지 URL을 직접 넘겨서 표시한다.
		$("#image_title").text("Image Viewer");
		
		g360.body_scroll_hide();
					
		g360.filedownload_mod = mod;
		g360.filedownload_email = email;
		
		$("#popup_file_download").hide();
		$("#preview_image_src").attr("src",url);
		$("#preview_image_src").css("max-height", "750px");
		
	//	g360.body_scroll_hide();
		//$("#image_preview").show();			
		////////////////////////////////////////////////////////////////////
		$("#image_preview").popup({
			onclose: function(){			
				g360.body_scroll_show();
			}
		});
		
		
		var inx = g360.maxZindex();
		$("#image_preview").css("z-index", parseInt(inx) + 1);
		
		
		$("#image_preview").popup('show');		
		/*
		$('#image_preview').position({
		    of: $(window)
		});
		*/
	},
	
	
	
	"preview_img_direct2" : function(url, email, filekey){
		$("#popup_file_download2").show();
		
		g360.history_record("popup_file_close");g360.history_record("popup_file_close");
		
		//이미지 URL을 직접 넘겨서 표시한다.
		$("#image_title2").text("Image Viewer");
					
		g360.filedownload_url = url;
		g360.filedownload_email = email;
		g360.filedownload_filekey = filekey;
		
		g360.body_scroll_hide();
		
		// 이미지 깜빡임 해결
		var $el = $('#image_preview2');
		$('#preview_image_src2').remove();
		
		var $img = $('<img id="preview_image_src2">');
		$img.attr("src",url);
	//	$img.css("max-height", "750px");
		$img.css("max-height", "95%");
		
		var url2 = url.replace("_water.png",".jpg");
		$img.attr("onerror", "g360.no_image_url('"+url2+"', this)");
		
		$el.find('.img_content').append($img);
		
		var mz = g360.maxZindex();
		$('#image_preview2_background').css('z-index', mz + 1);
		$('#image_preview2_wrapper').css('z-index', mz + 2);
		
		
	//	g360.body_scroll_hide();
		//$("#image_preview2").show();			
		////////////////////////////////////////////////////////////////////
		$("#image_preview2").popup({
			onclose: function(){	
				g360.body_scroll_show();
			}
		});
		
		var inx = g360.maxZindex();
		$("#image_preview2").css("z-index", parseInt(inx) + 1);
		
		$("#image_preview2").popup('show');
		/*
		$('#image_preview2').position({
		    of: $(window)
		});
		*/
		
		
		
	},
	
	
	
	
	"loadingbar_open" : function(msg){
		
		// 이미 띄워져있는 상태면 텍스트만 변경 처리
		if ($('#loadingbar').is(':visible')) {
			if (msg) {
				$("#loading_message").text(msg);
				return;
			}
		}
		
		var mz = this.maxZindex();
		
		
		
		
		$("#loading_message").text(msg);
		$("#loadingbar").show();			
		$("#loadingbar").popup({
			onclose: function(){					
			},
			blur: false,
			escape: false,
			opacity : 0.83
		});
			
		
		$("#loadingbar").popup('show');		
		$("#loadingbar").position({
		    of: $(window)
		});

		$('#loadingbar_background').css('z-index', ++mz);
		$('#loadingbar_wrapper').css('z-index', ++mz);
		
		$('#loadingbar').css({'display':'flex', 'height':'100vh' , 'width':'100vw' , 'align-items':'center' , 'justify-content':'center'});
		$("#loadingbar_wrapper").css({'overflow':'hidden'});
		//$('#loadingbar_background').css('opacity',0.9);
	},
	
	"loadingbar_close" : function(){
		$("#loadingbar").hide();		
		$("#loadingbar").popup('hide');
	},
	
	
	
	"layer_popup_hide" : function(){
		$("#image_preview").popup('hide');
	},
	
	"preview_img_request" : function(filename, email){
		$("#image_title").text(filename);
		var url = "/artimage/" + email + "/artRequest/" + filename;
		
		g360.filedownload_mod = "artRequest";
		g360.filedownload_email = email;
		g360.filedownload_filename = filename;
		
		$("#preview_image_src").attr("src",url);
		
		g360.body_scroll_hide();
		$("#image_preview").show();
	},
	
	
	"file_size_setting" : function(fileSize){
	
		var fixed = true;		
	    var str

	    //MB 단위 이상일때 MB 단위로 환산
	    if (fileSize >= 1024 * 1024 * 1024) {
	        fileSize = fileSize / (1024 * 1024 * 1024);
	        fileSize = (fixed === undefined) ? fileSize : fileSize.toFixed(fixed);
	        str = g360.numberComma(fileSize) + ' G';
	        
	    }else if (fileSize >= 1024 * 1024) {
	        fileSize = fileSize / (1024 * 1024);
	        fileSize = (fixed === undefined) ? fileSize : fileSize.toFixed(fixed);
	        str = g360.numberComma(fileSize) + ' MB';
	    }
	    //KB 단위 이상일때 KB 단위로 환산
	    else if (fileSize >= 1024) {
	        fileSize = fileSize / 1024;
	        fileSize = (fixed === undefined) ? fileSize : fileSize.toFixed(fixed);
	        str = g360.numberComma(fileSize) + ' KB';
	    }
	    //KB 단위보다 작을때 byte 단위로 환산
	    else {
	        fileSize = (fixed === undefined) ? fileSize : fileSize.toFixed(fixed);
	        str = g360.numberComma(fileSize) + ' byte';
	    }
	    return str;

		
		
	},
	
	
	"numberComma" : function(x) {
		return (x == null || isNaN(x)) ? '' : x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	},
	
	
	"open_search_address" : function(){
		var _url = g360.root_path + "/service/addSearch.jsp";
		g360.open_subwin(_url , '800', '600', 'yes', '', 'yes')
	},
	
	"user_photo_url" : function(email){
	//	var url = "/artimage/" + email + "/photo/" + filename;
		
		var url = this.domain + "/artimage/" + email + "/photo/" + email;			
		
		return url;
	},
	
	
	// 작가 리스트, 메인에서 뿌려줌
	"user_photo_gray_url" : function(email){
		//if (typeof(email) != "undefined"){
			var url = this.domain + "/artimage/" + email + "/photo_list/" + email + "_gray.jpg";
			return url;
		//}else{
		//	return "";
		//}
		
	},
	
	"user_photo_url_none" : function(gubun){
		var url = "";
		
		if (!gubun) gubun = g360.UserInfo.gubun;
		
		if (gubun == "normal"){
			url = this.domain + "/img/member/avatar-non-profile.svg";
		}else if (gubun == "curator" || gubun == "rental"){
			url = this.domain + "/img/member/avatar-non-profile-curater.svg";
		}else if (gubun == "art"){
			url = this.domain + "/img/member/avatar-non-profile-artist.svg";
		}			
		return url;
	},
	
	// 작품상세에서 뿌려줌
	"user_photo_color_url" : function(email){
		var url = this.domain + "/artimage/" + email + "/photo_list/" + email;
		return url;		
	},
	
	"user_photo_thum_url" : function(email){
		var url = this.domain + "/artimage/" + email + "/photo/" + email;
		return url;		
	},
	
	// 작가 리스트, 메인에서 뿌려줌
	"user_photo_gray_url" : function(email){
		//if (typeof(email) != "undefined"){
			var url = this.domain + "/artimage/" + email + "/photo_list/" + email + "_gray.jpg";
			return url;
		//}else{
		//	return "";
		//}
		
	},
	
	"user_photo_profile_url" : function(email){
		var url = this.domain + "/artimage/" + email + "/photo_profile/" + email;
		return url;		
	},
	
	// 작가 상세에서 뿌려줌
	"user_photo_profile_gray_url" : function(email){
		//if (typeof(email) != "undefined"){
			var url = this.domain + "/artimage/" + email + "/photo_profile/" + email + "_gray.jpg";
			return url;
		//}else{
		//	return "";
		//}
		
	},
	
	"date_term" : function(dat, disdate){
		var old = new Date (dat);
		var now = new Date();			
		var gap = now.getTime() - old.getTime();
		var min_gap = gap / 1000 /60;
		
		if (min_gap < 0){
			min_gap = 0;
		}

		if (parseInt(min_gap) > 60){
			var hour_gap = gap / 1000 /60 / 60;

			if (parseInt(hour_gap) > 60){
				return g360.iso_date_convert(dat);
			}else{
				return parseInt(hour_gap) + ""  + "시간전";
			}
			
		}else{
			return parseInt(min_gap) + ""  + "분전";
		}
	}, 
	
	
	"user_photo_url_none_draw" : function(image){
	//	debugger;
		var gubun = g360.UserInfo.gubun;
		
		var url = "";
		if (gubun == "normal"){
			url = this.domain + "/img/member/avatar-non-profile.svg";
		}else if (gubun == "curator" || gubun == "rental"){
			url = this.domain + "/img/member/avatar-non-profile-curater.svg";
		}else if (gubun == "art"){
			url = this.domain + "/img/member/avatar-non-profile-artist.svg";
		}			

		if (image) {
			image.onerror = "";
			image.src = g360.root_path +  url;
		}
		
		return true;
	},
	
	
	"no_photo_draw" : function(image){
		//   onerror=\"g360.no_photo_draw(this)\"  <== 이미지 소스 다음에 이 소스를 추가한다.
		image.onerror = "";
		image.src = g360.root_path + "/img/noperson.png";
		return true;
	},
	
	
	"no_photo_draw2" : function(image){
		//해상도가 높은 이미지 없음 파일을 사용한다....
		//   onerror=\"g360.no_photo_draw(this)\"  <== 이미지 소스 다음에 이 소스를 추가한다.
		image.onerror = "";
		image.src = g360.root_path + "/img/noperson.png";
		return true;
	},
	
	"no_image_url" : function(url, image){
		image.onerror = "";
		image.src = url;
		return true;
	},
	
	"open_subwin" : function(url, width, height, scrollbars, win_name, resizable){
		var opt_scrollbars = (scrollbars == null)?"yes":scrollbars;
		var opt_resizable = (resizable == null)?"yes":resizable;
		var window_name = (win_name == null)?"subwin":win_name;
		//var winFeature = set_center(width, height) + ",menubar=no,resizable=no ,scrollbars="+opt_scrollbars;
		var winFeature = g360.set_center(width, height) + ",menubar=no,resizable="+opt_resizable+",scrollbars="+opt_scrollbars;
		var subwin = window.open(url, window_name, winFeature);
		return subwin;
	},
	
	"set_center" : function(win_width, win_height){
		winx = Math.ceil((screen.availWidth - win_width) / 2);
		winy = Math.ceil((screen.availHeight - win_height) / 2);
		return "left=" + winx + ",top=" + winy + ",width=" + win_width + ",height=" + win_height;
	},
	

	"preview_artproject_img_path" : function(email, dockey){
		var url = this.domain + "/artimage/" + email + "/artproject/preview/" + dockey + ".jpg";
		return url;
	},
	
	
	"myspace_img_path" : function(email, filename){
		return '/artimage/' + email + '/myspace/mobile/' + filename + '.jpg';
	},
	
	"myspace_thumbnail_img_path" : function(email, filename){
		return '/artimage/' + email + '/myspace/thumbnail/' + filename + '.jpg';
	},

	
	"thumbnail_img_path" : function(email, dockey){
		var url = this.domain + "/artimage/" + email + "/art/thumbnail/" + dockey + ".jpg";
		return url;
	},
	
	"preview_img_path" : function(email, dockey, version){
		var ver = (isNaN(version) ? new Date().getTime() : version);
		var url = this.domain + "/artimage/" + email + "/art/preview/" + dockey + ".jpg?open&ver="+ver;
		return url;
	},
	
	// 공간에 걸어 제안하기 할 때 참조함 (테스트용)
	"preview_img_path2" : function(email, dockey){
		
		var url = "/artimage/" + email + "/art/preview/" + dockey + ".jpg";
		return url;
	},
	
	"portfolio_path" : function(email, filekey){
		var url = this.domain + "/book/dbook.jsp?key=/artimage/" + email + "/art_portfolio/" + filekey;
		return url;
	},
	
	"dbook_path" : function(email, filekey){
		var url = this.domain + "/book/dbook.jsp?key=/artimage/" + email + "/dbook/" + filekey;
		return url;
	},
	
	"audio_path" : function(email, filekey){
		var url = this.domain + "/artimage/" + email + "/art_mp3/" + filekey;
		return url;
	},
	
	"video_path" : function(email, filekey){
		var url = this.domain + "/artimage/" + email + "/art_mp4/" + filekey;
		return url;
	},
	
	
	"mobile_img_path" : function(email, dockey){
		var url = this.domain + "/artimage/" + email + "/art/mobile/" + dockey + ".jpg";
		return url;
	},
	
	"art_img_path" : function(email, dockey){
		var url = this.domain + "/artimage/" + email + "/art/" + dockey;
		return url;
	},
	
	"art_img_thumbnail_path" : function(email, dockey){
		var url = this.domain + "/artimage/" + email + "/art/thumbnail/" + dockey + ".jpg";
		return url;
	},
	
	"art_expand_img_path" : function(email, dockey){
		var url = this.domain + "/artimage/" + email + "/art/expand/" + dockey + '.jpg';
		return url;
	},
	
	"vr_img_path" : function(templatecode, key){
		
		var url = this.domain + "/vr/vr_data_"+templatecode+"/"+key+"/pano_f.jpg";
		//var url = this.domain + "/vr/vr/vrgallery/"
		
		return url;
	},
	

	"vr_img_path_new" : function(key){	
				
		var email = g360.check_email(key);
		var url = this.domain + "/vr/vr/vrgallery/" + email + "/" + key + "/pano_f.jpg";
		
		return url;
	},
	
	"check_email" : function(key){
		var email = "";
		var spl = key.split("@");
		var ssp = spl[0].indexOf("_");
		var spx = key.split("_");
		if (ssp > -1){
			email = spx[0] + "_" + spx[1];
		}else{
			email = spx[0];
		}
		return email;
	},
	
	
	
	"showVideo" : function(video_src){
		var mz = this.maxZindex();
		var $video = $('#video_layer');
		$('#video_header').addClass('active').css('z-index', ++mz);
		$video.find('.youtube_wrapper').hide();
		$video.css('z-index', ++mz).show();
		$video.find('video').attr('src', video_src);
		$video.find('video').show();
		$video.find('video')[0].play();
		
		$('#video_header').off('click').on('click', function(){
			$video.find('video').attr('src', '');
			$video.hide();
			$('#video_header').removeClass('active');
		});
	},
	
	"showYoutube" : function(src){
		var mz = this.maxZindex();
		$('#video_header').addClass('active').css('z-index', ++mz);
		$('#video_layer').find('.youtube_wrapper').show();
		$('#video_layer').find('video').hide();
		$('#video_layer').css('z-index', ++mz).show();
		$('#video_layer').find('iframe').attr('src', src);
		
		$('#video_header').off('click').on('click', function(){
			$('#video_layer').find('iframe').attr('src', 'about:blank');
			$('#video_layer').hide();
			$('#video_header').removeClass('active');
		});
	},
	
	
	
	
	// html Escape처리
	"escapeHTML" : function(str) {
		return $('<div/>').text(str).html().replace(/\n|\r\n/g, '<br>');
	},
	// 전체 레이어가 열려있는지 체크함
	"hideFullBodyScroll" : function() {
		if ($('.full-popup-title').hasClass('active')) return;
		$('body').removeClass('full-popup-open');
	},
	
	"showBodyScroll" : function() {
		var $rec_popup = $('#detail_rec_popup');
		var $full_popup = $('#detail_full_popup');
		var $popup = $('#detail_popup');
		
		if ($('.full-popup-title').hasClass('active')) return;
		// 팝업이 없을 때만 Body 스크롤을 표시 
		if (!$rec_popup.hasClass('pushmenu-open') && !$full_popup.hasClass('pushmenu-open') && !$popup.hasClass('pushmenu-open')) {
			$("body").removeClass("hidden-scroll");
		}
	},
	
	"makeRandom" : function(length){
		return Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length-1) - 1));
	},
	
		
	
	"maxZindex" : function(){
		var zIndexMax = 0;
		$("header, div, li").each(function(){
			if (!$(this).is(':visible')) return true;
			if ($(this).hasClass('jconfirm')) return true;	// 최상위 레이어 컨펌창 예외처리
			var z = parseInt($(this).css("z-index"));
			if (z > zIndexMax) zIndexMax = z;
		});
		return parseInt(zIndexMax);
	},
	
	"removeComma" : function(str){
		return str.replace(/\,/gi, "");
	},
	
	
	"history_record" : function(before){
		
		//if (g360.save_history){
		//	g360.save_history_now(before);
		//}
		
		try{

			if (g360.history == false){
				var stateObj = {before : before};
			//	history.pushState(stateObj, "", "/");
				history.pushState(stateObj, "", location.href);
			}
			
		}catch(e){}
		
	},
	
	
	"save_history_now" : function(opt){
		var url = location.protocol  + '//' + location.host + "/history_save.mon?key=" + opt;
		$.ajax({
			type : "GET",
			dataType : "text",
			contentType : "application/json; charset=utf-8",
			url : url,
			success : function(res){
				
			},
			error : function(e){
				
			}
		})
	},
	
	
	"isMobile": function(){
		var md=new MobileDetect(window.navigator.userAgent);
		return md.mobile();
	},
	
	"showToastMsg":function(msg, m_sec){
		var _self = this;
		
		var $msg = $('.toast-msg-wrapper');
		
		// 기존에 떠 있는 경우 삭제처리
		if ($msg.length) $msg.remove();
		
		$msg = $('<div class="toast-msg-wrapper"></div>');
		$msg.text(msg).css({
			'z-index': _self.maxZindex() + 1,
			'top': 'unset',
			'bottom': '10%'
		});
		$('body').append($msg);
		
		$msg.fadeIn();
		setTimeout(function(){
			$msg.fadeOut();
		}, (m_sec||2000));
	},
	
	"newAlert_focus": function(info, id){
	
		$(".sm_md_bd").text(info);
		$(".s-cancel").hide();
		$(".sm_md").click();
		
		if (id != "" && typeof(id) != "undefined"){
			$("#" + id).focus();
		}
	},
	
	"searchContentDel" : function(search){
		if(search!=""){
			$(".contents_del").show();						
		}else{
			$(".contents_del").hide();	
		}
	},
	
	"newAlert" : function(info){

//		> index.jsp의 body_content 아래에 넣어둠
//		
//		if($(".modal-size-sm>.sm_md").length){
//			
//		}else{
//			
//			var html = `<div class="modal-size-sm d-inline-block">
//			                <!-- Button trigger modal -->
//			                <button type="button" class="btn btn-outline-primary sm_md" data-toggle="modal" data-target="#small">
//			                    Small Modal
//			                </button>
//			                <!-- Modal -->
//			                <div class="modal fade text-left newAlertmodal" id="small" tabindex="-1" role="dialog" aria-labelledby="myModalLabel19" aria-hidden="true">
//			                    <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
//			                        <div class="modal-content">
//			                            <div class="modal-header">
//			                                <h4 class="modal-title" id="myModalLabel19"></h4>
//			                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
//			                                    <span aria-hidden="true">&times;</span>
//			                                </button>
//			                            </div>
//			                            <div class="modal-body sm_md_bd" style="text-align: center; margin: 30px 10px;">
//			                           		
//			                            </div>
//			                            <div class="modal-footer">
//			                                <button type="button" class="btn btn-primary" data-dismiss="modal" style="font-weight: bold;">확인</button>
//			                            </div>
//			                        </div>
//			                    </div>
//			                </div>
//			            </div>`;
//			
//			$(html).appendTo('body');
//			
//		}
		
		$(".sm_md_bd").text(info);
		$(".s-cancel").hide();
		$(".sm_md").click();
		
		
	},
	
	"confirmAlert" : function(info){
		$(".sm_md_bd").text(info);
		$(".s-cancel").show();
		$(".sm_md").click();
		
	},
//	
//	"gAlert" : function(title, content, type, animation, callback){
//		
//		type = "default";
//		title = " ";
//		animation = "top";
//		$.alert({
//			title : title,
//			content : content + "<hr>",
//			type : type,
//			closeIcon : true,
//			closeIconClass : "fa fa-close",
//			columnClass : "small",
//			backgroundDismiss: true,
//			animation : animation,
//			animateFromElement : false,
//			escapeKey : true,
//			animationBounce : 2,
//			buttons : {
//				OK : {
//					keys: ['enter'],
//					text : "확인",		
//					btnClass : "btn-"+type,
//					action : function(){
//						if (callback) callback();
//					}
//				}				
//			}
//		});
//	},
//	
//	"gAlert_focus" : function(title, content, type, animation, id){
//		
//		type = "default";
//		title = " ";
//		animation = "top";
//		$.alert({
//			title : title,
//			content : content + "<hr>",
//			type : type,
//			closeIcon : true,
//			closeIconClass : "fa fa-close",
//			columnClass : "small",
//			backgroundDismiss: true,
//			animation : animation,
//			animateFromElement : false,
//			escapeKey : true,
//			animationBounce : 2,
//			buttons : {
//				OK : {
//					keys: ['enter'],
//					text : "확인",		
//					btnClass : "btn-"+type,
//					action : function(){
//						
//					}
//				}				
//			},
//			onDestroy: function () {
//				if (id != "" && typeof(id) != "undefined"){
//					$("#" + id).focus();
//				}
//				
//		    },
//		});
//	},
//	
	
	"gAlert" : function(title, content, type, animation, callback){
		var title1 = "";
		if(type=="title_OK"){title1 = title;}
		
		Swal.fire({
			title : title1,
            html: content,
            customClass: {
                confirmButton: "btn btn-primary"
            },
            showClass: {
            	//ext-component-sweet-alerts.js 참고
            	popup: 'animate__animated animate__fadeIn'
              },
            buttonsStyling: !1
        }).then(function(result){
    		if (typeof(callback) == 'function') {
    			callback();
    		}        	
        });
		
	},
	
	"gAlert_focus" : function(title, content, type, animation, id){
		
		Swal.fire({
            text: content,
            customClass: {
                confirmButton: "btn btn-primary"
            },
            showClass: {
            	//ext-component-sweet-alerts.js 참고
            	popup: 'animate__animated animate__fadeIn'
              },
            onDestroy: function () {
    			if (id != "" && typeof(id) != "undefined"){
    				$("#" + id).focus();
    			}
    	    },
            buttonsStyling: !1
        })
		
	},
	
	
	
	
	"gAlert_Viewxy" : function(){
		
		Swal.fire({
            //title: "이름(활동명)은 반드시 입력하셔야 합니다.",
            text: "That thing is still around?",
            customClass: {
                confirmButton: "btn btn-primary"
            },
            buttonsStyling: !1
        })
		
	},
	
	"goURL"  : function(url){
		window.open(url, "",null);
	},
	
	"copyToClipboard" : function(val){
		
		var textarea = document.createElement('textarea');
		textarea.value = val;

		document.body.appendChild(textarea);
		textarea.select();
		textarea.setSelectionRange(0, 9999);  // IOS에서는 Range를 설정해야 복사가 됨
		
		document.execCommand('copy');
		document.body.removeChild(textarea);
		
		/*
		var a = val.includes("group_list.jsp");
		var txt = (this.lang == 'ko' ? '링크 URL이 복사되었습니다.' : 'Link URL copied.');
		if(a){
			alert(txt);
		}else{
			g360.gAlert("",txt,"","","");
		}
		*/
		
		var txt = (this.lang == 'ko' ? '링크 URL이 복사되었습니다.' : 'Link URL copied.');
		//g360.gAlert("",txt,"","","");
		this.showToastMsg(txt);
		
	},
	
	"popup_VR_rental" : function(title, key, templatecode, bgmusic , m){
		//모바일일때 클릭막기
		if(m){
			return false;
		}
		//console.log(title,key,templatecode,bgmusic);
		g360.bgmusic = bgmusic;
		
		g360.isPopupVROpen = "T";
		
		//도슨트 파일 음성 값을 초기화 시킨다.	
		g360.history_record("vr_show_close");g360.history_record("vr_show_close");
		
		g360.sound_path = ""
		//조회수를 1 올린다.
		g360.add_read_count(key);
		
		g360.body_scroll_hide();
		g360.scroll_Top();
		
		try{
			gVrGallery.scrollTop = $(document).scrollTop();
		}catch(e){}			
		
		//console.log(g360.root_path + "/JSP/in/gallery360_popup.jsp?key=" + key);
		var url = g360.root_path + "/JSP/in/gallery360_popup.jsp?key=" + key;
		
		g360.LoadPage("vr_show", url);    //index.jsp파일에 레이어가 존재해서 어디서도 같이 사용 할 수 있다.

		var inx = g360.maxZindex();
		//console.log(inx);
		$("#vr_popup").css("z-index", parseInt(inx) + 1);
		$("#vrgallery_popup_title").html(title);
		$("#vr_popup").show();
		$("#vr_popup").fadeIn();
		
	},
	//1
	"zip_code_popup" : function(){
		g360.fa_id = "";
			
		g360.body_scroll_hide();
		
		$("#zip_code_search").popup({
			blur: false,
			onclose: function(){
				g360.body_scroll_show();
			},
			position: {my:'center', at:'center', of:window}
		});
		$("#zip_code_search").popup('show');
	},
	
	"close_popup" : function(id){
		if (id == 'aipainter_start') {
			$('#aipainter_start').popup('hide');
			return;
		}
		
		$(".img_content div").remove();
		
		var $el = $("#" + id);
		$el.popup('hide');
		
		// 파일 미리 보기인 경우 이미지 경로 초기화..
		if (id == 'image_preview'|| id == 'image_preview2') {
			$el.find('.img_content img').attr('src', '');
		}
	},
	//2
	"zip_code_popup2" : function(first_address){
		g360.fa_id = first_address;
		
				
		var inx = g360.maxZindex();
		
		
		$("#zip_code_search").show();						
		$("#zip_code_search").popup({
			onclose: function(){					
			}
		});
		
		
		
		$("#zip_code_search_background").css("z-index", parseInt(inx) + 5)
		$("#zip_code_search_wrapper").css("z-index", parseInt(inx) + 10)
		$("#zip_code_search").css("z-index", parseInt(inx) + 20);
		
		$("#zip_code_search").popup('show');		
		$('#zip_code_search').position({
		    of: $(window)
		});
	},
	
	"close_popup2" : function(id){
	
	//	$("#preview_image_src2").attr("src", "");
	//	g360.body_scroll_show();			
		$("#"+id).popup('hide');
		$("#" + id).fadeOut(1000);
	},
	
	
	
	"zipcode_search" :function(){
		g360.getAddr(1);
		return false;
	},
	
	
	"getAddr" : function(cPage){
		// AJAX 주소 검색 요청
		var query = $("input[name=zipsearchname]").val();
		
		g360.cPage = cPage;
		g360.perpage = 5;
		
		var start = (parseInt(g360.perpage) * (parseInt(g360.cPage))) - (parseInt(g360.perpage) - 1);
		start = parseInt(start) -1 ;		
		var perpage = g360.perpage;
	
		//console.log( g360.root_path + "/addressapi.gu?keyword="+encodeURIComponent(query)+"&currentPage="+cPage+"&countPerPage="+g360.perpage);
		$.ajax({
			url: g360.root_path + "/addressapi.gu?keyword="+encodeURIComponent(query)+"&currentPage="+cPage+"&countPerPage=5"	// 주소검색 OPEN API URL
			,type:"get"
			,dataType:"json"											// 크로스도메인으로 인한 jsonp 이용, 검색결과형식 JSON 
			,contentType : "application/json, charset=utf-8"
			,success:function(jsonStr){									// jsonStr : 주소 검색 결과 JSON 데이터	
			
				
				
				$("#list").html("");									// 결과 출력 영역 초기화
				var errCode = jsonStr.results.common.errorCode;
				var errDesc = jsonStr.results.common.errorMessage;
				if(errCode != "0"){ 
					g360.gAlert("Error",errCode+"="+errDesc, "red", "left");
				}else{
					if(jsonStr!= null){
						//debugger;
						g360.makeListjson(jsonStr);							// 결과 JSON 데이터 파싱 및 출력
					}
				}
			}
			,error: function(xhr,status, error){
														// AJAX 호출 에러
				g360.gAlert("Error","에러발생", "red", "left");
			}
		});
	},
	
	"makeListjson" : function(jsonStr){
		var htmlStr = "";
		
		var totalcount = jsonStr.results.common.totalCount;
		g360.totalcount = totalcount;
		
		var spl = jsonStr.results.juso;
	
//				htmlStr += "총건수 : " + totalcount;
//				htmlStr += "<br>=====================================";
//				htmlStr += "<table>";
		
		htmlStr += "<ul>";
		for (var i = 0 ; i < spl.length; i++){
			var juso = spl[i];
		
			htmlStr += "<li onclick=\"g360.ok('"+juso.jibunAddr+"')\">";
			htmlStr += "	<span>"+juso.zipNo+" <!--<em>(110-825)</em>--></span>";
			htmlStr += "	<dl>";
			htmlStr += "		<dt>도로명</dt>";
			htmlStr += "		<dd>"+juso.roadAddr+"</dd>";
			htmlStr += "	</dl>";
			htmlStr += "	<dl>";
			htmlStr += "		<dt>지번</dt>";
			htmlStr += "		<dd>"+juso.jibunAddr+"</dd>";
			htmlStr += "	</dl>";
			htmlStr += "</li>";
		
		//	htmlStr += "<tr><td style='cursor:pointer' onclick=\"aSearch.ok('"+juso.jibunAddr+"')\">" + juso.jibunAddr + "</td></tr>";
		}
		htmlStr += "</ul>";
		// 결과 HTML을 FORM의 결과 출력 DIV에 삽입
		$("#zip_code_result").html(htmlStr);
		
		g360.search_paging(g360.cPage);
		
		
	},
	
	"ok" : function(str){
		
		//console.log(g360.fa_id);
		
		if (g360.fa_id == ""){
			$("#user_address1").val(str);
		}else{
			$("#"+g360.fa_id).val(str);
		}
		
		g360.close_popup('zip_code_search');
	},
	
/////////////////////////// 리스트 페이징 시작 //////////////////////////////////////////////////////////////
	"search_paging" : function(page){
		var alldocuments = g360.totalcount;
		if (alldocuments % g360.perpage > 0 & alldocuments % g360.perpage < g360.perpage/2 ){
			allPage = Number(Math.round(alldocuments/g360.perpage)) + 1;
		}else{
			allPage = Number(Math.round(alldocuments/g360.perpage));
		}	

		g360.search_navigator(page);
	},
	
	"search_navigator" : function(page){
		var nav_cpage = page;

		var alldocuments = g360.totalcount;
		if (alldocuments == 0){
			alldocuments = 1;
			nav_cpage=1;
			allPage = 1;
	     	}

		if (alldocuments != 0) {
			if (allPage % 10 > 0 & allPage % 10 < 5 ) {
				var allFrame = Number(Math.round(allPage/10)) + 1;
			}else{
				var allFrame = Number(Math.round(allPage/10))	;
			}

			if (nav_cpage % 10 > 0 & nav_cpage % 10 < 5 ){
				var cFrame = Number(Math.round(nav_cpage/10)) + 1;
			}else{
				var cFrame = Number(Math.round(nav_cpage/10));
			}

			//console.log(cFrame);
			//console.log(allFrame);
			
			var nav = new Array();	
		
			if (cFrame == 1 ){
				nav[0] = '';
			}else{
				nav[0] = '<li class="p_prev"><a href="#" class="xico" onclick="javascript:g360.gotoPage(' + ((((cFrame-1)*10)-1)*g360.perpage+1) + ',' + ((cFrame-1)*10) + ');">&lt;</a></li>';
			}
			var pIndex = 1;
			var startPage = ((cFrame-1) * 10) + 1;	
			
			for (var i = startPage; i < startPage + 10; i++){
				if (i == nav_cpage){
					if (i == '1'){
						nav[pIndex] = '<li class="on"><a href="#">' + i + '</a></li>';
					}else{
						if (i%10 == '1' ){
							nav[pIndex] = '<li class="on"><a href="#">' + i + '</a></li>';
						}else{
							nav[pIndex] = '<li class="on"><a href="#">' + i + '</a></li>';
						}						
					}
				}else{
					if (i == '1'){
						nav[pIndex] = "<li><a href=# onclick='g360.gotoPage("+ (((i-1) * g360.perpage) + 1 ) + ", "+ i + ", this)'>" + i + "</a></li>";
						
					}else{
						if (i%10 == '1' ){
							nav[pIndex] = "<li><a href=# onclick='g360.gotoPage("+ (((i-1) * g360.perpage) + 1 ) + "," + i + ", this)'>" + i + "</a></li>";	
						}else{
							nav[pIndex] = "<li><a href=# onclick='g360.gotoPage("+ (((i-1) * g360.perpage) + 1 ) + "," + i + ", this)'>" + i + "</a></li>";
						}
					}
				}				

				if (i == allPage) {
					//nav[pIndex + 1] = '<td width="30" height="15" align="right"></td>';
					break;
				}
				pIndex++;				
			}
			
			if (cFrame < allFrame){
				nav[nav.length] = '<li class="p_next"><a href="#" class="xico" onclick="javascript:g360.gotoPage(' + ((cFrame*g360.perpage*10) + 1) + ',' + ((cFrame*10)+1) + ');">&gt;</a></li>';
			}
					
	          var navHTML = "";

			if (cFrame == 1 ){
				navHTML = '';
	          }else{
				navHTML = '<li class="p_first"><a href="#" class="xico" onclick="javascript:g360.gotoPage(1,1);">&lt;&lt;</a></li>';
	          }		    
			for( var i = 0 ; i < nav.length ; i++){	
	          	navHTML = navHTML + nav[i];
			}
					
			if (cFrame < allFrame){
				navHTML = navHTML + '<li class="p_last"><a href="#" class="xico" onclick="javascript:g360.gotoPage(' + ((allPage - 1)*g360.perpage + 1) +','+ allPage +')">&gt;&gt;</a></li>';
	        }else{
				navHTML = navHTML;
	        }
	    
			$("#zipcode_NAVIGATE").html('<div class="paging"><ul>' + navHTML + '</ul></div>');
		}
	},
	
	"gotoPage" : function(Index, PageNum, obj){
		var nav_cpage = PageNum;
		oldpage = nav_cpage;
		
		g360.getAddr(PageNum);
	},
	//////////////////////////////////////// 리스트 페이징 종료    /////////////////////////////////////////////

	"paswordcheck" : function(str){

		var pattern1 = /[0-9]/;		//숫자 포함 여부 판단
		var pattern2 = /[a-zA-Z]/;  //영문 포함 여부 판단
		var pattern3 = /[~!@#$%^&*()_+|<>?:{}]/;  //특수 문자 포함 여부 판단.
		
		if(!pattern1.test(str) || !pattern2.test(str) || !pattern3.test(str) || str.length < 8) { 
			g360.gAlert("Error", g360.in_lang.PW_SpecialCharacters , "red", "left");
			return false; 
		} else { 
			return true; 
		} 
	},
	
	"vr_popup_close" : function(){
		
		$(".account_wrap").css("width", "80%");
		$("#vr_popup").css("background-color", "black");
		g360.isPopupVROpen = "F";
		
		$("#vr_popup").fadeOut();
		
		//배경음악이 있을 경우 중지 시킨다.
		g360.offsound_bg();			
		//도슨트 음성이 있을 경우 중지 시킨다.
		g360.offsound();
		
		g360.body_scroll_show();
		
		//창을 닫을 때 기존에 표시된 VR갤러리 화면을 제거한다.
		$("#vr_show").empty();
		try{
			g360.scroll_position(gVrGallery.scrollTop);
		}catch(e){}
		
	},
	
	"offsound" : function(){
		
		if (typeof(__pano1) != "undefined"){
			__pano1.krpano1.call("stopsound("+g360.sound_path+")");
		}		
	},
	
	"offsound_bg" : function(){
		if (typeof(__pano1) != "undefined"){
			__pano1.krpano1.call("stopsound(bgsnd)");
		}		
	},
	
	"add_read_count" : function(key){
		var url = g360.root_path + "/vrgallery_read_count_add.mon?key="+key;
		$.ajax({
			type : "GET",
			datatype : "json",
			contentType : "application/json; charset=utf-8",
			url : url,
			success : function(data){
			
				if (data.result == "OK"){
					return false;
				}else{
					
				}
			},
			error : function(err){
				g360.gAlert("Error","조회수 추가시 오류가 발생하였습니다.", "red", "left");
			}
		})
	},
	
	
	"FullScreen_Open" : function(){
		
		var elem = document.documentElement;
		if (elem.requestFullscreen) {
		    elem.requestFullscreen();
		  } else if (elem.mozRequestFullScreen) { /* Firefox */
		    elem.mozRequestFullScreen();
		  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
		    elem.webkitRequestFullscreen();
		  } else if (elem.msRequestFullscreen) { /* IE/Edge */
		    elem.msRequestFullscreen();
		  }	
	},
	"FullScreen_Close" : function(){
		var elem = document.documentElement;
		 if (document.exitFullscreen) {
		    document.exitFullscreen();
		  } else if (document.mozCancelFullScreen) {
		    document.mozCancelFullScreen();
		  } else if (document.webkitExitFullscreen) {
		    document.webkitExitFullscreen();
		  } else if (document.msExitFullscreen) {
		    document.msExitFullscreen();
		  }
	},
	
	"showBlock" : function(){
		g360.body_scroll_hide();
		var inx = parseInt(g360.maxZindex()) + 1;
		$('#blockui').css("z-index", inx);
		$('#blockui').show();
    },
    
    "hideBlock": function(){
    	g360.body_scroll_show();
    	$('#blockui').hide();
    },
    
    "getCenterPosition" : function(p_width, p_height){
		var popupWidth = p_width;
		var popupHeight = p_height;

		var _left = (screen.availWidth - popupWidth) / 2;
		if( window.screenLeft < 0){
			_left += window.screen.width*-1;
		} else if ( window.screenLeft > window.screen.width ){
			_left += window.screen.width;
		}
		var _top = (screen.availHeight - popupHeight) / 2 - 10;
		
		return {top:_top, left: _left};
    }
	
}


window.onpopstate  = function(event){
	if (event.state != null){
		var returnPage = event.state.before;
		
		if (returnPage == "main"){
			//g360.goHome();
			$('#go_main').click();
		}else if (returnPage == 'vr_iframe'){
			_pano.krpano1.call('callwith(layer[close_freim_url_addhs], onclick)');
		}else{
			g360.history = true;
			$("#" + returnPage).click();
			g360.history = false;
		}
	}
	
};