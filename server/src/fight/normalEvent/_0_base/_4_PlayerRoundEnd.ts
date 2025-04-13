import {Player} from "../../../model/Player";
import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {GAME_CONFIG} from "../../../util/Constant";

export class _4_PlayerRoundEnd implements Event {
    private currentPlayer: Player;
    private lastTime = GAME_CONFIG.ROUND_OVER_TIME;

    private deleteCardArray: number[] = [];

    constructor(currentPlayer: Player) {
        this.currentPlayer = currentPlayer;
    }

    getEffectType(room: Room): EventType {
        if (this.currentPlayer.handCardArray.length <= GAME_CONFIG.MAX_CARD) {
            return EventType.REMOVE;
        }

        let data = {
            account: this.currentPlayer.account,
            tips: this.currentPlayer.account + "的弃牌阶段",
            time: this.lastTime,
            allTime: GAME_CONFIG.ROUND_OVER_TIME,
        };

        room.broadcast("roomEvent/updateTime", data);

        if (this.lastTime <= 0) {
            return EventType.REMOVE_AND_NEXT;
        }

        if (this.lastTime == GAME_CONFIG.ROUND_OVER_TIME) {
            this.lastTime -= GAME_CONFIG.GAME_FRAME_TIME;
            return EventType.PRE;
        } else {
            this.lastTime -= GAME_CONFIG.GAME_FRAME_TIME;
            return EventType.EFFECT;
        }
    }

    prv(room: Room): void {
        //通知前端弃牌
    }

    doEvent(room: Room): void {
        if (this.deleteCardArray.length == 0) {
            return;
        }

        if (this.currentPlayer.handCardArray.length - this.deleteCardArray.length > GAME_CONFIG.MAX_CARD) {
            return;
        }
    }

    over(room: Room): void {
        throw new Error("Method not implemented.");
    }

    nextEvent(room: Room): Event {
        return new _4_PlayerRoundEnd(this.currentPlayer);
    }
}