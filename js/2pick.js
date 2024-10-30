var moving = 0;
var class_infos;
var class_id;
var class_data;
var class_name; // 修正拼写
var characters_amount;
var vs_order = [];
var game_proccess = 0;
var game_rounds = 0;
var now_rounds;
var loading = true;


$(document).ready(function() {
    gsap.to('#sel_1', { top: '60em', scaleX: 0.6, scaleY: 1.2, transform: `translate(55%)` });
    gsap.to('#sel_2', { top: '60em', scaleX: 0.6, scaleY: 1.2, transform: `translate(-55%)` });
    gsap.fromTo('.loading_roll', 
        { rotate: 0 }, // 開始狀態
        { rotate: 720, duration: 1.5, ease: 'power1.inOut', repeat: -1 } // 結束狀態
    ); 
    const dots = document.querySelectorAll('.loading_dot');
    dots.forEach((dot, index) => {
        gsap.fromTo(dot,
            {y: '1em'},
        {
            opacity: 1, // 使點顯示
            y: '2.5em', // 向上浮動 10 像素
            duration: 0.7, // 動畫持續 0.5 秒
            repeat: -1, // 無限重複
            yoyo: true, // 折返動畫
            delay: index * 0.2, // 設置延遲，讓每個點依次出現
            ease: "power1.inOut"
        });
    });

    var class_menbers;
    const firebaseConfig = {
        apiKey: "AIzaSyDRpvapxNXt_gWmlXVoA_M6ZoayyvXLpRY",
        authDomain: "dtd-website-2pick.firebaseapp.com",
        projectId: "dtd-website-2pick",
        storageBucket: "dtd-website-2pick.appspot.com",
        messagingSenderId: "770441251767",
        appId: "1:770441251767:web:3371261e3cef53a7ba7632",
        measurementId: "G-MM8Q54K3QZ"
    };
    firebase.initializeApp(firebaseConfig);
    const data_base = firebase.firestore();
    const classRef = data_base.collection("classroom");

    class_id = sessionStorage.getItem("class_id");
    class_infos = classRef.doc(class_id);
    console.log(class_infos);
    console.log(class_id);

    class_infos.get().then((doc) => {
        if (doc.exists) {
            class_data = doc.data();
            class_name = class_data.class_name; 
            class_menbers = class_data.class_menbers; // 修正拼写
            $('#title').text(class_name);
            console.log(class_name);
            console.log(class_data); // 输出 class_data
            console.log('a + ' + class_data.class_menbers);

            characters_amount = countCKeys(class_data);
            // 初始化 vs_order
            for (var i = 0; i < characters_amount; i++) {
                vs_order[i] = i + 1;
            }
            // Fisher-Yates Shuffle 随机排序
            for (var i = characters_amount - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1)); // 随机选择一个索引
                // 交换
                [vs_order[i], vs_order[j]] = [vs_order[j], vs_order[i]];
            }
            console.log(vs_order);
            gsap.to('.loading_obj', {
                opacity: 0,
                y: '-100em',
                ease: 'power.out',
                duration:1,
                delay: 1,
                onStart: function() {
                    $('.loading_obj').css('display', 'none'); // 在動畫結束後隱藏 loading_obj
                    loading = false;
                    playSelectionAnimation('#sel_1', 55, -10, 5);
                    playSelectionAnimation('#sel_2', -55, 10, 0);
                }
            });
        } else {
            console.error("文檔不存在");
        }   
    }).catch((error) => {
        console.error("獲取文檔時發生錯誤:", error);
    });

    // 初始化動畫
    setPicture(game_proccess);
    
    mouseHoverEffects();
    
    setTimeout(() => {
        gsap.to('.pick_selection', { pointerEvents: 'auto', duration: 0 });
        moving = 1;
    }, 850);
});

function setPicture(game_proccess) {
    class_infos.get().then((doc) => {
        if (doc.exists) {
            class_data = doc.data();
            class_menbers = class_data.class_menbers; // 修正拼写
            // 修正选择器并替换图片
            $('#pick_selection_1 img').attr('src', class_menbers['c' + vs_order[game_proccess]][2]);
            $('#pick_selection_2 img').attr('src', class_menbers['c' + vs_order[game_proccess + 1]][2]);
            $('#sel_1 .seletion_box_foot h1').text(class_menbers['c' + vs_order[game_proccess]][0]);
            $('#sel_2 .seletion_box_foot h1').text(class_menbers['c' + vs_order[game_proccess + 1]][0]);
            $('#sel_1 .seletion_box_foot h2').text(class_menbers['c' + vs_order[game_proccess]][1]);
            $('#sel_2 .seletion_box_foot h2').text(class_menbers['c' + vs_order[game_proccess + 1]][1]);
            console.log(class_menbers['c' + vs_order[game_proccess]][2]);
        }
    }).catch((error) => {
        console.error("獲取文檔時發生錯誤:", error);
    });
}


function playSelectionAnimation(selector, translateX, rotation, zl) {
    var PSA_TL = gsap.timeline();
    PSA_TL.fromTo(selector, 
        { top: '60em',  scaleX: 0.6, transform: `translate(${translateX}%)`,opacity:1 },
        { 
            top: '-5em', 
            scaleX: 0.6, 
            scaleY: 1, 
            transform: `rotate(0deg)`, 
            transform: `translate(${translateX}%)`,
            duration: 0.3, 
            ease: "power1.in",
            'z-index': zl
        }
    )
    .to(selector,
        { 
            top: '0em', 
            scaleX: 1.6, 
            scaleY: 1, 
            transform: `rotate(0deg)`,
            transform: `translate(${translateX}%)`,
            duration: 0.2, 
            ease: "power2.out",
            'z-index': zl
        }
    )
    .to(selector,
        { 
            top: '-5em', 
            scaleX: 1, 
            scaleY: 1, 
            transform: `rotate(${rotation}deg)`, 
            duration: 0.5, 
            ease: "power4.out",
            'z-index': zl
        }
    );
}


function mouseHoverEffects() {
    console.log(loading);
    $('.pick_selection').each(function() {
        let isHovered = false;
        let isClicked = false;
        
        var temp_tl = gsap.timeline();
        $(this).on('mouseenter', function() {
            if (!isHovered && !isClicked && !loading) {
                isHovered = true;
                temp_tl.killTweensOf(this);
                temp_tl.to('.pick_selection', { duration: 0, 'z-index': 0 });
                temp_tl.to(this, { duration: 0, 'z-index': 10 });
                temp_tl.to(this, { scaleX: 1.2, scaleY: 1.2, duration: 0.3, ease: "power4.in", 'z-index': 10 });
                temp_tl.to(this, { scaleX: 1.1, scaleY: 1.1, duration: 0.2, ease: "power4.out", 'z-index': 10 });
                $(this).find('.selected_beam').removeClass('hide').addClass('visible');
            }
        });

        
        $(this).on('mouseleave', function() {
            if (isHovered && !isClicked && !loading) {
                isHovered = false;
                temp_tl.killTweensOf(this);
                temp_tl.to(this, { scaleX: 1, scaleY: 1, duration: 0.3, ease: "power4.inOut" });
                $(this).find('.selected_beam').removeClass('visible').addClass('hide');
            }
        });

        $(this).on('click', function() {
            if (moving == 0) return;
            moving = 0;
            isClicked = true; // 标记为已点击
            game_proccess += 2;

            gsap.to('.pick_selection', { pointerEvents: 'none', duration: 0 });
            $('.pick_selection').addClass('lose');
            $(this).removeClass('lose');
            gsap.to('.pick_selection',{transform: `rotate(0deg)`, });
            battleAnimation(this, ".lose"); // sel_1為贏家，sel_2為輸家



            // 确保点击时的动画不会冲突
            /*
            var random = Math.random();
            if (random < 0.5) {
                playSelectionAnimation('#sel_1', 55, -10, 5);
                playSelectionAnimation('#sel_2', -55, 10, 0);
            } else {
                playSelectionAnimation('#sel_1', 55, -10, 0);
                playSelectionAnimation('#sel_2', -55, 10, 5);
            }
            */
            setTimeout(() => {
                gsap.to('.pick_selection', { pointerEvents: 'auto', duration: 0 });
                moving = 1;
                isClicked = false; // 重置点击状态
            }, 2050);
        });
    });
}

function battleAnimation(winnerSelector, loserSelector) {
    var winnerDirection = $(winnerSelector).attr('id') === 'sel_1' ? 1 : -1;
    var loserDirection = -winnerDirection; // 输家方向相反
    $('.pick_selection').find('.selected_beam').removeClass('visible').addClass('hide');

    // 创建动画时间轴
    var timeline = gsap.timeline();

    // 确保两个元素在初始时重叠
    gsap.to(winnerSelector, { x: winnerDirection * 30, duration: 0.5 }); // 两者紧贴
    gsap.to(loserSelector, { x: loserDirection * 30, duration: 0.5}); // 两者紧贴


    // 最终结果
    timeline.to(winnerSelector, {
            scaleX: 0.8, // 赢家被挤压
            duration: 0.2, // 縮短持續時間
            ease: "power1.inOut"
        })
        .to(winnerSelector, {
            // 反弹回原本大小
            scaleX: 1,
            scaleX: 1.5,
            duration: 0.2, // 縮短持續時間
            ease: "back.out(1.7)"
        })
        .to(winnerSelector, {
            // 最后移动到屏幕中心并放大
            transform: `translate(${winnerDirection * 55}%)`, // 移动到中心
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 0.5, // 最终放大的持续时间
            ease: "back.out(1.7)",
            onStart:function(){
                gsap.to(loserSelector, {
                    // 将输家弹飞，计算弹飞方向以超出边缘
                    x: (i, target) => {
                        var rect = target.getBoundingClientRect(); // 获取元素的位置
                        var screenWidth = window.innerWidth;
        
                        // 如果赢家在左边，输家弹飞到屏幕右边；否则，弹飞到左边
                        return (winnerDirection === 1) ? (screenWidth + rect.width) : -(screenWidth + rect.width);
                    },
                    y: (i, target) => {
                        var rect = target.getBoundingClientRect(); // 获取元素的位置
                        var screenHeight = window.innerHeight;
        
                        // 随机选择是向上还是向下弹飞
                        return gsap.utils.random(-screenHeight - rect.height, screenHeight + rect.height);
                    },
                    rotation: gsap.utils.random(180, 720), // 随机旋转角度
                    scale: 0.5, // 远离时缩小
                    opacity: 0, // 弹飞时消失
                    duration: 1.2, // 持续时间
                    ease: "power4.out"
                });
                setTimeout(() => {
                    timeline.to(winnerSelector, {
                        // 反弹回原本大小
                        scaleX: 1.5,
                        scaleY: 1.5,
                        duration: 0.2, // 縮短持續時間
                        ease: "back.out(1.7)"
                    })
                    .to(winnerSelector, {
                        // 反弹回原本大小
                        scaleX: 1.8,
                        scaleY: 1.8,
                        delay:0.5,
                        y: -200,
                        duration: 0.3, // 縮短持續時間
                        ease: "power3.in"
                    })
                    .to(winnerSelector, {
                        // 反弹回原本大小
                        scaleX: 2.3,
                        scaleY: 2.3,
                        y: 1500,
                        duration: 0.8, // 縮短持續時間
                        ease: "power3.out",
                        onComplete:function(){
                            var random = Math.random();
                            if (random < 0.5) {
                                playSelectionAnimation('#sel_1', 55, -10, 5);
                                playSelectionAnimation('#sel_2', -55, 10, 0);
                            } else {
                                playSelectionAnimation('#sel_1', 55, -10, 0);
                                playSelectionAnimation('#sel_2', -55, 10, 5);
                            }
                        }
                    })
                        
                }, 300);
            }
        });
        
}





function countCKeys(obj) {
    let count = 0;
    for (let key in obj) {
        if (key.startsWith('c')) { // 检查键是否以 'c' 开头
            count++;
        }
    }
    return count; // 返回以 'c' 开头的键的数量
}
