const fs = require('node:fs');

const helpers = {
    readFile: (filePath) => {
        return fs.readFileSync(filePath, 'utf8');
    },
    parseInput: (input) => {
        let tmp = input.split('\r\n')
        tmp = tmp.map(x => x.split(': ')[1])
        
        return [
            BigInt(tmp[0]),
            BigInt(tmp[1]),
            BigInt(tmp[2]),
            tmp[4].split(',').map(x => BigInt(x))
        ];
    }
}

module.exports = helpers;
