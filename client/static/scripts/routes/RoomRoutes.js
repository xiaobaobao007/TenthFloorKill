class RoomRoutes extends ClientBaseRoutes {
    async update(roomData) {
        ROOM_DATA = roomData;
        updateRoomData();
    }

    // async updateOnePlayer(data) {
    //     let account = data.account;
    //     let handCard = data.handCard;
    //     addMyCard(data.cardArray);
    // }
}