import {Player} from "./Player";
import {Card} from "./Card";
import {CardManager} from "../manager/CardManager";

export class Room {
    private _roomId: string;//房间号
    private _playerArray: Player[] = [];//玩家集合
    private _start = false;//房间是否开始了
    private leaderAccount: string | undefined;//房主
    private incIndex: number = 1;//自增长id

    constructor(roomId: string) {
        this._roomId = roomId;
    }

    get roomId(): string {
        return this._roomId;
    }

    get start(): boolean {
        return this._start;
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

        this._playerArray.push(player);

        if (this._playerArray.length == 1) {
            this.leaderAccount = player.account;
        }

        player.room = this;
    }

    private gameStart() {
        if (this._start) {
            return;
        }

        this._start = true;

        let data: any = {
            allId: []
        };

        data.myId = 0;

        // for (const player of this.playerArray) {
        //     data.allId.push({
        //         id: player.id,
        //         x: Math.floor(Math.random() * 80) + 10,
        //         y: Math.floor(Math.random() * 80) + 10,
        //     })
        // }
        //
        // for (const player of this.playerArray) {
        //     data.myId = player.id;
        //     player.send("gameStart", data);
        // }
    }

    public removePlayer(player: Player) {
        this._playerArray.splice(this._playerArray.indexOf(player), 1);

        player.room = undefined;

        if (this._playerArray.length == 0) {
            return;
        }

        if (this.leaderAccount == player.account) {
            this.leaderAccount = this._playerArray[0].account;
        }
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
            leaderAccount: this.leaderAccount,
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
            let card = CardManager.getNewPlayerCard();
            card.allId = this.getNewIncIndex();
            list.push(card);
        }
        return list;
    }

    private getNewIncIndex(): string {
        return "" + this.incIndex++;
    }
}