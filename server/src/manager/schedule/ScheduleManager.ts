import {ScheduleTask} from "./ScheduleTask";
import {RoomTask} from "./RoomTask";
import {GAME_CONFIG} from "../../util/Constant";

export class ScheduleManager {
    private static map = new Map<number, ScheduleTask[]>();

    public static init() {
        this.addSchedule(GAME_CONFIG.GAME_FRAME_TIME, new RoomTask());
        console.info("定时任务开始");
    }

    private static addSchedule(time: number, task: ScheduleTask) {
        let array = this.map.get(time);
        if (!array) {
            array = [];
            this.map.set(time, array);
            setInterval(() => {
                if (!array) {
                    return;
                }

                for (const oneTask of array) {
                    try {
                        oneTask.run();
                    } catch (e) {
                        console.error(e);
                    }
                }
            }, time);
        }
        array.push(task);
    }
}