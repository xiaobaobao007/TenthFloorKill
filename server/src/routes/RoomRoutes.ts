import {ServerClientRoutes} from "./ServerClientRoutes";
import {Player} from "../model/Player";
import {RoomManager} from "../manager/RoomManager";

export class RoomRoutes extends ServerClientRoutes {
    async create(player: Player): Promise<void> {
        RoomManager.create(player);
    }

    async join(player: Player, data: any) {
        console.log('Start game route called');
    }

    async leave(player: Player) {
        RoomManager.level(player);
    }

    async start(player: Player): Promise<void> {
    }
}