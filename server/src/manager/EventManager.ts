import {RoomManager} from "./RoomManager";
import {EventType} from "../fight/EventType";
import {Stack} from "../util/Stack";
import {Event} from "../fight/Event";
import {Room} from "../model/Room";
import {GameOverError} from "../exception/GameOverError";

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
                switch (currentEvent.getEffectType(room)) {
                    case EventType.PRE:
                        currentEvent.prv(room);
                        break;
                    case EventType.EFFECT:
                        currentEvent.doEvent(room);
                        break;
                    case EventType.NEXT:
                        eventStack.push(currentEvent.nextEvent(room));
                        break;
                    case EventType.REMOVE:
                        eventStack.pop();
                        break;
                    case EventType.REMOVE_AND_NEXT:
                        eventStack.pop();
                        eventStack.push(currentEvent.nextEvent(room));
                        break;
                    default:
                        break;
                }

                currentEvent.frameOver(room);
            } catch (err) {
                if (err instanceof GameOverError) {
                    this.gameOver(room, err);
                } else {
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

            player.reLogin = false;
        }
    }

    private static gameOver(room: Room, err: GameOverError) {
        room.start = false;

        err.win(room);

        room.gameOver();

        console.info("游戏结束", room.roomId, err.message);
    }

}