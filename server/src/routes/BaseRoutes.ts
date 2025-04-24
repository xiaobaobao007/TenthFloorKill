import {Player} from "../model/Player";
import {CLIENT_STRING_DATA, ROUND_USE_CARD, USE_CARD_NEED_CHOOSE_PEOPLE, USE_CARD_NEED_CHOOSE_PEOPLE_WITH_ME} from "../util/Constant";
import {ServerClientRoutes} from "./ServerClientRoutes";
import {ROUTER} from "../util/SocketUtil";

export class BaseRoutes extends ServerClientRoutes {
    async login(player: Player) {
        let data = {
            stringConfig: CLIENT_STRING_DATA,
            rounding: {
                needChoosePlayer: USE_CARD_NEED_CHOOSE_PEOPLE,
                needChoosePlayerWithMe: USE_CARD_NEED_CHOOSE_PEOPLE_WITH_ME,
                canUseCard: ROUND_USE_CARD,
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