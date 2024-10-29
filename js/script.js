$(document).ready(function() {
    $('button').mouseenter(function(){
        $(this).stop(true, true).animate({'height': '+=25px'}, 300, 'linear');
    });
    $('button').mouseleave(function(){
        $(this).stop(true, true).animate({'height': '-=25px'}, 300, 'linear');
    });
    $('button').click(function() {

        var img1Src = $(this).find('img:first').attr('src');
        var img2Src = $(this).find('img:last').attr('src');


        $('.left-image').attr('src', img1Src);
        $('.right-image').attr('src', img2Src);
    });
});