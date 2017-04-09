import util from 'util';
import EventEmitter from 'events';

/**
 * @module Mindsweeper
 * @author Noah Ellman
 *
 * This is the class that handles all gameplay logic for Mindsweeper.  It's all encapusalted here.
 * Just pass and receive events and use the matrix property to render your game map however you want.
 */

/**
 * @property matrix
 * @type Array[]
 * @desc Matrix full of objects representing the battlefield
 */


function Mindsweeper(userOptions = {}) {

    EventEmitter.call(this);

    const options = {
        width: 20,
        height: 20,
        difficulty: 10
    };
    Object.assign(options, userOptions);
    this.options = options;
    this.initialize();

}

// Class inherits EventEmitter for standardized event handling
util.inherits(Mindsweeper, EventEmitter);

// Object representing a single cell in the matrix
Mindsweeper.dataStruct = {
    bomb: false,
    clicked: false,
    visible: false,
    bombsNearby: 0,
    nothing: true,
};

// Create a 2d matrix of Mindsweeper.dataStruct's
Mindsweeper.prototype.createMatrix = function () {
    this.matrix = new Array(this.options.height)
    .fill(null)
    .map(() => new Array(this.options.width)
        .fill(null)
        .map(() => Object.assign({}, Mindsweeper.dataStruct))
    );
};

// initialize the game
Mindsweeper.prototype.initialize = function () {

    const numberOfBombs = this.options.difficulty;

    const incrementBombCounts = (y, x) => {
        if (y < 0 || y >= this.options.height) return;
        if (x < 0 || x >= this.options.width) return;
        this.matrix[y][x].bombsNearby++;
        this.matrix[y][x].nothing = false;
    };

    this.bombs = [];
    this.createMatrix();

    let i = numberOfBombs;

    while (i--) {

        let x = Math.floor(Math.random() * this.options.width);
        let y = Math.floor(Math.random() * this.options.height);
        if (this.matrix[y][x].bomb === true) {
            i++;
            continue;
        }
        this.matrix[y][x].bomb = true;
        this.matrix[y][x].nothing = false;
        this.bombs.push({ y: y, x: x });

        // add the 1,2,3 etc for number of bombs nearby
        incrementBombCounts(y - 1, x);
        incrementBombCounts(y - 1, x - 1);
        incrementBombCounts(y - 1, x + 1);
        incrementBombCounts(y + 1, x);
        incrementBombCounts(y + 1, x - 1);
        incrementBombCounts(y + 1, x + 1);
        incrementBombCounts(y, x - 1);
        incrementBombCounts(y, x + 1);
    }

    return this;

};

// Make visible all the neighboring cells if they are empty
Mindsweeper.prototype.revealOutward = function (x, y) {

    // const doit = (x,y) => {
    if (y < 0 || x < 0 || y >= this.options.height || x >= this.options.width) return;
    if (this.matrix[y][x].visible) return;
    if (this.matrix[y][x].bomb) return;

    this.matrix[y][x].visible = true;

    if (this.matrix[y][x].bombsNearby > 0) return;

    this.revealOutward(x - 1, y);
    this.revealOutward(x + 1, y);
    this.revealOutward(x - 1, y - 1);
    this.revealOutward(x - 1, y + 1);
    this.revealOutward(x + 1, y - 1);
    this.revealOutward(x + 1, y + 1);
    this.revealOutward(x, y - 1);
    this.revealOutward(x, y + 1);

    //}

    //  this.revealOutward(x,y);

};

// Call thi method from your interface to register the clicking of a cell
Mindsweeper.prototype.clickTile = function (x, y) {
    if (!this.isTileClickable(x, y)) return false;
    if (this.matrix[y][x].bomb) {
        return this.gameOverLost();
    }
    if (this.matrix[y][x].nothing) this.revealOutward(x, y);
    this.matrix[y][x].clicked = true;
    this.matrix[y][x].visible = true;
    return true;
};

Mindsweeper.prototype.isTileClickable = function (x, y) {
    return !this.matrix[y][x].visible;
};

// Called on bomb emplosion
// Emits event 'gameover'
Mindsweeper.prototype.gameOverLost = function () {
    for (let data of this.bombs) {
        this.matrix[data.y][data.x].visible = true;
    }
    this.emit('gameover');
    return true;
};

// Check to see if user won the game
Mindsweeper.prototype.validateWin = function () {
    let safeTilesLeft = 0;
    for (let i in this.matrix) {
        for (let j in this.matrix[i]) {
            if (!this.matrix[i][j].bomb && !this.matrix[i][j].visible) {
                safeTilesLeft++;
            }
        }
    }
    return safeTilesLeft;
};

module.exports = Mindsweeper;