function initHallListener() {
    const sliderContainer = document.querySelector('.hall-container');
    let startX;
    let scrollLeft;

// 鼠标拖动
    sliderContainer.addEventListener('mousedown', (e) => {
        startX = e.pageX;
        scrollLeft = sliderContainer.scrollLeft;
    });
    sliderContainer.addEventListener('mousemove', (e) => {
        if (startX) {
            const x = e.pageX;
            const walk = (x - startX) * 2;
            sliderContainer.scrollLeft = scrollLeft - walk;
        }
    });
    sliderContainer.addEventListener('mouseup', () => {
        startX = null;
    });

// 手机拖动
    sliderContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX;
        scrollLeft = sliderContainer.scrollLeft;
    });
    sliderContainer.addEventListener('touchmove', (e) => {
        if (startX) {
            const x = e.touches[0].pageX;
            const walk = (x - startX) * 2;
            sliderContainer.scrollLeft = scrollLeft - walk;
        }
    });
    sliderContainer.addEventListener('touchend', () => {
        startX = null;
    });
}

function initLeaveAccount() {
    document.getElementById("leaveAccount").innerHTML = "退出【" + localStorage.getItem("account") + "】";
}

function leaveAccount() {
}