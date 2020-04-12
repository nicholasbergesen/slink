"use strict"

const segmentRadius = 30;
const startingSize = 50;

class segment {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(isHead) {
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
    }
}

class snake {
    constructor(name, segments, velocity) {
        this.name = name;
        this.segments = segments;
        this.velocity = velocity;
        this.isAccelerating = false;
    }

    setAcceleration(isAccelerating) {
        this.isAccelerating = isAccelerating;
        if (isAccelerating) {
            this.velocity = standardVelocity * speedBoostFactor;
        }
        else {
            this.velocity = standardVelocity;
        }
    }

    setMoveDirection(mouseX, mouseY) {
        let head = this.segments[0];
        let move = this.calculateMoveTo(head.x, head.y, mouseX, mouseY, this.velocity);
        this.moveX = move.x;
        this.moveY = move.y;
    }

    move() {
        let head = this.segments[0];
        head.x += this.moveX;
        head.y += this.moveY;

        for (let i = this.segments.length - 1; i > 0; i--) {
            var rearSegment = this.segments[i];
            var nextSegment = this.segments[i - 1];
            var move = this.calculateMoveTo(rearSegment.x, rearSegment.y, nextSegment.x, nextSegment.y, this.velocity);
            rearSegment.x += move.x;
            rearSegment.y += move.y;
        }
    }

    draw() {
        let head = this.segments[0];
        for (let i = this.segments.length - 1; i > 0; i--) {
            this.segments[i].draw(false);
        }
        head.draw(true); //trued for head
        ctx.font = '17px Arial';
        ctx.fillStyle = 'Black';
        ctx.fillText(this.name, head.x, head.y + 50);
        window.scrollTo(head.x - halfWindowWidth, head.y - halfWindowHeight);
    }

    //eq1:y = ax; (a is gradient between the 2 points)
    //eq2: x² + y² = r²
    //Use y in eq 1 to solve for x in eq 2, r is velovity (position you want to move to).
    calculateMoveTo(originx, originy, targetx, targety, r) {
        const yposition = (targety - originy);
        const xposition = (targetx - originx);

        var gradient = yposition / xposition;

        if (Number.isNaN(gradient)) {
            gradient = 0;
        }

        let moveX = r / Math.sqrt(Math.pow(gradient, 2) + 1);
        let moveY = Math.sqrt(Math.pow(r, 2) - Math.pow(moveX, 2));

        if (yposition < 0) {
            moveY *= -1;
        }
        if (xposition < 0) {
            moveX *= -1;
        }

        return {
            x: moveX,
            y: moveY
        };
    }

    toHubObject(includeSegments) {
        if (includeSegments) {
            return {
                name: this.name,
                moveX: this.moveX,
                moveY: this.moveY,
                isAccelerating: this.isAccelerating,
                segments: this.segments
            };
        }
        else {
            return {
                name: this.name,
                moveX: this.moveX,
                moveY: this.moveY,
                isAccelerating: this.isAccelerating,
            };
        }
    }

    static newHubSnake(name, segments, x, y) {
        var classSegments = [];

        for (let i = 0; i < segments.length; i++) {
            const curSeg = segments[i];
            classSegments.push(new segment(curSeg.x, curSeg.y + (i * standardVelocity)));
        }

        let newSnake = new snake(name, classSegments, standardVelocity);
        newSnake.setMoveDirection(x, y);
        return newSnake;
    }

    static newSnake(name, startingPosition) {
        var segments = [];

        for (let i = 0; i < startingSize; i++) {
            segments.push(new segment(startingPosition.x, startingPosition.y + (i * standardVelocity)));
        }

        let newSnake = new snake(name, segments, standardVelocity);
        newSnake.setMoveDirection(startingPosition.x, startingPosition.y);
        return newSnake;
    }
}