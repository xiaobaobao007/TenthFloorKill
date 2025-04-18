import {GameOverError} from "./GameOverError";
import {Room} from "../model/Room";
import {Player} from "../model/Player";
import {CAMP_RED} from "../util/Constant";

export class RedWinGame extends GameOverError {
    constructor() {
        super("潜伏获得胜利");
    }

    win(room: Room): void {
        let winPlayer: Player[] = [];
        for (let player of room.playerArray) {
            if (player.camp == CAMP_RED) {
                winPlayer.push(player);
            }
        }
        room.addStatistics(winPlayer);
    }
}