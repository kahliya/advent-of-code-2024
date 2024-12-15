const fs = require('node:fs');

const helpers = {
    readFile: (filePath) => {
        return fs.readFileSync(filePath, 'utf8');
    },
    parseInput: (input) => {
        let [grid, moves] = input.split('\r\n\r\n');
        
        grid = grid.split('\r\n');
        grid = grid.map(row => row.split('').flatMap(cell => {
            return cell === '#' ? ['#', '#']
                : cell === 'O' ? ['[', ']']
                : cell === '@' ? ['@', '.']
                : ['.', '.'];
        }));

        moves = moves.replaceAll('\r\n', '').split('');
        return [grid, moves];
    },
    step: (coord, direction, MAX_LENGTH, MAX_HEIGHT) => {
        const newCoord = 
            direction === '<' ? [coord[0], coord[1]-1] 
            : direction === '>' ? [coord[0], coord[1]+1]
            : direction === '^' ? [coord[0]-1, coord[1]]
            : direction === 'v' ? [coord[0]+1, coord[1]] : null;
        
        return (newCoord[0] < 0 || newCoord[0] > MAX_HEIGHT || newCoord[1] < 0 || newCoord[1] > MAX_LENGTH) 
            ? null : newCoord;
    }

}

module.exports = helpers;
