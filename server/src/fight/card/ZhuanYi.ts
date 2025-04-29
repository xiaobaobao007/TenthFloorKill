import {Card} from "../../model/Card";
import {_5_IntelligenceCircle} from "../normalEvent/_0_base/_5_IntelligenceCircle";
import {EventManager} from "../../manager/EventManager";
import {_5_1_WaitingPlayerReceive} from "../normalEvent/_5_IntelligenceCircle/_5_1_WaitingPlayerReceive";
import {Player} from "../../model/Player";
import {_5_2_PlayerReceive} from "../normalEvent/_5_IntelligenceCircle/_5_2_PlayerReceive";
import {_0_GameStartEvent} from "../normalEvent/_0_base/_0_GameStartEvent";
import {DiaoBao} from "./DiaoBao";
import {CARD_ZHUAN_YI} from "../../util/Constant";

/**
 * 转移：将传至自己的情报传至他人接收
 */
export class ZhuanYi extends Card {
    constructor(color: string, direction: string, operation: string, lock: boolean) {
        super(CARD_ZHUAN_YI, color, direction, operation, lock);
    }

    public canUse(toCard: Card | undefined, toPlayer: Player | undefined): boolean {
        let event = EventManager.getEvent(this._belong?.room!, _5_IntelligenceCircle.name);
        return event != undefined && (event as _5_IntelligenceCircle).isCurrentPlayer(this._belong!) && toPlayer != this._belong;
    }

    doEvent(eventCard: Card, eventPlayer: Player) {
        const room = this._belong!.room!;
        room.addEventTips("【" + this.belong!.account + "】将传至自己的情报至【" + eventPlayer.account + "】接收");
        {
            let event = EventManager.getEvent(room, _5_IntelligenceCircle.name)!;
            (event as _5_IntelligenceCircle).resetPlayer(eventPlayer);
        }

        {
            let event = EventManager.getEvent(room, _5_1_WaitingPlayerReceive.name)!;
            room.eventStack.remove(event);

            this._belong!.room!.eventStack.push(new _5_2_PlayerReceive(eventPlayer, (event as _5_1_WaitingPlayerReceive).getIntelligenceCard()))
        }

        for (const one of (EventManager.getEvent(room, _0_GameStartEvent.name) as _0_GameStartEvent).roundEvent.getItems()) {
            if (one.playerCard instanceof DiaoBao) {
                //转移使掉包无效
                one.canEffect = false;
            }
        }
    }
}