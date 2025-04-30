import {WebSocket} from "ws";

export class ServerWsUtil {
    public static send(socket: WebSocket | undefined, route: string, data: any = undefined) {
        if (!socket) {
            return;
        }
        let send = {
            route: route.toLowerCase(),
            data: data
        };
        socket.send(JSON.stringify(send));
    }
}

export const ROUTER = {
    base: {
        TIPS: "base/tips",//客户端展示提醒
        LOGIN_BACK: "base/loginBack",//登陆返回
        CHANGE_BODY: "base/changeBody",//切换前端界面
    },
    room: {
        OPEN_STATISTICS: "room/openStatistics",//打开战斗结果统计
        GAME_OVER: "room/gameOver",//游戏结束
        UPDATE: "room/update",//更新房间所有信息
    },
    roomEvent: {
        NEW_INTELLIGENCE_CARD: "roomEvent/newIntelligenceCard",//玩家收到一张情报
        REMOVE_INTELLIGENCE_CARD: "roomEvent/removeIntelligenceCard",//玩家删除一张情报
        UPDATE_HAND_CARD_NUM: "roomEvent/updateHandCardNum",//更新玩家的手牌数量

        DIE: "roomEvent/die",//玩家挂了
        UPDATE_TIME: "roomEvent/updateTime",//更新玩家的时间进度条展示
        ADD_EVENT_TIPS: "roomEvent/addEventTips",//在事件窗口添加新的事件提醒
        UPDATE_LAST_CARD_NUM: "roomEvent/updateLastCardNum",//更新玩家展示的剩余牌库数量

        UPDATE_ALL_INTELLIGENCE: "roomEvent/updateAllIntelligence",//更新正在传递的情报
        CLEAR_ALL_INTELLIGENCE: "roomEvent/clearAllIntelligence",//清理正在传递的情报

        NEW_HAND_CARD: "roomEvent/newHandCard",//玩家添加新的手牌
        REMOVE_HAND_CARD: "roomEvent/removeHandCard",//玩家删除一张手牌

        SHOW_BUTTON: "roomEvent/showButton",//展示玩家的按钮
        CLEAR_BUTTON: "roomEvent/clearButton",//清理玩家的按钮

        SHOW_OTHER_PANEL: "roomEvent/showOtherPanel",//对A展示B的手牌或者情报，进行选择或者仅仅单纯展示
        HIDE_OTHER_PANEL: "roomEvent/hideOtherPanel",//隐藏

        ADD_FLY_CARD: "roomEvent/addFlyCard",//增加公共区域展示卡牌
        CLEAR_FLY_CARD: "roomEvent/clearFlyCard",//清空公共区域展示卡牌
    }
}