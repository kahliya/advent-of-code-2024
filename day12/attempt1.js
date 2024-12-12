    const fs = require('node:fs');
const { start } = require('node:repl');


const readFile = (filePath) => {
    return fs.readFileSync(filePath, 'utf8');
}

const inputToRepr = (input) => {
    return input.split('\r\n').map(x => x.split(''));
}

const step = (coord, direction) => {
    const newCoord = 
        direction === 'left' ? [coord[0], coord[1]-1] 
        : direction === 'right' ? [coord[0], coord[1]+1]
        : direction === 'up' ? [coord[0]-1, coord[1]]
        : direction === 'down' ? [coord[0]+1, coord[1]] : null;
    
    return (newCoord[0] < 0 || newCoord[0] > field.length-1 || newCoord[1] < 0 || newCoord[1] > field[0].length-1) 
        ? null : newCoord;
}

const getCoordIfPartOfSection = (coord, value) => {
    if (!coord) { 
        return null;
    }
    
    return field[coord[0]][coord[1]] === value ? coord : null;
}

const getAdjacentMatchingCoords = (coord) => {
    const curr = field[coord[0]][coord[1]];
    const adjMatchingCoord = [];

    const left = getCoordIfPartOfSection(step(coord, "left"), curr);
    const right = getCoordIfPartOfSection(step(coord, "right"), curr);
    const up = getCoordIfPartOfSection(step(coord, "up"), curr);
    const down = getCoordIfPartOfSection(step(coord, "down"), curr);

    for (x of [left, right, up, down]) {
        if (x) adjMatchingCoord.push(x);
    }

    return adjMatchingCoord;
}

const getFieldSections = (field) => {
    const knownSections = {}

    field.forEach((x, xIdx) => {
        x.forEach((y, yIdx) => {
            const coord = [xIdx, yIdx];
            let sectionsPartOf = new Set();

            if (!knownSections.hasOwnProperty(y)) {
                knownSections[y] = [[JSON.stringify(coord)]];
                return;
            }

            getAdjacentMatchingCoords(coord).forEach(adj => {
                knownSections[y].forEach((section, idx) => {
                    // console.log(y, coord, section, JSON.stringify(adj), section.includes(JSON.stringify(adj)));
                    if (section.includes(JSON.stringify(adj))) {
                        sectionsPartOf.add(idx);
                    }
                })
            })

            if (sectionsPartOf.size === 0) {
                knownSections[y].push([JSON.stringify(coord)]);
                return;
            }

            sectionsPartOf = Array.from(sectionsPartOf);

            knownSections[y][sectionsPartOf[0]].push(JSON.stringify(coord));
            for(let z = 1; z < sectionsPartOf.length; z++) {
                // Merge into merger
                const merged = knownSections[y][sectionsPartOf[z]];
                knownSections[y][sectionsPartOf[0]].push(...merged);
                
                // Delete the merged section
                knownSections[y].splice(sectionsPartOf[z], 1);
            }
        })
    })

    return knownSections;
}

const getFencePricing = (sections) => {
    let price = 0;

    sections.forEach(section => {
        const area = section.length;
        let perimeter = 0;

        section.forEach(stringCoord => {
            const coord = JSON.parse(stringCoord);
            perimeter += 4 - getAdjacentMatchingCoords(coord).length;
        })

        price += area * perimeter;
    })

    return price;
}

const input = readFile('input.txt');
// console.log(input);

const field = inputToRepr(input);
// console.log(field);

const sections = getFieldSections(field);
// console.log(sections);

// Part 1
const price = getFencePricing(Object.values(sections).flat());
console.log(price);

// // Part 2
// const price = getFencePricingBySides(Object.values(sections).flat());
// console.log(price);
