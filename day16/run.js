const { readFile, parseInput } = require('./helpers.js');

// const { astar, Graph } = require('./astar.js');
// Cannot use A* as the shortest path is NOT what we want
// const runAStar = (gridRepr, start, end) => {
//     const graph = new Graph(gridRepr);
//     const startPos = graph.grid[start[0]][start[1]];
//     const endPos = graph.grid[end[0]][end[1]];
//     let rez = astar.search(graph, startPos, endPos);

//     return rez;
// }

const step = (coord, direction) => {
    const newCoord = 
        direction === '<' ? [coord[0], coord[1]-1] 
        : direction === '>' ? [coord[0], coord[1]+1]
        : direction === '^' ? [coord[0]-1, coord[1]]
        : direction === 'v' ? [coord[0]+1, coord[1]] : null;
    
    return (newCoord[0] < 0 || newCoord[0] > MAX_HEIGHT || newCoord[1] < 0 || newCoord[1] > MAX_LENGTH) 
        ? null : newCoord;
}

const clockwiseTurn = (direction, clockwise=true) => {
    if (direction === '>') return clockwise ? 'v' : '^';
    else if (direction === 'v') return clockwise ? '<' : '>';
    else if (direction === '<') return clockwise ? '^' : 'v';
    else if (direction === '^') return clockwise ? '>' : '<';
}

const traverseGraph = (currPos, currDirection, params, score) => {
    const currPosString = JSON.stringify(currPos);
    const prevCost = knownCosts[currPosString];

    if (currPosString === JSON.stringify(params.end)) {
        console.log('prev:', prevCost, 'curr:', score);
    }

    // If this node was reached with a lower or equal cost, terminate this branch
    if (score >= prevCost) {
        return;
    } else {
        knownCosts[currPosString] = score;
    }
    
    // If out of bounds
    if (!currPos) {
        return;
    }

    // If reached end
    if (currPosString === JSON.stringify(params.end)) {
        return;
    }

    // If hit wall
    if (params.grid[currPos[0]][currPos[1]] === 0) {
        return;
    }

    // Coordinates from current position - Fwd, Left (CCW) & Right (CW)
    const fwdPos = step(currPos, currDirection);

    const leftDirection = clockwiseTurn(currDirection, false);
    const leftPos = step(currPos, leftDirection);

    const rightDirection = clockwiseTurn(currDirection);
    const rightPos = step(currPos, rightDirection);

    traverseGraph(fwdPos, currDirection, params, score+1);
    traverseGraph(leftPos, leftDirection, params, score+1001);
    traverseGraph(rightPos, rightDirection, params, score+1001)
}

const input = readFile('input2.txt');
const params = parseInput(input);
// console.log(params);

const MAX_HEIGHT = params.grid.length-1;
const MAX_LENGTH = params.grid[0].length-1;
const knownCosts = {};
traverseGraph(params.start, '>', params, 0);
console.log(knownCosts[JSON.stringify(params.end)]);
