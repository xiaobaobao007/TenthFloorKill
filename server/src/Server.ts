import express from 'express';
import {createServer} from 'http';
import expressWs from 'express-ws';
import 'reflect-metadata';
import {routerHandelMap} from "./routes/Routes";
import {PlayerManager} from "./manager/PlayerManager";
import {ScheduleManager} from "./manager/schedule/ScheduleManager";

const app = express();
const server = createServer(app);
const {app: wsApp, getWss} = expressWs(app, server);

wsApp.ws('*', (socket, req) => {
    // socket.on('close', async (message: string) => {
    //     PlayerManager.level(socket);
    // });

    socket.on('message', async (message: string) => {
        const data = JSON.parse(message);

        console.info("收到：", data);

        const player = PlayerManager.get(socket, data.data);

        if (player) {
            const router = routerHandelMap.get(data.route);
            if (!router) {
                console.error(data.route, "不存在");
                return;
            }
            router(player, data.data, getWss());
        }
    });
});

//添加定时任务
ScheduleManager.init();

const PORT = 8080;

server.listen(PORT, () => {
    console.log(`Server listening on port `, PORT);
});