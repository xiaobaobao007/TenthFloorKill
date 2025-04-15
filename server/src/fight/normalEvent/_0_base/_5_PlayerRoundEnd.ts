import {Player} from "../../../model/Player";
import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {GAME_CONFIG} from "../../../util/Constant";

export class _5_PlayerRoundEnd implements Event {
    private currentPlayer: Player;
    private lastTime = GAME_CONFIG.ROUND_ALL_TIME;

    constructor(currentPlayer: Player) {
        this.currentPlayer = currentPlayer;
    }

    getEffectType(room: Room): EventType {
        const discardNumber = this.currentPlayer.handCardArray.length - GAME_CONFIG.MAX_CARD;
        if (discardNumber <= 0) {
            return EventType.REMOVE;
        }

        let data = {
            account: this.currentPlayer.account,
            time: this.lastTime,
            allTime: GAME_CONFIG.ROUND_ALL_TIME,
            allTips: this.currentPlayer.account + "的弃牌阶段",
            myTips: "弃牌阶段，请弃掉" + discardNumber + "张手牌",
        };

        room.broadcast("roomEvent/updateTime", data);

        if (this.lastTime <= 0) {
            return EventType.REMOVE;
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
        return new _5_PlayerRoundEnd(this.currentPlayer);
    }

    sendClientInfo(room: Room, player: Player): void {
        if (player != this.currentPlayer) {
            return;
        }

        player.send("roomEvent/showButton", {
            buttonArray: [
                {classType: "submit", needNum: player.handCardArray.length - GAME_CONFIG.MAX_CARD, root: "1111", name: "弃掉",},
            ]
        });
    }
}