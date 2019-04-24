import * as gv from "./GlobalVars.json";

export default class MapBlock {
    constructor(x, y, origin) {
        this.x = x;
        this.y = y;

        this.tiles = [];
        for (let i = 0; i < gv.mapHeight; i++) {
            this.tiles.push(new Array(gv.mapWidth));
        }
    }
}