import MapList from "../modules/MapList";
import {
    TILE_SIZE,
    MAP_WIDTH,
    MAP_HEIGHT,
    MOUSE_WHEEL_MODE,
    CURSOR_MODE,
} from '../modules/constants';

import loadImageMemo from '../modules/loadImageMemo';
import ExpandButtons from '../modules/ExpandButtons';

/** Для использования p5.createImg в ExpandButtons */
import "react-p5-wrapper/node_modules/p5/lib/addons/p5.dom";

export default function sketch(p) {
    let loopAllowed = false,
        zoomLevel = 1,
        cursorMode = CURSOR_MODE.draw,
        mapMax = {x: 0, y: 0},
        pixelOffsetX = 0,
        pixelOffsetY = 0,
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
    const mapList = new MapList(),
        expandButtons = new ExpandButtons(p)
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
        expandButtons.setOnClick((e, inBlockPositionName, block) => {
            if (!block) {
                return;
            }

            let newBlockX = block.x,
                newBlockY = block.y
            ;

            switch(inBlockPositionName) {
                case "left":
                    newBlockX--;
                    break;
                case "right":
                    newBlockX++;
                    break;
                case "top":
                    newBlockY--;
                    break;
                case "bottom":
                    newBlockY++;
                    break;

                default:
                    throw new Error('No such direction label:', inBlockPositionName);
            }

            mapList
                .createBlock(newBlockX, newBlockY)
                .renderToBuffer(p)
            ;
        });
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

        let blockPos = getCurrentBlockPosition(getCurrentTilePosition(p.mouseX, p.mouseY)),
            currentBlock = mapList.get(blockPos.x, blockPos.y);

        renderBoard(currentBlock);

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
            cursorMode = CURSOR_MODE.drag;
        }
        else if (p.keyIsDown(p.SHIFT)) {
            cursorMode = CURSOR_MODE.erase;
        }
        else {
            cursorMode = CURSOR_MODE.draw;
        }
        updateCursor();
    }

    /**
     * Обновить вид курсора в зависимости от текущего действия пользователя
     */
    function updateCursor() {
        switch (cursorMode) {
            case CURSOR_MODE.draw:
                p.cursor('default');
                break;

            case CURSOR_MODE.drag:
                if (dragging) {
                    p.cursor('grabbing');
                }
                else {
                    p.cursor('grab');
                }
                break;

            case CURSOR_MODE.erase:
                p.cursor('crosshair');
                break;

            case CURSOR_MODE.interact:
                p.cursor('pointer');
                break;
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
        if (cursorMode === CURSOR_MODE.draw && activeImageLabel) {
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

    function renderBoard(currentBlock) {
        p.background(150);

        mapList.loopThrough(drawBlock);

        drawBlockGrid(currentBlock);

        if (showExpandButtons) {
            drawBlockExpandButtons(currentBlock);
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

        if (cursorMode !== CURSOR_MODE.drag
            && !mapList.blockExists(mapBlockX, mapBlockY)
        ) {
            return;
        }

        const block = mapList.get(mapBlockX, mapBlockY);
        const {x: currRow, y: currCol} = getCurrentTilePositionInBlock(tilePosition);

        if (cursorMode === CURSOR_MODE.drag) {
            pixelOffsetX += p.mouseX - p.pmouseX;
            pixelOffsetY += p.mouseY - p.pmouseY;
        } else if (cursorMode === CURSOR_MODE.draw) {
            if (activeImageLabel) {
                if (block.tiles[currCol][currRow]) {
                    if (block.tiles[currCol][currRow].img === activeImageLabel) {
                        return;
                    }
                }

                block.tiles[currCol][currRow] = {img: activeImageLabel};
                block.renderToBuffer(p);
            }
        } else if (cursorMode === CURSOR_MODE.erase) {
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

    function drawBlockGrid(block) {
        if (!block) {
            return;
        }

        const strokeWeight = 1,
            strokeWeightOffset = strokeWeight / 2
        ;

        let x, y;
        for (let i = 0; i <= MAP_HEIGHT; i++) {
            for (let j = 0; j <= MAP_WIDTH; j++) {
                if (j === 0) {
                    y = pixelOffsetY + Math.round(tileSizeZoomed * i + adjBlockHeight * block.y - strokeWeightOffset);

                    p.stroke(0, 60);
                    p.strokeWeight(strokeWeight);

                    p.line(
                        pixelOffsetX + Math.round(adjBlockWidth * block.x - strokeWeightOffset),
                        y,
                        pixelOffsetX + Math.round(adjBlockWidth * (block.x + 1) - strokeWeightOffset),
                        y
                    );
                }
                if (i === 0) {
                    x = pixelOffsetX + Math.round(tileSizeZoomed * j + adjBlockWidth * block.x - strokeWeightOffset);

                    p.stroke(0, 60);
                    p.strokeWeight(strokeWeight);

                    p.line(
                        x,
                        pixelOffsetY + Math.round(adjBlockHeight * block.y - strokeWeightOffset),
                        x,
                        pixelOffsetY + Math.round(adjBlockHeight * (block.y + 1) - strokeWeightOffset)
                    );
                }
            }
        }
    }

    function drawBlockExpandButtons(block) {
        if (!block) {
            return;
        }

        expandButtons.setCurrentBlock(block);
        expandButtons.setOffsets(
            pixelOffsetX + adjBlockWidth * block.x,
            pixelOffsetY + adjBlockHeight * block.y,
            adjBlockWidth
        );
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
