
var data = require('./data.json');
var preProcessingDone = false;
var objectRaw = {}

function getSearchResults (query, k) {
    if (!preProcessingDone) {
        prepareObjectMap();
    }
    let summaryMap = objectRaw.summaryMap;
    let objectMap = objectRaw.objectMap;
    let finalMap = {}
    let queryStringArr = query.split(' ');
    for (let queryElRaw of queryStringArr) {
        let queryEl = queryElRaw.replace(/[^a-zA-Z ]/g, "");
        if (objectMap[queryEl]) {
            for (let keyId of Object.keys(objectMap[queryEl])) {
                if (finalMap[keyId]) {
                    finalMap[keyId] = finalMap[keyId] + objectMap[queryEl][keyId];
                } else {
                    finalMap[keyId] = objectMap[queryEl][keyId];
                }
            }
        }
    }
    //console.log(objectMap['hindsight'], objectMap['bias']);
    //console.log(finalMap);

    //Get Top K results
    let finalKeysArr = Object.keys(finalMap);
    let finalArr = []
    for (let key of finalKeysArr) {
        finalArr.push({id: key, value: finalMap[key]});
    }
    //console.log(finalArr);
    finalArr = finalArr.sort((a,b) => {
        return parseInt(b.value)-parseInt(a.value);
    });
    finalArr = finalArr.slice(0,k);
    //console.log(finalArr);
    finalArr = finalArr.map(el => summaryMap[el.id]);
    console.log(finalArr);
}


function prepareObjectMap () {
    let summaries = data.summaries;
    let objectMap = {}
    let summaryMap = {}
    for (let el of summaries) {
        let summaryArr = el.summary.split(' ');
        for (let summaryElRaw of summaryArr) {
            let summaryEl = summaryElRaw.replace(/[^a-zA-Z ]/g, "");
            if(objectMap[summaryEl]) {
                if(objectMap[summaryEl][el.id]) {
                    objectMap[summaryEl][el.id] = objectMap[summaryEl][el.id] + 1;
                } else {
                    objectMap[summaryEl][el.id] = 1;
                }
            } else {
                objectMap[summaryEl] = {};
                objectMap[summaryEl][el.id]=1;
            }
        }
        summaryMap[el.id] = el;
    }
    preProcessingDone = true;
    objectRaw = {objectMap, summaryMap};
}

getSearchResults('is your problems', 20);