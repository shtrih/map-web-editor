import loadImageMemo from "./loadImageMemo";

export default class Tile {
    /**
     * @param {Function} p5
     */
    constructor(p5) {
        this._imageName = null;
        /** @type {Number} */
        this.x = 0;
        /** @type {Number} */
        this.y = 0;
        /** @type {Number} */
        this.angle = 0;
        /** @type {Function} */
        this.p5context = p5;
    }

    /**
     * @param {string} imageName
     */
    set imageName(imageName) {
        this._imageName = imageName;

        loadImageMemo(this._imageName, this.p5context)
    }

    get imageName() {
        return this._imageName
    }

    /**
     * @return {p5.Image|boolean|null} Return {p5.Image} instance or {false} if image not loaded yet, {null} if image is not set
     */
    get image() {
        if (!this._imageName) {
            return null;
        }

        return loadImageMemo(this._imageName, this.p5context);
    }
}
