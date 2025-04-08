class BaseRoutes extends ClientRoutes {
    async logout() {
        console.log('Start game route called');
    }

    async msg(data) {
        console.log('msg', data);
    }
}