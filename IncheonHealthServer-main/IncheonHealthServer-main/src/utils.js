import { parse } from 'csv-parse/sync'

function parseCsvStr(csvStr, removeFirstLine = false) {
    let ret = parse(csvStr, { trim: true })

    if(removeFirstLine) {
        ret.shift();
    }
    return ret;
}

function euclidDist(ax,ay,bx,by){
    return ((ax-bx)**2 + (ay-by)**2)**(0.5)
}

const zip = (a, b) => a.map((k, i) => [k, b[i]]);
const zip3 = (a,b,c) => a.map((k,i) => [k, b[i], c[i]]);

export {
    parseCsvStr,
    euclidDist,
    zip,
    zip3
};