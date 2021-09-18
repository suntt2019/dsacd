import { hashCode } from './hash';
import * as assert from "assert";
// import vue from 'vue';

export class FileNode {
    constructor(name, parent, handler) {
        this.magic_refresh = name;      // TODO: use vuex to remove magic sync
                                        // (invalid bind because of illegal way of sharing data)
        this.name = name;               // only write in constructor
        this.key = name;
        this.parent = parent;           // root node: parent=null
        this.children = [];
        if(!(handler instanceof window.FileSystemHandle)) {
            throw(new Error(`Invalid handler for constructing FileNode ${handler}`));
        }
        this.handler = handler;         // only write in constructor
        this.kind = handler.kind;       // only write in constructor
        if (parent !== null) {
            parent.children.push(this);
        }

        // TODO: refactor to use inheritance

        // File only
        this.loaded = false;
        this.content = 'NOT_LOADED';
        this.hash = hashCode(this.content);
        this.lastSavedHash = this.hash;
        this.saved = true;

        // Directory only
        this.unsavedChildren = new Set();

        // For the visualization
        this.title = name;
        this.slots = {
            icon: handler.kind,
        }
    }

    // Borrow the concept of pre-order traversal,
    // Here means a node does the operation(callback) before traveling to its children.
    async PreorderTraversal(callback) {
        await callback(this);
        for (const child of this.children) {
            await child.PreorderTraversal(callback);
        }
    }

    async ScanChildren() {
        if (this.kind !== 'directory') {
            return;
        }
        for await (const [k, v] of this.handler.entries()) {
            new FileNode(k, this, v);
        }
    }

    async Load() {
        assert(this.kind === 'file', `calling function "Load" on directory ${this}`);
        if(this.loaded) {
            return;
        }
        await this.load();
        this.loaded = true;
    }

    async Reload() {
        assert(this.kind === 'file', `calling function "Reload" on directory ${this}`);
        await this.load();
    }

    async load() {
        assert(this.kind === 'file', `calling function "load" on directory ${this}`);
        let file = await this.handler.getFile();
        this.content = await file.text();
        this.lastSavedHash = hashCode(this.content);
        this.Saved();
    }

    // Update status cache (this.saved) and return
    Saved() {
        assert(this.kind === 'file', `calling function "Saved" on directory ${this}`);
        // if(this.kind !== 'file') console.log(this);
        this.hash = hashCode(this.content);
        // this.saved only is written here
        this.saved = (this.hash === this.lastSavedHash);

        // Modifications when this.saved changes
        if(this.parent !== null) {
            this.parent.updateSavedChild(this.name, this.saved);
        }
        if(this.saved) {
            this.slots.icon = 'file';
            this.magic_refresh = 'saved';
            // this.DARK_MAGIC = "DONT_REMOVE_OTHERWISE_CANT_WORK; TRUE_POWER!";
        } else {
            this.slots.icon = 'file-unsaved';
            this.magic_refresh = 'unsaved';
            // this.DARK_MAGIC = "DONT_REMOVE_OTHERWISE_CANT_WORK; TRUE_POWER!";
        }
        return this.saved;
    }

    updateSavedChild(name, saved) {
        assert(this.kind === 'directory', `calling function "updateSavedChild" on file ${this}`);
        if(saved) {
            this.unsavedChildren.delete(name);
        } else {
            this.unsavedChildren.add(name);
        }
        if(this.unsavedChildren.size === 0) {
            this.slots.icon = 'directory';
            this.magic_refresh = 'saved';
        } else {
            this.slots.icon = 'directory-unsaved';
            this.magic_refresh = 'unsaved';
        }
        if(this.parent !== null) {
            this.parent.updateSavedChild(name, saved);
        }
    }

    async Save() {
        assert(this.kind === 'file', `calling function "Save" on directory ${this}`);
        if(this.kind !== 'file' && !this.Saved()) {
            return;
        }
        let file = await this.handler.createWritable(true);
        await file.write(this.content);
        await file.close();
        this.lastSavedHash = hashCode(this.content);
        this.Saved();
    }
}

export class FileTree {
    constructor(rootHandler) {
        if (rootHandler.kind !== 'directory') {
            throw new Error("Root handler isn't directory");
        }
        this.root = new FileNode(rootHandler.name, null, rootHandler);
        this.root.key = 'root';
    }

    async Scan() {
        await this.root.PreorderTraversal( async function (n) {
            await n.ScanChildren();
        })
    }

}

export function GetDir(after) {
    window.showDirectoryPicker().then((dir)=>{
        after(dir);
    });
}

export default {
    FileNode,
    FileTree,
    methods: {
    }
};
