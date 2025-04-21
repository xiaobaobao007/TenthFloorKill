import {Player} from "./Player";
import {Card} from "./Card";
import {CardManager} from "../manager/CardManager";
import {Event} from "../fight/Event";
import {getNowStr, shuffleArray} from "../util/MathUtil";
import {_0_GameStartEvent} from "../fight/normalEvent/_0_base/_0_GameStartEvent";
import {Stack} from "../util/Stack";
import {CAMP_BLUE, CAMP_CONFIG, CAMP_GREY, CAMP_RED} from "../util/Constant";
import {RoomManager} from "../manager/RoomManager";

export class Room {
    public readonly roomId: string;//房间号
    private _playerArray: Player[] = [];//玩家集合
    private _start = false;//房间是否开始了
    private _leaderAccount: string | undefined;//房主
    private _statistics: any[] = [];//战局记录

    private _incIndex: number = 1;//自增长id
    private _eventStack = new Stack<Event>();//事件栈

    private _cardIndex: number[] = [];
    private _discardIndex: number[] = [];

    constructor(roomId: string) {
        this.roomId = roomId;
    }

    get playerArray(): Player[] {
        return this._playerArray;
    }

    public addPlayer(player: Player) {
        if (this._start) {
            return;
        }

        if (this._playerArray.includes(player)) {
            return;
        }

        player.initInRoom(this);

        this.broadcast("roomEvent/newEvent", {name: player.account + "加入房间"});

        this._playerArray.push(player);

        if (this._playerArray.length == 1) {
            this._leaderAccount = player.account;
        }
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

    gameStart() {
        if (this._start) {
            return;
        }

        //清理所有前端按钮
        this.broadcast("roomEvent/clearButton");

        //游戏卡牌打断
        this._cardIndex = CardManager.getInitCardIndex();
        this._discardIndex = [];

        // this.addRobot(1);

        //玩家位置打乱
        shuffleArray(this._playerArray);

        //分配阵营
        this.resetAllCamp();

        //重置玩家数据
        this.initGameStart();

        this._incIndex = 1;
        this._eventStack.clear();
        this._eventStack.push(new _0_GameStartEvent());

        this.broadcast("roomEvent/newEvent", {name: "游戏开始"});
        this._start = true;
    }

    gameOver() {
        for (let player of this._playerArray) {
            player.initGameOver();
        }

        this.updateRoomToAllPlayer();

        for (let player of this._playerArray) {
            if (player.account == this._leaderAccount) {
                this.updateLeaderButton();
            } else {
                player.showButton(RoomManager.OTHER_READY_BUTTON_INFO);
            }
        }

        let openStatisticsData = {
            all: this.statistics
        };
        this.broadcast("room/openStatistics", openStatisticsData);

        this.broadcast("room/gameOver");
    }

    private initGameStart() {
        for (let player of this._playerArray) {
            player.initGameStart();
        }
    }

    broadcast(route: string, data: any = undefined) {
        for (let i = 0; i < this._playerArray.length; i++) {
            this._playerArray[i].send(route, data);
        }
    }

    broadcastExclude(route: string, player: Player, data: any = undefined) {
        for (let i = 0; i < this._playerArray.length; i++) {
            if (this._playerArray[i] === player) {
                continue;
            }
            this._playerArray[i].send(route, data);
        }
    }

    broadcastPlayers(route: string, players: Player[], data: any = undefined) {
        for (let player of players) {
            player.send(route, data);
        }
    }

    clearButton() {
        for (let i = 0; i < this._playerArray.length; i++) {
            this._playerArray[i].clearButton();
        }
    }

    updateRoomToAllPlayer(sendPlayer: Player | undefined = undefined) {
        if (sendPlayer) {
            this.updateRoomToOnePlayer(sendPlayer);
        } else {
            for (let player of this._playerArray) {
                this.updateRoomToOnePlayer(player);
            }
        }
    }

    updateRoomToOnePlayer(sendPlayer: Player) {
        let roomData = {
            running: this._start,
            roomId: this.roomId,
            leaderAccount: this._leaderAccount,
            player: [] as any[],
        };

        for (let player of this._playerArray) {
            roomData.player.push(player.getClientPlayerInfo(sendPlayer));
        }

        sendPlayer.send("room/update", roomData);
    }

    playerAddNewHandCard(player: Player, num: number) {
        let list: Card[] = [];
        for (let i = 0; i < num; i++) {
            let index = this._cardIndex.pop();

            if (index === undefined) {
                this._cardIndex = this._discardIndex;
                this._discardIndex = [];
                shuffleArray(this._cardIndex);
                index = this._cardIndex.pop()!;
            }

            let card = CardManager.getNewPlayerCard(index);
            card.init(this.getNewIncIndex(), player);
            list.push(card);
        }

        this.broadcast("roomEvent/updateLastCardNum", {lastCardNum: this._cardIndex.length});

        player.addCardArray(list);
    }

    private getNewIncIndex(): string {
        return "" + this._incIndex++;
    }

    playerReLogin(player: Player): void {
        player.send("roomEvent/updateLastCardNum", {lastCardNum: this._cardIndex.length});
    }

    findPlayerByAccount(account: string): Player | undefined {
        for (let player of this.playerArray) {
            if (player.account === account) {
                return player;
            }
        }
    }

    private resetAllCamp() {
        const config = CAMP_CONFIG[this._playerArray.length - 1];
        let campArray: string[] = [];

        for (let i = 0; i < config[1]; i++) {
            campArray.push(CAMP_BLUE);
            campArray.push(CAMP_RED);
        }

        for (let i = 0; i < config[3]; i++) {
            campArray.push(CAMP_GREY);
        }

        shuffleArray(campArray);

        for (let i = 0; i < this._playerArray.length; i++) {
            this._playerArray[i].camp = campArray[i];
        }
    }

    //判断是否仅剩一人存活
    judgeOnlyOnePlayerLive() {
        let player: Player | undefined = undefined;
        for (let i = 0; i < this._playerArray.length; i++) {
            if (this._playerArray[i].live) {
                if (player == undefined) {
                    player = this._playerArray[i];
                } else {
                    return;
                }
            }
        }
        player!.setWin();
    }

    updateLeaderButton() {
        for (let player of this.playerArray) {
            if (player.account === this._leaderAccount || player.ready) {
                continue;
            }

            this.getLeaderAccount().showButton({
                buttonArray: [{classType: "cancel", root: "", name: player.account + "未准备",}, RoomManager.QUIT_ROOM_BUTTON]
            });
            return;
        }

        this.getLeaderAccount().showButton(RoomManager.LEADER_START_BUTTON_INFO);
    }

    private getLeaderAccount(): Player {
        for (const player of this._playerArray) {
            if (player.account === this._leaderAccount) {
                return player;
            }
        }
        throw new Error("房主未找到");
    }

    addStatistics(winPlayerArray: Player[]): void {
        let players: any[] = [];
        for (let player of this._playerArray) {
            players.push({
                account: player.account,
                hero: "",
                camp: player.camp,
                win: winPlayerArray.includes(player),
            });
        }

        let newStatistics = {
            round: this._statistics.length + 1,
            time: getNowStr(),
            players: players
        };
        this._statistics.push(newStatistics);
    }

    private addRobot(num: number) {
        for (let i = 1; i <= num; i++) {
            const robot = new Player(undefined, "robot-" + i);
            robot.room = this;
            robot.ai = true;
            this._playerArray.push(robot);
        }
    }

    get leaderAccount(): string | undefined {
        return this._leaderAccount;
    }

    get eventStack(): Stack<Event> {
        return this._eventStack;
    }

    get start(): boolean {
        return this._start;
    }

    set start(value: boolean) {
        this._start = value;
    }

    get statistics(): any[] {
        return this._statistics;
    }
}