export class Card {
    private _allId: string = "";
    private _cardId: string;
    private _color: string;
    private _direction: string;
    private _operation: string;
    private _lock: boolean;

    //需要初始化的数据
    private _hand = true;//是否是手牌
    private _clientOperation: string | undefined;
    private _clientDirection: string | undefined;

    constructor(data: any) {
        this._cardId = data.id;
        this._color = data.color;
        this._direction = data.dir;
        this._operation = data.ope;
        this._lock = !!data.lock;
    }

    public getSelfCardInfo() {
        return {
            allId: this._allId,
            cardId: this._cardId,
            color: this._color,
            direction: this._direction,
            operation: this._operation,
            lock: this._lock,

            hand: this._hand,
        };
    }

    public getOtherCardInfo() {
        return {
            allId: this._allId,
            cardId: this._cardId,
            color: this._color,
            direction: this._direction,
            operation: this._operation,
            lock: this._lock,

            hand: this._hand,
        };
    }

    get allId(): string {
        return this._allId;
    }

    set allId(value: string) {
        this._allId = value;
    }

    get cardId(): string {
        return this._cardId;
    }

    get color(): string {
        return this._color;
    }

    get direction(): string {
        return this._direction;
    }

    get operation(): string {
        return this._operation;
    }

    get lock(): boolean {
        return this._lock;
    }

    get hand(): boolean {
        return this._hand;
    }

    set hand(value: boolean) {
        this._hand = value;
    }
}