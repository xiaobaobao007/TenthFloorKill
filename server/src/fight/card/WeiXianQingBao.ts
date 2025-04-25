import {Card} from "../../model/Card";
import {Player} from "../../model/Player";
import {_0_WaitPlayerChooseOneCard, ChooseCardEvent} from "../cardEvent/_0_WaitPlayerChooseOneCard";
import {InitManager} from "../../manager/InitManager";
import {COLOR_} from "../../util/Constant";

/**
 * 危险情报：检视一名玩家手牌并丢弃一张
 */
export class WeiXianQingBao extends Card implements ChooseCardEvent {
    constructor(cardId: string, color: string, direction: string, operation: string, lock: boolean) {
        super(cardId, color, direction, operation, lock);
    }

    canUse(toCard: Card | undefined, toPlayer: Player | undefined): boolean {
        if (!toPlayer || toPlayer.handCardArray.length === 0) {
            this._belong?.sendTips("请选择一名有手牌的玩家");
            return false;
        }

        if (toPlayer == this._belong && toPlayer.handCardArray.length == 1) {
            this._belong?.sendTips("你这是最后一张手牌不能对自己使用");
            return false;
        }

        return true;
    }

    doEvent(card: Card, eventPlayer: Player) {
        this.belong!.room?.eventStack.push(new _0_WaitPlayerChooseOneCard("请选择一张手牌进行丢弃", "丢弃", this, this.belong!, eventPlayer, true));
    }

    choose(toPlayer: Player, card: Card | undefined): void {
        if (card == undefined) {
            if (toPlayer.handCardArray.length > 0) {
                card = toPlayer.handCardArray[0];
            }
        }

        if (!card) {
            return;
        }

        toPlayer.removeCard(card, true);

        toPlayer.room!.addEventTips("【" + toPlayer.account + "】被【" + this._belong!.account +
            "】危险情报丢弃了一张【" + card.getName() + "-" + InitManager.getStringValue(COLOR_ + card.color) + "】手牌")
    }
}