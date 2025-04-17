import {ServerClientRoutes} from "./ServerClientRoutes";
import {Player} from "../model/Player";
import {_4_SendIntelligence} from "../fight/normalEvent/_0_base/_4_SendIntelligence";
import {_3_PlayerRounding} from "../fight/normalEvent/_0_base/_3_PlayerRounding";
import {_6_PlayerRoundEnd} from "../fight/normalEvent/_0_base/_6_PlayerRoundEnd";
import {Card} from "../model/Card";
import {_5_1_WaitingPlayerReceive} from "../fight/normalEvent/_5_IntelligenceCircle/_5_1_WaitingPlayerReceive";
import {CARD_OPERATION} from "../util/Constant";

export class GameRoutes extends ServerClientRoutes {

    // {"route":"game/sendIntelligence","data":{"cardArray":[{"cardId":"10","opz":""}],"playerAccountArray":["robot-2"]}}
    async sendIntelligence(player: Player, data: any) {
        const cardClientInfo = data.cardArray[0];
        let cardModel = player.findHandCardById(cardClientInfo.cardId);
        if (!cardModel) {
            player.sendTips("请重新选择情报");
            return;
        }

        if (cardModel.operation === CARD_OPERATION.REN_YI) {
            const clientOperation = cardClientInfo.opz;
            if (!clientOperation || (clientOperation != CARD_OPERATION.ZHI_DA && clientOperation != CARD_OPERATION.MI_DIAN && clientOperation != CARD_OPERATION.WEN_BEN)) {
                player.sendTips("请点击卡牌右上角选择传递方式");
                return;
            }
            cardModel.clientOperation = clientOperation;
        } else {
            cardModel.clientOperation = undefined;
        }

        const targetPlayer = player.room!.findPlayerByAccount(data.playerAccountArray[0]);
        if (!targetPlayer) {
            player.sendTips("请重新选择玩家");
            return;
        }

        const peek = player.room?.eventStack!.peek();
        if (!(peek instanceof _4_SendIntelligence)) {
            player.sendTips("操作超时");
            return;
        }

        (peek as _4_SendIntelligence).setIntelligenceCard(player, cardModel, targetPlayer);
    }

    async end3to_4_SendIntelligence(player: Player) {
        const peek = player.room?.eventStack!.peek();
        if (!(peek instanceof _3_PlayerRounding)) {
            player.sendTips("操作超时");
            return;
        }

        (peek as _3_PlayerRounding).end3to_4_SendIntelligence(player);
    }

    async disCard(player: Player, data: any) {
        const peek = player.room?.eventStack!.peek();
        if (!(peek instanceof _6_PlayerRoundEnd)) {
            player.sendTips("操作超时");
            return;
        }

        let disCardArray: Card[] = [];
        for (let card of data.cardArray) {
            const cardModel = player.findHandCardById(card.cardId);
            if (cardModel) {
                disCardArray.push(cardModel);
            }
        }
        (peek as _6_PlayerRoundEnd).setDeleteCardArray(disCardArray);
    }

    async receiveIntelligence(player: Player) {
        this.operationWaitingPlayerReceive(player, true);
    }

    async refuseIntelligence(player: Player) {
        this.operationWaitingPlayerReceive(player, false);
    }

    operationWaitingPlayerReceive(player: Player, receive: boolean) {
        const peek = player.room?.eventStack!.peek();
        if (!(peek instanceof _5_1_WaitingPlayerReceive)) {
            player.sendTips("操作超时");
            return;
        }
        (peek as _5_1_WaitingPlayerReceive).setIsReceive(player, receive);
    }

}