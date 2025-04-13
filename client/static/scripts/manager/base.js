let ACCOUNT = "";
let STRING_CONFIG = {};
let EMOJI_CONFIG = {};
let ROOM_DATA = {};

let ALL_SEAT = [];
let ALL_PLAYER = {};

const POSITION_DATA = [
    {type: "me", intelligence: "top"},
    {type: "other2", intelligence: "top", left: 1, top: 16},
    {type: "other3", intelligence: "bottom", left: 20, top: 1},
    {type: "other4", intelligence: "bottom", left: 42, top: 1},
    {type: "other5", intelligence: "bottom", left: 63, top: 1},
    {type: "other6", intelligence: "top", right: 2, top: 16},
    {type: "other7", intelligence: "top", right: 2, bottom: 1},
    {type: "other8", intelligence: "top", right: 20, bottom: 1},
];

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
    message.innerHTML = tips;
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
    $("body")[0].style.backgroundColor = "#5385c3";
}

function initRoom() {
    ALL_SEAT = [];
    ALL_PLAYER = {};
    $(".clear").html("");
    $("body")[0].style.backgroundColor = "#c6d9ee";
}

function changeShowOrHide(select, show) {
    if (show) {
        $(select).show();
    } else {
        $(select).hide();
    }
}

function setHtml(select, html) {
    $(select).html(html);
}