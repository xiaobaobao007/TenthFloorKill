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


/**
 *     <div class="player-box me-box">
 *         <div class="box-account">账号</div>
 *         <div class="box-heroName">英雄名字</div>
 *     </div>
 */
function updateRoomData() {
    //设置房间号
    const roomInfo = $(".roomInfo")[0];
    roomInfo.innerHTML = "房间号：" + ROOM_DATA.roomId;

    //隐藏退出按钮
    if (ROOM_DATA.running) {
        $(".room-quit").hide();
    } else {
        $(".room-quit").show();
    }

    const playerArray = ROOM_DATA.player;

    //寻找我在玩家数组中的位置
    let meIndex = -1;
    for (let i = 0; i < playerArray.length; i++) {
        if (playerArray[i].name === ACCOUNT) {
            meIndex = i;
            break;
        }
    }

    const waitingRoom = document.getElementById('body-room');

    for (let seatIndex = 0, playerIndex = 0; seatIndex < positionArray.length; seatIndex++, playerIndex++) {
        if (seatIndex >= playerArray.length && ROOM_DATA.running) {
            continue;
        }

        if (playerIndex >= playerArray.length) {
            playerIndex = 0;
        }

        const positionInfo = positionArray[seatIndex];
        const playerInfo = playerArray[playerIndex];

        let newPlayer = document.createElement("div");
        newPlayer.classList.add("player-box");

        let html = "";
        if (seatIndex >= playerArray.length) {
            //空位
            newPlayer.classList.add("empty-box");
        } else {
            if (seatIndex === 0) {
                //自己
                newPlayer.classList.add("me-box");
            } else {
                //其他人
                newPlayer.classList.add("other-box");
            }
            html += "<div class='box-account'>" + playerInfo.name + "</div>";
            html += "<div class='box-heroName'>英雄名字</div>";
        }

        newPlayer.innerHTML = html;

        newPlayer.style.left = positionInfo.x + "vw";
        newPlayer.style.top = positionInfo.y + "%";

        waitingRoom.appendChild(newPlayer);
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

function addMyCard(cardArray) {
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
