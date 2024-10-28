var random;
$(document).ready(function(){
    // 頁面加載後自動播放動畫
    $('#sel_1').addClass('sel_1_pop_up_play');
    $('#sel_2').addClass('sel_2_pop_up_play');

    // 點擊事件來重新播放動畫
    $('.pick_selection').click(function(){
        $('#test_title').css('color', 'white');
        random = Math.random();
        if(random < 0.5)
        {
            // 移除並重新添加類別來重播動畫
            $('#sel_1').removeClass('sel_1_pop_up_play');
            $('#sel_2').removeClass('sel_2_pop_up_play');
            $('#sel_1').removeClass('sel_1_pop_up_play_v2');
            $('#sel_2').removeClass('sel_2_pop_up_play_v2');
    
            // 強制重繪以使動畫生效
            void $('#sel_1')[0].offsetWidth;
            void $('#sel_2')[0].offsetWidth;
    
            // 重新添加動畫類別
            $('#sel_1').addClass('sel_1_pop_up_play');
            $('#sel_2').addClass('sel_2_pop_up_play');
        }
        else
        {
            // 移除並重新添加類別來重播動畫
            $('#sel_1').removeClass('sel_1_pop_up_play_v2');
            $('#sel_2').removeClass('sel_2_pop_up_play_v2');
            $('#sel_1').removeClass('sel_1_pop_up_play');
            $('#sel_2').removeClass('sel_2_pop_up_play');
    
            // 強制重繪以使動畫生效
            void $('#sel_1')[0].offsetWidth;
            void $('#sel_2')[0].offsetWidth;
    
            // 重新添加動畫類別
            $('#sel_1').addClass('sel_1_pop_up_play_v2');
            $('#sel_2').addClass('sel_2_pop_up_play_v2');

        }
    });
});