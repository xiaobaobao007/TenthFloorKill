import {Player} from "../model/Player";
import {WebSocket} from "ws";
import {ROUTER, ServerWsUtil} from "../util/ServerWsUtil";
import {RoomManager} from "./RoomManager";

export class PlayerManager {
    private static _accountMap = new Map<string, Player>();
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
        let oldPlayer = this._accountMap.get(account);
        if (oldPlayer) {
            if (oldPlayer.ai) {
                this.reLogin(socket, oldPlayer);
                return oldPlayer;
            } else {
                oldPlayer.sendTips("有人试图顶你的号耶");
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

        this._accountMap.set(account, player);
        this.socketMap.set(socket, player);

        return player;
    }

    public static sendAll(route: string, data: any) {
        for (let socket of this.socketMap.keys()) {
            ServerWsUtil.send(socket, route, data);
        }
    }

    public static logout(socket: WebSocket, tips: string) {
        ServerWsUtil.send(socket, ROUTER.base.CHANGE_BODY, "login");
        ServerWsUtil.send(socket, ROUTER.base.TIPS, tips);
        socket.close();

        let player = this.socketMap.get(socket);
        if (player) {
            player.socket = undefined;
            this._accountMap.delete(player.account);
        }
        this.socketMap.delete(socket);
    }

    public static level(socket: WebSocket) {
        let player = this.socketMap.get(socket);
        if (!player) {
            return;
        }
        player.ai = true;

        if (RoomManager.leave(player)) {
            this._accountMap.delete(player.account);
        }

        this.socketMap.delete(socket);
    }

    static get accountMap(): Map<string, Player> {
        return this._accountMap;
    }
}