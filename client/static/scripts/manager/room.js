/**
 *     <div class="player-box me-box">
 *         <div class="box-account">账号</div>
 *         <div class="box-heroName">英雄名字</div>
 *     </div>
 */
function updateRoomData() {
    //设置房间号
    setHtml(".roomInfo", "房间号：" + ROOM_DATA.roomId);

    //按钮显示控制问题
    changeShowOrHide(".room-statistics-button", !ROOM_DATA.running);

    //组装玩家信息
    updateAllPlayer();

    //绘制所有人的情报
    updateAllPlayerIntelligence();

    //绘制我的手牌
    updateMyHandCard();
}

function updateTimeTips(account, time, allTime, allTips, myTips) {
    $(".room-time-tips:first").html(allTips);

    if (!account) {
        return;
    }

    let rate = Math.floor(100 * time / allTime);

    const isMe = account === ACCOUNT;

    let timeDiv;
    if (isMe) {
        timeDiv = $(".my-time-tips");
    } else {
        const player = ALL_PLAYER[account];
        timeDiv = $(player.div).children(".other-time-tips:first");
    }

    if (time <= 0) {
        timeDiv.remove();
        return;
    }

    if (timeDiv.length === 0) {
        let html;
        if (isMe) {
            html = "<div class='my-time-tips clear'>" +
                "<div class='green-time-tips'></div>" +
                "<div class='red-time-tips'></div>" +
                "<div class='room-time-tips-content'>" + myTips + "</div>" +
                "</div>";
        } else {
            html = "<div class='other-time-tips clear'>" +
                "<div class='green-time-tips'></div>" +
                "<div class='red-time-tips'></div>" +
                "</div>";
        }

        if (isMe) {
            $("#body-room").append(html);
            timeDiv = $(".my-time-tips");
        } else {
            $(ALL_PLAYER[account].div).append(html);
            const player = ALL_PLAYER[account];
            timeDiv = $(player.div).children(".other-time-tips:first");
        }
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

function updateButton() {
    if (0 < SELECTED_CARD_NUM && SELECTED_CARD_DIVS.length < SELECTED_CARD_NUM) {
        updateButtonToGrey();
        return;
    }

    if (0 < SELECTED_PLAYER_NUM && SELECTED_PLAYER === undefined) {
        updateButtonToGrey();
        return;
    }

    updateButtonToGreen();
}

function updateButtonToGrey() {
    const button = $(".operation-button:first");
    if (button.hasClass('operation-button-grey')) {
        return;
    }
    button.removeClass('operation-button-green');
    button.addClass('operation-button-grey');
}

function updateButtonToGreen() {
    const button = $(".operation-button:first");
    if (button.hasClass('operation-button-green')) {
        return;
    }
    button.removeClass('operation-button-grey');
    button.addClass('operation-button-green');
}

function clickSubmit(root) {
    if (!root || root.length === 0) {
        return;
    }

    let cardArray = [];
    for (const cardDiv of SELECTED_CARD_DIVS) {
        cardArray.push({
            cardId: $(cardDiv).attr("cardid"),
            opz: $(cardDiv).children(".card-operation:first").attr("ope"),
        });
    }

    let playerArray = [];
    if (SELECTED_PLAYER) {
        playerArray.push($(SELECTED_PLAYER).children(".box-account").html());
    }

    let data = {cards: cardArray, accounts: playerArray};
    sendWsMessage(root, data);
}

function clickCancel(root) {
    sendWsMessage(root);
}

function getStatistics() {
    sendWsMessage("room/getStatistics");
}

function closeStatistics() {
    $(".room-statistics").remove();
}