export const linearSearchAnimations = (array, target) => {
    const animations = [];
    for (let i = 0; i < array.length; i++) {
        animations.push({ type: 'compare', indices: [i] });
        if (array[i] === target) {
            animations.push({ type: 'found', index: i });
            return animations;
        }
    }
    animations.push({ type: 'not_found' });
    return animations;
};

export const binarySearchAnimations = (array, target) => {
    const animations = [];
    let left = 0;
    let right = array.length - 1;

    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        animations.push({ type: 'compare_range', range: [left, right], mid: mid });

        if (array[mid] === target) {
            animations.push({ type: 'found', index: mid });
            return animations;
        }

        if (array[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    animations.push({ type: 'not_found' });
    return animations;
};
