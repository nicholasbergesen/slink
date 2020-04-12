"use strict"

const updateFrequency = 10;
const updateRate = 1000 / updateFrequency;
let remoteSnakes = [];

//make some ui regarding user diconnects/ slow connection indications.
class slinkHubR {
    constructor() {
        this._isLoaded = false;
        this.myHubProxy = $.connection.slinkHub;
        let that = this;

        this.myHubProxy.client.updatePositions = this.updatePositions;
        this.myHubProxy.client.addSnake = this.addSnake;

        var connection = $.hubConnection();
        connection.error(function (error) {
            console.log('SignalR error: ' + error)
        });

        $.connection.hub.start()
            .done(function (e) {
                that._isLoaded = true;
                console.log("Connected");
                console.log(e);
            })
            .fail(function () {
                console.log("failed to connect");
                console.log(e);
            });

        $.connection.hub.disconnected(function () {
            console.log("disconnected");
            setTimeout(function () {
                console.log("reconnecting...");
                $.connection.hub.start()
                    .done(function () { console.log("reconnected."); })
                    .fail(function () { console.log("failed to reconnect."); });
            }, 5000);
        });
    }

    addSnake(newSnake) {
        remoteSnakes.push(snake.newHubSnake(newSnake.name, newSnake.segments, newSnake.moveX, newSnake.moveY));
    }

    updatePositions(snakeUpdates) {
        for (var i = 0; i < remoteSnakes.length; i++) {
            let currentSnake = remoteSnakes[i];
            let remoteSnake = snakeUpdates.find(function (element) {
                return element.name === currentSnake.name;
            });;
            if (remoteSnake) {
                currentSnake.setAcceleration(remoteSnake.isAccelerating);
                currentSnake.setMoveDirection(remoteSnake.moveX, remoteSnake.moveY);
            }
            else {
                //remove snake from the collection if its not longer returned from the server.
                //(snake died, explode into little snake food)
            }
        }
    }

    get isLoaded() {
        return this._isLoaded;
    }

    set isLoaded(x) {
        this._isLoaded = x;
    }

    updateServer(mySnake) {
        if (this._isLoaded) {
            this.myHubProxy.server.updatePosition(mySnake.toHubObject(false));
        }
    }

    registerNewSnake(mySnake) {
        if (this._isLoaded) {
            this.myHubProxy.server.register(mySnake.toHubObject(true));
        }
    }
}

let slinkHub = new slinkHubR();