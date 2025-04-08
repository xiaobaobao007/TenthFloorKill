import {WebSocket} from "ws";
import {SocketUtil} from "../util/SocketUtil";

export class Player {
    private _socket: WebSocket;

    private _account: string;
    private _roomId: string = "";

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

    get roomId(): string {
        return this._roomId;
    }

    set roomId(value: string) {
        this._roomId = value;
    }

    public close() {
        this._socket.close();
    }

    get socket(): WebSocket {
        return this._socket;
    }
}