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
    add(x, y, block) {
        this.blocks[`${x}:${y}`] = block;

        this.updateConnections(x, y);
        this.updateConnections(x, y + 1);
        this.updateConnections(x, y - 1);
        this.updateConnections(x + 1, y);
        this.updateConnections(x - 1, y);
    }

    /**
     * @param {Number} x
     * @param {Number} y
     * @return {MapBlock} block
     */
    createBlock(x, y) {
        const result = new MapBlock(x, y);

        this.add(x, y, result);

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
            b.hasSibling = {
                top:   this.blockExists(x, y - 1),
                right: this.blockExists(x + 1, y),
                bottom:this.blockExists(x, y + 1),
                left:  this.blockExists(x - 1, y),
            }
        }
    }
}
