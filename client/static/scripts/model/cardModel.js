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

    this.getColorClass = function () {
        switch (this.color) {
            case "r" :
                return "card-red";
            case "g" :
                return "card-grey";
            case "b" :
                return "card-blue";
            case "d" :
                return "card-double";
            default:
                return "card-none";
        }
    };

    this.getTipsDiv = function () {
        let tips = "";
        if (this.operation !== "ope_z" && this.direction === "dir_") {
            tips += EMOJI_CONFIG.dir_;
        }
        if (this.lock) tips += EMOJI_CONFIG.lock;
        return "<div class='card-tips'>" + tips + "</div>";
    };

    this.getOperationDiv = function (isHand) {
        let op = "";
        switch (this.operation) {
            case "ope_z" :
                op = EMOJI_CONFIG.ope_z;
                break;
            case "ope_m" :
                op = EMOJI_CONFIG.ope_m;
                break;
            case "ope_w" :
                op = EMOJI_CONFIG.ope_w;
                break;
            case "ope_" :
                op = EMOJI_CONFIG.ope_;
                break;
        }

        if (isHand && this.operation === "ope_") {
            return "<div class='card-operation' onclick='changeOperation(event,this)'>切换</div>";
        }
        return "<div class='card-operation'>" + op + "</div>";
    };


    //<div class='card-name  card-name-2'>试探</div>
    //<div class='card-name  card-name-4'>公开文本</div>
    this.getNameDiv = function () {
        const name = STRING_CONFIG[this.cardId + "_name"];
        if (!name) {
            return "";
        }
        return "<div class='card-name  card-name-" + name.length + "'>" + name + "</div>";
    };

}