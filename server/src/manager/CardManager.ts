import {
    CARD_PO_YI,
    COLOR_BLUE,
    COLOR_DOUBLE,
    COLOR_GREY,
    COLOR_RED,
    DIRECTION_ALL,
    DIRECTION_RIGHT,
    OPERATION_MI_DIAN,
    OPERATION_REN_YI,
    OPERATION_WEN_BEN,
    OPERATION_ZHI_DA
} from "../util/Constant";

import {shuffleArray} from "../util/MathUtil";
import {Card} from "../model/Card";
import {Room} from "../model/Room";
import {Player} from "../model/Player";
import {_0_WaitPlayerUseCard} from "../fight/cardEvent/_0_WaitPlayerUseCard";
import {_5_IntelligenceCircle} from "../fight/normalEvent/_0_base/_5_IntelligenceCircle";
import {PoYi} from "../fight/card/PoYi";
import {None} from "../fight/card/None";

export class CardManager {
    private static readonly ALL_CARD_LIST: Card[] = [
        new PoYi("py", COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new PoYi("py", COLOR_GREY, DIRECTION_ALL, OPERATION_MI_DIAN, false),
        new PoYi("py", COLOR_BLUE, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new PoYi("py", COLOR_BLUE, DIRECTION_ALL, OPERATION_MI_DIAN, false),
        new PoYi("py", COLOR_RED, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new PoYi("py", COLOR_RED, DIRECTION_ALL, OPERATION_MI_DIAN, false),

        new None("lj", COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new None("lj", COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new None("lj", COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new None("lj", COLOR_BLUE, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new None("lj", COLOR_RED, DIRECTION_ALL, OPERATION_ZHI_DA, false),

        new None("mmxd", COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new None("mmxd", COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new None("mmxd", COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new None("mmxd", COLOR_BLUE, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new None("mmxd", COLOR_BLUE, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new None("mmxd", COLOR_BLUE, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new None("mmxd", COLOR_RED, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new None("mmxd", COLOR_RED, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new None("mmxd", COLOR_RED, DIRECTION_ALL, OPERATION_ZHI_DA, false),

        new None("sp", COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new None("sp", COLOR_GREY, DIRECTION_ALL, OPERATION_MI_DIAN, false),
        new None("sp", COLOR_BLUE, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new None("sp", COLOR_BLUE, DIRECTION_ALL, OPERATION_MI_DIAN, false),
        new None("sp", COLOR_RED, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new None("sp", COLOR_RED, DIRECTION_ALL, OPERATION_MI_DIAN, false),

        new None("db", COLOR_GREY, DIRECTION_RIGHT, OPERATION_WEN_BEN, true),
        new None("db", COLOR_BLUE, DIRECTION_ALL, OPERATION_WEN_BEN, true),
        new None("db", COLOR_BLUE, DIRECTION_ALL, OPERATION_WEN_BEN, true),
        new None("db", COLOR_RED, DIRECTION_ALL, OPERATION_WEN_BEN, true),
        new None("db", COLOR_RED, DIRECTION_ALL, OPERATION_WEN_BEN, true),

        new None("jh", COLOR_GREY, DIRECTION_ALL, OPERATION_MI_DIAN, false),
        new None("jh", COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new None("jh", COLOR_BLUE, DIRECTION_ALL, OPERATION_MI_DIAN, false),
        new None("jh", COLOR_BLUE, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new None("jh", COLOR_RED, DIRECTION_ALL, OPERATION_MI_DIAN, false),
        new None("jh", COLOR_RED, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),

        new None("dhls", COLOR_GREY, DIRECTION_ALL, OPERATION_MI_DIAN, false),
        new None("dhls", COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new None("dhls", COLOR_BLUE, DIRECTION_ALL, OPERATION_MI_DIAN, false),
        new None("dhls", COLOR_BLUE, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new None("dhls", COLOR_RED, DIRECTION_ALL, OPERATION_MI_DIAN, false),
        new None("dhls", COLOR_RED, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),

        new None("gkwb", COLOR_GREY, DIRECTION_ALL, OPERATION_WEN_BEN, false),
        new None("gkwb", COLOR_GREY, DIRECTION_ALL, OPERATION_WEN_BEN, false),
        new None("gkwb", COLOR_GREY, DIRECTION_ALL, OPERATION_WEN_BEN, false),
        new None("gkwb", COLOR_BLUE, DIRECTION_RIGHT, OPERATION_WEN_BEN, true),
        new None("gkwb", COLOR_RED, DIRECTION_RIGHT, OPERATION_WEN_BEN, true),

        new None("sh", COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new None("sh", COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new None("sh", COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new None("sh", COLOR_BLUE, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new None("sh", COLOR_RED, DIRECTION_ALL, OPERATION_ZHI_DA, false),

        new None("zhuanyi", COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new None("zhuanyi", COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new None("zhuanyi", COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new None("zhuanyi", COLOR_BLUE, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new None("zhuanyi", COLOR_RED, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),

        new None("jmwj", COLOR_DOUBLE, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new None("jmwj", COLOR_DOUBLE, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new None("jmwj", COLOR_DOUBLE, DIRECTION_ALL, OPERATION_ZHI_DA, false),

        new None("sd", COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new None("sd", COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new None("sd", COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, true),
        new None("sd", COLOR_BLUE, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new None("sd", COLOR_BLUE, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new None("sd", COLOR_BLUE, DIRECTION_ALL, OPERATION_ZHI_DA, true),
        new None("sd", COLOR_RED, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new None("sd", COLOR_RED, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new None("sd", COLOR_RED, DIRECTION_ALL, OPERATION_ZHI_DA, true),

        new None("wxqb", COLOR_GREY, DIRECTION_RIGHT, OPERATION_REN_YI, true),
        new None("wxqb", COLOR_GREY, DIRECTION_RIGHT, OPERATION_REN_YI, true),
        new None("wxqb", COLOR_GREY, DIRECTION_ALL, OPERATION_REN_YI, true),
        new None("wxqb", COLOR_GREY, DIRECTION_ALL, OPERATION_REN_YI, true),
        new None("wxqb", COLOR_GREY, DIRECTION_ALL, OPERATION_REN_YI, true),

        new None("zengyuan", COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new None("zengyuan", COLOR_BLUE, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new None("zengyuan", COLOR_RED, DIRECTION_ALL, OPERATION_ZHI_DA, false),

        new None("st", COLOR_GREY, DIRECTION_ALL, OPERATION_MI_DIAN, false),
        new None("st", COLOR_GREY, DIRECTION_ALL, OPERATION_MI_DIAN, false),
        new None("st", COLOR_GREY, DIRECTION_ALL, OPERATION_MI_DIAN, false),
        new None("st", COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new None("st", COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new None("st", COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new None("st", COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new None("st", COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new None("st", COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
    ];

    public static initAllCard() {
        console.info("卡牌初始化成功，数量：", this.ALL_CARD_LIST.length);
    }

    public static getNewPlayerCard(index: number): Card {
        return this.ALL_CARD_LIST[index];
    }

    public static getInitCardIndex(): number[] {
        let array = [];
        const length = this.ALL_CARD_LIST.length;
        for (let i = 0; i < length; i++) array.push(i);
        shuffleArray(array);
        return array;
    }

    public static readonly _5_1_WaitingPlayerReceive_before_card_array: string[] = [CARD_PO_YI];

    public static judgeCardEvent(room: Room, event: _5_IntelligenceCircle, eventCard: Card, cardEventArray: string[]) {
        let waitPlayers: Player[] | undefined;
        let waitCardId: string | undefined;

        for (let judgeCardId of cardEventArray) {
            for (let player of room.playerArray) {
                if (player.ai || !player.live) {
                    continue;
                }
                for (let handCard of player.handCardArray) {
                    if (handCard.cardId != judgeCardId || !handCard.canUse(eventCard)) {
                        continue;
                    }
                    if (!waitPlayers) {
                        waitPlayers = [];
                        waitCardId = handCard.cardId;
                    }
                    waitPlayers.push(player);
                    break;
                }
            }

            if (waitPlayers != undefined) {
                room.eventStack.push(new _0_WaitPlayerUseCard(event, waitPlayers, eventCard, waitCardId!, cardEventArray));
                return;
            }
        }
    }
}