document.addEventListener('DOMContentLoaded', () => {
    let currentAngle = 30;

    // 獲取輪盤和卡片
    const wheel = document.querySelector('.wheel');

    // 滑鼠滾輪控制旋轉
    window.addEventListener('wheel', (event) => {
        const delta = event.deltaY > 0 ? 60 : -60; // 每次滾動的角度
        currentAngle += delta;

        // 使用 GSAP 旋轉輪盤
        gsap.to(wheel, {
            rotation: currentAngle,
            duration: 0.5,
            ease: 'power2.out',
        });
    });
});
