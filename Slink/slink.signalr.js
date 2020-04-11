'use strict'

let isLoaded = false;
const updateFrequency = 10;
const updateRate = 1000 / updateFrequency;
let slinkHub = $.connection.slinkHub;

class slinkHubR {
    constructor() {
        $.connection.hub.start().done(function () {
            isLoaded = true;

            slinkHub.client.updatePositions = function (remoteSnakes) {
                for (var i = 0; i < remoteSnakes.length; i++) {
                    let remoteSnake = remoteSnakes[i];
                    let localSnake = snakes[remoteSnake.connectionId];
                    localSnake.setAcceleration(remoteSnake.isAccelerating);
                    localSnake.setMoveDirection(remoteSnake.moveX, remoteSnake.moveY);
                }
            }

            slinkHub.client.addSnake = function (newSnake) {
                snakes[newSnake.connectionId] = snake.newHubSnake(newSnake.name, newSnake.segments, newSnake.moveX, newSnake.moveY);
            }
        });
    }

    updateServer() {
        if (isLoaded) {
            slinkHub.updatePosition(mySnake.toHubObject());
        }

        setTimeout(updateServer, updateRate);
    }

    register() {
        if (isLoaded) {
            slinkHub.register(mySnake.toHubObject());
        }
    }
}

