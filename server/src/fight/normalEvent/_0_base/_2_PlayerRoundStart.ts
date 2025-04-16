import {Player} from "../../../model/Player";
import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {GAME_CONFIG} from "../../../util/Constant";
import {_3_PlayerRounding} from "./_3_PlayerRounding";
import {_6_PlayerRoundEnd} from "./_6_PlayerRoundEnd";

export class _2_PlayerRoundStart implements Event {
    private readonly currentPlayer: Player;
    private hadEffect = false;

    constructor(currentPlayer: Player) {
        this.currentPlayer = currentPlayer;
    }

    getEffectType(room: Room): EventType {
        if (this.hadEffect) {
            return EventType.REMOVE_AND_NEXT;
        }
        this.hadEffect = true;
        return EventType.EFFECT;
    }

    prv(room: Room): void {
        throw new Error("Method not implemented.");
    }

    doEvent(room: Room): void {
        this.currentPlayer.addCardArray(room.getNewPlayerCard(GAME_CONFIG.ROUND_INIT_CARD_NUM));
        room.eventStack.push(new _3_PlayerRounding(this.currentPlayer));
    }

    over(room: Room): void {
        throw new Error("Method not implemented.");
    }

    nextEvent(room: Room): Event {
        return new _6_PlayerRoundEnd(this.currentPlayer);
    }

    sendClientInfo(room: Room, player: Player): void {
    }

    getEventPlayer(): Player | undefined {
        return this.currentPlayer;
    }
}