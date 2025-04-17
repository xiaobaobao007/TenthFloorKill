import {Player} from "../../../model/Player";
import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {Card} from "../../../model/Card";
import {_5_IntelligenceCircle} from "../_0_base/_5_IntelligenceCircle";

export class _5_2_PlayerReceive implements Event {
    private readonly fatherEvent: _5_IntelligenceCircle;
    private readonly currentPlayer: Player;
    private readonly intelligenceCard: Card;//情报

    private currentEventType = EventType.NONE;

    constructor(fatherEvent: _5_IntelligenceCircle, currentPlayer: Player, intelligenceCard: Card) {
        this.fatherEvent = fatherEvent;
        this.currentPlayer = currentPlayer;
        this.intelligenceCard = intelligenceCard;
    }

    getEffectType(room: Room): EventType {
        if (this.currentEventType == EventType.NONE) {
            this.currentEventType = EventType.EFFECT;
            return EventType.EFFECT;
        } else {
            return EventType.REMOVE;
        }
    }

    prv(room: Room): void {
        throw new Error("Method not implemented.");
    }

    doEvent(room: Room): void {
        this.fatherEvent.setOver();
        room.broadcast("roomEvent/clearAllIntelligence");
        this.currentPlayer.addIntelligenceCard(this.intelligenceCard);
    }

    frameOver(room: Room): void {
    }

    nextEvent(room: Room): Event {
        throw new Error("Method not implemented.");
    }

    sendClientInfo(room: Room, player: Player): void {
    }
}