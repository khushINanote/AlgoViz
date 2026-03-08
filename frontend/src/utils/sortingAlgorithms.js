export const bubbleSortAnimations = (array) => {
    const animations = [];
    let n = array.length;
    let swapped;
    do {
        swapped = false;
        for (let i = 0; i < n - 1; i++) {
            animations.push({ type: 'compare', indices: [i, i + 1] });
            if (array[i] > array[i + 1]) {
                animations.push({ type: 'swap', indices: [i, i + 1], values: [array[i + 1], array[i]] });
                let temp = array[i];
                array[i] = array[i + 1];
                array[i + 1] = temp;
                swapped = true;
            }
            animations.push({ type: 'revert', indices: [i, i + 1] });
        }
        n--;
    } while (swapped);
    return animations;
};

export const selectionSortAnimations = (array) => {
    const animations = [];
    let n = array.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            animations.push({ type: 'compare', indices: [minIdx, j] });
            animations.push({ type: 'revert', indices: [minIdx, j] });
            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            animations.push({ type: 'swap', indices: [i, minIdx], values: [array[minIdx], array[i]] });
            let temp = array[i];
            array[i] = array[minIdx];
            array[minIdx] = temp;
        }
    }
    return animations;
};

export const insertionSortAnimations = (array) => {
    const animations = [];
    let n = array.length;
    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;
        animations.push({ type: 'compare', indices: [i, j] });
        animations.push({ type: 'revert', indices: [i, j] });
        while (j >= 0 && array[j] > key) {
            animations.push({ type: 'swap', indices: [j, j + 1], values: [array[j], array[j + 1]] }); // Technically an overwrite but visualize as swap for simplicity
            array[j + 1] = array[j];
            j = j - 1;
            if (j >= 0) {
                animations.push({ type: 'compare', indices: [j, j + 1] });
                animations.push({ type: 'revert', indices: [j, j + 1] });
            }
        }
        array[j + 1] = key;
        // For exact visualization, we would push the final key placement, 
        // but the iterative swaps handle the visual shift nicely for insertion sort.
    }
    return animations;
};

export const mergeSortAnimations = (array) => {
    const animations = [];
    if (array.length <= 1) return animations;
    const auxiliaryArray = array.slice();
    mergeSortHelper(array, 0, array.length - 1, auxiliaryArray, animations, 0);
    return animations;
};

function mergeSortHelper(mainArray, startIdx, endIdx, auxiliaryArray, animations, depth) {
    if (startIdx === endIdx) return;
    const middleIdx = Math.floor((startIdx + endIdx) / 2);

    // Track recursive calls
    animations.push({ type: 'call', range: [startIdx, endIdx], depth });

    mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, animations, depth + 1);
    mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations, depth + 1);
    doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations, depth);

    animations.push({ type: 'return', range: [startIdx, endIdx], depth });
}

function doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations, depth) {
    let k = startIdx;
    let i = startIdx;
    let j = middleIdx + 1;
    while (i <= middleIdx && j <= endIdx) {
        animations.push({ type: 'compare', indices: [i, j], depth });
        animations.push({ type: 'revert', indices: [i, j], depth });
        if (auxiliaryArray[i] <= auxiliaryArray[j]) {
            animations.push({ type: 'overwrite', index: k, value: auxiliaryArray[i], depth });
            mainArray[k++] = auxiliaryArray[i++];
        } else {
            animations.push({ type: 'overwrite', index: k, value: auxiliaryArray[j], depth });
            mainArray[k++] = auxiliaryArray[j++];
        }
    }
    while (i <= middleIdx) {
        animations.push({ type: 'compare', indices: [i, i], depth });
        animations.push({ type: 'revert', indices: [i, i], depth });
        animations.push({ type: 'overwrite', index: k, value: auxiliaryArray[i], depth });
        mainArray[k++] = auxiliaryArray[i++];
    }
    while (j <= endIdx) {
        animations.push({ type: 'compare', indices: [j, j], depth });
        animations.push({ type: 'revert', indices: [j, j], depth });
        animations.push({ type: 'overwrite', index: k, value: auxiliaryArray[j], depth });
        mainArray[k++] = auxiliaryArray[j++];
    }
}

export const quickSortAnimations = (array) => {
    const animations = [];
    quickSortHelper(array, 0, array.length - 1, animations, 0);
    return animations;
};

function quickSortHelper(array, startIdx, endIdx, animations, depth) {
    if (startIdx < endIdx) {
        animations.push({ type: 'call', range: [startIdx, endIdx], depth });
        const pivotIdx = partition(array, startIdx, endIdx, animations, depth);
        quickSortHelper(array, startIdx, pivotIdx - 1, animations, depth + 1);
        quickSortHelper(array, pivotIdx + 1, endIdx, animations, depth + 1);
        animations.push({ type: 'return', range: [startIdx, endIdx], depth });
    }
}

function partition(array, startIdx, endIdx, animations, depth) {
    const pivot = array[endIdx];
    let i = startIdx - 1;
    for (let j = startIdx; j < endIdx; j++) {
        animations.push({ type: 'compare', indices: [j, endIdx], depth });
        animations.push({ type: 'revert', indices: [j, endIdx], depth });
        if (array[j] < pivot) {
            i++;
            animations.push({ type: 'swap', indices: [i, j], values: [array[j], array[i]], depth });
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
    animations.push({ type: 'swap', indices: [i + 1, endIdx], values: [array[endIdx], array[i + 1]], depth });
    let temp = array[i + 1];
    array[i + 1] = array[endIdx];
    array[endIdx] = temp;
    return i + 1;
}
