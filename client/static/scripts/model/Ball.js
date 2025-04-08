function Ball() {

    this.init = function () {
        this.radius = 11;
        this.x = this.radius + random.random(CANVAS_WIDTH - this.radius * 2)
        this.y = -this.radius * 2;
        this.color = `rgb(${random.random(256)},${random.random(256)},${random.random(256)})`;
        this.speed = random.random(10) * 0.2 + 0.1;
        this.hp = 2;
    };

    this.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.lineWidth = 3;
        ctx.font = '20px 宋体';
        ctx.fillStyle = "white";
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText(this.hp, this.x, this.y);
    };

    this.update = function () {
        if (this.y + this.radius >= BALL_HEIGHT) {
            this.init();
            heroArray.forEach(hero => {
                hero.score -= 2;
            })
        } else {
            this.y += this.speed;
        }
    };

    this.package = function () {
        return {
            radius: this.radius,
            x: this.x,
            y: this.y,
            color: this.color,
            speed: this.speed,
            hp: this.hp,
        };
    };

    this.unPackage = function (data) {
        this.radius = data.radius;
        this.x = data.x;
        this.y = data.y;
        this.color = data.color;
        this.speed = data.speed;
        this.hp = data.hp;
    };
}

function ballInit() {
    ballArray = [];
    for (let i = 0; i < BALL_INIT_NUM; i++) {
        const ball = new Ball();
        ball.init();
        ballArray.push(ball);
    }
}

function paintBall() {
    for (let ball of ballArray) {
        ball.draw();
    }
}

function updateBall() {
    for (let ball of ballArray) {
        ball.update();
    }
}

function findCloseOne() {
    let b = null;
    for (let ball of ballArray) {
        if (b == null || b.y < ball.y) {
            b = ball;
        }
    }
    return b;
}