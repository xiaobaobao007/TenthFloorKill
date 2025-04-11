import {Player} from "../../model/Player";
import {Room} from "../../model/Room";
import {Event} from "../Event";
import {EventType} from "../EventType";
import {GAME_CONFIG} from "../../util/Constant";

export class GameStartEvent implements Event {
    private hadOver: boolean = false;

    getEffectType(room: Room, player: Player | undefined): EventType {
        if (this.hadOver) {
            return EventType.NEXT;
        }
        return EventType.EFFECT;
    }

    prv(room: Room, player: Player | undefined): void {
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

    over(room: Room, player: Player | undefined): void {
        throw new Error("Method not implemented.");
    }

    nextEvent(room: Room, player: Player | undefined): Event | undefined {
        return undefined;
    }
}