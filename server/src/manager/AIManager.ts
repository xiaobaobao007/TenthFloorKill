import {_4_SendIntelligence} from "../fight/normalEvent/_0_base/_4_SendIntelligence";
import {Player} from "../model/Player";
import {random} from "../util/MathUtil";
import {Card} from "../model/Card";
import {_6_PlayerRoundEnd} from "../fight/normalEvent/_0_base/_6_PlayerRoundEnd";
import {GAME_CONFIG} from "../util/Constant";

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

        if (playerCard.operation == "ope_") {
            playerCard.clientOperation = "ope_m";
        }

        event.setIntelligenceCard(player, playerCard, allPlayerArray[randomIndex]);
    }

    public static _6_PlayerRoundEnd(player: Player, event: _6_PlayerRoundEnd): void {
        const handCardArray = player.handCardArray;
        const discardNumber = handCardArray.length - GAME_CONFIG.MAX_CARD;
        let discardCardArray: Card[] = [];
        for (let i = 0; i < discardNumber; i++) {
            discardCardArray.push(handCardArray[i]);
        }
        event.setDeleteCardArray(discardCardArray);
    }
}