import {Room} from "../model/Room";

export abstract class GameOverError extends Error {
    abstract win(room: Room): void;
}