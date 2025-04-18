import {GameOverError} from "./GameOverError";
import {Room} from "../model/Room";
import {Player} from "../model/Player";
import {CAMP_GREY} from "../util/Constant";

export class GreyWinGame extends GameOverError {
    constructor() {
        super("特工获得胜利");
    }

    win(room: Room): void {
        let winPlayer: Player[] = [];
        for (let player of room.playerArray) {
            if (player.camp == CAMP_GREY) {
                winPlayer.push(player);
            }
        }
        room.addStatistics(winPlayer);
    }
}