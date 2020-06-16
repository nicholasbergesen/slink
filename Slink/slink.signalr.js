"use strict"

const updateFrequency = 25; //same as server broadcast. 1 more than the fps
const updateRate = 1000 / updateFrequency;
let remoteSnakes = [];

//make some ui regarding user diconnects/slow connection indications.
class slinkHubR {
    constructor() {
        this._isLoaded = false;
        this.myHubProxy = $.connection.slinkHub;
        let that = this;

        this.myHubProxy.client.updatePositions = this.updatePositions;
        this.myHubProxy.client.addSnake = this.addSnake;
        this.myHubProxy.client.addSnakes = this.addSnakes;
        this.myHubProxy.client.removeSnake = this.removeSnake;

        $.hubConnection().error(function (error) {
            console.log('SignalR error: ' + error)
        });

        //connect to hub.
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

        $.connection.hub.disconnected = this.reconnect();
    }

    addSnake(newSnake) {
        remoteSnakes.push(snake.newRemoteSnake(newSnake.connectionId, newSnake.name, newSnake.segments, newSnake.moveX, newSnake.moveY));
    }

    addSnakes(newSnakes) {
        for (var i = 0; i < newSnakes; i++) {
            let newSnake = newSnakes[i];
            remoteSnakes.push(snake.newRemoteSnake(newSnake.connectionId, newSnake.name, newSnake.segments, newSnake.moveX, newSnake.moveY));
        }
    }

    removeSnake(removeSnakeId) {
        for (var i = 0; i < remoteSnakes; i++) {
            if (remoteSnakes[i].snakeId === removeSnakeId) {
                remoteSnakes.splice(i, 1);
                break;
            }
        }
    }

    updatePositions(snakeUpdates) {
        for (var i = 0; i < remoteSnakes.length; i++) {
            let currentSnake = remoteSnakes[i];
            let remoteSnake = snakeUpdates.find(function (element) {
                return element.name === currentSnake.name;
            });;
            if (remoteSnake) {
                currentSnake.setAcceleration(remoteSnake.isAccelerating);
                currentSnake.moveX = remoteSnake.moveX;
                currentSnake.moveY = remoteSnake.moveY;
            }
            else {
                //remove snake from the collection if its not longer returned from the server.
                //(snake died, explode into little snake food)
            }
        }
    }

    reconnect() {
        console.log("disconnected");
        //setTimeout(function () {
        //    console.log("reconnecting...");
        //    $.connection.hub.start()
        //        .done(function () { console.log("reconnected."); })
        //        .fail(function () { console.log("failed to reconnect."); });
        //}, 5000);
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