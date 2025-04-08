import {WebSocket} from "ws";

export class SocketUtil {
    public static send(socket: WebSocket, route: string, data: any = undefined) {
        let send = {
            route: route,
            data: data
        }
        socket.send(JSON.stringify(send));
    }
}