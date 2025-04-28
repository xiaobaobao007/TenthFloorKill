import {RoomManager} from "./RoomManager";
import {EventType} from "../fight/EventType";
import {Stack} from "../util/Stack";
import {Event} from "../fight/Event";
import {Room} from "../model/Room";
import {GameOverError} from "../exception/GameOverError";
import {_0_GameStartEvent} from "../fight/normalEvent/_0_base/_0_GameStartEvent";
import {ROUTER} from "../util/SocketUtil";
import {_0_WaitPlayerChooseOneCard} from "../fight/cardEvent/_0_WaitPlayerChooseOneCard";

export class EventManager {
    public static doEvent() {
        for (const room of RoomManager.roomMap.values()) {
            if (!room.start) {
                continue;
            }

            this.judgeReLogin(room);

            const eventStack: Stack<Event> = room.eventStack;
            const currentEvent = eventStack.peek()!;

            try {
                const effectType = currentEvent.getEffectType(room);
                switch (effectType) {
                    case EventType.PRE:
                        currentEvent.prv(room);
                        break;
                    case EventType.EFFECT:
                        currentEvent.doEvent(room);
                        break;
                    case EventType.NEXT:
                    case EventType.REMOVE:
                    case EventType.REMOVE_AND_NEXT:
                        if (effectType != EventType.NEXT) {
                            eventStack.remove(currentEvent);
                        }
                        if (effectType != EventType.REMOVE) {
                            const nextEvent = currentEvent.nextEvent(room);
                            if (nextEvent) eventStack.push(nextEvent);
                        }
                        if (effectType != EventType.NEXT) {
                            const top = eventStack.peek();
                            if (!(top instanceof _0_WaitPlayerChooseOneCard)) {
                                top?.sendClientInfo(room, undefined);
                            }
                        }
                        break;
                    default:
                        break;
                }

                currentEvent.frameOver(room);
            } catch (err) {
                if (err instanceof GameOverError) {
                    this.gameOver(room, err);
                } else {
                    room.broadcast(ROUTER.base.TIPS, "服务器出现报错！！！");
                    if (eventStack.size() > 1) {
                        //事件异常时将异常事件删除，回归到上个事件，肯定会引起bug，只是为了优化下流程，防止服务器卡死
                        eventStack.pop();
                        console.error(room.roomId, "房间异常事件回归到", eventStack.peek()!.constructor);
                    }
                    console.error(err);
                }
            }
        }
    }

    //判断房间是否存在断线重连的玩家
    private static judgeReLogin(room: Room) {
        for (const player of room.playerArray) {
            if (!player.reLogin) {
                continue;
            }

            room.playerReLogin(player);

            Stack.reLogin(player, room.eventStack);

            (EventManager.getEvent(player.room!, _0_GameStartEvent.name) as _0_GameStartEvent).reLogin(room, player);

            player.reLogin = false;
        }
    }

    private static gameOver(room: Room, err: GameOverError) {
        room.start = false;

        err.win(room);

        room.gameOver();

        console.info("游戏结束", room.roomId, err.message);
    }

    static getEvent(room: Room, name: string): Event | undefined {
        for (let event of room.eventStack.getItems()) {
            if (event.constructor.name === name) {
                return event;
            }
        }
        return undefined;
    }

}