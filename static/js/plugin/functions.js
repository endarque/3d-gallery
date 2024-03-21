/* ===================================
    About
====================================== */

/*---------------------------------------------------------------------
    Gallery360 Rental Service
    

 ----------------------------------------------------------------------*/

//PAGE LOADER
$(window).on("load", function () {
	"use strict";
});


(function($){
    "use strict";
    let $window = $(window);
    let body = $("body");
    let $root = $("html, body");
    

    /* ----- 스크롤 최상단으로 이동 ----- */
    /* 
    $(body).append('<a href="#" class="back-top"><i class="fa fa-angle-up"></i></a>');
    let amountScrolled = 700;
    let backBtn = $("a.back-top");
    $window.on("scroll", function () {
        if ($window.scrollTop() > amountScrolled) {
            backBtn.addClass("back-top-visible");
        } else {
            backBtn.removeClass("back-top-visible");
        }
    });
    backBtn.on("click", function () {
        $root.animate({
            scrollTop: 0
        }, 700);
        return false;
    });
    */
    
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
    
    $('body').on('contextmenu', function(){return false;});

        
    window.loadRentalInfo = function(sec_code){   	
    	var url = "/load_rental_info_all.mon?rr=" + vr_key + (sec_code ? '&sec=' + sec_code : '');
    	//rr : rental_roomkey
    	//ak : art_key <== 이값이 공백일 경우 대관 전체 데이터를 로딩하고 값이 있을 경우 해당 작품의 방명록 데이터만 가져온다.
    	$.ajax({
    		type : "GET",
    		dataType : "json",
    		contentType : "application/json; charset=utf-8",
    		url : url,
    		success : function(res){
    			if (res.result == 'sec exist') {
    				showSecLayer();
    				return;
    			} else if (res.result == 'sec error') {
    				wrongSecCode();
    				return;
    			} else {
    				hideSecLayer();
    			}
    			
    			var rental_type = res.info.rental_type;
    			if (!rental_type || rental_type == '') rental_type = '1';
    			
    			var url = g360.root_path + "/rental_text_check.mon?id="+rental_type+'_'+g360.lang;
    			$.ajax({
    				dataType : "json",
    				contentType : "application/json; charset=utf-8",
    				url : url,
    				async : false,
    				success : function(rental_txt){
    					g360.rental_text = rental_txt;
    					rentalInfoLoadComplete(res);
    				},
    				error : function(e){
    					alert('서비스에 문제가 발생했습니다.\n관리자에게 문의해 주세요.');
    				}
    			});
    			
    		},
    		error : function(e){
    			alert('서비스에 문제가 발생했습니다.\n관리자에게 문의해 주세요.');
    		}
    	});
    }    
	
	function rentalInfoLoadComplete(rental_info){
		
		window.rs = new RentalService(rental_info);
		
		// 로고 설정
		rs.setLogo();
		
		// 배경음악을 설정한다.
		g360.bgmusic = rental_info.bgmusic;
				
		// 타입별 폰트 설정
		rs.drawRentalText();
		
		// 투표하기 기능
		rs.setVoteMenu();
		
		// Others 그룹 셋팅
		rs.setGroupList();
		
		// VR 셋팅
		rs.setVR(2000);
		
		// 최상단 메인 설정
		rs.setMainSlide();
		
		// 전시회 정보
		rs.setExhibitionInfo();
		
		// 방문자 수 정보
		rs.setCounter();
		
		// 작품 리스트
		rs.setArtList();
		
		// 작가 리스트
		rs.setArtistList();
		
		// D-Book
		rs.setDbook();
		
		// 방명록
		rs.setVisitor();
		
		// Footer 정보
		rs.setFooter();
		

		rs.hideLoading();
	}
	
	// 대관정보 불러오기
	loadRentalInfo();
	
    /* ------- Smooth scroll (메뉴 스크롤 이동 처리) ------- */
    $("a.pagescroll").on("click", function (event) {
        event.preventDefault();      
        var action = $(this.hash).offset().top;
        if (this.hash == '#artist') {
        	//action+=48;
        } else {
        	action-=45;
        }
        $("html,body").animate({
            scrollTop: action
        }, 800);
    });


    /*------ 상단 메뉴 고정 ------*/
    let headerHeight = $("header").outerHeight();
    let navbar = $("nav.navbar");
    if (navbar.hasClass("static-nav")) {
        $window.scroll(function () {
            let $scroll = $window.scrollTop();
            if ($scroll > 250) {
                navbar.addClass("fixedmenu");
            } else {
                navbar.removeClass("fixedmenu");                
            }
        });
        if ($window.scrollTop() >= $(window).height()) {
        	navbar.addClass('fixedmenu');
        }        
    }


    /*--------------- 우측 상단메뉴 클릭 ---------------*/
    let sideMenuToggle = $("#sidemenu_toggle");
    let sideMenu = $(".side-menu");
    if (sideMenuToggle.length) {
        sideMenuToggle.on("click", function () {
            $("body").addClass("overflow-hidden");
            sideMenu.addClass("side-menu-active");
            $(function () {
                setTimeout(function () {
                    $("#close_side_menu").fadeIn(300);
                }, 300);
            });
        });
        $("#close_side_menu , #btn_sideNavClose , .side-nav .nav-link.pagescroll").on("click", function () {
            $("body").removeClass("overflow-hidden");
            sideMenu.removeClass("side-menu-active");
            $("#close_side_menu").fadeOut(200);
            $(function() {
                setTimeout(function() {
                    $('.sideNavPages').removeClass('show');
                    $('.fas').removeClass('rotate-180');
                }, 400);
            });
        });
        $(document).keyup(function(e) {
            if (e.keyCode === 27) { // escape key maps to keycode `27`
                if (sideMenu.hasClass("side-menu-active")) {
                    $("body").removeClass("overflow-hidden");
                    sideMenu.removeClass("side-menu-active");
                    $("#close_side_menu").fadeOut(200);
                    $tooltip.tooltipster('close');
                    $(function() {
                        setTimeout(function() {
                            $('.sideNavPages').removeClass('show');
                            $('.fas').removeClass('rotate-180');
                        }, 400);
                    });
                }
            }
        });
    }

    
    /*--------------- Animation & Parallax---------------*/
    if ($(".wow").length && $(window).outerWidth() >= 567) {
        let wow = new WOW({
            boxClass: 'wow',
            animateClass: 'animated',
            offset: 0,
            mobile: true,
            live: true
        });
        wow.init();
    }
    if ($(window).width() > 480) {
        
        $(".bg-counters").parallaxie({
            speed: 0.6,
            offset: 0,
        });
        
    } 
        

    
    /* -------copy right year maker------ */
    let copyYear = new Date().getFullYear();
    let copyText = $('#year , #year1');
    if (copyYear <= 2018) {
        copyText.text(copyYear);
    } else {
        copyText.text('2018-' + copyYear);
    }

})(jQuery);


function gosns(site_nm){
	if (rs.info.info[site_nm]) {
		window.open(rs.info.info[site_nm], '_blank');
	}
}
function showVR(){
	if (window.rs && window.rs.isVrLoadCompleted) {
		rs.showFullscreen();		
	} else {
		alert('VR을 로딩중입니다. 잠시 후 다시 시도하세요.');		
	}
}
function goHome(){
	$('html, body').animate({
        scrollTop: 0
    }, 700);
	
	/*
	$('html').css('opacity', 0);
	$('html, body').scrollTop(0);
	location.reload();
	*/
}