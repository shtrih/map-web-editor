export default class FPSCounter {
    constructor(x, y, width, height, p5) {
        let posX = x,
            maxX = x + width,
            rate,
            percentile,
            fontSize = 12,
            numberOffset = fontSize + 2,
            bottomPosY = y + height - numberOffset
        ;

        this._draw = function () {
            posX++;
            if (posX > maxX) {
                posX = x;
            }

            rate = p5.frameRate();

            // clean old number
            p5.noStroke();
            p5.fill(255);
            p5.rect(x, bottomPosY + 1, maxX, numberOffset);

            // FPS number
            p5.textAlign(p5.CENTER, p5.TOP);
            p5.textSize(fontSize);
            p5.fill(255 - rate * 3, rate * 3, 0);
            p5.text(rate.toFixed(1), x + width / 2, bottomPosY + 3);

            // colored FPS lines
            percentile = (height - numberOffset) / 70 * rate;
            p5.stroke(255 - rate * 3, rate * 3, 0);
            p5.line(posX, bottomPosY, posX, bottomPosY - percentile);

            // clear old longer lines
            p5.stroke(255);
            p5.line(posX, y, posX, bottomPosY - percentile - 1);

            // and show a leading empty line
            p5.stroke(255);
            p5.line(posX + 1, y, posX + 1, bottomPosY);
        }
    }

    draw() {
        this._draw();
    }
}
