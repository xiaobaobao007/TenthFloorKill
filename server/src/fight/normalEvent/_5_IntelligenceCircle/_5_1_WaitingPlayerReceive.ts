import {Player} from "../../../model/Player";
import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {GAME_CONFIG} from "../../../util/Constant";
import {_5_2_PlayerReceive} from "./_5_2_PlayerReceive";
import {Card} from "../../../model/Card";
import {CardManager} from "../../../manager/CardManager";
import {SuoDing} from "../../card/SuoDing";
import {ROUTER} from "../../../util/ServerWsUtil";

export class _5_1_WaitingPlayerReceive implements Event {
    static readonly SEND_BUTTON_INFO = {
        buttonArray: [
            {classType: "success", root: "game/receiveIntelligence", name: "接收",},
            {classType: "cancel", root: "game/refuseIntelligence", name: "拒绝",},
        ]
    }

    private readonly sendPlayer: Player;
    private readonly currentPlayer: Player;
    private readonly intelligenceCard: Card;

    private receive: boolean | undefined;//当前玩家是否要接收这个情报

    private lastTime = GAME_CONFIG._5_1_WaitingPlayerReceive_TIME;

    constructor(sendPlayer: Player, currentPlayer: Player, intelligenceCard: Card) {
        this.sendPlayer = sendPlayer;
        this.currentPlayer = currentPlayer;
        this.intelligenceCard = intelligenceCard;
    }

    getEffectType(room: Room): EventType {
        if (this.lastTime === GAME_CONFIG._5_1_WaitingPlayerReceive_TIME) {
            room.broadcast(ROUTER.roomEvent.UPDATE_ALL_INTELLIGENCE_POSITION, this.currentPlayer.account);
            if (this.currentPlayer.inRounding) {
                if (!CardManager.judgeCardEvent(room, this.intelligenceCard, CardManager.IN_ROUNDING_RECEIVE_BEFORE)) {
                    return EventType.PRE;
                }
            } else if (!CardManager.judgeCardEvent(room, this.intelligenceCard, CardManager.RECEIVE_BEFORE)) {
                return EventType.PRE;
            }
            return EventType.NONE;
        } else if (this.lastTime >= 0) {
            if (this.currentPlayer.ai) {
                this.lastTime = 0;
            }
            return EventType.NONE;
        }

        this.currentPlayer.clearButton();

        if (this.receive == undefined) {
            this.receive = this.mustReceive();
        }

        if (this.receive) {
            room.addEventTips("【" + this.currentPlayer.account + "】选择接收情报");

            if (CardManager.judgeCardEvent(room, this.intelligenceCard, CardManager.RECEIVE_AFTER)) {
                return EventType.NONE;
            }

            return EventType.REMOVE_AND_NEXT;
        }
        return EventType.REMOVE;
    }

    prv(room: Room): void {
        this.sendClientInfo(room, this.currentPlayer);
    }

    doEvent(room: Room): void {
        throw new Error("Method not implemented.");
    }

    frameOver(room: Room): void {
        if (this.lastTime % GAME_CONFIG.UPDATE_PLAYER_TIME == 0) {
            let data = {
                account: this.currentPlayer.account,
                time: this.lastTime,
                allTime: GAME_CONFIG._5_1_WaitingPlayerReceive_TIME,
                allTips: "【" + this.currentPlayer.account + "】正在考虑是否接收【" + this.sendPlayer.account + "】发出的情报",
                myTips: "是否接收当前情报",
            }

            room.updateTime(data);
        }

        this.lastTime -= GAME_CONFIG.GAME_FRAME_TIME;
    }

    nextEvent(room: Room): Event {
        return new _5_2_PlayerReceive(this.currentPlayer, this.intelligenceCard);
    }

    sendClientInfo(room: Room, player: Player): void {
        if (player && player != this.currentPlayer) {
            return;
        }
        this.currentPlayer.showButton(_5_1_WaitingPlayerReceive.SEND_BUTTON_INFO);
    }

    setIsReceive(player: Player, receive: boolean) {
        if (player != this.currentPlayer || this.receive != undefined) {
            return;
        }

        if (!receive) {
            if (this.mustReceive()) {
                player.sendTips("你不能拒绝!!!");
                return;
            }
        }

        this.receive = receive;
        this.lastTime = 0;
    }

    getIntelligenceCard() {
        return this.intelligenceCard;
    }

    getCurrentPlayer(): Player {
        return this.currentPlayer;
    }

    private mustReceive(): boolean {
        return this.currentPlayer.inRounding || SuoDing.beSuoDing(this.currentPlayer);
    }

}