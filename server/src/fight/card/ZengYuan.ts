import {Card} from "../../model/Card";
import {Player} from "../../model/Player";
import {COLOR_GREY} from "../../util/Constant";

/**
 * 增援：摸取自己假情报数量加1的牌
 */
export class ZengYuan extends Card {
    constructor(cardId: string, color: string, direction: string, operation: string, lock: boolean) {
        super(cardId, color, direction, operation, lock);
    }

    doEvent(card: Card, eventPlayer: Player) {
        this.belong!.room!.playerAddNewHandCard(this.belong!, this.belong!.intelligenceCardColorNum(COLOR_GREY) + 1, "增援");
    }
}