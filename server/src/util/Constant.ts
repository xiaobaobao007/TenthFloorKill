//人数，潜伏人数-red，军情人数-blue，特工人数-grey
export const CAMP_CONFIG = [[1, 1, 1, 1], [2, 1, 1, 2], [3, 1, 1, 2], [4, 2, 2, 2], [5, 2, 2, 1], [6, 2, 2, 2], [7, 3, 3, 1], [8, 3, 3, 2]];
export const CAMP_ = "camp_";
export const CAMP_RED = "camp_red";
export const CAMP_BLUE = "camp_blue";
export const CAMP_GREY = "camp_grey";

//情报颜色
export const COLOR_ = "color_";
export const COLOR_RED = "r";
export const COLOR_GREY = "g";
export const COLOR_BLUE = "b";
export const COLOR_DOUBLE = "d";

//情报传递方式
export const OPERATION_ZHI_DA = "ope_z";
export const OPERATION_MI_DIAN = "ope_m";
export const OPERATION_WEN_BEN = "ope_w";
export const OPERATION_REN_YI = "ope_";

//情报转向
export const DIRECTION_RIGHT = "dir_r"
export const DIRECTION_ALL = "dir_"

//卡牌
export const _CARD_NAME = "_name";
export const _CARD_DESC = "_desc";
export const CARD_PO_YI = "py";//破译
export const CARD_SHI_PO = "sp";//识破
export const CARD_SHI_TAN = "st";//试探
export const CARD_JI_MI_WEN_JIAN = "jmwj";//机密文件
export const CARD_ZENG_YUAN = "zengyuan";//增援
export const CARD_SHAO_HUI = "sh";//烧毁
export const CARD_WEI_XIAN_QING_BAO = "wxqb";//危险情报
export const CARD_GONG_KAI_WEN_BEN = "gkwb";//公开文本
export const CARD_MI_MI_XIA_DA = "mmxd";//秘密下达
export const CARD_JIE_HUO = "jh";//截获
export const CARD_ZHUAN_YI = "zhuanyi";//转移
export const CARD_DIAO_HU_LI_SHAN = "dhls";//调虎离山
export const CARD_DIAO_BAO = "db";//掉包
export const CARD_SUO_DING = "sd";//锁定
export const CARD_LI_JIAN = "lj";//离间

//客户端字符串配置
interface ClientConfigNameAndValue {
    name: string,
    value: string,
}

//回合内能使用的牌
export const ROUND_USE_CARD: string[] = [
    CARD_SHI_TAN,
    CARD_JI_MI_WEN_JIAN,
    CARD_ZENG_YUAN,
    CARD_SHAO_HUI,
    CARD_WEI_XIAN_QING_BAO,
    CARD_GONG_KAI_WEN_BEN,
];

//使用卡牌需要选择玩家
export const USE_CARD_NEED_CHOOSE_PEOPLE: string[] = [
    CARD_SHI_TAN,
    CARD_SHAO_HUI,
    CARD_WEI_XIAN_QING_BAO,
    CARD_GONG_KAI_WEN_BEN,
    CARD_ZHUAN_YI,
    CARD_LI_JIAN,
];

//选择玩家时候可以选择自己
export const CHOOSE_PEOPLE_WITH_ME: string[] = [
    CARD_SHAO_HUI,
    CARD_WEI_XIAN_QING_BAO,
    CARD_LI_JIAN,
];

export const CLIENT_STRING_DATA: ClientConfigNameAndValue[] = [
    {name: CAMP_, value: "???"},
    {name: CAMP_RED, value: "潜伏"},
    {name: CAMP_BLUE, value: "军情"},
    {name: CAMP_GREY, value: "特工"},

    {name: COLOR_ + COLOR_RED, value: "红色情报"},
    {name: COLOR_ + COLOR_GREY, value: "灰色情报"},
    {name: COLOR_ + COLOR_BLUE, value: "蓝色情报"},
    {name: COLOR_ + COLOR_DOUBLE, value: "双色情报"},

    {name: OPERATION_ZHI_DA, value: "直达"},
    {name: OPERATION_MI_DIAN, value: "密电"},
    {name: OPERATION_WEN_BEN, value: "文本"},
    {name: OPERATION_REN_YI, value: "任意方式传递"},

    {name: DIRECTION_RIGHT, value: "向右边方向传递"},
    {name: DIRECTION_ALL, value: "任选方向传递"},

    {name: CARD_SHI_TAN + _CARD_NAME, value: "试探"},
    {name: CARD_SHI_TAN + _CARD_DESC, value: "自己回合中使用，指定除自己以外的玩家使用，（仅双方可见，执行后移出游戏）"},
    {name: CARD_SHI_TAN + "_2_" + CAMP_RED, value: "【潜伏】抽一张，其他弃一张"},
    {name: CARD_SHI_TAN + "_2_" + CAMP_BLUE, value: "【军情】抽一张，其他弃一张"},
    {name: CARD_SHI_TAN + "_2_" + CAMP_GREY, value: "【特工】抽一张，其他弃一张"},
    {name: CARD_SHI_TAN + "_3", value: "被抽一张牌还是被看身份"},
    {name: CARD_MI_MI_XIA_DA + _CARD_NAME, value: "秘密下达"},
    {name: CARD_MI_MI_XIA_DA + _CARD_DESC, value: "我是【秘密下达】的描述"},
    {name: CARD_GONG_KAI_WEN_BEN + _CARD_NAME, value: "公开文本"},
    {name: CARD_GONG_KAI_WEN_BEN + _CARD_DESC, value: "替换一名玩家手牌，抽到公开文本则弃掉"},
    {name: CARD_JIE_HUO + _CARD_NAME, value: "截获"},
    {name: CARD_JIE_HUO + _CARD_DESC, value: "自己回合外他人情报接收时，将情报传至自己"},
    {name: CARD_ZENG_YUAN + _CARD_NAME, value: "增援"},
    {name: CARD_ZENG_YUAN + _CARD_DESC, value: "摸取自己假情报数量加1的牌"},
    {name: CARD_DIAO_HU_LI_SHAN + _CARD_NAME, value: "调虎离山"},
    {name: CARD_DIAO_HU_LI_SHAN + _CARD_DESC, value: "他人情报接收时使用，取消接收接着往下传，无法指定原传出者"},
    {name: CARD_SHAO_HUI + _CARD_NAME, value: "烧毁"},
    {name: CARD_SHAO_HUI + _CARD_DESC, value: "烧毁一张不带锁的假情报"},
    {name: CARD_DIAO_BAO + _CARD_NAME, value: "掉包"},
    {name: CARD_DIAO_BAO + _CARD_DESC, value: "情报传回传出着时，替换当前情报（无法替换文本），并由传出者重新传递"},
    {name: CARD_LI_JIAN + _CARD_NAME, value: "离间"},
    {name: CARD_LI_JIAN + _CARD_DESC, value: "变更【试探/锁定/转移/危险情报/公开文本】的指定目标，无法指定使用者"},
    {name: CARD_WEI_XIAN_QING_BAO + _CARD_NAME, value: "危险情报"},
    {name: CARD_WEI_XIAN_QING_BAO + _CARD_DESC, value: "检视一名玩家手牌并丢弃一张"},
    {name: CARD_SHI_PO + _CARD_NAME, value: "识破"},
    {name: CARD_SHI_PO + _CARD_DESC, value: "使响应链的最后一张牌的效果失效"},
    {name: CARD_ZHUAN_YI + _CARD_NAME, value: "转移"},
    {name: CARD_ZHUAN_YI + _CARD_DESC, value: "将传至自己的情报传至他人接收"},
    {name: CARD_JI_MI_WEN_JIAN + _CARD_NAME, value: "机密文件"},
    {name: CARD_JI_MI_WEN_JIAN + _CARD_DESC, value: "场上真情报超过4张摸2张，超过5张摸3张"},
    {name: CARD_PO_YI + _CARD_NAME, value: "破译"},
    {name: CARD_PO_YI + _CARD_DESC, value: "检视一张未反开的情报"},
    {name: CARD_SUO_DING + _CARD_NAME, value: "锁定"},
    {name: CARD_SUO_DING + _CARD_DESC, value: "自己回合中，他人情报接受前指定其接收传至面前的情报"},

    {name: "leader" + "_emoji", value: "🏠"},
    {name: DIRECTION_ALL + "_emoji", value: "🔄"},
    {name: OPERATION_ZHI_DA + "_emoji", value: "直达"},
    {name: OPERATION_MI_DIAN + "_emoji", value: "密电"},
    {name: OPERATION_WEN_BEN + "_emoji", value: "文本"},
    {name: OPERATION_REN_YI + "_emoji", value: ""},
    {name: "lock" + "_emoji", value: "🔒"},
];

//游戏相关配置
export const GAME_CONFIG = {
    GAME_INIT_CARD_NUM: 2,//初始卡牌数量
    ROUND_INIT_CARD_NUM: 2,//回合开始卡牌数量
    MAX_CARD: 6,//最大卡牌数量
    GAME_FRAME_TIME: 20,//服务器游戏逻辑帧间隔（毫秒）
    UPDATE_PLAYER_TIME: 200,//更新前端倒计时时间(毫秒)

    RED_WIN_GAME_CARD_NUM: 3,//潜伏获胜需要数量
    BLUE_WIN_GAME_CARD_NUM: 3,//军情获胜需要数量
    GREY_WIN_GAME_CARD_NUM: 6,//特工获胜需要数量
    DEAD_GREY_CARD_NUM: 3,//灰色情报几张死亡

    _3_PlayerRounding_TIME: 60 * 1000,//出牌操作(毫秒)
    _4_SendIntelligence_TIME: 60 * 1000,//发情报操作(毫秒)
    _6_PlayerRoundEnd_TIME: 60 * 1000,//弃牌操作(毫秒)
    _5_1_WaitingPlayerReceive_TIME: 60 * 1000,//等待接收操作(毫秒)

    _0_WaitPlayerUseCard_TIME: 60 * 1000,//思考是否使用卡牌(毫秒)
};