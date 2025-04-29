import {Card} from "../../model/Card";
import {_5_IntelligenceCircle} from "../normalEvent/_0_base/_5_IntelligenceCircle";
import {EventManager} from "../../manager/EventManager";
import {_5_1_WaitingPlayerReceive} from "../normalEvent/_5_IntelligenceCircle/_5_1_WaitingPlayerReceive";
import {CARD_JIE_HUO} from "../../util/Constant";

/**
 * 截获：自己回合外他人情报接收时，将情报传至自己
 */
export class JieHuo extends Card {
    constructor(color: string, direction: string, operation: string, lock: boolean) {
        super(CARD_JIE_HUO, color, direction, operation, lock);
    }

    public canUse(toCard: Card | undefined): boolean {
        if (this._belong?.inRounding) {
            return false;
        }

        let event = EventManager.getEvent(this._belong?.room!, _5_IntelligenceCircle.name);
        return event != undefined && !(event as _5_IntelligenceCircle).isCurrentPlayer(this._belong!);
    }

    doEvent(eventCard: Card) {
        const room = this._belong!.room!;
        {
            let event = EventManager.getEvent(room, _5_IntelligenceCircle.name)!;
            (event as _5_IntelligenceCircle).resetPlayer(this._belong!);
        }

        {
            let event = EventManager.getEvent(room, _5_1_WaitingPlayerReceive.name)!;
            room.eventStack.remove(event);
        }
    }
}