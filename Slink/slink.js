'use strict'
const totalWidth = 3000;
const totalHeight = 3000;

const pageCenterX = (totalWidth / 2);
const pageCenterY = (totalHeight / 2);
const clientCenterX = (window.innerWidth / 2);
const clientCenterY = (window.innerHeight / 2);

const canvasId = "canvas";
const standardVelocity = 4;
const segmentRadius = 30;
const fps = 40;

let velocity = standardVelocity;
let mouseClientX = clientCenterX;
let mouseClientY = clientCenterY;
let snakes = [];
var ctx = document.getElementById(canvasId).getContext('2d');

function setCanvasSize() {
    let canvas = document.getElementById(canvasId);
    canvas.width = totalWidth;
    canvas.height = totalHeight;
}

class segment {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.draw = function (isHead) {
            ctx.beginPath();
            ctx.moveTo(this.x + segmentRadius, this.y);
            ctx.arc(this.x, this.y, segmentRadius, 0, 2 * Math.PI);
            if (isHead) {
                ctx.fillStyle = "#32CDBF";
            }
            else {
                ctx.strokeStyle = "#E2B705";
                ctx.fillStyle = "#51BF62";
            }
            ctx.fill();
            ctx.stroke();
        };
    }
}

class snake {
    constructor(segments) {
        this.segments = segments;
        this.move = function (x, y) {
            let head = this.segments[0];
            head.x += x;
            head.y += y;
            for (let i = this.segments.length - 1; i > 0; i--) {
                var rearSegment = this.segments[i];
                var nextSegment = this.segments[i - 1];
                var move = calculateMoveTo(rearSegment.x, rearSegment.y, nextSegment.x, nextSegment.y, velocity);
                rearSegment.x += move.x;
                rearSegment.y += move.y;
            }
        };
        this.draw = function () {
            let head = segments[0];
            for (let i = segments.length - 1; i > 0; i--) {
                segments[i].draw(false);
            }
            head.draw(true); //head
            ctx.font = '17px Arial';
            ctx.fillStyle = 'Black';
            ctx.fillText('Noob worm', head.x, head.y + 50);
            window.scrollTo(head.x - clientCenterX, head.y - clientCenterY);
        };
    }
}

function drawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    //will need to change when remote snakes are included.
    for (let i = 0; i < snakes.length; i++) {
        const snakeItem = snakes[i];
        var move = calculateMoveTo(clientCenterX, clientCenterY, mouseClientX, mouseClientY, velocity);
        snakeItem.move(move.x, move.y);
        snakeItem.draw();
    }

    setTimeout(function () { window.requestAnimationFrame(drawAll); }, 1000 / fps);
}

function onLoad() {
    setCanvasSize();
    document.onmousemove = (e) => showCoOrdinates(e);
    document.onmousedown = (e) => accelerate(e);
    document.onmouseup = (e) => normalSleed(e);

    window.scrollTo(pageCenterX - clientCenterX, pageCenterY - clientCenterY);

    var segments = [];
    for (let i = 0; i < 50; i++) {
        segments.push(new segment(pageCenterX, pageCenterY + (i * velocity)));
    }
    snakes.push(new snake(segments));
    drawAll();
}

function showCoOrdinates(event) {
    mouseClientX = event.clientX;
    mouseClientY = event.clientY;
}

function accelerate(event) {
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 2;
    ctx.shadowColor = "orange";
    velocity *= 2;
}

function normalSleed(event) {
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;
    velocity = standardVelocity;
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