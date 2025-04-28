import {
    CAMP_BLUE,
    CAMP_GREY,
    CAMP_RED,
    CARD_DIAO_BAO,
    CARD_DIAO_HU_LI_SHAN,
    CARD_GONG_KAI_WEN_BEN,
    CARD_JI_MI_WEN_JIAN,
    CARD_JIE_HUO,
    CARD_LI_JIAN,
    CARD_MI_MI_XIA_DA,
    CARD_PO_YI,
    CARD_SHAO_HUI,
    CARD_SHI_PO,
    CARD_SHI_TAN,
    CARD_SUO_DING,
    CARD_WEI_XIAN_QING_BAO,
    CARD_ZENG_YUAN,
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

export class CardManager {
    private static readonly ALL_CARD_LIST: Card[] = [
        new PoYi(CARD_PO_YI, COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new PoYi(CARD_PO_YI, COLOR_GREY, DIRECTION_ALL, OPERATION_MI_DIAN, false),
        new PoYi(CARD_PO_YI, COLOR_BLUE, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new PoYi(CARD_PO_YI, COLOR_BLUE, DIRECTION_ALL, OPERATION_MI_DIAN, false),
        new PoYi(CARD_PO_YI, COLOR_RED, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new PoYi(CARD_PO_YI, COLOR_RED, DIRECTION_ALL, OPERATION_MI_DIAN, false),

        new LiJian(CARD_LI_JIAN, COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new LiJian(CARD_LI_JIAN, COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new LiJian(CARD_LI_JIAN, COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new LiJian(CARD_LI_JIAN, COLOR_BLUE, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new LiJian(CARD_LI_JIAN, COLOR_RED, DIRECTION_ALL, OPERATION_ZHI_DA, false),

        new MiMiXiaDa(CARD_MI_MI_XIA_DA, COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new MiMiXiaDa(CARD_MI_MI_XIA_DA, COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new MiMiXiaDa(CARD_MI_MI_XIA_DA, COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new MiMiXiaDa(CARD_MI_MI_XIA_DA, COLOR_BLUE, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new MiMiXiaDa(CARD_MI_MI_XIA_DA, COLOR_BLUE, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new MiMiXiaDa(CARD_MI_MI_XIA_DA, COLOR_BLUE, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new MiMiXiaDa(CARD_MI_MI_XIA_DA, COLOR_RED, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new MiMiXiaDa(CARD_MI_MI_XIA_DA, COLOR_RED, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new MiMiXiaDa(CARD_MI_MI_XIA_DA, COLOR_RED, DIRECTION_ALL, OPERATION_ZHI_DA, false),

        new ShiPo(CARD_SHI_PO, COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new ShiPo(CARD_SHI_PO, COLOR_GREY, DIRECTION_ALL, OPERATION_MI_DIAN, false),
        new ShiPo(CARD_SHI_PO, COLOR_BLUE, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new ShiPo(CARD_SHI_PO, COLOR_BLUE, DIRECTION_ALL, OPERATION_MI_DIAN, false),
        new ShiPo(CARD_SHI_PO, COLOR_RED, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new ShiPo(CARD_SHI_PO, COLOR_RED, DIRECTION_ALL, OPERATION_MI_DIAN, false),

        new DiaoBao(CARD_DIAO_BAO, COLOR_GREY, DIRECTION_RIGHT, OPERATION_WEN_BEN, true),
        new DiaoBao(CARD_DIAO_BAO, COLOR_BLUE, DIRECTION_ALL, OPERATION_WEN_BEN, true),
        new DiaoBao(CARD_DIAO_BAO, COLOR_BLUE, DIRECTION_ALL, OPERATION_WEN_BEN, true),
        new DiaoBao(CARD_DIAO_BAO, COLOR_RED, DIRECTION_ALL, OPERATION_WEN_BEN, true),
        new DiaoBao(CARD_DIAO_BAO, COLOR_RED, DIRECTION_ALL, OPERATION_WEN_BEN, true),

        new JieHuo(CARD_JIE_HUO, COLOR_GREY, DIRECTION_ALL, OPERATION_MI_DIAN, false),
        new JieHuo(CARD_JIE_HUO, COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new JieHuo(CARD_JIE_HUO, COLOR_BLUE, DIRECTION_ALL, OPERATION_MI_DIAN, false),
        new JieHuo(CARD_JIE_HUO, COLOR_BLUE, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new JieHuo(CARD_JIE_HUO, COLOR_RED, DIRECTION_ALL, OPERATION_MI_DIAN, false),
        new JieHuo(CARD_JIE_HUO, COLOR_RED, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),

        new DiaoHuLiShan(CARD_DIAO_HU_LI_SHAN, COLOR_GREY, DIRECTION_ALL, OPERATION_MI_DIAN, false),
        new DiaoHuLiShan(CARD_DIAO_HU_LI_SHAN, COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new DiaoHuLiShan(CARD_DIAO_HU_LI_SHAN, COLOR_BLUE, DIRECTION_ALL, OPERATION_MI_DIAN, false),
        new DiaoHuLiShan(CARD_DIAO_HU_LI_SHAN, COLOR_BLUE, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new DiaoHuLiShan(CARD_DIAO_HU_LI_SHAN, COLOR_RED, DIRECTION_ALL, OPERATION_MI_DIAN, false),
        new DiaoHuLiShan(CARD_DIAO_HU_LI_SHAN, COLOR_RED, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),

        new GongKaiWenBen(CARD_GONG_KAI_WEN_BEN, COLOR_GREY, DIRECTION_ALL, OPERATION_WEN_BEN, false, CAMP_RED, 2, 1, "1"),
        new GongKaiWenBen(CARD_GONG_KAI_WEN_BEN, COLOR_GREY, DIRECTION_ALL, OPERATION_WEN_BEN, false, CAMP_BLUE, 2, 1, "2"),
        new GongKaiWenBen(CARD_GONG_KAI_WEN_BEN, COLOR_GREY, DIRECTION_ALL, OPERATION_WEN_BEN, false, CAMP_GREY, 2, 1, "3"),
        new GongKaiWenBen(CARD_GONG_KAI_WEN_BEN, COLOR_BLUE, DIRECTION_RIGHT, OPERATION_WEN_BEN, true, CAMP_RED, -1, 1, "4"),
        new GongKaiWenBen(CARD_GONG_KAI_WEN_BEN, COLOR_RED, DIRECTION_RIGHT, OPERATION_WEN_BEN, true, CAMP_BLUE, -1, 1, "5"),

        new ShaoHui(CARD_SHAO_HUI, COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new ShaoHui(CARD_SHAO_HUI, COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new ShaoHui(CARD_SHAO_HUI, COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new ShaoHui(CARD_SHAO_HUI, COLOR_BLUE, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new ShaoHui(CARD_SHAO_HUI, COLOR_RED, DIRECTION_ALL, OPERATION_ZHI_DA, false),

        new ZhuanYi(CARD_ZHUAN_YI, COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new ZhuanYi(CARD_ZHUAN_YI, COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new ZhuanYi(CARD_ZHUAN_YI, COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new ZhuanYi(CARD_ZHUAN_YI, COLOR_BLUE, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new ZhuanYi(CARD_ZHUAN_YI, COLOR_RED, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),

        new JiMiWenJian(CARD_JI_MI_WEN_JIAN, COLOR_DOUBLE, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new JiMiWenJian(CARD_JI_MI_WEN_JIAN, COLOR_DOUBLE, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new JiMiWenJian(CARD_JI_MI_WEN_JIAN, COLOR_DOUBLE, DIRECTION_ALL, OPERATION_ZHI_DA, false),

        new SuoDing(CARD_SUO_DING, COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new SuoDing(CARD_SUO_DING, COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new SuoDing(CARD_SUO_DING, COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, true),
        new SuoDing(CARD_SUO_DING, COLOR_BLUE, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new SuoDing(CARD_SUO_DING, COLOR_BLUE, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new SuoDing(CARD_SUO_DING, COLOR_BLUE, DIRECTION_ALL, OPERATION_ZHI_DA, true),
        new SuoDing(CARD_SUO_DING, COLOR_RED, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new SuoDing(CARD_SUO_DING, COLOR_RED, DIRECTION_RIGHT, OPERATION_MI_DIAN, false),
        new SuoDing(CARD_SUO_DING, COLOR_RED, DIRECTION_ALL, OPERATION_ZHI_DA, true),

        new WeiXianQingBao(CARD_WEI_XIAN_QING_BAO, COLOR_GREY, DIRECTION_RIGHT, OPERATION_REN_YI, true),
        new WeiXianQingBao(CARD_WEI_XIAN_QING_BAO, COLOR_GREY, DIRECTION_RIGHT, OPERATION_REN_YI, true),
        new WeiXianQingBao(CARD_WEI_XIAN_QING_BAO, COLOR_GREY, DIRECTION_ALL, OPERATION_REN_YI, true),
        new WeiXianQingBao(CARD_WEI_XIAN_QING_BAO, COLOR_GREY, DIRECTION_ALL, OPERATION_REN_YI, true),
        new WeiXianQingBao(CARD_WEI_XIAN_QING_BAO, COLOR_GREY, DIRECTION_ALL, OPERATION_REN_YI, true),

        new ZengYuan(CARD_ZENG_YUAN, COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new ZengYuan(CARD_ZENG_YUAN, COLOR_BLUE, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new ZengYuan(CARD_ZENG_YUAN, COLOR_RED, DIRECTION_ALL, OPERATION_ZHI_DA, false),

        new ShiTan2(CARD_SHI_TAN, COLOR_GREY, DIRECTION_ALL, OPERATION_MI_DIAN, false, CAMP_RED),
        new ShiTan2(CARD_SHI_TAN, COLOR_GREY, DIRECTION_ALL, OPERATION_MI_DIAN, false, CAMP_BLUE),
        new ShiTan2(CARD_SHI_TAN, COLOR_GREY, DIRECTION_ALL, OPERATION_MI_DIAN, false, CAMP_GREY),
        new ShiTan2(CARD_SHI_TAN, COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false, CAMP_RED),
        new ShiTan2(CARD_SHI_TAN, COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false, CAMP_BLUE),
        new ShiTan2(CARD_SHI_TAN, COLOR_GREY, DIRECTION_RIGHT, OPERATION_MI_DIAN, false, CAMP_GREY),
        new ShiTan3(CARD_SHI_TAN, COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new ShiTan3(CARD_SHI_TAN, COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
        new ShiTan3(CARD_SHI_TAN, COLOR_GREY, DIRECTION_ALL, OPERATION_ZHI_DA, false),
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

    public static judgeCardEvent(room: Room, eventCard: Card | undefined, cardEventArray: string[], startIndex: number = 0): boolean {
        let waitPlayers: Player[] | undefined;
        let waitCardId: string | undefined;

        for (; startIndex < cardEventArray.length; startIndex++) {
            let judgeCardId = cardEventArray[startIndex];
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
                room.eventStack.push(new _0_WaitPlayerUseCard(waitPlayers, eventCard, waitCardId!, cardEventArray, startIndex));
                return true;
            }
        }
        return false;
    }
}