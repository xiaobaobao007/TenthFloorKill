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

        openBody("hall");
    }

}