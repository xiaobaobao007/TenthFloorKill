function updateAllPlayer() {
    //清理数据
    $(".player-box").remove();

    const playerArray = ROOM_DATA.player;

    let playerStartIndex = 0;
    for (; playerStartIndex < playerArray.length; playerStartIndex++) {
        if (playerArray[playerStartIndex].account === ACCOUNT) {
            break;
        }
    }

    const waitingRoom = document.getElementById('body-room');

    for (let seatIndex = POSITION_DATA.length - 1; seatIndex >= 0; seatIndex--) {
        if (seatIndex >= playerArray.length && ROOM_DATA.running) {
            continue;
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
            if (++playerStartIndex >= playerArray.length) {
                playerStartIndex = 0;
            }

            const playerInfo = playerArray[playerStartIndex];

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

            html += "<div class='box-account'>" + playerModel.account + "</div>";

            if (ROOM_DATA.running) {
                html += "<div class='box-camp box-camp-" + playerModel.camp + "' onclick ='changeCamp(event,this)' camp='" + playerModel.camp + "'> " + STRING_CONFIG[playerModel.camp] + "</div>";
            } else if (ROOM_DATA.leaderAccount === playerModel.account) {
                html += "<div class='box-leader'>" + getEmoji("leader") + "</div>";
            }

            html += "<div class='box-heroName'></div>";

            if (ROOM_DATA.running) {
                html += "<div class='my-card-num'>" + playerModel.handArray.length + "</div>";
            }

            html += "<div class='player-intelligence player-intelligence-" + positionInfo.intelligence + " clear' onclick='showIntelligence(this)'></div>";

            if (!playerModel.live) {
                html += "<div class='dead' onclick='notPenetrate(event)'>已死亡</div>";
            }
        }

        if (positionInfo.left) newPlayerDiv.style.left = positionInfo.left + "vw";
        if (positionInfo.top) newPlayerDiv.style.top = positionInfo.top + "vw";
        if (positionInfo.right) newPlayerDiv.style.right = positionInfo.right + "vw";
        if (positionInfo.bottom) newPlayerDiv.style.bottom = positionInfo.bottom + "vw";

        newPlayerDiv.innerHTML = html;
        waitingRoom.appendChild(newPlayerDiv);
    }
}

function selectPlayerBox(div) {
    if (SELECTED_PLAYER_NUM < 0) {
        return;
    }

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
    SELECTED_PLAYER_NUM = -1;
    $(".player-box-select").removeClass("player-box-select");
}

function updateAllPlayerIntelligence() {
    for (const account in ALL_PLAYER) {
        const player = ALL_PLAYER[account];
        for (const cardModel of player.intelligenceArray) {
            addIntelligenceCard(player, cardModel);
        }
    }
}

function addIntelligenceCard(player, cardModel) {
    $(player.div).children(".player-intelligence:first").append(cardModel.getIntelligenceDiv());
}

function changeCamp(event, div) {
    event.stopPropagation();
    if ($(div).parent().hasClass("me-box")) {
        return;
    }
    let index = ALL_CAMP.indexOf($(div).attr("camp")) + 1;
    if (index >= ALL_CAMP.length) {
        index = 0;
    }

    $(div).attr("camp", ALL_CAMP[index]);
    $(div).html(STRING_CONFIG[ALL_CAMP[index]]);
}