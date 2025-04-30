import express from 'express';
import {createServer} from 'http';
import expressWs from 'express-ws';
import 'reflect-metadata';
import {PlayerManager} from "./manager/PlayerManager";
import {ScheduleManager} from "./manager/schedule/ScheduleManager";
import {CardManager} from "./manager/CardManager";
import {ROUTER, ServerWsUtil} from "./util/ServerWsUtil";
import {getNowStr} from "./util/MathUtil";
import {InitManager} from "./manager/InitManager";
import {loadRoutes} from "./routes/Routes";
import {GMManager} from "./manager/GMManager";

const url = require("url");
const app = express();
const wsServer = createServer(app);
const {app: wsApp, getWss} = expressWs(app, wsServer);

export const routerHandelMap = loadRoutes();

wsApp.ws('*', (socket, req) => {
    socket.on('close', async (message: string) => {
        try {
            PlayerManager.level(socket);
        } catch (err) {
            console.log(err);
        }
    });

    socket.on('message', async (message: string) => {
        try {
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
                ServerWsUtil.send(socket, ROUTER.base.TIPS, "请重新输入账号");
                return;
            }

            const router = routerHandelMap.get(request.route);
            if (!router) {
                console.error(request.route, "不存在");
                return;
            }
            router(player, request.data, getWss());
        } catch (err) {
            console.log(err);
        }
    });
});

const server = createServer((req: any, res: any) => {
    const parsedUrl = url.parse(req.url, true); // 第二个参数为 true，表示解析查询字符串

    if (parsedUrl.pathname === `/gm`) {
        res.setHeader(`Content-Type`, `application/json`);

        const queryParams = parsedUrl.query;

        let result: any;
        try {
            result = GMManager.router(queryParams.name, queryParams.value, queryParams.name);
        } catch (error) {
            result = error;
        }

        res.writeHead(200);
        res.end(JSON.stringify({queryParams: queryParams, result: result, time: getNowStr()}));
    } else {
        res.writeHead(404);
        res.end(`Resource not found`);
    }
});

const GM_PORT = 8081;

server.listen(GM_PORT, () => {
    console.log(getNowStr(), `：GM监听端口： `, GM_PORT);
});

//初始化所有文字
InitManager.iniStringData();

//初始化所有卡牌
CardManager.initAllCard();

//添加定时任务
ScheduleManager.init();

const GAME_PORT = 8080;

wsServer.listen(GAME_PORT, () => {
    console.log(getNowStr(), `：游戏监听端口： `, GAME_PORT);
});