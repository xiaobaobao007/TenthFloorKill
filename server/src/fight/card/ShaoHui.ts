import {Card} from "../../model/Card";
import {Player} from "../../model/Player";
import {_0_WaitPlayerChooseOneCard, ChooseCardEvent} from "../cardEvent/_0_WaitPlayerChooseOneCard";
import {InitManager} from "../../manager/InitManager";
import {COLOR_} from "../../util/Constant";

/**
 * 烧毁：烧毁一张不带锁的假情报
 */
export class ShaoHui extends Card implements ChooseCardEvent {
    constructor(cardId: string, color: string, direction: string, operation: string, lock: boolean) {
        super(cardId, color, direction, operation, lock);
    }

    canUse(toCard: Card, toPlayer: Player | undefined): boolean {
        if (!toPlayer) {
            return false;
        }

        for (let card of toPlayer.intelligenceCardArray) {
            if (card.canShaoHui()) {
                return true;
            }
        }

        this._belong?.sendTips("请选择一名有假情报的玩家");
        return false;
    }

    doEvent(card: Card, eventPlayer: Player) {
        this.belong!.room?.eventStack.push(new _0_WaitPlayerChooseOneCard("请选择一张假情报进行烧毁", "烧毁", this, this.belong!, eventPlayer, false));
    }

    choose(toPlayer: Player, card: Card | undefined): void {
        if (card == undefined) {
            for (let c of toPlayer.intelligenceCardArray) {
                if (c.canShaoHui()) {
                    card = c;
                }
            }
        }

        if (!card) {
            return;
        }

        toPlayer.removeIntelligenceCard(card);

        toPlayer.room!.addEventTips("【" + toPlayer.account + "】被【" + this._belong!.account +
            "】烧毁了一张【" + card.getName() + "-" + InitManager.getStringValue(COLOR_ + card.color) + "】")

    }
}