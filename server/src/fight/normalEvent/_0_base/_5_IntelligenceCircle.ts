import {Player} from "../../../model/Player";
import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {Card} from "../../../model/Card";
import {_5_1_WaitingPlayerReceive} from "../_5_IntelligenceCircle/_5_1_WaitingPlayerReceive";
import {DIRECTION_ALL, DIRECTION_RIGHT} from "../../../util/Constant";
import {ROUTER} from "../../../util/SocketUtil";

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
        } else if (this.currentEventType == EventType.NEXT) {
            this.currentEventType = EventType.EFFECT;
            return EventType.NEXT;
        } else {
            return EventType.REMOVE;
        }
    }

    prv(room: Room): void {
        if (this.intelligenceCard.hand) {
            //移除玩家手牌
            this.sendPlayer.removeCard(this.intelligenceCard, false);
            this.intelligenceCard.hand = false;
        }
        this.sendClientInfo(room, this.sendPlayer);
        this.currentEventType = EventType.EFFECT;
        this.sendPlayer.clearButton();

        if (this.intelligenceCard.isZhiDa()) {
            room.addEventTips("【" + this.sendPlayer.account + "】向【" + this.targetPlayer.account + "】发送了直达情报");
        } else if (this.indexIsInc) {
            room.addEventTips("【" + this.sendPlayer.account + "】逆时针发送了情报");
        } else {
            room.addEventTips("【" + this.sendPlayer.account + "】顺时针发送了情报");
        }
    }

    doEvent(room: Room): void {
        if (this.intelligenceCard.isZhiDa()) {
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

        if (!this.currentPlayer.live) {
            this.doEvent(room);
        }
    }

    frameOver(room: Room): void {
    }

    nextEvent(room: Room): Event {
        return new _5_1_WaitingPlayerReceive(this.sendPlayer, this.currentPlayer!, this.intelligenceCard);
    }

    sendClientInfo(room: Room, player: Player): void {
        const otherCardInfo = this.intelligenceCard!.getOtherCardInfo();
        otherCardInfo.direction = this.indexIsInc ? undefined : DIRECTION_ALL;

        if (player) {
            if (this.sendPlayer == player) {
                if (!player.reLogin) {
                    room.broadcastExclude(ROUTER.roomEvent.UPDATE_ALL_INTELLIGENCE, this.sendPlayer, otherCardInfo);
                }
                this.sendPlayer.send(ROUTER.roomEvent.UPDATE_ALL_INTELLIGENCE, this.intelligenceCard!.getSelfCardInfo());
            } else {
                player.send(ROUTER.roomEvent.UPDATE_ALL_INTELLIGENCE, otherCardInfo);
            }
        }
    }

    private getIndexIsInc(): boolean {
        if (this.intelligenceCard.isZhiDa() || this.intelligenceCard.direction == DIRECTION_RIGHT) {
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

    setOver() {
        this.currentEventType = EventType.REMOVE;
    }
}