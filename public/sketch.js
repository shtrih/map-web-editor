/* eslint-disable no-undef */
let loopAllowed = false;
let mapWidth = null;
let mapHeight = null;

let zoomLevel = 1;

// eslint-disable-next-line no-unused-vars
function mySetup(w, h) {
    createCanvas(windowWidth, windowHeight);
    mapWidth = w;
    mapHeight = h;

    loopAllowed = true;
}

// eslint-disable-next-line no-unused-vars
function draw() {
    if (!loopAllowed) return;
    analyzeCursor();
    background(100);
    
    renderBoard();
    for (let i = 0; i < 10; i++) {
        let x = i * (tileSize * zoomLevel) + pixelOffsetX;
        line(x, 0, x, height);
        let y = i * (tileSize * zoomLevel) + pixelOffsetY;
        line(0, y, width, y);
    }

    ellipse(mouseX, mouseY, 5, 5);
}

function analyzeCursor() {
    if ((mouseX % floor(tileSize * zoomLevel + pixelOffsetX)) < 15) {
        cursor('col-resize');
        // console.log("Hello")
    }
    else if ((mouseY % floor(tileSize * zoomLevel + pixelOffsetY)) < 15) {
        cursor('row-resize');
    }
    else cursor('default');
}

const tileSize = 10;
let pixelOffsetX = 100,
    pixelOffsetY = 100;
function renderBoard() {
    const adj = (val) => val * tileSize * zoomLevel;

    textSize(tileSize / 2 * zoomLevel);

    for (let i = 0; i < mapHeight; i++)
        for (let j = 0; j < mapWidth; j++) {
            let x = adj(j) + pixelOffsetX;
            let y = adj(i) + pixelOffsetY;
            rect(x, y, tileSize * zoomLevel, tileSize * zoomLevel);
            
            let hS = (tileSize * zoomLevel) / 2;

            if (j === 0)
                text(`${i+1}`, x - hS, y + hS);
            if (i === 0)
                text(`${j+1}`, x + hS, y - hS);
        }
}

// eslint-disable-next-line no-unused-vars
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// eslint-disable-next-line no-unused-vars
function keyReleased() {
    if (key === "+") zoomLevel *= 1.1;
    if (key === "-") zoomLevel /= 1.1;
}

function mouseWheel(event) {
    if (event.deltaY < 0)
        zoomLevel *= 1.1;
    else
        zoomLevel /= 1.1;
}

function mouseDragged(ev) {
    pixelOffsetX += mouseX - pmouseX;
    pixelOffsetY += mouseY - pmouseY;
}