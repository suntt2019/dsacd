import * as assert from "assert";

function prefixFunction(array) {
    assert(array instanceof Array, "Input of prefixFunction is not an array");
    let ret = [0];
    for (let i = 1; i < array.length; i++) {
        let j = ret[i - 1];
        while (j > 0 && array[i] !== array[j]) {
            j = ret[j - 1];
        }
        if (array[i] === array[j]) {
            ret.push(j + 1);
        } else {
            ret.push(0);
        }
    }
    return ret;
}

/**
 @param {string} str
 @param {string} target
 @return {Number[]}
 */
function findAll(str, target) {
    let array = new Array(str.length + target.length + 1);
    for (let i = 0; i < target.length; i++) {
        array[i] = target.charCodeAt(i);
    }
    array[target.length] = -1;
    for (let i = 0; i < str.length; i++) {
        array[i + target.length + 1] = str.charCodeAt(i);
    }
    let prefixArray = prefixFunction(array);
    return prefixArray.slice(target.length + 1);
}

/**
 @param {Number[]} prefixArray
 @param {Number} targetLength
 @return {Number[]}
 */
function prefixArrayToPoints(prefixArray, targetLength) {
    let ret = [];
    for (let i = 0; i < prefixArray.length; i++) {
        if (prefixArray[i] === targetLength) {
            ret.push(i - targetLength + 1);
        }
    }
    return ret;
}

/**
 @param {string} str
 @param {string} target
 @return {Number[]}
 */
export function FindAll(str, target) {
    assert(typeof str === 'string', "Input str of FindAll is not a string");
    assert(typeof target === 'string', "Input target of FindAll is not a string");
    return prefixArrayToPoints(findAll(str, target), target.length);
}

/**
 @param {string} str
 @param {string} separator
 @return {Number[][]}
 */
function split(str, separator) {
    let prefixArray = findAll(str, separator);
    let ret = [], points = [];
    let start = 0;
    for (let i = 0; i < prefixArray.length; i++) {
        if (prefixArray[i] === separator.length) {
            ret.push(str.substring(start, i - separator.length + 1));
            points.push(start);
            start = i + 1;
        }
    }
    ret.push(str.substring(start));
    return [ret, points];
}

/**
 @param {string} str
 @param {string} separator
 @return {Number[]}
 */
export function Split(str, separator) {
    assert(typeof str === 'string', "Input str of Split is not a string");
    assert(typeof separator === 'string', "Input separator of Split is not a string");
    return split(str, separator)[0];
}

/**
 @param {string} str
 @param {string} separator
 @return {Number[][]}
 */
export function SplitWithPoints(str, separator) {
    assert(typeof str === 'string', "Input str of Split is not a string");
    assert(typeof separator === 'string', "Input separator of Split is not a string");
    return split(str, separator);
}

export class Replacer {
    /**
     * @param {string} str
     * @param {string} source
     * @param {string} target
     */
    constructor(str, source, target) {
        assert(typeof str === 'string', "Input str of Replacer constructor is not a string");
        assert(typeof source === 'string', "Input source of Replacer constructor is not a string");
        assert(typeof target === 'string', "Input target of Replacer constructor is not a string");
        this.str = str;
        this.source = source;
        this.target = target;
        this.lastReplaced = -1;
        this.find();
    }

    find() {
        this.prefixArray = findAll(this.str, this.source);
        // console.log('prefixArray:', this.prefixArray);
        this.nextReplace = -1;
        for (let i = 0; i <= this.prefixArray.length + this.lastReplaced; i++) {
            let ii = i % this.prefixArray.length;
            if (i > this.lastReplaced && this.prefixArray[ii] === this.source.length) {
                this.nextReplace = ii - this.source.length + 1;
                return i <= this.prefixArray.length;
            }
        }
    }

    Replace() {
        if (this.nextReplace < 0) {
            return null;
        }
        this.str = this.str.substring(0, this.nextReplace)
            + this.target
            + this.str.substring(this.nextReplace + this.source.length);
        this.lastReplaced = this.nextReplace + this.target.length;
        let ret = this.find();
        console.log(ret);
        return ret;
    }

    GetPoints() {
        return prefixArrayToPoints(this.prefixArray, this.source.length);
    }

    UpdateTarget(target) {
        this.target = target;
    }
}
