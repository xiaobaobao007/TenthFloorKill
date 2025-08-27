import {Player} from "../../../model/Player";
import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {_2_PlayerRoundStart} from "./_2_PlayerRoundStart";
import {EventManager} from "../../../manager/EventManager";
import {_0_GameStartEvent} from "./_0_GameStartEvent";
import {ROUTER} from "../../../util/ServerWsUtil";

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

        if (this.currentPlayer.live) {
            this.setInRoundPlayer(room, this.currentPlayer);
            room.broadcast(ROUTER.roomEvent.IN_ROUNDING, this.currentPlayer.account);
            return new _2_PlayerRoundStart(this.currentPlayer);
        } else {
            return this.nextEvent(room);
        }
    }

    private setInRoundPlayer(room: Room, player: Player): void {
        for (let p of room.playerArray) {
            if ((p.inRounding = (p === player)) === p.isRoundFirst) {
                (EventManager.getEvent(room, _0_GameStartEvent.name) as _0_GameStartEvent).round++;
            }
        }
    }

    sendClientInfo(room: Room, player: Player): void {
        if (this.currentPlayer) {
            room.broadcast(ROUTER.roomEvent.IN_ROUNDING, this.currentPlayer.account);
        }
    }
}
