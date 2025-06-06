import {ServerClientRoutes} from "./ServerClientRoutes";
import {Player} from "../model/Player";
import {_4_SendIntelligence} from "../fight/normalEvent/_0_base/_4_SendIntelligence";
import {_3_PlayerRounding} from "../fight/normalEvent/_0_base/_3_PlayerRounding";
import {Card} from "../model/Card";
import {_5_1_WaitingPlayerReceive} from "../fight/normalEvent/_5_IntelligenceCircle/_5_1_WaitingPlayerReceive";
import {OPERATION_MI_DIAN, OPERATION_REN_YI, OPERATION_WEN_BEN, OPERATION_ZHI_DA, ROUND_USE_CARD, USE_CARD_NEED_CHOOSE_PEOPLE} from "../util/Constant";
import {_0_WaitPlayerUseCard} from "../fight/cardEvent/_0_WaitPlayerUseCard";
import {_7_DiscardEvent} from "../fight/normalEvent/_0_base/_7_DiscardEvent";
import {_0_WaitPlayerChooseButton} from "../fight/cardEvent/_0_WaitPlayerChooseButton";
import {_0_WaitPlayerChooseOneCard} from "../fight/cardEvent/_0_WaitPlayerChooseOneCard";
import {ZhuanYi} from "../fight/card/ZhuanYi";
import {SuoDing} from "../fight/card/SuoDing";
import {EventManager} from "../manager/EventManager";
import {LiJian} from "../fight/card/LiJian";
import {DiaoBao} from "../fight/card/DiaoBao";
import {DiaoHuLiShan} from "../fight/card/DiaoHuLiShan";
import {JieHuo} from "../fight/card/JieHuo";
import {MiMiXiaDa} from "../fight/card/MiMiXiaDa";
import {_5_IntelligenceCircle} from "../fight/normalEvent/_0_base/_5_IntelligenceCircle";

export class GameRoutes extends ServerClientRoutes {

    // {"route":"game/sendIntelligence","data":{"cards":[{"cardId":"10","opz":""}],"accounts":["robot-2"]}}
    async roundUseCard(player: Player, data: any) {
        if (!data || !data.cards || !data.cards[0]) {
            return;
        }

        const cardClientInfo = data.cards[0];
        let cardModel = player.findHandCardById(cardClientInfo.cardId);
        if (!cardModel || !ROUND_USE_CARD.includes(cardModel.cardId)) {
            player.sendTips("请重新选择手牌使用");
            return;
        }

        let targetPlayer: Player | undefined;

        if (USE_CARD_NEED_CHOOSE_PEOPLE.includes(cardModel.cardId)) {
            if (!data.accounts || data.accounts[0].length === 0) {
                return;
            }

            targetPlayer = player.room!.findPlayerByAccount(data.accounts[0]);
            if (!targetPlayer || !targetPlayer.live) {
                player.sendTips("请重新选择玩家");
                return;
            }
        } else {
            targetPlayer = player;
        }

        const eventStack = player.room?.eventStack!;
        if (!(eventStack.peek() instanceof _3_PlayerRounding)) {
            player.sendTips("操作超时");
            return;
        }

        const useEvent = new _0_WaitPlayerUseCard([player], cardModel, cardModel.cardId);
        useEvent.use(player, cardModel, targetPlayer, true);
    }

    // {"route":"game/sendIntelligence","data":{"cards":[{"cardId":"10","opz":""}],"accounts":["robot-2"]}}
    async sendIntelligence(player: Player, data: any) {
        if (!data || !data.cards || !data.cards[0]) {
            return;
        }

        const cardClientInfo = data.cards[0];
        if (!cardClientInfo || !cardClientInfo.cardId) {
            player.sendTips("请重新选择情报");
            return;
        }

        let cardModel = player.findHandCardById(cardClientInfo.cardId);
        if (!cardModel) {
            player.sendTips("请重新选择情报");
            return;
        }

        if (cardModel.operation === OPERATION_REN_YI) {
            const clientOperation = data.selectValue;
            if (!clientOperation || (clientOperation != OPERATION_ZHI_DA && clientOperation != OPERATION_MI_DIAN && clientOperation != OPERATION_WEN_BEN)) {
                player.sendTips("请点击卡牌右上角选择传递方式");
                return;
            }
            cardModel.clientOperation = clientOperation;
        } else {
            cardModel.clientOperation = undefined;
        }

        if (!data.accounts || data.accounts[0].length === 0) {
            return;
        }

        const targetPlayer = player.room!.findPlayerByAccount(data.accounts[0]);
        if (!targetPlayer || !targetPlayer.live) {
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
        if (!data || !data.cards) {
            return;
        }

        const peek = player.room?.eventStack!.peek();
        if (!(peek instanceof _7_DiscardEvent)) {
            player.sendTips("操作超时");
            return;
        }

        let disCardArray: Card[] = [];
        for (let card of data.cards) {
            const cardModel = player.findHandCardById(card.cardId);
            if (cardModel) {
                disCardArray.push(cardModel);
            }
        }

        (peek as _7_DiscardEvent).setDeleteCardArray(disCardArray);
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

    async useCard(player: Player, data: any) {
        if (!data || !data.cards || !data.cards[0]) {
            return;
        }

        const cardClientInfo = data.cards[0];
        let cardModel = player.findHandCardById(cardClientInfo.cardId);
        if (!cardModel) {
            player.sendTips("请重新选择手牌");
            return;
        }

        const room = player.room!;
        const peek = room.eventStack!.peek();
        if (!(peek instanceof _0_WaitPlayerUseCard)) {
            player.sendTips("操作超时");
            return;
        }

        const waitPlayerUseCard = peek as _0_WaitPlayerUseCard;
        if (waitPlayerUseCard.cardId != cardModel.cardId) {
            player.sendTips("请选择1张【" + waitPlayerUseCard.cardName + "】卡牌使用");
            return;
        }

        let targetPlayer: Player | undefined = player;

        if (cardModel instanceof SuoDing) {
            targetPlayer = (EventManager.getEvent(room, _5_1_WaitingPlayerReceive.name) as _5_1_WaitingPlayerReceive).getCurrentPlayer();
        } else if (cardModel instanceof ZhuanYi || cardModel instanceof LiJian) {
            if (!data.accounts || data.accounts[0].length === 0) {
                player.sendTips("请重新选择玩家");
                return;
            }

            targetPlayer = player.room!.findPlayerByAccount(data.accounts[0]);
            if (!targetPlayer || !targetPlayer.live) {
                player.sendTips("请重新选择玩家");
                return;
            }
        } else if (cardModel instanceof DiaoBao || cardModel instanceof MiMiXiaDa) {
            //回合玩家
            targetPlayer = room.getInRoundPlayer()!;
        } else if (cardModel instanceof DiaoHuLiShan || cardModel instanceof JieHuo) {
            //情报玩家
            let event = EventManager.getEvent(room, _5_IntelligenceCircle.name)! as _5_IntelligenceCircle;
            targetPlayer = event.getCurrentPlayer()!;
        }

        let event = waitPlayerUseCard.use(player, cardModel, targetPlayer);
        if (event) {
            event.param = data.selectValue;
        }
    }

    async skipUseCard(player: Player) {
        const peek = player.room?.eventStack!.peek();
        if (!(peek instanceof _0_WaitPlayerUseCard)) {
            player.sendTips("操作超时");
            return;
        }
        (peek as _0_WaitPlayerUseCard).skip(player);
    }

    async choose_button_0(player: Player) {
        await this.chooseButton(player, "0");
    }

    async choose_button_1(player: Player) {
        await this.chooseButton(player, "1");
    }

    async choose_button_2(player: Player) {
        await this.chooseButton(player, "2");
    }

    async choose_button_fail(player: Player) {
        await this.chooseButton(player, "fail");
    }

    async chooseButton(player: Player, chooseIndex: string) {
        const peek = player.room?.eventStack!.peek();
        if (!(peek instanceof _0_WaitPlayerChooseButton)) {
            player.sendTips("操作超时");
            return;
        }
        (peek as _0_WaitPlayerChooseButton).chooseButton(player, chooseIndex);
    }

    async clickChooseOtherCardButton(player: Player, data: any) {
        const eventStack = player.room?.eventStack!;
        if (!(eventStack.peek() instanceof _0_WaitPlayerChooseOneCard)) {
            player.sendTips("操作超时");
            return;
        }

        const fatherEvent = eventStack.peek() as _0_WaitPlayerChooseOneCard;

        let cardId: string | undefined = undefined;
        if (fatherEvent.chooseHandCard != undefined) {
            if (!data || !data.cards || !data.cards[0]) {
                return;
            }
            const cardClientInfo = data.cards[0];
            if (!cardClientInfo) {
                player.sendTips("请重新选择");
                return;
            }
            cardId = cardClientInfo.cardId;
        }

        if (fatherEvent.clickChooseOtherCardButton(player, cardId)) {
            return;
        }

        fatherEvent.sendClientInfo(player.room!, player);
    }
}