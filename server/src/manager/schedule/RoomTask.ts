import {ScheduleTask} from "./ScheduleTask";
import {RoomManager} from "../RoomManager";
import {EventType} from "../../fight/EventType";

export class RoomTask extends ScheduleTask {
    run(): void {
        for (const room of RoomManager.roomMap.values()) {
            if (!room.start) {
                continue;
            }

            const currentEvent = room.currentEvent!;

            switch (currentEvent.getEffectType(room, undefined)) {
                case EventType.PRE:
                    currentEvent.prv(room, undefined);
                    break;
                case EventType.EFFECT:
                    currentEvent.doEvent(room, undefined);
                    break;
                case EventType.OVER:
                    currentEvent.over(room, undefined);
                    break;
                case EventType.NEXT:
                    // room.currentEvent = currentEvent.nextEvent(room, undefined);
                    break;
                default:
                    break;
            }
        }
    }
}