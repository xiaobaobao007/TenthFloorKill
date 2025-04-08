import {ServerRoutes} from "./Routes";

export class GameRoutes extends ServerRoutes {
    async start() {
        console.log('Start game route called');
    }
}