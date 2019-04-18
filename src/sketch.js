export default function sketch(p) {
    let loopAllowed = false,
        mapWidth = 30,
        mapHeight = 30,
        zoomLevel = 1,
        dragMode = "move",
        mapArray = [],
        pixelOffsetX = 0,
        pixelOffsetY = 0,
        movingCanvas = false,
        dragging = false,
        
        ghostFigure = null,

        activeAsset = null,
        activeImage = null,
        activeImageLabel = null,
        tileSizeZoomed = null,
        textOffset = null
    ;
    const tileSize = 100;
        // cursorTileSize = 50;

    p.setup = function () {
        const parentEl = document.getElementById('mapEditor');
        p.createCanvas(parentEl.clientWidth, parentEl.clientHeight);

        // TODO: Replace this with code that centers the field
        pixelOffsetX = 100;
        pixelOffsetY = 100;
        zoomLevel = 0.5;

        tileSizeZoomed = tileSize * zoomLevel;
        textOffset = tileSizeZoomed / 2;

        loopAllowed = true;

        for (let i = 0; i < mapHeight; i++) {
            mapArray.push(new Array(mapWidth));
        }
    };

    const imgCache = {};
    function loadImage(name) {
        return new Promise((res, rej) => {
            if (imgCache[name]) {
                return res(imgCache[name]);
            }

            p.loadImage(`/images/objects/${name}.jpg`, img => {
                imgCache[name] = img;
                res(img);
            });
        });
    }

    // function loadImage(name) {
    //     if (imgCache[name]) {
    //         return imgCache[name];
    //     }
    // }

    p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
        console.log('myCustomRedrawAccordingToNewPropsHandler', props);

        if (props.activeAsset) {
            loadImage(props.activeAsset.img)
                .then(img => {
                    activeImage = img; 
                    activeImageLabel = props.activeAsset.img;
                })
                .catch(console.error);
        }
    };

    p.draw = function () {
        if (p.frameCount % 200 === 0) {
            console.log(p.frameRate());
        }

        if (!loopAllowed) {
            return;
        }

        analyzeMouse();
        analyzeKeyboard();
        p.background(150);

        renderBoard();

        if (ghostFigure) {
            loadImage(ghostFigure.img)
                .then(img => {
                    p.push();
                        p.tint(0, 255, 0, 128);
                        p.image(img, adj(ghostFigure.x) + pixelOffsetX, adj(ghostFigure.y) + pixelOffsetY, tileSizeZoomed, tileSizeZoomed);
                    p.pop();
                });
        }
        // for (let i = 0; i < 10; i++) {
        //     let x = i * (tileSize * zoomLevel) + pixelOffsetX;
        //     p.line(x, 0, x, p.height);
        //     let y = i * (tileSize * zoomLevel) + pixelOffsetY;
        //     p.line(0, y, p.width, y);
        // }

        let cursorTileSize = tileSize * zoomLevel / 2;
        const imageOffset = 15;

        if (dragMode === "draw") {
            /*if (activeImage) {
                p.image(activeImage, p.mouseX + imageOffset, p.mouseY + imageOffset, cursorTileSize, cursorTileSize);
            }
            else {
                p.fill(255);
                p.rect(p.mouseX + imageOffset, p.mouseY + imageOffset, cursorTileSize, cursorTileSize);
            }*/
        }

        if (dragging) {
            analyzeDrag();
        }
    };

    function analyzeKeyboard() {
        // Space
        if (p.keyIsDown(32)) {
            dragMode = "move";
            if (!movingCanvas) p.cursor('grab');
        }
        else if (p.keyIsDown(p.SHIFT)) {
            dragMode = "erase";
            p.cursor('crosshair');
        }
        else {
            dragMode = "draw";
            p.cursor('default');
        }
    }

    function analyzeMouse() {
        if (p.mouseX < 0
            || p.mouseX >= p.width
            || p.mouseY < 0
            || p.mouseY >= p.height
        ) {
            return;
        }

        const adjTileSize = (tileSize * zoomLevel);
        const adjX = (p.mouseX - pixelOffsetX);
        const adjY = (p.mouseY - pixelOffsetY);

        const currRow = p.floor(adjX / adjTileSize);
        const currCol = p.floor(adjY / adjTileSize);

        // console.log(p.mouseX, p.mouseY, currRow, currCol);
        
        if (dragMode === "draw" && activeImageLabel) {
            ghostFigure = {
                x: currRow, 
                y: currCol,
                img: activeImageLabel,
            };
        }
        else {
            ghostFigure = null;
        }
    }

    function adj(val) {
        return val * tileSize * zoomLevel;
    }

    function renderBoard() {
        p.textSize(tileSize / 2 * zoomLevel);

        // TODO: Базироваться на текущих размерах карты
        p.fill(255);
        p.rect(
            pixelOffsetX, 
            pixelOffsetY, 
            adj(30),
            adj(30),
        );

        // Проанализировать и нарисовать сверху поля необходимые тайлы
        for (let i = 0; i < mapArray.length; i++) {
            let y = adj(i) + pixelOffsetY;

            for (let j = 0; j < mapArray[i].length; j++) {
                let tile = mapArray[i][j];

                let x = adj(j) + pixelOffsetX;
                //p.rect(x, y, tileSize * zoomLevel, tileSize * zoomLevel);

                if (tile) {
                    loadImage(tile.img)
                        .then(img => {
                            p.image(img, x, y, tileSizeZoomed, tileSizeZoomed)
                        })
                        .catch(console.error);
                }

                if (j === 0) {
                    p.fill(0);
                    p.line(pixelOffsetX, y, pixelOffsetX + adj(mapArray[i].length), y);
                    p.text(i + 1, x - textOffset, y + textOffset);
                }
                if (i === 0) {
                    p.fill(0);
                    p.line(x, pixelOffsetY, x, pixelOffsetY + adj(mapArray.length));
                    p.text(j + 1, x + textOffset, y - textOffset);
                }
            }
        }
    }

    // p.windowResized = function () {
    //     p.resizeCanvas(p.windowWidth * (8 / 12), p.windowHeight);
    // };

    p.mouseWheel = function (event) {
        if (p.mouseX < 0
            || p.mouseX >= p.width
            || p.mouseY < 0
            || p.mouseY >= p.height
        ) {
            return;
        }

        const adjX = p.mouseX - pixelOffsetX,
            adjY = p.mouseY - pixelOffsetY,
            zoomCoefficient = 1.1
        ;

        let postZoomX = 0,
            postZoomY = 0;

        if (event.deltaY < 0) {
            zoomLevel *= zoomCoefficient;
            postZoomX = adjX * zoomCoefficient;
            postZoomY = adjY * zoomCoefficient;
        }
        else {
            zoomLevel /= zoomCoefficient;
            postZoomX = adjX / zoomCoefficient;
            postZoomY = adjY / zoomCoefficient;
        }

        pixelOffsetX += adjX - postZoomX;
        pixelOffsetY += adjY - postZoomY;

        tileSizeZoomed = tileSize * zoomLevel;
        textOffset = tileSizeZoomed / 2;
    };

    // Используем свои переменные нарочно 
    // (я не использую p.pmouseX и p.pmouseY т.к. они обновляются всегда, а не когда мне нужно)
    let dragPrevX = -1, dragPrevY = -1; 
    function analyzeDrag() {
        if (dragPrevX === p.mouseX && dragPrevY === p.mouseY) {
            return;
        }

        if (p.mouseX < 0
            || p.mouseX >= p.width
            || p.mouseY < 0
            || p.mouseY >= p.height
        ) {
            return;
        }

        const adjTileSize = (tileSize * zoomLevel);
        const adjX = p.mouseX - pixelOffsetX;
        const adjY = p.mouseY - pixelOffsetY;

        const currRow = p.floor(adjX / adjTileSize);
        const currCol = p.floor(adjY / adjTileSize);

        if (dragMode !== "move" 
            && (currRow < 0 
            || currCol < 0 
            || currCol >= mapArray.length 
            || currRow >= mapArray[0].length)
        ) {
            return;
        }

        if (dragMode === "move") {
            p.cursor('grabbing');
            movingCanvas = true;
            pixelOffsetX += p.mouseX - p.pmouseX;
            pixelOffsetY += p.mouseY - p.pmouseY;
        } else if (dragMode === "draw") {
            if (activeImageLabel) {
                mapArray[currCol][currRow] = {img: activeImageLabel};
            }

        } else if (dragMode === "erase") {
            mapArray[currCol][currRow] = null;
        }

        dragPrevX = p.mouseX;
        dragPrevY = p.mouseY;
    };

    p.mousePressed = function (event) {
        dragging = true;
    };

    p.mouseReleased = function (event) {
        movingCanvas = false;
        dragging = false;
    };
}
