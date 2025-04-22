import {Room} from "../model/Room";
import {GameOverError} from "./GameOverError";

export class GameSpecialError extends GameOverError {
    constructor(error: string) {
        super(error);
    }

    win(room: Room): void {
        room.addStatistics(room.playerArray);
    }
}