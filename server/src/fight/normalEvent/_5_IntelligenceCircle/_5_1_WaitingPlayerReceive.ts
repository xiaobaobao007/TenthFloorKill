import {Player} from "../../../model/Player";
import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {GAME_CONFIG} from "../../../util/Constant";
import {_5_2_PlayerReceive} from "./_5_2_PlayerReceive";
import {Card} from "../../../model/Card";
import {_5_IntelligenceCircle} from "../_0_base/_5_IntelligenceCircle";

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

    private receive: boolean | undefined;

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
            return EventType.EFFECT;
        }

        this.currentPlayer.send("roomEvent/clearButton");

        if (this.receive) {
            return EventType.REMOVE_AND_NEXT;
        }
        return EventType.REMOVE;
    }

    prv(room: Room): void {
        this.sendClientInfo(room, this.currentPlayer);

        if (this.currentPlayer.ai) {
            this.lastTime = 0;
            this.receive = false;
        }
    }

    doEvent(room: Room): void {
        let data = {
            account: this.currentPlayer.account,
            time: this.lastTime,
            allTime: GAME_CONFIG._5_1_WaitingPlayerReceive_TIME,
            allTips: this.currentPlayer.account + "考虑" + this.sendPlayer.account + "接收阶段",
            myTips: "请选择是否接收左上角展示的情报",
        }

        room.broadcast("roomEvent/updateTime", data);
    }

    frameOver(room: Room): void {
        this.lastTime -= GAME_CONFIG.GAME_FRAME_TIME;
    }

    nextEvent(room: Room): Event {
        return new _5_2_PlayerReceive(this.fatherEvent, this.currentPlayer, this.intelligenceCard);
    }

    sendClientInfo(room: Room, player: Player): void {
        if (player != this.currentPlayer) {
            return;
        }
        player.showButton(_5_1_WaitingPlayerReceive.SEND_BUTTON_INFO);
    }

    setIsReceive(player: Player, receive: boolean) {
        if (player != this.currentPlayer || this.receive != undefined) {
            return;
        }
        this.receive = receive;
        this.lastTime = 0;
    }

}