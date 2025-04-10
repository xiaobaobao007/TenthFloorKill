class BaseRoutes extends ClientRoutes {
    async loginBack(data) {
        addTips(JSON.stringify(data));
        openBody("hall");
    }

    async logout() {
        console.log('被退出');
    }

    async msg(data) {
        console.log('msg', data);
    }
}