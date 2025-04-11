import {ScheduleTask} from "./ScheduleTask";
import {CardManager} from "../CardManager";
import {PlayerManager} from "../PlayerManager";

export class OneSecondTask extends ScheduleTask {
    run(): void {
        const cardArray = CardManager.getNewPlayerCard(2);
        PlayerManager.sendAll("room/roundStartGetCard", {cardArray: cardArray});
    }
}