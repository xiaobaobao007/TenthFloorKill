import {WebSocket} from "ws";
import {SocketUtil} from "../util/SocketUtil";
import {Room} from "./Room";
import {Card} from "./Card";

export class Player {
    private _socket: WebSocket | undefined;//连接
    public readonly account: string;//账号
    private _ai = false;//玩家掉线或者机器人为true
    private _reLogin = false;//重新登录标记

    private _room: Room | undefined;//房间
    private _intelligenceCardArray: Card[] = [];//情报
    private _handCardArray: Card[] = [];//手牌

    constructor(socket: WebSocket | undefined, account: string) {
        this._socket = socket;
        this.account = account;
    }

    public send(route: string, data: any = {}) {
        if (this._socket) {
            SocketUtil.send(this._socket, route, data);
        }
    }

    public close() {
        if (this._socket) {
            this._socket.close();
        }
    }

    public addCardArray(array: Card[]) {
        if (array.length == 0) {
            return;
        }

        for (let card of array) {
            card.hand = true;
            this._handCardArray.push(card);
        }

        let handClientInfo = [];
        for (let card of array) {
            handClientInfo.push(card.getSelfCardInfo());
        }
        this.send("roomEvent/newHandCard", {handCard: handClientInfo});

        this.updateHandCardNum();
    }

    public removeCard(card: Card) {
        this._handCardArray.splice(this._handCardArray.indexOf(card), 1);
        card.hand = false;
    }

    private updateHandCardNum() {
        this._room!.broadcast("roomEvent/updateHandCardNum",
            {
                account: this.account,
                handCardNum: this._handCardArray.length,
            }
        );
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
            cardArray.push(playerCard.getSelfCardInfo());
        }
        return cardArray;
    }

    public sendTips(tips: string) {
        if (this._socket) {
            SocketUtil.send(this._socket, "base/tips", {tips: tips});
        }
    }

    findHandCardById(cardId: string) {
        for (let card of this._handCardArray) {
            if (card.allId == cardId) {
                return card;
            }
        }
    }

    // get set
    get socket(): WebSocket | undefined {
        return this._socket;
    }

    set socket(value: WebSocket | undefined) {
        this._socket = value;
    }

    get ai(): boolean {
        return this._ai;
    }

    set ai(value: boolean) {
        this._ai = value;
    }

    get reLogin(): boolean {
        return this._reLogin;
    }

    set reLogin(value: boolean) {
        this._reLogin = value;
    }

    get room(): Room | undefined {
        return this._room;
    }

    set room(value: Room | undefined) {
        this._room = value;
    }

    get handCardArray(): Card[] {
        return this._handCardArray;
    }

}