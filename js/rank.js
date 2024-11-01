// main.js
var ranking_rt = sessionStorage.getItem('ranking_rt');
var class_infos;
var class_id;
var characters = [[]];
var menubuttonCanClick = false;
$(document).ready(function() {
    let data = sessionStorage.getItem('characters'); // 讀取字符串數據
    $('.loading_obj').css('visibility', 'hidden');
    $('.menu_button').css('pointer-envents', 'none');
    gsap.set('.menu_button',{y:1000});
    gsap.set('.loading_obj', {y:-500, opacity:0});
    console.log('Characters:', data); // 檢查生成的二維陣列
    if (data) {
        // 1. 分割字符串為一維數組
        const items = data.split(',');

        // 2. 初始化二維數組
        characters = [];

        // 3. 將每四個元素組織成一個子陣列
        for (let i = 0; i < items.length; i += 4) {
            // 將四個元素切片
            const group = items.slice(i, i + 4);
            characters.push(group); // 將切片後的子陣列推入二維數組
        }

        console.log('Characters:', characters); // 檢查生成的二維陣列
    } else {
        console.error("未找到 characters 的資料");
    }
    console.log('Characters:', characters); // 檢查生成的二維陣列

    console.log("ranking_rt:" + ranking_rt);
    if (typeof ranking_rt === 'string') {
        ranking_rt = ranking_rt.split(',').map(Number);
    }
    console.log("ranking_rt:" + ranking_rt);
    console.log(characters);
    ranking_rt = ranking_rt.reverse();
    characters = characters;
    /*characters.sort((a, b) => {
        return (parseInt(a[3]) - 1) - (parseInt(b[3]) - 1); // 根據第四個元素排序
    });*/
    console.log("排序后的 ranking_rt:", ranking_rt);

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
    
    speedLine();
    gen_ranks();
    mouseHover();
    console.log('Characters:', characters); // 檢查生成的二維陣列


});

function mouseHover(){
    if(menubuttonCanClick)
    {
        $('.menu_button').on('mouseenter', function(){
            gsap.to(this,{
                scale:1.5
            })
            $('.menu_button_text').css('color','white');
        });
        $('.menu_button').on('mouseleave', function(){
            gsap.to(this,{
                scale:1
            })
            $('.menu_button_text').css('color','rgb(55, 63, 103)');
        });
        $('.menu_button').on('click', function() {
            gsap.to('.loading_obj', {
                opacity: 1,
                y: '0em',
                ease: 'power4.out',
                duration:0.5,
                onStart: function() {
                    $('.loading_obj').css('visibility', 'visible'); 
                },
                onComplete: function() {
                    window.location.href = "index.html";
                }
            });
        });
    }
    
}

function speedLine()
{
    const lineCount = 50;
    const container = document.querySelector('.speed_lines');

    // 速度限制
    const maxSpeed = 0.1;

    // 创建速度线条元素并添加到容器
    for (let i = 0; i < lineCount; i++) {
        createSpeedLine();
    }

    // 创建单个速度线条元素
    function createSpeedLine() {
        const line = document.createElement('div');
        line.classList.add('speed_line');
        
        // 随机宽度、高度和水平位置
        line.style.left = `${Math.random() * 100}vw`;
        line.style.height = `${50 + Math.random() * 150}px`; // 随机长度
        line.style.opacity = Math.random() * 0.3 + 0.1; // 随机透明度
    
        // 初始位置在视野上方，随机偏离
        const startY = -Math.random() * 100 - 100; // 离视野顶部 100-200px 处
        line.style.transform = `translateY(${startY}px)`;
        container.appendChild(line);
    
        // 初始化下落动画
        const duration = 1 + Math.random(); // 随机初始速度
        const animation = gsap.to(line, {
            y: '100vh',
            ease: 'power1.in', // 初始加速效果
            duration: duration,
            repeat: -1,
            onRepeat: function() {
                // 每次重置位置时，增加一点速度并随机水平位置
                this.duration(Math.max(maxSpeed, this.duration() * 0.95)); // 控制在 maxSpeed 内
                line.style.left = `${Math.random() * 100}vw`;
                line.style.transform = `translateY(${startY}px)`; // 重新设置起始位置
    
                // 清除已完全离开视野的线条
                if (parseFloat(line.style.y) >= window.innerHeight) {
                    gsap.killTweensOf(line); // 停止动画
                    line.remove(); // 移除元素
                    createSpeedLine(); // 创建新的速度线
                }
            }
        });
    }
}

function gen_ranks() {
    console.log(characters);
    const minRanks = 3;
    const maxRanks = 7;

    // 計算生成的排名數量（3 到 7 個）
    const temp = Math.min(Math.max(ranking_rt.length, minRanks), maxRanks);
    const maxItems = (temp % 2 === 0) ? temp - 1 : temp;
    console.log('ranking_rt[0]' + ranking_rt[0])
    console.log("characters[ranking_rt[0]] : " + characters[ranking_rt[0]]);
    // 獲取排名區塊容器並清空
    const rankingBoxesContainer = document.querySelector('.ranking_boxes');
    rankingBoxesContainer.innerHTML = "";

    const centerIndex = Math.floor(maxItems / 2); // 中間位置索引
    console.log('centerIndex : ' + centerIndex);
    const temp2 = ranking_rt.slice(0, maxItems);
    console.log('temp2 '+temp2);
    temp2.reverse();
    var temp3 = rearrangeArray(temp2);
    const sortedIndices = temp3;
    console.log("sortedIndices:",sortedIndices);
    for(var i = 0; i < sortedIndices.length; i++)
    {
        var the_rank = 0;
        if(i == Math.floor(sortedIndices.length / 2)) the_rank = 1;
        if(i == Math.floor(sortedIndices.length / 2) +1 ) the_rank = 2;
        if(i == Math.floor(sortedIndices.length / 2) -1) the_rank = 3;
        createRankingBox(sortedIndices[i], the_rank);
    }
    const runners = document.querySelectorAll('.ranking_box');

    // 設定初始隨機 Y 軸偏移位置
    runners.forEach((runner, index) => {
        const initialY = -Math.random() * 100; // 隨機起始偏移
        gsap.set(runner, { y: initialY });
        gsap.set('.menu_button', { y: -1200, rotate: 10 });
    });

    // 定義各個排名的主賽跑動畫和隨機 X 軸偏移
    runners.forEach((runner, index) => {
        const yDistance = 600 + index * 300; // 隨著排名遞增的 Y 軸目標距離
        const duration = 5 + index; // 隨著排名遞增的時間
        gsap.set(runner, {
            y: yDistance, // 目標 Y 位置
            ease: "power2.inOut",
            onComplete:function(){
                // 定義各個排名的動畫效果
                gsap.timeline()
                .to('.rank_1', { y: -200, duration: 4, ease: 'power2.inOut' })
                .to('.rank_2', { y: -100, duration: 4.5, ease: 'power2.inOut' }, '<')
                .to('.rank_3', { y: 0, duration: 5, ease: 'power2.inOut' }, '<')
                .to('.rank_0', { y: 100, duration: 5.5, ease: 'power2.inOut' , stagger:0.5}, '<')
                .to('.rank_1', { y: -150, duration: 2.5, ease: 'power2.inOut' })
                .to('.rank_2', { y: 0, duration: 2.5, ease: 'power2.inOut' }, '<')
                .to('.rank_3', { y: 100, duration: 2.5, ease: 'power2.inOut' }, '<')
                .to('.rank_0', { y: 600, duration: 2.5, ease: 'power2.inOut', onComplete:function(){$(".rank_0").css("visibility","hidden")}}, '<')
                .to('.rank_1', { y: -550, duration: 1, ease: 'power2.in' })
                .to('.rank_2', { y: -550, duration: 1, ease: 'power2.in' }, '<')
                .to('.rank_3', { y: -550, duration: 1, ease: 'power2.in' }, '<')
                .to('.rank_1', { y: -50,scaleX : 3.8,scaleY : 3,x: 0, duration: 0.5, ease: 'power4.in',onComplete:function(){gsap.to('.rank_1', {scaleX : 3,scaleY : 3,y:-60, duration: 0.3, ease: 'power4.out'})} })
                .to('.rank_2', { y: 50,scaleX : 3,scaleY : 2, x: 250, duration: 1, ease: 'power4.in',onComplete:function(){gsap.to('.rank_2', {scaleX : 2.5,scaleY : 2.5,y:40, duration: 0.3, ease: 'power4.out'})} }, '<')
                .to('.rank_3', { y: 100,scaleX : 2,scaleY : 1.5, x: -220, duration: 1.5, ease: 'power4.in',onComplete:function(){gsap.to('.rank_3', {scaleX : 2,scaleY : 2,y:70, duration: 0.3, ease: 'power4.out'})} }, '<')
                .to('.speed_line', { opacity: 0, duration: 1.5, ease: 'power4.inOut' }, '<')
                .to('.switch_cover', { gap: 0, duration: 1.5, ease: 'power4.inOut' }, '<')
                .to('.menu_button', { y: -20, rotate: 10, visibility: 'visible', duration: 1, ease: 'power4.in' 
                    ,onComplete:function(){
                        gsap.timeline()
                        .to('.menu_button', { y: -60, rotate: -5, visibility: 'visible', duration: 0.3, ease: 'leaner' })
                        .to('.menu_button', { y: -40, rotate: 0, visibility: 'visible', duration: 0.2, ease: 'power4.out',onComplete:function(){
                        menubuttonCanClick = true;
                        console.log(menubuttonCanClick);
                        mouseHover();
                        $('.menu_button').css('pointer-envents', 'all');
                        } });
                    }
                }, '<')
                
                // 隨機 X 軸偏移動畫
                gsap.to(runner, {
                    x: () => gsap.utils.random(-20, 20), // 隨機的 X 軸偏移範圍
                    duration: 0.2, // 每次偏移的持續時間
                    repeat: duration * 6, // 偏移次數，和總時間相關
                    yoyo: true, // 使偏移往復
                    ease: "sine.inOut",
                });
            }
        }) ;

        
    });

}



function createRankingBox(index, rank) {
    console.log("ranking_rt:" + ranking_rt);
    if (ranking_rt[index] === undefined) return null;

    const rankingBox = document.createElement('div');
    rankingBox.className = `ranking_box rank_${rank}`;
    rankingBox.id = `sel_${characters[index][3]}`;

    // 創建圖片框架和文字內容
    const imgFrame = document.createElement('div');
    imgFrame.className = 'ranking_boxes_img';
    const img = document.createElement('img');
    img.src = `${characters[index][2]}`;
    img.className = 'ranking_box_img';
    imgFrame.appendChild(img);

    const boxFoot = document.createElement('div');
    boxFoot.className = 'ranking_box_foot';
    const footText1 = document.createElement('h1');
    footText1.className = 'ranking_box_foot_text';
    footText1.textContent = `${characters[index][0]}`;
    const footText2 = document.createElement('h2');
    footText2.className = 'ranking_box_foot_text_2';
    footText2.textContent = `${characters[index][1]}`;
    boxFoot.appendChild(footText1);
    boxFoot.appendChild(footText2);

    rankingBox.appendChild(imgFrame);
    rankingBox.appendChild(boxFoot);

    // 將 rankingBox 添加到 DOM
    document.querySelector('.ranking_boxes').appendChild(rankingBox);

    // 設置動畫
    gsap.set(`#sel_${characters[index][3]}`, { y: 1000 });
    const baseDuration = 1.5;
    const duration = baseDuration + (((rank === 0) ? 20 : rank * rank) * 0.8);


    return rankingBox;
}



function rearrangeArray(arr) {
    const length = arr.length;
    const result = new Array(length);  // 創建與原陣列相同長度的結果陣列
    var cal = arr.reverse();
    // 獲取中心索引，並將中心元素放置在新的中心位置
    let centerIndex = Math.floor(length / 2);
    result[centerIndex] = cal[0];
    for(var i = 0; i < arr.length; i+=2)
    {
        if(i === 0) continue;
        result[centerIndex - i/2] = cal[i];
        result[centerIndex + i/2] = cal[i -1];
    }

    return result;
}