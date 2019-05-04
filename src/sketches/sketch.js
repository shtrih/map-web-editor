import MapList from "../modules/MapList";
import {
    TILE_SIZE,
    MAP_WIDTH,
    MAP_HEIGHT,
    MOUSE_WHEEL_MODE,
} from '../modules/constants';

import loadImageMemo from '../modules/loadImageMemo';

export default function sketch(p) {
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

        activeImageLabel = null,
        tileSizeZoomed = null,
        adjBlockWidth = null,
        adjBlockHeight = null,
        tileImage = null,
        wheelMode = MOUSE_WHEEL_MODE.tileRotation
    ;
    p.setup = function () {
        const parentEl = document.getElementById('mapEditor');
        p.createCanvas(parentEl.clientWidth, parentEl.clientHeight);

        // TODO: Replace this with code that centers the field
        pixelOffsetX = TILE_SIZE;
        pixelOffsetY = TILE_SIZE;
        zoomLevel = 0.5;

        tileSizeZoomed = TILE_SIZE * zoomLevel;

        loopAllowed = true;
        adjBlockWidth = adj(MAP_WIDTH);
        adjBlockHeight = adj(MAP_HEIGHT);

        mapList
            .createBlock(0, 0)
            .renderToBuffer(p)
        ;
    };

    p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
        console.log('myCustomRedrawAccordingToNewPropsHandler', props);

        if (props.activeAsset) {
            loadImageMemo(props.activeAsset.img, p);
            activeImageLabel = props.activeAsset.img;
        }
        if (props.hotKeyActions.zoomIn) {
            zoom(true);
        }
        if (props.hotKeyActions.zoomOut) {
            zoom(false);
        }
        if (props.hotKeyActions.ctrlPressed) {
            wheelMode = MOUSE_WHEEL_MODE.zoom;
        }
        else {
            wheelMode = MOUSE_WHEEL_MODE.tileRotation;
        }
    };

    p.draw = function () {
        if (!loopAllowed) {
            return;
        }

        analyzeMouseGlobal();
        analyzeKeyboard();

        renderBoard();

        if (ghostFigure) {
            tileImage = loadImageMemo(ghostFigure.img, p);
            if (tileImage) {
                // region 'Image Tint'
                p.push();
                p.tint(0, 255, 0, 128);
                p.image(tileImage, adj(ghostFigure.x) + pixelOffsetX, adj(ghostFigure.y) + pixelOffsetY, tileSizeZoomed, tileSizeZoomed);
                p.pop();
                // endregion
            }
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

        ghostFigure = null;
        if (dragMode === "draw" && activeImageLabel) {
            const tilePosition = getCurrentTilePosition(p.mouseX, p.mouseY);

            ghostFigure = {
                img: activeImageLabel,
                ...tilePosition
            };
        }
    }

    function adj(val) {
        return val * TILE_SIZE * zoomLevel;
    }

    function renderBoard() {
        p.background(150);

        mapList.loopThrough(drawBlock);

        drawCurrentBlockGrid();
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

        // Prevent browser page zoom (ctrl+scroll)
        event.preventDefault();
        event.stopPropagation();

        switch (wheelMode) {
            case MOUSE_WHEEL_MODE.zoom:
                zoom(event.deltaY < 0);
                console.log("zoomLevel:", zoomLevel);
                break;

            case MOUSE_WHEEL_MODE.tileRotation:
            default:
        }
    };

    function zoom(positiveDelta) {
        const adjX = p.mouseX - pixelOffsetX,
            adjY = p.mouseY - pixelOffsetY,
            zoomCoefficient = 1.1
        ;

        let postZoomX = 0,
            postZoomY = 0;

        if (positiveDelta) {
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

        pixelOffsetX = Math.round(pixelOffsetX);
        pixelOffsetY = Math.round(pixelOffsetY);

        tileSizeZoomed = TILE_SIZE * zoomLevel;

        adjBlockWidth = adj(MAP_WIDTH);
        adjBlockHeight = adj(MAP_HEIGHT);
    }

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

        const tilePosition = getCurrentTilePosition(p.mouseX, p.mouseY);
        const {x: mapBlockX, y: mapBlockY} = getCurrentBlockPosition(tilePosition);

        if (dragMode !== "move"
            && !mapList.blockExists(mapBlockX, mapBlockY)
        ) {
            return;
        }

        const block = mapList.get(mapBlockX, mapBlockY);
        const {x: currRow, y: currCol} = getCurrentTilePositionInBlock(tilePosition);

        if (dragMode === "move") {
            p.cursor('grabbing');
            movingCanvas = true;
            pixelOffsetX += p.mouseX - p.pmouseX;
            pixelOffsetY += p.mouseY - p.pmouseY;
        } else if (dragMode === "draw") {
            if (activeImageLabel) {
                if (block.tiles[currCol][currRow]) {
                    if (block.tiles[currCol][currRow].img === activeImageLabel) {
                        return;
                    }
                }

                block.tiles[currCol][currRow] = {img: activeImageLabel};
                block.renderToBuffer(p);
            }
        } else if (dragMode === "erase") {
            if (block.tiles[currCol][currRow]) {
                block.tiles[currCol][currRow] = null;
                block.renderToBuffer(p)
            }
        }

        dragPrevX = p.mouseX;
        dragPrevY = p.mouseY;
    }

    p.mousePressed = function (event) {
        dragging = true;
    };

    p.mouseReleased = function (event) {
        movingCanvas = false;
        dragging = false;
    };

    /**
     * @param {MapBlock} block
     */
    function drawBlock(block) {
        p.image(
            block.graphicsBuffer,
            pixelOffsetX + adjBlockWidth * block.x,
            pixelOffsetY + adjBlockHeight * block.y,
            adjBlockWidth,
            adjBlockHeight
        );

        if (showExpandButtons) {
            drawBlockButtons(block);
        }
    }

    function drawBlockButtons(block) {
        for (let label in block.connections) {
            if (block.connections[label]) {
                continue;
            }

            p.push();
            p.fill(200);
            p.strokeWeight(1);
            p.stroke(0, 20);
            // p.translate(p.width / 2, p.height / 2);

            const blockPixelOffsetX = pixelOffsetX + adjBlockWidth * block.x;
            const blockPixelOffsetY = pixelOffsetY + adjBlockHeight * block.y;

            let mouseXOffset,
                mouseYOffset
            ;

            switch(label) {
                case "left":
                    p.translate(-20 + blockPixelOffsetX, adjBlockHeight / 2 + blockPixelOffsetY);
                    mouseXOffset = -20 + blockPixelOffsetX;
                    mouseYOffset = adjBlockHeight / 2 + blockPixelOffsetY;

                    p.rotate(-p.PI / 2);
                    break;
                case "right":
                    p.translate(adjBlockWidth + blockPixelOffsetX + 20, adjBlockHeight / 2 + blockPixelOffsetY);
                    mouseXOffset = adjBlockWidth + blockPixelOffsetX + 20;
                    mouseYOffset = adjBlockHeight / 2 + blockPixelOffsetY;

                    p.rotate(p.PI / 2);
                    break;
                case "up":
                    p.translate(adjBlockWidth / 2 + blockPixelOffsetX, -20 + blockPixelOffsetY);
                    mouseXOffset = adjBlockWidth / 2 + blockPixelOffsetX;
                    mouseYOffset = -20 + blockPixelOffsetY;
                    break;
                case "down":
                    p.translate(adjBlockWidth / 2 + blockPixelOffsetX, 20 + blockPixelOffsetY + adjBlockHeight);
                    mouseXOffset = adjBlockWidth / 2 + blockPixelOffsetX;
                    mouseYOffset = 20 + blockPixelOffsetY + adjBlockHeight;

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
                    console.log('Intersection w/', label, 'on block x:', block.x, 'y:', block.y);
                    let newBlockX = block.x,
                        newBlockY = block.y
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

                    mapList
                        .createBlock(newBlockX, newBlockY)
                        .renderToBuffer(p)
                    ;
                }
            }

            p.pop();
        }
    }

    /**
     * Возвращает позиции клетки под курсором безотносительно блоков.
     *
     * @param {number} mouseX
     * @param {number} mouseY
     * @return {{x: number, y: number}}
     */
    function getCurrentTilePosition(mouseX, mouseY) {
        return {
            x: Math.floor((mouseX - pixelOffsetX) / tileSizeZoomed),
            y: Math.floor((mouseY - pixelOffsetY) / tileSizeZoomed)
        }
    }

    /**
     * Возвращает позиции блока под курсором, основываясь на позициях тайла.
     *
     * @param tileX
     * @param tileY
     * @return {{x: number, y: number}}
     */
    function getCurrentBlockPosition( {x: tileX, y: tileY} ) {
        return {
            x: Math.floor(tileX / MAP_WIDTH),
            y: Math.floor(tileY / MAP_HEIGHT)
        };
    }

    /*
     function getCurrentBlockPosition(mouseX, mouseY) {
        const tilePositions = getCurrentTilePosition(mouseX, mouseY);

        return {
            x: Math.floor(tilePositions.x / MAP_WIDTH),
            y: Math.floor(tilePositions.y / MAP_HEIGHT)
        };
     }
     */

    /**
     * Возвращает позиции текущего тайла (под курсором) в блоке.
     *
     * @param {number} tileX Позиция тайла X на сетке
     * @param {number} tileY Позиция тайла Y на сетке
     * @return {{x: number, y: number}}
     */
    function getCurrentTilePositionInBlock( {x: tileX, y: tileY} ) {
        const result = {
            x: 0,
            y: 0
        };

        if (tileX < 0) {
            result.x = (tileX % MAP_WIDTH + MAP_WIDTH) % MAP_WIDTH;
        }
        else {
            result.x = tileX % MAP_WIDTH;
        }

        if (tileY < 0) {
            result.y = (tileY % MAP_HEIGHT + MAP_HEIGHT) % MAP_HEIGHT;
        }
        else {
            result.y = tileY % MAP_HEIGHT;
        }

        return result
    }

    function drawCurrentBlockGrid() {
        const blockPos = getCurrentBlockPosition(getCurrentTilePosition(p.mouseX, p.mouseY)),
            curBlock = mapList.get(blockPos.x, blockPos.y),
            strokeWeight = 1,
            strokeWeightOffset = strokeWeight / 2
        ;
        if (!curBlock) {
            return;
        }
        let x, y;
        for (let i = 0; i <= MAP_HEIGHT; i++) {
            for (let j = 0; j <= MAP_WIDTH; j++) {
                if (j === 0) {
                    y = pixelOffsetY + Math.round(tileSizeZoomed * i + adjBlockHeight * curBlock.y - strokeWeightOffset);

                    p.stroke(0, 60);
                    p.strokeWeight(strokeWeight);

                    p.line(
                        pixelOffsetX + Math.round(adjBlockWidth * curBlock.x - strokeWeightOffset),
                        y,
                        pixelOffsetX + Math.round(adjBlockWidth * (curBlock.x + 1) - strokeWeightOffset),
                        y
                    );
                }
                if (i === 0) {
                    x = pixelOffsetX + Math.round(tileSizeZoomed * j + adjBlockWidth * curBlock.x - strokeWeightOffset);

                    p.stroke(0, 60);
                    p.strokeWeight(strokeWeight);

                    p.line(
                        x,
                        pixelOffsetY + Math.round(adjBlockHeight * curBlock.y - strokeWeightOffset),
                        x,
                        pixelOffsetY + Math.round(adjBlockHeight * (curBlock.y + 1) - strokeWeightOffset)
                    );
                }
            }
        }
    }
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
