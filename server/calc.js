
function doMath(num1, num2, op){
    let calc = {
        '+': ()=> num1+num2,
        '-': ()=> num1-num2,
        '*': ()=> num1*num2,
        '/': ()=> num1/num2
    }
    calc['x'] = calc['X'] = calc['*'];
    return calc[op]();
}

let n1 = parseInt(process.argv[2]);
let op = process.argv[3];
let n2 = parseInt(process.argv[4]);

let answer = doMath(n1, n2, op);

console.log(answer);