export default function sketch(p) {
    let loopAllowed = false;
    let mapWidth = 30;
    let mapHeight = 30;
    let zoomLevel = 1;

    let dragMode = "move";

    let mapArray = [];


    const tileSize = 10;
    let pixelOffsetX = 0,
        pixelOffsetY = 0;

    p.setup = function () {
        const parentEl = document.getElementById('mapEditor');
        console.log({parentEl, clW: parentEl.clientWidth, clH: parentEl.clientHeight});
        p.createCanvas(parentEl.clientWidth, parentEl.clientHeight);

        // TODO: Replace this with code that centers the field
        pixelOffsetX = 100;
        pixelOffsetY = 100;
        zoomLevel = 2.5;

        loopAllowed = true;

        for (let i = 0; i < mapHeight; i++)
            mapArray.push(new Array(mapWidth));

        console.table(mapArray);
    };

    p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
        console.log('myCustomRedrawAccordingToNewPropsHandler', props);
    };

    p.draw = function () {
        if (!loopAllowed) {
            return;
        }

        // analyzeCursor();
        p.background(150);

        renderBoard();
        // for (let i = 0; i < 10; i++) {
        //     let x = i * (tileSize * zoomLevel) + pixelOffsetX;
        //     p.line(x, 0, x, p.height);
        //     let y = i * (tileSize * zoomLevel) + pixelOffsetY;
        //     p.line(0, y, p.width, y);
        // }

        p.fill(255);
        p.ellipse(p.mouseX, p.mouseY, 5, 5);
    };

    function analyzeCursor() {
        const adjTileSize = (tileSize * zoomLevel);
        const adjX = (p.mouseX - pixelOffsetX);
        const adjY = (p.mouseY - pixelOffsetY);

        if (adjX < 0 || adjY < 0) return;

        const currRow = p.floor(adjX / adjTileSize);
        const currCol = p.floor(adjY / adjTileSize);

        if (currRow >= mapArray.length || currCol >= mapArray[currRow].length)
            return;

        // console.log({
        //     tileSize,
        //     zoomLevel,
        //     mouseX: p.mouseX,
        //     mouseY: p.mouseY,
        //     pixelOffsetX,
        //     pixelOffsetY,
        //     adjX,
        //     adjY,
        //     currRow,
        //     currCol
        // });

        if (p.abs(adjX - adjTileSize * mapArray[currRow].length) < 10) {
            p.cursor('col-resize');
            // console.log("Hello")
            dragMode = "resize";
        } else if (p.abs(adjY - adjTileSize * mapArray.length) < 10) {
            p.cursor('row-resize');
            dragMode = "resize";
        } else {
            p.cursor('default');
            dragMode = "move";
        }
    }

    function renderBoard() {
        const adj = (val) => val * tileSize * zoomLevel;

        p.textSize(tileSize / 2 * zoomLevel);

        // TODO: Базироваться на текущих размерах карты
        p.fill(255);
        p.rect(pixelOffsetX, pixelOffsetY, 
            adj(30),
            adj(30));

        // Проанализировать и нарисовать сверху поля необходимые тайлы
        for (let i = 0; i < mapArray.length; i++)
            for (let j = 0; j < mapArray[i].length; j++) {
                let tile = mapArray[i][j];

                let x = adj(j) + pixelOffsetX;
                let y = adj(i) + pixelOffsetY;
                //p.rect(x, y, tileSize * zoomLevel, tileSize * zoomLevel);

                let hS = (tileSize * zoomLevel) / 2;

                if (j === 0) {
                    p.fill(0);
                    p.text(`${i + 1}`, x - hS, y + hS);
                    p.line(pixelOffsetX, y, pixelOffsetX + adj(30), y);
                }
                if (i === 0) {
                    p.fill(0);
                    p.text(`${j + 1}`, x + hS, y - hS);
                    p.line(x, pixelOffsetY, x, pixelOffsetY + adj(30));
                }
            }
    }

    // p.windowResized = function () {
    //     p.resizeCanvas(p.windowWidth * (8 / 12), p.windowHeight);
    // };

    p.mouseWheel = function (event) {
        if (p.mouseX < 0 || p.mouseX > p.width ||
            p.mouseY < 0 || p.mouseY > p.height) return;

        const adjX = (p.mouseX - pixelOffsetX);
        const adjY = (p.mouseY - pixelOffsetY);

        let postZoomX = 0,
            postZoomY = 0;    
        
        if (event.deltaY < 0) {
            zoomLevel *= 1.1;
            postZoomX = adjX * 1.1;
            postZoomY = adjY * 1.1;
        } else {
            zoomLevel /= 1.1;
            postZoomX = adjX / 1.1;
            postZoomY = adjY / 1.1;
        }
        
        pixelOffsetX += adjX - postZoomX;
        pixelOffsetY += adjY - postZoomY;
    };

    p.mouseDragged = function (event) {
        if (p.mouseX < 0 || p.mouseX > p.width ||
            p.mouseY < 0 || p.mouseY > p.height) return;

        if (dragMode === "move") {

            pixelOffsetX += p.mouseX - p.pmouseX;
            pixelOffsetY += p.mouseY - p.pmouseY;
        } else {

        }
    };
}
