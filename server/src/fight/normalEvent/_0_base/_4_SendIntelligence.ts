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
    private lastTime = GAME_CONFIG.ROUND_ALL_TIME;

    private intelligenceCard: Card | undefined = undefined;//要传出的情报
    private targetPlayer: Player | undefined;//情报传递给谁玩家

    constructor(currentPlayer: Player) {
        this.currentPlayer = currentPlayer;
    }

    getEffectType(room: Room): EventType {
        if (this.intelligenceCard) {
            return EventType.REMOVE_AND_NEXT;
        }

        let data = {
            account: this.currentPlayer.account,
            time: this.lastTime,
            allTime: GAME_CONFIG.ROUND_ALL_TIME,
            allTips: this.currentPlayer.account + "的情报阶段",
            myTips: "请选择1张情报和1名玩家",
        };

        room.broadcast("roomEvent/updateTime", data);

        if (this.lastTime <= 0) {
            return EventType.REMOVE_AND_NEXT;
        }

        if (this.lastTime === GAME_CONFIG.ROUND_ALL_TIME) {
            if (this.currentPlayer.handCardArray.length == 0) {
                //当玩家手牌为0，则将牌堆顶加入玩家手牌
                this.currentPlayer.addCardArray(room.getNewPlayerCard(1));
            }
            this.sendClientInfo(room, this.currentPlayer);
        }

        this.lastTime -= GAME_CONFIG.GAME_FRAME_TIME;
        return EventType.NONE;
    }

    prv(room: Room): void {
        throw new Error("Method not implemented.");
    }

    doEvent(room: Room): void {
        throw new Error("Method not implemented.");
    }

    over(room: Room): void {
        throw new Error("Method not implemented.");
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
    }
}