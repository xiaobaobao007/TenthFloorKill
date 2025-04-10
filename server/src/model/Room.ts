import {Player} from "./Player";

export class Room {
    private _roomId: string;
    private _playerArray: Player[] = [];
    private _start = false;

    private leaderAccount: string | undefined;

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
            roomData.player.push(player.getInfo());
            roomData.player.push(player.getInfo());
        }

        this.broadcast("room/update", roomData);
    }
}