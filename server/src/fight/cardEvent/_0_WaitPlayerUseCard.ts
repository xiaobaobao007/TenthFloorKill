import {Room} from "../../model/Room";
import {Event} from "../Event";
import {EventType} from "../EventType";
import {Player} from "../../model/Player";
import {Card} from "../../model/Card";
import {_CARD_NAME, GAME_CONFIG} from "../../util/Constant";
import {InitManager} from "../../manager/InitManager";
import {_1_PlayerUseCardSuccess} from "./_1_PlayerUseCardSuccess";
import {CardManager} from "../../manager/CardManager";
import {ROUTER} from "../../util/SocketUtil";
import {EventManager} from "../../manager/EventManager";
import {_0_GameStartEvent} from "../normalEvent/_0_base/_0_GameStartEvent";

export class _0_WaitPlayerUseCard implements Event {
    private static readonly SEND_BUTTON_INFO = {
        buttonArray: [
            {classType: "submit", needCardNum: 1, root: "game/useCard", name: "使用",},
            {classType: "cancel", root: "game/skipUseCard", name: "不使用",},
        ]
    }

    private readonly playerArray: Player[];
    private readonly eventCard: Card;
    private readonly cardId: string;
    private readonly cardName: string;
    private readonly eventArray: string[];
    private readonly eventIndex: number;

    private skipPlayerArray: Player[] = [];//跳过使用

    private player: Player | undefined;//谁使用了卡牌
    private useCard: Card | undefined;//使用了什么卡牌

    private canAskShiPo = true;
    private lastTime = GAME_CONFIG._0_WaitPlayerUseCard_TIME;

    constructor(playerArray: Player[], eventCard: Card, cardId: string, eventArray: string[] = [], eventIndex: number = 0) {
        this.playerArray = playerArray;
        this.eventCard = eventCard;
        this.cardId = cardId;
        this.cardName = InitManager.getStringValue(cardId + _CARD_NAME)!;
        this.eventArray = eventArray;
        this.eventIndex = eventIndex;
    }

    getEffectType(room: Room): EventType {
        if (this.lastTime === GAME_CONFIG._4_SendIntelligence_TIME) {
            return EventType.PRE;
        } else if (this.lastTime >= 0) {
            return EventType.NONE;
        } else if (!this.player) {
            return EventType.REMOVE;
        } else {
            //等待识破
            if (this.canAskShiPo && CardManager.judgeCardEvent(room, this.useCard!, CardManager.WAIT_SHI_PO)) {
                this.canAskShiPo = false;
                return EventType.NONE;
            }
            //使用成功
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
            const fatherEvent = EventManager.getEvent(this.player.room!, _0_GameStartEvent.name) as _0_GameStartEvent;
            const currentEvent = fatherEvent.roundEvent.peek();
            currentEvent?.sendClientInfo(room, this.player);
        }
        CardManager.judgeCardEvent(room, this.eventCard, this.eventArray, this.eventIndex + 1);
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

    use(player: Player, useCard: Card, targetPlayer: Player | undefined = undefined) {
        if (!this.playerArray.includes(player) || this.player != undefined || this.skipPlayerArray.includes(player)) {
            return;
        }

        if (useCard.cardId != this.cardId) {
            player.sendTips("请选择1张【" + this.cardName + "】卡牌使用");
            this.sendClientInfo(player.room!);
            return;
        }

        this.player = player;
        this.useCard = useCard;

        if (targetPlayer) {
            this.lastTime = -1;
        } else {
            this.lastTime = 0;
        }

        this.player.removeCard(this.useCard!, true);

        const fatherEvent = EventManager.getEvent(player.room!, _0_GameStartEvent.name) as _0_GameStartEvent;
        fatherEvent.roundEvent.push(new _1_PlayerUseCardSuccess(this.player, this.useCard!, targetPlayer, this.eventCard));

        player.room!.addEventTips("【" + player.account + "】使用了一张【" + this.cardName + "】");
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