let destroyBulletIndexArray = [];

function Gun() {
    this.x = 0;
    this.y = 0;

    this.targetX = CANVAS_WIDTH / 2;
    this.targetY = CANVAS_HEIGHT / 2;

    this.speedX = 0;
    this.speedY = 0;

    this.bulletArray = [];

    this.lastShootTime = 0;
    this.shootTime = 200;

    this.init = function (hero, rate) {
        this.hero = hero;
        this.gunLength = HERO_HEIGHT * rate;

        this.reset(hero.x, hero.y, 200, 200);
    }

    this.reset = function (x_, y_, tx_, ty_) {
        this.x = x_;
        this.y = y_;

        let t = Math.sqrt(Math.pow(tx_ - this.x, 2) + Math.pow(ty_ - this.y, 2));
        let rate = t / this.gunLength;

        this.targetX = x_ + (tx_ - x_) / rate;
        this.targetY = y_ + (ty_ - y_) / rate;

        this.speedX = (this.targetX - this.x);
        this.speedY = (this.targetY - this.y);
    };

    this.draw = function () {
        ctx.strokeStyle = "rgb(44,82,163)";
        ctx.lineWidth = 10;

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.targetX, this.targetY);
        ctx.stroke();
        ctx.closePath();

        for (const bullet of this.bulletArray) {
            bullet.draw();
        }
    };

    this.update = function (now) {
        if (this.lastShootTime <= now) {
            this.lastShootTime = now + this.shootTime;
            let bullet = createBullet();
            bullet.init(this.hero, this.x, this.y, this.speedX, this.speedY);
            this.bulletArray.push(bullet);
        }

        let bullet;
        destroyBulletIndexArray.length = 0;

        for (let i = 0; i < this.bulletArray.length; i++) {
            bullet = this.bulletArray[i];

            bullet.updateBullet();

            if (bullet.crash() || bullet.destroyBullet()) {
                destroyBulletIndexArray.push(i);
                destroyBullet(bullet);
            }
        }

        if (destroyBulletIndexArray.length > 0) {
            for (let i = destroyBulletIndexArray.length - 1; i >= 0; i--) {
                this.bulletArray.splice(destroyBulletIndexArray[i], 1);
            }
        }
    };

    this.package = function () {
        return {
            x: this.x,
            y: this.y,
            targetX: this.targetX,
            targetY: this.targetY,
            speedX: this.speedX,
            speedY: this.speedY,
            bulletArray: this.bulletArray.map(bullet => bullet.package()),
            lastShootTime: this.lastShootTime,
            shootTime: this.shootTime,
        };
    };

    this.unPackage = function (data) {
        this.x = data.x;
        this.y = data.y;
        this.targetX = data.targetX;
        this.targetY = data.targetY;
        this.speedX = data.speedX;
        this.speedY = data.speedY;
        this.lastShootTime = data.lastShootTime;
        this.shootTime = data.shootTime;

        this.bulletArray.forEach(bullet => destroyBullet(bullet))

        this.bulletArray = [];

        for (const bulletData of data.bulletArray) {
            let bullet = createBullet();
            bullet.unPackage(this.hero, bulletData);
            this.bulletArray.push(bullet);
        }
    };

}