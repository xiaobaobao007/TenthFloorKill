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
        updateTimeTips(requestData.account, requestData.tips, requestData.time, requestData.allTime);
    }

}