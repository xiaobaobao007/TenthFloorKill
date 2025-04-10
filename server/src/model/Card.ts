export class Card {
    private _allId: string;
    private _cardId: string;
    private _color: string;
    private _direction: string;
    private _operation: string;

    private _data: any;

    constructor(index: number, data: any) {
        this._data = data;

        this._cardId = data.id;
        this._color = data.color;
        this._direction = data.dir;
        this._operation = data.ope;

        this._allId = index
            + "#" + this._cardId
            + "#" + this._color
            + "#" + this._direction
            + "#" + this._operation;
    }

    get allId(): string {
        return this._allId;
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

    get data(): any {
        return this._data;
    }
}