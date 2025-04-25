import {Card} from "../../model/Card";
import {Player} from "../../model/Player";
import {COLOR_GREY} from "../../util/Constant";

/**
 * 机密文件：场上真情报超过4张摸2张，超过5张摸3张
 */
export class JiMiWenJian extends Card {
    constructor(cardId: string, color: string, direction: string, operation: string, lock: boolean) {
        super(cardId, color, direction, operation, lock);
    }

    public canUse(toCard: Card | undefined): boolean {
        if (!toCard) {
            return false;
        }
        let allReadIntelligenceNum = 0;
        for (const player of toCard.belong?.room?.playerArray!) {
            allReadIntelligenceNum += player.intelligenceCardArray.length - player.intelligenceCardColorNum(COLOR_GREY);
        }

        if (allReadIntelligenceNum <= 4) {
            toCard.belong?.sendTips("当前真情报仅有【" + allReadIntelligenceNum + "】张，请使用其他牌");
            return false;
        }

        return true;
    }

    doEvent(card: Card, eventPlayer: Player) {
        const room = this.belong!.room!;

        let allReadIntelligenceNum = 0;
        for (const p of room.playerArray!) {
            allReadIntelligenceNum += p.intelligenceCardArray.length - p.intelligenceCardColorNum(COLOR_GREY);
        }

        let num = 3;
        if (allReadIntelligenceNum > 5) {
            num = 3;
        } else if (allReadIntelligenceNum > 4) {
            num = 2;
        }

        room.playerAddNewHandCard(this.belong!, num, "机密文件");
    }
}