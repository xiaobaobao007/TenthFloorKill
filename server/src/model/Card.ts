export class Card {
    private _allId: string;
    private cardId: string;
    private color: string;
    private direction: string;
    private operation: string;

    private _data: any;

    constructor(index: number, data: any) {
        this._data = data;

        this.cardId = data.id;
        this.color = data.color;
        this.direction = data.dir;
        this.operation = data.ope;

        this._allId = index
            + "#" + this.cardId
            + "#" + this.color
            + "#" + this.direction
            + "#" + this.operation;
    }

    get allId(): string {
        return this._allId;
    }

    get data(): any {
        return this._data;
    }
}