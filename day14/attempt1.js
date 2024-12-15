const util = require('util');
const { readFile, parseInput, appendFile } = require('./helpers.js');

const GRID_LENGTH = 101; // Horizontal
const GRID_HEIGHT = 103; // Vertical

const calculatePositionAfterXSeconds = ([[startX, startY], [velocityX, velocityY]], seconds) => {
    // const endX = Math.abs((startX + velocityX * seconds) % GRID_LENGTH);
    // const endY = Math.abs((startY + velocityY * seconds) % GRID_HEIGHT);
    // console.log(endX, endY);

    let endX = (startX + (velocityX * seconds % GRID_LENGTH)) % GRID_LENGTH;
    let endY = (startY + (velocityY * seconds % GRID_HEIGHT)) % GRID_HEIGHT;

    endX = endX < 0 ? GRID_LENGTH + endX : endX;
    endY = endY < 0 ? GRID_HEIGHT + endY : endY;

    return [endX, endY];
}

const calculateSafetyFactor = (pos) => {
    const QUAD_LENGTH = (GRID_LENGTH-1)/2;
    const QUAD_HEIGHT = (GRID_HEIGHT-1)/2;

    let quad = [0, 0, 0, 0];
    pos.forEach(([x, y]) => {
        if (x < QUAD_LENGTH && y < QUAD_HEIGHT) {
            quad[0]++;
        } else if (x > QUAD_LENGTH && y < QUAD_HEIGHT) {
            quad[1]++;
        } else if (x < QUAD_LENGTH && y > QUAD_HEIGHT) {
            quad[2]++;
        } else if (x > QUAD_LENGTH && y > QUAD_HEIGHT) {
            quad[3]++;
        }
    })
    
    return quad.reduce((a, b) => a * b);
}


const input = readFile('input.txt');
// console.log(input);

const robots = parseInput(input);
// console.log(robots);

for (let i = 0; i < 10000; i++) {
    const endPos = robots.map(r => calculatePositionAfterXSeconds(r, i));
    const safetyFactor = calculateSafetyFactor(endPos);
    if (safetyFactor > 100000000) continue;

    console.log(i, safetyFactor);

    const gridPlot = [...Array(GRID_HEIGHT)].map(x => Array(GRID_LENGTH).fill(0));
    endPos.forEach(([x, y]) => { gridPlot[y][x]++ });

    gridPlot.forEach(row => {
        row = row.map(x => x > 0 ? 'X' : '.');
        row = row.reduce((a,b) => a + b);
        appendFile(`output-${i}.txt`, row + '\r\n');
    })
}

// const endPos = robots.map(r => calculatePositionAfterXSeconds(r, 18));
// console.log(endPos);
// const safetyFactor = calculateSafetyFactor(endPos);
// console.log(safetyFactor);

// const gridPlot = Array(GRID_HEIGHT).fill(Array(GRID_LENGTH).fill(0));
// endPos.forEach(([x, y]) => { gridPlot[y][x]++ });

// gridPlot.forEach(row => {
//     appendFile('output.txt', JSON.stringify(row) + '\r\n');
// })

