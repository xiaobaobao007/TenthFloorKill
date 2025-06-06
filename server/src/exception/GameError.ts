import {GameOverError} from "./GameOverError";
import {Room} from "../model/Room";

export class GameError extends GameOverError {
    constructor(error: string) {
        super(error);
    }

    win(room: Room): void {
        room.addEventTips(this.message);
        room.addStatistics(room.playerArray);
    }
}