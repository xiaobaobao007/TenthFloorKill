import {Player} from "../../../model/Player";
import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {Card} from "../../../model/Card";
import {_5_IntelligenceCircle} from "../_0_base/_5_IntelligenceCircle";
import {COLOR_GREY} from "../../../util/Constant";
import {ROUTER} from "../../../util/SocketUtil";
import {EventManager} from "../../../manager/EventManager";

export class _5_2_PlayerReceive implements Event {
    private readonly currentPlayer: Player;
    private readonly intelligenceCard: Card;//情报

    private currentEventType = EventType.NONE;

    constructor(currentPlayer: Player, intelligenceCard: Card) {
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
        (EventManager.getEvent(room, _5_IntelligenceCircle.name) as _5_IntelligenceCircle).setOver();
        room.broadcast(ROUTER.roomEvent.CLEAR_ALL_INTELLIGENCE);
        this.currentPlayer.addIntelligenceCard(this.intelligenceCard);

        //收到情报后检测是否胜利了
        this.currentPlayer.judgeWin();

        if (this.intelligenceCard.color == COLOR_GREY) {
            //收到假情报检测自己是否死了
            this.currentPlayer.judgeDie();

            if (!this.currentPlayer.live) {
                //判断房间是否为仅剩一人获胜
                room.judgeOnlyOnePlayerLive();
                return;
            }
        }

        this.intelligenceCard.receiveIntelligenceAfter(this.currentPlayer);
    }

    frameOver(room: Room): void {
    }

    nextEvent(room: Room): Event {
        throw new Error("Method not implemented.");
    }

    sendClientInfo(room: Room, player: Player): void {
    }
}