import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {GAME_CONFIG} from "../../../util/Constant";
import {_1_SearchNextPlayer} from "./_1_SearchNextPlayer";
import {Player} from "../../../model/Player";

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
        room.updateRoom();

        for (const player of room.playerArray) {
            let playerCard = room.getNewPlayerCard(GAME_CONFIG.GAME_INIT_CARD_NUM);
            player.addCardArray(playerCard);
        }

        this.hadOver = true;
    }

    over(room: Room): void {
        throw new Error("Method not implemented.");
    }

    nextEvent(room: Room): Event {
        return new _1_SearchNextPlayer();
    }

    sendClientInfo(room: Room, player: Player): void {
    }

    getEventPlayer(): Player | undefined {
        return undefined;
    }
}