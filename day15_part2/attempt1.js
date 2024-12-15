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

            if (cell === '[') {
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
    moves.forEach((move, moveIdx) => {
        let boxesToMove = [];
        let affectedCols = new Set();
        let nextAffectedCols = new Set();

        let nextCoord = step(keyCoords['robot'], move, GRID_LENGTH, GRID_HEIGHT);
        let coordString = JSON.stringify(nextCoord);

        // Since boxes are 2 cells wide now, check if the current cell is the right edge (']' char) of a box
        let boxStartCoord = step(nextCoord, '<', GRID_LENGTH, GRID_HEIGHT);
        let boxStartCoordString = JSON.stringify(boxStartCoord);

        let nextVal = 
            keyCoords['boxes'].includes(coordString) ? '['
            : keyCoords['boxes'].includes(boxStartCoordString) ? ']'
            : keyCoords['walls'].includes(coordString) ? '#'
            : '.';

        if (move === '^' || move === 'v') {
            let row = nextCoord[0];
            affectedCols.add(keyCoords['robot'][1]);

            const hitWall = false;
            while(true) {
                if (hitWall) break;
                if (affectedCols.size === 0) break;

                row = nextCoord[0];
                console.log(moveIdx, move, row, affectedCols, boxesToMove, keyCoords['robot']);

                affectedCols.forEach(col => {
                    coordString = JSON.stringify([row, col]);
                    val = keyCoords['boxes'].includes(coordString) ? '['
                        : keyCoords['boxes'].includes(boxStartCoordString) ? ']'
                        : keyCoords['walls'].includes(coordString) ? '#'
                        : '.';

                    console.log(col, val, affectedCols);
                    
                    if (val === '[' || val === ']') {
                        boxesToMove.push(val === '[' ? nextCoord : boxStartCoord);

                        if (val === '[') { 
                            [nextCoord[1], nextCoord[1]+1].forEach(nextAffectedCols.add, nextAffectedCols);
                        } else if (val === ']') {
                            [nextCoord[1], nextCoord[1]-1].forEach(nextAffectedCols.add, nextAffectedCols);
                        }
                    }

                    // If hit wall, all pushes are ignored.
                    if (val === '#') {
                        hitWall = true;
                    }

                    if (val === '.') {
                        nextAffectedCols.delete(col);
                    }
                })

                nextCoord = step(nextCoord, move, GRID_LENGTH, GRID_HEIGHT);
                affectedCols = new Set(nextAffectedCols);
            }

            if (!hitWall) {
                // Remove duplicated boxes
                boxesToMove = boxesToMove.map(coord => JSON.stringify(coord));
                tmp = new Set(boxesToMove);
                boxesToMove = Array.from(tmp).map(coord => JSON.parse(coord));
    
                boxesToMove.forEach(coord => {
                    boxIdx = keyCoords['boxes'].indexOf(JSON.stringify(coord));
                    keyCoords['boxes'].splice(boxIdx, 1);
                    keyCoords['boxes'].push(JSON.stringify(step(coord, move, GRID_LENGTH, GRID_HEIGHT)));
                })

                keyCoords['robot'] = step(keyCoords['robot'], move, GRID_LENGTH, GRID_HEIGHT);
            }
        } else {
            while(nextVal === '[' || nextVal === ']') {
                boxesToMove.push(nextVal === '[' ? nextCoord : boxStartCoord);
                
                nextCoord = step(nextCoord, move, GRID_LENGTH, GRID_HEIGHT);
                coordString = JSON.stringify(nextCoord);
    
                boxStartCoord = step(nextCoord, '<', GRID_LENGTH, GRID_HEIGHT);
                boxStartCoordString = JSON.stringify(boxStartCoord);
    
                nextVal = 
                    keyCoords['boxes'].includes(coordString) ? '['
                    : keyCoords['boxes'].includes(boxStartCoordString) ? ']'
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
                // Remove duplicated boxes
                boxesToMove = boxesToMove.map(coord => JSON.stringify(coord));
                tmp = new Set(boxesToMove);
                boxesToMove = Array.from(tmp).map(coord => JSON.parse(coord));
    
                boxesToMove.forEach(coord => {
                    boxIdx = keyCoords['boxes'].indexOf(JSON.stringify(coord));
                    keyCoords['boxes'].splice(boxIdx, 1);
                    keyCoords['boxes'].push(JSON.stringify(step(coord, move, GRID_LENGTH, GRID_HEIGHT)));
                })
    
                keyCoords['robot'] = step(keyCoords['robot'], move, GRID_LENGTH, GRID_HEIGHT);
            }
        }

        console.log(move, keyCoords.boxes, keyCoords.robot);
    })
}

const calculateGPS = (boxes) => {
    boxes = boxes.map(x => JSON.parse(x));
    return boxes.reduce((a, b) => a + 100*b[0] + b[1], 0);
}

const input = readFile('input4.txt');
// console.log(input);

let [grid, moves] = parseInput(input);
// console.log(grid, moves);

GRID_HEIGHT = grid.length;
GRID_LENGTH = grid[0].length;

const keyCoords = getKeyCoords(grid);
console.log(keyCoords.boxes, keyCoords.robot);
// console.log(keyCoords['boxes'].sort());

processMoves(moves, keyCoords);
console.log(keyCoords.boxes, keyCoords.robot);
// console.log(keyCoords['boxes'].sort());

const GPSsum = calculateGPS(keyCoords['boxes']);
console.log(GPSsum);