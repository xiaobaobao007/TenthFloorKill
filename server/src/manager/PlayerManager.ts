import {Player} from "../model/Player";
import {WebSocket} from "ws";
import {SocketUtil} from "../util/SocketUtil";
import {RoomManager} from "./RoomManager";

export class PlayerManager {
    private static accountMap = new Map<string, Player>();
    private static socketMap = new Map<WebSocket, Player>();

    public static get(socket: WebSocket, data: any): Player | undefined {
        let player = this.socketMap.get(socket);

        if (!player && data && data.account.length > 0) {
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
            if (oldPlayer.ai) {
                this.reLogin(socket, oldPlayer);
                return oldPlayer;
            } else {
                this.logout(socket, "账号已经登录");
                return undefined;
            }
        }
        return this.setNewAccount(socket, account);
    }

    private static reLogin(socket: WebSocket, player: Player) {
        this.socketMap.set(socket, player);
        player.socket = socket;
        player.ai = false;
        player.reLogin = true;
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
        if (player) {
            player.socket = undefined;
            this.accountMap.delete(player.account);
        }
        this.socketMap.delete(socket);
    }

    public static level(socket: WebSocket) {
        let player = this.socketMap.get(socket);
        if (!player) {
            return;
        }

        if (RoomManager.leave(player)) {
            this.accountMap.delete(player.account);
        } else {
            player.ai = true;
        }
        this.socketMap.delete(socket);
    }
}