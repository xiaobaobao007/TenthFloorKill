import {WebSocket} from "ws";
import {SocketUtil} from "../util/SocketUtil";
import {Room} from "./Room";
import {Card} from "./Card";

export class Player {
    private _socket: WebSocket;
    private _account: string;

    private _room: Room | undefined;

    private playerCardArray: Card[] = [];

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

    public clearCard() {
        this.playerCardArray = [];
    }

    public addCardArray(array: Card[]) {
        for (let card of array) {
            this.addCard(card);
        }
    }

    public addCard(playerCard: Card) {
        this.playerCardArray.push(playerCard);
    }

    public getClientPlayerInfo(): any {
        return {
            name: this.account,
            cardArray: this.getClientPlayerCardArray()
        }
    }

    private getClientPlayerCardArray() {
        let cardArray: any[] = [];
        for (let playerCard of this.playerCardArray) {
            cardArray.push(playerCard.getClientInfo());
        }
        return cardArray;
    }

    public sendTips(tips: string) {
        SocketUtil.send(this._socket, "base/tips", {tips: tips});
    }
}