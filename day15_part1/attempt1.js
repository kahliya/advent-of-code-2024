const { readFile, parseInput, step } = require('./helpers.js');

let GRID_LENGTH = -1;
let GRID_HEIGHT = -1;

const getKeyCoords = (grid) => {
    const boxes = [];
    const walls = [];
    let robot = null;

    grid.forEach((row, rowIdx) => {
        row.forEach((cell, cellIdx) => {
            const coord = JSON.stringify([rowIdx, cellIdx]);

            if (cell === 'O') { 
                boxes.push(coord);
            } else if (cell === '#') {
                walls.push(coord);
            } else if (cell === '@') {
                robot = JSON.parse(coord);
            }
        });
    });

    return { boxes: boxes, walls: walls, robot: robot };
}

const processMoves = (moves, keyCoords) => {
    moves.forEach(move => {
        let boxesToMove = [];

        let nextCoord = step(keyCoords['robot'], move, GRID_LENGTH, GRID_HEIGHT);
        let coordString = JSON.stringify(nextCoord);
        let nextVal = 
            keyCoords['boxes'].includes(coordString) ? 'O'
            : keyCoords['walls'].includes(coordString) ? '#'
            : '.';

        while(nextVal === 'O') {
            boxesToMove.push(nextCoord);
            nextCoord = step(nextCoord, move, GRID_LENGTH, GRID_HEIGHT);
            
            coordString = JSON.stringify(nextCoord);
            nextVal = 
                keyCoords['boxes'].includes(coordString) ? 'O'
                : keyCoords['walls'].includes(coordString) ? '#'
                : '.';
        }

        // console.log(move, nextVal, boxesToMove, keyCoords['robot'])
        // Robot is pushing against a wall, do nothing.
        if (nextVal === '#') {
            return;
        }

        // Robot is pushing towards an empty space, move itself + boxes.
        if (nextVal === '.') {
            boxesToMove.forEach(coord => {
                boxIdx = keyCoords['boxes'].indexOf(JSON.stringify(coord));
                keyCoords['boxes'].splice(boxIdx, 1);
                keyCoords['boxes'].push(JSON.stringify(step(coord, move, GRID_LENGTH, GRID_HEIGHT)));
            })

            keyCoords['robot'] = step(keyCoords['robot'], move, GRID_LENGTH, GRID_HEIGHT);
        }  
    })
}

const calculateGPS = (boxes) => {
    boxes = boxes.map(x => JSON.parse(x));
    return boxes.reduce((a, b) => a + 100*b[0] + b[1], 0);
}

const input = readFile('input.txt');
// console.log(input);

let [grid, moves] = parseInput(input);
// console.log(grid, moves);

GRID_HEIGHT = grid.length;
GRID_LENGTH = grid[0].length;

const keyCoords = getKeyCoords(grid);
console.log(keyCoords);

processMoves(moves, keyCoords);
console.log(keyCoords);

const GPSsum = calculateGPS(keyCoords['boxes']);
console.log(GPSsum);