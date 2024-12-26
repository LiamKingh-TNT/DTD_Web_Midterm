
var class_id;
var class_infos;
var can_start;
var menu_clicked = false;
var card_list = Array(18);

$(document).ready(function() {
    let currentAngle = -30; // 輪盤初始角度
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
    const classRef = data_base.collection("classroom");

    loading = 1;

    // 獲取輪盤
    const wheel = document.querySelector('.wheel');

    // 生成卡片
    const numCards = 18; // 轮盘上的卡片数量
    for (let i = 0; i < numCards; i++) {
        const card = document.createElement('div');
        const card_inner = document.createElement('div');
        const img = document.createElement('img');
        const p = document.createElement('p');
        card_inner.classList.add('card_inner');
        p.classList.add('card_text');
        p.textContent ='圖片';
        img.classList.add('card_img');
        img.src = "../images/deku.jpg";
        card.classList.add('card');
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

    
    classRef.get().then((querySnapshot) => {
        const docs = [];
        querySnapshot.forEach((doc) => {  
            docs.push({ id: doc.id, data: doc.data() });
        });

        console.log(docs.length);

        selection_count = docs.length > 18? 18: docs.length;
        const selectedDoc = getRandomDoc(docs, selection_count);  
        console.log("隨機選擇的文檔:", selectedDoc);

        for(var i = 1; i <= selection_count; i++) {
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

                // 獲取一個隨機成員的資料
                const img1Src = class_menbers[menberKeys[randomIndexes[0]]][2]; // 圖片路徑
                
                // 設置圖片源
                $(card_list[i]).attr('id', '#' + selectedDoc[i - 1].id);
                console.log(selectedDoc[i-1].id);
                $(card_list[i].querySelector('div')).find('img:first').attr('src', img1Src);  // 使用 '.' 前綴選擇器
                
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
        if (isCooldown) return; // 如果在冷卻期間，直接返回
        isCooldown = true;
        const delta = event.deltaY > 0 ? 20 : -20; // 每次滾動的角度
        currentAngle += delta;
        const offset = event.deltaY > 0 ? 5 : -5;
        
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
            },
            onComplete: () => {
                // 動畫完成後，啟動冷卻計時
                setTimeout(() => {
                    isCooldown = false; // 冷卻結束
                }, cooldownTime);
            }
        });
    });
});
function getRandomDoc(docs, count) {
    const shuffled = docs.sort(() => 0.5 - Math.random()); // 隨機打亂數組
    return shuffled.slice(0, count); // 取前 count 個文檔
}