const stringJson = {
    "dir_r": "向右边方向传递",
    "dir_": "自定义方向传递",
    "ope_z": "直达",
    "ope_m": "密电",
    "ope_w": "文本",
    "ope_": "任意方式传递",

    "mmxd_name": "秘密下达", "mmxd_desc": "我是【秘密下达】的描述",
    "gkwb_name": "公开文本", "gkwb_desc": "我是【公开文本】的描述",
    "st_name": "试探", "st_desc": "我是【试探】的描述",

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

const positionArray = [
    {type: "me"},
    {type: "other2", x: 0, y: 35},
    {type: "other3", x: 15, y: 10},
    {type: "other4", x: 36, y: 5},
    {type: "other5", x: 58, y: 5},
    {type: "other6", x: 80, y: 15},
    {type: "other7", x: 85, y: 55},
    {type: "other8", x: 68, y: 70},
];

function initWaitingRoomData() {
    positionArray[0].info = {
        name: localStorage.getItem(ALL_PARAM.ACCOUNT),
    };

    positionArray[3].info = {
        name: localStorage.getItem(ALL_PARAM.ACCOUNT),
    };
    initWaitingRoom();
}

function initWaitingRoom() {
    const waitingRoom = document.getElementById('body-room');

    const playerBox0 = document.getElementById('playerBox0');

    for (let i = 1; i < positionArray.length; i++) {
        const positionArrayElement = positionArray[i];

        let newPlayerBox = positionArrayElement.div;
        if (!positionArrayElement.div) {
            newPlayerBox = document.createElement("div");
            positionArrayElement.div = newPlayerBox;
            waitingRoom.appendChild(newPlayerBox);
        }

        newPlayerBox.innerHTML = playerBox0.innerHTML;
        newPlayerBox.classList = playerBox0.classList;
        newPlayerBox.id = "playerBox" + i;

        newPlayerBox.classList.remove('me-box');
        if (positionArrayElement.info) {
        } else {
            newPlayerBox.classList.add('empty-box');
        }

        newPlayerBox.style.left = positionArrayElement.x + "vw";
        newPlayerBox.style.top = positionArrayElement.y + "%";
    }
}

function openFloating(data) {
    const overlay = document.getElementById('floating-window');
    overlay.style.display = 'flex';

    let html = "";
    if (data.type === "card") {
        html += "卡牌类型介绍：</br>";
        html += "名称：" + stringJson[data.id + "_name"] + "</br>";
        html += "描述：" + stringJson[data.id + "_desc"] + "</br>";
        html += "颜色：" + stringJson["color_" + data.color] + "</br>";
        html += "传递方式：" + stringJson[data.ope] + "</br>";
    }

    document.getElementsByClassName('floating-window-content')[0].innerHTML = html;
}

function closeFloating() {
    const overlay = document.getElementById('floating-window');
    overlay.style.display = 'none';
}

// {type: 'card', id: 'lj', color: 'r', dir: 'dir_r', ope: "ope_m", lock: true},
function initMyCard() {
    let html = "";
    let allId = ["st", "mmxd", "gkwb", "jh", "zengyuan", "dhls", "sh", "db", "lj", "wxqb", "sp", "zhuanyi", "jmwj", "py", "sd"];
    let allColor = ["r", "g", "b", "d"];
    let allDir = ["dir_r", "dir_"];
    let allOpe = ["ope_z", "ope_m", "ope_w", "ope_"];
    for (let i = 0; i < 10; i++) {
        let card = {
            type: 'card',
            id: allId[random(allId.length)],
            color: allColor[random(allColor.length)],
            dir: allDir[random(allDir.length)],
            ope: allOpe[random(allOpe.length)],
            lock: random(4) === 0,
        }

        let class_ = "card";
        if (card.color === "r") class_ += " card-red";
        else if (card.color === "g") class_ += " card-grey";
        else if (card.color === "b") class_ += " card-blue";
        else if (card.color === "d") class_ += " card-double";

        const name = stringJson[card.id + "_name"];
        class_ += " card-name-" + name.length;

        html += "<div class='" + class_ + "' onclick='openFloating(" + JSON.stringify(card) + ")'>";
        html += "<div class='card-name'>" + name + "</div>";

        let tips = "";
        if (card.dir === "dir_") tips += "🔄";

        if (card.ope === "ope_z") tips += "✈";
        else if (card.ope === "ope_m") tips += "✉️";
        else if (card.ope === "ope_w") tips += "📄";
        else if (card.ope === "ope_") tips += "❔";

        if (card.lock) tips += "🔒";

        html += "<div class='card-tips'>" + tips + "</div>";
        html += "</div>";
    }

    document.getElementsByClassName('my-card')[0].innerHTML = html;
}
