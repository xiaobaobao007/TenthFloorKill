import {Player} from "../../../model/Player";
import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {GAME_CONFIG} from "../../../util/Constant";
import {Card} from "../../../model/Card";
import {AIManager} from "../../../manager/AIManager";

export class _7_DiscardEvent implements Event {
    private readonly currentPlayer: Player;
    public readonly discardNum: number;

    private lastTime = GAME_CONFIG._6_PlayerRoundEnd_TIME;

    private deleteCardArray: Card[] | undefined;

    constructor(currentPlayer: Player, discardNum: number) {
        this.currentPlayer = currentPlayer;
        this.discardNum = discardNum;
    }

    getEffectType(room: Room): EventType {
        if (this.lastTime === GAME_CONFIG._6_PlayerRoundEnd_TIME) {
            return EventType.PRE;
        } else if (this.lastTime >= 0) {
            return EventType.NONE;
        } else {
            if (this.deleteCardArray == undefined || this.deleteCardArray.length < this.discardNum) {
                AIManager._7_DiscardEvent(this.currentPlayer, this);
            }

            for (let i = this.discardNum - 1; i >= 0; i--) {
                this.currentPlayer.removeCard(this.deleteCardArray![i], true);
            }

            room.addEventTips("【" + this.currentPlayer.account + "】丢弃了【" + this.discardNum + "】张手牌");
            this.currentPlayer.clearButton();
            return EventType.REMOVE;
        }
    }

    prv(room: Room): void {
        if (this.currentPlayer.ai) {
            this.lastTime = -1;
        } else {
            this.sendClientInfo(room, this.currentPlayer);
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
                allTime: GAME_CONFIG._6_PlayerRoundEnd_TIME,
                allTips: "【" + this.currentPlayer.account + "】正在弃牌",
                myTips: "弃牌阶段，请弃掉" + this.discardNum + "张手牌",
            });
        }

        this.lastTime -= GAME_CONFIG.GAME_FRAME_TIME;
    }

    nextEvent(room: Room): Event {
        throw new Error("Method not implemented.");
    }

    sendClientInfo(room: Room, player: Player): void {
        if (!player || (player && player != this.currentPlayer)) {
            return;
        }

        this.currentPlayer.showButton({
            buttonArray: [{classType: "submit", needCardNum: this.discardNum, root: "game/disCard", name: "弃掉"}]
        });
    }

    setDeleteCardArray(cardArray: Card[]): void {
        this.deleteCardArray = cardArray;
        if (this.deleteCardArray.length < this.discardNum) {
            this.sendClientInfo(this.currentPlayer.room!, this.currentPlayer);
        } else {
            this.lastTime = 0;
        }
    }
}