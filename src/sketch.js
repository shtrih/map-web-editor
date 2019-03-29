
export default function sketch (p) {
  let loopAllowed = false;
  let mapWidth = 30;
  let mapHeight = 30;
  let zoomLevel = 1;

  const tileSize = 10;
  let pixelOffsetX = 100,
    pixelOffsetY = 100;

  p.setup = function() {
    const parentEl = document.getElementById('workScreen');
    p.createCanvas(parentEl.clientWidth, parentEl.clientHeight);
    loopAllowed = true;
  };

  p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
    console.log('myCustomRedrawAccordingToNewPropsHandler', props);
  };

  p.draw = function() {
    if (!loopAllowed) {
      return;
    }
    analyzeCursor();
    p.background(100);

    renderBoard();
      for (let i = 0; i < 10; i++) {
        let x = i * (tileSize * zoomLevel) + pixelOffsetX;
        p.line(x, 0, x, p.height);
        let y = i * (tileSize * zoomLevel) + pixelOffsetY;
        p.line(0, y, p.width, y);
      }

    p.ellipse(p.mouseX, p.mouseY, 5, 5);
  };

  function analyzeCursor() {
    if ((p.mouseX % p.floor(tileSize * zoomLevel + pixelOffsetX)) < 15) {
      p.cursor('col-resize');
      // console.log("Hello")
    }
    else if ((p.mouseY % p.floor(tileSize * zoomLevel + pixelOffsetY)) < 15) {
      p.cursor('row-resize');
    }
    else {
      p.cursor('default');
    }
  }

  function renderBoard() {
    const adj = (val) => val * tileSize * zoomLevel;

    p.textSize(tileSize / 2 * zoomLevel);

    for (let i = 0; i < mapHeight; i++) {
      for (let j = 0; j < mapWidth; j++) {
        let x = adj(j) + pixelOffsetX;
        let y = adj(i) + pixelOffsetY;
        p.rect(x, y, tileSize * zoomLevel, tileSize * zoomLevel);

        let hS = (tileSize * zoomLevel) / 2;

        if (j === 0) {
          p.text(`${i + 1}`, x - hS, y + hS);
        }
        if (i === 0) {
          p.text(`${j + 1}`, x + hS, y - hS);
        }
      }
    }
  }

  // p.windowResized = function () {
  //   p.resizeCanvas(windowWidth, windowHeight);
  // };

  p.keyReleased = function() {
    if (p.key === "+") {
      zoomLevel *= 1.1;
    }
    if (p.key === "-") {
      zoomLevel /= 1.1;
    }
  };

  p.mouseWheel = function(event) {
    if (event.deltaY < 0) {
      zoomLevel *= 1.1;
    }
    else {
      zoomLevel /= 1.1;
    }
  };

  p.mouseDragged = function (event) {
    pixelOffsetX += p.mouseX - p.pmouseX;
    pixelOffsetY += p.mouseY - p.pmouseY;
  }
};
