
var class_id;
var class_infos;
var can_start;
var menu_clicked = false;
var card_list = Array(18);
var selection_id = 0;
var selectior_id = 0;
var picture_array;
var search_box_switch = false;
var search_box_switch_CD = 0;
var search_box_field_hovered = false;
var search_box_button_hovered = false;
var classRef;

$(document).ready(function() {
    let currentAngle = 10; // 輪盤初始角度
    selection_id = 1;
    let isCooldown = false; // 冷卻標誌位
    const cooldownTime = 0; // 冷卻時間（毫秒）
    $('.door').css('visibility','hidden');
    
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
    classRef = data_base.collection("classroom");

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
    // 獲取輪盤
    const wheel = document.querySelector('.wheel');

    // 生成卡片
    const numCards = 18; // 轮盘上的卡片数量
    for (let i = 0; i < numCards; i++) {
        const card = document.createElement('button');
        const card_inner = document.createElement('div');
        const img = document.createElement('img');
        const p = document.createElement('p');
        card_inner.classList.add('card_inner');
        p.classList.add('card_text');
        p.textContent ='尚未建立 代號:' + i;
        img.classList.add('card_img');
        img.src = "url(../images/one_right.png)";
        card.classList.add('card');
        card.classList.add('card' + i);
        card.appendChild(card_inner);
        card_inner.appendChild(img);
        card_inner.appendChild(p);
        wheel.appendChild(card);
        
        // 计算卡片的角度和位置
        const angle = (360 / numCards) * i  - 30; // 计算每张卡片的角度
        
        // 设置卡片的位置
        card.style.transform = `rotate(${angle}deg) translate(0px, -1300px) `;
        card_list[i] = card;
    }
    $('.card').css('pointer-events', 'none');
    $('.card1').css('pointer-events', 'auto');

    
    classRef.get().then((querySnapshot) => {
        const docs = [];
        querySnapshot.forEach((doc) => {  
            docs.push({ id: doc.id, data: doc.data() });
        });

        console.log(docs.length);

        selection_count = docs.length > 18? 18: docs.length;
        const selectedDoc = getRandomDoc(docs, selection_count);  
        console.log("隨機選擇的文檔:", selectedDoc);
        picture_array = new Array(selection_count); // 创建一维数组

        for (let i = 0; i < selection_count; i++) {
            picture_array[i] = new Array(4); // 每个元素再初始化为一个数组（列数为 2）
            picture_array[i][0] = '../images/one_right.png';
            picture_array[i][1] = '../images/one_left.png';
            picture_array[i][2] = '../images/one_left.png';
            picture_array[i][3] = '';
        }

        for(var i = 1; i <= selection_count; i++) {
            const data = selectedDoc[i - 1].data;  
            const class_menbers = data.class_menbers;

            if (class_menbers) {
                const menberKeys = Object.keys(class_menbers);
                
                // 隨機選擇兩個成員的索引
                const randomIndexes = [];
                while (randomIndexes.length < 3) {
                    const rand = Math.floor(Math.random() * menberKeys.length);
                    if (!randomIndexes.includes(rand)) {
                        randomIndexes.push(rand);
                    }
                }

                // 獲取一個隨機成員的資料
                const img1Src = class_menbers[menberKeys[randomIndexes[0]]][2]; // 圖片路徑
                picture_array[i - 1][0] = class_menbers[menberKeys[randomIndexes[1]]][2];
                picture_array[i - 1][1] = class_menbers[menberKeys[randomIndexes[2]]][2];
                picture_array[i - 1][2] = img1Src;
                picture_array[i - 1][3] = selectedDoc[i - 1].id;
                if(i > 0) $('.background_img_right').css('background-image',`url(${picture_array[1][0]})`);
                if(i > 0) $('.background_img_left').css('background-image',`url(${picture_array[1][1]})`);
                // 設置圖片源
                $(card_list[i-1]).attr('id', '#' + selectedDoc[i - 1].id);
                console.log(selectedDoc[i-1].id);
                $(card_list[i-1].querySelector('div')).find('img:first').attr('src', img1Src);  // 使用
                if(i == 2)$('.selector_card').find('img:first').attr('src', img1Src);  // 使用 '.' 前綴選擇器
                if(i == 2)$('.selector_card').find('p:first').text(data.class_name);
                console.log(data);
                $(card_list[i-1].querySelector('div')).find('p:first').text(data.class_name);  // 使用 '.' 前綴選擇器
                if(i==2)$('.title').text(data.class_name);
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
                $('.loading_obj').css('visibility', 'hidden'); // 在動畫結束後隱藏 loading_obj
            }
        });

    }).catch((error) => {
        console.error("獲取文檔時發生錯誤:", error);
    });


    // 滑鼠滾輪控制旋轉
    window.addEventListener('wheel', (event) => {
        console.log(selection_id);
        if (isCooldown) return; // 如果在冷卻期間，直接返回
        isCooldown = true;
        const delta = event.deltaY > 0 ? 20 : -20; // 每次滾動的角度
        currentAngle += delta;
        const offset = event.deltaY > 0 ? 5 : -5;
        $('.card').css('pointer-events', 'none');
        
        // 使用 GSAP 旋轉輪盤
        gsap.timeline().to(wheel, {
            rotation: currentAngle + offset,
            duration: 0.5,
            ease: 'power2.in'
        })
        .to(wheel, {
            rotation: currentAngle,
            duration: 0.1,
            ease: 'power2.out',
            onStart: () => {
                isCooldown = true; // 設置冷卻開始
                gsap.to('.card',{
                    scale:1
                })

            },
            onComplete: () => {
                // 動畫完成後，啟動冷卻計時
                selection_id += (offset> 0 ? -1 : 1);
                if(selection_id < 0)
                {
                    selection_id = 17;
                }
                else if(selection_id > 17)
                {
                    selection_id = 0;
                }
                selectior_id = selection_id > picture_array.length? picture_array.length - 1: selection_id;
                $('.card' + selection_id).css('pointer-events', 'auto');
                if(picture_array.length > selection_id)
                {
                    console.log(picture_array[selection_id][0]);
                    $('.background_img_right').css('background-image',`url(${picture_array[selection_id][0]})`);
                    $('.background_img_left').css('background-image',`url(${picture_array[selection_id][1]})`);
                    $('.selector_card').find('img:first').attr('src', picture_array[selection_id][2]);  // 使用 '.' 前綴選擇器
                    

                    var tempID = $('.card' + selection_id).attr('id');
                    class_id = tempID.substr(1,tempID.length); // 使用 attr 獲取 ID
                    console.log(class_id);
                    //console.log(tempID.substr(1,tempID.length));
                    class_infos = classRef.doc(class_id); // 獲取對應的文檔
                    class_infos.get().then((doc) => {
                        if (doc.exists) {
                            const data = doc.data();
                            const class_name = data.class_name;
                            $('.title').text(class_name);
                            $('.selector_card').find('p:first').text(class_name);
                        } else {
                            console.error("文檔不存在");
                        }
                    }).catch((error) => {
                        console.error("獲取文檔時發生錯誤:", error);
                    });
                
                }
                else{
                    $('.background_img_right').css('background-image',`url(../images/one_right.png)`);
                    $('.background_img_left').css('background-image',`url(../images/one_left.png)`);
                }
                
                setTimeout(() => {
                    isCooldown = false; // 冷卻結束
                }, cooldownTime);
            }
        });
    });
    mouseHoverCard();
    mouseHoverSearch();
    mouseHoverButton();
});
function mouseHoverButton(){
    $('.right_button').on('click', function() {
        selectior_id++;
        if(selectior_id >= picture_array.length)
        {
            selectior_id = picture_array.length - 1;
        }
        $('.background_img_right').css('background-image',`url(${picture_array[selectior_id][0]})`);
        $('.background_img_left').css('background-image',`url(${picture_array[selectior_id][1]})`);
        $('.selector_card').find('img:first').attr('src', picture_array[selectior_id][2]);  // 使用 '.' 前綴選擇器
        console.log(selectior_id);
        var tempID = picture_array[selectior_id][3];
        class_id = tempID.substr(0,tempID.length); // 使用 attr 獲取 ID
        console.log(class_id);
        //console.log(tempID.substr(1,tempID.length));
        class_infos = classRef.doc(class_id); // 獲取對應的文檔
        class_infos.get().then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                const class_name = data.class_name;
                $('.title').text(class_name);
                $('.selector_card').find('p:first').text(class_name);
            } else {
                console.error("文檔不存在");
            }
        }).catch((error) => {
            console.error("獲取文檔時發生錯誤:", error);
        });
    });
    $('.left_button').on('click', function() {
        selectior_id--;
        if(selectior_id < 0)
        {
            selectior_id = 0;
        }
        $('.background_img_right').css('background-image',`url(${picture_array[selectior_id][0]})`);
        $('.background_img_left').css('background-image',`url(${picture_array[selectior_id][1]})`);
        $('.selector_card').find('img:first').attr('src', picture_array[selectior_id][2]);  // 使用 '.' 前綴選擇器
        console.log(selectior_id);
        var tempID = picture_array[selectior_id][3];
        class_id = tempID.substr(0,tempID.length); // 使用 attr 獲取 ID
        console.log(class_id);
        //console.log(tempID.substr(1,tempID.length));
        class_infos = classRef.doc(class_id); // 獲取對應的文檔
        class_infos.get().then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                const class_name = data.class_name;
                $('.title').text(class_name);
                $('.selector_card').find('p:first').text(class_name);
            } else {
                console.error("文檔不存在");
            }
        }).catch((error) => {
            console.error("獲取文檔時發生錯誤:", error);
        });
    });
    $('.selector_card').on('click', function() {
        if(picture_array.length <= selection_id) return;
        gsap.to('.loading_obj', {
            opacity: 1,
            y: '0em',
            ease: 'power4.out',
            duration:1.5,
            onStart: function() {
                $('.loading_obj').css('visibility', 'visible'); 
                $('.loading_obj').css('z-index', '100'); 
            },
            onComplete: function() {
                // 儲存數據到 sessionStorage
                sessionStorage.setItem("class_infos", class_infos);
                sessionStorage.setItem("class_id", class_id);
                console.log(class_infos);
                console.log(class_id);
                // 跳轉到 2pick 頁面
                if(class_id != null){
                    gsap.to('.loading_obj', {
                        opacity: 1,
                        y: '0em',
                        ease: 'power.out',
                        duration:1.5,
                        onStart: function() {
                            $('.loading_obj').css('visibility', 'visible'); // 在動畫結束後隱藏 loading_obj
                        },
                        onComplete:function(){
                            setTimeout(() => {
                                window.location.href = "2pick.html";
                            }, 500);
                        }
                    });
                    console.log(class_infos);
                    console.log(class_id);

                }
            }
        });
    });

}

function getRandomDoc(docs, count) {
    const shuffled = docs.sort(() => 0.5 - Math.random()); // 隨機打亂數組
    return shuffled.slice(0, count); // 取前 count 個文檔
}
function mouseHoverSearch()
{
    $('.search_button').on('mouseenter', function(){
        search_box_button_hovered = true;
        gsap.to(this,{
            scale:1.2
        })
        $(this).children().children('.card_text').css('color','white');
    });
    $('.search_button').on('mouseleave', function(){
        search_box_button_hovered = false;
        gsap.to(this,{
            scale:1
        })
        $(this).children().children('.card_text').css('color','rgb(55, 63, 103)');
    });
    $('.search_field').on('mouseenter', function(){
        search_box_field_hovered = true;
    });
    $('.search_field').on('mouseleave', function(){
        search_box_field_hovered = false;
    });
    $('.search_button').on('click', function() {
        console.log(search_box_switch)
        if(!search_box_switch)
        {
            search_box_switch = true;
            search_box_switch_CD = true;
            gsap.to('.search_field',{
                width:250
            })
            gsap.timeline().to(this,{
                x:210,
                duration:0.5
            })
            .to(this,{
                x:200,
                duration:0.2,
                onComplete:function(){
                    setTimeout(() => {
                        search_box_switch_CD = false;
                    }, 50);
                }
            })
        }
        else{
            search_box_switch_CD = true;
            setTimeout(() => {
                search_box_switch_CD = false;
            }, 50);
        }
    });
    $('html').on('click', function() {
        if(search_box_switch_CD || search_box_button_hovered || search_box_field_hovered) return;

        gsap.to('.search_field',{
            width:50
        })
        gsap.timeline().to('.search_button',{
            x:0,
            onComplete:function(){ 
                search_box_switch = false;
            }
        })
    });
    
}
function mouseHoverCard(){
    $('.card').on('mouseenter', function(){
        gsap.to(this,{
            scale:1.5
        })
        $(this).children().children('.card_text').css('color','white');
    });
    $('.card').on('mouseleave', function(){
        gsap.to(this,{
            scale:1
        })
        $(this).children().children('.card_text').css('color','rgb(55, 63, 103)');
    });
    $('.card').on('click', function() {
        if(picture_array.length <= selection_id) return;
        gsap.to('.loading_obj', {
            opacity: 1,
            y: '0em',
            ease: 'power4.out',
            duration:1.5,
            onStart: function() {
                $('.loading_obj').css('visibility', 'visible'); 
                $('.loading_obj').css('z-index', '100'); 
            },
            onComplete: function() {
                // 儲存數據到 sessionStorage
                sessionStorage.setItem("class_infos", class_infos);
                sessionStorage.setItem("class_id", class_id);
                console.log(class_infos);
                console.log(class_id);
                // 跳轉到 2pick 頁面
                if(class_id != null){
                    gsap.to('.loading_obj', {
                        opacity: 1,
                        y: '0em',
                        ease: 'power.out',
                        duration:1.5,
                        onStart: function() {
                            $('.loading_obj').css('visibility', 'visible'); // 在動畫結束後隱藏 loading_obj
                        },
                        onComplete:function(){
                            setTimeout(() => {
                                window.location.href = "2pick.html";
                            }, 500);
                        }
                    });
                    console.log(class_infos);
                    console.log(class_id);

                }
            }
        });
    });
}
