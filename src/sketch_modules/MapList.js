import MapBlock from "./MapBlock";
export default class MapList {
    constructor() {
        this.blocks = {};
    }

    get(x, y) {
        return this.blocks[`${x}:${y}`];
    }
    set(x, y, val) {
        this.blocks[`${x}:${y}`] = val;

        if (this.blockExists(x, y + 1)) {
            this.updateConnections(x, y + 1);
        }
        if (this.blockExists(x, y - 1)) {
            this.updateConnections(x, y - 1);
        }
        if (this.blockExists(x + 1, y)) {
            this.updateConnections(x + 1, y);
        }
        if (this.blockExists(x - 1, y)) {
            this.updateConnections(x - 1, y);
        }
    }

    createBlock(x, y) {
        this.set(x, y, new MapBlock(x, y));
        this.updateConnections(x, y);
    }
    blockExists(x, y) {
        return (this.blocks[`${x}:${y}`] !== undefined);
    }
    loopThrough(f) {
        for (let blockName in this.blocks) {
            f(this.blocks[blockName]);
        }
    }

    updateConnections(x, y) {
        const b = this.get(x, y);
        if (b) {
            b.connections = {
                left:  this.blockExists(x - 1, y),
                right: this.blockExists(x + 1, y),
                up:    this.blockExists(x, y - 1),
                down:  this.blockExists(x, y + 1)
            }
        }
    }
}