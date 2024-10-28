var moving = 1;

$(document).ready(function() {
    // 頁面加載後自動播放動畫
    $('#sel_1').addClass('sel_1_pop_up_play');
    $('#sel_2').addClass('sel_2_pop_up_play');
    play_sel_anim();
    $('.pick_selection').hover(
        function() {
            if(moving == 0)
            {
                return null;
            }
            $('#sel_1').removeClass('sel_1_pop_up_play sel_1_pop_up_play_v2 selected unselected');
            $('#sel_2').removeClass('sel_2_pop_up_play sel_2_pop_up_play_v2 selected unselected');
    
            $(this).animate({'width' : '35em','height':'35em'}, 300, 'linear',function(){});
            $('.pick_selection').removeClass('selected');
            $(this).addClass('selected');
            $(this).find('.selected_beam').removeClass('hide').addClass('visible');
        },
        function() {
            if(moving == 0)
            {
                return null;
            }
            $('#sel_1').removeClass('sel_1_pop_up_play sel_1_pop_up_play_v2 selected unselected');
            $('#sel_2').removeClass('sel_2_pop_up_play sel_2_pop_up_play_v2 selected unselected');
            $(this).addClass('selected');
            $(this).animate({'width' : '30em','height':'30em'}, 300, 'linear',function(){});
            $(this).find('.selected_beam').removeClass('visible').addClass('hide');
        }
    );
});

function play_sel_anim() {
    $('.pick_selection').click(function() {
        $('.selected_beam').removeClass('visible').addClass('hide');
        $(this).animate({'width' : '30em','height':'30em'}, 10, 'linear',function(){});
        $('#test_title').css('color', 'white');
        random = Math.random();
        $('.pick_selection').addClass('disable-hover'); // 禁用 hover
        moving = 0;
        // 移除並重播動畫
        $('#sel_1').removeClass('sel_1_pop_up_play sel_1_pop_up_play_v2 selected unselected');
        $('#sel_2').removeClass('sel_2_pop_up_play sel_2_pop_up_play_v2 selected unselected');

        // 強制重繪以使動畫生效
        void $('#sel_1')[0].offsetWidth;
        void $('#sel_2')[0].offsetWidth;

        // 重新添加動畫
        if (random < 0.5) {
            $('#sel_1').addClass('sel_1_pop_up_play');
            $('#sel_2').addClass('sel_2_pop_up_play');
        } else {
            $('#sel_1').addClass('sel_1_pop_up_play_v2');
            $('#sel_2').addClass('sel_2_pop_up_play_v2');
        }

        // 設定定時器在動畫結束後重新啟用按鈕
        setTimeout(() => {
            $('.pick_selection').removeClass('disable-hover'); // 移除 disable-hover class
            moving = 1;
        }, 1100); // 700毫秒對應於動畫的時長
    });
}
