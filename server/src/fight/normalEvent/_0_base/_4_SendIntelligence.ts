import {Player} from "../../../model/Player";
import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {COLOR_, GAME_CONFIG, OPERATION_MI_DIAN, OPERATION_WEN_BEN, OPERATION_ZHI_DA} from "../../../util/Constant";
import {Card} from "../../../model/Card";
import {_5_IntelligenceCircle} from "./_5_IntelligenceCircle";
import {AIManager} from "../../../manager/AIManager";
import {MiMiXiaDa} from "../../card/MiMiXiaDa";
import {InitManager} from "../../../manager/InitManager";
import {DiaoBao} from "../../card/DiaoBao";

export class _4_SendIntelligence implements Event {
    private static readonly SEND_BUTTON_INFO = {
        buttonArray: [
            {classType: "submit", needCardNum: 1, sendIntelligence: true, needPlayerNum: 1, root: "game/sendIntelligence", name: "发情报",},
        ],
        moreSelect: {
            wxqb: [{name: "直达方式", value: OPERATION_ZHI_DA}, {name: "密电方式", value: OPERATION_MI_DIAN}, {name: "文本方式", value: OPERATION_WEN_BEN},]
        }
    }

    private readonly currentPlayer: Player;
    private lastTime = GAME_CONFIG._4_SendIntelligence_TIME;

    private intelligenceCard: Card | undefined = undefined;//要传出的情报
    private targetPlayer: Player | undefined;//情报传递给谁玩家

    constructor(currentPlayer: Player) {
        this.currentPlayer = currentPlayer;
    }

    getEffectType(room: Room): EventType {
        if (this.lastTime === GAME_CONFIG._4_SendIntelligence_TIME) {
            return EventType.PRE;
        } else if (this.lastTime >= 0) {
            return EventType.NONE;
        } else {
            return EventType.REMOVE_AND_NEXT;
        }
    }

    prv(room: Room): void {
        if (this.currentPlayer.handCardArray.length == 0) {
            //当玩家手牌为0，则将牌堆顶加入玩家手牌
            room.playerAddNewHandCard(this.currentPlayer, 1, "需要发情报");
        }
        this.sendClientInfo(room, this.currentPlayer);

        if (this.currentPlayer.ai) {
            this.lastTime = 0;
        }
    }

    doEvent(room: Room): void {
        throw new Error("Method not implemented.");
    }

    frameOver(room: Room): void {
        if (this.lastTime % GAME_CONFIG.UPDATE_PLAYER_TIME == 0) {
            room.updateTime({
                account: this.currentPlayer.account,
                time: this.lastTime,
                allTime: GAME_CONFIG._4_SendIntelligence_TIME,
                allTips: "【" + this.currentPlayer.account + "】正在思考发哪张情报",
                myTips: "请选择1张情报和1名玩家",
            });
        }

        this.lastTime -= GAME_CONFIG.GAME_FRAME_TIME;
    }

    nextEvent(room: Room): Event {
        this.currentPlayer.clearButton();

        if (!this.intelligenceCard) {
            AIManager._4_SendIntelligence(this.currentPlayer, this);
        }

        return new _5_IntelligenceCircle(this.currentPlayer, this.intelligenceCard!, this.targetPlayer!);
    }

    sendClientInfo(room: Room, player: Player): void {
        if (player && player != this.currentPlayer) {
            return;
        }
        this.currentPlayer.showButton(_4_SendIntelligence.SEND_BUTTON_INFO);
    }

    setIntelligenceCard(player: Player, card: Card, targetPlayer: Player): void {
        if (this.intelligenceCard !== undefined || player != this.currentPlayer) {
            return;
        }

        const room = player.room!;
        let miMiXiaDaColor = MiMiXiaDa.getMiMiXiaDaColor(room);
        if (miMiXiaDaColor && !card.isSameColor(miMiXiaDaColor)) {
            player.sendTips("请下达【" + InitManager.getStringValue(COLOR_ + miMiXiaDaColor) + "】");
            return;
        }

        let diaoBaoCard = DiaoBao.getDiaoBaoCard(room);
        if (diaoBaoCard && diaoBaoCard != card) {
            player.sendTips("请下达手牌最后一张指定的【" + diaoBaoCard.getName() + "】");
            return;
        }

        this.intelligenceCard = card;
        this.targetPlayer = targetPlayer;
        this.lastTime = 0;
    }
}