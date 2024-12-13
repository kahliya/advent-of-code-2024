const { readFile, gcd } = require('./helpers.js');

const parseInput = (input) => {
    const repr = [];

    const machines = input.split('\r\n\r\n');
    machines.forEach(m => {
        const params = [];

        const dirty = m.split('\r\n');
        dirty.forEach(d => {
            const param = d.split(': ')[1].split(', ');
            params.push(param.map(p => parseInt(p.slice(2))));
        })

        repr.push(params);
    })

    return repr;
}

const checkIfSolnExists = (a, b, x) => {
    const axisX = (x[0] % gcd(a[0], b[0]) === 0) ? true : false;
    const axisY = (x[1] % gcd(a[1], b[1]) === 0) ? true : false;
    return axisX && axisY;
}

const solvePart1 = (allRepr) => {
    validRepr = allRepr.filter(([a, b, x]) => checkIfSolnExists(a, b, x));

    let tokens = 0;
    validRepr.forEach(([a, b, x]) => {
        let minTokens = Number.MAX_VALUE;

        // Just brute force it lmao
        // Max 100 presses for each button (see challenge desc.)
        for (j of Array(101).keys()) {
            for (k of Array(101).keys()) {
                const axisX = j*a[0] + k*b[0];
                const axisY = j*a[1] + k*b[1];

                if (axisX === x[0] && axisY === x[1]) {
                    minTokens = Math.min(minTokens, (j*3 + k))
                }
            }
        }

        if (minTokens !== Number.MAX_VALUE) {
            tokens += minTokens;
        }
    })

    return tokens;
}

const input = readFile('input2.txt');
// console.log(input);

const allRepr = parseInput(input);
console.log(allRepr);

// const soln = solvePart1(allRepr);
// console.log(soln);

// Part 2 can be solved via Extended Euclidean Algorithm but I can't be bothered to code it out...
