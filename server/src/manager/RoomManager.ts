import {Room} from "../model/Room";
import {Player} from "../model/Player";
import {PlayerManager} from "./PlayerManager";

export class RoomManager {
    private static roomId: number = 1000;
    private static roomMap = new Map<string, Room>();

    public static create(player: Player) {
        if (player.room) {
            PlayerManager.logout(player.socket, "已经在房间了，请重新登录");
            return;
        }

        const room = new Room("" + this.roomId++);
        room.addPlayer(player);
        this.roomMap.set(room.roomId, room);
        room.updateRoom();

        player.send("base/changeBody", {body: "room"});
    }

    // public static join(player: Player, roomId: string) {
    //     console.log(`joined room: ${roomId}`);
    //
    //     let room = this.roomMap.get(roomId);
    //     if (!room) {
    //         room = new Room();
    //         this.roomMap.set(roomId, room);
    //     }
    //
    //     room.addPlayer(player);
    //
    //     player.roomId = roomId;
    // }
    //
    // public static move(player: Player, data: any) {
    //     let room = this.roomMap.get(player.roomId);
    //     if (!room) {
    //         return;
    //     }
    //     room.move(data);
    // }
    //

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
    }
}