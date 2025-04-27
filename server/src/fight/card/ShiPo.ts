import {Card} from "../../model/Card";
import {EventManager} from "../../manager/EventManager";
import {_0_GameStartEvent} from "../normalEvent/_0_base/_0_GameStartEvent";

/**
 * 识破：使响应链的最后一张牌的效果失效
 */
export class ShiPo extends Card {
    constructor(cardId: string, color: string, direction: string, operation: string, lock: boolean) {
        super(cardId, color, direction, operation, lock);
    }

    doEvent() {
        const fatherEvent = EventManager.getEvent(this.belong!.room!, _0_GameStartEvent.name) as _0_GameStartEvent;
        const items = fatherEvent.roundEvent.getItems();
        items[items.length - 2].canEffect = false;
    }
}