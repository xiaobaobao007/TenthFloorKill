import {Player} from "../../../model/Player";
import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {GAME_CONFIG} from "../../../util/Constant";
import {Card} from "../../../model/Card";
import {AIManager} from "../../../manager/AIManager";

export class _6_PlayerRoundEnd implements Event {
    private readonly currentPlayer: Player;
    private lastTime = GAME_CONFIG.ROUND_ALL_TIME;

    private deleteCardArray: Card[] | undefined;

    constructor(currentPlayer: Player) {
        this.currentPlayer = currentPlayer;
    }

    getEffectType(room: Room): EventType {
        const discardNumber = this.currentPlayer.handCardArray.length - GAME_CONFIG.MAX_CARD;
        if (discardNumber <= 0 || this.lastTime <= 0) {
            if (discardNumber > 0) {
                this.disCard();
                //下次事件再继续检测是否弃干净了
                return EventType.NONE;
            }

            this.currentPlayer.send("roomEvent/clearButton");
            room.broadcast("roomEvent/clearAllIntelligence");
            return EventType.REMOVE;
        }

        let data = {
            account: this.currentPlayer.account,
            time: this.lastTime,
            allTime: GAME_CONFIG.ROUND_ALL_TIME,
            allTips: this.currentPlayer.account + "的弃牌阶段",
            myTips: "弃牌阶段，请弃掉" + discardNumber + "张手牌",
        };

        room.broadcast("roomEvent/updateTime", data);

        if (this.lastTime === GAME_CONFIG.ROUND_ALL_TIME) {
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
        throw new Error("Method not implemented.");
    }

    sendClientInfo(room: Room, player: Player): void {
        if (player != this.currentPlayer) {
            return;
        }

        player.send("roomEvent/showButton", {
            buttonArray: [
                {classType: "submit", needCardNum: player.handCardArray.length - GAME_CONFIG.MAX_CARD, root: "game/disCard", name: "弃掉",},
            ]
        });
    }

    getEventPlayer(): Player | undefined {
        return this.currentPlayer;
    }

    setDeleteCardArray(cardArray: Card[]): void {
        this.deleteCardArray = cardArray;
    }

    private disCard() {
        const discardNumber = this.currentPlayer.handCardArray.length - GAME_CONFIG.MAX_CARD;
        if (discardNumber > 0 && (this.deleteCardArray == undefined || this.deleteCardArray.length < discardNumber)) {
            AIManager._6_PlayerRoundEnd(this.currentPlayer, this);
        }

        if (this.deleteCardArray == undefined) {
            return;
        }

        for (let i = Math.min(discardNumber, this.deleteCardArray.length) - 1; i >= 0; i--) {
            this.currentPlayer.removeCard(this.deleteCardArray[i]);
        }
    }
}