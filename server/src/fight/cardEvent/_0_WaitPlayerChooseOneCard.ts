import {Room} from "../../model/Room";
import {Event} from "../Event";
import {EventType} from "../EventType";
import {Player} from "../../model/Player";
import {GAME_CONFIG} from "../../util/Constant";
import {Card} from "../../model/Card";
import {ROUTER} from "../../util/ServerWsUtil";

export interface ChooseCardEvent {
    choose(toPlayer: Player, card: Card | undefined): void;
}

export class _0_WaitPlayerChooseOneCard implements Event {
    private readonly tips: string;
    private readonly buttonTips: string;
    private readonly chooseCardEvent: ChooseCardEvent;
    private readonly fromPlayer: Player;
    private readonly toPlayer: Player;
    public readonly chooseHandCard: boolean | undefined;

    private card: Card | undefined;
    private lastTime = GAME_CONFIG._3_PlayerRounding_TIME;

    constructor(tips: string, buttonTips: string, chooseCardEvent: ChooseCardEvent, fromPlayer: Player, toPlayer: Player, chooseHandCard: boolean | undefined) {
        this.tips = tips;
        this.buttonTips = buttonTips;
        this.chooseCardEvent = chooseCardEvent;
        this.fromPlayer = fromPlayer;
        this.toPlayer = toPlayer;
        this.chooseHandCard = chooseHandCard;
    }

    getEffectType(room: Room): EventType {
        if (this.lastTime === GAME_CONFIG._3_PlayerRounding_TIME) {
            return EventType.PRE;
        } else if (this.lastTime >= 0) {
            return EventType.NONE;
        } else {
            this.chooseCardEvent.choose(this.toPlayer, this.card);
            this.fromPlayer.send(ROUTER.roomEvent.HIDE_OTHER_PANEL);
            return EventType.REMOVE;
        }
    }

    prv(room: Room): void {
        this.sendClientInfo(room, this.fromPlayer);
        room.updateTime();
        if (this.toPlayer.ai) {
            this.lastTime = 0;
        }
    }

    doEvent(room: Room): void {
        throw new Error("Method not implemented.");
    }

    frameOver(room: Room): void {
        if (this.lastTime % GAME_CONFIG.UPDATE_PLAYER_TIME == 0) {
            if (this.chooseHandCard == undefined) {
                let data = {
                    account: this.fromPlayer.account,
                    time: this.lastTime,
                    allTime: GAME_CONFIG._3_PlayerRounding_TIME,
                    allTips: "【" + this.fromPlayer.account + "】正在查看【" + this.toPlayer.account + "】的手牌",
                    myTips: "请查看【" + this.toPlayer.account + "】的手牌",
                };
                room.updateTime(data);
            } else {
                let typeName = this.chooseHandCard ? "手牌" : "情报";
                let data = {
                    account: this.fromPlayer.account,
                    time: this.lastTime,
                    allTime: GAME_CONFIG._3_PlayerRounding_TIME,
                    allTips: "【" + this.fromPlayer.account + "】正在选择【" + this.toPlayer.account + "】一张" + typeName,
                    myTips: "在上方选择一张" + typeName,
                };
                room.updateTime(data);
            }
        }

        this.lastTime -= GAME_CONFIG.GAME_FRAME_TIME;
    }

    nextEvent(room: Room): Event | undefined {
        throw new Error("Method not implemented.");
    }

    sendClientInfo(room: Room, player: Player | undefined): void {
        if (player && player != this.fromPlayer) {
            return;
        }

        let cards: Card[];
        if (this.chooseHandCard || this.chooseHandCard == undefined) {
            cards = this.toPlayer.handCardArray;
        } else {
            cards = this.toPlayer.intelligenceCardArray;
        }

        let cardArray: any[] = [];
        cards.forEach(card => cardArray.push(card.getCardInfo()));

        this.fromPlayer.send(ROUTER.roomEvent.SHOW_OTHER_PANEL, {
            "tips": this.tips,
            "buttonTips": this.buttonTips,
            "cards": cardArray,
        });
    }

    clickChooseOtherCardButton(player: Player, cardId: string | undefined): boolean {
        if (this.fromPlayer != player) {
            return false;
        }

        if (this.chooseHandCard != undefined) {
            if (cardId == undefined) {
                player.sendTips("请选择一张牌");
                return false;
            }
            let card: Card | undefined = undefined;
            if (this.chooseHandCard) {
                card = this.toPlayer.findHandCardById(cardId);
            } else {
                card = this.toPlayer.findIntelligenceHandCardById(cardId);
            }

            if (!card) {
                player.sendTips("请选择一张正确的牌");
                return false;
            }

            if (card.hand != this.chooseHandCard) {
                return false;
            }

            this.card = card;
        }

        this.lastTime = 0;

        return true;
    }

}