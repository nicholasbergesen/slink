'use strict'

const halfTotalWidth = (totalWidth / 2);
const halfTotalHeight = (totalHeight / 2);
const halfWindowWidth = (window.innerWidth / 2);
const halfWindowHeight = (window.innerHeight / 2);

const standardVelocity = 4;
const fps = 40;
const slinkHub = new slinkHubR();
const overlay = document.getElementById("overlay");

let velocity = standardVelocity;
let snakes = [];
let ctx = document.getElementById(canvasId).getContext('2d');

function start() {
    document.getElementById("overlay").style.visibility = "hidden";
    document.getElementById(canvasId).style.visibility = "visible";
    let clientNameText = clientName.value;
    overlay.parentElement.removeChild(overlay);

    let startingPosition = getStartPosition();
    window.scrollTo(startingPosition.x, startingPosition.y);
    var newSnake = snake.newSnake(clientNameText, startingPosition);
    snakes.push(newSnake);
    //slinkHub.server.updateModel({ left: 1, top: 2 });
    drawAll();
}

function getStartPosition() {
    let startingWeight = Math.random();

    //prevent starting more than half a screen width to the edge.
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

    //will need to change when remote snakes are included.
    for (let i = 0; i < snakes.length; i++) {
        const snakeItem = snakes[i];
        let head = snakeItem.segments[0];
        var move = calculateMoveTo(head.x, head.y, mousePageX, mousePageY, velocity);
        snakeItem.moveBy(move.x, move.y);
        snakeItem.draw();
    }

    setTimeout(function () { window.requestAnimationFrame(drawAll); }, 1000 / fps);
}

//eq1:y = ax; (a is gradient between the 2 points)
//eq2: x² + y² = r²
//Use y in eq 1 to solve for x in eq 2, r is velovity (position you want to move to).
function calculateMoveTo(originx, originy, targetx, targety, r) {
    const yposition = (targety - originy);
    const xposition = (targetx - originx);

    var gradient = yposition / xposition;

    if(Number.isNaN(gradient)) {
        gradient = 0;
    }

    let moveX = r / Math.sqrt(Math.pow(gradient, 2) + 1);
    let moveY = Math.sqrt(Math.pow(r, 2) - Math.pow(moveX, 2));

    if(yposition < 0) {
        moveY *= -1;
    }
    if(xposition < 0) {
        moveX *= -1;
    }

    return {
        x: moveX,
        y: moveY
    };
}