import {Card} from "../../model/Card";
import {_5_IntelligenceCircle} from "../normalEvent/_0_base/_5_IntelligenceCircle";
import {EventManager} from "../../manager/EventManager";
import {_5_1_WaitingPlayerReceive} from "../normalEvent/_5_IntelligenceCircle/_5_1_WaitingPlayerReceive";
import {Player} from "../../model/Player";
import {CARD_DIAO_HU_LI_SHAN} from "../../util/Constant";

/**
 * 调虎离山：他人情报接收时使用，取消接收接着往下传，无法指定原传出者
 */
export class DiaoHuLiShan extends Card {
    constructor(color: string, direction: string, operation: string, lock: boolean) {
        super(CARD_DIAO_HU_LI_SHAN, color, direction, operation, lock);
    }

    public canUse(toCard: Card | undefined, toPlayer: Player | undefined): boolean {
        let event = EventManager.getEvent(this._belong?.room!, _5_IntelligenceCircle.name)!;
        return event != undefined && !(event as _5_IntelligenceCircle).isCurrentPlayer(this._belong?.room?.getInRoundPlayer()!);
    }

    doEvent(eventCard: Card, eventPlayer: Player) {
        const room = this._belong!.room!;
        room.addEventTips("【" + this.belong!.account + "】使用【调虎离山】使情报接着往下传");

        (EventManager.getEvent(room, _5_IntelligenceCircle.name) as _5_IntelligenceCircle).setNext();
        room.eventStack.remove(EventManager.getEvent(room, _5_1_WaitingPlayerReceive.name)!);
    }
}