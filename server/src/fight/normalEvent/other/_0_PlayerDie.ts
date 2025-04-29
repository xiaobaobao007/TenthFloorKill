import {Player} from "../../../model/Player";
import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {CardManager} from "../../../manager/CardManager";
import {COLOR_GREY, GAME_CONFIG} from "../../../util/Constant";
import {ROUTER} from "../../../util/SocketUtil";

export class _0_PlayerDie implements Event {
    private readonly currentPlayer: Player;

    constructor(currentPlayer: Player) {
        this.currentPlayer = currentPlayer;
    }

    getEffectType(room: Room): EventType {
        if (this.currentPlayer.intelligenceCardColorNum(COLOR_GREY) < GAME_CONFIG.DEAD_GREY_CARD_NUM) {
            return EventType.REMOVE;
        }

        if (CardManager.judgeCardEvent(room, undefined, CardManager.WILL_DIE, 0, this.currentPlayer)) {
            let tips = "【" + this.currentPlayer.account + "】即将死亡，祈求【烧毁】";
            room.addEventTips(tips)
            room.broadcast(ROUTER.base.TIPS, tips)
            return EventType.NONE;
        }

        //玩家死亡
        if (this.currentPlayer.judgeDie()) {
            //判断房间是否为仅剩一人获胜
            room.judgeOnlyOnePlayerLive();
        }

        return EventType.REMOVE;
    }

    prv(room: Room): void {
        throw new Error("Method not implemented.");
    }

    doEvent(room: Room): void {
        throw new Error("Method not implemented.");
    }

    frameOver(room: Room): void {
    }

    nextEvent(room: Room): Event | undefined {
        throw new Error("Method not implemented.");
    }

    sendClientInfo(room: Room, player: Player | undefined): void {
    }

}