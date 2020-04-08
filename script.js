'use strict'
const totalWidth = 3000;
const totalHeight = 3000;

const centerX = (totalWidth / 2);
const centerY = (totalHeight / 2);
const clientCenterX = (window.innerWidth / 2);
const clientCenterY = (window.innerHeight / 2);

const canvasId = "canvas";
const velocity = 10;
const segmentRadius = 30;
const fps = 24;
var ctx = document.getElementById(canvasId).getContext('2d');

let mouseClientX = clientCenterX;
let mouseClientY = clientCenterY;
let movingUp = (window.innerWidth / 2) < mouseClientX;
let movingLeft = (window.innerHeight / 2) < mouseClientY;
let snakes = [];

function setCanvasSize() {
    let canvas = document.getElementById(canvasId);
    canvas.width = totalWidth;
    canvas.height = totalHeight;
}

function segment(x, y) {
    this.x = x;
    this.y = y;

    this.draw = function(isHead) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.arc(this.x, this.y, segmentRadius, 0, 2 * Math.PI);
        if(isHead){
            ctx.fillStyle = "green";
        }
        else {
            ctx.strokeStyle = "brown";
            ctx.fillStyle = "blue";
        }
        ctx.fill();
        ctx.stroke();
    }
}

function snake(segments) {
    this.segments = segments;
    this.move = function(x, y) {
        for (let i = this.segments.length - 1; i > 0; i--) {
            this.segments[i] = this.segments[i - 1];            
        }
        let head = this.segments[0];
        head.x += x;
        head.y += y;
    }
    this.draw = function() {
        let head = segments[0];
        for (let i = 1; i < segments.length; i++) {
            segments[i].draw(false);
        }
        head.draw(true);//head
        window.scrollTo(head.x - clientCenterX, head.y - clientCenterY);
    }
};

function drawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const yposition = (mouseClientY - clientCenterY);
    const xposition = (mouseClientX - clientCenterX);

    var gradient = yposition / xposition;

    if(Number.isNaN(gradient)) {
        gradient = 0;
    }

    let moveX = velocity / Math.sqrt(Math.pow(gradient, 2) + 1);
    let moveY = Math.sqrt(Math.pow(velocity, 2) - Math.pow(moveX, 2));

    //invert because of screen coordinates being upsite down.
    if(movingUp) {
        moveY *= -1;
    }
    if(movingLeft) {
        moveX *= -1;
    }

    //will need to change when remote snakes are included.
    for (let i = 0; i < snakes.length; i++) {
        const snakeItem = snakes[i];
        snakeItem.move(moveX, moveY);
        snakeItem.draw();
    }

    setTimeout(function () { window.requestAnimationFrame(drawAll); }, 1000 / fps);
}

function onLoad() {
    setCanvasSize();
    document.onmousemove = (e) => showCoOrdinates(e);
    window.scrollTo(centerX - clientCenterX, centerY - clientCenterY);

    var segments = [];
    for (let i = 0; i < 5; i++) {
        segments.push(new segment(centerX, centerY + (i * segmentRadius)));
    }
    snakes.push(new snake(segments));
    //add fps delay on this call
    //window.requestAnimationFrame(drawAll);
    drawAll();
}

function showCoOrdinates(event) {
    var span = document.getElementById("coords");
    span.innerHTML = "Page:(" + event.pageX + "," + event.pageY + "), Client:(" + event.clientX + "," + event.clientY + ")";

    //todo: remove this use gradient.
    movingUp = event.clientY < clientCenterY;
    movingLeft = event.clientX < clientCenterX;

    mouseClientX = event.clientX;
    mouseClientY = event.clientY;
}
