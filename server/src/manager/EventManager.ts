import {RoomManager} from "./RoomManager";
import {EventType} from "../fight/EventType";
import {Stack} from "../util/Stack";
import {Event} from "../fight/Event";

export class EventManager {
    public static doEvent() {
        for (const room of RoomManager.roomMap.values()) {
            if (!room.start) {
                continue;
            }

            const eventStack: Stack<Event> = room.eventStack;
            const currentEvent = eventStack.peek()!;

            switch (currentEvent.getEffectType(room)) {
                case EventType.PRE:
                    currentEvent.prv(room);
                    break;
                case EventType.EFFECT:
                    currentEvent.doEvent(room);
                    break;
                case EventType.OVER:
                    currentEvent.over(room);
                    break;
                case EventType.NEXT:
                    eventStack.push(currentEvent.nextEvent(room));
                    break;
                case EventType.REMOVE_AND_NEXT:
                    eventStack.pop();
                    eventStack.push(currentEvent.nextEvent(room));
                    break;
                default:
                    break;
            }
        }
    }
}