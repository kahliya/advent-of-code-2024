const fs = require('node:fs');

const readFile = (filePath) => {
    return fs.readFileSync(filePath, 'utf8');
}

const parseInput = (input) => {
    return input.split(" ").map(x => parseInt(x));
}

const transformStone = (num) => {
    if (num === 0) {
        return [1];
    }

    const numString = num.toString();
    if (numString.length % 2 === 0) {
        return [parseInt(numString.slice(0, numString.length/2)), parseInt(numString.slice(numString.length/2))]
    }

    return [num * 2024];
}

const blink = (input) => {
    let repr = [];

    for (num of input) {
        const newNum = transformStone(num);
        repr.push(...newNum);
    }

    return repr;
};

const knownAnswersAfter25Blinks = {};

const stoneAfterBlinkXTimes = (repr, times) => {
    let output = repr;

    for (x of [...Array(times).keys()]) {
        // console.log(`Processing blink ${x} | size ${output.length} | unique ${new Set(output).size}`);
        output = blink(output);
    }

    return output;
}

const stoneCountAfterBlink75Times = (repr) => {
    let output = repr;

    for (x of [...Array(20).keys()]) {
        output = blink(output);
        console.log(`Processed blink ${x+1} | size ${output.length} | unique ${new Set(output).size}`);
    }

    let stoneCount = 0;
    output.forEach((x, idx) => {
        if (idx % 1000 === 0) {
            // console.log(`@ ${idx}/${output.length}: ${stoneCount}`);
        }

        if (knownAnswersAfter25Blinks.hasOwnProperty(x)) {
            stoneCount += knownAnswersAfter25Blinks[x];
        } else {
            after25Blinks = stoneAfterBlinkXTimes([x], 20).length;
            knownAnswersAfter25Blinks[x] = after25Blinks;
            stoneCount += after25Blinks
        }
    })

    return stoneCount;
}

// Idea: Blink 25 times, then for each value, blink 25 times, then finally another 25 to get the answer
const stoneCountAfterBlink75TimesV2 = (repr) => {
    let output = repr;
    let tmp = [];
    let tmp2 = [];
    let tmp3 = [];
    let tmp4 = [];
    let tmp5 = [];

    // First 25
    output.forEach(x => {
        let after25 = [];
        if (knownAnswersAfter25Blinks.hasOwnProperty(x)) {
            after25 = knownAnswersAfter25Blinks[x];
        } else {
            after25 = stoneAfterBlinkXTimes([x], 25);
            knownAnswersAfter25Blinks[x] = after25;
        }
        tmp.push(after25);
    })

    // Second 25
    tmp.forEach(rez => {
        rez.forEach(x => {
            let after25 = [];
            if (knownAnswersAfter25Blinks.hasOwnProperty(x)) {
                after25 = knownAnswersAfter25Blinks[x];
            } else {
                after25 = stoneAfterBlinkXTimes([x], 25);
                knownAnswersAfter25Blinks[x] = after25;
            }
            tmp2.push(after25);
        })
    })

    console.log("Running third")

    let stoneCount = 0;
    // Third 25
    tmp2.forEach((rez, idx) => {
        if (idx % 200 === 0) {
            console.log(`@ ${idx}/${tmp2.length}`);
        }

        rez.forEach(x => {
            let after25 = [];
            if (knownAnswersAfter25Blinks.hasOwnProperty(x)) {
                after25 = knownAnswersAfter25Blinks[x];
            } else {
                after25 = stoneAfterBlinkXTimes([x], 25);
                knownAnswersAfter25Blinks[x] = after25;
            }
            
            stoneCount += after25.length;
        })
    })

    return stoneCount;
}

const input = readFile('input.txt');
const repr = parseInput(input);
console.log(repr);

// const y = stoneAfterBlinkXTimes(repr, 40);
// console.log(y);
// console.log(y.length);

// const z = stoneCountAfterBlink50Times(repr);
// console.log(z);
// console.log(z.length);

const stones = stoneCountAfterBlink75TimesV2(repr);
console.log(stones);