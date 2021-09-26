import {Heap} from './heap';

// TODO: refactor this to a simple map;
const charToName = {
    ' ': '[space]',
    '\r': '[CR]',
    '\n': '[LF]',
};

let nameToChar = {
    '[space]': ' ',
    '[CR]': '\r',
    '[LF]': '\n',
};

function GetCharName(char) {
    if(char === -1) {
        return '';
    }
    let name = String.fromCodePoint(char);
    if (charToName[name] !== undefined) {
        name = charToName[name];
    }
    return name;
}

function countChars(str) {
    let counts = new Array(256);
    for (let i = 0; i < 256; i++) {
        counts[i] = 0;
    }
    for (let i in str) {
        counts[str.charCodeAt(i)]++;
    }
    return counts;
}

class HuffmanNode {
    constructor(char, weight) {
        this.char = char;
        this.weight = weight;
        this.children = [];
        this.parent = null;
        this.code = 'NOT_CODED';
    }

    name() {
        return `${GetCharName(this.char)}(${this.weight})`;
    }

    static Greater(a, b) {
        return a.weight > b.weight;
    }

    static Merge(a, b) {
        let node = new HuffmanNode(-1, a.weight + b.weight);
        node.children = [a, b];
        a.parent = node;
        b.parent = node;
        return node;
    }

    PreorderTraversal(callback) {
        callback(this);
        for (const child of this.children) {
            child.PreorderTraversal(callback);
        }
    }

    InorderTraversal(callback) {
        if(this.children.length>0) {
            this.children[0].InorderTraversal(callback);
        }
        callback(this);
        if(this.children.length>1) {
            this.children[1].InorderTraversal(callback);
        }
    }

    PostorderTraversal(callback) {
        let childrenReturnValues = [];
        for (const child of this.children) {
            childrenReturnValues.push(child.PostorderTraversal(callback));
        }
        return callback(this, childrenReturnValues);
    }
}

class HuffmanTree {
    constructor(root) {
        this.root = root;
    }

    GiveCodeNumber() {
        this.root.code = '';
        this.root.PreorderTraversal((node) => {
            for (let i in node.children) {
                node.children[i].code = node.code + i.toString();
            }
        })
    }

    CodingMapString() {
        let ret = '';
        this.root.PreorderTraversal((node) => {
            if (node.children.length === 0) {
                let char = String.fromCodePoint(node.char);
                if (charToName[char] !== undefined) {
                    char = charToName[char];
                }
                ret += `${node.code}: ${char}\n`;
            }
        })
        return ret;
    }

    EncodingMap() {
        let ret = [];
        this.root.PreorderTraversal((node) => {
            if (node.children.length === 0) {
                ret[node.char] = node.code;
            }
        })
        return ret;
    }

    GetHeight() {
        return this.root.PostorderTraversal((node, childrenReturnValue) => {
            let ret = -1;
            for (let i in childrenReturnValue) {
                if (childrenReturnValue[i] > ret) {
                    ret = childrenReturnValue[i];
                }
            }
            return ret + 1;
        });
    }

    ToGraphData() {
        // const width = 1200, height = 500;
        // let floorCount = this.GetHeight() + 1;
        // let ySpace = height / floorCount;
        // let xSpace = width / (Math.pow(2, floorCount) + 1);
        let xSpace = 50;
        let ySpace = 100;
        let xCount = 0;
        let ret = {
            nodes: [],
            edges: [],
        }
        this.root.InorderTraversal((node) => {
            let name = 'root';
            if(node.code !== '') {
                name = node.code;
            }
            for(let i in node.children) {
                ret.edges.push({
                    source: name,
                    target: node.children[i].code,
                    label: i.toString(),
                })
            }
            let n = {
                id: name,
                label: node.name()+'\n['+name+']',
                x: xSpace * xCount++,
                y: ySpace * node.code.length,
            };
            let maxWidth = Math.max(node.name().length, name.length);
            if(node.children.length === 0) {
                n.type = 'rect';
                n.size = [maxWidth*8, 32];
                n.anchorPoints = [[0.5, 0]];
            } else {
                n.type = 'circle';
                n.size = maxWidth*8+10;
            }
            ret.nodes.push(n);
        });
        return ret;
    }

}

// TODO: fix string with single kind of char
export function BuildTree(str) {
    let counts = countChars(str);
    let nodes = [];
    for (let ch in counts) {
        if (counts[ch] > 0) {
            nodes.push(new HuffmanNode(parseInt(ch, 10), counts[ch]));
        }
    }
    let heap = new Heap(nodes, HuffmanNode.Greater);
    while (heap.size > 1) {
        heap.Push(HuffmanNode.Merge(heap.Pop(), heap.Pop()));
    }
    let tree = new HuffmanTree(heap.Pop());
    tree.GiveCodeNumber();
    return tree;
}

export function Encode(str, tree) {
    let map = tree.EncodingMap();
    let ret = '';
    for (let i in str) {
        ret += map[str.charCodeAt(i)];
    }
    return ret;
}

function importTreeDFS(code, targetList) {
    if(targetList.length === 0) {
        throw new Error('Invalid coding map');
    }
    let node = new HuffmanNode(-1, -1);
    node.code = code;
    if (code === targetList[0].code) {
        let char = targetList[0].char;
        if (char.length > 1) {
            console.log('char convert:','|'+char+'|',nameToChar[char]);
            char = nameToChar[char];
        }
        node.char = char.charCodeAt(0);
        console.log(code, targetList);
        targetList.shift();
        return node;
    }
    let leftChild, rightChild;
    leftChild = importTreeDFS(code + '0', targetList);
    rightChild = importTreeDFS(code + '1', targetList);
    if (leftChild !== null) {
        node.children.push(leftChild);
        leftChild.parent = node;
    }
    if (rightChild !== null) {
        node.children.push(rightChild);
        rightChild.parent = node;
    }
    return node;
}

export function ImportTree(map) {
    let lines = map.split('\n');
    let rules = [];
    for (let i in lines) {
        let line = lines[i].split(': ');
        if (line.length < 2) {
            continue;
        }
        rules.push({
            code: line[0],
            char: line[1],
        })
    }
    let ret;
    try {
        ret = new HuffmanTree(importTreeDFS('', rules));
    } catch (e) {
        return null;
    }
    return ret;
}

export function Decode(str, tree) {
    let node = tree.root;
    let ret = '';
    for (let ch in str) {
        switch (str[ch]) {
            case '0':
                node = node.children[0];
                break;
            case '1':
                node = node.children[1];
                break;
            case '\n':
            case '\r':
                break;
            default:
                return null;
        }
        if (node.char >= 0) {
            ret += String.fromCharCode(node.char);
            node = tree.root;
        }
    }
    return ret;
}
