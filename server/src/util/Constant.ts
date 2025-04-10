export const CARD_ALL = [
    {id: "lj", color: "g", dir: "dir_r", ope: "ope_z", num: 3},//5+
    {id: "lj", color: "b", dir: "dir_r", ope: "ope_z", num: 1},//5+
    {id: "lj", color: "r", dir: "dir_r", ope: "ope_z", num: 1},//5+

    {id: "py", color: "g", dir: "dir_r", ope: "ope_m", num: 2},//6+
    {id: "py", color: "b", dir: "dir_r", ope: "ope_m", num: 2},//6+
    {id: "py", color: "r", dir: "dir_r", ope: "ope_m", num: 2},//6+

    {id: "mmxd", color: "g", dir: "dir_r", ope: "ope_z", num: 3},//9+
    {id: "mmxd", color: "b", dir: "dir_r", ope: "ope_z", num: 3},//9+
    {id: "mmxd", color: "r", dir: "dir_r", ope: "ope_z", num: 3},//9+

    {id: "sp", color: "g", dir: "dir_r", ope: "ope_m", num: 2},//6+
    {id: "sp", color: "b", dir: "dir_r", ope: "ope_m", num: 2},//6+
    {id: "sp", color: "r", dir: "dir_r", ope: "ope_m", num: 2},//6+

    {id: "db", color: "g", dir: "dir_r", ope: "ope_w", lock: true, num: 1},//5+
    {id: "db", color: "b", dir: "dir_r", ope: "ope_w", lock: true, num: 2},//5+
    {id: "db", color: "r", dir: "dir_r", ope: "ope_w", lock: true, num: 2},//5+

    {id: "jh", color: "g", dir: "dir_", ope: "ope_m", num: 2},//6+
    {id: "jh", color: "b", dir: "dir_", ope: "ope_m", num: 2},//6+
    {id: "jh", color: "r", dir: "dir_", ope: "ope_m", num: 2},//6+

    {id: "dhls", color: "g", dir: "dir_", ope: "ope_m", num: 2},//6+
    {id: "dhls", color: "b", dir: "dir_", ope: "ope_m", num: 2},//6+
    {id: "dhls", color: "r", dir: "dir_", ope: "ope_m", num: 2},//6+

    {id: "gkwb", color: "g", dir: "dir_r", ope: "ope_w", num: 3},//5+
    {id: "gkwb", color: "b", dir: "dir_r", ope: "ope_w", num: 1},//5+
    {id: "gkwb", color: "r", dir: "dir_r", ope: "ope_w", num: 1},//5+

    {id: "sh", color: "g", dir: "dir_r", ope: "ope_z", num: 3},//5+
    {id: "sh", color: "b", dir: "dir_r", ope: "ope_z", num: 1},//5+
    {id: "sh", color: "r", dir: "dir_r", ope: "ope_z", num: 1},//5+

    {id: "zhuanyi", color: "g", dir: "dir_r", ope: "ope_m", num: 3},//5+
    {id: "zhuanyi", color: "b", dir: "dir_r", ope: "ope_m", num: 1},//5+
    {id: "zhuanyi", color: "r", dir: "dir_r", ope: "ope_m", num: 1},//5+

    {id: "jmwj", color: "d", dir: "dir_r", ope: "ope_z", num: 3},//3+

    {id: "sd", color: "g", dir: "dir_r", ope: "ope_m", num: 2},//9+
    {id: "sd", color: "g", dir: "dir_r", ope: "ope_z", num: 1},//9+
    {id: "sd", color: "b", dir: "dir_r", ope: "ope_m", num: 2},//9+
    {id: "sd", color: "b", dir: "dir_r", ope: "ope_z", num: 1},//9+
    {id: "sd", color: "r", dir: "dir_r", ope: "ope_m", num: 2},//9+
    {id: "sd", color: "r", dir: "dir_r", ope: "ope_z", num: 1},//9+

    {id: "wxqb", color: "g", dir: "dir_r", ope: "ope_", lock: true, num: 2},//5+
    {id: "wxqb", color: "g", dir: "dir_", ope: "ope_", lock: true, num: 3},//5+

    {id: "zengyuan", color: "g", dir: "dir_r", ope: "ope_z", num: 1},//3+
    {id: "zengyuan", color: "b", dir: "dir_r", ope: "ope_z", num: 1},//3+
    {id: "zengyuan", color: "r", dir: "dir_r", ope: "ope_z", num: 1},//3+

    {id: "st", color: "g", dir: "dir_r", ope: "ope_z", num: 1},//9+
    {id: "st", color: "g", dir: "dir_r", ope: "ope_z", num: 1},//9+
    {id: "st", color: "g", dir: "dir_r", ope: "ope_z", num: 1},//9+
    {id: "st", color: "g", dir: "dir_r", ope: "ope_z", num: 1},//9+
    {id: "st", color: "g", dir: "dir_r", ope: "ope_z", num: 1},//9+
    {id: "st", color: "g", dir: "dir_r", ope: "ope_z", num: 1},//9+
    {id: "st", color: "g", dir: "dir_r", ope: "ope_z", num: 1},//9+
    {id: "st", color: "g", dir: "dir_r", ope: "ope_z", num: 1},//9+
    {id: "st", color: "g", dir: "dir_r", ope: "ope_z", num: 1},//9+
];

export let CLIENT_STRING_DATA = {
    "dir_r": "向右边方向传递",
    "dir_": "自定义方向传递",
    "ope_z": "直达",
    "ope_m": "密电",
    "ope_w": "文本",
    "ope_": "任意方式传递",

    "st_name": "试探", "st_desc": "我是【试探】的描述",
    "mmxd_name": "秘密下达", "mmxd_desc": "我是【秘密下达】的描述",
    "gkwb_name": "公开文本", "gkwb_desc": "我是【公开文本】的描述",

    "jh_name": "截获", "jh_desc": "我是【截获】的描述",
    "zengyuan_name": "转移", "zengyuan_desc": "我是【转移】的描述",
    "dhls_name": "调虎离山", "dhls_desc": "我是【调虎离山】的描述",
    "sh_name": "烧毁", "sh_desc": "我是【烧毁】的描述",
    "db_name": "掉包", "db_desc": "我是【掉包】的描述",
    "lj_name": "离间", "lj_desc": "我是【离间】的描述",
    "wxqb_name": "危险情报", "wxqb_desc": "我是【危险情报】的描述",
    "sp_name": "识破", "sp_desc": "我是【识破】的描述",
    "zhuanyi_name": "增援", "zhuanyi_desc": "我是【增援】的描述",
    "jmwj_name": "机密文件", "jmwj_desc": "我是【机密文件】的描述",
    "py_name": "破译", "py_desc": "我是【破译】的描述",
    "sd_name": "锁定", "sd_desc": "我是【锁定】的描述",

    "color_r": "红色情报",
    "color_g": "灰色情报",
    "color_b": "蓝色情报",
    "color_d": "红色加蓝色的双色情报",
}