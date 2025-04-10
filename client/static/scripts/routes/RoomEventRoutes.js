class RoomEventRoutes extends ClientRoutes {
    async newEvent(data) {
        const div = $(".room-event");

        const downRate = div[0].scrollHeight - div.scrollTop() - div.height() * 1.5;

        div.append("<div class='room-event-one'>" + data.name + "</div>");

        if (downRate < 0) {
            div.scrollTop(div[0].scrollHeight - div.height());
        }
    }
}