import {Room} from "../../model/Room";
import {Event} from "../Event";
import {EventType} from "../EventType";
import {Player} from "../../model/Player";
import {EventManager} from "../../manager/EventManager";
import {_0_GameStartEvent} from "../normalEvent/_0_base/_0_GameStartEvent";

/**
 *被识破的牌不能直接移除，需要用此类进行替换
 * 因为每个_0_WaitPlayerUseCard都在_0_GameStartEvent的_roundEvent对应
 */
export class _NoneCard implements Event {
    getEffectType(room: Room): EventType {
        throw new Error("Method not implemented.");
    }

    prv(room: Room): void {
        throw new Error("Method not implemented.");
    }

    doEvent(room: Room): void {
        throw new Error("Method not implemented.");
    }

    frameOver(room: Room): void {
        throw new Error("Method not implemented.");
    }

    nextEvent(room: Room): Event | undefined {
        throw new Error("Method not implemented.");
    }

    sendClientInfo(room: Room, player: Player | undefined): void {
        (EventManager.getEvent(room, _0_GameStartEvent.name) as _0_GameStartEvent).roundEvent.pop();
    }
}