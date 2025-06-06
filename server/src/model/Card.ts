import {_CARD_NAME, COLOR_DOUBLE, COLOR_GREY, OPERATION_WEN_BEN, OPERATION_ZHI_DA} from "../util/Constant";
import {Player} from "./Player";
import {InitManager} from "../manager/InitManager";
import {GameError} from "../exception/GameError";

export class Card {
    public static CARD_SHOW_ALL: number = 1;
    public static CARD_SHOW_NAME: number = 2;
    public static CARD_INTELLIGENCE: number = 3;

    public readonly cardId: string;
    public readonly color: string;
    public readonly direction: string;
    public readonly operation: string;
    public readonly lock: boolean;
    public readonly otherTips: string;

    //需要初始化的数据
    private _cardIndex: number = 0;//牌库的唯一id
    protected _allId: string = "";//房间内卡牌的唯一id
    protected _belong: Player | undefined;//这是谁的牌，注意在情报区不一定是属于的自己，但手牌一定是自己的
    protected _hand = true;//是否是手牌
    protected _clientOperation: string | undefined;//客户端选择的情报传递方式
    protected _show: boolean = false;//是否翻为正面

    constructor(cardId: string, color: string, direction: string, operation: string, lock: boolean, otherTips: string = "") {
        this.cardId = cardId;
        this.color = color;
        this.direction = direction;
        this.operation = operation;
        this.lock = lock;
        this.otherTips = otherTips;
    }

    public init(cardIndex: number, allId: string, belong: Player) {
        this._cardIndex = cardIndex;
        this._allId = allId;
        this._belong = belong;

        this._hand = true;
        this._clientOperation = undefined;
        this._show = false;
    }

    public getCardInfo(showStatus = Card.CARD_SHOW_ALL) {
        if (showStatus === Card.CARD_SHOW_NAME) {
            return {
                cardId: this.cardId,
                lock: this.lock,
                belong: this._belong?.account,
            };
        } else if (showStatus === Card.CARD_SHOW_ALL) {
            return {
                allId: this._allId,
                cardId: this.cardId,
                color: this.color,
                direction: this.direction,
                operation: this._clientOperation ? this._clientOperation : this.operation,
                lock: this.lock,
                belong: this._belong?.account,
                otherTips: this.otherTips,
            };
        } else if (showStatus === Card.CARD_INTELLIGENCE) {
            return {
                allId: this._allId,
                direction: this.direction,
                operation: this._clientOperation ? this._clientOperation : this.operation,
                belong: this._belong?.account,
            };
        }
        throw new GameError("未知的查看方式:" + showStatus);
    }

    canUse(toCard: Card | undefined, toPlayer: Player | undefined = undefined): boolean {
        return true;
    }

    sendClientInfo(eventCard: Card | undefined, eventPlayer: Player | undefined = undefined) {
    }

    doEvent(eventCard: Card | undefined, eventPlayer: Player | undefined = undefined, param: string | undefined) {
    }

    /**
     * @param receivePlayer 接收了情报之后
     */
    receiveIntelligenceAfter(receivePlayer: Player) {
    }

    //当前卡牌是否是正面
    isShow() {
        return this._show || this.operation == OPERATION_WEN_BEN || this.clientOperation == OPERATION_WEN_BEN;
    }

    isZhiDa(): boolean {
        return this.operation == OPERATION_ZHI_DA || this.clientOperation == OPERATION_ZHI_DA;
    }

    getName() {
        return InitManager.getStringValue(this.cardId + _CARD_NAME);
    }

    canShaoHui() {
        return this.color == COLOR_GREY && !this.lock;
    }

    isSameColor(color: string) {
        if (this.color == COLOR_DOUBLE) {
            return color != COLOR_GREY;
        } else {
            return color == this.color;
        }
    }

    get allId(): string {
        return this._allId;
    }

    set allId(value: string) {
        this._allId = value;
    }

    get hand(): boolean {
        return this._hand;
    }

    set hand(value: boolean) {
        this._hand = value;
    }

    get clientOperation(): string | undefined {
        return this._clientOperation;
    }

    set clientOperation(value: string | undefined) {
        this._clientOperation = value;
    }

    get belong(): Player | undefined {
        return this._belong;
    }

    set belong(value: Player | undefined) {
        this._belong = value;
    }

    get cardIndex(): number {
        return this._cardIndex;
    }
}