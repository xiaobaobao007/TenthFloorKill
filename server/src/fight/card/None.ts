import {Card} from "../../model/Card";

/**
 * 暂未实现的卡牌
 */
export class None extends Card {
    constructor(cardId: string, color: string, direction: string, operation: string, lock: boolean) {
        super(cardId, color, direction, operation, lock);
    }

    doEvent() {
    }
}