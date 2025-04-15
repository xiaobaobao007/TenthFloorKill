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

        await this.clearButton();
        $(".operation-button-father").html(html);

        if (0 < SELECTED_CARD_NUM) {
            setDivClickEvent("[cardid]", cardClick, cardPress);
        }
        if (0 < SELECTED_PLAYER_NUM) {
            setDivClickEvent(".other-box", selectPlayerBox, emptyFunction);
        }
    }

    async clearButton() {
        removeDivClickEvent("[cardid]");
        removeDivClickEvent(".other-box");
        $(".my-time-tips").remove();
        $(".operation-button-father").html("");
        resetSelectPlayer();
        resetSelectCard();
    }

    async updateAllIntelligence(data) {
        $(".intelligence-card-show").remove();

        const card = new CardModel();
        card.init(data);

        let html = "";
        html += "<div class='intelligence-card-show clear " + card.getColorClass() + "'>";
        html += "   <div class='intelligence-card-show'>";
        html += "   <div class='intelligence-card-tips'>当前情报</div>";
        html += "   <div class='card intelligence-card " + card.getColorClass() + "'>";
        html += card.getNameDiv();
        html += card.getOperationDiv(false);
        html += card.getTipsDiv();
        html += "</div>";

        $("body").append(html);
    }

}