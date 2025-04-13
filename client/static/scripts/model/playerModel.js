// this.getAccount = function () {return _account;}this.setAccount = function (account) {_account = account;}

function PlayerModel() {
    this.account = "";//账号
    this.handArray = [];//手牌
    this.intelligenceArray = [];//收到的情报
    this.seat = undefined;
    this.div = undefined;

    this.init = function (data) {
        this.account = data.name;
        for (const card of data.cardArray) {
            const cardModel = new CardModel();
            cardModel.init(card);
            if (cardModel.hand) {
                this.handArray.push(cardModel);
            } else {
                this.intelligenceArray.push(cardModel);
            }
        }
    }
}