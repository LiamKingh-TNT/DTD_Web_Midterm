var moving = 0;
var class_infos;
var class_id;
var class_data;
var class_name;
var class_menbers; // 修正拼写
var characters_amount;
var vs_order = [];
var game_proccess = 0;
var game_rounds = 0;
var now_rounds;

$(document).ready(function() {
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
            console.log(class_menbers);

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
        } else {
            console.error("文檔不存在");
        }   
    }).catch((error) => {
        console.error("獲取文檔時發生錯誤:", error);
    });

    // 初始化動畫
    console.log(class_menbers);
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
            duration: 0.3, 
            ease: "power1.in",
            'z-index': zl
        }
    )
    .to(selector,
        { 
            top: '0em', 
            width: '38em', 
            height: '30em', 
            transform: `rotate(0deg)`,
            duration: 0.2, 
            ease: "power2.out",
            'z-index': zl
        }
    )
    .to(selector,
        { 
            top: '-5em', 
            width: '30em', 
            height: '30em', 
            transform: `rotate(${rotation}deg)`, 
            duration: 0.5, 
            ease: "power4.out",
            'z-index': zl
        }
    );
}

function mouseHoverEffects() {
    $('.pick_selection').on('mouseenter', function() {
        var temp_tl = gsap.timeline();
        temp_tl.to('.pick_selection', { duration: 0, 'z-index': 0 });
        temp_tl.to(this, { duration: 0, 'z-index': 10 });
        temp_tl.to(this, { width: '38em', height: '38em', duration: 0.3, ease: "power4.in", 'z-index': 10 });
        temp_tl.to(this, { width: '35em', height: '35em', duration: 0.2, ease: "power4.out", 'z-index': 10 });
        $(this).find('.selected_beam').removeClass('hide').addClass('visible');
    });

    $('.pick_selection').on('mouseleave', function() {
        var temp_tl = gsap.timeline();
        temp_tl.to(this, { duration: 0 });
        temp_tl.to(this, { width: '30em', height: '30em', duration: 0.3, ease: "power4.inOut" });
        $(this).find('.selected_beam').removeClass('visible').addClass('hide');
    });

    $('.pick_selection').on('click', function() {
        if (moving === 0) return;
        moving = 0;
        game_proccess+=2;
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

function countCKeys(obj) {
    let count = 0;
    for (let key in obj) {
        if (key.startsWith('c')) { // 检查键是否以 'c' 开头
            count++;
        }
    }
    return count; // 返回以 'c' 开头的键的数量
}
