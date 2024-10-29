$(document).ready(function() {
    $('button').mouseenter(function(){
        $(this).stop(true,true).animate({'width': '+=25'}, 300, 'linear', function(){});
    });
    $('button').mouseleave(function(){
        $(this).animate({'width': '-=25'}, 300, 'linear', function(){});
    });
});
