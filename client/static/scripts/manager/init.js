function login() {
    ACCOUNT = document.getElementById("account").value;
    if (ACCOUNT.length <= 0) {
        addTips("请输入有效账号");
        return;
    }
    initWs();
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

    SELECTED_PLAYER = undefined;
    SELECTED_PLAYER_NUM = -1;

    $(".clear").html("");
    $("body")[0].style.background = "linear-gradient(to right bottom, rgb(93 181 83 / 60%), rgb(255 4 4 / 45%))";
}