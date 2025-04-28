import {Room} from "../model/Room";
import {Player} from "../model/Player";
import {PlayerManager} from "./PlayerManager";
import {ROUTER} from "../util/SocketUtil";

export class RoomManager {
    public static QUIT_ROOM_BUTTON = {classType: "cancel", root: "room/leave", name: "离开房间",};

    public static readonly LEADER_START_BUTTON_INFO = {
        buttonArray: [{classType: "success", root: "room/start", name: "开始游戏",}, RoomManager.QUIT_ROOM_BUTTON]
    }

    public static readonly OTHER_READY_BUTTON_INFO = {
        buttonArray: [{classType: "success", root: "room/ready", name: "准备",}, RoomManager.QUIT_ROOM_BUTTON]
    }

    public static readonly OTHER_UNREADY_BUTTON_INFO = {
        buttonArray: [{classType: "success", root: "room/unready", name: "已准备",}]
    }

    private static roomId: number = 1000;
    private static _roomMap = new Map<string, Room>();

    private static readonly MAX_PLAYER = 8;

    public static create(player: Player) {
        if (player.room) {
            PlayerManager.logout(player.socket!, "已经在房间了，请重新登录");
            return;
        }
        player.send(ROUTER.base.CHANGE_BODY, "room");

        const room = new Room("" + this.roomId++);
        room.addPlayer(player);
        room.updateRoomToAllPlayer();
        room.updateLeaderButton();

        this._roomMap.set(room.roomId, room);
    }

    public static join(player: Player, roomId: string) {
        let room = this._roomMap.get(roomId);
        if (!room) {
            player.sendTips("房间不存在");
            return;
        }

        if (room.start) {
            player.sendTips("游戏已经开始了");
            return;
        }

        if (room.playerArray.length >= this.MAX_PLAYER) {
            player.sendTips("房间满员了");
            return;
        }
        player.send(ROUTER.base.CHANGE_BODY, "room");

        room.addPlayer(player);
        room.updateRoomToAllPlayer();
        room.updateLeaderButton();

        player.showButton(RoomManager.OTHER_READY_BUTTON_INFO);
    }

    public static leave(player: Player): boolean {
        const room = player.room;
        if (!room) {
            return true;
        }

        if (room.start) {
            if (!player.ai) {
                player.sendTips("游戏已开始无法退出");
            }
            return false;
        }

        room.removePlayer(player);

        if (room.playerArray.length == 0) {
            this._roomMap.delete(room.roomId);
        } else {
            room.updateRoomToAllPlayer();
            room.updateLeaderButton();
        }

        player.send(ROUTER.base.CHANGE_BODY, "hall");
        return true;
    }

    public static start(player: Player) {
        const room = player.room;
        if (!room) {
            return;
        }

        if (room.leaderAccount !== player.account) {
            player.sendTips("你不是房主耶");
            return;
        }

        if (room.start) {
            player.sendTips("游戏已经开始");
            return;
        }

        for (let p of room.playerArray) {
            if (p == player) {
                continue;
            }
            if (!p.ready) {
                player.sendTips(p.account + "未准备");
                return;
            }
        }

        room.gameStart();
    }

    public static ready(player: Player) {
        const room = player.room;
        if (!room || room.start) {
            return;
        }
        player.ready = true;
        player.showButton(RoomManager.OTHER_UNREADY_BUTTON_INFO);
        room.updateLeaderButton();
    }

    public static unready(player: Player) {
        const room = player.room;
        if (!room || room.start) {
            return;
        }
        player.ready = false;
        player.showButton(RoomManager.OTHER_READY_BUTTON_INFO);
        room.updateLeaderButton();
    }

    static get roomMap(): Map<string, Room> {
        return this._roomMap;
    }
}