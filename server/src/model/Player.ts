import {WebSocket} from "ws";
import {SocketUtil} from "../util/SocketUtil";
import {Room} from "./Room";
import {Card} from "./Card";

export class Player {
    private _socket: WebSocket | undefined;
    private _account: string;

    private _room: Room | undefined;

    private intelligenceCardArray: Card[] = [];
    private _handCardArray: Card[] = [];

    private ai = false;//机器人或者是否为托管模式

    constructor(socket: WebSocket | undefined, account: string) {
        this._socket = socket;
        this._account = account;
    }

    get account(): string {
        return this._account;
    }

    public send(route: string, data: any = {}) {
        if (this._socket) {
            SocketUtil.send(this._socket, route, data);
        }
    }

    get room(): Room | undefined {
        return this._room;
    }

    set room(value: Room | undefined) {
        this._room = value;
    }

    public close() {
        if (this._socket) {
            this._socket.close();
        }
    }

    get socket(): WebSocket | undefined {
        return this._socket;
    }

    public clearCard() {
        this._handCardArray = [];
    }

    public addCardArray(array: Card[]) {
        for (let card of array) {
            this.addCard(card);
        }
    }

    public addCard(playerCard: Card) {
        this._handCardArray.push(playerCard);
    }

    public getClientPlayerInfo(): any {
        return {
            name: this.account,
            cardArray: this.getClientPlayerCardArray()
        }
    }

    private getClientPlayerCardArray() {
        let cardArray: any[] = [];
        for (let playerCard of this._handCardArray) {
            cardArray.push(playerCard.getClientInfo());
        }
        return cardArray;
    }

    public sendTips(tips: string) {
        if (this._socket) {
            SocketUtil.send(this._socket, "base/tips", {tips: tips});
        }
    }

    get handCardArray(): Card[] {
        return this._handCardArray;
    }
}