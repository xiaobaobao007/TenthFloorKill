import {Card} from "../../model/Card";
import {Player} from "../../model/Player";

/**
 * 破译：检视一张未反开的情报
 */
export class PoYi extends Card {
    constructor(cardId: string, color: string, direction: string, operation: string, lock: boolean) {
        super(cardId, color, direction, operation, lock);
    }

    doEvent(player: Player, toCard: Card) {
        player.send("roomEvent/updateAllIntelligence", toCard.getSelfCardInfo())
    }
}