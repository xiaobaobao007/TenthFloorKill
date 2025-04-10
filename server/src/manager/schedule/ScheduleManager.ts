import {ScheduleTask} from "./ScheduleTask";

export class ScheduleManager {
    private static map = new Map<number, ScheduleTask[]>();

    public static init() {
        // this.addSchedule(1000, new OneSecondTask());
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
                    oneTask.run();
                }
            }, time);

            console.info("添加定时间隔任务：", time);
        }
        array.push(task);
    }
}