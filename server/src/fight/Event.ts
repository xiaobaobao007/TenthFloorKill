import {Room} from "../model/Room";
import {Player} from "../model/Player";
import {EventType} from "./EventType";

export interface Event {
    //获取当前事件
    getEffectType(room: Room): EventType;

    //当前事件执行前
    prv(room: Room): void;

    //当前事件开始执行
    doEvent(room: Room): void;

    //当前事件执行结束
    over(room: Room): void;

    //寻找下个事件
    nextEvent(room: Room): Event;

    //事件开始发送前端信息
    sendClientInfo(room: Room, player: Player): void;

    getEventPlayer(): Player | undefined;
}