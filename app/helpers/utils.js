/**
 * Pick selected keys from sourceObject and return a filtered new object
 * @param {*} sourceObject The original object to get the subset from
 * @param {*} keys array of strings, name of properties of the sourceObject to keep
 */
const pick = (sourceObject, keys) => {
    const newObject = {};
    keys.forEach((key) => { newObject[key] = sourceObject[key]; });
    return newObject;
};

const pickArray = (sourceArray, keys) => {
    return sourceArray.map((sourceObject) => pick(sourceObject, keys));
}

const removeFromArray = (arr, value) => {
    for(let i = 0; i < arr.length; i++){
        if (arr[i] === value) {
            arr.splice(i, 1);
        }
    }
    return arr;
}

module.exports = {
    pick,
    pickArray,
    removeFromArray
}