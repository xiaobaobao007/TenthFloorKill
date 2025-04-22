import {Player} from "../model/Player";
import {CLIENT_STRING_DATA} from "../util/Constant";
import {ServerClientRoutes} from "./ServerClientRoutes";
import {ROUTER} from "../util/SocketUtil";

export class BaseRoutes extends ServerClientRoutes {
    async login(player: Player) {
        let data = {
            stringConfig: CLIENT_STRING_DATA
        }

        player.send(ROUTER.base.LOGIN_BACK, data);

        if (!player.reLogin) {
            return;
        }

        this.reLogin(player);
    }

    reLogin(player: Player) {
        if (!player.room || !player.room.start) {
            return;
        }
        player.send(ROUTER.base.CHANGE_BODY, "room");
        player.room.updateRoomToOnePlayer(player);
    }

}