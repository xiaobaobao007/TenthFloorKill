import {Card} from "../../model/Card";
import {_5_1_WaitingPlayerReceive} from "../normalEvent/_5_IntelligenceCircle/_5_1_WaitingPlayerReceive";
import {EventManager} from "../../manager/EventManager";
import {_5_IntelligenceCircle} from "../normalEvent/_0_base/_5_IntelligenceCircle";
import {_4_SendIntelligence} from "../normalEvent/_0_base/_4_SendIntelligence";
import {ROUTER} from "../../util/ServerWsUtil";
import {Room} from "../../model/Room";
import {_0_GameStartEvent} from "../normalEvent/_0_base/_0_GameStartEvent";
import {SaveCard} from "./base/SaveCard";
import {CARD_DIAO_BAO} from "../../util/Constant";

/**
 * 掉包：情报传回传出着时，替换当前情报（无法替换文本），并由传出者重新传递
 */
export class DiaoBao extends SaveCard {

    constructor(color: string, direction: string, operation: string, lock: boolean) {
        super(CARD_DIAO_BAO, color, direction, operation, lock);
    }

    public canUse(toCard: Card | undefined): boolean {
        const room = this._belong!.room!;
        return !(EventManager.getEvent(room, _5_1_WaitingPlayerReceive.name) as _5_1_WaitingPlayerReceive).getIntelligenceCard().isShow();
    }

    sendClientInfo(eventCard: Card) {
        this.doEvent(eventCard);
    }

    doEvent(eventCard: Card) {
        const room = this._belong!.room!;
        let intelligenceCard = (EventManager.getEvent(room, _5_1_WaitingPlayerReceive.name) as _5_1_WaitingPlayerReceive).getIntelligenceCard()

        //情报变成自己手牌
        intelligenceCard.init(intelligenceCard.cardIndex, intelligenceCard.allId, this._belong!);
        this._belong?.addCardArray([intelligenceCard], "掉包-替换");

        //指使下达这张情报
        const inRoundPlayer = room.getInRoundPlayer();
        this.init(this.cardIndex, this.allId, inRoundPlayer);
        inRoundPlayer.addCardArray([this], "掉包-必定下发指定情报");

        this._show = true;

        room.eventStack.remove(EventManager.getEvent(room, _5_1_WaitingPlayerReceive.name)!);
        room.eventStack.remove(EventManager.getEvent(room, _5_IntelligenceCircle.name)!);
        room.eventStack.push(new _4_SendIntelligence(inRoundPlayer));

        room.broadcast(ROUTER.roomEvent.CLEAR_ALL_INTELLIGENCE);
    }

    public static getDiaoBaoCard(room: Room): Card | undefined {
        for (let event of (EventManager.getEvent(room, _0_GameStartEvent.name) as _0_GameStartEvent).roundEvent.getItems()) {
            if (event.canEffect && event.playerCard instanceof DiaoBao) {
                return event.playerCard;
            }
        }
        return undefined;
    }
}