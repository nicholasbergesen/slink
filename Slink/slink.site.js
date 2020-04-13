"use strict"

const totalWidth = 5000;
const totalHeight = 5000;
const canvasId = "canvas";
const clientName = document.getElementById("clientName");
const status = document.getElementById("status");

function onLoad() {
    window.addEventListener('contextmenu', function (e) { e.preventDefault(); }, false);
    let canvas = document.getElementById(canvasId);
    canvas.width = totalWidth;
    canvas.height = totalHeight;
    
    canvas.onmousemove = (e) => updateCoOrdinates(e);
    canvas.onmousedown = (e) => accelerate(e);
    canvas.onmouseup = (e) => normalSpeed(e);
    clientName.onkeyup = (e) => onKeyUp(e);
    clientName.focus();
}

function updateCoOrdinates(event) {
    //add a slight delay to this. (debounce, to prevent update spam)
    if (mySnake != undefined) {
        mySnake.setMoveDirection(event.pageX, event.pageY);
    }
}

function accelerate(event) {
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 2;
    ctx.shadowColor = "orange";
    if (mySnake != undefined) {
        mySnake.setAcceleration(true);
        mySnake.setMoveDirection(event.pageX, event.pageY);
    }
}

function normalSpeed(event) {
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;
    if (mySnake != undefined) {
        mySnake.setAcceleration(false);
        mySnake.setMoveDirection(event.pageX, event.pageY);
    }
}

function onKeyUp(event) {
    if (event.keyCode === 13) {
        start();
    }
}
