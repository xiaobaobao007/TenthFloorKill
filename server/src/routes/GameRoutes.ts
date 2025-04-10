import {ServerClientRoutes} from "./ServerClientRoutes";

export class GameRoutes extends ServerClientRoutes {
    async start() {
        console.log('Start game route called');
    }
}