import {Player} from "../../../model/Player";
import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {GAME_CONFIG} from "../../../util/Constant";
import {_5_2_PlayerReceive} from "./_5_2_PlayerReceive";
import {Card} from "../../../model/Card";

export class _5_1_WaitingPlayerReceive implements Event {
    private static readonly SEND_BUTTON_INFO = {
        buttonArray: [
            {classType: "success", root: "game/receiveIntelligence", name: "接收",},
            {classType: "cancel", root: "game/refuseIntelligence", name: "拒绝",},
        ]
    }

    private readonly currentPlayer: Player;
    private readonly intelligenceCard: Card;

    private receive: boolean | undefined;

    private lastTime = GAME_CONFIG.ROUND_ALL_TIME;

    constructor(currentPlayer: Player, intelligenceCard: Card) {
        this.currentPlayer = currentPlayer;
        this.intelligenceCard = intelligenceCard;
    }

    getEffectType(room: Room): EventType {
        if (this.receive != undefined) {
            this.lastTime = 0;
        }

        if (this.lastTime === GAME_CONFIG.ROUND_ALL_TIME) {
            this.sendClientInfo(room, this.currentPlayer);
        }

        this.lastTime -= GAME_CONFIG.GAME_FRAME_TIME;

        let data = {
            account: this.currentPlayer.account,
            time: this.lastTime,
            allTime: GAME_CONFIG.ROUND_ALL_TIME,
            allTips: this.currentPlayer.account + "的犹豫接收阶段",
            myTips: "请选择是否接收左上角展示的情报",
        }

        room.broadcast("roomEvent/updateTime", data);

        if (this.lastTime > 0) {
            return EventType.NONE;
        }

        this.currentPlayer.send("roomEvent/clearButton");

        if (this.receive) {
            return EventType.REMOVE_AND_NEXT;
        }
        return EventType.REMOVE;
    }

    prv(room: Room): void {
        throw new Error("Method not implemented.");
    }

    doEvent(room: Room): void {
    }

    over(room: Room): void {
        throw new Error("Method not implemented.");
    }

    nextEvent(room: Room): Event {
        return new _5_2_PlayerReceive(this.currentPlayer, this.intelligenceCard);
    }

    sendClientInfo(room: Room, player: Player): void {
        if (player != this.currentPlayer) {
            return;
        }
        player.send("roomEvent/showButton", _5_1_WaitingPlayerReceive.SEND_BUTTON_INFO);
    }

    getEventPlayer(): Player | undefined {
        return this.currentPlayer;
    }

    setIsReceive(player: Player, receive: boolean) {
        if (player != this.currentPlayer || this.receive != undefined) {
            return;
        }
        this.receive = receive;
    }

}