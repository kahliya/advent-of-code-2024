const fs = require('node:fs');

const helpers = {
    readFile: (filePath) => {
        return fs.readFileSync(filePath, 'utf8');
    },
    gcd: (a, b) => {
        if (b === 0) return a;
        return helpers.gcd(b, a%b);
    }
}

module.exports = helpers;
