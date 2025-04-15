import {ServerClientRoutes} from "./ServerClientRoutes";
import {Player} from "../model/Player";
import {_4_SendIntelligence} from "../fight/normalEvent/_0_base/_4_SendIntelligence";

export class GameRoutes extends ServerClientRoutes {

    //"data":{"cardIdArray":["2"],"playerArray":["robot-2"]
    async sendIntelligence(player: Player, data: any) {
        let card = player.findHandCardById(data.cardIdArray[0]);
        if (!card) {
            player.sendTips("请重新选择情报");
            return;
        }

        const targetPlayer = player.room!.findPlayerByAccount(data.playerArray[0]);
        if (!targetPlayer) {
            player.sendTips("请重新选择玩家");
            return;
        }

        const peek = player.room?.eventStack!.peek();
        if (!(peek instanceof _4_SendIntelligence)) {
            player.sendTips("操作超时");
            return;
        }

        (peek as _4_SendIntelligence).setIntelligenceCard(player, card, targetPlayer);
    }
}