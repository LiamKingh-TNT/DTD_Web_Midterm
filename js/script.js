$(document).ready(function() {
    $('button').mouseenter(function(){
        $(this).stop(true, true).animate({'height': '+=25px'}, 300, 'linear');
    });
    $('button').mouseleave(function(){
        $(this).stop(true, true).animate({'height': '-=25px'}, 300, 'linear');
    });
    $('button').click(function() {
        // 獲取當前按鈕中第一個和第二個 img 元素的 src
        var img1Src = $(this).find('img:first').attr('src');
        var img2Src = $(this).find('img:last').attr('src');

        // 使用 img1Src 和 img2Src 來更新指定的圖片
        $('.left-image img').attr('src', img1Src); // 更新左側圖片
        $('.right-image img').attr('src', img2Src); // 更新右側圖片
    });
});
