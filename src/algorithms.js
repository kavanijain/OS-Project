// import {floor} from "lodash";

export function firstInFirstOut(referenceString, frameNumber) {
    let pageInMem = [];
    let pageFaults = [];
    let pageInMemArray = [];
    let pageNotInMem = [];
    let pageNotInMemArray = [];
    let referenceMapArray = [];
    for (let i = 0; i < referenceString.length; i++) {
            //If the frames include the string, no page fault
            if (pageInMem.includes(referenceString[i])) {
                pageFaults.push('H');
            } else {
                //Page fault occurs
                pageFaults.push('F');
                //If there is free frame
                if (pageInMem.length < frameNumber) {
                    //add to the top of the array
                    pageInMem.unshift(referenceString[i]);
                } else {
                    if (pageNotInMem.length >= frameNumber) {
                        pageNotInMem.pop();
                    }
                    pageNotInMem.unshift(pageInMem.pop());
                    //insert the new page into the top of the array
                    pageInMem.unshift(referenceString[i]);
                }
            }
        pageInMemArray.push([...pageInMem]);
        pageNotInMemArray.push([...pageNotInMem]);
    }
    return {pageInMemArray, pageFaults, pageNotInMemArray, referenceMapArray};
}

export function leastRecentlyUsed(referenceString, frameNumber){
    let pageInMem = [];
    let pageFaults = [];
    let pageInMemArray = [];
    let pageNotInMem = [];
    let pageNotInMemArray = [];
    let referenceMapArray = [];
    for (let i = 0; i < referenceString.length ; i++)
    {
        if (pageInMem.includes(referenceString[i])){
            pageFaults.push('H');
            pageInMem.splice(pageInMem.indexOf(referenceString[i]),1);
            pageInMem.unshift(referenceString[i]);
        }
        else{
            pageFaults.push('F');
            if (pageInMem.length < frameNumber){
                pageInMem.unshift(referenceString[i]);
            }
            else{
                if (pageNotInMem.length >= frameNumber) {
                    pageNotInMem.pop();
                }
                pageNotInMem.unshift(pageInMem.pop());
                pageInMem.unshift(referenceString[i]);
            }
        }
        pageInMemArray.push([...pageInMem]);
        pageNotInMemArray.push([...pageNotInMem]);
    }
    return {pageInMemArray, pageFaults, pageNotInMemArray, referenceMapArray};
}

export function notRecentlyUsed(referenceString, frameNumber, resetTurns){
    let pageInMem = [];
    let pageFaults = [];
    let pageInMemArray = [];
    let referenceMap = new Map();
    let pageNotInMem = [];
    let pageNotInMemArray = [];
    let referenceMapArray = [];
    referenceString.forEach( (e) => referenceMap.set(e,0));
    for (let i = 0; i < referenceString.length ; i++)
    {
        if (i%resetTurns === 0){
            referenceString.forEach( (e) => referenceMap.set(e,0));//reset clock condition, reset all reference bit to 0
        }
        if (pageInMem.includes(referenceString[i])){
            pageFaults.push('H');
            referenceMap.set(referenceString[i], 1);                //set reference bit to 1
        }
        else{
            pageFaults.push('F');
            if (pageInMem.length < frameNumber){
                pageInMem.unshift(referenceString[i]);
            }
            else{
                for (let j = frameNumber-1; j >=0 ; j--){
                    if (referenceMap.get(pageInMem[j])===1){
                        referenceMap.set(pageInMem[j], 0);          //second chance, reset reference bit to 0
                    }
                    else
                    {
                        if (pageNotInMem.length >= frameNumber) {
                            pageNotInMem.pop();
                        }
                        pageNotInMem.unshift(pageInMem.splice(pageInMem.indexOf(pageInMem[j]),1)[0]);
                        pageInMem.unshift(referenceString[i]);
                        break;
                    }
                }
            }
        }
        pageInMemArray.push([...pageInMem]);
        pageNotInMemArray.push([...pageNotInMem]);
        referenceMapArray.push(new Map(referenceMap));
    }
    return {pageInMemArray, pageFaults, pageNotInMemArray, referenceMapArray};
}

