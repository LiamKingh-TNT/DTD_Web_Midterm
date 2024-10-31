// main.js
var ranking_rt = sessionStorage.getItem('ranking_rt');
var class_infos;
var class_id;
var characters = [[]];

$(document).ready(function() {
    let data = sessionStorage.getItem('characters'); // 讀取字符串數據
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

    if (typeof ranking_rt === 'string') {
        ranking_rt = ranking_rt.split(',').map(Number);
    }
    console.log("ranking_rt:" + ranking_rt);
    ranking_rt = ranking_rt.reverse();
    characters = characters.reverse();
    // 确保最后两个元素在 ranking_rt 数组中
    if (ranking_rt.length >= 2) {
        const lastTwo = ranking_rt.slice(-2); // 获取最后两个元素
        console.log("最后两个元素:", lastTwo);
    }

    // 打印排序后的数组
    console.log("排序后的 ranking_rt:", ranking_rt);
    console.log("ranking_rt:" + ranking_rt);

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
    console.log('Characters:', characters); // 檢查生成的二維陣列


});

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

    // 獲取排名區塊容器並清空
    const rankingBoxesContainer = document.querySelector('.ranking_boxes');
    rankingBoxesContainer.innerHTML = "";

    const centerIndex = Math.floor(maxItems / 2); // 中間位置索引
    const temp2 = ranking_rt.slice(0, maxItems)
    var temp3 = [maxItems];
    for(var i = 0, j = 1; i < temp2.length; i++)
    {
        if(i == 0)
        {
            temp3[centerIndex] = temp2[i];
        }
        else if(i % 2 === 0)
        {
            temp3[centerIndex + j] = temp2[i];
            j++;
        }
        else{
            temp3[centerIndex - j] = temp2[i];
        }
    }

    const sortedIndices =temp3;
    console.log("sortedIndices:",sortedIndices);
    // 根據排名生成元素並按左右兩側排放
    sortedIndices.forEach((rankIndex, i) => {
        // 使用排序後的 rankIndex 來獲取 ranking_rt 的值
        const rankValue = ranking_rt[rankIndex]; // 確保這裡是正確的索引
        if (rankValue === undefined) return; // 防止未定義的情況

        const rankingBox = createRankingBox(rankIndex); // 使用原始索引生成 rankingBox
        if (!rankingBox) return;

        if (i === 0) {
            // 第一名放置在中間
            rankingBoxesContainer.insertBefore(rankingBox, rankingBoxesContainer.children[centerIndex] || null);
        } else if (i % 2 === 1) {
            // 奇數索引放置在右側
            rankingBoxesContainer.insertBefore(rankingBox, rankingBoxesContainer.children[centerIndex + i]);
        } else {
            // 偶數索引放置在左側
            rankingBoxesContainer.insertBefore(rankingBox, rankingBoxesContainer.children[centerIndex - i]);
        }
    });
}


function createRankingBox(index) {
    console.log("ranking_rt:" + ranking_rt);
    if (ranking_rt[index] === undefined) return null;

    const rankingBox = document.createElement('div');
    rankingBox.className = 'ranking_box';
    rankingBox.id = `sel_${characters[ranking_rt[index] - 1][3]}`;

    // 創建圖片框架和文字內容
    const imgFrame = document.createElement('div');
    imgFrame.className = 'ranking_boxes_img';
    const img = document.createElement('img');
    img.src = `${characters[ranking_rt[index] - 1][2]}`; // 根據需要修改圖片路徑
    img.className = 'ranking_box_img';
    imgFrame.appendChild(img);

    const boxFoot = document.createElement('div');
    boxFoot.className = 'ranking_box_foot';
    const footText1 = document.createElement('h1');
    footText1.className = 'ranking_box_foot_text';
    footText1.textContent = `Selection ${characters[ranking_rt[index] - 1][0]}`;
    const footText2 = document.createElement('h2');
    footText2.className = 'ranking_box_foot_text_2';
    footText2.textContent = `Selection ${characters[ranking_rt[index] - 1][1]}`;
    boxFoot.appendChild(footText1);
    boxFoot.appendChild(footText2);

    rankingBox.appendChild(imgFrame);
    rankingBox.appendChild(boxFoot);

    // 將 rankingBox 添加到 DOM
    document.querySelector('.ranking_boxes').appendChild(rankingBox);

    // 設置動畫
    gsap.set(`#sel_${characters[ranking_rt[index] - 1][3]}`, { y: 1000 }); // 初始位置設置在下方
    const baseDuration = 1.5; // 基本動畫時長
    const duration = baseDuration + (index * 0.6); // 根據排名調整速度
    gsap.fromTo(
        `#sel_${characters[ranking_rt[index] - 1][3]}`,
        { y: '100%', opacity: 0 },
        {
            y: '-10%',
            opacity: 1,
            duration: Math.max(duration, 0.5), // 最低動畫時長限制
            ease: "power4.out",
        }
    );

    return rankingBox;
}
