class BaseRoutes extends ClientRoutes {
    async loginBack(data) {
        addTips(JSON.stringify(data));
        window.location.href = "hall.html";
    }

    async logout() {
        console.log('被退出');
    }

    async msg(data) {
        console.log('msg', data);
    }
}