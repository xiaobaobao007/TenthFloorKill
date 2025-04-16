import {Player} from "../../../model/Player";
import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {_2_PlayerRoundStart} from "./_2_PlayerRoundStart";

export class _1_SearchNextPlayer implements Event {
    private currentPlayer: Player | undefined = undefined;

    getEffectType(room: Room): EventType {
        return EventType.EFFECT;
    }

    prv(room: Room): void {
        throw new Error("Method not implemented.");
    }

    doEvent(room: Room): void {
        let playerArray = room.playerArray;
        if (this.currentPlayer) {
            let nextPlayerIndex = playerArray.indexOf(this.currentPlayer) + 1;
            if (nextPlayerIndex >= playerArray.length) {
                nextPlayerIndex = 0;
            }
            this.currentPlayer = playerArray[nextPlayerIndex];
        } else {
            this.currentPlayer = playerArray[0];
        }

        room.eventStack.push(new _2_PlayerRoundStart(this.currentPlayer));
    }

    over(room: Room): void {
        throw new Error("Method not implemented.");
    }

    nextEvent(room: Room): Event {
        throw new Error("Method not implemented.");
    }

    sendClientInfo(room: Room, player: Player): void {
    }

    getEventPlayer(): Player | undefined {
        return undefined;
    }
}