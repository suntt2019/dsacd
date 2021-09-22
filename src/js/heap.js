import * as assert from "assert";

// Minimum heap
export class Heap {
    // greater: return true if arg1 > arg2
    constructor(items, greater) {
        assert(items instanceof Array, "Using non-array items to construct heap")
        this.items = Array(items.length);
        for (let i in items) {
            this.items[i] = items[i];
        }
        this.greater = greater;
        this.size = this.items.length;
        for (let i = Heap.parent(this.size - 1); i >= 0; i--) {
            this.ShiftDown(i);
        }
    }

    swap(id1, id2) {
        const temp = this.items[id1];
        this.items[id1] = this.items[id2];
        this.items[id2] = temp;
    }

    static parent(id) {
        return Math.ceil(id / 2) - 1;
    }

    static children(id) {
        return [id * 2 + 1, id * 2 + 2];
    }

    minID(id1, id2) {
        return this.greater(this.items[id1], this.items[id2]) ? id2 : id1;
    }

    ShiftDown(id) {
        let children = Heap.children(id);
        let minChildID;
        if (children[1] < this.size) { // node with double child
            minChildID = this.minID(children[0], children[1]);
        } else if (children[0] < this.size) { // node with single child
            minChildID = children[0];
        } else { // leaf node
            return;
        }
        if (this.greater(this.items[id], this.items[minChildID])) {
            this.swap(id, minChildID);
            this.ShiftDown(minChildID);
        }
    }

    ShiftUp(id) {
        let p = Heap.parent(id);
        while(p >= 0 && this.greater(this.items[p], this.items[id])) {
            this.swap(p, id);
            id = p;
            p = Heap.parent(id);
        }
    }

    Pop() {
        if(this.size <= 0) {
            throw Error("Popping from empty heap");
        }
        const ret = this.items[0];
        this.swap(0, this.size-1);
        this.size--;
        this.ShiftDown(0);
        return ret;
    }

    Push(item) {
        this.items[this.size] = item;
        this.size++;
        this.ShiftUp(this.size-1);
    }
}
