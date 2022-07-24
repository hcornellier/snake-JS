// Initialize
let direction   = "right"
let snakeLength = 0;
let GAME_HEIGHT = 800;
let GAME_WIDTH  = 1000;
let DISTANCE_MOVED = 14;
let coinPosLeft    = getRandomCoinPositionLeft();
let coinPosBottom  = getRandomCoinPositionBottom();

// Start movement
let interval = setInterval(() => {
    move(direction, playerArr[0]);
}, 500);

// Detect keypress
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
    constructor(head, left, bottom) {
        this.head = head;
        this.left = left;
        this.bottom = bottom;
        this.direction = "right";
        this.lastMove = "";
        this.id = snakeLength;
        this.next = "player-" + (snakeLength + 1);

        // Add new block to the map
        let block = '<div id="player-' + snakeLength++ + '" class="player" style="left: ' + left + 'px; bottom: ' + bottom + 'px; "> </div>';
        document.getElementById('game-wrap').insertAdjacentHTML('afterbegin', block);
    }
}

class Coin
{
    constructor(left, bottom) {
        this.left = left;
        this.bottom = bottom;
        let coinHTML = '<div id="coin" class="coin" style="left: ' + left + 'px; bottom: ' + bottom + 'px; "> </div>';
        document.getElementById('game-wrap').insertAdjacentHTML('beforeend', coinHTML);
    }
}

// Initialize snake & first coin
const playerArr = [];
playerArr[0] = new Player(true, 48, 300);
playerArr[1] = new Player(false, 44, 300);
playerArr[2] = new Player(false, 40, 300);
c0 = new Coin(coinPosLeft, coinPosBottom);

function getRandomInt(max)
{
    return Math.floor(Math.random() * max);
}

function getRandomCoinPositionLeft()
{
    return (14 * getRandomInt (GAME_WIDTH / 14)) - 4;
}

function getRandomCoinPositionBottom()
{
    return (14 * getRandomInt (GAME_HEIGHT / 14)) + 6;
}

function changeDirection(interval, direction)
{
    playerArr[0].direction = direction;
    clearInterval(interval);
    move(direction, playerArr[0]);
    interval = setInterval(() =>
    {
        move(direction, playerArr[0]);
    }, 500);
    return interval;
}

function move(direction, currPlayer)
{
    let playerID = "player-" + currPlayer.id;
    if (document.getElementById(playerID))
    {
        let nextPlayer = playerArr[currPlayer.id + 1];
        let dir = "left";
        if (direction === 'up' || direction === 'down')
            dir = "bottom";
        const player = document.getElementById(playerID);
        let pos = parseInt(player.style[dir]);

        // If snake moves right or up, distance must be added. ELse, distance must be removed
        if (direction === 'right' || direction === 'up')
            pos = pos + DISTANCE_MOVED;
        else
            pos = pos - DISTANCE_MOVED;
        player.style[dir] = pos + "px";

        // Update position info on each block - used to detect collisions
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
        collisionDetection(currPlayer)
    }
}

// Detects collisions between the snake coin & coins or the tail.
function collisionDetection(currPlayer)
{
    const head = document.getElementById("player-0");

    // Snake head collides with coin
    if (Math.abs(parseInt(head.style.left) - coinPosLeft) === 10 && Math.abs(parseInt(head.style.bottom) - coinPosBottom) === 0)
    {
        // Remove existing coin from map
        document.getElementById("coin").remove();

        // Reset global coinpos variables, initialize new coin on map
        coinPosLeft = getRandomCoinPositionLeft();
        coinPosBottom = getRandomCoinPositionBottom();
        c0 = new Coin(coinPosLeft, coinPosBottom);

        // Add extra block to the snake
        playerArr[snakeLength] = new Player(false, parseInt(playerArr[snakeLength-1].left) - 4, parseInt(playerArr[snakeLength-1].bottom), currPlayer.lastMove);

        // Add +1 to the score
        const score = document.getElementById("score");
        let currScore = score.innerText;
        score.innerText = ++currScore;
    }
}
