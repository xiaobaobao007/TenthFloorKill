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

    {name: "st_name", value: "试探"},
    {name: "st_desc", value: "我是【试探】的描述"},
    {name: "mmxd_name", value: "秘密下达"},
    {name: "mmxd_desc", value: "我是【秘密下达】的描述"},
    {name: "gkwb_name", value: "公开文本"},
    {name: "gkwb_desc", value: "我是【公开文本】的描述"},

    {name: "jh" + "_name", value: "截获"},
    {name: "jh" + "_desc", value: "我是【截获】的描述"},
    {name: "zengyuan" + "_name", value: "转移"},
    {name: "zengyuan" + "_desc", value: "我是【转移】的描述"},
    {name: "dhls" + "_name", value: "调虎离山"},
    {name: "dhls" + "_desc", value: "我是【调虎离山】的描述"},
    {name: "sh" + "_name", value: "烧毁"},
    {name: "sh" + "_desc", value: "我是【烧毁】的描述"},
    {name: "db" + "_name", value: "掉包"},
    {name: "db" + "_desc", value: "我是【掉包】的描述"},
    {name: "lj" + "_name", value: "离间"},
    {name: "lj" + "_desc", value: "我是【离间】的描述"},
    {name: "wxqb" + "_name", value: "危险情报"},
    {name: "wxqb" + "_desc", value: "我是【危险情报】的描述"},
    {name: "sp" + "_name", value: "识破"},
    {name: "sp" + "_desc", value: "我是【识破】的描述"},
    {name: "zhuanyi" + "_name", value: "增援"},
    {name: "zhuanyi" + "_desc", value: "我是【增援】的描述"},
    {name: "jmwj" + "_name", value: "机密文件"},
    {name: "jmwj" + "_desc", value: "我是【机密文件】的描述"},
    {name: "py" + "_name", value: "破译"},
    {name: "py" + "_desc", value: "检视一张未反开的情报"},
    {name: "sd" + "_name", value: "锁定"},
    {name: "sd" + "_desc", value: "我是【锁定】的描述"},

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
    GAME_FRAME_TIME: 100,//服务器游戏逻辑帧间隔（毫秒）

    RED_WIN_GAME_CARD_NUM: 3,//潜伏获胜需要数量
    BLUE_WIN_GAME_CARD_NUM: 3,//军情获胜需要数量
    GREY_WIN_GAME_CARD_NUM: 6,//特工获胜需要数量

    _3_PlayerRounding_TIME: 60 * 1000,//出牌操作(毫秒)
    _4_SendIntelligence_TIME: 60 * 1000,//发情报操作(毫秒)
    _6_PlayerRoundEnd_TIME: 60 * 1000,//弃牌操作(毫秒)
    _5_1_WaitingPlayerReceive_TIME: 60 * 1000,//等待接收操作(毫秒)
};