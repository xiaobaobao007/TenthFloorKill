import {Player} from "../../../model/Player";
import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {GAME_CONFIG} from "../../../util/Constant";
import {Card} from "../../../model/Card";
import {_5_IntelligenceCircle} from "./_5_IntelligenceCircle";
import {AIManager} from "../../../manager/AIManager";

export class _4_SendIntelligence implements Event {
    private static readonly SEND_BUTTON_INFO = {
        buttonArray: [
            {classType: "submit", needCardNum: 1, needPlayerNum: 1, root: "game/sendIntelligence", name: "发情报",},
        ]
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
            return EventType.EFFECT;
        } else {
            return EventType.REMOVE_AND_NEXT;
        }
    }

    prv(room: Room): void {
        if (this.currentPlayer.handCardArray.length == 0) {
            //当玩家手牌为0，则将牌堆顶加入玩家手牌
            this.currentPlayer.addCardArray(room.getNewPlayerCard(1));
        }
        this.sendClientInfo(room, this.currentPlayer);

        if (this.currentPlayer.ai) {
            this.lastTime = 0;
        }
    }

    doEvent(room: Room): void {
        let data = {
            account: this.currentPlayer.account,
            time: this.lastTime,
            allTime: GAME_CONFIG._4_SendIntelligence_TIME,
            allTips: this.currentPlayer.account + "发情报阶段",
            myTips: "请选择1张情报和1名玩家",
        };

        room.broadcast("roomEvent/updateTime", data);
    }

    frameOver(room: Room): void {
        this.lastTime -= GAME_CONFIG.GAME_FRAME_TIME;
    }

    nextEvent(room: Room): Event {
        this.currentPlayer.send("roomEvent/clearButton");

        if (!this.intelligenceCard) {
            AIManager._4_SendIntelligence(this.currentPlayer, this);
        }

        return new _5_IntelligenceCircle(this.currentPlayer, this.intelligenceCard!, this.targetPlayer!);
    }

    sendClientInfo(room: Room, player: Player): void {
        if (player != this.currentPlayer) {
            return;
        }
        player.send("roomEvent/showButton", _4_SendIntelligence.SEND_BUTTON_INFO);
    }

    setIntelligenceCard(player: Player, card: Card, targetPlayer: Player): void {
        if (this.intelligenceCard !== undefined || player != this.currentPlayer) {
            return;
        }
        this.intelligenceCard = card;
        this.targetPlayer = targetPlayer;
        this.lastTime = 0;
    }
}