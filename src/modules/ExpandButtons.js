
export default class ExpandButtons {
    static imageLink = '/images/chevron-right.png';
    static imageWidth = 50;
    static imageHeight = 80;
    static blockMargin = 10;

    constructor(p5Context) {
        this.images = {
            top:    p5Context.createImg(ExpandButtons.imageLink),
            right:  p5Context.createImg(ExpandButtons.imageLink),
            bottom: p5Context.createImg(ExpandButtons.imageLink),
            left:   p5Context.createImg(ExpandButtons.imageLink),

            /**
             * Применить функцию ко всем картинкам ↑
             * @see http://p5js.org/reference/#/p5.Element
             * @param {string} functionName
             * @param args
             */
            setProperty: (functionName, ...args) => {
                for (let btnInBlockPosition in this.images) {
                    if (btnInBlockPosition !== 'setProperty') {
                        this.images[btnInBlockPosition][functionName](...args);
                    }
                }
            }
        };

        this.images.setProperty('size', ExpandButtons.imageWidth, ExpandButtons.imageHeight);
        this.images.setProperty('style', 'cursor', 'pointer');
        this.images.top.style('transform', 'rotate(-90deg)');
        this.images.bottom.style('transform', 'rotate(90deg)');
        this.images.left.style('transform', 'rotate(180deg)');
    }

    /**
     * Установить блок, для которого отображаются кнопки
     * @param {./MapBlock} block
     */
    setCurrentBlock(block) {
        if (block) {
            this.currentBlock = block;

            this.updateButtonsVisibility();
        }
    }

    updateButtonsVisibility() {
        if (!this.currentBlock) {
            return;
        }

        for (let btnInBlockPosition in this.currentBlock.hasSibling) {
            this.setIsVisible(btnInBlockPosition, !this.currentBlock.hasSibling[btnInBlockPosition]);
        }
    }

    setIsVisible(btnInBlockPosition, isVisible) {
        if (isVisible) {
            this.images[btnInBlockPosition].show();
        }
        else {
            this.images[btnInBlockPosition].hide();
        }
    }

    /**
     * Установить отступы блока от границ экрана и его ширину, в зависимости от зума, чтобы просчитать расстановку кнопок.
     *
     * @param {number} offsetX
     * @param {number} offsetY
     * @param {number} blockWidth
     */
    setOffsets(offsetX, offsetY, blockWidth) {
        let halfBlockWidth = blockWidth / 2,
            positionCenterX = offsetX + halfBlockWidth - ExpandButtons.imageWidth / 2,
            positionCenterY = offsetY + halfBlockWidth - ExpandButtons.imageHeight / 2
        ;

        // FIXME: Непонятно, откуда в offsetY лишние 15 пикселей!
        this.images.top.position(positionCenterX, offsetY - ExpandButtons.imageWidth - ExpandButtons.blockMargin - 15);
        this.images.right.position(offsetX + blockWidth + ExpandButtons.blockMargin, positionCenterY);
        this.images.bottom.position(positionCenterX, offsetY + blockWidth + ExpandButtons.blockMargin - 15);
        this.images.left.position(offsetX - ExpandButtons.imageWidth - ExpandButtons.blockMargin, positionCenterY);
    }


    /**
     *
     * @param {function} callback Коллбек с аргументами (event, inBlockPositionName, block)
     */
    setOnClick(callback) {
        for (let btnInBlockPosition in this.images) {
            if (btnInBlockPosition !== 'setProperty') {
                this.images[btnInBlockPosition].mouseClicked((e) => {
                    callback(e, btnInBlockPosition, this.currentBlock);
                });
            }
        }
    }
}
