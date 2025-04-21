import {OPERATION_WEN_BEN} from "../util/Constant";
import {Player} from "./Player";

export class Card {
    private _allId: string = "";
    public readonly cardId: string;
    public readonly color: string;
    public readonly direction: string;
    public readonly operation: string;
    public readonly lock: boolean;

    //需要初始化的数据
    private _hand = true;//是否是手牌
    private _clientOperation: string | undefined;//客户端选择的情报传递方式
    private belong: Player | undefined;//这是谁的牌

    constructor(data: any) {
        this.cardId = data.id;
        this.color = data.color;
        this.direction = data.dir;
        this.operation = data.ope;
        this.lock = !!data.lock;
    }

    public init(allId: string, belong: Player) {
        this._allId = allId;
        this.belong = belong;
    }

    public getSelfCardInfo() {
        return {
            allId: this._allId,
            cardId: this.cardId,
            color: this.color,
            direction: this.direction,
            operation: this.operation,
            lock: this.lock,
            belong: this._hand ? undefined : this.belong?.account,
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
            belong: this.belong?.account,
        };
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
}