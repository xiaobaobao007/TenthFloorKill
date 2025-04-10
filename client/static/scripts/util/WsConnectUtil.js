function initWs() {
    if (typeof ws !== "undefined") {
        console.info("已经建立连接！！！");
        return;
    }

    ws = new WebSocket(document.getElementById("url").value);

    // 连接建立时触发
    ws.onopen = function () {
        sendWsMessage("base/login", {account: localStorage.getItem(ALL_PARAM.ACCOUNT)});
    };

    // 接收服务器消息时触发
    ws.onmessage = function (event) {
        console.info("收到", event.data);
        let data = JSON.parse(event.data);
        const router = routerHandelMap.get(data.route);
        if (!router) {
            console.info(data.route, "不存在");
            return;
        }
        router(data.data);
    };

    // 连接出错时触发
    ws.onerror = function (error) {
        ws = undefined;
        openBody("login");
    };

    // 连接关闭时触发
    ws.onclose = function () {
        addTips("服务器已断开");
        ws = undefined;
        openBody("login");
    };
}

function sendWsMessage(route, message) {
    if (ws.readyState !== WebSocket.OPEN) {
        initWs();
    }

    let data = {
        route: route.toLowerCase(), data: message
    };
    ws.send(JSON.stringify(data));
}