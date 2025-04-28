import {Player} from "../../../model/Player";
import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {CARD_DIAO_BAO, CARD_DIAO_HU_LI_SHAN, CARD_JIE_HUO, CARD_PO_YI, CARD_ZHUAN_YI, GAME_CONFIG} from "../../../util/Constant";
import {_5_2_PlayerReceive} from "./_5_2_PlayerReceive";
import {Card} from "../../../model/Card";
import {CardManager} from "../../../manager/CardManager";

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
            if (this.currentPlayer.inRounding) {
                if (CardManager.judgeCardEvent(room, this.intelligenceCard, [CARD_PO_YI, CARD_DIAO_BAO, CARD_ZHUAN_YI])) {
                    return EventType.NONE;
                }
            } else if (CardManager.judgeCardEvent(room, this.intelligenceCard, [CARD_PO_YI, CARD_ZHUAN_YI])) {
                return EventType.NONE;
            }
            return EventType.PRE;
        } else if (this.lastTime >= 0) {
            return EventType.NONE;
        }

        this.currentPlayer.clearButton();

        if (this.receive) {
            room.addEventTips("【" + this.currentPlayer.account + "】选择接收情报")

            if (CardManager.judgeCardEvent(room, this.intelligenceCard, [CARD_JIE_HUO, CARD_DIAO_HU_LI_SHAN])) {
                return EventType.NONE;
            }

            return EventType.REMOVE_AND_NEXT;
        }
        return EventType.REMOVE;
    }

    prv(room: Room): void {
        this.sendClientInfo(room, this.currentPlayer);

        if (this.sendPlayer == this.currentPlayer || this.currentPlayer.ai) {
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
                myTips: "请选择是否接收左上角展示的情报",
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
        this.receive = receive;
        this.lastTime = 0;
    }

    getIntelligenceCard() {
        return this.intelligenceCard;
    }

}