export function Range(length) {
    let ret = [];
    for (let i = 0; i < length; i++) {
        ret.push(i);
    }
    return ret;
}

export function Slice(array, count) {
    if(count === -1) {
        return array;
    }
    return array.slice(0, count);
}
