class RoomEventRoutes extends ClientBaseRoutes {
    async addEventTips(tips) {
        addNewEventTips(tips);
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

    async removeIntelligenceCard(updateData) {
        $("[intelligencecardid=" + updateData.cardId + "]").remove();
        const player = ALL_PLAYER[updateData.account];

        for (let i = 0; i < player.intelligenceArray.length; i++) {
            if (player.intelligenceArray[i].allId == updateData.cardId) {
                player.intelligenceArray.splice(i, 1)
                return;
            }
        }
    }

    async updateTime(requestData) {
        if (!requestData.allTipsHideEvent) {
            addNewEventTips(requestData.allTips);
        }

        let playerArray = undefined;
        if (requestData.account) {
            if (!ALL_PLAYER[requestData.account]) {
                return;
            }
            playerArray = [ALL_PLAYER[requestData.account]];
        } else {
            playerArray = [];
            for (const key in ALL_PLAYER) {
                playerArray.push(ALL_PLAYER[key]);
            }
        }

        if (!playerArray) {
            return;
        }

        updateTimeTips(playerArray, requestData.time, requestData.allTime, requestData.myTips);
    }

    async updateLastCardNum(lastCardNum) {
        $(".room-lastCard-tips:first").html("牌库信息：" + lastCardNum);
    }

    async showButton(requestData) {
        await this.clearButton();

        let html = "";
        for (const button of requestData.buttonArray) {
            if (button.classType === "success") {
                html += "<div class='operation-button operation-button-green' onclick='clickSubmit(\"" + button.root + "\")'>" + button.name + "</div>";
            } else if (button.classType === "submit") {
                if (button.isRounding) {
                    IN_ROUNDING = true;
                }
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

        setDivClickEvent(".other-box", selectPlayerBox, emptyFunction);

        updateButton();
    }

    async clearButton() {
        IN_ROUNDING = false;
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
        html += cardModel.getOtherTipsDiv();
        html += "</div>";

        $("body").append(html);
    }

    async clearAllIntelligence() {
        $(".intelligence-card-show").remove();
    }

    async die(account) {
        $(ALL_PLAYER[account].div).append("<div class='dead' onclick='notPenetrate(event)'>已死亡</div>");
    }

    async showOtherPanel(data) {
        let cardArray = [];
        SELECTED_CARD_NUM = 1;

        for (let card of data.cards) {
            const model = new CardModel();
            model.init(card);
            cardArray.push(model);
        }

        openOtherCardPanel(data.tips, cardArray, data.buttonTips);
    }

    async hideOtherPanel() {
        $(".other-panel").remove();
    }

}