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
        if ((props.x !== undefined && props.x != x)
            || (props.y !== undefined && props.y != y)
            || (props.width !== undefined && props.width != width)
            || (props.height !== undefined && props.height != height)
        ) {
            x = +props.x;
            y = +props.y;
            width = +props.width;
            height = +props.height;

            p.resizeCanvas(width + x, height + y);
            p.background(255);

            counter = new FPSCounter(x, y, width, height, p);
        }
    };

    p.draw = function () {
        counter.draw();
    };
}
