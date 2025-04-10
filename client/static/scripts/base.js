function judgeAccount() {
    if (typeof localStorage.getItem(ALL_PARAM.ACCOUNT) == "undefined") {
        // if (typeof localStorage.getItem(ALL_PARAM.ACCOUNT) == "undefined" || typeof ws == "undefined") {
        window.location.href = "index.html";
    }
}

ALL_PARAM = {
    ACCOUNT: "account"
}

function random(number) {
    return Math.floor(Math.random() * number);
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
    initWaitingRoomData();
    initMyCard();
    $("body")[0].style.backgroundColor = "#c6d9ee";
}