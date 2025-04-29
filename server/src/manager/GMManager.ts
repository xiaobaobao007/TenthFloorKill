import {RoomManager} from "./RoomManager";
import {Room} from "../model/Room";
import {ROUTER} from "../util/SocketUtil";
import {Player} from "../model/Player";

export class GMManager {
    static router(name: string, value: string, request: any) {
        switch (name) {
            case 'tips':
                return this.tips(value);
            case 'addEventTips':
                return this.addEventTips(value);
            case 'closeOneRoom':
                return this.closeOneRoom(value);
            case 'closeAllRoom':
                return this.closeAllRoom();
            default:
                return "unknown " + name;
        }
    }

    private static tips(value: string) {
        RoomManager.roomMap.forEach((room: Room) => room.broadcast(ROUTER.base.TIPS, value));
        return "广播成功：" + value;
    }

    private static addEventTips(value: string) {
        RoomManager.roomMap.forEach((room: Room) => room.addEventTips(value));
        return "事件添加成功：" + value;
    }

    private static closeOneRoom(value: string) {
        const room = RoomManager.roomMap.get(value);
        if (!room) {
            return "房间不存在";
        }

        this.closeRoom(room);

        return value + "退出成功";
    }

    private static closeAllRoom() {
        for (const room of RoomManager.roomMap.values()) {
            this.closeRoom(room);
        }
        return "全部房间退出成功";
    }

    private static closeRoom(room: Room) {
        if (!room) {
            return;
        }

        RoomManager.roomMap.delete(room.roomId);

        room.playerArray.forEach((player: Player) => player.room = undefined);

        room.broadcast(ROUTER.base.CHANGE_BODY, "hall");
        room.broadcast(ROUTER.base.TIPS, "被管理员强行关闭了房间了");
    }
}