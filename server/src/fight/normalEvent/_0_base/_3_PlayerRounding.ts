import {Player} from "../../../model/Player";
import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {CARD_MI_MI_XIA_DA, GAME_CONFIG} from "../../../util/Constant";
import {_4_SendIntelligence} from "./_4_SendIntelligence";
import {CardManager} from "../../../manager/CardManager";

export class _3_PlayerRounding implements Event {
    private static readonly SEND_BUTTON_INFO = {
        buttonArray: [
            {classType: "submit", needCardNum: 1, isRounding: true, root: "game/roundUseCard", name: "出牌",},
            {classType: "cancel", needCardNum: 0, root: "game/end3to_4_SendIntelligence", name: "结束出牌",},
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
            return EventType.NONE;
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
        throw new Error("Method not implemented.");
    }

    frameOver(room: Room): void {
        if (this.lastTime % GAME_CONFIG.UPDATE_PLAYER_TIME == 0) {
            let data = {
                account: this.currentPlayer.account,
                time: this.lastTime,
                allTime: GAME_CONFIG._3_PlayerRounding_TIME,
                allTips: "【" + this.currentPlayer.account + "】的出牌阶段",
                myTips: "请选择1张卡牌使用",
            };

            room.updateTime(data);
        }

        this.lastTime -= GAME_CONFIG.GAME_FRAME_TIME;
    }

    nextEvent(room: Room): undefined {
        this.currentPlayer.clearButton();
        room.eventStack.push(new _4_SendIntelligence(this.currentPlayer));
        CardManager.judgeCardEvent(room, undefined, [CARD_MI_MI_XIA_DA]);
        return;
    }

    sendClientInfo(room: Room, player: Player): void {
        if (player && player != this.currentPlayer) {
            return;
        }
        this.currentPlayer.showButton(_3_PlayerRounding.SEND_BUTTON_INFO);
    }

    end3to_4_SendIntelligence(player: Player): void {
        if (player == this.currentPlayer) {
            this.lastTime = 0;
        }
    }
}