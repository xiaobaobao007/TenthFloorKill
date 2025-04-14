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

    //按钮显示控制问题
    changeShowOrHide(".room-start", ACCOUNT === ROOM_DATA.leaderAccount && !ROOM_DATA.running);
    changeShowOrHide(".room-quit", !ROOM_DATA.running);

    //组装玩家信息
    updateAllPlayer();

    //绘制所有人的情报
    updateAllPlayerIntelligence();

    //绘制我的手牌
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
}

function updateTimeTips(account, tips, time, allTime) {
    let rate = Math.floor(100 * time / allTime);

    $(".room-time-tips:first").html(tips);

    const isMe = account === ACCOUNT;

    let timeDiv;
    if (isMe) {
        timeDiv = $(".my-time-tips");
    } else {
        const player = ALL_PLAYER[account];
        timeDiv = $(player.div).children(".other-time-tips:first");
    }

    if (rate <= 0) {
        timeDiv.remove();
        return;
    }

    if (timeDiv.length === 0) {
        let html;
        if (isMe) {
            html = "<div class='my-time-tips clear'>";
        } else {
            html = "<div class='other-time-tips clear'>";
        }

        html += "<div class='green-time-tips'></div>" +
            "<div class='red-time-tips'></div>" +
            "</div>";

        if (isMe) {
            $("#body-room").append(html);
        } else {
            $(ALL_PLAYER[account].div).append(html);
        }
        return;
    }

    const children = timeDiv.children();
    const green = children[0];

    if (isMe) {
        green.style.width = rate + "%";
    } else {
        green.style.height = rate + "%";
    }

    if (rate <= 30) {
        if (!$(children[1]).hasClass('time-tips-light')) {
            $(children[1]).addClass('time-tips-light');
        }
    }
}