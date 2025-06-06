class BaseRoutes extends ClientBaseRoutes {
    async tips(tips) {
        addTips(tips);
    }

    async changeBody(body) {
        openBody(body);
    }

    async loginBack(response) {
        STRING_CONFIG = {};
        ALL_CAMP = [];

        for (const data of response.stringConfig) {
            STRING_CONFIG[data.name] = data.value;
            if (data.name.startsWith("camp_")) {
                ALL_CAMP.push(data.name);
            }
        }

        {
            let roundingConfig = response.rounding;
            ROUND_USE_CARD = roundingConfig.card;
            USE_CARD_NEED_CHOOSE_PEOPLE = roundingConfig.needChoosePlayer;
            USE_CARD_NEED_CHOOSE_PEOPLE_WITH_ME = roundingConfig.needChoosePlayerWithMe;
        }

        openBody("hall");
    }

}