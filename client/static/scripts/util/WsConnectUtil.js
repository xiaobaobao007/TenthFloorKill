function initWs() {
    if (typeof ws !== "undefined") {
        addTips("已经建立连接！！！");
        return;
    }

    ws = new WebSocket($("#url").val());

    // 连接建立时触发
    ws.onopen = function () {
        sendWsMessage("base/login", {account: ACCOUNT});
    };

    // 接收服务器消息时触发
    ws.onmessage = function (event) {
        let data = JSON.parse(event.data);
        const route = data.route.toLowerCase();
        const router = routerHandelMap.get(route);
        if (!router) {
            addTips(route + "路由不存在");
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
        // openBody("login");
    };
}

function sendWsMessage(route, message) {
    if (!route || route.length === 0) {
        return;
    }

    if (typeof ws === "undefined") {
        addTips("服务器已断开，无法发送消息");
        return;
    }
    if (ws.readyState !== WebSocket.OPEN) {
        initWs();
    }
    let data = {
        route: route.toLowerCase(), data: message
    };
    ws.send(JSON.stringify(data));
}

function closeWs() {
    if (typeof ws !== "undefined") {
        if (ws.readyState === WebSocket.OPEN) {
            ws.close();
        }
        ws = undefined;
    }

    openBody("login");
}