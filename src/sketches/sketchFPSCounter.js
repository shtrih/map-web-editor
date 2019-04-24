import FPSCounter from '../modules/FPSCounter'

export default function sketchFPSCounter(p) {
    let counter,
        x = 0,
        y = 0,
        width = 100,
        height = 50
    ;

    p.setup = function () {
        p.createCanvas(width, height);
        counter = new FPSCounter(x, y, width, height, p);
    };

    p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
        x = +(props.x || x);
        y = +(props.y || y);
        width = +(props.width || width);
        height = +(props.height || height);

        p.resizeCanvas(width + x, height + y);
        p.background(255);

        counter = new FPSCounter(x, y, width, height, p);
    };

    p.draw = function () {
        counter.draw();
    };
}
