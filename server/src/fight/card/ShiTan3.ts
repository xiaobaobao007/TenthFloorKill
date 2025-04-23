import {Card} from "../../model/Card";
import {Player} from "../../model/Player";
import {_0_WaitPlayerChooseButton, ButtonEvent} from "../cardEvent/_0_WaitPlayerChooseButton";
import {CARD_SHI_TAN} from "../../util/Constant";
import {ROUTER} from "../../util/SocketUtil";
import {InitManager} from "../../manager/InitManager";
import {random} from "../../util/MathUtil";

/**
 * 试探：自己回合中使用，指定除自己以外的玩家使用，（仅双方可见，执行后移出游戏）
 */
export class ShiTan3 extends Card implements ButtonEvent {
    constructor(cardId: string, color: string, direction: string, operation: string, lock: boolean) {
        super(cardId, color, direction, operation, lock, CARD_SHI_TAN + "_3");
    }

    doEvent(player: Player, ignore: Card, eventPlayer: Player) {
        player.room?.eventStack.push(new _0_WaitPlayerChooseButton("被" + player.account + "抽一张牌", "告诉" + player.account + "你的身份", this, player, eventPlayer));
    }

    success(player: Player, eventPlayer: Player): boolean {
        if (eventPlayer.handCardArray.length == 0) {
            return false;
        }

        const card = eventPlayer.handCardArray[random(eventPlayer.handCardArray.length)];
        eventPlayer.removeCard(card, false);
        eventPlayer.send(ROUTER.roomEvent.ADD_EVENT_TIPS, "【" + card.getName() + "】被抽走了");

        card.init(card.cardIndex, player.room!.getNewIncIndex(), player);
        player.addCardArray([card], "试探");
        eventPlayer.send(ROUTER.roomEvent.ADD_EVENT_TIPS, "【" + card.getName() + "】被抽走了");

        return true;
    }

    fail(player: Player, eventPlayer: Player): boolean {
        player.send(ROUTER.roomEvent.ADD_EVENT_TIPS, "【" + eventPlayer.account + "】的身份是【" + InitManager.getStringValue(eventPlayer.camp) + "】");
        return true;
    }
}