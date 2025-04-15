import {ServerClientRoutes} from "./ServerClientRoutes";
import {Player} from "../model/Player";

export class GameRoutes extends ServerClientRoutes {
    async sendIntelligence(player: Player, data: any) {
    }
}