import {
    CAMP_BLUE,
    CAMP_GREY,
    CAMP_RED,
    CARD_DIAO_BAO,
    CARD_DIAO_HU_LI_SHAN,
    CARD_JIE_HUO,
    CARD_LI_JIAN,
    CARD_MI_MI_XIA_DA,
    CARD_PO_YI,
    CARD_SHAO_HUI,
    CARD_SHI_PO,
    CARD_SUO_DING,
    CARD_ZHUAN_YI,
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
import {Card} from "../model/Card";
import {Room} from "../model/Room";
import {Player} from "../model/Player";
import {_0_WaitPlayerUseCard} from "../fight/cardEvent/_0_WaitPlayerUseCard";
import {PoYi} from "../fight/card/PoYi";
import {ShiTan2} from "../fight/card/ShiTan2";
import {shuffleArray} from "../util/MathUtil";
import {ShiPo} from "../fight/card/ShiPo";
import {ShiTan3} from "../fight/card/ShiTan3";
import {JiMiWenJian} from "../fight/card/JiMiWenJian";
import {ZengYuan} from "../fight/card/ZengYuan";
import {ShaoHui} from "../fight/card/ShaoHui";
import {WeiXianQingBao} from "../fight/card/WeiXianQingBao";
import {GongKaiWenBen} from "../fight/card/GongKaiWenBen";
import {MiMiXiaDa} from "../fight/card/MiMiXiaDa";
import {JieHuo} from "../fight/card/JieHuo";
import {ZhuanYi} from "../fight/card/ZhuanYi";
import {DiaoHuLiShan} from "../fight/card/DiaoHuLiShan";
import {DiaoBao} from "../fight/card/DiaoBao";
import {SuoDing} from "../fight/card/SuoDing";
import {LiJian} from "../fight/card/LiJian";
import {EventManager} from "./EventManager";
import {_0_GameStartEvent} from "../fight/normalEvent/_0_base/_0_GameStartEvent";

export class CardManager {
    private static readonly ALL_CARD_LIST: Card[] = [
        new PoYi(COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new PoYi(COLOR_GREY, DIRECTION_ALL, OPERATION_MI_DIAN, false),
        new PoYi(COLOR_BLUE, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new PoYi(COLOR_BLUE, DIRECTION_ALL, OPERATION_MI_DIAN, false),
        new PoYi(COLOR_RED, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new PoYi(COLOR_RED, DIRECTION_ALL, OPERATION_MI_DIAN, false),

        new LiJian(COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new LiJian(COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new LiJian(COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new LiJian(COLOR_BLUE, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new LiJian(COLOR_RED, DIRECTION_ALL, OPERATION_ZHI_DA, false),

        new MiMiXiaDa(COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new MiMiXiaDa(COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new MiMiXiaDa(COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new MiMiXiaDa(COLOR_BLUE, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new MiMiXiaDa(COLOR_BLUE, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new MiMiXiaDa(COLOR_BLUE, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new MiMiXiaDa(COLOR_RED, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new MiMiXiaDa(COLOR_RED, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new MiMiXiaDa(COLOR_RED, DIRECTION_ALL, OPERATION_ZHI_DA, false),

        new ShiPo(COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new ShiPo(COLOR_GREY, DIRECTION_ALL, OPERATION_MI_DIAN, false),
        new ShiPo(COLOR_BLUE, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new ShiPo(COLOR_BLUE, DIRECTION_ALL, OPERATION_MI_DIAN, false),
        new ShiPo(COLOR_RED, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new ShiPo(COLOR_RED, DIRECTION_ALL, OPERATION_MI_DIAN, false),

        new DiaoBao(COLOR_GREY, DIRECTION_RIGHT, OPERATION_WEN_BEN, true),
        new DiaoBao(COLOR_BLUE, DIRECTION_ALL, OPERATION_WEN_BEN, true),
        new DiaoBao(COLOR_BLUE, DIRECTION_ALL, OPERATION_WEN_BEN, true),
        new DiaoBao(COLOR_RED, DIRECTION_ALL, OPERATION_WEN_BEN, true),
        new DiaoBao(COLOR_RED, DIRECTION_ALL, OPERATION_WEN_BEN, true),

        new JieHuo(COLOR_GREY, DIRECTION_ALL, OPERATION_MI_DIAN, false),
        new JieHuo(COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new JieHuo(COLOR_BLUE, DIRECTION_ALL, OPERATION_MI_DIAN, false),
        new JieHuo(COLOR_BLUE, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new JieHuo(COLOR_RED, DIRECTION_ALL, OPERATION_MI_DIAN, false),
        new JieHuo(COLOR_RED, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),

        new DiaoHuLiShan(COLOR_GREY, DIRECTION_ALL, OPERATION_MI_DIAN, false),
        new DiaoHuLiShan(COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new DiaoHuLiShan(COLOR_BLUE, DIRECTION_ALL, OPERATION_MI_DIAN, false),
        new DiaoHuLiShan(COLOR_BLUE, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new DiaoHuLiShan(COLOR_RED, DIRECTION_ALL, OPERATION_MI_DIAN, false),
        new DiaoHuLiShan(COLOR_RED, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),

        new GongKaiWenBen(COLOR_GREY, DIRECTION_ALL, OPERATION_WEN_BEN, false, CAMP_RED, 2, 1, "1"),
        new GongKaiWenBen(COLOR_GREY, DIRECTION_ALL, OPERATION_WEN_BEN, false, CAMP_BLUE, 2, 1, "2"),
        new GongKaiWenBen(COLOR_GREY, DIRECTION_ALL, OPERATION_WEN_BEN, false, CAMP_GREY, 2, 1, "3"),
        new GongKaiWenBen(COLOR_BLUE, DIRECTION_RIGHT, OPERATION_WEN_BEN, true, CAMP_RED, -1, 1, "4"),
        new GongKaiWenBen(COLOR_RED, DIRECTION_RIGHT, OPERATION_WEN_BEN, true, CAMP_BLUE, -1, 1, "5"),

        new ShaoHui(COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new ShaoHui(COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new ShaoHui(COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new ShaoHui(COLOR_BLUE, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new ShaoHui(COLOR_RED, DIRECTION_ALL, OPERATION_ZHI_DA, false),

        new ZhuanYi(COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new ZhuanYi(COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new ZhuanYi(COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new ZhuanYi(COLOR_BLUE, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new ZhuanYi(COLOR_RED, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),

        new JiMiWenJian(COLOR_DOUBLE, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new JiMiWenJian(COLOR_DOUBLE, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new JiMiWenJian(COLOR_DOUBLE, DIRECTION_ALL, OPERATION_ZHI_DA, false),

        new SuoDing(COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new SuoDing(COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new SuoDing(COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, true),
        new SuoDing(COLOR_BLUE, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new SuoDing(COLOR_BLUE, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new SuoDing(COLOR_BLUE, DIRECTION_ALL, OPERATION_ZHI_DA, true),
        new SuoDing(COLOR_RED, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new SuoDing(COLOR_RED, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new SuoDing(COLOR_RED, DIRECTION_ALL, OPERATION_ZHI_DA, true),

        new WeiXianQingBao(COLOR_GREY, DIRECTION_RIGHT, OPERATION_REN_YI, true),
        new WeiXianQingBao(COLOR_GREY, DIRECTION_RIGHT, OPERATION_REN_YI, true),
        new WeiXianQingBao(COLOR_GREY, DIRECTION_ALL, OPERATION_REN_YI, true),
        new WeiXianQingBao(COLOR_GREY, DIRECTION_ALL, OPERATION_REN_YI, true),
        new WeiXianQingBao(COLOR_GREY, DIRECTION_ALL, OPERATION_REN_YI, true),

        new ZengYuan(COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new ZengYuan(COLOR_BLUE, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new ZengYuan(COLOR_RED, DIRECTION_ALL, OPERATION_ZHI_DA, false),

        new ShiTan2(COLOR_GREY, DIRECTION_ALL, OPERATION_MI_DIAN, false, CAMP_RED),
        new ShiTan2(COLOR_GREY, DIRECTION_ALL, OPERATION_MI_DIAN, false, CAMP_BLUE),
        new ShiTan2(COLOR_GREY, DIRECTION_ALL, OPERATION_MI_DIAN, false, CAMP_GREY),
        new ShiTan2(COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false, CAMP_RED),
        new ShiTan2(COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false, CAMP_BLUE),
        new ShiTan2(COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false, CAMP_GREY),
        new ShiTan3(COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new ShiTan3(COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new ShiTan3(COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
    ];

    public static initAllCard() {
        for (let card of this.ALL_CARD_LIST) {
            if (card instanceof GongKaiWenBen) {
                (card as GongKaiWenBen).initData();
            }
        }
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

    public static LI_JIAN_EVENT = [CARD_LI_JIAN];
    public static SHI_PO_EVENT = [CARD_SHI_PO];
    public static MI_MI_XIA_DA_EVENT = [CARD_MI_MI_XIA_DA];

    public static IN_ROUNDING_RECEIVE_BEFORE = [CARD_PO_YI, CARD_DIAO_BAO, CARD_SUO_DING, CARD_ZHUAN_YI];
    public static RECEIVE_BEFORE = [CARD_PO_YI, CARD_SUO_DING, CARD_ZHUAN_YI];
    public static RECEIVE_AFTER = [CARD_JIE_HUO, CARD_DIAO_HU_LI_SHAN];
    public static WILL_DIE = [CARD_SHAO_HUI];

    public static judgeCardEvent(room: Room, eventCard: Card | undefined, cardEventArray: string[], startIndex: number = 0, toPlayer: Player | undefined = undefined): boolean {
        const gameStartEvent = EventManager.getEvent(room, _0_GameStartEvent.name) as _0_GameStartEvent;
        if (gameStartEvent.skipCardEventArray == cardEventArray) {
            gameStartEvent.skipCardEventArray = undefined;
            return false;
        }

        let waitPlayers: Player[] | undefined;
        let waitCardId: string | undefined;

        for (; startIndex < cardEventArray.length; startIndex++) {
            let judgeCardId = cardEventArray[startIndex];
            for (let player of room.playerArray) {
                if (player.ai || !player.live) {
                    continue;
                }
                for (let handCard of player.handCardArray) {
                    if (handCard.cardId != judgeCardId || !handCard.canUse(eventCard, toPlayer)) {
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
                room.eventStack.push(new _0_WaitPlayerUseCard(waitPlayers, eventCard, waitCardId!, toPlayer, cardEventArray, startIndex));
                return true;
            }
        }
        return false;
    }
}