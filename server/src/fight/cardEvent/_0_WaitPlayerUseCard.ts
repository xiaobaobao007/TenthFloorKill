import {Room} from "../../model/Room";
import {Event} from "../Event";
import {EventType} from "../EventType";
import {Player} from "../../model/Player";
import {Card} from "../../model/Card";
import {CARD_NAME, GAME_CONFIG} from "../../util/Constant";
import {InitManager} from "../../manager/InitManager";
import {_5_IntelligenceCircle} from "../normalEvent/_0_base/_5_IntelligenceCircle";
import {_1_PlayerUseCardSuccess} from "./_1_PlayerUseCardSuccess";
import {CardManager} from "../../manager/CardManager";
import {ROUTER} from "../../util/SocketUtil";

export class _0_WaitPlayerUseCard implements Event {
    private static readonly SEND_BUTTON_INFO = {
        buttonArray: [
            {classType: "submit", needCardNum: 1, root: "game/useCard", name: "使用",},
            {classType: "cancel", root: "game/skipUseCard", name: "不使用",},
        ]
    }

    private readonly fatherEvent: _5_IntelligenceCircle;
    private readonly playerArray: Player[];
    private readonly eventCard: Card;
    private readonly cardId: string;
    private readonly cardName: string;
    private readonly cardEventArray: string[];

    private skipPlayerArray: Player[] = [];//跳过使用
    private player: Player | undefined;//谁使用了卡牌
    private useCard: Card | undefined;//使用了什么卡牌

    private lastTime = GAME_CONFIG._0_WaitPlayerUseCard_TIME;

    constructor(fatherEvent: _5_IntelligenceCircle, playerArray: Player[], eventCard: Card, cardId: string, cardEventArray: string[]) {
        this.fatherEvent = fatherEvent;
        this.playerArray = playerArray;
        this.eventCard = eventCard;
        this.cardId = cardId;
        this.cardName = InitManager.getStringValue(cardId + CARD_NAME)!;
        this.cardEventArray = cardEventArray;
    }

    getEffectType(room: Room): EventType {
        if (this.lastTime === GAME_CONFIG._4_SendIntelligence_TIME) {
            return EventType.PRE;
        } else if (this.lastTime >= 0) {
            return EventType.NONE;
        } else {
            return EventType.REMOVE_AND_NEXT;
        }
    }

    prv(room: Room): void {
        this.sendClientInfo(room);
    }

    doEvent(room: Room): void {
        throw new Error("Method not implemented.");
    }

    frameOver(room: Room): void {
        if (this.lastTime % GAME_CONFIG.UPDATE_PLAYER_TIME == 0) {
            let data = {
                time: this.lastTime,
                allTime: GAME_CONFIG._0_WaitPlayerUseCard_TIME,
                allTips: "某人正在思考是否使用【" + this.cardName + "】",
                myTips: "",
            };

            for (let player of room.playerArray) {
                if (this.playerArray.includes(player) && !this.skipPlayerArray.includes(player)) {
                    data.myTips = "请选择1张【" + this.cardName + "】卡牌使用";
                } else {
                    data.myTips = "其他玩家正在思考是否使用【" + this.cardName + "】";
                }
                player.send(ROUTER.roomEvent.UPDATE_TIME, data);
            }
        }

        this.lastTime -= GAME_CONFIG.GAME_FRAME_TIME;
    }

    nextEvent(room: Room): undefined {
        if (this.player) {
            this.player.removeCard(this.useCard!, true);
            let event = new _1_PlayerUseCardSuccess(this.player, this.useCard!, this.eventCard);
            event.sendClientInfo(room, this.player);
            this.fatherEvent.addSuccessRoundEvent(event);
            CardManager.judgeCardEvent(room, this.fatherEvent, this.eventCard, this.cardEventArray);
        }
        return;
    }

    sendClientInfo(room: Room): void {
        for (let player of room.playerArray) {
            if (this.playerArray.includes(player) && player.haveCardByCardId(this.cardId)) {
                player.showButton(_0_WaitPlayerUseCard.SEND_BUTTON_INFO);
            } else {
                player.clearButton();
            }
        }
    }

    use(player: Player, useCard: Card) {
        if (!this.playerArray.includes(player) || this.player != undefined || this.skipPlayerArray.includes(player)) {
            return;
        }

        if (useCard.cardId != this.cardId) {
            player.sendTips("请选择1张【" + this.cardName + "】卡牌使用");
            return;
        }

        this.player = player;
        this.useCard = useCard;
        this.lastTime = 0;
    }

    skip(player: Player) {
        if (!this.playerArray.includes(player) || this.player != undefined || this.skipPlayerArray.includes(player)) {
            return;
        }
        this.skipPlayerArray.push(player);
        if (this.skipPlayerArray.length >= this.playerArray.length) {
            this.lastTime = 0;
        }
        player.clearButton();
    }
}