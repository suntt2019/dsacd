import {Union, Intersection, Difference, HashMap, ListToSet, Omit, MapToSet, HashSet} from "./hash";
import {InFixExpressionToPostfix, ExecutePostfixExpression} from "./expression";
import {MultipleSplit, ReplaceAll} from "./KMP";
import {HeapSort} from "./heap";
import {FileIndex} from "./invertedIndex";

const operators = [
    ' ', '(', ')', 'AND', 'OR', 'NOT'
];

const setOperatorList = [
    {
        operator: 'OR',
        priority: 1,
        func: Union,
    },
    {
        operator: 'AND',
        priority: 2,
        func: Intersection,
    },
    {
        operator: 'SUB',
        priority: 3,
        func: Difference,
    },
];

let setOperatorSet = undefined;

function setOperatorSetPrepared() {
    if(setOperatorSet === undefined) {
        setOperatorSet = new HashMap(setOperatorList.length);
        for(let i in setOperatorList) {
            setOperatorSet.Set(setOperatorList[i].operator, setOperatorList[i]);
        }
    }
}

export function ConvertExpression(str) {
    let infix = Omit(
        MultipleSplit(
            ReplaceAll(str, 'NOT', 'ALL SUB'),
            operators),
        ListToSet(['',' '])
    );
    setOperatorSetPrepared();
    console.log('infix:', infix);
    let postfix = InFixExpressionToPostfix(infix, setOperatorSet);
    console.log('postfix:', postfix);
    return postfix;
}

export function CalculateSet(postfix, workspace) {
    setOperatorSetPrepared();
    let pf = [];
    let words = [];
    for(let i in postfix) {
        let element = postfix[i];
        if(setOperatorSet.Has(element)) {
            pf.push(element);
        } else if (element === 'ALL') {
            pf.push(MapToSet(workspace.filesIndexes));
        } else {
            words.push(element);
            if(!workspace.map.Has(element)) {
                pf.push(new HashSet(FileIndex.MapSize));
            } else {
                pf.push(MapToSet(workspace.map.Get(element).files));
            }
        }
    }
    // console.log('Converted postfix:', pf);
    let resultSet = ExecutePostfixExpression(pf, setOperatorSet);
    let ret = [];
    let l = resultSet.List();
    for(let i in l) {
        let fileIndex = workspace.filesIndexes.Get(l[i]);
        ret.push({
            value: {
                file: fileIndex.fileNode,
                count: calculateWeight(postfix, fileIndex, workspace),
                points: wordsPoints(words, fileIndex),
            }
        });
    }
    ret = HeapSort(ret, (a, b)=>{return a.value.count<b.value.count});
    return ret;
}

const INF = 10e8;

const weightOperatorList = [
    {
        operator: 'OR',
        priority: 1,
        func: function (a, b) {
            return Math.max(a, b);
        },
    },
    {
        operator: 'AND',
        priority: 2,
        func: function (a, b) {
            return Math.min(a, b);
        },
    },
    {
        operator: 'SUB',
        priority: 3,
        func: function (a, b) {
            return a - b;
        },
    },
];

let weightOperatorSet = undefined;

function weightOperatorSetPrepared() {
    if(weightOperatorSet === undefined) {
        weightOperatorSet = new HashMap(weightOperatorList.length);
        for(let i in weightOperatorList) {
            weightOperatorSet.Set(weightOperatorList[i].operator, weightOperatorList[i]);
        }
    }
}

function calculateWeight(postfix, fileIndex, workspace) {
    weightOperatorSetPrepared();
    let pf = [];
    for(let i in postfix) {
        let element = postfix[i];
        if(setOperatorSet.Has(element)) {
            pf.push(element);
        } else if (element === 'ALL') {
            pf.push(INF);
        } else {
            pf.push(wordWeight(element, fileIndex, workspace));
        }
    }
    console.log('Converted postfix:', pf);
    let ret = ExecutePostfixExpression(pf, weightOperatorSet);
    return ret;
}

function wordWeight(word, fileIndex, workspace) {
    return fileIndex.TF(word) * workspace.IDF(word);
}

function wordsPoints(words, fileIndex) {
    let ret = [];
    for(let i in words) {
        if(!fileIndex.map.Has(words[i])) {
            continue;
        }
        let points = fileIndex.map.Get(words[i]);
        for(let j in points) {
            ret.push({
                word: words[i],
                point: points[j]
            });
        }
    }
    return HeapSort(ret, (a,b)=>{return a.point>b.point;});
}
