var moving = 1;

$(document).ready(function() {
    // 頁面加載後自動播放動畫
    $('#sel_1').addClass('sel_1_pop_up_play');
    $('#sel_2').addClass('sel_2_pop_up_play');
    play_sel_anim();
    mouse_hover();
});
function mouse_hover()
{
    $('.pick_selection').mouseenter(function() {
        $(this).stop(true, false);
        $(this).addClass('selected');
        $(this).first().css({'width': '30em', 'height': '30em'}).animate({'width': '35em', 'height': '35em'}, 300, 'linear', function() {
        
        if (moving == 0) {
            return; // 當 moving 為 0 時，不進行任何操作
        }
        $('.pick_selection').css('pointer-events', 'none');
        $('#sel_1').removeClass('sel_1_pop_up_play sel_1_pop_up_play_v2 selected');
        $('#sel_2').removeClass('sel_2_pop_up_play sel_2_pop_up_play_v2 selected');
    
            $('.pick_selection').css('pointer-events', 'auto');
            $(this).addClass('selected');
        });
        $(this).find('.selected_beam').removeClass('hide').addClass('visible');
    });

    $('.pick_selection').mouseleave(function() {
        
        $(this).stop(true, false);
        $(this).first().css({'width': '35em', 'height': '35em'}).animate({'width': '30em', 'height': '30em'}, 300, 'linear', function() {
        if (moving == 0) {
            return; // 當 moving 為 0 時，不進行任何操作
        }
        $('.pick_selection').css('pointer-events', 'none');
        $('#sel_1').removeClass('sel_1_pop_up_play sel_1_pop_up_play_v2 selected');
        $('#sel_2').removeClass('sel_2_pop_up_play sel_2_pop_up_play_v2 selected');

            $('.pick_selection').css('pointer-events', 'auto');
            $(this).addClass('selected');
        });
        $(this).find('.selected_beam').removeClass('visible').addClass('hide');
    });
}

function play_sel_anim() {
    $('.pick_selection').off('click').click(function() {
        if (moving == 0) {
            return; // 若 moving 為 0，則不執行任何操作
        }

        $('.selected_beam').removeClass('visible').addClass('hide');
        $(this).animate({'width': '30em', 'height': '30em'}, 10, 'linear', function() {});

        $('#test_title').css('color', 'white');
        var random = Math.random();
        $('.pick_selection').addClass('disable-hover'); // 禁用 hover
        moving = 0; // 禁用再次點擊

        // 移除並重播動畫
        $('#sel_1').removeClass('sel_1_pop_up_play sel_1_pop_up_play_v2');
        $('#sel_2').removeClass('sel_2_pop_up_play sel_2_pop_up_play_v2');

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
            $('.pick_selection').stop(true,false).removeClass('disable-hover'); // 移除 disable-hover class
            moving = 1; // 重新啟用再次點擊
        }, 1100); // 1100毫秒對應於動畫的時長
    });
}
