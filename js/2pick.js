var moving = 0;

$(document).ready(function() {
    // 初始化動畫
    gsap.to('.pick_selection', { pointerEvents: 'none', duration: 0 });
    playSelectionAnimation('#sel_1', 55, -10, 5);
    playSelectionAnimation('#sel_2', -55, 10, 0);
    mouseHoverEffects();
    
    setTimeout(() => {
        gsap.to('.pick_selection', { pointerEvents: 'auto', duration: 0 });
        moving = 1;
    }, 850);
});

function playSelectionAnimation(selector, translateX, rotation, zl) {
    var PSA_TL = gsap.timeline();
    PSA_TL.fromTo(selector, 
        { top: '60em', width: '23em', transform: `translate(${translateX}%)` },
        { 
            top: '-5em', 
            width: '23em', 
            height: '30em', 
            transform: `rotate(0deg)`, 
            transform: `translate(${translateX}%)`,
            duration: 0.3, 
            ease: "power1.in",
            'z-index': zl
        }
    );
    PSA_TL.to(selector,
        { 
            top: '0em', 
            width: '38em', 
            height: '30em', 
            transform: `rotate(0deg)`, 
            transform: `translate(${translateX}%)`,
            duration: 0.2, 
            ease: "power2.out" ,
            'z-index': zl
        }
    );
    PSA_TL.to(selector,
        { 
            top: '-5em', 
            width: '30em', 
            height: '30em', 
            transform: `rotate(${rotation}deg)`, 
            duration: 0.5, 
            ease: "power4.out" ,
            'z-index': zl
        }
    );
}

function mouseHoverEffects() {
    $('.pick_selection').on('mouseenter', function() {
        var temp_tl = gsap.timeline();
        temp_tl.to('.pick_selection', {duration: 0, 'z-index': 0});
        temp_tl.to(this, {duration: 0, 'z-index': 10});
        temp_tl.to(this, { width: '38em', height: '38em', duration: 0.3, ease: "power4.in", 'z-index': 10});
        temp_tl.to(this, { width: '35em', height: '35em', duration: 0.2, ease: "power4.out", 'z-index': 10});
        $(this).find('.selected_beam').removeClass('hide').addClass('visible');
    });

    $('.pick_selection').on('mouseleave', function() {
        var temp_tl = gsap.timeline();
        temp_tl.to(this, {duration: 0});
        temp_tl.to(this, { width: '30em', height: '30em', duration: 0.3, ease: "power4.inOut"});
        $(this).find('.selected_beam').removeClass('visible').addClass('hide');
    });

    $('.pick_selection').on('click', function() {
        if (moving === 0) return;
        moving = 0;

        gsap.to('.pick_selection', { pointerEvents: 'none', duration: 0 });

        var random = Math.random();
        if (random < 0.5) {
            playSelectionAnimation('#sel_1', 55, -10, 5);
            playSelectionAnimation('#sel_2', -55, 10, 0);
        } else {
            playSelectionAnimation('#sel_1', 55, -10, 0);
            playSelectionAnimation('#sel_2', -55, 10, 5);
        }

        setTimeout(() => {
            gsap.to('.pick_selection', { pointerEvents: 'auto', duration: 0 });
            moving = 1;
        }, 850);
    });
}
