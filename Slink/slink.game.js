"use strict"

const halfTotalWidth = (totalWidth / 2);
const halfTotalHeight = (totalHeight / 2);
const halfWindowWidth = (window.innerWidth / 2);
const halfWindowHeight = (window.innerHeight / 2);

const standardVelocity = 4;
const speedBoostFactor = 2;

const fps = 24;
const overlay = document.getElementById("overlay");

let mySnake = {};
let ctx = document.getElementById(canvasId).getContext('2d');

function start() {
    //check if hub has started every 100 ms.
    while (!slinkHub.isLoaded) {
        setTimeout(start, 100);
    }

    document.getElementById("overlay").style.visibility = "hidden";
    document.getElementById(canvasId).style.visibility = "visible";
    let clientNameText = clientName.value;
    overlay.parentElement.removeChild(overlay);

    let startingPosition = getStartPosition();
    window.scrollTo(startingPosition.x, startingPosition.y);
    mySnake = snake.newSnake(clientNameText, startingPosition, standardVelocity);

    let snakeId = slinkHub.registerNewSnake(mySnake); //this will cause the server to send remote snakes to the client in a separate call.
    mySnake.setId(snakeId);
    pollServer();
    drawAll();
}

function pollServer() {
    slinkHub.updateServer(mySnake);
    setTimeout(pollServer, updateRate);
}

function getStartPosition() {
    let startingWeight = Math.random();

    let startX = (startingWeight * totalWidth);
    if (startX < halfWindowHeight) {
        startX += halfWindowWidth
    }
    else if (startX > totalWidth - halfWindowWidth) {
        startX -= halfWindowWidth;
    }

    let startY = (startingWeight * totalHeight);
    if (startY < halfWindowHeight) {
        startY += halfWindowHeight
    }
    else if (startY > totalHeight - halfWindowHeight) {
        startY -= halfWindowHeight;
    }

    return {
        x: startX,
        y: startY
    };
}

function drawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < remoteSnakes.length; i++) {
        const snakeItem = remoteSnakes[i];
        snakeItem.move();
        snakeItem.draw();
    }

    mySnake.move();
    slinkHub.updateServer(mySnake);
    mySnake.draw();

    if (remoteSnakes.length === 0) {
        status.innerText = "Its just you :("
    }
    else {
        status.innerText = remoteSnakes.length + 1 + " snakes connected.";
    }
    setTimeout(function () { window.requestAnimationFrame(drawAll); }, 1000 / fps);
}