import {Player} from "../model/Player";
import {WebSocket} from "ws";
import {SocketUtil} from "../util/SocketUtil";

export class PlayerManager {
    private static accountMap = new Map<string, Player>();
    private static socketMap = new Map<WebSocket, Player>();

    public static get(socket: WebSocket, data: any): Player | undefined {
        let player = this.socketMap.get(socket);
        if ((!player || !player.account) && data && data.account) {
            return this.login(socket, data.account);
        }

        if (player) {
            return player;
        }

        this.logout(socket, "请先登录！");

        return;
    }

    private static login(socket: WebSocket, account: string) {
        let oldPlayer = this.accountMap.get(account);
        if (oldPlayer) {
            const oldSocket = oldPlayer.socket;

            this.logout(oldSocket, "异地登录");
        }

        return this.setNewAccount(socket, account);
    }

    private static setNewAccount(socket: WebSocket, account: string) {
        let player = new Player(socket, account);
        this.accountMap.set(account, player);
        this.socketMap.set(socket, player);

        return player;
    }

    public static sendAll(route: string, data: any) {
        for (let socket of this.socketMap.keys()) {
            SocketUtil.send(socket, route, data);
        }
    }

    public static logout(socket: WebSocket, tips: string) {
        SocketUtil.send(socket, "base/changeBody", {body: "login"});
        SocketUtil.send(socket, "base/tips", {tips: tips});
        socket.close();

        let player = this.socketMap.get(socket);
        if (player && player.account) {
            this.accountMap.delete(player.account);
        }
        this.socketMap.delete(socket);
    }

    // public static level(socket: WebSocket) {
    //     let player = this.socketMap.get(socket);
    //     if (!player) {
    //         return;
    //     }
    //
    //     this.uidMap.delete(player.id);
    //     this.socketMap.delete(socket);
    //     RoomManager.level(player);
    // }
}