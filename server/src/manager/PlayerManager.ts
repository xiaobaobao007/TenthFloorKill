import {Player} from "../model/Player";
import {WebSocket} from "ws";
import {SocketUtil} from "../util/SocketUtil";

export class PlayerManager {
    private static accountMap = new Map<string, Player>();
    private static socketMap = new Map<WebSocket, Player>();

    public static get(socket: WebSocket, data: any): Player | undefined {
        if (data.account) {
            return this.login(socket, data.account);
        }

        let player = this.socketMap.get(socket);
        if (player) {
            return player;
        }

        SocketUtil.send(socket, "logout");

        return;
    }

    private static login(socket: WebSocket, account: string) {
        let oldPlayer = this.accountMap.get(account);
        if (oldPlayer) {
            const oldSocket = oldPlayer.socket;

            SocketUtil.send(oldSocket, "base/logout");

            oldPlayer.close();
            this.socketMap.delete(oldSocket);
        }

        return this.setNewAccount(socket, account);
    }

    private static setNewAccount(socket: WebSocket, account: string) {
        let player = new Player(socket, account);
        this.accountMap.set(account, player);
        this.socketMap.set(socket, player);

        return player;
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