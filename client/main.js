// Constants
const tileSize = 14;
const tilesInGame = 15;
const gameDimensions = tileSize * tilesInGame;

const getRandomInt = (max) => Math.floor(Math.random() * max);
const getRandomCoinPositionLeft = () => tileSize * getRandomInt(tilesInGame);
const getRandomCoinPositionBottom = () => tileSize * getRandomInt(tilesInGame);
const movingVertically = () => {
    return direction === "up" || direction === "down"
};
const movingHorizontally = () => {
    return direction === "left" || direction === "right"
};
const coinCollision = (e) => {
    return Math.abs(parseInt(e.left) - coinPosLeft) < tileSize && Math.abs(parseInt(e.bottom) - coinPosBottom) < tileSize
};

// Initialize
let playerArr = [];
let direction = "right";
let coinPosLeft = getRandomCoinPositionLeft();
let coinPosBottom = getRandomCoinPositionBottom();

function addToTail(left, bottom) {
    const id = playerArr.length;

    // Add new block to the map
    let block =
        '<div id="player-' +
        id +
        '" class="player" style="left: ' +
        left +
        "px; bottom: " +
        bottom +
        'px; "> </div>';

    document.getElementById("game-wrap").insertAdjacentHTML("afterbegin", block);

    return {
        left: left,
        bottom: bottom,
        direction: "right",
        lastMove: "",
        id,
    };
}

function makeNewCoin() {
    // Select random tile until finding one that is unoccupied
    while (true) {
        // Assume that the coin's tile is unoccupied
        let occupied = false;
        coinPosLeft = getRandomCoinPositionLeft();
        coinPosBottom = getRandomCoinPositionBottom();
        playerArr.forEach(e => {
            if (coinCollision(e)) occupied = true;
        });
        // If the coin isn't on the snake, we have successfully
        // found an unoccupied square, so we break and continue.
        if (!occupied) break;
        // Otherwise, continue loop and pick a new random tile for the coin.
    }

    let coinHTML =
        '<div id="coin" class="coin" style="left: ' +
        coinPosLeft +
        "px; bottom: " +
        coinPosBottom +
        'px; "> </div>';

    document
        .getElementById("game-wrap")
        .insertAdjacentHTML("beforeend", coinHTML);
}

function changeDirection(interval, direction) {
    move(playerArr[0].direction = direction, playerArr[0]);

    clearInterval(interval);
    if (document.getElementById("player-0")) {
        interval = setInterval(() => {
            move(direction, playerArr[0]);
        }, 500);
    }

    return interval;
}

function move(direction, currPlayer) {
    let playerID = "player-" + currPlayer.id;

    if (!document.getElementById(playerID)) return;

    const dir = direction === "up" || direction === "down" ? "bottom" : "left";

    const player = document.getElementById(playerID);
    let pos = parseInt(player.style[dir]);

    // If snake moves right or up, distance must be added. Else, distance must be removed
    if (direction === "right" || direction === "up") pos += tileSize;
    else pos -= tileSize;

    if (pos > gameDimensions - tileSize) pos = 0;
    else if (pos < 0) pos = gameDimensions - tileSize;

    player.style[dir] = pos + "px";

    // Update position info on each block - used to detect collisions
    currPlayer.left = player.style.left;
    currPlayer.bottom = player.style.bottom;

    // Move next block
    const nextPlayer = playerArr[currPlayer.id + 1];
    if (nextPlayer) {
        currPlayer.lastMove = direction;
        move(nextPlayer.direction, nextPlayer);
        nextPlayer.direction = currPlayer.lastMove;
    }

    collisionDetection(currPlayer);
}

// Detects collisions between the snake coin & coins or the tail.
function collisionDetection(currPlayer) {
    const head = playerArr[0];

    // Snake head collides with coin
    if (coinCollision(head)) {
        // Remove existing coin from map
        document.getElementById("coin").remove();

        // initialize new coin on map
        makeNewCoin();

        // Add extra block to the snake
        const tail = playerArr[playerArr.length - 1];
        playerArr.push(
            addToTail(parseInt(tail.left) - tileSize, parseInt(tail.bottom))
        );

        // Add +1 to the score
        const score = document.getElementById("score");
        let currScore = score.innerText;
        score.innerText = ++currScore;
    }

    // Snake head collides with tail
    if (currPlayer.id === 0) {
        for (let i = 1; i < playerArr.length; i++) {
            const currTailBlock = playerArr[i];
            if (
                head.left === currTailBlock.left &&
                head.bottom === currTailBlock.bottom
            ) {
                endGame();
            }
        }
    }
}

function endGame ()
{
    // Remove coin and player from game
    document.getElementById("coin").remove();
    playerArr.forEach(e => {
        document.getElementById("player-" + e.id).remove();
    });

    // Display "GAME OVER"
    document.getElementById("gameover").style.visibility = "visible";
    return;
}

function checkKey(e) {
    if (movingVertically()) {
        if (e.keyCode === 39)
            interval = changeDirection(interval, direction = "right");
        if (e.keyCode === 37)
            interval = changeDirection(interval, direction = "left");
    }
    if (movingHorizontally()) {
        if (e.keyCode === 38)
            interval = changeDirection(interval, direction = "up");
        if (e.keyCode === 40)
            interval = changeDirection(interval, direction = "down");
    }
}

// Initialize snake & first coin
playerArr.push(addToTail(tileSize * 2, 0));
playerArr.push(addToTail(tileSize, 0));
playerArr.push(addToTail(0, 0));
makeNewCoin();

// Detect keypress
document.onkeydown = checkKey;

// Start movement
let interval = setInterval(() => {
    move(direction, playerArr[0]);
}, 500);
