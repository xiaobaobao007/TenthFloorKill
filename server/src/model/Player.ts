import {WebSocket} from "ws";
import {SocketUtil} from "../util/SocketUtil";
import {Room} from "./Room";
import {Card} from "./Card";
import {CAMP_, CAMP_BLUE, CAMP_GREY, CAMP_RED, COLOR_BLUE, COLOR_DOUBLE, COLOR_GREY, COLOR_RED, GAME_CONFIG} from "../util/Constant";
import {RedWinGame} from "../exception/RedWinGame";
import {BlueWinGame} from "../exception/BlueWinGame";
import {GreyWinGame} from "../exception/GreyWinGame";

export class Player {
    private _socket: WebSocket | undefined;//连接
    public readonly account: string;//账号
    private _ai = false;//玩家掉线或者机器人为true
    private _reLogin = false;//重新登录标记

    private _room: Room | undefined;//房间
    private _ready: boolean = false;//房间开始前的准备状态

    private _intelligenceCardArray: Card[] = [];//情报
    private _handCardArray: Card[] = [];//手牌
    private _camp: string = CAMP_GREY;//我的阵营
    private _live: boolean = true;//存活中

    constructor(socket: WebSocket | undefined, account: string) {
        this._socket = socket;
        this.account = account;
    }

    initInRoom(room: Room) {
        this._room = room;
        this._ready = false;
    }

    initGameStart() {
        this._intelligenceCardArray.length = 0;
        this.initGameOver();
    }

    initGameOver() {
        this._handCardArray.length = 0;
        this._ready = false;
        this._live = true;
    }

    public send(route: string, data: any = undefined) {
        SocketUtil.send(this._socket, route, data);
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

        this.send("roomEvent/newHandCard", {cardArray: handClientInfo});
        this.updateHandCardNum();
    }

    public removeCard(card: Card) {
        this._handCardArray.splice(this._handCardArray.indexOf(card), 1);
        card.hand = false;

        this.send("roomEvent/removeHandCard", {handCardId: card.allId});
        this.updateHandCardNum();
    }

    public addIntelligenceCard(intelligenceCard: Card) {
        this._intelligenceCardArray.push(intelligenceCard);
        this._room?.broadcast("roomEvent/newIntelligenceCard", {account: this.account, card: intelligenceCard.getSelfCardInfo()});
    }

    private updateHandCardNum() {
        this._room!.broadcast("roomEvent/updateHandCardNum",
            {
                account: this.account,
                handCardNum: this._handCardArray.length,
            }
        );
    }

    public getClientPlayerInfo(sendPlayer: Player): any {
        return {
            account: this.account,
            camp: sendPlayer == this ? this._camp : CAMP_,
            live: this._live,
            handCardArray: this.getClientPlayerCardArray(this._handCardArray),
            intelligenceCardArray: this.getClientPlayerCardArray(this._intelligenceCardArray),
        }
    }

    private getClientPlayerCardArray(array: Card[]) {
        let cardArray: any[] = [];
        for (let playerCard of array) {
            cardArray.push(playerCard.getSelfCardInfo());
        }
        return cardArray;
    }

    public sendTips(tips: string) {
        SocketUtil.send(this._socket, "base/tips", {tips: tips});
    }

    public showButton(info: any) {
        SocketUtil.send(this._socket, "roomEvent/showButton", info);
    }

    findHandCardById(cardId: string) {
        for (let card of this._handCardArray) {
            if (card.allId == cardId) {
                return card;
            }
        }
    }

    judgeWin() {
        if (this._camp == CAMP_RED) {
            if (this.intelligenceCardColorNum(COLOR_RED) + this.intelligenceCardColorNum(COLOR_DOUBLE) >= GAME_CONFIG.RED_WIN_GAME_CARD_NUM) this.setWin();
        } else if (this._camp == CAMP_BLUE) {
            if (this.intelligenceCardColorNum(COLOR_BLUE) + this.intelligenceCardColorNum(COLOR_DOUBLE) >= GAME_CONFIG.BLUE_WIN_GAME_CARD_NUM) this.setWin();
        } else {
            if (this.intelligenceCardColorNum(COLOR_RED) + this.intelligenceCardColorNum(COLOR_BLUE) + this.intelligenceCardColorNum(COLOR_DOUBLE) >= GAME_CONFIG.GREY_WIN_GAME_CARD_NUM) this.setWin();
        }
    }

    setWin() {
        if (this._camp == CAMP_RED) {
            throw new RedWinGame();
        } else if (this._camp == CAMP_BLUE) {
            throw new BlueWinGame();
        } else {
            throw new GreyWinGame();
        }
    }

    judgeDie() {
        if (this.intelligenceCardColorNum(COLOR_GREY) >= 3) {
            this._live = false;
            this._room!.broadcast("roomEvent/dead", {account: this.account});
        }
    }

    private intelligenceCardColorNum(color: string) {
        let num = 0;
        for (const card of this._intelligenceCardArray) {
            if (card.color == color) {
                num++;
            }
        }
        return num;
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

    get camp(): string {
        return this._camp;
    }

    set camp(value: string) {
        this._camp = value;
    }

    get live(): boolean {
        return this._live;
    }

    get ready(): boolean {
        return this._ready;
    }

    set ready(value: boolean) {
        this._ready = value;
    }
}