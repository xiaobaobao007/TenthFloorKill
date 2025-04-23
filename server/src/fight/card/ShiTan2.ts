import {Card} from "../../model/Card";
import {Player} from "../../model/Player";
import {CARD_SHI_TAN} from "../../util/Constant";
import {_7_DiscardEvent} from "../normalEvent/_0_base/_7_DiscardEvent";
import {EventManager} from "../../manager/EventManager";
import {_0_GameStartEvent} from "../normalEvent/_0_base/_0_GameStartEvent";
import {InitManager} from "../../manager/InitManager";

/**
 * 试探：自己回合中使用，指定除自己以外的玩家使用，（仅双方可见，执行后移出游戏）
 */
export class ShiTan2 extends Card {
    private readonly takeCamp: string;

    // takeCamp 拿牌的阵营，其他的全部弃牌
    constructor(cardId: string, color: string, direction: string, operation: string, lock: boolean, takeCamp: string) {
        super(cardId, color, direction, operation, lock, CARD_SHI_TAN + "_2_" + takeCamp);
        this.takeCamp = takeCamp;
    }

    doEvent(player: Player, ignore: Card, eventPlayer: Player) {
        const room = player.room!;
        room.addEventTips("【" + player.account + "】对【" + eventPlayer.account + "】试探：" + InitManager.getStringValue(this.otherTips));
        if (eventPlayer.camp == this.takeCamp) {
            room.playerAddNewHandCard(player, 1, "试探");
        } else {
            if (eventPlayer.handCardArray.length == 0) {
                room.addEventTips("没有牌可以被弃");
            } else {
                room.eventStack.push(new _7_DiscardEvent(eventPlayer, 1));
            }
        }
        (EventManager.getEvent(room, _0_GameStartEvent.name) as _0_GameStartEvent).roundEvent.pop();
    }
}