import {Player} from "../../../model/Player";
import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {Card} from "../../../model/Card";
import {_5_1_WaitingPlayerReceive} from "../_5_IntelligenceCircle/_5_1_WaitingPlayerReceive";
import {CARD_OPERATION} from "../../../util/Constant";

export class _5_IntelligenceCircle implements Event {
    private readonly sendPlayer: Player;//传出者
    private readonly intelligenceCard: Card;//要传出的情报
    private readonly targetPlayer: Player;//接收者
    private readonly indexIsInc: boolean;//是否为按照正常座位顺序传递情报

    private currentEventType = EventType.NONE;
    private currentPlayer: Player | undefined;

    constructor(currentPlayer: Player, intelligenceCard: Card, targetPlayer: Player) {
        this.sendPlayer = currentPlayer;
        this.intelligenceCard = intelligenceCard;
        this.targetPlayer = targetPlayer;
        this.indexIsInc = this.getIndexIsInc();
    }

    getEffectType(room: Room): EventType {
        if (this.currentEventType == EventType.NONE) {
            this.currentEventType = EventType.EFFECT;
            return EventType.PRE;
        } else if (this.currentEventType == EventType.EFFECT) {
            this.currentEventType = EventType.NEXT;
            return EventType.EFFECT;
        } else {
            this.currentEventType = EventType.EFFECT;
            return this.currentPlayer == this.sendPlayer ? EventType.REMOVE_AND_NEXT : EventType.NEXT;
        }
    }

    prv(room: Room): void {
        if (this.intelligenceCard.hand) {
            //移除玩家手牌
            this.sendPlayer.removeCard(this.intelligenceCard);
        }

        this.sendClientInfo(room, this.sendPlayer);

        this.currentEventType = EventType.EFFECT;
    }

    doEvent(room: Room): void {
        if (this.intelligenceCard.operation == CARD_OPERATION.ZHI_DA || this.intelligenceCard.clientOperation == CARD_OPERATION.ZHI_DA) {
            if (this.currentPlayer) {
                this.currentPlayer = this.sendPlayer;
            } else {
                this.currentPlayer = this.targetPlayer;
            }
        } else {
            if (!this.currentPlayer) {
                this.currentPlayer = this.sendPlayer;
            }

            let index = room.playerArray.indexOf(this.currentPlayer);
            if (this.indexIsInc) {
                if (++index >= room.playerArray.length) {
                    index = 0;
                }
            } else {
                if (--index < 0) {
                    index = room.playerArray.length - 1;
                }
            }

            this.currentPlayer = room.playerArray[index];
        }
    }

    frameOver(room: Room): void {
    }

    nextEvent(room: Room): Event {
        this.sendPlayer.send("roomEvent/clearButton");
        return new _5_1_WaitingPlayerReceive(this.sendPlayer, this.currentPlayer!, this.intelligenceCard);
    }

    sendClientInfo(room: Room, player: Player): void {
        const otherCardInfo = this.intelligenceCard!.getOtherCardInfo();
        otherCardInfo.direction = this.indexIsInc ? undefined : CARD_OPERATION.FAN_ZHUAN;

        if (this.currentPlayer != player) {
            player.send("roomEvent/updateAllIntelligence", otherCardInfo);
            return;
        }

        room.broadcastExclude("roomEvent/updateAllIntelligence", this.currentPlayer, otherCardInfo);

        this.currentPlayer.send("roomEvent/updateAllIntelligence", this.intelligenceCard!.getSelfCardInfo());
    }

    private getIndexIsInc(): boolean {
        if (this.intelligenceCard.operation == CARD_OPERATION.ZHI_DA ||
            this.intelligenceCard.clientOperation == CARD_OPERATION.ZHI_DA ||
            this.intelligenceCard.direction == "dir_r") {
            return true;
        }

        const allPlayerArray = this.sendPlayer.room!.playerArray!;
        const myIndex = allPlayerArray.indexOf(this.sendPlayer);
        const targetIndex = allPlayerArray.indexOf(this.targetPlayer);

        let incIndex = targetIndex - myIndex;
        if (incIndex < 0) {
            incIndex += allPlayerArray.length;
        }

        let decIndex = myIndex - targetIndex;
        if (decIndex < 0) {
            decIndex += allPlayerArray.length;
        }

        return incIndex <= decIndex;
    }

}