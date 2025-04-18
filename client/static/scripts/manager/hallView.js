function createRoom() {
    sendWsMessage('room/create');
}

function joinRoom() {
    sendWsMessage('room/join', {roomId: $("#joinRoomId").val()});
}

function changeAccount() {
    closeWs();
}
