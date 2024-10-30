
var class_id;
var class_infos;
var can_start;

$(document).ready(function() {
    class_id = null;
    can_start = false;
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

    loading = 1;
    
    
    const main_imgs = document.querySelectorAll('.main-img');
    main_imgs.forEach((img, index) => {
        gsap.fromTo(img, 
            { scale: 1 }, // 開始狀態
            { scale: 1.05, x: (Math.random() - 0.5) + 'em', y: (Math.random() * 2 - 1) + 'em', duration: 1.5, yoyo: true, ease: 'power1.inOut', repeat: -1, delay: index * Math.random() * 0.5,} // 結束狀態
        ); 
    });
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

    
    classRef.get().then((querySnapshot) => {
        const docs = [];
        querySnapshot.forEach((doc) => {  
            docs.push({ id: doc.id, data: doc.data() });
        });

        const selectedDoc = getRandomDoc(docs, 3);  
        console.log("隨機選擇的文檔:", selectedDoc);

        for(var i = 1; i <= 3; i++) {
            const data = selectedDoc[i - 1].data;  
            const class_menbers = data.class_menbers;

            if (class_menbers) {
                const menberKeys = Object.keys(class_menbers);
                
                // 隨機選擇兩個成員的索引
                const randomIndexes = [];
                while (randomIndexes.length < 2) {
                    const rand = Math.floor(Math.random() * menberKeys.length);
                    if (!randomIndexes.includes(rand)) {
                        randomIndexes.push(rand);
                    }
                }

                // 獲取兩個隨機成員的資料
                const img1Src = class_menbers[menberKeys[randomIndexes[0]]][2]; // 圖片路徑
                const img2Src = class_menbers[menberKeys[randomIndexes[1]]][2]; // 圖片路徑
                
                // 設置圖片源
                $('.button_' + i).attr('id', '#' + selectedDoc[i - 1].id);
                console.log(selectedDoc[i-1].id);
                $('.button_' + i).find('img:first').attr('src', img1Src);  // 使用 '.' 前綴選擇器
                $('.button_' + i).find('img:last').attr('src', img2Src);   // 使用 '.' 前綴選擇器
                /*if(i == 2)
                {
                    const class_name = data.class_name;
                    $('.name h1').text(class_name);
                    $('.left-image img').attr('src', img1Src);
                    $('.right-image img').attr('src', img2Src);
                }*/
            } else {
                console.error("class_menbers 不存在");
            }
        }
        console.log('load down');

        gsap.to('.loading_obj', {
            opacity: 0,
            y: '-100em',
            ease: 'power.out',
            duration:2.5,
            delay: 2,
            onComplete: function() {
                $('.loading_obj').css('display', 'none'); // 在動畫結束後隱藏 loading_obj
            }
        });

    }).catch((error) => {
        console.error("獲取文檔時發生錯誤:", error);
    });

    $("#start-button").click(function(){
        // 儲存數據到 sessionStorage
        sessionStorage.setItem("class_infos", class_infos);
        sessionStorage.setItem("class_id", class_id);
        // 跳轉到 2pick 頁面
        if(class_id != null){
            console.log(class_infos);
            console.log(class_id);
            window.location.href = "2pick.html";
        }
    });

    $('.room-button').click(function() {
        
        var swtl = gsap.timeline();
        swtl.to('.switch_cover',{
            gap:0,
            ease:'power.in',
            duration:0.3,
            onStart:function(){
                $('.switch_cover').css('pointer-events','all');
            }
        })
        swtl.to('.switch_cover',{
            gap:'100em',
            ease:'power.out',
            duration:0.3,
            delay:0.5,
            onComplete:function(){
                $('.switch_cover').css('pointer-events','none');
            }
        })
        setTimeout(() => {
            var tempID = $(this).attr('id');
            class_id = tempID.substr(1,tempID.length); // 使用 attr 獲取 ID
            console.log(class_id);
            //console.log(tempID.substr(1,tempID.length));
            class_infos = classRef.doc(class_id); // 獲取對應的文檔
            class_infos.get().then((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    const class_name = data.class_name;
                    $('.name h1').text(class_name);

                    var img1Src = $(this).find('img:first').attr('src');
                    var img2Src = $(this).find('img:last').attr('src');

                    $('.left-image img').attr('src', img1Src);
                    $('.right-image img').attr('src', img2Src);
                } else {
                    console.error("文檔不存在");
                }
            }).catch((error) => {
                console.error("獲取文檔時發生錯誤:", error);
            });
            
            var stbttl = gsap.timeline();
            console.log(can_start);
            stbttl.to('#start-button',{
                delay:0.05
            });
            if(!can_start)
            {
                stbttl.fromTo('#start-button',{
                    y:'8em',
                    scale:0.8
                },{
                    y:'2em',
                    scale:1.5,
                    duration:0.6,
                    ease:'power4.in',
                    onStart:function(){
                        $('#start-button').css('visibility','visible');
                        $('#start-button').css('pointer-events','all');
                    }
                });
            }
            stbttl.fromTo('#start-button',{
                scale:1.5
            },{
                y:'0em',
                scale:1,
                duration:0.5,
                ease:'power2.out'
            });

            can_start = true;
        }, 300);
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
            'border-radius': '1em'
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

function getRandomDoc(docs, count) {
    const shuffled = docs.sort(() => 0.5 - Math.random()); // 隨機打亂數組
    return shuffled.slice(0, count); // 取前 count 個文檔
}
