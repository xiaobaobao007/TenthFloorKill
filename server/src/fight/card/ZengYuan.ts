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

    doEvent(player: Player, card: Card, eventPlayer: Player) {
        player.room!.playerAddNewHandCard(player, player.intelligenceCardColorNum(COLOR_GREY) + 1, "增援");
    }
}