import {Player} from "../model/Player";
import {CHOOSE_PEOPLE_WITH_ME, CLIENT_STRING_DATA, ROUND_USE_CARD, USE_CARD_NEED_CHOOSE_PEOPLE} from "../util/Constant";
import {ServerClientRoutes} from "./ServerClientRoutes";
import {ROUTER} from "../util/SocketUtil";

export class BaseRoutes extends ServerClientRoutes {
    async login(player: Player) {
        let data = {
            stringConfig: CLIENT_STRING_DATA,
            rounding: {
                card: ROUND_USE_CARD,
                needChoosePlayer: USE_CARD_NEED_CHOOSE_PEOPLE,
                needChoosePlayerWithMe: CHOOSE_PEOPLE_WITH_ME,
            }
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