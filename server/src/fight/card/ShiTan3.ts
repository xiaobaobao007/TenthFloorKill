import {Card} from "../../model/Card";
import {Player} from "../../model/Player";
import {_0_WaitPlayerChooseButton, ButtonData, ButtonEvent} from "../cardEvent/_0_WaitPlayerChooseButton";
import {CARD_SHI_TAN} from "../../util/Constant";
import {ROUTER} from "../../util/SocketUtil";
import {InitManager} from "../../manager/InitManager";
import {random} from "../../util/MathUtil";
import {ShiTan} from "./base/ShiTan";

/**
 * 试探：自己回合中使用，指定除自己以外的玩家使用，（仅双方可见，执行后移出游戏）
 */
export class ShiTan3 extends ShiTan implements ButtonEvent {
    constructor(color: string, direction: string, operation: string, lock: boolean) {
        super(color, direction, operation, lock, CARD_SHI_TAN + "_3");
    }

    public canUse(toCard: Card | undefined, eventPlayer: Player): boolean {
        return eventPlayer != undefined && this._belong != eventPlayer;
    }

    doEvent(ignore: Card, eventPlayer: Player) {
        let buttonArray: ButtonData[] = [];
        buttonArray.push({type: "success", chooseIndex: "0", name: "被" + this.belong!.account + "抽一张牌"});
        buttonArray.push({type: "cancel", chooseIndex: "fail", name: "告诉" + this.belong!.account + "你的身份"});

        this.belong!.room?.eventStack.push(new _0_WaitPlayerChooseButton(buttonArray, this, this.belong!, eventPlayer));
    }

    button_0(player: Player, eventPlayer: Player) {
        if (eventPlayer.handCardArray.length == 0) {
            this.button_fail(player, eventPlayer);
            return;
        }

        const card = eventPlayer.handCardArray[random(eventPlayer.handCardArray.length)];
        eventPlayer.removeCard(card, false);
        eventPlayer.send(ROUTER.roomEvent.ADD_EVENT_TIPS, "【" + card.getName() + "】被抽走了");
        player.room?.broadcastExclude(ROUTER.roomEvent.ADD_EVENT_TIPS, eventPlayer, "【" + eventPlayer.account + "】被【" + player.account + "】抽走一张牌")

        card.belong = player;
        player.addCardArray([card], "试探");
    }

    button_1(player: Player, eventPlayer: Player) {
        this.button_fail(player, eventPlayer);
    }

    button_2(player: Player, eventPlayer: Player) {
        this.button_fail(player, eventPlayer);
    }

    button_fail(player: Player, eventPlayer: Player) {
        player.send(ROUTER.roomEvent.ADD_EVENT_TIPS, "【" + eventPlayer.account + "】的身份是【" + InitManager.getStringValue(eventPlayer.camp) + "】");
        player.room?.broadcast(ROUTER.roomEvent.ADD_EVENT_TIPS, "【" + player.account + "】知晓了【" + eventPlayer.account + "】的阵营")
    }
}