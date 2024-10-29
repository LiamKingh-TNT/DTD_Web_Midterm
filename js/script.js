$(document).ready(function() {
    
   $('button').click(function() {
        var img1Src = $(this).find('img:first').attr('src');
        var img2Src = $(this).find('img:last').attr('src');

        $('.left-image img').attr('src', img1Src);
        $('.right-image img').attr('src', img2Src);

        if ($(this).attr('id') === 'left') {
            $('.name h1').text('日本動畫二選一');
        } else if ($(this).attr('id') === 'mid') {
            $('.name h1').text('遊戲二選一');
        } else if ($(this).attr('id') === 'right') {
            $('.name h1').text('動漫主角二選一');
        }
    });

    const createRipple = (button) => {
        const ripple = $('<span class="ripple"></span>');
        
        const rect = button[0].getBoundingClientRect();
        const rippleWidth = rect.width;
        const rippleheight = rect.height;

        ripple.css({
            width: rippleWidth,
            height: rippleheight,
            left: 0,
            top: 0, 
            transform: 'scale(1)',
        });

        button.append(ripple);

        gsap.to(ripple, {
            scale: 1.5, 
            opacity: 0,
            duration: 2,
            ease: "power1.out",
            onComplete: () => ripple.remove(), 
        });
    };

    $('.room-button').on('mouseenter', function() {
        const button = $(this);

        createRipple(button);
        
        const interval = setInterval(() => createRipple(button), 750);

        button.on('mouseleave', function() {
            clearInterval(interval);
            button.off('mouseleave');
        });
    });
});
