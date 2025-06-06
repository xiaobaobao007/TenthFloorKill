import {Room} from "../../model/Room";
import {Event} from "../Event";
import {EventType} from "../EventType";
import {Player} from "../../model/Player";
import {Card} from "../../model/Card";
import {_CARD_NAME, CARD_MI_MI_XIA_DA, CARD_PO_YI, COLOR_BLUE, COLOR_GREY, COLOR_RED, GAME_CONFIG} from "../../util/Constant";
import {InitManager} from "../../manager/InitManager";
import {_1_PlayerUseCardSuccess} from "./_1_PlayerUseCardSuccess";
import {CardManager} from "../../manager/CardManager";
import {ROUTER} from "../../util/ServerWsUtil";
import {EventManager} from "../../manager/EventManager";
import {_0_GameStartEvent} from "../normalEvent/_0_base/_0_GameStartEvent";
import {ShiTan} from "../card/base/ShiTan";
import {SaveCard} from "../card/base/SaveCard";
import {LiJian} from "../card/LiJian";
import {MiMiXiaDa} from "../card/MiMiXiaDa";

export class _0_WaitPlayerUseCard implements Event {
    private static readonly SEND_BUTTON_INFO = {
        buttonArray: [
            {classType: "submit", needCardNum: 1, canUseCard: true, root: "game/useCard", name: "使用",},
            {classType: "cancel", root: "game/skipUseCard", name: "不使用",},
        ],
        moreSelect: {
            mmxd: [{name: "红色", value: COLOR_RED}, {name: "灰色", value: COLOR_GREY}, {name: "蓝色", value: COLOR_BLUE},]
        }
    }

    private readonly playerArray: Player[];
    private readonly _eventCard: Card | undefined;
    public readonly cardId: string;
    public readonly cardName: string;
    private readonly toPlayer: Player | undefined;
    private readonly eventArray: string[];
    private readonly eventIndex: number;

    private skipPlayerArray: Player[] = [];//跳过使用

    private player!: Player;//谁使用了卡牌
    private useCard!: Card;//使用了什么卡牌
    private _targetPlayer!: Player;//对谁使用了卡牌
    private playerUseCardSuccess!: _1_PlayerUseCardSuccess;//卡牌事件

    private lastTime = GAME_CONFIG._0_WaitPlayerUseCard_TIME;

    constructor(playerArray: Player[], eventCard: Card | undefined, cardId: string, toPlayer: Player | undefined = undefined, eventArray: string[] = [], eventIndex: number = 0) {
        this.playerArray = playerArray;
        this._eventCard = eventCard;
        this.cardId = cardId;
        this.cardName = InitManager.getStringValue(cardId + _CARD_NAME)!;
        this.toPlayer = toPlayer;
        this.eventArray = eventArray;
        this.eventIndex = eventIndex;
    }

    getEffectType(room: Room): EventType {
        if (this.lastTime === GAME_CONFIG._4_SendIntelligence_TIME) {
            return EventType.PRE;
        } else if (this.lastTime >= 0) {
            return EventType.NONE;
        }
        const gameStartEvent = EventManager.getEvent(room, _0_GameStartEvent.name) as _0_GameStartEvent;
        if (!this.playerUseCardSuccess) {
            if (this.eventIndex + 1 < this.eventArray.length) {
                CardManager.judgeCardEvent(room, this.useCard!, this.eventArray, this.eventIndex + 1);
            }
        } else if (!this.playerUseCardSuccess.canEffect) {
            gameStartEvent.roundEvent.remove(this.playerUseCardSuccess);
        } else {
            this.playerUseCardSuccess.doCardEvent(room, this._targetPlayer);
            const playerCard = this.playerUseCardSuccess.playerCard;
            if (!(playerCard instanceof SaveCard)) {
                gameStartEvent.roundEvent.remove(this.playerUseCardSuccess);
            }
        }
        return EventType.REMOVE;
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
                allTips: this.lastTime > 0 ? ("某人正在思考是否使用【" + this.cardName + "】") : "",
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
        throw new Error("Method not implemented.");
    }

    sendClientInfo(room: Room): void {
        if (this.lastTime <= 0) {
            return;
        }

        for (let player of room.playerArray) {
            if (this.playerArray.includes(player) && player.haveCardByCardId(this.cardId)) {
                player.showButton(_0_WaitPlayerUseCard.SEND_BUTTON_INFO);
            } else {
                player.clearButton();
            }
        }
    }

    use(player: Player, useCard: Card, targetPlayer: Player | undefined = undefined, inRounding: boolean = false): _1_PlayerUseCardSuccess | undefined {
        if (!this.playerArray.includes(player) || this.player != undefined || this.skipPlayerArray.includes(player)) {
            return;
        }

        if (this.toPlayer) {
            targetPlayer = this.toPlayer;
        }

        const room = player.room!;
        if (useCard.cardId != this.cardId) {
            player.sendTips("请选择1张【" + this.cardName + "】卡牌使用");
            this.sendClientInfo(room);
            return;
        }

        if (!targetPlayer) {
            targetPlayer = player;
        }

        if (this._eventCard && !useCard.canUse(this._eventCard, targetPlayer)) {
            return;
        }

        this.player = player;
        this.useCard = useCard;
        this._targetPlayer = targetPlayer;
        this.lastTime = 0;

        const isSpecialCard = this.useCard instanceof ShiTan || this.useCard instanceof MiMiXiaDa;
        this.player.removeCard(this.useCard!, !isSpecialCard, isSpecialCard ? Card.CARD_SHOW_NAME : Card.CARD_SHOW_ALL);

        const fatherEvent = EventManager.getEvent(room, _0_GameStartEvent.name) as _0_GameStartEvent;
        this.playerUseCardSuccess = new _1_PlayerUseCardSuccess(this.useCard!, targetPlayer, this._eventCard);

        fatherEvent.roundEvent.push(this.playerUseCardSuccess);

        if (inRounding) {
            room.eventStack.push(this);
        }

        if (this.eventArray[0] == CARD_MI_MI_XIA_DA || this.eventArray[0] == CARD_PO_YI || this.eventArray.length > 1) {
            CardManager.judgeCardEvent(room, this.useCard!, this.eventArray);
        }

        //判断作用目标是否需要离间
        LiJian.judgeLiJian(useCard);

        //询问识破
        if (!CardManager.judgeCardEvent(room, this.useCard!, CardManager.SHI_PO_EVENT) && this.eventArray[0] == CARD_PO_YI) {
            //破译立即生效
            this.playerUseCardSuccess.doCardEvent(room, player);
        }

        room.addEventTips("【" + player.account + "】对【" + targetPlayer.account + "】使用了【" + this.cardName + "】");

        let otherTips = InitManager.getStringValue(useCard.otherTips);
        if (otherTips) {
            const tips = "【" + this.cardName + "】的效果为【" + otherTips + "】";
            this.player.send(ROUTER.roomEvent.ADD_EVENT_TIPS, tips);
            if (this._targetPlayer && this._targetPlayer != this.player) {
                this._targetPlayer.send(ROUTER.roomEvent.ADD_EVENT_TIPS, tips);
            }
        }
        return this.playerUseCardSuccess;
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

    get eventCard(): Card | undefined {
        return this._eventCard;
    }

    set targetPlayer(value: Player) {
        this._targetPlayer = value;
    }
}