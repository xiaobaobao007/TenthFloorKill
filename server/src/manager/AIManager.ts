import {_4_SendIntelligence} from "../fight/normalEvent/_0_base/_4_SendIntelligence";
import {Player} from "../model/Player";
import {random} from "../util/MathUtil";
import {Card} from "../model/Card";
import {OPERATION_MI_DIAN, OPERATION_REN_YI} from "../util/Constant";
import {GameError} from "../exception/GameError";
import {_7_DiscardEvent} from "../fight/normalEvent/_0_base/_7_DiscardEvent";
import {MiMiXiaDa} from "../fight/card/MiMiXiaDa";

export class AIManager {
    public static _4_SendIntelligence(player: Player, event: _4_SendIntelligence): void {
        const room = player.room!;

        let playerCard: Card | undefined;
        let miMiXiaDaColor = MiMiXiaDa.getMiMiXiaDaColor(player.room!);
        if (miMiXiaDaColor) {
            for (let card of player.handCardArray) {
                if (card.isSameColor(miMiXiaDaColor)) {
                    playerCard = card;
                    break;
                }
            }
        }

        if (!playerCard) {
            playerCard = player.handCardArray[random(player.handCardArray.length)];
        }

        let allPlayerArray = room.playerArray;
        let nextIndex = allPlayerArray.indexOf(player);

        for (let i = allPlayerArray.length - 2; i >= 0; i--) {
            if (++nextIndex >= allPlayerArray.length) {
                nextIndex = 0;
            }

            if (allPlayerArray[nextIndex].live) {
                if (playerCard.operation == OPERATION_REN_YI) {
                    playerCard.clientOperation = OPERATION_MI_DIAN;
                }

                event.setIntelligenceCard(player, playerCard, allPlayerArray[nextIndex]);
                return;
            }
        }

        throw new GameError("ai找不到需要发情报的人");
    }

    public static _7_DiscardEvent(player: Player, event: _7_DiscardEvent): void {
        const handCardArray = player.handCardArray;
        let discardCardArray: Card[] = [];
        for (let i = 0; i < event.discardNum; i++) {
            discardCardArray.push(handCardArray[i]);
        }
        event.setDeleteCardArray(discardCardArray);
    }
}