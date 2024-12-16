const fs = require('node:fs');

const helpers = {
    readFile: (filePath) => {
        return fs.readFileSync(filePath, 'utf8');
    },
    parseInput: (input) => {
        let start = null;
        let end = null;

        repr = input.split('\r\n');
        repr = repr.slice(1, -1)
            .map((row, rowIdx) => row.split('').slice(1, -1)
                .map((cell, cellIdx) => {
                    if (cell === 'S') start = [rowIdx, cellIdx];
                    else if (cell === 'E') end = [rowIdx, cellIdx];

                    if (cell === '#') return 0;
                    else if (cell === '.' || cell === 'S' || cell === 'E') return 1;
                })
            )
            
        return {
            grid: repr, 
            start: start, 
            end: end
        };
    }
}

module.exports = helpers;
