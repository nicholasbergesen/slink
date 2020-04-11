class slinkHubR {
    constructor() {
        this.isLoaded = false;
        this.slinkHub = $.connection.slinkHub;
        $.connection.hub.start().done(function () {
            this.isLoaded = true;
        });
    }

    register(name) {
        if (this.isLoaded) {
            this.slinkHub.register(name);
        }
    }
}