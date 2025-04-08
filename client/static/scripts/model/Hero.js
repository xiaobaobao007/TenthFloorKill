function Hero() {
    this.initHero = function (id, isMe, x, y) {
        this.id = id;
        this.isMe = isMe;
        this.width = HERO_HEIGHT - 10;
        this.x = CANVAS_WIDTH * x / 100;
        this.y = CANVAS_HEIGHT * y / 100;
        this.score = 0;
    };

    this.setGun = function (gun) {
        this.gun = gun;
        this.gun.init(this, 2);
    };

    this.draw = function () {
        ctx.fillStyle = "red";

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width, 0, 2 * Math.PI);
        ctx.fill();

        this.gun.draw();

        ctx.font = '20px 宋体';
        ctx.fillStyle = "#ffffff";
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText(this.id + ":" + this.score, this.x, this.y);
    };

    this.update = function (now) {
        let closeBall = findCloseOne();
        this.gun.reset(this.x, this.y, closeBall.x, closeBall.y);
        this.gun.update(now);
    };

    this.package = function () {
        return {
            id: this.id,
            isMe: this.isMe,
            x: this.x,
            y: this.y,
            score: this.score,
            gun: this.gun.package(),
        };
    };

    this.unPackage = function (data) {
        this.id = data.id;
        this.isMe = data.isMe;
        this.x = data.x;
        this.y = data.y;
        this.score = data.score;

        this.gun.unPackage(data.gun);
    };
}

function paintHero() {
    heroArray.forEach(hero => hero.draw());
}

function updateHero(now) {
    heroArray.forEach(hero => hero.update(now));
}