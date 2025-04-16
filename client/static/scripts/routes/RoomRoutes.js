class RoomRoutes extends ClientBaseRoutes {
    async update(roomData) {
        ROOM_DATA = roomData;
        updateRoomData();
    }
}