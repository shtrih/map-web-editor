import MapBlock from "./MapBlock";

export default class MapList {
    constructor() {
        this.blocks = {};
    }

    /**
     * @param {Number} x
     * @param {Number} y
     * @return {MapBlock|undefined} block
     */
    get(x, y) {
        return this.blocks[`${x}:${y}`];
    }

    /**
     * @param {Number} x
     * @param {Number} y
     * @param {MapBlock} block
     */
    set(x, y, block) {
        this.blocks[`${x}:${y}`] = block;

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

    /**
     * @param {Number} x
     * @param {Number} y
     * @return {MapBlock} block
     */
    createBlock(x, y) {
        const result = new MapBlock(x, y);
        this.set(x, y, result);
        this.updateConnections(x, y);

        return result;
    }

    /**
     * @param {Number} x
     * @param {Number} y
     * @return {boolean}
     */
    blockExists(x, y) {
        return (this.blocks[`${x}:${y}`] !== undefined);
    }

    /**
     * @param {function} f
     */
    loopThrough(f) {
        for (let blockName in this.blocks) {
            f(this.blocks[blockName]);
        }
    }

    /**
     * @param {Number} x
     * @param {Number} y
     */
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
