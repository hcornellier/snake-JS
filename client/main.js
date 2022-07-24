// Initial direction: right
let direction = "right"
let snakeLength = 0;
let coinCount = 0;
let coinExists = false;
let coinPosLeft = getRandomInt(500);
let coinPosBottom = getRandomInt(500);

// Start movement
let interval = setInterval(() =>
{
    move(direction, playerArr[0]);
}, 1000);

document.onkeydown = checkKey;
function checkKey(e)
{
    e = e || window.event;
    let dirChanged = false;
    if (e.keyCode === 39 && direction !== "right") {
        direction = "right";
        dirChanged = true;
    }
    if (e.keyCode === 37 && direction !== "left") {
        direction = "left";
        dirChanged = true;
    }
    if (e.keyCode === 38 && direction !== "up") {
        direction = "up";
        dirChanged = true;
    }
    if (e.keyCode === 40 && direction !== "down") {
        direction = "down";
        dirChanged = true;
    }
    if ((e.keyCode === 39 || e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 40) && dirChanged === true)
    {
        interval = changeDirection(interval, direction)
    }
}

class Player
{
    constructor(head, left, bottom, prev, direction)
    {
        this.head = head;
        this.left = left;
        this.bottom = bottom;
        this.direction = "right";
        this.lastMove = "NULL";
        this.id = snakeLength;
        this.next = "player-" + (snakeLength + 1);
        console.log(this.next);

        let e = document.createElement("div");
        document.getElementById('game-wrap').insertAdjacentHTML('afterbegin', '<div id="player-' + snakeLength++ + '" class="player" style="left: ' + left + 'px; bottom: ' + bottom + 'px; "> </div>');
    }
}

class Coin
{
    constructor(left, bottom)
    {
        this.left = left;
        this.bottom = bottom;
        let e = document.createElement("div");
        document.getElementById('game-wrap').insertAdjacentHTML('beforeend', '<div id="coin" class="coin" style="left: ' + left + 'px; bottom: ' + bottom + 'px; "> </div>');
    }
}

const playerArr = [];
playerArr[0] = new Player(true, 48, 300, direction);
playerArr[1] = new Player(false, 44, 300, direction);
playerArr[2] = new Player(false, 40, 300, direction);

c0 = new Coin(coinPosLeft, coinPosBottom);
coinExists = true;

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function changeDirection(interval, direction)
{
    console.log("Changing direction to " + direction);
    playerArr[0].direction = direction;
    clearInterval(interval);
    move(direction, playerArr[0]);
    interval = setInterval(() =>
    {
        move(direction, playerArr[0]);
    }, 1000);
    return interval;
}

function move(direction, currPlayer)
{
    let DISTANCE_MOVED = 14;
    let pos = "";
    let playerID = "";
    let prevPlayer = "";
    let nextPlayer = "";
    playerID = "player-" + currPlayer.id;
    nextPlayer = playerArr[currPlayer.id + 1];
    console.log("Moved " + playerID + " " + direction);
    let dir = "left";
    if (direction === 'up' || direction === 'down')
        dir = "bottom";
    if (document.getElementById(playerID))
    {
        const player = document.getElementById(playerID);
        pos = parseInt(player.style[dir]);

        if (direction === 'right' || direction === 'up')
            pos = pos + DISTANCE_MOVED;
        else
            pos = pos - DISTANCE_MOVED;
        player.style[dir] = pos + "px";

        currPlayer.left = player.style.left;
        currPlayer.bottom = player.style.bottom;

        // Move next block
        if (nextPlayer)
        {
            currPlayer.lastMove = direction;
            move(nextPlayer.direction, nextPlayer);
            nextPlayer.direction = currPlayer.lastMove;
        }

        // Check for coins
        if (coinExists)
        {
            const head = document.getElementById("player-0");
            let headLeftPos = parseInt(head.style.left);
            let headBottomPos = parseInt(head.style.bottom);
            if (Math.abs(headLeftPos - coinPosLeft) < 10 && Math.abs(headBottomPos - coinPosBottom) < 10)
            {
                const coin = document.getElementById("coin");
                coin.remove();
                coinPosLeft = getRandomInt(500);
                coinPosBottom = getRandomInt(500);
                c0 = new Coin(coinPosLeft, coinPosBottom);
                playerArr[snakeLength] = new Player(false, parseInt(playerArr[snakeLength-1].left) - 4, parseInt(playerArr[snakeLength-1].bottom), currPlayer.lastMove);
            }
        }

    }
}
