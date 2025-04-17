function PlayerModel() {
    this.account = "";//账号
    this.camp = "";//阵营
    this.handArray = [];//手牌
    this.intelligenceArray = [];//收到的情报
    this.div = undefined;

    this.init = function (data) {
        this.account = data.account;
        this.camp = data.camp;
        for (const card of data.handCardArray) {
            const cardModel = new CardModel();
            cardModel.init(card);
            this.handArray.push(cardModel);
        }
        for (const card of data.intelligenceCardArray) {
            const cardModel = new CardModel();
            cardModel.init(card);
            this.intelligenceArray.push(cardModel);
        }
    }

    this.getHandCard = function (id) {
        for (const card of this.handArray) {
            if (card.allId == id) {
                return card;
            }
        }
    }
}