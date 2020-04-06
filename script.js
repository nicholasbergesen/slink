'use strict'
const totalWidth = 10000;
const totalHeight = 10000;

const centerX = (totalWidth / 2);
const centerY = (totalHeight / 2);
const canvasId = "canvas";
const velocity = 1;
let mouseClientX = centerX;
let mouseClientY = centerY;
let movingUp = (window.innerWidth / 2) < mouseClientX;
let movingLeft = (window.innerHeight / 2) < mouseClientY;
let snakes = [];

function setCanvasSize() {
    let canvas = document.getElementById(canvasId);
    canvas.width = totalWidth;
    canvas.height = totalHeight;
}

function createSnake(x, y) {
    var circle = new Path2D();
    circle.arc(x, y, 30, 0, 2 * Math.PI);
    circle.fillStyle = "blue";
    return circle;
}

function drawAll() {
    let ctx = document.getElementById(canvasId).getContext('2d');
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < snakes.length; i++) {
        ctx.restore();
        const snake = snakes[i];
        let moveX = velocity;
        let moveY = velocity;

        //set movement direction
        if(movingLeft) {
            moveX = moveX * -1;
        }
        if(movingUp) {
            moveY = moveY * -1;
        }

        ctx.translate(moveX, moveY);
        ctx.fill(snake);
        window.scrollBy(moveX, moveY);
    }

    window.requestAnimationFrame(drawAll);
}

function onLoad() {
    setCanvasSize();
    document.onmousemove = (e) => showCoOrdinates(e);
    window.scrollTo(centerX - window.innerWidth / 2, centerY - window.innerHeight / 2);
    snakes.push(createSnake(centerX, centerY));
    window.requestAnimationFrame(drawAll);
}

function showCoOrdinates(event) {
    var span = document.getElementById("coords");
    span.innerHTML = "Page:(" + event.pageX + "," + event.pageY + "), Client:(" + event.clientX + "," + event.clientY + ")"; //can use clientX, clientY for in view co-ordinates.

    movingUp = event.clientY < (window.innerHeight / 2);
    movingLeft = event.clientX < (window.innerWidth / 2);
}
