import {Player} from "./Player";
import {Card} from "./Card";
import {CardManager} from "../manager/CardManager";
import {Event} from "../fight/Event";
import {GameStartEvent} from "../fight/normalEvent/GameStartEvent";
import {shuffleArray} from "../util/MathUtil";

export class Room {
    private _roomId: string;//房间号
    private _playerArray: Player[] = [];//玩家集合
    private _start = false;//房间是否开始了
    private _leaderAccount: string | undefined;//房主
    private incIndex: number = 1;//自增长id
    private _currentEvent: Event | undefined = undefined;//当前事件

    private _cardIndex: number[] = [];
    private _discardIndex: number[] = [];

    constructor(roomId: string) {
        this._roomId = roomId;
    }

    get roomId(): string {
        return this._roomId;
    }

    get start(): boolean {
        return this._start;
    }

    set start(value: boolean) {
        this._start = value;
    }

    get playerArray(): Player[] {
        return this._playerArray;
    }

    public addPlayer(player: Player) {
        if (this._start) {
            return;
        }

        if (this._playerArray.indexOf(player) >= 0) {
            return;
        }

        this.broadcast("roomEvent/newEvent", {name: player.account + "加入房间"});

        this._playerArray.push(player);

        if (this._playerArray.length == 1) {
            this._leaderAccount = player.account;
        }

        player.room = this;
    }

    public removePlayer(player: Player) {
        this._playerArray.splice(this._playerArray.indexOf(player), 1);

        player.room = undefined;

        if (this._playerArray.length == 0) {
            return;
        }

        if (this._leaderAccount == player.account) {
            this._leaderAccount = this._playerArray[0].account;
        }

        this.broadcast("roomEvent/newEvent", {name: player.account + "离开房间"});
    }

    public gameStart() {
        if (this._start) {
            return;
        }

        this._cardIndex = CardManager.getInitCardIndex();

        this._currentEvent = new GameStartEvent();
        this.broadcast("roomEvent/newEvent", {name: "游戏开始"});
        this._start = true;
    }

    public broadcast(route: string, data: any) {
        for (let i = 0; i < this._playerArray.length; i++) {
            this._playerArray[i].send(route, data);
        }
    }

    public updateRoom() {
        if (this._playerArray.length == 0) {
            return;
        }

        let roomData = {
            running: this._start,
            roomId: this._roomId,
            leaderAccount: this._leaderAccount,
            player: [] as any[],
        };

        for (let player of this._playerArray) {
            roomData.player.push(player.getClientPlayerInfo());
        }

        this.broadcast("room/update", roomData);
    }

    public getNewPlayerCard(num: number): Card[] {
        let list: Card[] = [];
        for (let i = 0; i < num; i++) {
            let index = this._cardIndex.pop();

            if (!index) {
                this._cardIndex = shuffleArray(this._discardIndex);
                this._discardIndex = [];
                index = this._cardIndex.pop()!;
            }

            let card = CardManager.getNewPlayerCard(index);
            card.allId = this.getNewIncIndex();
            list.push(card);
        }
        return list;
    }

    private getNewIncIndex(): string {
        return "" + this.incIndex++;
    }

    get leaderAccount(): string | undefined {
        return this._leaderAccount;
    }

    get currentEvent(): Event | undefined {
        return this._currentEvent;
    }

    set currentEvent(value: Event | undefined) {
        this._currentEvent = value;
    }
}