import * as assert from "assert";
import {hashCode, HashMap} from './hash';
import {SplitWithPoints} from './KMP';
import {FormatContent, FormatWords} from "./format";

export class FileIndex {
    static MapSize = 100000;

    /**
     * Construct a file index form it content
     * @param {String} content
     * @param {Object} fileNode, FileNode in files.js
     * @param {WorkspaceIndex} workspaceIndex
     */
    constructor(content,  fileNode, workspaceIndex) {
        this.map = new HashMap(FileIndex.MapSize);
        this.hash = hashCode(content);
        this.workspace = workspaceIndex;
        this.fileNode = fileNode;
        let splitRet = FormatWords(SplitWithPoints(FormatContent(content), ' '));
        let words = splitRet[0];
        let points = splitRet[1];
        for (let i in words) {
            let word = words[i];
            if (!this.map.Has(word)) {
                this.map.Set(word, []);
            }
            let ps = this.map.Get(word);
            ps.push(points[i]);
            this.map.Set(word, ps);
        }
        // console.log('New file index generated, words:', words, this.map.Items());
        if (this.hash !== 0) {
            this.workspace.Add(this);
        }
    }

    tf(word) {
        if(!this.map.Has(word)) {
            return 0;
        }
        return this.map.Get(word).length;
    }

    TF(word) {
        assert(typeof word === 'string', "word provided for TF isn't a string");
        return this.tf(word);
    }

    Frequency() {
        let ret = this.map.Items();
        return ret;
    }
}

// TODO: test this
export class WorkspaceIndex {
    static MapSize = 200000;
    static FileHashSetSize = 1000;
    static FileMapSize = 1000;

    constructor(message) {
        this.map = new HashMap(WorkspaceIndex.MapSize);
        this.filesIndexes = new HashMap(WorkspaceIndex.FileHashSetSize);
        this.message = message;
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
                this.map.Set(k, {
                    files: new HashMap(WorkspaceIndex.FileMapSize),
                    sum: 0,
                });
            }
            let value = this.map.Get(k);
            let newValue;
            if (!minus) {
                value.files.Set(fileIndex.hash.toString(), {
                    file: fileIndex.fileNode,
                    points: fileIndex.map.Get(k),
                    count: v.length,
                });
                newValue = {
                    files: value.files,
                    sum: value.sum + v.length,
                };
            } else {
                value.files.Remove(fileIndex.hash.toString());
                newValue = {
                    files: value.files,
                    sum: value.sum - v.length,
                };
            }
            // console.log('update TF of word "' + k + '" in workspace:', this.map.Get(k), '->', newValue);
            assert(newValue.sum >= 0, 'Negative value generated in workspace index');
            this.map.Set(k, newValue);
        }
    }

    /**
     * @param {FileIndex} fileIndex
     */
    Add(fileIndex) {
        // console.log('Add in workspace index', this.filesIndexes.Items(), fileIndex.hash);
        assert(fileIndex instanceof FileIndex, "Provided fileIndex isn't a FileIndex");
        if (this.filesIndexes.Has(fileIndex.hash.toString())) {
            throw new Error("Adding included file index");
        }
        this.filesIndexes.Set(fileIndex.hash.toString(), fileIndex);
        this.changeByFileIndex(fileIndex, false);
    }

    /**
     * @param {FileIndex} fileIndex
     */
    Sub(fileIndex) {
        // console.log('Sub in workspace index', this.filesIndexes.Items(), fileIndex.hash);
        assert(fileIndex instanceof FileIndex, "Provided fileIndex isn't a FileIndex");
        if (!this.filesIndexes.Has(fileIndex.hash.toString())) {
            throw new Error("Removing not included file index");
        }
        this.filesIndexes.Remove(fileIndex.hash.toString());
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
            if (this.filesIndexes.Get(k).map.Has(word)) {
                count++;
            }
        }
        return Math.log10(keys.length / count);
    }
}
