let ACCOUNT = "";
let STRING_CONFIG = {};
let EMOJI_CONFIG = {};
let ROOM_DATA = {};

let ALL_SEAT = [];
let ALL_PLAYER = {};

let SELECTED_CARD_DIVS = [];
let SELECTED_CARD_NUM = -1;

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

    SELECTED_CARD_DIVS = [];
    SELECTED_CARD_NUM = -1;

    $(".clear").html("");
    $("body")[0].style.background = "linear-gradient(to bottom right, #6ac9c5, #c968c9)";
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

/**
 * @param select 选择器
 * @param click 点击事件
 * @param press 长按事件
 */
function setDivClickEvent(select, click, press) {
    $(select).on({
        mousedown: function (e) {
            DIV_CLICK_EVENT_DOWN_START = e.pageX;
            const $this = $(this);
            let timer = setTimeout(() => {
                press($this);
            }, 250);
            $this.data('longPressTimer', timer);
        },
        mouseup: function () {
            clearTimeout($(this).data('longPressTimer'));
        },
        mousemove: function (e) {
            if (typeof DIV_CLICK_EVENT_DOWN_START == "undefined") {
                return;
            }

            if (Math.abs(e.pageX - DIV_CLICK_EVENT_DOWN_START) > 5) {
                clearTimeout($(this).data('longPressTimer'));
            }
        },
        touchstart: function (e) {
            DOWN_START = e.originalEvent.touches[0].pageX;
            const $this = $(this);
            let timer = setTimeout(() => {
                press($this);
            }, 250);
            $this.data('longPressTimer', timer);
        },
        touchend: function () {
            clearTimeout($(this).data('longPressTimer'));
        },
        touchmove: function (e) {
            if (typeof DIV_CLICK_EVENT_DOWN_START == "undefined") {
                return;
            }

            if (Math.abs(e.originalEvent.touches[0].pageX - DIV_CLICK_EVENT_DOWN_START) > 5) {
                clearTimeout($(this).data('longPressTimer'));
            }
        },
        click: function (e) {
            if (e.originalEvent.detail === 1) {
                click(this);
            }
        }
    });
}

function openFloating(id) {
    const handCard = ALL_PLAYER[ACCOUNT].getHandCard(id);
    if (!handCard) {
        return;
    }

    const overlay = document.getElementById('floating-window');

    let html = "";
    html += "卡牌介绍：</br>";
    html += "名称：" + STRING_CONFIG[handCard.cardId + "_name"] + "</br>";
    html += "描述：" + STRING_CONFIG[handCard.cardId + "_desc"] + "</br>";
    html += "颜色：" + STRING_CONFIG["color_" + handCard.color] + "</br>";
    html += "传递方式：" + STRING_CONFIG[handCard.operation] + "</br>";
    if (handCard.operation !== "ope_z") html += "传递方向：" + STRING_CONFIG[handCard.direction] + "</br>";
    if (handCard.lock) html += "锁定：无法被烧毁的情报</br>";

    setHtml(".floating-window-content", html);

    overlay.classList.add("floating-open")
}

function closeFloating() {
    const overlay = document.getElementById('floating-window');

    overlay.classList.remove("floating-open")
}

function emptyFunction(a = undefined, b = undefined, c = undefined, d = undefined, e = undefined) {
}

function clickSubmit(div, needNum, root) {
    console.info(div, needNum, root);
}

function clickCancel(div, root) {
    console.info(div, root);
}
