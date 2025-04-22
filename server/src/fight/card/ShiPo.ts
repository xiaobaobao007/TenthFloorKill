import {Card} from "../../model/Card";
import {Player} from "../../model/Player";
import {EventManager} from "../../manager/EventManager";
import {_5_IntelligenceCircle} from "../normalEvent/_0_base/_5_IntelligenceCircle";
import {_NoneCard} from "../cardEvent/_NoneCard";

/**
 * 识破：使响应链的最后一张牌的效果失效
 */
export class ShiPo extends Card {
    constructor(cardId: string, color: string, direction: string, operation: string, lock: boolean) {
        super(cardId, color, direction, operation, lock);
    }

    doEvent(player: Player, toCard: Card) {
        const fatherEvent = EventManager.getEvent(player.room!, _5_IntelligenceCircle.name) as _5_IntelligenceCircle;
        const roundEvent = fatherEvent.roundEvent;
        roundEvent.pop();
        roundEvent.pop();
        roundEvent.push(new _NoneCard());
    }
}