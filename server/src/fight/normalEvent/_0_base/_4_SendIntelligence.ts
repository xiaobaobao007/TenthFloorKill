import {Player} from "../../../model/Player";
import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {GAME_CONFIG} from "../../../util/Constant";
import {_5_PlayerRoundEnd} from "./_5_PlayerRoundEnd";

export class _4_SendIntelligence implements Event {
    private static readonly SEND_BUTTON_INFO = {
        buttonArray: [
            {classType: "submit", needNum: 1, root: "1111", name: "发情报",},
        ]
    }

    private currentPlayer: Player;
    private lastTime = GAME_CONFIG.ROUND_ALL_TIME;

    constructor(currentPlayer: Player) {
        this.currentPlayer = currentPlayer;
    }

    getEffectType(room: Room): EventType {
        let data = {
            account: this.currentPlayer.account,
            time: this.lastTime,
            allTime: GAME_CONFIG.ROUND_ALL_TIME,
            allTips: this.currentPlayer.account + "的情报阶段",
            myTips: "情报阶段，请选择1张情报发送",
        }

        room.broadcast("roomEvent/updateTime", data);

        if (this.lastTime <= 0) {
            return EventType.REMOVE_AND_NEXT;
        }

        if (this.lastTime === GAME_CONFIG.ROUND_ALL_TIME) {
            this.currentPlayer.send("roomEvent/showButton", _4_SendIntelligence.SEND_BUTTON_INFO);
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
        return new _5_PlayerRoundEnd(this.currentPlayer);
    }
}