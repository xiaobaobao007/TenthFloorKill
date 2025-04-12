import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {GAME_CONFIG} from "../../../util/Constant";
import {_1_SearchNextPlayer} from "./_1_SearchNextPlayer";

export class _0_GameStartEvent implements Event {
    private hadOver: boolean = false;

    getEffectType(room: Room): EventType {
        if (this.hadOver) {
            return EventType.NEXT;
        }
        return EventType.EFFECT;
    }

    prv(room: Room): void {
        throw new Error("Method not implemented.");
    }

    doEvent(room: Room): void {
        for (const player of room.playerArray) {
            let playerCard = room.getNewPlayerCard(GAME_CONFIG.GAME_INIT_CARD);
            player.addCardArray(playerCard);
        }

        room.updateRoom();

        this.hadOver = true;
    }

    over(room: Room): void {
        throw new Error("Method not implemented.");
    }

    nextEvent(room: Room): Event {
        return new _1_SearchNextPlayer();
    }
}