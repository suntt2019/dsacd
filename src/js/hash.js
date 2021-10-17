import * as assert from "assert";
import {HeapSort} from "./heap";

// Reference: https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
export const hashCode = s => s.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a
}, 0);

// Written by myself
// A string hash table, using squared detection
// TODO: use a better detecting method?
export class HashTable {
    /**
     * Construct a hash table with certain capacity
     * @param {Number} capacity
     * @param p
     * @param maxTryTimes
     */
    constructor(capacity, p = HashTable.pLinerDetection, maxTryTimes = (c) => {
        return c
    }) {
        this.capacity = capacity;
        this.array = new Array(capacity);
        this.h = (str) => {
            return Math.abs(hashCode(str)) % this.capacity;
        };
        this.p = p;
        this.size = 0;
        this.maxTryTimes = maxTryTimes(this.capacity);
    }

    // FRE: FindResultEnum
    static FRE = {
        result: 0,
        position: 1,
        FOUND: 2,
        EMPTY: 3,
        NOT_FOUND: 4,
    }

    /**
     * Store a key and return its hash code.
     * Return its hash code if the key already exists.
     * Return null when the HashTable is full.
     * @param {String} key
     */
    Add(key) {
        assert(typeof key === 'string', 'Provided key to add into HashTable is not a string');
        if (this.size >= this.capacity) {
            return null;
        }
        let findRet = this.find(key);
        switch (findRet[HashTable.FRE.result]) {
            case HashTable.FRE.FOUND:
                return findRet[HashTable.FRE.position];
            case HashTable.FRE.EMPTY:
                this.array[findRet[HashTable.FRE.position]] = key;
                this.size++;
                return findRet[HashTable.FRE.position];
            case HashTable.FRE.NOT_FOUND:
                return null;
        }
    }

    /**
     * Get hash code of a key.
     * Return null when the key isn't found.
     * @param {String} key
     */
    Get(key) {
        assert(typeof key === 'string', 'Provided key to get from HashTable is not a string');
        let findRet = this.find(key);
        switch (findRet[HashTable.FRE.result]) {
            case HashTable.FRE.FOUND:
                return findRet[HashTable.FRE.position];
            case HashTable.FRE.EMPTY:
                return null;
            case HashTable.FRE.NOT_FOUND:
                return null;
        }
    }

    /**
     * Find a key in hash table
     * @param {String} key
     * @return {object}
     */
    find(key) {
        let d0 = this.h(key);
        let d = d0;
        for (let i = 1; i <= this.maxTryTimes; i++) {
            if (this.array[d] === key) {
                return [HashTable.FRE.FOUND, d];
            }
            if (this.array[d] === undefined) {
                return [HashTable.FRE.EMPTY, d];
            }
            d = this.getD(d0, i, key);
        }
        return [HashTable.FRE.NOT_FOUND, -1];
    }

    /**
     * Remove a stored key.
     * Do nothing when the key isn't found.
     * @param {String} key
     */
    Remove(key) {
        let findRet = this.find(key);
        if (findRet[HashTable.FRE.result] === HashTable.FRE.FOUND) {
            this.array[findRet[HashTable.FRE.position]] = {
                tomb: true
            };
        }
    }

    /**
     * Return all existing items in hash table
     * @return {String[]}
     */
    Items() {
        let ret = [];
        for (let i = 0; i < this.capacity; i++) {
            if(this.array[i] === undefined || this.array[i].tomb === true) {
                continue;
            }
            ret.push(this.array[i]);
        }
        return ret;
    }

    /**
     * Detecting function, generating next d_{i+1} from d_i and i in a certain way.
     * d_i = getD(d0, i, key)
     *     = (d0 + p(key, i)) % m
     * @param {Number} d0
     * @param {Number} i
     * @param {String} key
     * @return {Number}
     */
    getD(d0, i, key) {
        let ret = ((d0 + this.p(key, i)) % this.capacity + this.capacity) % this.capacity;
        // console.log('getD:', d0, i, key, ret);
        return ret;
    }

    /**
     * function p (usage declared in comment of function getD).
     * implement liner detection here.
     * @param {String} key
     * @param {number} i
     * @return {number}
     */
    static pLinerDetection(key, i) {
        return i;
    }

    /**
     * function p (usage declared in comment of function getD).
     * implement squared detection here.
     * @param {String} key
     * @param {number} i
     * @return {number}
     */
    static pSquaredDetection(key, i) {
        return (i % 2 === 0 ? -1 : 1) * Math.pow(Math.ceil(i / 2), 2);
    }
}

export class HashSet {
    constructor(capacity, p = HashTable.pLinerDetection, maxTryTimes = (c) => {
        return c
    }) {
        this.hashTable = new HashTable(capacity, p, maxTryTimes);
    }

    Add(x) {
        if(this.hashTable.Add(x) === null) {
            throw new Error("Adding element to full hash set");
        }
    }

    Remove(x) {
        this.hashTable.Remove(x);
    }

    Has(x) {
        return this.hashTable.Get(x) !== null;
    }

    List() {
        return this.hashTable.Items();
    }
}

/**
 * @param {HashSet} a
 * @param {HashSet} b
 * @return {HashSet}
 */
export function Union(a, b) {
    let ret = new HashSet(a.hashTable.capacity);
    let listA = a.List();
    let listB = b.List();
    for(let i in listA) {
        ret.Add(listA[i]);
    }
    for(let i in listB) {
        ret.Add(listB[i]);
    }
    return ret;
}

/**
 * @param {HashSet} a
 * @param {HashSet} b
 * @return {HashSet}
 */
export function Intersection(a, b) {
    let ret = new HashSet(a.hashTable.capacity);
    let listA = a.List();
    for(let i in listA) {
        if(b.Has(listA[i])) {
            ret.Add(listA[i]);
        }
    }
    return ret;
}

/**
 * @param {HashSet} a
 * @param {HashSet} b
 * @return {HashSet}
 */
export function Difference(a, b) {
    let ret = new HashSet(a.hashTable.capacity);
    let listA = a.List();
    for(let i in listA) {
        if(!b.Has(listA[i])) {
            ret.Add(listA[i]);
        }
    }
    return ret;
}

/**
 * Convert a string list to set.
 * @param {String[]} list
 * @param {Number} capacity
 * @return {HashSet}
 */
export function ListToSet(list, capacity = -1) {
    if(capacity === -1) {
        capacity = list.length;
    }
    let ret = new HashSet(capacity);
    for(let i in list) {
        ret.Add(list[i]);
    }
    return ret;
}

/**
 * @param {String[]} array
 * @param {HashSet} target
 * @return {String[]}
 */
export function Omit(array, target) {
    let ret = [];
    for(let i in array) {
        if(target.Has(array[i])) {
            continue;
        }
        ret.push(array[i]);
    }
    return ret;
}

export class HashMap {
    constructor(capacity, p = HashTable.pLinerDetection, maxTryTimes = (c) => {
        return c
    }) {
        this.hashTable = new HashTable(capacity, p, maxTryTimes);
        this.array = new Array(capacity);
    }

    Set(key, value) {
        let addRet = this.hashTable.Add(key);
        if (addRet === null) {
            throw new Error('Map full');
        }
        this.array[addRet] = value;
    }

    Get(key) {
        let getRet = this.hashTable.Get(key);
        if (getRet === null) {
            throw new Error(`Key error: "${key}" not found`);
        }
        return this.array[getRet];
    }

    Remove(key) {
        this.hashTable.Remove(key);
    }

    Has(key) {
        let getRet = this.hashTable.Get(key);
        return getRet !== null;
    }

    Keys() {
        return this.hashTable.Items();
    }

    Items() {
        let ret = [];
        for (let i = 0; i < this.hashTable.capacity; i++) {
            if(this.hashTable.array[i] === undefined || this.hashTable.array[i].tomb === true) {
                continue;
            }
            ret.push({
                key: this.hashTable.array[i],
                value: this.array[i],
            });
        }
        return ret;
    }

    SortedItems(greater) {
        return HeapSort(this.Items(), greater);
    }
}

export function MapToSet(map) {
    let ret = new HashSet(1);
    ret.hashTable = map.hashTable;
    return ret;
}
