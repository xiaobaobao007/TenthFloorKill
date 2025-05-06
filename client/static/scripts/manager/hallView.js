function createRoom() {
    sendWsMessage('room/create');
}

function joinRoom() {
    sendWsMessage('room/join', {roomId: $("#joinRoomId").val()});
}

function changeAccount() {
    closeWs();
}

function showHelp() {
    let html = "" +
        "- 情报传递方式为<redFont>【选择一名玩家】 + 【选择一张情报】</redFont> 带旋转的情报：以选择玩家距离自己<redFont>最近</redFont>的方式传递。。</br>" +
        "- 猜测他人身份时，<redFont>点击其右上角问号</redFont>进行记录。</br>" +
        "- 卡牌按照一定优先级、挨个全局询问（不会一个一个询问）。谁先出牌算谁的。会有全局倒计时（不能被看出来是谁有牌）。</br>" +
        "- 离线玩家或机器人会随机发情报，对面前事件会选取选择拒绝和忽略。<redFont>（人数不够4人添加机器人）</redFont></br>" +
        "- 试探卡牌会有阵营提醒，当前阵营会有特殊操作。</br>" +
        "- 烧毁不仅能在回合内能使用，也能<redFont>救濒死玩家</redFont>。</br>" +
        "- <redFont>长按手牌</redFont>可以查看详情。</br>" +
        "";
    openFloatingDiv(html);
}

function showUpdate() {
    let html = "" +
        "- <redFont>未来</redFont> 实现英雄技能等。</br>" +
        "- <redFont>2025-05-06</redFont> 增强当前回合玩家和情报考虑者的UI提醒。</br>" +
        "- <redFont>2025-04-29</redFont> 完成所有卡牌效果：破译,识破,试探,机密文件,增援,烧毁,危险情报,公开文本,秘密下达,截获,转移,调虎离山,掉包,离间,锁定。</br>" +
        "- <redFont>2025-04-08</redFont> 项目启动。</br>" +
        "";
    openFloatingDiv(html);
}