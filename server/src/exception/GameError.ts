import {GameOverError} from "./GameOverError";
import {Room} from "../model/Room";

export class GameError extends GameOverError {
    constructor() {
        super("游戏异常");
    }

    win(room: Room): void {
        room.addStatistics(room.playerArray);
    }
}