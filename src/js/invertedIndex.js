import * as assert from "assert";
import {hashCode, HashMap} from './hash';
import {SplitWithPoints} from './KMP';

// TODO: test this
class FileIndex {
    static MapSize = 100000;

    /**
     * Construct a file index form it content
     * @param {String} content
     */
    constructor(content) {
        this.map = new HashMap(FileIndex.MapSize);
        this.hash = hashCode(content);
        let splitRet = SplitWithPoints(content, ' ');
        let words = splitRet[0];
        let points = splitRet[1];
        for (let i in words) {
            let word = words[i];
            if (!this.map.Has(word)) {
                this.map.Set([]);
            }
            this.map.Set(word, this.map.Get(word).push(points[i]));
        }
    }

    TF(word) {
        assert(typeof word === 'string', "word provided for TF isn't a string");
        return this.map.Get(word).length;
    }
}

// TODO: test this
class WorkspaceIndex {
    static MapSize = 200000;
    static FileHashSetSize = 1000;

    constructor() {
        this.map = new HashMap(WorkspaceIndex.MapSize);
        this.filesIndexes = new HashMap(WorkspaceIndex.FileHashSetSize);
    }

    /**
     * @param {FileIndex} fileIndex
     * @param {boolean} minus
     */
    changeByFileIndex(fileIndex, minus) {
        let keys = fileIndex.map.Keys();
        for (let i in keys) {
            let k = keys[i];
            let v = fileIndex.map.Get(k);
            assert(v instanceof Array, 'Value of file index map is not an array');
            if (!this.map.Has(k)) {
                this.map.Set(0);
            }
            let newValue = this.map.Get(k) + v.length * minus ? -1 : 1;
            assert(newValue >= 0, 'Negative value generated in workspace index');
            this.map.Set(k, newValue);
        }
    }

    /**
     * @param {FileIndex} fileIndex
     */
    Add(fileIndex) {
        assert(fileIndex instanceof FileIndex, "Provided fileIndex isn't a FileIndex");
        if (this.filesIndexes.Has(fileIndex.hash)) {
            throw new Error("Adding included file index");
        }
        this.filesIndexes.Set(fileIndex.hash, fileIndex);
        this.changeByFileIndex(fileIndex, false);
    }

    /**
     * @param {FileIndex} fileIndex
     */
    Sub(fileIndex) {
        assert(fileIndex instanceof FileIndex, "Provided fileIndex isn't a FileIndex");
        if (this.filesIndexes.Has(fileIndex.hash)) {
            throw new Error("Removing not included file index");
        }
        this.filesIndexes.Remove(fileIndex.hash);
        this.changeByFileIndex(fileIndex, true);
    }

    /**
     * @param {String} word
     */
    IDF(word) {
        assert(typeof word === 'string', "word provided for IDF isn't a string");
        let keys = this.filesIndexes.Keys();
        let count = 0;
        for (let i in keys) {
            let k = keys[i];
            if (this.filesIndexes[k].Has(word)) {
                count++;
            }
        }
        return Math.log10(keys.length / count);
    }
}
