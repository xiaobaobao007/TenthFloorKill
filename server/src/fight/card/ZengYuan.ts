import {Card} from "../../model/Card";
import {Player} from "../../model/Player";
import {CARD_ZENG_YUAN, COLOR_GREY} from "../../util/Constant";

/**
 * 增援：摸取自己假情报数量加1的牌
 */
export class ZengYuan extends Card {
    constructor(color: string, direction: string, operation: string, lock: boolean) {
        super(CARD_ZENG_YUAN, color, direction, operation, lock);
    }

    doEvent(card: Card, eventPlayer: Player) {
        this.belong!.room!.playerAddNewHandCard(this.belong!, this.belong!.intelligenceCardColorNum(COLOR_GREY) + 1, "增援");
    }
}