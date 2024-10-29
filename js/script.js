$(document).ready(function() {
    $('button').mouseenter(function(){
<<<<<<< Updated upstream
        $(this).stop(true,true).animate({'width': '+=25'}, 300, 'linear', function(){});
    });
    $('button').mouseleave(function(){
        $(this).animate({'width': '-=25'}, 300, 'linear', function(){});
=======
        $(this).stop(true, true).animate({'width': '+=25px'}, 300, 'linear');
    });
    $('button').mouseleave(function(){
        $(this).stop(true, true).animate({'width': '-=25px'}, 300, 'linear');
>>>>>>> Stashed changes
    });
});