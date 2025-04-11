export class Card {
    private _allId: string = "";
    private _cardId: string;
    private _color: string;
    private _direction: string;
    private _operation: string;

    private _hand = true;//是否是手牌

    constructor(index: number, data: any) {
        this._cardId = data.id;
        this._color = data.color;
        this._direction = data.dir;
        this._operation = data.ope;
    }

    public getClientInfo() {
        return {
            allId: this._allId,
            cardId: this._cardId,
            color: this._color,
            direction: this._direction,
            operation: this._operation,
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

    get hand(): boolean {
        return this._hand;
    }

    set hand(value: boolean) {
        this._hand = value;
    }
}