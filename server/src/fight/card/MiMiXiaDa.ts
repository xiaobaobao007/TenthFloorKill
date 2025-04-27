import {Card} from "../../model/Card";
import {ROUTER} from "../../util/SocketUtil";
import {COLOR_, COLOR_BLUE, COLOR_DOUBLE, COLOR_GREY, COLOR_RED} from "../../util/Constant";
import {Player} from "../../model/Player";
import {InitManager} from "../../manager/InitManager";
import {_0_WaitPlayerChooseOneCard, ChooseCardEvent} from "../cardEvent/_0_WaitPlayerChooseOneCard";

export class MiMiXiaDa extends Card implements ChooseCardEvent {
    private _chooseColor!: string;

    constructor(cardId: string, color: string, direction: string, operation: string, lock: boolean) {
        super(cardId, color, direction, operation, lock);
    }

    setUseParam(param: string | undefined): boolean {
        if (param != COLOR_GREY && param != COLOR_BLUE && param != COLOR_RED) {
            return false;
        }
        this._chooseColor = param;
        return true;
    }

    canUse(): boolean {
        return !this._belong!.inRounding;
    }

    doEvent(eventCard: Card, eventPlayer: Player) {
        this._belong?.room?.addEventTips("【" + this._belong?.account + "】对【" + eventPlayer.account + "】使用了【秘密下达】");

        let tips = "【" + this._belong?.account + "】要求你下发【" + InitManager.getStringValue(COLOR_ + this._chooseColor) + "】";
        eventPlayer.send(ROUTER.roomEvent.ADD_EVENT_TIPS, tips);

        for (let card of eventPlayer.handCardArray) {
            if (card.color == this._chooseColor || (this._chooseColor != COLOR_GREY && card.color == COLOR_DOUBLE)) {
                return;
            }
        }

        this.belong!.room?.eventStack.push(new _0_WaitPlayerChooseOneCard("请查看【" + eventPlayer.account + "】的手牌", "确认", this, this.belong!, eventPlayer, undefined));
    }

    choose(toPlayer: Player, card: Card | undefined): void {
    }
}