class BaseRoutes extends ClientBaseRoutes {
    async tips(data) {
        addTips(data.tips);
    }

    async changeBody(data) {
        openBody(data.body);
    }

    async loginBack(data) {
        STRING_CONFIG = data.stringConfig
        openBody("hall");
    }

}