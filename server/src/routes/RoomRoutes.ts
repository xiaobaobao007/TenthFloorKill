import {ServerClientRoutes} from "./ServerClientRoutes";
import {Player} from "../model/Player";
import {RoomManager} from "../manager/RoomManager";
import {ROUTER} from "../util/SocketUtil";

export class RoomRoutes extends ServerClientRoutes {
    async create(player: Player): Promise<void> {
        RoomManager.create(player);
    }

    async join(player: Player, data: any) {
        RoomManager.join(player, data.roomId);
    }

    async leave(player: Player) {
        RoomManager.leave(player);
    }

    async start(player: Player) {
        RoomManager.start(player);
    }

    async ready(player: Player) {
        RoomManager.ready(player);
    }

    async unready(player: Player) {
        RoomManager.unready(player);
    }

    async getStatistics(player: Player) {
        if (!player.room) {
            return;
        }
        if (player.room.statistics.length == 0) {
            player.sendTips("当前还未进行过战斗");
            return;
        }
        let data = {
            all: player.room.statistics
        };
        player.send(ROUTER.room.OPEN_STATISTICS, data);
    }
}