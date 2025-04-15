function updateAllPlayer() {
    const playerArray = ROOM_DATA.player;

    //寻找我在玩家数组中的位置
    let startIndex = -1;
    for (let i = 0; i < playerArray.length; i++) {
        if (playerArray[i].name === ACCOUNT) {
            if (i + 1 === playerArray.length) {
                startIndex = 0;
            } else {
                startIndex = i + 1;
            }
            break;
        }
    }

    const waitingRoom = document.getElementById('body-room');

    for (let seatIndex = ROOM_DATA.running ? playerArray.length - 1 : POSITION_DATA.length - 1; seatIndex >= 0; seatIndex--, startIndex++) {
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

            let playerModel = new PlayerModel(playerInfo);
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

            if (ROOM_DATA.running) {
                html += "<div class='my-card-num'>" + playerModel.handArray.length + "</div>";
            }
        }

        html += "<div class='player-intelligence player-intelligence-" + positionInfo.intelligence + "'></div>";

        if (positionInfo.left) newPlayerDiv.style.left = positionInfo.left + "vw";
        if (positionInfo.top) newPlayerDiv.style.top = positionInfo.top + "vw";
        if (positionInfo.right) newPlayerDiv.style.right = positionInfo.right + "vw";
        if (positionInfo.bottom) newPlayerDiv.style.bottom = positionInfo.bottom + "vw";

        newPlayerDiv.innerHTML = html;
        waitingRoom.appendChild(newPlayerDiv);
    }

    setDivClickEvent(".other-box", selectPlayerBox, emptyFunction);
}

function selectPlayerBox(div) {
    if (div === SELECTED_PLAYER) {
        resetSelectPlayer();
    } else {
        resetSelectPlayer();
        SELECTED_PLAYER = div;
        div.classList.add("player-box-select");
    }
    updateButton();
}

function resetSelectPlayer() {
    SELECTED_PLAYER = undefined;
    $(".player-box-select").removeClass("player-box-select");
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