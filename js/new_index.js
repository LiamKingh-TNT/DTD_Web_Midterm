
var class_id;
var class_infos;
var can_start;
var menu_clicked = false;


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
        const img = document.createElement('img');
        img.classList.add('card_img');
        img.src = "../images/deku.jpg"
        card.classList.add('card');
        card.appendChild(img);
        wheel.appendChild(card);
        
        // 计算卡片的角度和位置
        const angle = (360 / numCards) * i  - 30; // 计算每张卡片的角度
        
        // 设置卡片的位置
        card.style.transform = `rotate(${angle}deg) translate(0px, -1300px) `;
    }

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
