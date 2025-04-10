import {ServerRoutes} from "./Routes";
import {Player} from "../model/Player";

export class BaseRoutes extends ServerRoutes {
    async login(player: Player) {
        player.send("base/loginBack", "登录成功");
    }
}