const memo = {},
    isImageLoading = {}
;
/**
 * Load image and memoize
 * @param imageName {String}
 * @param p5 {Function} p5 instance
 * @returns {p5.Image|boolean} Returns p5 image or `false` if image still loading.
 */
function loadImageMemo(imageName, p5) {
    if (memo[imageName]) {
        return memo[imageName];
    }

    if (!isImageLoading[imageName]) {
        isImageLoading[imageName] = true;
        loadImage(imageName, p5).then(img => {
            memo[imageName] = img;
            delete isImageLoading[imageName];
        }).catch(reason => {
            delete isImageLoading[imageName];
        })
    }

    return false;
}

/**
 * Async load image
 * @param {String} imageName
 * @param {Object} p5
 * @return {Promise<any>}
 */
function loadImage(imageName, p5) {
    return new Promise((resolve, reject) => {
        p5.loadImage(
            `/images/objects/${imageName}.jpg`,
            resolve,
            reject
        )
    })
}

export {
    loadImageMemo as default,
    loadImage
};
