function createRoom() {
    sendWsMessage('room/create');
}

function joinRoom() {
    sendWsMessage('room/join', {roomId: $("#joinRoomId").val()});
}

function quitRoom() {
    sendWsMessage('room/leave');
}

function leaderStartGame() {
}

function changeAccount() {
    closeWs();
}
