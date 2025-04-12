/**
 *     <div class="player-box me-box">
 *         <div class="box-account">账号</div>
 *         <div class="box-heroName">英雄名字</div>
 *     </div>
 */
function updateRoomData() {
    //清理数据
    $(".player-box").remove();

    //设置房间号
    setHtml(".roomInfo", "房间号：" + ROOM_DATA.roomId);

    //隐藏退出按钮
    changeShowOrHide(".room-start", ACCOUNT === ROOM_DATA.leaderAccount);
    changeShowOrHide(".room-quit", !ROOM_DATA.running);

    //组装玩家信息
    updateAllPlayer();

    //绘制所有人的情报
    updateAllPlayerIntelligence();

    //设置我的手牌
    updateMyHandCard();
}

function updateAllPlayer() {
    const playerArray = ROOM_DATA.player;

    //寻找我在玩家数组中的位置
    let startIndex = -1;
    for (let i = 0; i < playerArray.length; i++) {
        if (playerArray[i].name === ACCOUNT) {
            startIndex = i;
            break;
        }
    }

    const waitingRoom = document.getElementById('body-room');

    for (let seatIndex = 0; seatIndex < POSITION_DATA.length; seatIndex++, startIndex++) {
        if (seatIndex >= playerArray.length && ROOM_DATA.running) {
            continue;
        }

        if (startIndex >= playerArray.length) {
            startIndex = 0;
        }

        let newPlayerDiv = document.createElement("div");

        const positionInfo = POSITION_DATA[seatIndex];

        const seatModel = new Seat();
        seatModel.index = seatIndex;
        seatModel.div = newPlayerDiv;

        ALL_SEAT.push(seatModel);

        newPlayerDiv.classList.add("player-box");

        let html = "";
        if (seatIndex >= playerArray.length) {
            //空位
            newPlayerDiv.classList.add("empty-box");
        } else {
            const playerInfo = playerArray[startIndex];

            let playerModel = new Player(playerInfo);
            playerModel.init(playerInfo);
            ALL_PLAYER[playerModel.account] = playerModel;
            playerModel.div = newPlayerDiv;
            playerModel.seat = seatModel;

            seatModel.player = playerModel;

            if (seatIndex === 0) {
                //自己
                newPlayerDiv.classList.add("me-box");
            } else {
                //其他人
                newPlayerDiv.classList.add("other-box");
            }

            html += "<div class='box-account'>" + playerInfo.name + "</div>";

            if (ROOM_DATA.leaderAccount === playerInfo.name) {
                html += "<div class='box-leader'>" + EMOJI_CONFIG.leader + "</div>";
            }

            html += "<div class='box-heroName'></div>";
        }

        html += "<div class='player-intelligence player-intelligence-" + positionInfo.intelligence + "'></div>";

        if (positionInfo.left) newPlayerDiv.style.left = positionInfo.left + "vw";
        if (positionInfo.top) newPlayerDiv.style.top = positionInfo.top + "vw";
        if (positionInfo.right) newPlayerDiv.style.right = positionInfo.right + "vw";
        if (positionInfo.bottom) newPlayerDiv.style.bottom = positionInfo.bottom + "vw";

        newPlayerDiv.innerHTML = html;
        waitingRoom.appendChild(newPlayerDiv);
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

    setHtml("floating-window-content", html);
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

        if (card.ope === "ope_z") {
            tips += EMOJI_CONFIG.ope_z;
        } else {
            if (card.dir === "dir_") tips += EMOJI_CONFIG.dir_;
            if (card.ope === "ope_m") tips += EMOJI_CONFIG.ope_m;
            else if (card.ope === "ope_w") tips += EMOJI_CONFIG.ope_w;
            else if (card.ope === "ope_") tips += EMOJI_CONFIG.ope_;
        }

        if (card.lock) tips += EMOJI_CONFIG.lock;

        html += "<div class='card-tips'>" + tips + "</div>";
        html += "</div>";
    }

    setHtml(".my-card", html);
}

function updateAllPlayerIntelligence() {
    for (const account in ALL_PLAYER) {
        const player = ALL_PLAYER[account];
        if (player.intelligenceArray.length === 0) {
            continue
        }

        const intelligence = $(player.div).children(".player-intelligence:first");
        intelligence.html("");

        for (const one of player.intelligenceArray) {
            let class_ = undefined;
            switch (one.color) {
                case "r":
                    class_ = "card-red";
                    break;
                case "g":
                    class_ = "card-grey";
                    break;
                case "b":
                    class_ = "card-blue";
                    break;
                case "d":
                    class_ = "card-double";
                    break;
                default:
                    break;
            }

            if (class_) {
                intelligence.append("<div class='intelligence " + class_ + "'></div>");
            }
        }
    }
}

function updateMyHandCard() {
    const player = ALL_PLAYER[ACCOUNT];

    const myHandCard = $(".my-card:first");
    myHandCard.html("");

    for (const one of player.handArray) {
        addHandCard(one);
    }
}

function addHandCard(card) {
    let html = "";
    let class_ = "card";

    if (card.color === "r") class_ += " card-red";
    else if (card.color === "g") class_ += " card-grey";
    else if (card.color === "b") class_ += " card-blue";
    else if (card.color === "d") class_ += " card-double";

    const name = STRING_CONFIG[card.cardId + "_name"];
    class_ += " card-name-" + name.length;

    html += "<div class='" + class_ + "' onclick='openFloating(" + JSON.stringify(card) + ")'>";
    html += "<div class='card-name'>" + name + "</div>";

    let tips = "";
    if (card.direction === "dir_") tips += EMOJI_CONFIG.dir_;

    if (card.operation === "ope_z") tips += EMOJI_CONFIG.ope_z;
    else if (card.operation === "ope_m") tips += EMOJI_CONFIG.ope_m;
    else if (card.operation === "ope_w") tips += EMOJI_CONFIG.ope_w;
    else if (card.operation === "ope_") tips += EMOJI_CONFIG.ope_;

    if (card.lock) tips += EMOJI_CONFIG.lock;

    html += "<div class='card-tips'>" + tips + "</div>";
    html += "</div>";

    $(".my-card:first").append(html);
}