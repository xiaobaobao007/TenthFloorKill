import {Card} from "../../model/Card";
import {ShiTan} from "./base/ShiTan";
import {SuoDing} from "./SuoDing";
import {ZhuanYi} from "./ZhuanYi";
import {WeiXianQingBao} from "./WeiXianQingBao";
import {GongKaiWenBen} from "./GongKaiWenBen";
import {Player} from "../../model/Player";
import {EventManager} from "../../manager/EventManager";
import {_0_GameStartEvent} from "../normalEvent/_0_base/_0_GameStartEvent";
import {CardManager} from "../../manager/CardManager";
import {CARD_LI_JIAN} from "../../util/Constant";
import {_0_WaitPlayerUseCard} from "../cardEvent/_0_WaitPlayerUseCard";

/**
 * 离间：变更【试探/锁定/转移/危险情报/公开文本】的指定目标，无法指定使用者
 */
export class LiJian extends Card {
    constructor(cardId: string, color: string, direction: string, operation: string, lock: boolean) {
        super(cardId, color, direction, operation, lock);
    }

    public canUse(toCard: Card, toPlayer: Player | undefined): boolean {
        const room = this._belong?.room!;

        if (toPlayer == undefined) {
            let num = 0;
            for (const player of room.playerArray!) {
                if (player.live) {
                    num++;
                }
            }
            return num > 2;
        }

        let eventArray = (EventManager.getEvent(room, _0_GameStartEvent.name) as _0_GameStartEvent).roundEvent.getItems();
        if (eventArray.length < 1) {
            return false;
        }

        const useCardSuccess = eventArray[eventArray.length - 1];
        if (useCardSuccess.getEffectPlayer() == toPlayer) {
            this._belong?.sendTips("无法指定原被使用者");
            return false;
        }

        if (useCardSuccess.playerCard.belong == toPlayer) {
            this._belong?.sendTips("无法指定原使用者");
            return false;
        }
        return true;
    }

    doEvent(eventCard: Card, effectPlayer: Player) {
        const room = this._belong?.room!;
        let eventArray = (EventManager.getEvent(room, _0_GameStartEvent.name) as _0_GameStartEvent).roundEvent.getItems();
        const useCardSuccess = eventArray[eventArray.length - 2];
        useCardSuccess.setEffectPlayer(effectPlayer);

        for (let event of room.eventStack.getItems()) {
            if (event instanceof _0_WaitPlayerUseCard) {
                const p = event as _0_WaitPlayerUseCard;
                if (p.eventCard == eventCard) {
                    p.targetPlayer = effectPlayer;
                    return;
                }
            }
        }
    }

    public static judgeLiJian(card: Card) {
        if (card instanceof ShiTan || card instanceof SuoDing || card instanceof ZhuanYi || card instanceof WeiXianQingBao || card instanceof GongKaiWenBen) {
            CardManager.judgeCardEvent(card.belong?.room!, card, [CARD_LI_JIAN]);
        }
    }
}