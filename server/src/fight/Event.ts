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

    //当前事件帧执行结束
    frameOver(room: Room): void;

    //寻找下个事件 or 事件结束后的操作
    nextEvent(room: Room): Event | undefined;

    //事件开始发送前端信息，同时为了断线重连恢复数据
    sendClientInfo(room: Room, player: Player | undefined): void;
}