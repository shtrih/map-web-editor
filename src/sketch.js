export default function sketch(p) {
    class MapList {
        constructor() {
            this.blocks = {};
        }
        
        get(x, y) {
            return this.blocks[`${x}:${y}`];
        }
        set(x, y, val) {
            this.blocks[`${x}:${y}`] = val;

            if (this.blockExists(x, y + 1)) {
                this.get(x, y + 1).updateConnections();
            }
            if (this.blockExists(x, y - 1)) {
                this.get(x, y - 1).updateConnections();
            }
            if (this.blockExists(x + 1, y)) {
                this.get(x + 1, y).updateConnections();
            }
            if (this.blockExists(x - 1, y)) {
                this.get(x - 1, y).updateConnections();
            }
        }
        blockExists(x, y) {
            return (this.blocks[`${x}:${y}`] !== undefined);
        }
        loopThrough(f) {
            for (let blockName in this.blocks) {
                f(this.blocks[blockName]);
            }
        }
    }

    let loopAllowed = false,
        zoomLevel = 1,
        dragMode = "move",
        mapList = new MapList(),
        mapMax = {x: 0, y: 0},
        pixelOffsetX = 0,
        pixelOffsetY = 0,
        movingCanvas = false,
        dragging = false,
        showExpandButtons = true,
        
        ghostFigure = null,

        activeAsset = null,
        activeImage = null,
        activeImageLabel = null,
        tileSizeZoomed = null,
        textOffset = null,
        adjWidth = null,
        adjHeight = null
    ;
    const tileSize = 100,
        mapWidth = 30,
        mapHeight = 30,
        minGridRenderZoom = 0.25,
        gridOpacityZoom = 0.35
    ;

    class MapBlock {
        constructor(x, y, origin) {
            this.x = x;
            this.y = y;

            this.connections = {
                left:  mapList.blockExists(x - 1, y),
                right: mapList.blockExists(x + 1, y),
                up:    mapList.blockExists(x, y - 1),
                down:  mapList.blockExists(x, y + 1)
            }

            console.log({x, y, conn: this.connections});

            this.tiles = [];
            for (let i = 0; i < mapHeight; i++) {
                this.tiles.push(new Array(mapWidth));
            }
        }

        updateConnections() {
            this.connections = {
                left:  mapList.blockExists(this.x - 1, this.y),
                right: mapList.blockExists(this.x + 1, this.y),
                up:    mapList.blockExists(this.x, this.y - 1),
                down:  mapList.blockExists(this.x, this.y + 1)
            }
        }

        draw() {
            const tiles = this.tiles; 
            // console.log({x, y, tiles});
            const blockPixelOffsetX = pixelOffsetX + adjWidth * this.x;
            const blockPixelOffsetY = pixelOffsetY + adjHeight * this.y;

            p.fill(255);
            p.stroke(0);
            p.strokeWeight(2);
            p.rect(
                blockPixelOffsetX, 
                blockPixelOffsetY, 
                adjWidth,
                adjHeight,
            );

            // Проанализировать и нарисовать сверху поля необходимые тайлы
            for (let i = 0; i < mapHeight; i++) {
                let y = adj(i) + blockPixelOffsetY;

                for (let j = 0; j < mapWidth; j++) {
                    let tile = tiles[i][j];

                    let x = adj(j) + blockPixelOffsetX;
                    //p.rect(x, y, tileSize * zoomLevel, tileSize * zoomLevel);

                    if (tile) {
                        // FIXME: Избежать создание функций в цикле
                        loadImage(tile.img)
                            .then(img => {
                                p.image(img, x, y, tileSizeZoomed, tileSizeZoomed)
                            })
                            .catch(console.error);
                    }

                    if (zoomLevel >= minGridRenderZoom) {

                        let transparencyLevel;
                        if (zoomLevel >= gridOpacityZoom) {
                            transparencyLevel = 255;
                        }
                        else {
                            transparencyLevel = p.map(gridOpacityZoom - zoomLevel, 0, gridOpacityZoom - minGridRenderZoom, 255, 0);
                        }

                        if (j === 0) {
                            p.stroke(0, transparencyLevel);
                            p.strokeWeight(1);

                            p.line(blockPixelOffsetX, y, blockPixelOffsetX + adjWidth, y);
                            // p.text(mapHeight * this.y + i + 1, x - textOffset, y + textOffset);
                        }
                        if (i === 0) {
                            p.stroke(0, transparencyLevel);
                            p.strokeWeight(1);

                            p.line(x, blockPixelOffsetY, x, blockPixelOffsetY + adjHeight);
                            // p.text(mapWidth * this.x + j + 1, x + textOffset, y - textOffset);
                        }
                    }
                }
            } 
        }
        drawButtons() {
            for (let label in this.connections) {
                if (this.connections[label]) {
                    continue;
                }

                p.push();
                p.fill(200);
                p.strokeWeight(1);
                p.stroke(0, 20);
                // p.translate(p.width / 2, p.height / 2);

                const blockPixelOffsetX = pixelOffsetX + adjWidth * this.x;
                const blockPixelOffsetY = pixelOffsetY + adjHeight * this.y;

                let mouseXOffset, 
                    mouseYOffset
                ;

                switch(label) {
                    case "left":
                        p.translate(-20 + blockPixelOffsetX, adjHeight / 2 + blockPixelOffsetY);
                        mouseXOffset = -20 + blockPixelOffsetX;
                        mouseYOffset = adjHeight / 2 + blockPixelOffsetY;
                        
                        p.rotate(-p.PI / 2);
                        break;
                    case "right":
                        p.translate(adjWidth + blockPixelOffsetX + 20, adjHeight / 2 + blockPixelOffsetY);
                        mouseXOffset = adjWidth + blockPixelOffsetX + 20;
                        mouseYOffset = adjHeight / 2 + blockPixelOffsetY;

                        p.rotate(p.PI / 2);
                        break;
                    case "up":
                        p.translate(adjWidth / 2 + blockPixelOffsetX, -20 + blockPixelOffsetY);
                        mouseXOffset = adjWidth / 2 + blockPixelOffsetX;
                        mouseYOffset = -20 + blockPixelOffsetY;
                        break;
                    case "down":
                        p.translate(adjWidth / 2 + blockPixelOffsetX, 20 + blockPixelOffsetY + adjHeight);
                        mouseXOffset = adjWidth / 2 + blockPixelOffsetX;
                        mouseYOffset = 20 + blockPixelOffsetY + adjHeight;

                        p.rotate(p.PI);
                        break;

                    default:
                        throw new Error('No such direciton label:', label);
                }
                p.triangle(-20, 10, 0, -10, 20, 10);
                // FIXME:
                // if (ptInTriangle(p.mouseX - mouseXOffset, p.mouseY - mouseYOffset, -20, 10, 0, -10, 20, 10)) {
                // Временно для ускорения написания вместо просчитывания столкновения мыши с треугольником использую круглый хитбокс
                // Код выше РАБОТАЕТ, но всегда предпологает, что треугольник смотрит ВВЕРХ
                if (p.dist(p.mouseX - mouseXOffset, p.mouseY - mouseYOffset, 0, 0) <= 18) {
                    if (dragMode === "draw") {
                        p.cursor('pointer');
                    }

                    if (p.mouseIsPressed) {
                        console.log('Intersection w/', label, 'on block x:', this.x, 'y:', this.y);
                        let newBlockX = this.x,
                            newBlockY = this.y
                        ;

                        switch(label) {
                            case "left":
                                newBlockX--;
                                break;
                            case "right":
                                newBlockX++;
                                break;
                            case "up":
                                newBlockY--;
                                break;
                            case "down":
                                newBlockY++;
                                break;
        
                            default:
                                throw new Error('No such direciton label:', label);
                        }

                        mapList.set(newBlockX, newBlockY, new MapBlock(newBlockX, newBlockY, this));
                    }
                }

                p.pop();
            }
        }
    }

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
        
        mapList.set(0, 0, new MapBlock(0, 0));
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
            console.log("fps:", p.frameRate(), "mapList:", mapList);
        }

        if (!loopAllowed) {
            return;
        }

        analyzeMouseGlobal();
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

    function analyzeMouseGlobal() {
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
        
        adjWidth = adj(mapWidth);
        adjHeight = adj(mapHeight);

        mapList.loopThrough(block => {
            block.draw();

            if (showExpandButtons) {
                block.drawButtons();
            }
        });

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

        console.log("zoomLevel:", zoomLevel);
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

        let currRow = p.floor(adjX / adjTileSize);
        let currCol = p.floor(adjY / adjTileSize);

        const mapBlockX = p.floor(currRow / mapWidth);
        const mapBlockY = p.floor(currCol / mapHeight);
        
        console.log('pre', {currRow, currCol});

        // Нормализировать currRow и currRow
        if (currRow < 0) {
            currRow = mapWidth - p.abs(currRow) % mapWidth;
        }
        else {
            currRow = p.abs(currRow) % mapWidth;
        }

        if (currCol < 0) {
            currCol = mapHeight - p.abs(currCol) % mapHeight;
        }
        else {
            currCol = p.abs(currCol) % mapHeight;
        }

        console.log('post', {currRow, currCol});

        if (dragMode !== "move" 
            && (currRow < 0 
            || currCol < 0
            || !mapList.blockExists(mapBlockX, mapBlockY))
        ) {
            return;
        }

        const block = mapList.get(mapBlockX, mapBlockY);

        if (dragMode === "move") {
            p.cursor('grabbing');
            movingCanvas = true;
            pixelOffsetX += p.mouseX - p.pmouseX;
            pixelOffsetY += p.mouseY - p.pmouseY; 
        } else if (dragMode === "draw") {
            if (activeImageLabel) {
                block.tiles[currCol][currRow] = {img: activeImageLabel};
            }

        } else if (dragMode === "erase") {
            block.tiles[currCol][currRow] = null;
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

// Проверяет, если точка находится внутри треугольника (я внаглую стырил это отсюда 
// https://stackoverflow.com/questions/2049582/how-to-determine-if-a-point-is-in-a-2d-triangle)
/*function ptInTriangle(px, py, p0x, p0y, p1x, p1y, p2x, p2y) {
    let p = {x: px, y: py},
        p0 = {x: p0x, y: p0y},
        p1 = {x: p1x, y: p1y},
        p2 = {x: p2x, y: p2y}
    ;

    let A = 1/2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
    let sign = A < 0 ? -1 : 1;
    let s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
    let t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;
    
    return s > 0 && t > 0 && (s + t) < 2 * A * sign;
}*/