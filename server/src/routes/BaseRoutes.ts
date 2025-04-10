import {Player} from "../model/Player";
import {CLIENT_STRING_DATA} from "../util/Constant";
import {ServerClientRoutes} from "./ServerClientRoutes";

export class BaseRoutes extends ServerClientRoutes {
    async login(player: Player) {
        let data = {
            stringConfig: CLIENT_STRING_DATA,
        }

        player.send("base/loginBack", data);
    }
}