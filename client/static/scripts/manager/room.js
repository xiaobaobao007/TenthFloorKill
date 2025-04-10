const positionArray = [
    {type: "me"},
    {type: "other2", x: 0, y: 35},
    {type: "other3", x: 15, y: 10},
    {type: "other4", x: 36, y: 5},
    {type: "other5", x: 58, y: 5},
    {type: "other6", x: 80, y: 15},
    {type: "other7", x: 85, y: 55},
    {type: "other8", x: 68, y: 70},
];

function initWaitingRoomData() {
    positionArray[0].info = {
        name: ACCOUNT,
    };

    initWaitingRoom();
}

function initWaitingRoom() {
    const waitingRoom = document.getElementById('body-room');

    const playerBox0 = document.getElementById('playerBox0');

    for (let i = 1; i < positionArray.length; i++) {
        const positionArrayElement = positionArray[i];

        let newPlayerBox = positionArrayElement.div;
        if (!positionArrayElement.div) {
            newPlayerBox = document.createElement("div");
            positionArrayElement.div = newPlayerBox;
            waitingRoom.appendChild(newPlayerBox);
        }

        newPlayerBox.innerHTML = playerBox0.innerHTML;
        newPlayerBox.classList = playerBox0.classList;
        newPlayerBox.id = "playerBox" + i;

        newPlayerBox.classList.remove('me-box');
        if (positionArrayElement.info) {
        } else {
            newPlayerBox.classList.add('empty-box');
        }

        newPlayerBox.style.left = positionArrayElement.x + "vw";
        newPlayerBox.style.top = positionArrayElement.y + "%";
    }
}

function openFloating(data) {
    const overlay = document.getElementById('floating-window');
    overlay.style.display = 'flex';

    let html = "";
    if (data.type === "card") {
        html += "卡牌类型介绍：</br>";
        html += "名称：" + STRING_CONFIG[data.id + "_name"] + "</br>";
        html += "描述：" + STRING_CONFIG[data.id + "_desc"] + "</br>";
        html += "颜色：" + STRING_CONFIG["color_" + data.color] + "</br>";
        html += "传递方式：" + STRING_CONFIG[data.ope] + "</br>";
    }

    document.getElementsByClassName('floating-window-content')[0].innerHTML = html;
}

function closeFloating() {
    const overlay = document.getElementById('floating-window');
    overlay.style.display = 'none';
}

// {type: 'card', id: 'lj', color: 'r', dir: 'dir_r', ope: "ope_m", lock: true},
function initMyCard(cardArray) {
    let html = "";
    for (const card of cardArray) {
        let class_ = "card";
        if (card.color === "r") class_ += " card-red";
        else if (card.color === "g") class_ += " card-grey";
        else if (card.color === "b") class_ += " card-blue";
        else if (card.color === "d") class_ += " card-double";

        const name = STRING_CONFIG[card.id + "_name"];
        class_ += " card-name-" + name.length;

        html += "<div class='" + class_ + "' onclick='openFloating(" + JSON.stringify(card) + ")'>";
        html += "<div class='card-name'>" + name + "</div>";

        let tips = "";
        if (card.dir === "dir_") tips += "🔄";

        if (card.ope === "ope_z") tips += "✈";
        else if (card.ope === "ope_m") tips += "✉️";
        else if (card.ope === "ope_w") tips += "📄";
        else if (card.ope === "ope_") tips += "❔";

        if (card.lock) tips += "🔒";

        html += "<div class='card-tips'>" + tips + "</div>";
        html += "</div>";
    }

    document.getElementsByClassName('my-card')[0].innerHTML = html;
}
