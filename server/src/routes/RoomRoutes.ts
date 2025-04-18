import {ServerClientRoutes} from "./ServerClientRoutes";
import {Player} from "../model/Player";
import {RoomManager} from "../manager/RoomManager";

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
        let data = {
            all: player.room.statistics
        };
        player.send("room/openStatistics", data);
    }
}