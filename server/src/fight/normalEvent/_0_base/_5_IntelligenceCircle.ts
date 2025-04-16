import {Player} from "../../../model/Player";
import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {Card} from "../../../model/Card";
import {_6_PlayerRoundEnd} from "./_6_PlayerRoundEnd";
import {_5_1_WaitingPlayerReceive} from "../_5_IntelligenceCircle/_5_1_WaitingPlayerReceive";
import {_5_2_PlayerReceive} from "../_5_IntelligenceCircle/_5_2_PlayerReceive";

export class _5_IntelligenceCircle implements Event {
    private static readonly SEND_BUTTON_INFO = {
        buttonArray: [
            {classType: "submit", needCardNum: 1, needPlayerNum: 1, root: "game/sendIntelligence", name: "发情报",},
        ]
    }

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
        switch (this.currentEventType) {
            case EventType.NONE:
                return EventType.PRE;
            default:
                return this.currentEventType;
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
        if (this.intelligenceCard.operation == "ope_z" || this.intelligenceCard.clientOperation == "ope_z") {
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
                if (-index < 0) {
                    index = room.playerArray.length - 1;
                }
            }

            this.currentPlayer = room.playerArray[index];
        }

        if (this.currentPlayer == this.sendPlayer) {
            this.currentEventType = EventType.REMOVE_AND_NEXT;
            room.eventStack.push(new _5_2_PlayerReceive(this.currentPlayer, this.intelligenceCard));
        } else {
            room.eventStack.push(new _5_1_WaitingPlayerReceive(this.currentPlayer, this.intelligenceCard));
        }
    }

    over(room: Room): void {
        throw new Error("Method not implemented.");
    }

    nextEvent(room: Room): Event {
        this.sendPlayer.send("roomEvent/clearButton");
        return new _6_PlayerRoundEnd(this.sendPlayer);
    }

    sendClientInfo(room: Room, player: Player): void {
        room.broadcast("roomEvent/updateAllIntelligence", this.intelligenceCard!.getSelfCardInfo());
    }

    getEventPlayer(): Player | undefined {
        return this.sendPlayer;
    }

    private getIndexIsInc(): boolean {
        if (this.intelligenceCard.operation == "ope_z" ||
            this.intelligenceCard.clientOperation == "ope_z" ||
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