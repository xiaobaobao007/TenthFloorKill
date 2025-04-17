import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {GAME_CONFIG} from "../../../util/Constant";
import {_1_SearchNextPlayer} from "./_1_SearchNextPlayer";
import {Player} from "../../../model/Player";

export class _0_GameStartEvent implements Event {
    private currentEventType = EventType.NONE;

    getEffectType(room: Room): EventType {
        if (this.currentEventType == EventType.NONE) {
            this.currentEventType = EventType.EFFECT;
            return EventType.PRE;
        } else if (this.currentEventType == EventType.EFFECT) {
            this.currentEventType = EventType.NEXT;
            return EventType.EFFECT;
        } else {
            return EventType.NEXT;
        }
    }

    prv(room: Room): void {
        room.updateRoom();
    }

    doEvent(room: Room): void {
        for (const player of room.playerArray) {
            let playerCard = room.getNewPlayerCard(GAME_CONFIG.GAME_INIT_CARD_NUM);
            player.addCardArray(playerCard);
        }
    }

    frameOver(room: Room): void {
    }

    nextEvent(room: Room): Event {
        return new _1_SearchNextPlayer();
    }

    sendClientInfo(room: Room, player: Player): void {
    }
}