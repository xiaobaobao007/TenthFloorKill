class Frame {
    heroArray = null;
    ballArray = null;
    operationArray = null;

    constructor(frameId) {
        this.id = frameId;
        this.time = clientRunTime;
        this.random = random.package();
    }
}

function packageAll() {
    let currentFrame = getCurrentFrame();

    currentFrame.heroArray = heroArray.map(a => a.package());
    currentFrame.ballArray = ballArray.map(a => a.package());
}

function unPackageAll() {
    if (MOVE_TO_FRAME_ID === -1) {
        return;
    }


    PAUSE = true;
    console.log("开始帧恢复", MOVE_TO_FRAME_ID, getCurrentFrameId());

    let i = frameArray.length - 1
    let element;
    for (; i >= 0; i--) {
        element = frameArray[i];
        if (MOVE_TO_FRAME_ID >= element.id && element.heroArray != null && element.ballArray != null) {
            break;
        }
    }

    clientRunTime = element.time;
    random.unPackage(element.random);

    console.log(hero.package());

    if (element.heroArray != null) {
        for (let i = 0; i < element.heroArray.length; i++) {
            heroArray[i].unPackage(element.heroArray[i]);
        }
    }

    if (element.ballArray != null) {
        for (let i = 0; i < element.ballArray.length; i++) {
            ballArray[i].unPackage(element.ballArray[i]);
        }
    }

    let times = Math.floor((Date.now() - clientRunTime) / calculateFrameMs);

    console.log(times, frameArray);

    console.log(hero.package());

    calculateByTimes(times);

    console.log(hero.package());

    console.log("帧恢复结束");

    MOVE_TO_FRAME_ID = -1;
    PAUSE = false;
}

function getCurrentFrame() {
    return createFrameById(getCurrentFrameId());
}

function createFrameById(frameId) {
    let frame;

    if (frameArray.length === 0 || frameId > frameArray[frameArray.length - 1].id) {
        frame = new Frame(frameId);
        frameArray.push(frame);
    } else {
        for (let i = frameArray.length - 1; i >= 0; i--) {
            if (frameId > frameArray[i].id) {
                continue;
            } else if (frameId === frameArray[i].id) {
                frame = frameArray[i];
                break;
            }

            frame = new Frame(frameId);
            frameArray.splice(i, 0, frame);
            break
        }
    }

    return frame;
}

function getFrameById(frameId) {
    for (let i = frameArray.length - 1; i >= 0; i--) {
        if (frameId === frameArray[i].id) {
            return frameArray[i];
        } else if (frameId > frameArray[i].id) {
            return null;
        }
    }
}

function getCurrentFrameId() {
    return getFrameIdByTime(Date.now());
}

function getFrameIdByTime(time) {
    return Math.floor((time - clientStartTime) / 30);
}
