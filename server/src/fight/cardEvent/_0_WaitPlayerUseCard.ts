import {Room} from "../../model/Room";
import {Event} from "../Event";
import {EventType} from "../EventType";
import {Player} from "../../model/Player";
import {Card} from "../../model/Card";
import {_CARD_NAME, CARD_MI_MI_XIA_DA, CARD_SHI_PO, COLOR_BLUE, COLOR_GREY, COLOR_RED, GAME_CONFIG} from "../../util/Constant";
import {InitManager} from "../../manager/InitManager";
import {_1_PlayerUseCardSuccess} from "./_1_PlayerUseCardSuccess";
import {CardManager} from "../../manager/CardManager";
import {ROUTER} from "../../util/SocketUtil";
import {EventManager} from "../../manager/EventManager";
import {_0_GameStartEvent} from "../normalEvent/_0_base/_0_GameStartEvent";
import {ShiTan} from "../card/ShiTan";
import {PoYi} from "../card/PoYi";
import {MiMiXiaDa} from "../card/MiMiXiaDa";

export class _0_WaitPlayerUseCard implements Event {
    private static readonly SEND_BUTTON_INFO = {
        buttonArray: [
            {classType: "submit", needCardNum: 1, root: "game/useCard", name: "使用",},
            {classType: "cancel", root: "game/skipUseCard", name: "不使用",},
        ],
        moreSelect: {
            mmxd: [{name: "红色", value: COLOR_RED}, {name: "灰色", value: COLOR_GREY}, {name: "蓝色", value: COLOR_BLUE},]
        }
    }

    private readonly playerArray: Player[];
    private readonly eventCard: Card | undefined;
    private readonly _cardId: string;
    private readonly cardName: string;
    private readonly eventArray: string[];
    private readonly eventIndex: number;

    private skipPlayerArray: Player[] = [];//跳过使用

    private player!: Player;//谁使用了卡牌
    private useCard!: Card;//使用了什么卡牌
    private playerUseCardSuccess!: _1_PlayerUseCardSuccess;//卡牌事件

    private needRemove = false;
    private _canAskMiMiXiaDa = true;
    private canAskShiPo = true;
    private lastTime = GAME_CONFIG._0_WaitPlayerUseCard_TIME;

    constructor(playerArray: Player[], eventCard: Card | undefined, cardId: string, eventArray: string[] = [], eventIndex: number = 0) {
        this.playerArray = playerArray;
        this.eventCard = eventCard;
        this._cardId = cardId;
        this.cardName = InitManager.getStringValue(cardId + _CARD_NAME)!;
        this.eventArray = eventArray;
        this.eventIndex = eventIndex;
    }

    getEffectType(room: Room): EventType {
        if (this.lastTime === GAME_CONFIG._4_SendIntelligence_TIME) {
            return EventType.PRE;
        } else if (this.lastTime >= 0) {
            return EventType.NONE;
        } else if (!this.playerUseCardSuccess || this.needRemove) {
            return EventType.REMOVE;
        } else if (!this.playerUseCardSuccess.canEffect) {
            (EventManager.getEvent(this.player.room!, _0_GameStartEvent.name) as _0_GameStartEvent).roundEvent.remove(this.playerUseCardSuccess);
            return EventType.REMOVE;
        } else {
            //等待识破
            if (this.canAskShiPo && CardManager.judgeCardEvent(room, this.useCard!, [CARD_SHI_PO])) {
                this.canAskShiPo = false;
                return EventType.NONE;
            }

            if (this._canAskMiMiXiaDa && this.playerUseCardSuccess.canEffect && this.eventArray[0] == CARD_MI_MI_XIA_DA) {
                //秘密下达允许覆盖
                if (CardManager.judgeCardEvent(room, this.useCard!, [CARD_MI_MI_XIA_DA])) {
                    this._canAskMiMiXiaDa = false;
                    return EventType.NONE;
                }
            }

            //使用成功
            return EventType.NEXT;
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
        let canNext = this.eventArray[0] != CARD_SHI_PO && this.eventArray[0] != CARD_MI_MI_XIA_DA;

        if (this.playerUseCardSuccess) {
            this.playerUseCardSuccess.doCardEvent(room, this.player);

            const playerCard = this.playerUseCardSuccess.playerCard;
            if (!(playerCard instanceof PoYi || playerCard instanceof MiMiXiaDa)) {
                (EventManager.getEvent(this.player.room!, _0_GameStartEvent.name) as _0_GameStartEvent).roundEvent.remove(this.playerUseCardSuccess);
            }

            this.needRemove = true;

            if (canNext) {
                CardManager.judgeCardEvent(room, this.eventCard, this.eventArray, 0);
            }
        } else if (canNext) {
            if (this.eventArray.length <= this.eventIndex + 1) {
                this.needRemove = true;
            } else {
                CardManager.judgeCardEvent(room, this.eventCard, this.eventArray, this.eventIndex + 1);
            }
        }
        return;
    }

    sendClientInfo(room: Room): void {
        if (this.lastTime <= 0) {
            return;
        }

        for (let player of room.playerArray) {
            if (this.playerArray.includes(player) && player.haveCardByCardId(this._cardId)) {
                player.showButton(_0_WaitPlayerUseCard.SEND_BUTTON_INFO);
            } else {
                player.clearButton();
            }
        }
    }

    use(player: Player, useCard: Card, targetPlayer: Player | undefined = undefined): boolean {
        if (!this.playerArray.includes(player) || this.player != undefined || this.skipPlayerArray.includes(player)) {
            return false;
        }

        if (useCard.cardId != this._cardId) {
            player.sendTips("请选择1张【" + this.cardName + "】卡牌使用");
            this.sendClientInfo(player.room!);
            return false;
        }

        if (this.eventCard && !useCard.canUse(this.eventCard, targetPlayer)) {
            return false;
        }

        this.player = player;
        this.useCard = useCard;

        if (targetPlayer) {
            this.lastTime = -1;
        } else {
            this.lastTime = 0;
        }

        this.player.removeCard(this.useCard!, !(this.useCard instanceof ShiTan));

        const fatherEvent = EventManager.getEvent(player.room!, _0_GameStartEvent.name) as _0_GameStartEvent;
        this.playerUseCardSuccess = new _1_PlayerUseCardSuccess(this.useCard!, targetPlayer, this.eventCard);
        fatherEvent.roundEvent.push(this.playerUseCardSuccess);

        player.room!.addEventTips("【" + player.account + "】使用了一张【" + this.cardName + "】");

        return true;
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