import {Room} from "../model/Room";
import {Player} from "../model/Player";
import {EventType} from "./EventType";

export interface Event {
    //获取当前事件
    getEffectType(room: Room, player: Player | undefined): EventType;

    //当前事件执行前
    prv(room: Room, player: Player | undefined): void;

    //当前事件开始执行
    doEvent(room: Room, player: Player | undefined): void;

    //当前事件执行结束
    over(room: Room, player: Player | undefined): void;

    //寻找下个事件
    nextEvent(room: Room, player: Player | undefined): Event | undefined;
}