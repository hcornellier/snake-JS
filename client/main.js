// Constants
const tileSize = 14;
const tilesInGame = 15;
const gameDimensions = tileSize * tilesInGame;

const getRandomInt = (max) => Math.floor(Math.random() * max);
const getRandomCoinPositionLeft = () => tileSize * getRandomInt(tilesInGame);
const getRandomCoinPositionBottom = () => tileSize * getRandomInt(tilesInGame);

// Initialize
let playerArr = [];
let direction = "right";
let coinPosLeft = getRandomCoinPositionLeft();
let coinPosBottom = getRandomCoinPositionBottom();

function checkKey(e) {
    let dirChanged = false;
    if (e.keyCode === 39 && direction !== "right" && direction !== "left") {
        direction = "right";
        dirChanged = true;
    }
    if (e.keyCode === 37 && direction !== "left" && direction !== "right") {
        direction = "left";
        dirChanged = true;
    }
    if (e.keyCode === 38 && direction !== "up" && direction !== "down") {
        direction = "up";
        dirChanged = true;
    }
    if (e.keyCode === 40 && direction !== "down" && direction !== "up") {
        direction = "down";
        dirChanged = true;
    }

    if (dirChanged) {
        interval = changeDirection(interval, direction);
    }
}

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
    while (true)
    {
        coinPosLeft = getRandomCoinPositionLeft();
        coinPosBottom = getRandomCoinPositionBottom();
        let occupied = false; // Assume that the coin's tile is unoccupied
        playerArr.forEach(e => {
            if (
                Math.abs(parseInt(e.left) - coinPosLeft) < tileSize &&
                Math.abs(parseInt(e.bottom) - coinPosBottom) < tileSize
            ) {
                occupied = true;
            }
        });
        if (!occupied) {
            break;
        }
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
    playerArr[0].direction = direction;
    move(direction, playerArr[0]);

    clearInterval(interval);
    interval = setInterval(() => {
        move(direction, playerArr[0]);
    }, 500);

    return interval;
}

function move(direction, currPlayer) {
    let playerID = "player-" + currPlayer.id;

    if (!document.getElementById(playerID)) {
        console.error(`could not find playerID ${playerID}`);
        return;
    }

    const dir = direction === "up" || direction === "down" ? "bottom" : "left";

    const player = document.getElementById(playerID);
    let pos = parseInt(player.style[dir]);

    // If snake moves right or up, distance must be added. ELse, distance must be removed
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

    // Check for coins
    collisionDetection(currPlayer);
}

// Detects collisions between the snake coin & coins or the tail.
function collisionDetection(currPlayer) {
    const head = playerArr[0];

    // Snake head collides with coin
    if (
        Math.abs(parseInt(head.left) - coinPosLeft) < tileSize &&
        Math.abs(parseInt(head.bottom) - coinPosBottom) < tileSize
    ) {
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
            const head = playerArr[0];
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
    document.getElementById("coin").remove();
    playerArr.forEach(e => {
        let player = document.getElementById("player-" + e.id)
        if (player) player.remove();
    });
    console.log("Game over...");
    document.getElementById("gameover").style.visibility = "visible";

    return;
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
