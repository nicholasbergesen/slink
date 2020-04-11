'use strict'

const totalWidth = 3000;
const totalHeight = 3000;
const canvasId = "canvas";
const clientName = document.getElementById("clientName");

let mousePageX;
let mousePageY;

function onLoad() {
    //window.addEventListener('contextmenu', function (e) { e.preventDefault(); }, false);
    let canvas = document.getElementById(canvasId);
    canvas.width = totalWidth;
    canvas.height = totalHeight;
    
    document.onmousemove = (e) => updateCoOrdinates(e);
    document.onmousedown = (e) => accelerate(e);
    document.onmouseup = (e) => normalSpeed(e);
}

function updateCoOrdinates(event) {
    mousePageX = event.pageX;
    mousePageY = event.pageY;
}

function accelerate(event) {
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 2;
    ctx.shadowColor = "orange";
    velocity *= 2;
}

function normalSpeed(event) {
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;
    velocity = standardVelocity;
}