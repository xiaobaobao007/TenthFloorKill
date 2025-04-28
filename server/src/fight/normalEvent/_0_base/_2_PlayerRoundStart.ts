import {Player} from "../../../model/Player";
import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {GAME_CONFIG} from "../../../util/Constant";
import {_3_PlayerRounding} from "./_3_PlayerRounding";
import {_6_PlayerRoundEnd} from "./_6_PlayerRoundEnd";
import {EventManager} from "../../../manager/EventManager";
import {_0_GameStartEvent} from "./_0_GameStartEvent";

export class _2_PlayerRoundStart implements Event {
    private readonly currentPlayer: Player;

    private currentEventType = EventType.NONE;

    constructor(currentPlayer: Player) {
        this.currentPlayer = currentPlayer;
    }

    getEffectType(room: Room): EventType {
        if (this.currentEventType == EventType.NONE) {
            this.currentEventType = EventType.EFFECT;
            return EventType.EFFECT;
        } else {
            return EventType.REMOVE_AND_NEXT;
        }
    }

    prv(room: Room): void {
        throw new Error("Method not implemented.");
    }

    doEvent(room: Room): void {
        //清理所有遗留事件
        (EventManager.getEvent(room, _0_GameStartEvent.name) as _0_GameStartEvent).roundEvent.clear();
        room.playerAddNewHandCard(this.currentPlayer, GAME_CONFIG.ROUND_INIT_CARD_NUM, "回合开始");
        room.eventStack.push(new _3_PlayerRounding(this.currentPlayer));
    }

    frameOver(room: Room): void {
    }

    nextEvent(room: Room): Event {
        return new _6_PlayerRoundEnd(this.currentPlayer);
    }

    sendClientInfo(room: Room, player: Player): void {
    }
}