import { ListToSet } from './hash';

const punctuationList = [
    ',', '.', '?', '!', '<', '/', '>', '(', ')', '\n', ':', ';', '$', '"', '*', '-', '£', '&',
];

let punctuationSet = undefined;

/**
 * Convert punctuations into spaces
 * @param {String} str
 */
function convertPunctuation(str) {
    if (punctuationSet === undefined) {
        punctuationSet = ListToSet(punctuationList);
    }
    let ret = '';
    for (let i in str) {
        if (punctuationSet.Has(str[i])) {
            ret += ' ';
        } else {
            ret += str[i];
        }
    }
    return ret;
}

import {stopWords} from "./stop_words";

const customStopWords = [
    '', 'br',
];

let stopWordSet = undefined;

/**
 * Check if a word is stop word
 * @param {String} word
 * @return {boolean}
 */
function isStopWord(word) {
    if (stopWordSet === undefined) {
        stopWordSet = ListToSet(stopWords.concat(customStopWords));
    }
    return stopWordSet.Has(word);
}

/**
 * Format content before split
 * @param {String} str
 */
export function FormatContent(str) {
    return convertPunctuation(str).toLowerCase();
}

/**
 * Format words after split
 * @param {[String[],Number[]]} wordsAndPoints
 * @return {[String[],Number[]]}
 */
export function FormatWords(wordsAndPoints) {
    let retWords = [], retPoints = [];
    for (let i in wordsAndPoints[0]) {
        let word = wordsAndPoints[0][i];
        let point = wordsAndPoints[1][i];

        // Remove quotation marks
        if (word[0] === "'" && word[word.length - 1] === "'" || word[0] === '"' && word[word.length - 1] === '"') {
            word = word.substring(1, word.length - 1);
            point++;
        }
        // drop stop words
        if (isStopWord(word)) {
            continue;
        }
        // drop numbers
        if (!isNaN(Number(word))) {
            continue;
        }

        retWords.push(word);
        retPoints.push(point);
    }
    return [retWords, retPoints];
}