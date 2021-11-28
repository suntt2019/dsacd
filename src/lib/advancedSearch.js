import {Difference, HashMap, HashSet, Intersection, ListToSet, MapToSet, Omit, Union} from "./hash";
import {ExecutePostfixExpression, InFixExpressionToPostfix} from "./expression";
import {MultipleSplit, ReplaceAll} from "./KMP";
import {HeapSort} from "./heap";
import {FileIndex} from "./invertedIndex";
import {GetSynonyms} from './synonym';
import {FormatOperand} from "./format";
import {Slice} from "./utils";

const operators = [
    ' ', '(', ')', 'AND', 'OR', 'NOT', 'SUB', 'ALL'
];

let operatorSet = undefined;

function operatorSetPrepared() {
    if (operatorSet === undefined) {
        operatorSet = ListToSet(operators);
    }
}

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
    if (setOperatorSet === undefined) {
        setOperatorSet = new HashMap(setOperatorList.length);
        for (let i in setOperatorList) {
            setOperatorSet.Set(setOperatorList[i].operator, setOperatorList[i]);
        }
    }
}

export function ConvertExpression(str) {
    return Omit(
        MultipleSplit(
            ReplaceAll(str, 'NOT', 'ALL SUB'),
            operators),
        ListToSet(['', ' '])
    );
}

export function InfixToPostfix(infix) {
    setOperatorSetPrepared();
    return InFixExpressionToPostfix(infix, setOperatorSet);
}

export function CalculateSet(postfix, workspace) {
    setOperatorSetPrepared();
    let pf = [];
    let words = [];
    for (let i in postfix) {
        let element = postfix[i];
        if (setOperatorSet.Has(element)) {
            pf.push(element);
        } else if (element === 'ALL') {
            pf.push(MapToSet(workspace.filesIndexes));
        } else {
            words.push(element);
            if (!workspace.map.Has(element)) {
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
    for (let i in l) {
        let fileIndex = workspace.filesIndexes.Get(l[i]);
        ret.push({
            value: {
                file: fileIndex.fileNode,
                count: calculateWeight(postfix, fileIndex, workspace),
                points: wordsPoints(words, fileIndex),
            }
        });
    }
    ret = HeapSort(ret, (a, b) => {
        return a.value.count < b.value.count
    });
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
    if (weightOperatorSet === undefined) {
        weightOperatorSet = new HashMap(weightOperatorList.length);
        for (let i in weightOperatorList) {
            weightOperatorSet.Set(weightOperatorList[i].operator, weightOperatorList[i]);
        }
    }
}

function calculateWeight(postfix, fileIndex, workspace) {
    weightOperatorSetPrepared();
    let pf = [];
    for (let i in postfix) {
        let element = postfix[i];
        if (setOperatorSet.Has(element)) {
            pf.push(element);
        } else if (element === 'ALL') {
            pf.push(INF);
        } else {
            pf.push(wordWeight(element, fileIndex, workspace));
        }
    }
    console.log('Converted postfix:', pf);
    return ExecutePostfixExpression(pf, weightOperatorSet);
}

function wordWeight(word, fileIndex, workspace) {
    return fileIndex.TF(word) * workspace.IDF(word);
}

function wordsPoints(words, fileIndex) {
    let ret = [];
    for (let i in words) {
        if (!fileIndex.map.Has(words[i])) {
            continue;
        }
        let points = fileIndex.map.Get(words[i]);
        for (let j in points) {
            ret.push({
                word: words[i],
                point: points[j]
            });
        }
    }
    return HeapSort(ret, (a, b) => {
        return a.point > b.point;
    });
}

export function AddSynonyms(infix, synonymCount) {
    operatorSetPrepared();
    let ret = [];
    for (let i in infix) {
        let word = infix[i];
        if (operatorSet.Has(word)) {
            ret.push(word);
        } else {
            ret = ret.concat(synonymExpression(FormatOperand(word), synonymCount));
        }
    }
    return ret;
}

function synonymExpression(word, synonymCount) {
    let ret = ['(', word];
    let synonyms = Slice(GetSynonyms(word), synonymCount);
    console.log('synonyms[', word, ']=', synonyms);
    for (let i in synonyms) {
        ret = ret.concat(['OR', synonyms[i]]);
    }
    ret.push(')');
    return ret;
}

export function GetOperands(infix, synonymCount, workspace) {
    operatorSetPrepared();
    let ret = [];
    for (let i in infix) {
        let word = infix[i];
        if (!operatorSet.Has(word)) {
            let ss = Slice([word].concat(GetSynonyms(word)), synonymCount+1);
            let synonyms = [];
            for(let j in ss) {
                let synonym = ss[j];
                synonyms.push({
                    synonym: synonym,
                    IDF: workspace.IDF(synonym),
                })
            }
            ret.push({
                'word': word,
                'synonyms': synonyms,
            });
        }
    }
    return ret;
}
