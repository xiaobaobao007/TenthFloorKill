import {Player} from "../../../model/Player";
import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {GAME_CONFIG} from "../../../util/Constant";
import {Card} from "../../../model/Card";
import {AIManager} from "../../../manager/AIManager";

export class _6_PlayerRoundEnd implements Event {
    private readonly currentPlayer: Player;
    private lastTime = GAME_CONFIG._6_PlayerRoundEnd_TIME;

    private deleteCardArray: Card[] | undefined;

    constructor(currentPlayer: Player) {
        this.currentPlayer = currentPlayer;
    }

    getEffectType(room: Room): EventType {
        if (!this.currentPlayer.live) {
            return EventType.REMOVE;
        }

        if (this.deleteCardArray != undefined) {
            this.disCard();
        }

        if (this.lastTime === GAME_CONFIG._6_PlayerRoundEnd_TIME) {
            return EventType.PRE;
        } else if (this.lastTime >= 0) {
            return EventType.NONE;
        } else {
            this.disCard();
            this.currentPlayer.clearButton();
            return EventType.REMOVE;
        }
    }

    prv(room: Room): void {
        const discardNumber = this.currentPlayer.handCardArray.length - GAME_CONFIG.MAX_CARD;

        if (discardNumber <= 0) {
            this.lastTime = 0;
            return;
        }

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
            const discardNumber = this.currentPlayer.handCardArray.length - GAME_CONFIG.MAX_CARD;

            room.updateTime({
                account: this.currentPlayer.account,
                time: this.lastTime,
                allTime: GAME_CONFIG._6_PlayerRoundEnd_TIME,
                allTips: "【" + this.currentPlayer.account + "】正在弃牌",
                myTips: "弃牌阶段，请弃掉" + discardNumber + "张手牌",
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

        let discardNumber = this.currentPlayer.handCardArray.length - GAME_CONFIG.MAX_CARD;
        this.currentPlayer.showButton({
            buttonArray: [{classType: "submit", needCardNum: discardNumber, root: "game/disCard", name: "弃掉"}]
        });
    }

    setDeleteCardArray(cardArray: Card[]): void {
        this.deleteCardArray = cardArray;
    }

    private disCard() {
        const discardNumber = this.currentPlayer.handCardArray.length - GAME_CONFIG.MAX_CARD;
        if (discardNumber <= 0) {
            return;
        }

        if ((this.deleteCardArray == undefined)) {
            AIManager._6_PlayerRoundEnd(this.currentPlayer, this);
        } else if (this.deleteCardArray.length < discardNumber) {
            if (this.lastTime < 0) {
                AIManager._6_PlayerRoundEnd(this.currentPlayer, this);
            } else {
                this.currentPlayer.sendTips("请选择" + discardNumber + "张卡牌进行丢弃");
                return;
            }
        }

        for (let i = Math.min(discardNumber, this.deleteCardArray!.length) - 1; i >= 0; i--) {
            this.currentPlayer.removeCard(this.deleteCardArray![i], true);
        }

        this.lastTime = 0;
    }
}