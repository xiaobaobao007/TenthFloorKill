import {WebSocket} from "ws";
import {ROUTER, SocketUtil} from "../util/SocketUtil";
import {Room} from "./Room";
import {Card} from "./Card";
import {CAMP_, CAMP_BLUE, CAMP_GREY, CAMP_RED, COLOR_, COLOR_BLUE, COLOR_DOUBLE, COLOR_GREY, COLOR_RED, GAME_CONFIG} from "../util/Constant";
import {RedWinGame} from "../exception/RedWinGame";
import {BlueWinGame} from "../exception/BlueWinGame";
import {GreyWinGame} from "../exception/GreyWinGame";
import {InitManager} from "../manager/InitManager";

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

        if (route == ROUTER.roomEvent.UPDATE_TIME) {
            return;
        }

        if (route == ROUTER.base.LOGIN_BACK || route == ROUTER.room.UPDATE || !route) {
            console.info("发送", this.account, "--->", route);
            return;
        }

        console.info("发送", this.account, "--->", route, JSON.stringify(data));
    }

    public close() {
        if (this._socket) {
            this._socket.close();
        }
    }

    public addCardArray(array: Card[], reason: string) {
        if (array.length == 0) {
            return;
        }

        let cardNames = "";
        for (let card of array) {
            card.hand = true;
            this._handCardArray.push(card);

            if (cardNames != "") {
                cardNames += ",";
            }
            cardNames += card.getName();
        }

        let handClientInfo = [];
        for (let card of array) {
            handClientInfo.push(card.getSelfCardInfo());
        }

        this.send(ROUTER.roomEvent.NEW_HAND_CARD, {cardArray: handClientInfo});
        this.updateHandCardNum();

        this._room!.addEventTips("【" + this.account + "】因【" + reason + "】获得【" + array.length + "】张手牌");
        this.send(ROUTER.roomEvent.ADD_EVENT_TIPS, "获得新的手牌【" + cardNames + "】");
    }

    public removeCard(card: Card, inGarbage: boolean) {
        this._handCardArray.splice(this._handCardArray.indexOf(card), 1);
        card.hand = false;

        this.send(ROUTER.roomEvent.REMOVE_HAND_CARD, {handCardId: card.allId});
        this.updateHandCardNum();

        if (inGarbage) {
            this._room?.addDiscardCard(card);
        }
    }

    public addIntelligenceCard(intelligenceCard: Card) {
        this._intelligenceCardArray.push(intelligenceCard);
        this._room!.broadcast(ROUTER.roomEvent.NEW_INTELLIGENCE_CARD, {account: this.account, card: intelligenceCard.getSelfCardInfo()});
        this._room!.addEventTips("【" + this.account + "】成功收到一张【" + InitManager.getStringValue(COLOR_ + intelligenceCard.color) + "】")
    }

    private updateHandCardNum() {
        this._room!.broadcast(ROUTER.roomEvent.UPDATE_HAND_CARD_NUM,
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
        this.send(ROUTER.base.TIPS, tips);
    }

    public showButton(info: any) {
        this.send(ROUTER.roomEvent.SHOW_BUTTON, info);
    }

    public clearButton() {
        this.send(ROUTER.roomEvent.CLEAR_BUTTON);
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
        if (this.intelligenceCardColorNum(COLOR_GREY) < GAME_CONFIG.DEAD_GREY_CARD_NUM) {
            return;
        }

        for (const card of this._intelligenceCardArray) {
            this.room?.addDiscardCard(card);
        }
        this._intelligenceCardArray.length = 0;

        for (const card of this._handCardArray) {
            this.room?.addDiscardCard(card);
        }
        this._handCardArray.length = 0;

        this._live = false;
        this._room!.broadcast(ROUTER.roomEvent.DIE, this.account);
        this._room!.addEventTips("【" + this.account + "】死亡");

        this.updateHandCardNum();
        this._room!.updateLastCardNum();
    }

    intelligenceCardColorNum(color: string) {
        let num = 0;
        for (const card of this._intelligenceCardArray) {
            if (card.color == color) {
                num++;
            }
        }
        return num;
    }

    haveCardByCardId(cardId: string): boolean {
        for (let card of this._handCardArray) {
            if (card.cardId == cardId) {
                return true;
            }
        }
        return false;
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

    get intelligenceCardArray(): Card[] {
        return this._intelligenceCardArray;
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