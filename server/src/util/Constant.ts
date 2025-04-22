//人数，潜伏人数-red，军情人数-blue，特工人数-grey
export const CAMP_CONFIG = [[1, 1, 1, 1], [2, 1, 1, 2], [3, 1, 1, 2], [4, 2, 2, 2], [5, 2, 2, 1], [6, 2, 2, 2], [7, 3, 3, 1], [8, 3, 3, 2]];
export const CAMP_ = "camp_";
export const CAMP_RED = "camp_red";
export const CAMP_BLUE = "camp_blue";
export const CAMP_GREY = "camp_grey";

//情报颜色
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
export const CARD_NAME = "_name";
export const CARD_DESC = "_desc";
export const CARD_PO_YI = "py";

//客户端字符串配置
interface ClientConfigNameAndValue {
    name: string,
    value: string,
}

export const CLIENT_STRING_DATA: ClientConfigNameAndValue[] = [
    {name: CAMP_, value: "???"},
    {name: CAMP_RED, value: "潜伏"},
    {name: CAMP_BLUE, value: "军情"},
    {name: CAMP_GREY, value: "特工"},

    {name: "color_" + COLOR_RED, value: "红色情报"},
    {name: "color_" + COLOR_GREY, value: "灰色情报"},
    {name: "color_" + COLOR_BLUE, value: "蓝色情报"},
    {name: "color_" + COLOR_DOUBLE, value: "红色加蓝色的双色情报"},

    {name: OPERATION_ZHI_DA, value: "直达"},
    {name: OPERATION_MI_DIAN, value: "密电"},
    {name: OPERATION_WEN_BEN, value: "文本"},
    {name: OPERATION_REN_YI, value: "任意方式传递"},

    {name: DIRECTION_RIGHT, value: "向右边方向传递"},
    {name: DIRECTION_ALL, value: "自定义方向传递"},

    {name: "st" + CARD_NAME, value: "试探"},
    {name: "st" + CARD_DESC, value: "我是【试探】的描述"},
    {name: "mmxd" + CARD_NAME, value: "秘密下达"},
    {name: "mmxd" + CARD_DESC, value: "我是【秘密下达】的描述"},
    {name: "gkwb" + CARD_NAME, value: "公开文本"},
    {name: "gkwb" + CARD_DESC, value: "我是【公开文本】的描述"},

    {name: "jh" + CARD_NAME, value: "截获"},
    {name: "jh" + CARD_DESC, value: "我是【截获】的描述"},
    {name: "zengyuan" + CARD_NAME, value: "转移"},
    {name: "zengyuan" + CARD_DESC, value: "我是【转移】的描述"},
    {name: "dhls" + CARD_NAME, value: "调虎离山"},
    {name: "dhls" + CARD_DESC, value: "我是【调虎离山】的描述"},
    {name: "sh" + CARD_NAME, value: "烧毁"},
    {name: "sh" + CARD_DESC, value: "我是【烧毁】的描述"},
    {name: "db" + CARD_NAME, value: "掉包"},
    {name: "db" + CARD_DESC, value: "我是【掉包】的描述"},
    {name: "lj" + CARD_NAME, value: "离间"},
    {name: "lj" + CARD_DESC, value: "我是【离间】的描述"},
    {name: "wxqb" + CARD_NAME, value: "危险情报"},
    {name: "wxqb" + CARD_DESC, value: "我是【危险情报】的描述"},
    {name: "sp" + CARD_NAME, value: "识破"},
    {name: "sp" + CARD_DESC, value: "我是【识破】的描述"},
    {name: "zhuanyi" + CARD_NAME, value: "增援"},
    {name: "zhuanyi" + CARD_DESC, value: "我是【增援】的描述"},
    {name: "jmwj" + CARD_NAME, value: "机密文件"},
    {name: "jmwj" + CARD_DESC, value: "我是【机密文件】的描述"},
    {name: CARD_PO_YI + CARD_NAME, value: "破译"},
    {name: CARD_PO_YI + CARD_DESC, value: "检视一张未反开的情报"},
    {name: "sd" + CARD_NAME, value: "锁定"},
    {name: "sd" + CARD_DESC, value: "我是【锁定】的描述"},

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
    GAME_FRAME_TIME: 10,//服务器游戏逻辑帧间隔（毫秒）
    UPDATE_PLAYER_TIME: 100,//更新前端倒计时时间(毫秒)

    RED_WIN_GAME_CARD_NUM: 3,//潜伏获胜需要数量
    BLUE_WIN_GAME_CARD_NUM: 3,//军情获胜需要数量
    GREY_WIN_GAME_CARD_NUM: 6,//特工获胜需要数量

    _3_PlayerRounding_TIME: 60 * 1000,//出牌操作(毫秒)
    _4_SendIntelligence_TIME: 60 * 1000,//发情报操作(毫秒)
    _6_PlayerRoundEnd_TIME: 60 * 1000,//弃牌操作(毫秒)
    _5_1_WaitingPlayerReceive_TIME: 60 * 1000,//等待接收操作(毫秒)

    _0_WaitPlayerUseCard_TIME: 60 * 1000,//思考是否使用卡牌(毫秒)
};