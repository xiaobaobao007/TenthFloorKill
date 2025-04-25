class RoomRoutes extends ClientBaseRoutes {
    async update(roomData) {
        ROOM_DATA = roomData;
        updateRoomData();
    }

    async openStatistics(statistics) {
        $(".room-statistics").remove();

        let html = "<div class='room-statistics' onclick='closeStatistics()'>";


        for (let i = statistics.all.length - 1; i >= 0; i--) {
            const oneRoundInfo = statistics.all[i];
            html += "" +
                "    <table>" +
                "        <thead>" +
                "        <tr>" +
                "            <th></th>" +
                "            <th>玩家</th>" +
                "            <th>角色</th>" +
                "            <th>身份</th>" +
                "            <th>状态</th>" +
                "            <th>结果</th>" +
                "        </tr>" +
                "        </thead>" +
                "        <tbody>";

            for (let i = 0; i < oneRoundInfo.players.length; i++) {
                html += "<tr>";

                if (i === 0) {
                    html += "" +
                        "<td rowspan='" + oneRoundInfo.players.length + "'>" +
                        "    <span>第 " + oneRoundInfo.round + " 局</span><br>" +
                        "    <span class='game-time'>" + oneRoundInfo.time + "</span>" +
                        "</td>";
                }

                const player = oneRoundInfo.players[i];

                html += "    <td>" + player.account + "</td>";
                html += "    <td>" + player.hero + "</td>";
                html += "    <td class='" + player.camp + "'>" + STRING_CONFIG[player.camp] + "</td>";

                if (player.live) {
                    html += "    <td class='win'>存货</td>";
                } else {
                    html += "    <td class='lose'>死亡</td>";
                }

                if (player.win) {
                    html += "    <td class='win'>获胜</td>";
                } else {
                    html += "    <td class='lose'>失败</td>";
                }

                html += "</tr>";
            }

            html += "" +
                "        </tbody>" +
                "    </table>";
        }
        html += "</div>";

        $("body").append(html);
    }

    async gameOver() {
        $(".room-lastCard-tips").html("");
        $(".dead").remove();
    }
}