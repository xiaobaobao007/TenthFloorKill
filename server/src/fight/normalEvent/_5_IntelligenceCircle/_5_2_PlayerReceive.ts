import {Player} from "../../../model/Player";
import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {Card} from "../../../model/Card";

export class _5_2_PlayerReceive implements Event {
    private readonly currentPlayer: Player;
    private readonly intelligenceCard: Card;//情报

    private currentEventType = EventType.NONE;

    constructor(currentPlayer: Player, intelligenceCard: Card) {
        this.currentPlayer = currentPlayer;
        this.intelligenceCard = intelligenceCard;
    }

    getEffectType(room: Room): EventType {
        switch (this.currentEventType) {
            case EventType.NONE:
                return EventType.PRE;
            default:
                return this.currentEventType;
        }
    }

    prv(room: Room): void {
        // let data = {
        //     allTips: this.currentPlayer.account + "的成功接收阶段",
        // }
        // room.broadcast("roomEvent/updateTime", data);

        this.currentEventType = EventType.EFFECT;
    }

    doEvent(room: Room): void {
        this.currentPlayer.addIntelligenceCard(this.intelligenceCard);
        this.currentEventType = EventType.REMOVE;
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
        return this.currentPlayer;
    }

}