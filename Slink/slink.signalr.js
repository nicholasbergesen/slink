'use strict'

let isLoaded = false;

class slinkHubR {
    constructor() {
        this.slinkHub = $.connection.slinkHub;
        $.connection.hub.start().done(function () {
            isLoaded = true;
        });
    }

    register(name) {
        if (this.isLoaded) {
            this.slinkHub.register(name);
        }
    }
}