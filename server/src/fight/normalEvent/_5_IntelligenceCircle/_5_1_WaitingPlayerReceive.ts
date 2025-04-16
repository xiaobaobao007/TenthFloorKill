import {Player} from "../../../model/Player";
import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {GAME_CONFIG} from "../../../util/Constant";

export class _5_1_WaitingPlayerReceive implements Event {
    private static readonly SEND_BUTTON_INFO = {
        buttonArray: [
            {classType: "success", root: "game/sendIntelligence", name: "接收",},
            {classType: "cancel", root: "game/sendIntelligence", name: "拒绝",},
        ]
    }

    private readonly currentPlayer: Player;
    private receive: boolean | undefined;

    private lastTime = GAME_CONFIG.ROUND_ALL_TIME;

    constructor(currentPlayer: Player) {
        this.currentPlayer = currentPlayer;
    }

    getEffectType(room: Room): EventType {
        if (this.lastTime <= 0) {
            this.currentPlayer.send("roomEvent/clearButton");
            return EventType.REMOVE;
        }

        if (this.lastTime === GAME_CONFIG.ROUND_ALL_TIME) {
            this.sendClientInfo(room, this.currentPlayer);
        }

        this.lastTime -= GAME_CONFIG.GAME_FRAME_TIME;
        return EventType.EFFECT;
    }

    prv(room: Room): void {
        throw new Error("Method not implemented.");
    }

    doEvent(room: Room): void {
        let data = {
            account: this.currentPlayer.account,
            time: this.lastTime,
            allTime: GAME_CONFIG.ROUND_ALL_TIME,
            allTips: this.currentPlayer.account + "的犹豫接收阶段",
            myTips: "请选择是否接收左上角展示的情报",
        }

        room.broadcast("roomEvent/updateTime", data);
    }

    over(room: Room): void {
        throw new Error("Method not implemented.");
    }

    nextEvent(room: Room): Event {
        throw new Error("Method not implemented.");
    }

    sendClientInfo(room: Room, player: Player): void {
        if (player != this.currentPlayer) {
            return;
        }
        player.send("roomEvent/showButton", _5_1_WaitingPlayerReceive.SEND_BUTTON_INFO);
    }

    getEventPlayer(): Player | undefined {
        return this.currentPlayer;
    }

}