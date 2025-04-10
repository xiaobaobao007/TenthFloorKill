let ACCOUNT = "";
let STRING_CONFIG = {};

function addTips(tips) {
    const popup = document.createElement('div');
    popup.classList.add('floating-popup');
    popup.classList.add('show');

    const message = document.createElement('p');
    message.textContent = tips;
    popup.appendChild(message);

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.classList.add('hide');
        setTimeout(() => {
            document.body.removeChild(popup);
        }, 300);
    }, 1500);
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
    $("body")[0].style.backgroundColor = "#c6d9ee";
}