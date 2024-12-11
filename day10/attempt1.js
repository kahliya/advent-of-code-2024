const fs = require('node:fs');

const readFile = (filePath) => {
    return fs.readFileSync(filePath, 'utf8');
}

const getMapRepr = (input) => {
    const repr = [];
    let row = [];

    for (let x = 0; x < input.length; x++) {
        const height = parseInt(input[x]);

        // End of row reached 
        if (isNaN(height)) {
            repr.push(row);
            row = [];
            x += 1;
            continue;
        }

        row.push(height);
    }

    repr.push(row);
    return repr;
}

const step = (coord, direction) => {
    const newCoord = 
        direction === 'left' ? [coord[0], coord[1]-1] 
        : direction === 'right' ? [coord[0], coord[1]+1]
        : direction === 'up' ? [coord[0]-1, coord[1]]
        : direction === 'down' ? [coord[0]+1, coord[1]] : null;
    
    return (newCoord[0] < 0 || newCoord[0] > repr.length-1 || newCoord[1] < 0 || newCoord[1] > repr[0].length-1) 
        ? coord : newCoord;
}

const traverseHeadScore = (coord, currHeight) => {
    const x = coord[0];
    const y = coord[1];

    if (repr[x][y] !== currHeight) {
        return [];
    }

    if (currHeight === 9 && repr[x][y] === 9) {
        return [JSON.stringify([x, y])];
    }

    return new Set([
        ...traverseHeadScore(step(coord, 'left'), currHeight+1),
        ...traverseHeadScore(step(coord, 'right'), currHeight+1),
        ...traverseHeadScore(step(coord, 'up'), currHeight+1),
        ...traverseHeadScore(step(coord, 'down'), currHeight+1),
    ]);
}

const traverseHeadRating = (coord, currHeight) => {
    const x = coord[0];
    const y = coord[1];

    if (repr[x][y] !== currHeight) {
        return [];
    }

    if (currHeight === 9 && repr[x][y] === 9) {
        return [JSON.stringify([x, y])];
    }

    return [
        ...traverseHeadRating(step(coord, 'left'), currHeight+1),
        ...traverseHeadRating(step(coord, 'right'), currHeight+1),
        ...traverseHeadRating(step(coord, 'up'), currHeight+1),
        ...traverseHeadRating(step(coord, 'down'), currHeight+1),
    ];
}

const input = readFile('input.txt');
// console.log(input);

const repr = getMapRepr(input);
// console.log(repr);

let score = 0;
repr.forEach((row, rowIdx) => {
    row.forEach((col, colIdx) => {
        // === Score ===
        // const answer = traverseHeadScore([rowIdx, colIdx], 0);
        // if (answer.size) {
        //     score += answer.size;
        // }

        // === Rating ===
        const answer = traverseHeadRating([rowIdx, colIdx], 0);
        score += answer.length;
    })
})

console.log(score);