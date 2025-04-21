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

        for (const handCardElement of updateData.cardArray) {
            const cardModel = new CardModel();
            cardModel.init(handCardElement);

            player.handArray.push(cardModel);

            addHandCard(cardModel);
        }
    }

    async removeHandCard(updateData) {
        const player = ALL_PLAYER[ACCOUNT];
        const cardModel = player.getHandCard(updateData.handCardId);
        if (cardModel) {
            removeHandCard(cardModel);
        }
    }

    async updateHandCardNum(updateData) {
        const player = ALL_PLAYER[updateData.account];
        $(player.div).children(".my-card-num:first").html(updateData.handCardNum);
    }

    async newIntelligenceCard(updateData) {
        const player = ALL_PLAYER[updateData.account];

        const cardModel = new CardModel();
        cardModel.init(updateData.card);
        player.intelligenceArray.push(cardModel);

        addIntelligenceCard(player, cardModel);
    }

    async updateTime(requestData) {
        updateTimeTips(requestData.account, requestData.time, requestData.allTime, requestData.allTips, requestData.myTips);
    }

    async updateLastCardNum(requestData) {
        $(".room-lastCard-tips:first").html("牌库剩余：" + requestData.lastCardNum);
    }

    async showButton(requestData) {
        await this.clearButton();

        let html = "";
        for (const button of requestData.buttonArray) {
            if (button.classType === "success") {
                html += "<div class='operation-button operation-button-green' onclick='clickSubmit(\"" + button.root + "\")'>" + button.name + "</div>";
            } else if (button.classType === "submit") {
                if (button.needCardNum) {
                    SELECTED_CARD_NUM = button.needCardNum;
                }
                if (button.needPlayerNum) {
                    SELECTED_PLAYER_NUM = 1;
                }
                html += "<div class='operation-button operation-button-grey' onclick='clickSubmit(\"" + button.root + "\")'>" + button.name + "</div>";
            } else {
                html += "<div class='operation-button-small-grey' onclick='clickCancel(\"" + button.root + "\")'>" + button.name + "</div>";
            }
        }

        $(".operation-button-father").html(html);

        if (0 < SELECTED_CARD_NUM) {
            setDivClickEvent("[cardid]", cardClick, cardPress);
        }
        if (0 < SELECTED_PLAYER_NUM) {
            setDivClickEvent(".other-box", selectPlayerBox, emptyFunction);
        }

        updateButton();
    }

    async clearButton() {
        $(".operation-button-father").html("");
        resetSelectPlayer();
        resetSelectCard();
    }

    async updateAllIntelligence(data) {
        $(".intelligence-card-show").remove();

        const cardModel = new CardModel();
        cardModel.init(data);

        let html = "";
        html += "<div class='intelligence-card-show card intelligence-card " + cardModel.getColorClass() + "'>";
        html += "   <div class='intelligence-card-tips'>当前情报</div>";
        html += cardModel.getNameDiv();
        html += cardModel.getOperationDiv(false);
        html += cardModel.getTipsDiv();
        html += cardModel.getAccountDiv();
        html += "</div>";

        $("body").append(html);
    }

    async clearAllIntelligence() {
        $(".intelligence-card-show").remove();
    }

    async dead(data) {
        $(ALL_PLAYER[data.account].div).append("<div class='dead' onclick='notPenetrate(event)'>已死亡</div>");
    }
}