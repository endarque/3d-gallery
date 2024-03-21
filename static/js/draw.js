$(document).ready(function () {
    $('.post-wrapper').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: false,
      nextArrow:$('.next'),
      prevArrow:$('.prev'),
    });
    $('.post').click(function() {
        var src = $(this).find('img').attr('src');
        //console.log(src);
        $('#present_img').attr("src", src);
    });


    const canvas = document.getElementById("jsCanvas");
    const ctx = canvas.getContext("2d");

    const colors = document.getElementsByClassName("jsColor");
    const range = document.getElementById("jsRange");
    const mode = document.getElementById("jsMode");
    const saveBtn = document.getElementById("jsSave");
    const clearBtn = document.getElementById("jsClear");

    const INITIAL_COLOR = "#000000";
    const CANVAS_SIZE = 700;

    ctx.strokeStyle = "#2c2c2c";

    canvas.width = 700;
    canvas.height = 524;

    /*
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.strokeStyle = INITIAL_COLOR;
    ctx.fillStyle = INITIAL_COLOR;
    */
    ctx.lineWidth = 2.5; /* 라인 굵기 */

    var img = new Image(); //이미지 객체 생성
    img.src = "/static/images/note.jpg" ; //code.jpg라는 이미지 파일을 로딩 시작
    img.onload = function () //이미지 로딩 완료시 실행되는 함수
    {
        //(20,20)을 중심으로 100*100의 사이즈로 이미지를 그림
        ctx.drawImage(img,0,0,canvas.width,canvas.height )
    }

    let painting = false;
    let filling = false;

    function stopPainting() {
        painting = false;
    }

    function startPainting() {
        painting = true;
    }

    function onMouseMove(event) {
        const x = event.offsetX;
        const y = event.offsetY;
        if (!painting) {
            ctx.beginPath();
            ctx.moveTo(x, y);
        } else{
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }

    function handleColorClick(event) {
      const color = event.target.style.backgroundColor;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
    }

    function handleRangeChange(event) {
        const size = event.target.value;
        ctx.lineWidth = size;
      }

    function handleModeClick() {
     if (filling === true) {
       filling = false;
       mode.innerText = "Fill";
     } else {
      filling = true;
      mode.innerText = "Paint";
     }
    }

    function handleCanvasClick() {
        if (filling) {
          ctx.fillRect(0, 0, canvas.width,canvas.height);
        }
    }
    function handleClearClick()
    {
        // canvas
        var cnvs = document.getElementById('jsCanvas');
        // context
        var ctx = canvas.getContext('2d');

        // 픽셀 정리
        ctx.clearRect(0, 0, cnvs.width, cnvs.height);
        var img = new Image(); //이미지 객체 생성
        img.src = "/static/images/note.jpg" ; //code.jpg라는 이미지 파일을 로딩 시작
        img.onload = function () //이미지 로딩 완료시 실행되는 함수
        {
            //(20,20)을 중심으로 100*100의 사이즈로 이미지를 그림
            ctx.drawImage(img,0,0,cnvs.width,cnvs.height )
        }
        // 컨텍스트 리셋
        ctx.beginPath();
    }


    // 우클릭 방지

    function handleCM(event) {
       event.preventDefault();
     }


    function handleSaveClick() {
        const image = canvas.toDataURL("image/jpeg");
        const link = document.createElement("a");
        $.ajax({
            url:'/saveImage',
            type : 'POST',
            data: { img: image },
            success: function(res) {
                console.log(res);
            }
        });
        link.href = image;
        link.download = "[TEXT]_Img";
        link.click();
    }


    if (canvas) {
        canvas.addEventListener("mousemove", onMouseMove);
        canvas.addEventListener("mousedown", startPainting);
        canvas.addEventListener("mouseup", stopPainting);
        canvas.addEventListener("mouseleave", stopPainting);
        canvas.addEventListener("click", handleCanvasClick);
        canvas.addEventListener("contextmenu", handleCM);

    }

    Array.from(colors).forEach(color =>
        color.addEventListener("click", handleColorClick));


    if (range) {
        range.addEventListener("input", handleRangeChange);
    }

    if (mode) {
        mode.addEventListener("click", handleModeClick);
    }

    if (saveBtn){
      saveBtn.addEventListener("click", handleSaveClick);
    }
    if (clearBtn){
      clearBtn.addEventListener("click", handleClearClick);
    }
});