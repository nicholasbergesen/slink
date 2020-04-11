'use strict'

const halfTotalWidth = (totalWidth / 2);
const halfTotalHeight = (totalHeight / 2);
const halfWindowWidth = (window.innerWidth / 2);
const halfWindowHeight = (window.innerHeight / 2);

const standardVelocity = 4;
const speedBoostFactor = 2;

const fps = 40;
const slinkHub = new slinkHubR();
const overlay = document.getElementById("overlay");

let snakes = [];
let mySnake;
let ctx = document.getElementById(canvasId).getContext('2d');

function start() {
    document.getElementById("overlay").style.visibility = "hidden";
    document.getElementById(canvasId).style.visibility = "visible";
    let clientNameText = clientName.value;
    overlay.parentElement.removeChild(overlay);

    let startingPosition = getStartPosition();
    window.scrollTo(startingPosition.x, startingPosition.y);
    mySnake = snake.newSnake(clientNameText, startingPosition, standardVelocity);
    snakes.push(mySnake);
    //slinkHub.server.updateModel({ left: 1, top: 2 });
    drawAll();
}

function getStartPosition() {
    let startingWeight = Math.random();

    let startX = (startingWeight * window.innerWidth);
    if (startX < halfWindowWidth) {
        startX += halfWindowWidth
    }
    else if (startX > window.innerWidth - halfWindowWidth) {
        startX -= halfWindowWidth;
    }

    let startY = (startingWeight * window.innerHeight);
    if (startY < halfWindowHeight) {
        startY += halfWindowHeight
    }
    else if (startY > window.innerHeight - halfWindowHeight) {
        startY -= halfWindowHeight;
    }

    return {
        x: startX,
        y: startY
    };
}

function drawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snakes.length; i++) {
        const snakeItem = snakes[i];
        snakeItem.move();
        snakeItem.draw();
    }

    setTimeout(function () { window.requestAnimationFrame(drawAll); }, 1000 / fps);
}