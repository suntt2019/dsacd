const axios = require('axios');

let synonymsDictionary = undefined;

export function LoadSynonyms(callback) {
    axios.get('/data/synonyms.json').then(function (resp) {
        synonymsDictionary = resp.data;
        callback();
    });
}

export function GetSynonyms(word) {
    if(synonymsDictionary === undefined) {
        LoadSynonyms(()=>{});
    }
    return synonymsDictionary[word];
}
