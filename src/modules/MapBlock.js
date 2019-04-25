import {MAP_HEIGHT, MAP_WIDTH, TILE_SIZE} from './constants';
import loadImageMemo from '../modules/loadImageMemo';

export default class MapBlock {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.tiles = [];
        for (let i = 0; i < MAP_HEIGHT; i++) {
            this.tiles.push(new Array(MAP_WIDTH));
        }
    }

    renderToBuffer(p5) {
        const width = MAP_WIDTH * TILE_SIZE,
            height = MAP_HEIGHT * TILE_SIZE
        ;
        let x, y, tileImage,
            transparencyLevel = 128;

        if (!this.graphicsBuffer) {
            this.graphicsBuffer = p5.createGraphics(width, height);
        }

        const p = this.graphicsBuffer;

        p.fill(255);
        p.stroke(0);
        p.strokeWeight(2);
        p.rect(
            0,
            0,
            width,
            height,
        );

        // Проанализировать и нарисовать сверху поля необходимые тайлы
        for (let i = 0; i < MAP_HEIGHT; i++) {
            y = i * TILE_SIZE;

            for (let j = 0; j < MAP_WIDTH; j++) {
                x = j * TILE_SIZE;

                if (this.tiles[i][j]) {
                    tileImage = loadImageMemo(this.tiles[i][j].img, p);
                    if (tileImage) {
                        p.image(tileImage, x, y, TILE_SIZE, TILE_SIZE)
                    }
                }

                if (x === 0) {
                    p.stroke(0, transparencyLevel);
                    p.strokeWeight(1);

                    p.line(0, y, width, y);
                }
                if (y === 0) {
                    p.stroke(0, transparencyLevel);
                    p.strokeWeight(1);

                    p.line(x, 0, x, height);
                }
            }
        }
    }
}
