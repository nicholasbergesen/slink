﻿"use strict"

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
    
    canvas.onmousemove = (e) => updateTouchCoOrdinates(e);
    canvas.onmousedown = (e) => accelerate(e);
    canvas.onmouseup = (e) => normalSpeed(e);
    canvas.touchstart = (e) => updateCoOrdinates(e);
    clientName.onkeyup = (e) => onKeyUp(e);
    clientName.focus();
}

let isUpdating = false;
let lastX = 0;
let lastY = 0;

function updateTouchCoOrdinates(event) {
    if (mySnake != undefined) {
        mySnake.setMoveDirection(event.pageX, event.pageY);
    }
}

function updateCoOrdinates(event) {
    //added a delay to posting updated positions to help
    //keep co-ordinates in  sync with other clients.
    if (mySnake != undefined) {
        if (!isUpdating) {
            isUpdating = true;

            setTimeout(function () {
                mySnake.setMoveDirection(lastX, lastY);
                isUpdating = false;
            }, 100);
        } else {
            lastX = event.pageX;
            lastY = event.pageY;
        }
    }
}

function accelerate(event) {
    //make the accelerate affects snake specific.
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
