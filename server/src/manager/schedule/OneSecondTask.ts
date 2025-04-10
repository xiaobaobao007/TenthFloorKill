import {ScheduleTask} from "./ScheduleTask";
import {CardManager} from "../CardManager";
import {PlayerManager} from "../PlayerManager";

export class OneSecondTask extends ScheduleTask {
    run(): void {
        const cardArray = CardManager.getCard(2);
        PlayerManager.sendAll("room/roundStartGetCard", {cardArray: cardArray});
    }
}