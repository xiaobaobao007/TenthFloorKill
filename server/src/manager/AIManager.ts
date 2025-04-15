import {_4_SendIntelligence} from "../fight/normalEvent/_0_base/_4_SendIntelligence";
import {Player} from "../model/Player";
import {random} from "../util/MathUtil";
import {Card} from "../model/Card";

export class AIManager {
    public static _4_SendIntelligence(player: Player, event: _4_SendIntelligence): void {
        const room = player.room!;

        let playerCard: Card;
        if (player.handCardArray.length == 0) {
            playerCard = room.getNewPlayerCard(1)[0];
        } else {
            playerCard = player.handCardArray[random(player.handCardArray.length)];
        }

        let allPlayerArray = room.playerArray;
        let randomIndex = random(allPlayerArray.length - 1);
        if (allPlayerArray.indexOf(player) <= randomIndex) {
            randomIndex++;
        }

        event.setIntelligenceCard(player, playerCard, allPlayerArray[randomIndex])
    }
}