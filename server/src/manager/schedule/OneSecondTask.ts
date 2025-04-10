import {ScheduleTask} from "./ScheduleTask";
import {PlayerManager} from "../PlayerManager";

export class OneSecondTask extends ScheduleTask {
    run(): void {
        // const oneCard = CardManager.getOneCard();
        PlayerManager.sendAll("roomEvent/newEvent", {account: 1424, name: "当前时间：" + Date.now()});
    }
}