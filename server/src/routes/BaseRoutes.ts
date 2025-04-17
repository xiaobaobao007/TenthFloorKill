import {Player} from "../model/Player";
import {CLIENT_STRING_DATA, EMOJI_DATA} from "../util/Constant";
import {ServerClientRoutes} from "./ServerClientRoutes";

export class BaseRoutes extends ServerClientRoutes {
    async login(player: Player) {
        let data = {
            stringConfig: CLIENT_STRING_DATA,
            emojiConfig: EMOJI_DATA,
        }

        player.send("base/loginBack", data);

        if (!player.reLogin) {
            return;
        }

        this.reLogin(player);
    }

    reLogin(player: Player) {
        if (!player.room || !player.room.start) {
            return;
        }
        player.send("base/changeBody", {body: "room"});
        player.room.updateRoom(player);
    }

}