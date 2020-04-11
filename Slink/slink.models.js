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