import {WebSocket} from "ws";

export class SocketUtil {
    public static send(socket: WebSocket | undefined, route: string, data: any = undefined) {
        if (!socket) {
            return;
        }
        let send = {
            route: route.toLowerCase(),
            data: data
        };
        socket.send(JSON.stringify(send));
    }
}