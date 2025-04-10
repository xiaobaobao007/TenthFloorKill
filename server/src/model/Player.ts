import {WebSocket} from "ws";
import {SocketUtil} from "../util/SocketUtil";
import {Room} from "./Room";

export class Player {
    private _socket: WebSocket;
    private _account: string;

    private _room: Room | undefined;

    constructor(socket: WebSocket, account: string) {
        this._socket = socket;
        this._account = account;
    }

    get account(): string {
        return this._account;
    }

    public send(route: string, data: any) {
        SocketUtil.send(this._socket, route, data);
    }

    get room(): Room | undefined {
        return this._room;
    }

    set room(value: Room | undefined) {
        this._room = value;
    }

    public close() {
        this._socket.close();
    }

    get socket(): WebSocket {
        return this._socket;
    }

    public getInfo(): any {
        return {
            name: this.account
        }
    }

    public sendTips(tips: string) {
        SocketUtil.send(this._socket, "base/tips", {tips: tips});
    }
}