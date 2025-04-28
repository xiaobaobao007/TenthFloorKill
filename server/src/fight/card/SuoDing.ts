import {Card} from "../../model/Card";
import {EventManager} from "../../manager/EventManager";
import {Player} from "../../model/Player";
import {SaveCard} from "./SaveCard";
import {_0_GameStartEvent} from "../normalEvent/_0_base/_0_GameStartEvent";

/**
 * 锁定：自己回合中，他人情报接受前指定其接收传至面前的情报
 */
export class SuoDing extends SaveCard {
    constructor(cardId: string, color: string, direction: string, operation: string, lock: boolean) {
        super(cardId, color, direction, operation, lock);
    }

    public canUse(toCard: Card | undefined, toPlayer: Player | undefined): boolean {
        return this._belong?.room!.getInRoundPlayer() == this._belong;
    }

    public static beSuoDing(player: Player): boolean {
        for (let event of (EventManager.getEvent(player.room!, _0_GameStartEvent.name) as _0_GameStartEvent).roundEvent.getItems()) {
            if (event.canEffect && event.playerCard instanceof SuoDing) {
                if (event.getEffectPlayer() == player) {
                    return true;
                }
            }
        }
        return false;
    }
}