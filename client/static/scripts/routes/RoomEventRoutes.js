class RoomEventRoutes extends ClientBaseRoutes {
    async newEvent(data) {
        const div = $(".room-event");
        if (div.length === 0) {
            return;
        }

        const downRate = div[0].scrollHeight - div.scrollTop() - div.height() * 1.5;

        div.append("<div class='room-event-one'>" + data.name + "</div>");

        if (downRate < 0) {
            div.scrollTop(div[0].scrollHeight - div.height());
        }
    }

    async newHandCard(updateData) {
        const player = ALL_PLAYER[ACCOUNT];

        for (const handCardElement of updateData.handCard) {
            const cardModel = new CardModel();
            cardModel.init(handCardElement);

            player.handArray.push(cardModel);

            addHandCard(cardModel);
        }
    }

    async updateHandCardNum(updateData) {
        const player = ALL_PLAYER[updateData.account];
        $(player.div).children(".my-card-num:first").html(updateData.handCardNum);
    }

    async updateTime(requestData) {
        updateTimeTips(requestData.account, requestData.time, requestData.allTime, requestData.allTips, requestData.myTips);
    }

    async updateLastCardNum(requestData) {
        $(".room-lastCard-tips:first").html("牌库剩余：" + requestData.lastCardNum);
    }

    async showButton(requestData) {
        let html = "";
        for (const button of requestData.buttonArray) {
            if (button.classType === "submit") {
                if (button.needCardNum) {
                    SELECTED_CARD_NUM = button.needCardNum;
                }
                if (button.needPlayerNum) {
                    SELECTED_PLAYER_NUM = 1;
                }
                html += "<div class='operation-button operation-button-grey' onclick='clickSubmit(\"" + button.root + "\")'>" + button.name + "</div>";
            } else if (button.classType === "cancel") {
                html += "<div class='operation-button-small-grey' onclick='clickCancel(\"" + button.root + "\")'>" + button.name + "</div>";
            }
        }

        resetSelectPlayer();
        resetSelectCard();
        $(".operation-button-father").html(html);
    }

    async clearButton() {
        $(".operation-button-father").html("");
        $(".my-card-select").remove();
    }

}