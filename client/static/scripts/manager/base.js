//当前配置
let STRING_CONFIG = {};
let ALL_CAMP = [];
let USE_CARD_NEED_CHOOSE_PEOPLE = [];
let USE_CARD_NEED_CHOOSE_PEOPLE_WITH_ME = [];
let ROUND_USE_CARD = [];

//信息
let ACCOUNT = "";
let ROOM_DATA = {};
let ALL_PLAYER = {};

//缓存信息
let IN_ROUNDING = false;//在回合内
let SELECTED_CARD_DIVS = [];
let SELECTED_CARD_NUM = -1;
let SELECTED_PLAYER = undefined;
let SELECTED_PLAYER_NUM = -1;//目前暂时只支持选择其他玩家
let OTHER_SELECT = {};

const POSITION_DATA = [
    {type: "  me  ", intelligence: "top"},
    {type: "other2", intelligence: "top", left: 1, top: 16},
    {type: "other3", intelligence: "bottom", left: 22, top: 1},
    {type: "other4", intelligence: "bottom", left: 46, top: 1},
    {type: "other5", intelligence: "bottom", left: 70, top: 1},
    {type: "other6", intelligence: "top", right: 2, top: 16},
    {type: "other7", intelligence: "top", right: 2, bottom: 1},
    {type: "other8", intelligence: "top", right: 20, bottom: 1},
];

function addTips(tips) {
    let allPopups = $('.floating-popup:last')[0];

    const popup = document.createElement('div');
    popup.classList.add('floating-popup');
    popup.classList.add('show');

    if (allPopups) {
        popup.style.top = (allPopups.getBoundingClientRect().bottom + 5) + 'px';
    } else {
        popup.style.top = '5px';
    }

    const message = document.createElement('p');
    message.innerHTML = tips;
    popup.appendChild(message);

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 2000);
}

function openBody(name) {
    $(".body").each(function () {
        if (this.id !== "body-" + name) {
            $(this).hide();
        }
    });

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
        }
    });
}

function bodyIsShow(name) {
    return $("#body-" + name).css("display") !== "none";
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
    removeDivClickEvent(select);
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
        mouseout: function () {
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
        touchcancel: function () {
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
                e.stopPropagation();
                click(this);
            }
        }
    });
}

function removeDivClickEvent(select) {
    $(select).off("mousedown");
    $(select).off("mouseup");
    $(select).off("mouseout");
    $(select).off("mousemove");
    $(select).off("touchstart");
    $(select).off("touchend");
    $(select).off("touchcancel");
    $(select).off("touchmove");
    $(select).off("click");
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
    if (handCard.otherTips) html += "其他效果：" + STRING_CONFIG[handCard.otherTips] + "</br>";

    setHtml(".floating-window-content", html);

    overlay.classList.add("floating-open")
}

function closeFloating() {
    const overlay = document.getElementById('floating-window');

    overlay.classList.remove("floating-open")
}

function emptyFunction(a = undefined, b = undefined, c = undefined, d = undefined, e = undefined) {
}

function getQueryParams() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const params = {};
    urlParams.forEach((value, key) => {
        params[key] = value;
    });
    return params;
}

function notPenetrate(event) {
    event.stopPropagation();
}

function getEmoji(name) {
    const s = STRING_CONFIG[name + "_emoji"];
    if (s && s.length > 0) {
        return s;
    }
    return "";
}

function addNewEventTips(tips) {
    if (tips === undefined || tips.length === 0) {
        return;
    }

    const div = $(".room-event");
    if (div.length === 0) {
        return;
    }

    if (div.children(":last").html() === tips) {
        return;
    }

    const downRate = div[0].scrollHeight - div.scrollTop() - div.height() * 1.5;

    div.append("<div class='room-event-one'>" + tips + "</div>");

    if (downRate < 0) {
        div.scrollTop(div[0].scrollHeight - div.height());
    }
}