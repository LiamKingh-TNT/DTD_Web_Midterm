var chosen_class;
var class_id;
var class_infos;
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
    
    classRef.get().then((querySnapshot) => {
        const docs = [];
        querySnapshot.forEach((doc) => {  // 修正這裡
            docs.push({ id: doc.id, data: doc.data() });
        });

        const selectedDoc = getRandomDoc(docs, 3);  // 修正這裡
        console.log("隨機選擇的文檔:", selectedDoc);

        for(var i = 1; i <= 3; i++) {
            const data = selectedDoc[i - 1].data;  // 使用 data 屬性
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
                if(i == 2)
                {
                    const class_name = data.class_name;
                    $('.name h1').text(class_name);
                    $('.left-image img').attr('src', img1Src);
                    $('.right-image img').attr('src', img2Src);
                }
            } else {
                console.error("class_menbers 不存在");
            }
        }
    }).catch((error) => {
        console.error("獲取文檔時發生錯誤:", error);
    });

    $('button').click(function() {
        var tempID = $(this).attr('id');
        class_id = tempID.substr(1,tempID.length); // 使用 attr 獲取 ID
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

function getRandomDoc(docs, count) {
    const shuffled = docs.sort(() => 0.5 - Math.random()); // 隨機打亂數組
    return shuffled.slice(0, count); // 取前 count 個文檔
}
