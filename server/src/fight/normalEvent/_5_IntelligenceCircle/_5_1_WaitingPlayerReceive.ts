import {Player} from "../../../model/Player";
import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {GAME_CONFIG} from "../../../util/Constant";
import {_5_2_PlayerReceive} from "./_5_2_PlayerReceive";
import {Card} from "../../../model/Card";
import {_5_IntelligenceCircle} from "../_0_base/_5_IntelligenceCircle";
import {CardManager} from "../../../manager/CardManager";

export class _5_1_WaitingPlayerReceive implements Event {
    static readonly SEND_BUTTON_INFO = {
        buttonArray: [
            {classType: "success", root: "game/receiveIntelligence", name: "接收",},
            {classType: "cancel", root: "game/refuseIntelligence", name: "拒绝",},
        ]
    }

    private readonly fatherEvent: _5_IntelligenceCircle;
    private readonly sendPlayer: Player;
    private readonly currentPlayer: Player;
    private readonly intelligenceCard: Card;

    private receive: boolean | undefined;//当前玩家是否要接收这个情报

    private lastTime = GAME_CONFIG._5_1_WaitingPlayerReceive_TIME;

    constructor(fatherEvent: _5_IntelligenceCircle, sendPlayer: Player, currentPlayer: Player, intelligenceCard: Card) {
        this.fatherEvent = fatherEvent;
        this.sendPlayer = sendPlayer;
        this.currentPlayer = currentPlayer;
        this.intelligenceCard = intelligenceCard;

        if (sendPlayer == currentPlayer) {
            this.lastTime = 0;
            this.receive = true;
        }
    }

    getEffectType(room: Room): EventType {
        if (this.lastTime === GAME_CONFIG._5_1_WaitingPlayerReceive_TIME) {
            return EventType.PRE;
        } else if (this.lastTime >= 0) {
            return EventType.NONE;
        }

        this.currentPlayer.clearButton();

        if (this.receive) {
            room.addEventTips("【" + this.currentPlayer.account + "】选择接收情报")
            return EventType.REMOVE_AND_NEXT;
        }
        return EventType.REMOVE;
    }

    prv(room: Room): void {
        this.sendClientInfo(room, this.currentPlayer);

        CardManager.judgeCardEvent(room, this.intelligenceCard, CardManager._5_1_WaitingPlayerReceive_before_card_array);

        if (this.currentPlayer.ai) {
            this.lastTime = 0;
            this.receive = false;
        }
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
                allTipsHideEvent: true,
                myTips: "请选择是否接收左上角展示的情报",
            }

            room.updateTime(data);
        }

        this.lastTime -= GAME_CONFIG.GAME_FRAME_TIME;
    }

    nextEvent(room: Room): Event {
        return new _5_2_PlayerReceive(this.fatherEvent, this.currentPlayer, this.intelligenceCard);
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
        this.receive = receive;
        this.lastTime = 0;
    }

}