import express from 'express';
import {createServer} from 'http';
import expressWs from 'express-ws';
import 'reflect-metadata';
import {routerHandelMap} from "./routes/Routes";
import {PlayerManager} from "./manager/PlayerManager";
import {ScheduleManager} from "./manager/schedule/ScheduleManager";
import {CardManager} from "./manager/CardManager";
import {SocketUtil} from "./util/SocketUtil";

const app = express();
const server = createServer(app);
const {app: wsApp, getWss} = expressWs(app, server);

wsApp.ws('*', (socket, req) => {
    socket.on('close', async (message: string) => {
        PlayerManager.level(socket);
    });

    socket.on('message', async (message: string) => {
        const request = JSON.parse(message);
        const player = PlayerManager.get(socket, request.data);

        if (player) {
            if (request.route === 'base/login') {
                if (player.reLogin) {
                    console.info("重新登录成功", request.data);
                } else {
                    console.info("登录成功", request.data);
                }
            } else {
                console.info("收到", player.account, "--->", message);
            }
        } else {
            SocketUtil.send(socket, "base/tips", {tips: "请重新输入账号"});
            return;
        }

        const router = routerHandelMap.get(request.route);
        if (!router) {
            console.error(request.route, "不存在");
            return;
        }
        router(player, request.data, getWss());
    });
});

//初始化所有卡牌
CardManager.initAllCard();

//添加定时任务
ScheduleManager.init();

const PORT = 8080;

server.listen(PORT, () => {
    console.log(new Date().toLocaleString("shanghai"), `：Server listening on port `, PORT);
});