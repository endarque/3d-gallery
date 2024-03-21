$(document).ready(function () {
    $("#flipbook").flipBook({
        pages:[
            {src:"/static/images/artimages/image (1).jpg", thumb:"/static/images/artimages/image (1).jpg", title:"Cover"},
            {src:"/static/images/artimages/image (2).jpg", thumb:"/static/images/artimages/image (2).jpg", title:"1"},
            {src:"/static/images/artimages/img_01.jpeg", thumb:"/static/images/artimages/image (3).jpg", title:"2"},
            {src:"/static/images/artimages/image (4).jpg", thumb:"/static/images/artimages/image (4).jpg", title:"3"},
            {src:"/static/images/artimages/img_03.jpeg", thumb:"/static/images/artimages/image (5).jpg", title:"4",
                htmlContent:""
            },
            {src:"/static/images/artimages/image (6).jpg", thumb:"/static/images/artimages/image (6).jpg", title:"5",
                htmlContent:""
            }
        ],
        viewMode: 'webgl',
        shadows:true,
        shadowOpacity:0.2,
        pageHardness:1.2,
        coverHardness:1.2,
        pageRoughness:1,
        pageMetalness:0,
        pageSegmentsW:6,
        thumbnailsOnStart:false,
        sideNavigationButtons:true,
        responsiveView:true,
    //	pageMiddleShadowSize:20000,
    //	pageMiddleShadowColor:"#999999",
    //	pageMiddleShadowColorR:"#777777",
        antialias:false,
        pan:0,
        tilt:-0,
        panMax:20,
        panMin:-20,
        tiltMax:0,
        tiltMin:-60,
        rotateCameraOnMouseDrag:true,
        aspectRatio:2,
        autoplayOnStart:false,
        autoplayInterval:2000,
        currentPage:{"enabled":true,"title":"Current page","vAlign":"top","hAlign":"left","order":""},
        btnFirst:{"enabled":false,"title":"First Page","vAlign":"","hAlign":"","order":"","icon":"fa-angle-double-left","icon2":"first_page"},
        btnPrev:{"enabled":false,"title":"Previous Page","vAlign":"","hAlign":"","order":"","icon":"fa-chevron-left","icon2":"chevron_left"},
        btnNext:{"enabled":false,"title":"Next Page","vAlign":"","hAlign":"","order":"","icon":"fa-chevron-right","icon2":"chevron_right"},
        btnLast:{"enabled":false,"title":"Last Page","vAlign":"","hAlign":"","order":"","icon":"fa-angle-double-right","icon2":"last_page"},
        btnAutoplay:{"enabled":false,"title":"Autoplay","vAlign":"","hAlign":"","order":"","icon":"fa-play","iconAlt":"fa-pause","icon2":"play_arrow","iconAlt2":"pause"},
        btnZoomIn:{"enabled":false,"title":"Zoom in","vAlign":"","hAlign":"","order":"","icon":"fa-plus","icon2":"zoom_in"},
        btnZoomOut:{"enabled":false,"title":"Zoom out","vAlign":"","hAlign":"","order":"","icon":"fa-minus","icon2":"zoom_out"},
        btnToc:{"enabled":false,"title":"Table of Contents","vAlign":"","hAlign":"","order":"","icon":"fa-list-ol","icon2":"toc"},
        btnThumbs:{"enabled":false,"title":"Pages","vAlign":"","hAlign":"","order":"","icon":"fa-th-large","icon2":"view_module"},
        btnShare:{"enabled":false,"title":"Share","vAlign":"","hAlign":"","order":"","icon":"fa-share-alt","icon2":"share"},
        btnPrint:{"enabled":false,"title":"Print","vAlign":"","hAlign":"","order":"","icon":"fa-print","icon2":"print"},
        btnDownloadPages:{"enabled":false,"title":"Download pages","vAlign":"","hAlign":"","order":"","icon":"fa-download","icon2":"file_download"},
        btnDownloadPdf:{"enabled":false, "url":"https:\/\/www.gallery360.co.kr\/test\/deploy\/download1.pdf"},
        btnSound:{"enabled":true,"title":"Sound","vAlign":"","hAlign":"","order":"","icon":"fa-volume-up","iconAlt":"fa-volume-off","icon2":"volume_up","iconAlt2":"volume_mute"},
        btnExpand:{"enabled":false,"title":"Toggle fullscreen","vAlign":"","hAlign":"","order":"","icon":"fa-expand","iconAlt":"fa-compress","icon2":"fullscreen","iconAlt2":"fullscreen_exit"},
        btnSelect:{"enabled":false,"title":"Select tool","vAlign":"","hAlign":"","order":"","icon":"fas fa-i-cursor","icon2":"text_format"},
        btnSearch:{"enabled":false},
        btnBookmark:{"enabled":false,"title":"Bookmark","vAlign":"","hAlign":"","order":"","icon":"fas fa-bookmark","icon2":"bookmark"},
        google_plus:{"enabled":false,"url":""},
        twitter:{"enabled":false,"url":"","description":""},
        facebook:{"enabled":false,"url":"","description":"","title":"","image":"","caption":""},
        pinterest:{"enabled":false,"url":"","image":"","description":""},
        email:{"enabled":false,"url":"","description":""},
        layout:1,
        skin:"dark",
        icons:"font awesome",
        useFontAwesome5:true,
        skinColor:"",
        skinBackground:"",
        backgroundColor: 'rgb(026, 026, 026)',
    //	backgroundColor: 'rgb(81, 85, 88)',
    //	backgroundPattern:"http:\/\/creativeinteractivemedia.com\/real3d\/wp-content\/uploads\/2016\/03\/low_contrast_linen.jpg",
        backgroundTransparent:false,
        onbookcreated:function(){
            $(".flipbook-currentPageHolder").css("display","none");
            $(".flipbook-currentPageNumber").css("display","none");
            $("#kkk").on("click", function(){
                //alert("1111");
            });

        },
    });

    const tagCloud = document.querySelector('.main-tagcloud-inner');

    tagCloud.addEventListener('mousemove', e => {
        var winWidth = window.innerWidth;
        var winHeight = window.innerHeight;
        var contWidth = $(tagCloud).innerWidth();
        var contHeight = $(tagCloud).innerHeight();

        var nowX = (-1 + (e.pageX / window.innerWidth) * 2).toFixed(2);
        var nowY = (1 - (e.pageY / window.innerHeight) * 2).toFixed(2);

        var movePositionX = -1 * (nowX * ((contWidth - 100 - winWidth) / 2));
        var movePositionY = nowY * ((contHeight - 200 - winHeight) / 2);

        $(tagCloud).css({
            'transform': 'translate(' + movePositionX + 'px, ' + movePositionY + 'px)',
        });
    });


});

function oopen3(url){
    //window.open(url, null);
    //loadpage("yg_c");
    //op3("yg_r", "/static/resource/book/image/z1.gif");
}

function oopen2(url){
    //window.open(url, null);
    //loadpage("yg_r");
    //op2("yg_r", "/static/resource/book/image/z2.gif");
}

function oopen(url){
    //window.open(url, null);
//	loadpage("yg_l");
    //op("yg_l", "/static/resource/book/image/one.png");
}

function hide(){
//	$("#yg_r").hide();
//	$("#yg_l").hide();
//	$("#yg_c").hide();
    $("#yg_l .xxp").remove();
    $("#yg_r .xxp").remove();
    $("#yg_c .xxp").remove();
}

function loadpage(id){
    var url = "https://www.gallery360.co.kr/public/test.html";

    $("#" + id).load(url, function(response, status, xhr){
        if (status == "error"){
            var msg = "Site Error : ";
            g360.gAlert("Error",msg + xhr.status + " " + xhr.statusText, "red", "left");
        }
        $("#" + id).show();
    });
}

function op(id, filename){
    $("#" + id).show();
//	$("#yygg").remove();
    //$("#" + id).css("border", "10px solid red");
    //$("#" + id).hide().append("<img src='1.gif' style='width:100%; position:relative; top:100px' class='xxp' >").fadeIn(2000);
    //$("#" + id).hide().append("<img src='"+filename+"' style='position:relative; top:400px; left:50px' class='xxp' >").fadeIn(2000);

    $("#" + id).append("<img src='/static/resource/book/image/b3.gif' style='position:absolute; top:0px; left:0px; width:100%; height:100%' class='xxp' >");
    $("#" + id).append("<img src='/static/resource/book/image/one.png' style='position:relative; top:400px; left:50px' class='xxp' id='yygg'>");
}

function op2(id, filename){
    $("#" + id).show();
    //$("#" + id).hide().append("<img src='"+filename+"' style='position:absolute; top:125px; left:80px; width:600px; height:340px' class='xxp' >").fadeIn(2000);
    $("#" + id).hide().append("<img src='"+filename+"' style='position:absolute; top:125px; left:80px; width:600px; height:340px' class='xxp' id='kyg'>").fadeIn(2000);

}

function op3(id, filename){
    $("#" + id).show();
    //$("#" + id).hide().append("<img src='"+filename+"' style='position:absolute; top:620px; left:80px; width:603px; height:340px' class='xxp' >").fadeIn(2000);
    $("#" + id).hide().append("<img src='"+filename+"' style='position:absolute; top:620px; left:80px; width:603px; height:340px' class='xxp' id='kyg2'>").fadeIn(2000);
}

function op4(id, filename){
//debugger;
    $("#" + id).show();
    //$("#" + id).hide().append("<img src='"+filename+"' style='position:absolute; top:620px; left:80px; width:603px; height:340px' class='xxp' >").fadeIn(2000);
    //$("#" + id).hide().html("<img src='"+filename+"' style='position:absolute; top:0px; left:0px; width:100%; height:440px' class='xxp' >").fadeIn(2000);

}

function op5(id, filename){
//debugger;
    $("#" + id).show();
    //$("#" + id).hide().append("<img src='"+filename+"' style='position:absolute; top:620px; left:80px; width:603px; height:340px' class='xxp' >").fadeIn(2000);
    //$("#" + id).hide().html("<img src='"+filename+"' style='position:absolute; top:0px; left:0px; width:100%; height:100%' class='xxp' >").fadeIn(2000);
}

function op6(id, filename){
//debugger;
    $("#" + id).show();
    //$("#" + id).hide().append("<img src='"+filename+"' style='position:absolute; top:620px; left:80px; width:603px; height:340px' class='xxp' >").fadeIn(2000);
    $("#" + id).hide().append("<img src='"+filename+"' style='position:absolute; top:0px; left:0px; width:100%; height:100%' class='xxp' >").fadeIn(1000);
}

var curPage = "";
function changepage(val){
    curPage = val;
    //alert(val);
    if (val == "2-3"){
        //op4("yg_l", "/static/resource/book/image/b1.gif");
    }else if (val == "4-5"){

        //op5("yg_l","/static/resource/book/image/4p.gif");

        /*
        op2("yg_r", "/static/resource/book/image/z2.gif");

        setTimeout(function(){
            if (curPage == "4-5"){
                $("#kyg").fadeOut();
                //op3("yg_r", "/static/resource/book/image/z1.gif");
            }else{
                $("#kyg2").fadeOut();
            }

        },4000);

        setTimeout(function(){
            if (curPage == "4-5"){
                $("#kyg2").fadeOut();
            }
        }, 21000);
        */
        //op("yg_r", "/static/resource/book/image/one.png");
    }else if (val == "6"){
        //op6("yg_l", "/static/resource/book/image/b3.gif");
    }else{
    //	hide();
        $("#kyg").hide();
        $("#kyg2").hide();
    }
}

function beforechangepage(val){
    if (val == "4-5"){
    }else{
    //	hide();
    }
}
/////////////////////////////////////////////


function openBook() {
    book.style.transform = "translateX(50%)";
    prevBtn.style.transform = "translateX(-180px)";
    nextBtn.style.transform = "translateX(180px)";
}

function closeBook(isAtBeginning) {
    if(isAtBeginning) {
        book.style.transform = "translateX(0%)";
    } else {
        book.style.transform = "translateX(100%)";
    }

    prevBtn.style.transform = "translateX(0px)";
    nextBtn.style.transform = "translateX(0px)";
}

function goNextPage() {
    if(currentLocation < maxLocation) {
        switch(currentLocation) {
            case 1:
                openBook();
                paper1.classList.add("flipped");
                paper1.style.zIndex = 1;
                break;
            case 2:
                paper2.classList.add("flipped");
                paper2.style.zIndex = 2;
                break;
            case 3:
                paper3.classList.add("flipped");
                paper3.style.zIndex = 3;
                closeBook(false);
                break;
            default:
                throw new Error("unkown state");
        }
        currentLocation++;
    }
}

function goPrevPage() {
    if(currentLocation > 1) {
        switch(currentLocation) {
            case 2:
                closeBook(true);
                paper1.classList.remove("flipped");
                paper1.style.zIndex = 3;
                break;
            case 3:
                paper2.classList.remove("flipped");
                paper2.style.zIndex = 2;
                break;
            case 4:
                openBook();
                paper3.classList.remove("flipped");
                paper3.style.zIndex = 1;
                break;
            default:
                throw new Error("unkown state");
        }

        currentLocation--;
    }
}
/////////////////////////////////////////////////////////////
