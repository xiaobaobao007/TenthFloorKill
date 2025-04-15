import {Player} from "../../../model/Player";
import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {GAME_CONFIG} from "../../../util/Constant";
import {_4_SendIntelligence} from "./_4_SendIntelligence";

export class _3_PlayerRounding implements Event {
    private static readonly SEND_BUTTON_INFO = {
        buttonArray: [
            {classType: "submit", needCardNum: 1, root: "1111", name: "出牌",},
            {classType: "cancel", root: "2222", name: "结束出牌",},
        ]
    }

    private readonly currentPlayer: Player;
    private lastTime = GAME_CONFIG.ROUND_ALL_TIME;

    constructor(currentPlayer: Player) {
        this.currentPlayer = currentPlayer;
    }

    getEffectType(room: Room): EventType {
        let data = {
            account: this.currentPlayer.account,
            time: this.lastTime,
            allTime: GAME_CONFIG.ROUND_ALL_TIME,
            allTips: this.currentPlayer.account + "的出牌阶段",
            myTips: "请选择1张卡牌",
        }

        room.broadcast("roomEvent/updateTime", data);

        if (this.lastTime <= 0) {
            return EventType.REMOVE_AND_NEXT;
        }

        if (this.lastTime === GAME_CONFIG.ROUND_ALL_TIME) {
            this.sendClientInfo(room, this.currentPlayer);
        }

        this.lastTime -= GAME_CONFIG.GAME_FRAME_TIME;
        return EventType.NONE;
    }

    prv(room: Room): void {
        throw new Error("Method not implemented.");
    }

    doEvent(room: Room): void {
        throw new Error("Method not implemented.");
    }

    over(room: Room): void {
        throw new Error("Method not implemented.");
    }

    nextEvent(room: Room): Event {
        this.currentPlayer.send("roomEvent/clearButton");
        return new _4_SendIntelligence(this.currentPlayer);
    }

    sendClientInfo(room: Room, player: Player): void {
        if (player != this.currentPlayer) {
            return;
        }
        player.send("roomEvent/showButton", _3_PlayerRounding.SEND_BUTTON_INFO);
    }
}