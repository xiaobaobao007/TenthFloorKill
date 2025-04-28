import {Room} from "../../model/Room";
import {Event} from "../Event";
import {EventType} from "../EventType";
import {Player} from "../../model/Player";
import {Card} from "../../model/Card";

export class _1_PlayerUseCardSuccess implements Event {
    private readonly _playerCard: Card;
    private eventPlayer: Player | undefined;
    private readonly eventCard: Card | undefined;

    private _canEffect = true;//能否生效
    private _param: string | undefined;

    /**
     * @param playerCard 玩家使用了什么卡牌
     * @param eventPlayer
     * @param effectCard 对什么卡牌使用的
     */
    constructor(playerCard: Card, eventPlayer: Player | undefined, effectCard: Card | undefined) {
        this._playerCard = playerCard;
        this.eventPlayer = eventPlayer;
        this.eventCard = effectCard;
    }

    getEffectType(room: Room): EventType {
        return EventType.EFFECT;
    }

    prv(room: Room): void {
        throw new Error("Method not implemented.");
    }

    doEvent(room: Room): void {
        this.doCardEvent(room, this.eventPlayer);
    }

    frameOver(room: Room): void {
        throw new Error("Method not implemented.");
    }

    nextEvent(room: Room): Event | undefined {
        throw new Error("Method not implemented.");
    }

    sendClientInfo(room: Room, player: Player | undefined): void {
        if (!player || player != this.eventPlayer) {
            return;
        }
        this._playerCard.sendClientInfo(this.eventCard, this.eventPlayer);
    }

    doCardEvent(room: Room, player: Player | undefined): void {
        if (!player || player != this.eventPlayer) {
            return;
        }
        this._playerCard.doEvent(this.eventCard, this.eventPlayer, this.param);
        room.clearButton();
    }

    setEffectPlayer(player: Player) {
        this.eventPlayer = player;
    }

    getEffectPlayer() {
        return this.eventPlayer;
    }

    get playerCard(): Card {
        return this._playerCard;
    }

    get canEffect(): boolean {
        return this._canEffect;
    }

    set canEffect(value: boolean) {
        this._canEffect = value;
    }

    get param(): string | undefined {
        return this._param;
    }

    set param(value: string | undefined) {
        this._param = value;
    }
}