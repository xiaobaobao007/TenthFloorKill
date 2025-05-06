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
    changeShowOrHide("#statisticsButton", !ROOM_DATA.running);

    //组装玩家信息
    updateAllPlayer();

    //绘制所有人的情报
    updateAllPlayerIntelligence();

    //绘制我的手牌
    updateMyHandCard();
}

function updateTimeTips(playerArray, time, allTime, myTips) {
    let rate = 100 * time / allTime;

    for (let player of playerArray) {
        const isMe = player.account === ACCOUNT;

        let timeDiv;
        if (isMe) {
            timeDiv = $(".my-time-tips");
        } else {
            timeDiv = $(player.div).children(".other-time-tips:first");
        }

        if (time <= 0) {
            timeDiv.remove();
            continue;
        }

        if (timeDiv.length === 0) {
            let html;
            if (isMe) {
                html = "<div class='my-time-tips clearAndRemove'>" +
                    "<div class='green-time-tips'></div>" +
                    "<div class='red-time-tips'></div>" +
                    "<div class='room-time-tips-content'>" + myTips + "</div>" +
                    "</div>";
                const $body = $("#body-room");
                $body.append(html);
                timeDiv = $body.children(".my-time-tips:first");
            } else {
                html = "<div class='other-time-tips clearAndRemove'>" +
                    "<div class='green-time-tips'></div>" +
                    "<div class='red-time-tips'></div>" +
                    "</div>";
                const $body = $(player.div);
                $body.append(html);
                timeDiv = $body.children(".other-time-tips:first");
            }
        } else if (isMe) {
            $(".room-time-tips-content").html(myTips);
        }

        const children = timeDiv.children();

        if (isMe) {
            children[0].style.width = rate + "%";
        } else {
            children[0].style.height = rate + "%";
        }

        if (rate <= 30 && !$(children[1]).hasClass('time-tips-light')) {
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
        cardArray.push({cardId: $(cardDiv).attr("cardid")});
    }

    let playerArray = [];
    if (SELECTED_PLAYER) {
        playerArray.push($(SELECTED_PLAYER).children(".box-account").html());
    }

    const $1 = $(".operation-select");
    sendWsMessage(root, {cards: cardArray, accounts: playerArray, selectValue: $1.val()});
    $1.remove();
}

function clickCancel(root) {
    sendWsMessage(root);
    $(".operation-select").remove();
}

function getStatistics() {
    if ($(".room-statistics").length > 0) {
        closeStatistics();
        return;
    }

    sendWsMessage("room/getStatistics");
}

function closeStatistics() {
    $(".room-statistics").remove();
}

let data = {account: "机器人3号", cardInfo: {allId: "12", direction: "dir_", operation: "ope_m", belong: "机器人3号"}};

function addFlyCardDiv(account, cardInfo) {
    let cardModel = new CardModel();
    cardModel.init(cardInfo);

    if ($('.card-init').length >= 5) {
        $(".card-init").each(function () {
            const p = $(this);
            if (p.hasClass("card-left-4")) p.addClass("card-left-5");
            else if (p.hasClass("card-left-3")) p.addClass("card-left-4");
            else if (p.hasClass("card-left-2")) p.addClass("card-left-3");
            else if (p.hasClass("card-left-1")) p.addClass("card-left-2");
            else p.addClass("card-left-1");
        });
        $('.card-init:first').remove();
    }

    let playerDiv = ALL_PLAYER[account].div;

    let fromStyle = "";
    if (playerDiv.style.left) {
        fromStyle += "left:" + playerDiv.style.left + ";";
    }
    if (playerDiv.style.right) {
        fromStyle += "left:" + (92 - playerDiv.style.right.split("vw")[0]) + "vw;";
    }
    if (playerDiv.style.top) {
        fromStyle += "top:" + playerDiv.style.top + ";";
    }
    if (playerDiv.style.bottom) {
        fromStyle += "top:90vh;";
    }

    let html = "";
    html += "<div class='clearAndRemove card " + cardModel.getColorClass() + " card-init' cardid='" + cardModel.allId + "' cardtype='" + cardModel.cardId + "' style=" + fromStyle + ">";
    html += cardModel.getNameDiv();
    html += cardModel.getOperationDiv(true);
    html += cardModel.getTipsDiv();
    html += cardModel.getAccountDiv();
    html += "</div>";

    const length = $('.card-init').length;
    let left;
    if ($('.card-init').length > 0) {
        left = 13 + (length * 7.3) + "vw";
    } else {
        left = 13 + "vw";
    }

    const styleSheet = document.createElement('style');
    document.head.appendChild(styleSheet);
    styleSheet.sheet.insertRule(`
          @keyframes flyRight-` + length + ` {
            100% {
              left: ` + left + `;
              top: 16vw;
            }
          }
    `);

    styleSheet.sheet.insertRule(`
          .card-fly-` + length + ` {
            display: flex;
            animation: 1.5s ease-in-out 0s 1 normal forwards running flyRight-` + length + `;
          }
    `);

    $(".waiting-room").append(html);
    $(".card-init:last").toggleClass("card-fly-" + length);
    setDivClickEvent("[cardid=" + cardModel.allId + "]", emptyFunction, cardPress);
}