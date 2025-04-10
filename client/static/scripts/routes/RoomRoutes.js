class RoomRoutes extends ClientBaseRoutes {
    async roundStartGetCard(data) {
        initMyCard(data.cardArray);
    }
}