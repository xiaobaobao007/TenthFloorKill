import {_CARD_NAME, COLOR_GREY, OPERATION_WEN_BEN, OPERATION_ZHI_DA} from "../util/Constant";
import {Player} from "./Player";
import {InitManager} from "../manager/InitManager";

export class Card {
    public readonly cardId: string;
    public readonly color: string;
    public readonly direction: string;
    public readonly operation: string;
    public readonly lock: boolean;
    public readonly otherTips: string;

    //需要初始化的数据
    private _cardIndex: number = 0;//牌库的唯一id
    protected _allId: string = "";//房间内卡牌的唯一id
    protected _belong: Player | undefined;//这是谁的牌

    protected _hand = true;//是否是手牌
    protected _clientOperation: string | undefined;//客户端选择的情报传递方式

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
    }

    public getSelfCardInfo() {
        return {
            allId: this._allId,
            cardId: this.cardId,
            color: this.color,
            direction: this.direction,
            operation: this._clientOperation ? this._clientOperation : this.operation,
            lock: this.lock,
            belong: this._hand ? undefined : this._belong?.account,
            otherTips: this.otherTips,
        };
    }

    public getOtherCardInfo(): any {
        if (this.operation == OPERATION_WEN_BEN || this.clientOperation == OPERATION_WEN_BEN) {
            return this.getSelfCardInfo();
        }

        return {
            allId: this._allId,
            direction: this.direction,
            operation: this._clientOperation ? this._clientOperation : this.operation,
            belong: this._belong?.account,
        };
    }

    canUse(toCard: Card, toPlayer: Player | undefined = undefined): boolean {
        return true;
    }

    doEvent(eventCard: Card, eventPlayer: Player | undefined = undefined) {
    }

    //当前卡牌是否是正面
    isShow() {
        return this.operation == OPERATION_WEN_BEN || this.clientOperation == OPERATION_WEN_BEN;
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