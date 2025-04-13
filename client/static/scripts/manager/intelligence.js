function updateAllPlayerIntelligence() {
    for (const account in ALL_PLAYER) {
        const player = ALL_PLAYER[account];
        if (player.intelligenceArray.length === 0) {
            continue
        }

        const intelligence = $(player.div).children(".player-intelligence:first");
        intelligence.html("");

        for (const one of player.intelligenceArray) {
            let class_ = undefined;
            switch (one.color) {
                case "r":
                    class_ = "card-red";
                    break;
                case "g":
                    class_ = "card-grey";
                    break;
                case "b":
                    class_ = "card-blue";
                    break;
                case "d":
                    class_ = "card-double";
                    break;
                default:
                    break;
            }

            if (class_) {
                intelligence.append("<div class='intelligence " + class_ + "'></div>");
            }
        }
    }
}