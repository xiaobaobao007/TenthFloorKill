let ACCOUNT = "";
let STRING_CONFIG = {};
let MY_CARD = [];
let ROOM_DATA = {};

function addTips(tips) {
    let allPopups = document.querySelectorAll('.floating-popup');
    let bottomMostPopup = null;
    let bottomMostY = -Infinity;

    // 找出最下方的浮动提示框
    allPopups.forEach(popup => {
        let rect = popup.getBoundingClientRect();
        if (rect.bottom > bottomMostY) {
            bottomMostY = rect.bottom;
            bottomMostPopup = popup;
        }
    });

    const popup = document.createElement('div');
    popup.classList.add('floating-popup');
    popup.classList.add('show');

    if (bottomMostPopup) {
        let rect = bottomMostPopup.getBoundingClientRect();
        popup.style.top = (rect.bottom + 5) + 'px';
    } else {
        popup.style.top = '5px';
    }

    const message = document.createElement('p');
    message.textContent = tips;
    popup.appendChild(message);

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.top = '-100px';
        // 动画结束后移除提示框
        setTimeout(() => {
            popup.remove();
        }, 300);
    }, 2000);
}

function openBody(name) {
    $(".body").each(function () {
        if (this.id === "body-" + name) {
            $(this).show();
            switch (name) {
                case "login":
                    initLogin();
                    break;
                case "hall":
                    initHall();
                    break;
                case "room":
                    initRoom();
                    break;
            }
        } else {
            $(this).hide();
        }
    });
}

function initLogin() {
    $("body")[0].style.backgroundColor = "#6d7a8a";
}

function initHall() {
    initLeaveAccount();
    $("body")[0].style.backgroundColor = "#5385c3";
}

function initRoom() {
    $("body")[0].style.backgroundColor = "#c6d9ee";
}