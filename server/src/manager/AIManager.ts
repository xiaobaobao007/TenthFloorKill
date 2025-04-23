import {_4_SendIntelligence} from "../fight/normalEvent/_0_base/_4_SendIntelligence";
import {Player} from "../model/Player";
import {random} from "../util/MathUtil";
import {Card} from "../model/Card";
import {_6_PlayerRoundEnd} from "../fight/normalEvent/_0_base/_6_PlayerRoundEnd";
import {GAME_CONFIG, OPERATION_MI_DIAN, OPERATION_REN_YI} from "../util/Constant";
import {GameError} from "../exception/GameError";

export class AIManager {
    public static _4_SendIntelligence(player: Player, event: _4_SendIntelligence): void {
        const room = player.room!;

        let playerCard = player.handCardArray[random(player.handCardArray.length)];

        let allPlayerArray = room.playerArray;
        let nextIndex = allPlayerArray.indexOf(player);

        for (let i = allPlayerArray.length - 2; i >= 0; i--) {
            if (++nextIndex >= allPlayerArray.length) {
                nextIndex = 0;
            }

            if (allPlayerArray[i].live) {
                if (playerCard.operation == OPERATION_REN_YI) {
                    playerCard.clientOperation = OPERATION_MI_DIAN;
                }

                event.setIntelligenceCard(player, playerCard, allPlayerArray[i]);
                return;
            }
        }

        throw new GameError("ai找不到需要发情报的人");
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