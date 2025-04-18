class BaseRoutes extends ClientBaseRoutes {
    async tips(data) {
        addTips(data.tips);
    }

    async changeBody(data) {
        openBody(data.body);
    }

    async loginBack(data) {
        STRING_CONFIG = data.stringConfig
        EMOJI_CONFIG = data.emojiConfig
        openBody("hall");

        ALL_CAMP = [];
        for (const key in STRING_CONFIG) {
            if (key.startsWith("camp_")) {
                ALL_CAMP.push(key);
            }
        }
    }

}