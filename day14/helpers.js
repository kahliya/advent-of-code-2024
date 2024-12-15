const fs = require('node:fs');

const helpers = {
    readFile: (filePath) => {
        return fs.readFileSync(filePath, 'utf8');
    },
    appendFile: (filePath, content) => {
        fs.writeFile(filePath, content, { flag: 'a'}, err => {});
    },
    parseInput: (input) => {
        let robots = input
            .split('\r\n')
            .map(x => x.split(' ')
            .map(y => y.slice(2)
            .split(',')
            .map(z => parseInt(z))));

        return robots;
    }

}

module.exports = helpers;
