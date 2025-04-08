function addListener() {
    canvas.addEventListener("click", function __handler__(evt) {
        let rect = canvas.getBoundingClientRect();
        let x = evt.clientX - rect.left;
        let y = evt.clientY - rect.top;

        let data = {
            id: hero.id,
            x: x,
            y: y
        }

        if (ws == undefined) {
            addHeroMove(hero.id, x, y, getCurrentFrameId());
        } else {
            sendWsMessage("move", data);
        }
    });
}

function addHeroMove(id, x, y, moveFrameId) {
    let delay = parseInt(document.getElementById("receiveDelay").value);

    setTimeout(function () {
        let moveFrame = createFrameById(moveFrameId);
        if (moveFrame.operationArray == null) {
            moveFrame.operationArray = [];
        }

        moveFrame.operationArray.push({
            id: id,
            x: x,
            y: y
        });

        if (moveFrameId > frameArray[frameArray.length - 1].id) {
            return;
        }

        MOVE_TO_FRAME_ID = moveFrameId;
    }, delay)
}

function heroMove(id, x, y) {
    heroArray.forEach(hero => {
        if (hero.id == id) {
            hero.x = x;
            hero.y = y;
        }
    });
}