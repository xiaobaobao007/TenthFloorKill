import {Card} from "../../model/Card";
import {ROUTER} from "../../util/SocketUtil";
import {SaveCard} from "./base/SaveCard";

/**
 * 破译：检视一张未反开的情报
 */
export class PoYi extends SaveCard {
    constructor(cardId: string, color: string, direction: string, operation: string, lock: boolean) {
        super(cardId, color, direction, operation, lock);
    }

    public canUse(toCard: Card | undefined): boolean {
        return toCard != undefined && !toCard.isShow();
    }

    sendClientInfo(eventCard: Card) {
        this.doEvent(eventCard);
    }

    doEvent(eventCard: Card) {
        this.belong!.send(ROUTER.roomEvent.UPDATE_ALL_INTELLIGENCE, eventCard.getSelfCardInfo())
    }
}