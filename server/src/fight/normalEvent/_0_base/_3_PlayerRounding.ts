import {Player} from "../../../model/Player";
import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {GAME_CONFIG} from "../../../util/Constant";
import {_4_SendIntelligence} from "./_4_SendIntelligence";

export class _3_PlayerRounding implements Event {
    private static readonly SEND_BUTTON_INFO = {
        buttonArray: [
            // {classType: "submit", needCardNum: 1, root: "", name: "出牌",},
            // {classType: "cancel", root: "game/end3to_4_SendIntelligence", name: "结束出牌",},

            {classType: "success", needCardNum: 0, root: "game/end3to_4_SendIntelligence", name: "结束出牌",},
        ]
    }

    private readonly currentPlayer: Player;
    private lastTime = GAME_CONFIG._3_PlayerRounding_TIME;

    constructor(currentPlayer: Player) {
        this.currentPlayer = currentPlayer;
    }

    getEffectType(room: Room): EventType {
        if (this.lastTime === GAME_CONFIG._3_PlayerRounding_TIME) {
            return EventType.PRE;
        } else if (this.lastTime >= 0) {
            return EventType.EFFECT;
        } else {
            return EventType.REMOVE_AND_NEXT;
        }
    }

    prv(room: Room): void {
        this.sendClientInfo(room, this.currentPlayer);

        if (this.currentPlayer.ai) {
            this.lastTime = 0;
        }
    }

    doEvent(room: Room): void {
        let data = {
            account: this.currentPlayer.account,
            time: this.lastTime,
            allTime: GAME_CONFIG._3_PlayerRounding_TIME,
            allTips: this.currentPlayer.account + "出牌阶段",
            // myTips: "请选择1张卡牌",
            myTips: "请直接点击【结束出牌】，卡牌效果暂时还未实现",
        };

        room.broadcast("roomEvent/updateTime", data);
    }

    frameOver(room: Room): void {
        this.lastTime -= GAME_CONFIG.GAME_FRAME_TIME;
    }

    nextEvent(room: Room): Event {
        this.currentPlayer.send("roomEvent/clearButton");
        return new _4_SendIntelligence(this.currentPlayer);
    }

    sendClientInfo(room: Room, player: Player): void {
        if (player != this.currentPlayer) {
            return;
        }
        player.send("roomEvent/showButton", _3_PlayerRounding.SEND_BUTTON_INFO);
    }

    end3to_4_SendIntelligence(player: Player): void {
        if (player == this.currentPlayer) {
            this.lastTime = 0;
        }
    }
}