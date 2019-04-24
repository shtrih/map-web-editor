import { MAP_HEIGHT, MAP_WIDTH } from './Constants'
export default class MapBlock {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.tiles = [];
        for (let i = 0; i < MAP_HEIGHT; i++) {
            this.tiles.push(new Array(MAP_WIDTH));
        }
    }
}