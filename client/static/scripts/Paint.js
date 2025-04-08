function repaint(now) {
    if (now < lastPaintTime) {
        return;
    }

    lastPaintTime = now + paintFrameMs;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    paintBall();

    paintHero();

    ctx.font = '30px 宋体';
    ctx.fillStyle = "#0d3dff";
    ctx.textBaseline = 'top';
    ctx.textAlign = 'end';
    ctx.fillText("分数：" + hero.score, CANVAS_WIDTH, 0);
    ctx.fillText("缓存帧数：" + frameArray.length, CANVAS_WIDTH, 35);
}

function calculate(now) {
    unPackageAll();

    if (getCurrentFrameId() % 200000 === 0) {
        packageAll();
    }

    if (now < clientRunTime) {
        return;
    }

    let times = Math.floor((now - clientRunTime) / calculateFrameMs);

    if (times <= 0) {
        return;
    }

    if (times > 10) {
        times = Math.floor(times / 10);
    }

    calculateByTimes(times);
}

function calculateByTimes(times) {
    for (let i = 0; i < times; i++) {
        let frameId = getFrameIdByTime(clientRunTime);

        let frame = getFrameById(frameId);

        if (frame && frame.operationArray != null) {
            for (const operation of frame.operationArray) {
                heroMove(operation.id, operation.x, operation.y);
            }
        }

        clientRunTime += calculateFrameMs;
        updateBall();
        updateHero(clientRunTime);
    }
}