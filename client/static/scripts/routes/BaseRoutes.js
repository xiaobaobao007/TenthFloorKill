class BaseRoutes extends ClientRoutes {
    async logout() {
        console.log('被退出');
    }

    async msg(data) {
        console.log('msg', data);
    }
}