import {GameOverError} from "./GameOverError";
import {Room} from "../model/Room";
import {Player} from "../model/Player";
import {CAMP_BLUE} from "../util/Constant";

export class BlueWinGame extends GameOverError {
    constructor() {
        super("军情获得胜利");
    }

    win(room: Room): void {
        let winPlayer: Player[] = [];
        for (let player of room.playerArray) {
            if (player.camp == CAMP_BLUE) {
                winPlayer.push(player);
            }
        }
        room.addStatistics(winPlayer);
    }
}