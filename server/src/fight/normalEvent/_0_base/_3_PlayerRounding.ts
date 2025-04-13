import {Player} from "../../../model/Player";
import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {GAME_CONFIG} from "../../../util/Constant";
import {_4_PlayerRoundEnd} from "./_4_PlayerRoundEnd";

export class _3_PlayerRounding implements Event {
    private currentPlayer: Player;
    private lastTime = GAME_CONFIG.ROUND_ALL_TIME;

    constructor(currentPlayer: Player) {
        this.currentPlayer = currentPlayer;
    }

    getEffectType(room: Room): EventType {
        let data = {
            account: this.currentPlayer.account,
            tips: this.currentPlayer.account + "的出牌阶段",
            time: this.lastTime,
            allTime: GAME_CONFIG.ROUND_ALL_TIME,
        }

        room.broadcast("roomEvent/updateTime", data);

        if (this.lastTime <= 0) {
            return EventType.REMOVE_AND_NEXT;
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
        return new _4_PlayerRoundEnd(this.currentPlayer);
    }
}