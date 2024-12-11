// PROBLEM: The file IDs are not single numbers :(

const fs = require('node:fs');

const readFile = (filePath) => {
    return fs.readFileSync(filePath, 'utf8');
}

const getInitialFileReprFromInput = (input) => {
    let fileRepr = '';
    for (idx in input) {
        const repeatTimes = input[idx];

        if (idx%2 === 0) {
            fileRepr += `${idx}`.repeat(repeatTimes)
        } else {
            fileRepr += '.'.repeat(repeatTimes);
        }
    }

    return fileRepr;
}

const fillSpacesAndReturnRepr = (inputRepr) => {
    let tmp = inputRepr;
    let repr = '';
    
    for (ch in tmp) {
        if (!tmp[ch]) {
            break
        }

        if (tmp[ch] !== '.') {
            repr += tmp[ch];
            continue;
        }

        repr += tmp.slice(-1);
        tmp = tmp.slice(0, tmp.length-1);
        console.log(tmp);
    }

    console.log(repr)

    return repr;
}

const input = readFile('input.txt');
console.log(`Input: ${input}`);

const fileRepr = getInitialFileReprFromInput(input);
console.log(`Initial Representation: ${fileRepr}`);

const output = fillSpacesAndReturnRepr(fileRepr);
console.log(`Output: ${output}`);
