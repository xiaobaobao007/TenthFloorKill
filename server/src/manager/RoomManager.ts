import {Room} from "../model/Room";
import {Player} from "../model/Player";
import {PlayerManager} from "./PlayerManager";

export class RoomManager {
    private static roomId: number = 1000;
    private static roomMap = new Map<string, Room>();

    private static readonly MAX_PLAYER = 8;

    public static create(player: Player) {
        if (player.room) {
            PlayerManager.logout(player.socket, "已经在房间了，请重新登录");
            return;
        }
        player.send("base/changeBody", {body: "room"});

        const room = new Room("" + this.roomId++);
        room.addPlayer(player);
        this.roomMap.set(room.roomId, room);
        room.updateRoom();
    }

    public static join(player: Player, roomId: string) {
        let room = this.roomMap.get(roomId);
        if (!room) {
            player.sendTips("房间不存在");
            return;
        }

        if (room.start) {
            player.sendTips("游戏已经开始了");
            return;
        }

        if (room.playerArray.length >= 8) {
            player.sendTips("房间满员了");
            return;
        }

        room.addPlayer(player);

        player.send("base/changeBody", {body: "room"});
        room.updateRoom();
    }

    public static level(player: Player) {
        const room = player.room;
        if (!room) {
            return;
        }

        if (room.start) {
            player.sendTips("游戏已开始无法退出");
            return;
        }

        room.removePlayer(player);

        if (room.playerArray.length == 0) {
            this.roomMap.delete(room.roomId);
        } else {
            room.updateRoom();
        }

        player.send("base/changeBody", {body: "hall"});
    }
}