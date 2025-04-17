import {Player} from "../../../model/Player";
import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {_2_PlayerRoundStart} from "./_2_PlayerRoundStart";

export class _1_SearchNextPlayer implements Event {
    private currentPlayer: Player | undefined = undefined;

    getEffectType(room: Room): EventType {
        return EventType.NEXT;
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

        return new _2_PlayerRoundStart(this.currentPlayer);
    }

    sendClientInfo(room: Room, player: Player): void {
    }
}