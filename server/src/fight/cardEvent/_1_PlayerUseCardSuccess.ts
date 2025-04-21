import {Room} from "../../model/Room";
import {Event} from "../Event";
import {EventType} from "../EventType";
import {Player} from "../../model/Player";
import {Card} from "../../model/Card";

export class _1_PlayerUseCardSuccess implements Event {
    private readonly player: Player;
    private readonly useCard: Card;
    private readonly eventCard: Card;

    /**
     * @param player 使用玩家
     * @param useCard 玩家使用了什么卡牌
     * @param effectCard 对什么卡牌使用的
     */
    constructor(player: Player, useCard: Card, effectCard: Card) {
        this.player = player;
        this.useCard = useCard;
        this.eventCard = effectCard;
    }

    getEffectType(room: Room): EventType {
        throw new Error("Method not implemented.");
    }

    prv(room: Room): void {
        throw new Error("Method not implemented.");
    }

    doEvent(room: Room): void {
        throw new Error("Method not implemented.");
    }

    frameOver(room: Room): void {
        throw new Error("Method not implemented.");
    }

    nextEvent(room: Room): Event | undefined {
        throw new Error("Method not implemented.");
    }

    sendClientInfo(room: Room, player: Player): void {
        if (!player || player != this.player) {
            return;
        }
        this.useCard.doEvent(this.player, this.eventCard);
        room.clearButton();
    }

}