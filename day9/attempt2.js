const fs = require('node:fs');

const readFile = (filePath) => {
    return fs.readFileSync(filePath, 'utf8');
}

const getFullRepr = (input) => {
    const repr = [];
    for (x in input) {
        repr.push([x%2 === 0 ? (x/2).toString() : '.', parseInt(input[x])]);
    }

    return repr;
}

const getChecksum = (repr) => {
    let checksum = 0;

    for (x in repr) {
        const fileId = repr[x];
        if (fileId === '.') {
            continue;
        }

        checksum += (x * repr[x]);
    }
    
    return checksum;
}

const getCompressedRepr = (inputRepr) => {
    let repr = [];

    for (x of inputRepr) {
        const ch = x[0];
        let times = x[1];

        if (ch !== '.') {
            // repr += ch.repeat(times);
            repr.push(...Array(times).fill(ch))
            continue;
        }

        while(times > 0) {
            let tail = inputRepr[inputRepr.length-1];
            // console.log(`${repr}, ${times}: ${tail}`);

            if (tail[1] > times) {
                // repr += tail[0].repeat(times);
                repr.push(...Array(times).fill(tail[0]))
                tail[1] = tail[1] - times;
                times = 0
            } else {
                // repr += tail[0].repeat(tail[1]);
                repr.push(...Array(tail[1]).fill(tail[0]))
                times -= tail[1];
                // Remove last 2 elements
                inputRepr.pop();
                inputRepr.pop();
            }
        }
    }

    return repr;
}

const getCompressedRepr2 = (inputRepr) => {
    let repr = [];
    let max = Number.MAX_VALUE;

    for (let x = inputRepr.length-1; x >= 0; x--) {
        const ch = inputRepr[x][0];
        const size = inputRepr[x][1];

        if (ch > max || ch === '.') {
            continue;
        } 
        max = ch;

        // console.log('=== Processing: [', ch, ',', size, ']===')
        for (let y = 0; y < x; y++) {
            if (inputRepr[y][0] !== '.') {
                continue;
            }
            
            let blanks = inputRepr[y][1];

            if (size > blanks) {
                continue;
            }

            // Update blanks count
            inputRepr[y][1] = blanks - size;
            // Replace old file with blanks
            inputRepr[x][0] = '.';
            // Add file into spot
            inputRepr.splice(y, 0, [ch, size]);
            
            break;
        }

        // console.log(inputRepr);
    }

    for (x of inputRepr) {
        repr.push(...Array(x[1]).fill(x[0]));
    }

    return repr;
}

const input = readFile('input.txt');
console.log('Input:', input);

const repr = getFullRepr(input);
console.log(repr);

const cmpRepr = getCompressedRepr2(repr);
console.log(`Compressed: ${cmpRepr}`);

const checksum = getChecksum(cmpRepr);
console.log('Checksum:', checksum);
