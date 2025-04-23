import {Player} from "../../../model/Player";
import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {GAME_CONFIG} from "../../../util/Constant";
import {_7_DiscardEvent} from "./_7_DiscardEvent";

export class _6_PlayerRoundEnd implements Event {
    private readonly currentPlayer: Player;

    constructor(currentPlayer: Player) {
        this.currentPlayer = currentPlayer;
    }

    getEffectType(room: Room): EventType {
        if (!this.currentPlayer.live) {
            return EventType.REMOVE;
        }

        const discardNumber = this.currentPlayer.handCardArray.length - GAME_CONFIG.MAX_CARD;
        if (discardNumber <= 0) {
            return EventType.REMOVE;
        }

        return EventType.REMOVE_AND_NEXT;
    }

    prv(room: Room): void {
        throw new Error("Method not implemented.");
    }

    doEvent(room: Room): void {
        throw new Error("Method not implemented.");
    }

    frameOver(room: Room): void {
    }

    nextEvent(room: Room): Event {
        const discardNumber = this.currentPlayer.handCardArray.length - GAME_CONFIG.MAX_CARD;
        return new _7_DiscardEvent(this.currentPlayer, discardNumber);
    }

    sendClientInfo(room: Room, player: Player): void {
    }
}