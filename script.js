'use strict'
const totalWidth = 10000;
const totalHeight = 10000;

const centerX = (totalWidth / 2);
const centerY = (totalHeight / 2);
const clientCenterX = (window.innerWidth / 2);
const clientCenterY = (window.innerHeight / 2);

const canvasId = "canvas";
const velocity = 2;
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

function segment(x, y){
    this.x = x;
    this.y = y;

    this.draw = function(isHead) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.arc(segment.x, segment.y, 30, 0, 2 * Math.PI);
        if(isHead){
            ctx.fillStyle = 'green';
        }
        else {
            ctx.strokeStyle = 'brown';
            ctx.fillStyle = 'blue';
        }
        ctx.fill();
    }
}

function snake(segments) {
    this.segments = segments;
    this.move = function(x, y) {
        this.segments.pop();
        let head = this.segments[0];
        this.segments.push(new segment(head.x + x, head.y + y))
    }
    this.draw = function() {
        let head = segments[0];
        head.draw(true);//head
        for (let i = 1; i < segments.length; i++) {
            segments[i].draw(false);
        }
        window.scrollTo(head.x, head.y);
    }
};

function drawAll() {
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const yposition = (mouseClientY - clientCenterY);
    const xposition = (mouseClientX - clientCenterX);
    var gradient = yposition / xposition;

    if(Number.isNaN(gradient)) {
        gradient = 1;
    }

    let moveX = velocity / Math.sqrt(Math.pow(gradient, 2) + 1);
    let moveY = Math.sqrt(Math.pow(velocity, 2) - Math.pow(moveX, 2));

    //invert because of screen coordinates being upsite down.
    moveX *= -1;
    moveY *= -1;

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
    window.scrollTo(centerX - window.innerWidth / 2, centerY - window.innerHeight / 2);

    var segments = [];
    for (let i = 0; i < 5; i++) {
        segments.push(new segment(centerX, centerY + i));
    }
    snakes.push(new snake(segments));

    //add fps delay on this call
    window.requestAnimationFrame(drawAll);
}

function showCoOrdinates(event) {
    var span = document.getElementById("coords");
    span.innerHTML = "Page:(" + event.pageX + "," + event.pageY + "), Client:(" + event.clientX + "," + event.clientY + ")";

    //todo: remove this use gradient.
    movingUp = event.clientY < (window.innerHeight / 2);
    movingLeft = event.clientX < (window.innerWidth / 2);

    mouseClientX = event.clientX;
    mouseClientY = event.clientY;
}
