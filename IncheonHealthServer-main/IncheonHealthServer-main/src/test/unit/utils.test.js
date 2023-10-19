import {parseCsvStr} from "../../utils.js";

test('parseCvsStr Test',async ()=>{
    let data = `a,b,c
    d,e, f`;
    let parsed = parseCsvStr(data);
    expect(parsed).toEqual([['a','b','c'],['d','e','f']])
})