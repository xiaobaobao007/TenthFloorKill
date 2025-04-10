class BaseRoutes extends ClientBaseRoutes {
    async loginBack(data) {
        STRING_CONFIG = data.stringConfig
        openBody("hall");
    }

    async logout() {
        addTips("被踢出请重新登录");
        openBody("login");
    }
}