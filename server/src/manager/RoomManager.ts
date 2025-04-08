// import {Room} from "../model/Room";
// import {Player} from "../model/Player";
//
// export class RoomManager {
//     private static roomMap = new Map<string, Room>();
//
//     public static join(player: Player, roomId: string) {
//         console.log(`joined room: ${roomId}`);
//
//         let room = this.roomMap.get(roomId);
//         if (!room) {
//             room = new Room();
//             this.roomMap.set(roomId, room);
//         }
//
//         room.addPlayer(player);
//
//         player.roomId = roomId;
//     }
//
//     public static move(player: Player, data: any) {
//         let room = this.roomMap.get(player.roomId);
//         if (!room) {
//             return;
//         }
//         room.move(data);
//     }
//
//     public static level(player: Player) {
//         if (player.roomId == "") {
//             return;
//         }
//
//         console.log(`${player.id} level room: ${player.roomId}`);
//
//         let room = this.roomMap.get(player.roomId);
//         if (!room) {
//             return;
//         }
//
//         if (room.removePlayer(player)) {
//             this.roomMap.delete(player.roomId);
//         }
//     }
// }