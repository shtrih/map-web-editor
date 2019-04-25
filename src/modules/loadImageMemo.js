const memo = {},
    isImageLoading = {}
;
/**
 * @method loadImageMemo
 * Load image and memoize
 * @param imageName {string}
 * @param p5 {function} p5 instance
 * @returns {p5.Image|boolean} Returns p5 image or `false` if image still loading.
 */
export default function loadImageMemo(imageName, p5) {
    if (memo[imageName]) {
        return memo[imageName];
    }

    if (!isImageLoading[imageName]) {
        isImageLoading[imageName] = true;
        p5.loadImage(`/images/objects/${imageName}.jpg`, img => {
            memo[imageName] = img;
            delete isImageLoading[imageName];
        });
    }

    return false;
};
