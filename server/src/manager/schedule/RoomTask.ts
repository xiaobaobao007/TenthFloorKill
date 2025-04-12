import {ScheduleTask} from "./ScheduleTask";
import {EventManager} from "../EventManager";

export class RoomTask extends ScheduleTask {
    run(): void {
        EventManager.doEvent();
    }
}