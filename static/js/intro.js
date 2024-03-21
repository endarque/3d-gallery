$(document).ready(function () {
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