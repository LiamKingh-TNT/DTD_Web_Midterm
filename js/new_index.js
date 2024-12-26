document.addEventListener('DOMContentLoaded', () => {
    let currentAngle = -30; // 輪盤初始角度
    let isCooldown = false; // 冷卻標誌位
    const cooldownTime = 10; // 冷卻時間（毫秒）

    // 獲取輪盤
    const wheel = document.querySelector('.wheel');

    // 滑鼠滾輪控制旋轉
    window.addEventListener('wheel', (event) => {
        if (isCooldown) return; // 如果在冷卻期間，直接返回
        isCooldown = true;
        const delta = event.deltaY > 0 ? 20 : -20; // 每次滾動的角度
        currentAngle += delta;
        offset = event.deltaY > 0 ? 5 : -5;
        // 使用 GSAP 旋轉輪盤
        gsap.timeline().to(wheel, {
            rotation: currentAngle + offset,
            duration: 0.5,
            ease: 'power2.in'
        })
        .to(wheel,{
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
