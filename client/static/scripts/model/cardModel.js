function CardModel() {
    this.init = function (data) {
        this.allId = data.allId;
        this.cardId = data.cardId;
        this.color = data.color;
        this.direction = data.direction;
        this.operation = data.operation;
        this.lock = data.lock;
        this.belong = data.belong;
        this.otherTips = data.otherTips;
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
            tips += getEmoji("dir_");
        }
        if (this.lock) tips += getEmoji("lock");
        return "<div class='card-tips'>" + tips + "</div>";
    };

    this.getOperationDiv = function (isHand) {
        if (isHand && this.operation === "ope_") {
            return "<div class='card-operation card-operation-ope_' onclick='changeOperation(event,this)'>切换</div>";
        }
        return "<div class='card-operation'>" + getEmoji(this.operation) + "</div>";
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

    this.getIntelligenceDiv = function () {
        return "<div class='intelligence " + this.getColorClass() + "' intelligencecardid='" + this.allId + "'></div>";
    }

    this.getAccountDiv = function () {
        if (this.belong && this.belong.length > 0) {
            return "<div class='card-account'>" + this.belong + "</div>";
        }
        return "";
    }

    this.getOtherTipsDiv = function () {
        if (this.otherTips && this.otherTips.length > 0) {
            const tips = STRING_CONFIG[this.otherTips];
            if (tips.includes("【") && tips.includes("】")) {
                return "<div class='card-other-tips'>" + tips.substring(tips.indexOf("【") + 1, tips.indexOf("】")) + "</div>";
            }
        }
        return "";
    }

}