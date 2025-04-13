function CardModel() {
    this.init = function (data) {
        this.allId = data.allId;
        this.cardId = data.cardId;
        this.color = data.color;
        this.direction = data.direction;
        this.operation = data.operation;
        this.lock = data.lock;
        this.hand = data.hand;
    }
}