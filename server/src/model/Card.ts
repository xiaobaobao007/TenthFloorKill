import {OPERATION_WEN_BEN} from "../util/Constant";
import {Player} from "./Player";

export class Card {
    public readonly cardId: string;
    public readonly color: string;
    public readonly direction: string;
    public readonly operation: string;
    public readonly lock: boolean;

    //需要初始化的数据
    protected _allId: string = "";//房间内卡牌的唯一id
    protected _hand = true;//是否是手牌
    protected _clientOperation: string | undefined;//客户端选择的情报传递方式
    protected _belong: Player | undefined;//这是谁的牌
    protected _showAll = false;//是否被翻为正面

    constructor(cardId: string, color: string, direction: string, operation: string, lock: boolean) {
        this.cardId = cardId;
        this.color = color;
        this.direction = direction;
        this.operation = operation;
        this.lock = lock;
    }

    public init(allId: string, belong: Player) {
        this._allId = allId;

        this._hand = true;
        this._clientOperation = undefined;
        this._belong = belong;
        this._showAll = false;
    }

    public getSelfCardInfo() {
        return {
            allId: this._allId,
            cardId: this.cardId,
            color: this.color,
            direction: this.direction,
            operation: this.operation,
            lock: this.lock,
            belong: this._hand ? undefined : this._belong?.account,
        };
    }

    public getOtherCardInfo(): any {
        if (this._showAll || this.operation == OPERATION_WEN_BEN || this.clientOperation == OPERATION_WEN_BEN) {
            return this.getSelfCardInfo();
        }

        return {
            allId: this._allId,
            direction: this.direction,
            operation: this._clientOperation ? this._clientOperation : this.operation,
            belong: this._belong?.account,
        };
    }

    public doEvent() {
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
}