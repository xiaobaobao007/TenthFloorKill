random = new Random();

function Random() {
    this._init_random = 0;
    this._random_array = [];
    this.index = 0;
    this.zeroNum = 0;

    this.init = function (initRandom) {
        this.privetInit(4158185818 + initRandom);
    }

    this.privetInit = function (a) {
        this._init_random = a;
        this._random_array = [];
        this.index = 0;
        this.zeroNum = 0;

        let r = this._init_random;

        while (r > 0) {
            this.push(r % 2);
            r = Math.floor(r / 2);
        }

        this.index = 0;
    }

    this.push = function (_1_or_0) {
        this._random_array.push(_1_or_0);
        this.index++;

        if (_1_or_0 === 0) {
            this.zeroNum++;
        }

        if (this.index > 10 && this._random_array[this.index - 11] === 0) {
            this.zeroNum--;
        }

        if (this.index > 10) {
            if (this.zeroNum <= 4) {
                this.push(0);
            } else if (this.zeroNum >= 6) {
                this.push(1);
            }
        }
    }

    this.reInit = function () {
        let p = 0;
        for (let i = 0; i < 60; i++) {
            p = p * 2 + this.privateRandom_1_0(false);
        }
        this.privetInit(p);
    }

    this.privateRandom_1_0 = function () {
        return this.privateRandom_1_0(true);
    }

    this.random = function (number) {
        return Math.floor(number * this.privateRandomBy_1024(true) / 1024);
    };

    this.privateRandom_1_0 = function (reset) {
        if (this.index >= this._random_array.length) {
            if (reset) {
                this.reInit();
            } else {
                this.index = 0;
            }
        }
        return this._random_array[this.index++];
    }

    this.privateRandomBy_1024 = function (reset) {
        let r = 0;
        for (let i = 0; i < 10; i++) {
            r = r * 2 + this.privateRandom_1_0(reset);
        }
        return r;
    }

    this.get = function () {
        return this._random_array;
    }

    this.package = function () {
        return {
            _init_random: this._init_random,
            _random_array: this._random_array,
            index: this.index,
            zeroNum: this.zeroNum,
        };
    };

    this.unPackage = function (data) {
        this._init_random = data._init_random;
        this._random_array = data._random_array;
        this.index = data.index;
        this.zeroNum = data.zeroNum;
    };

}