function login() {
    ACCOUNT = document.getElementById("account").value;
    if (ACCOUNT.length <= 0) {
        addTips("请输入有效账号");
        return;
    }
    initWs();
}

function initLogin() {
    const params = getQueryParams();
    if (params.account && params.account.length > 0) $("#account").val(params.account);
    if (params.url && params.url.length > 0) $("#url").val(params.url);

    $(".clear").html("");
    $(".clearAndRemove").remove();
    $("body")[0].style.background = "#6d7a8a";
}

function initHall() {
    $("#changeAccount").html("【" + ACCOUNT + "】");
    const params = getQueryParams();
    if (params.roomId && params.roomId.length > 0) $("#joinRoomId").val(params.roomId);
    $("body")[0].style.background = "#5385c3";
}

function initRoom() {
    ALL_PLAYER = {};
    ALL_CARD = {};

    SELECTED_CARD_DIVS = [];
    SELECTED_CARD_NUM = -1;

    SELECTED_PLAYER = undefined;
    SELECTED_PLAYER_NUM = -1;

    OTHER_SELECT = {};

    $(".clear").html("");
    $(".clearAndRemove").remove();
    $("body")[0].style.background = "rgb(114 201 104 / 60%)";
}