const backwards = (curr) => {
    return curr === 'up' ? 'down'
        : curr === 'down' ? 'up'
        : curr === 'left' ? 'right'
        : curr === 'right' ? 'left' : null;
}

const clockwiseTurn = (curr, clockwise=true) => {
    const direction = curr === 'up' ? 'right'
        : curr === 'right' ? 'down'
        : curr === 'down' ? 'left'
        : curr === 'left' ? 'up' : null;

    return clockwise ? direction : backwards(direction);
}

const getWalls = (coord) => {
    const curr = field[coord[0]][coord[1]];
    const walls = [];

    for (x of ["left", "right", "up", "down"]) {
        const adj = getCoordIfPartOfSection(step(coord, x), curr);
        if (!adj) {
            walls.push(x);
        }
    }

    return walls;
}

// Fails to count inner perimeter
const getFencePricingBySides = (sections) => {
    let price = 0;

    sections.forEach(section => {
        let walls = {};
        let path = [];

        for (coordString of section) {
            const coord = JSON.parse(coordString);
            const cellWalls = getWalls(coord);
            
            if (cellWalls.length > 0) {
                walls[coordString] = cellWalls;
            }
        }

        let startCoord = Object.keys(walls)[0]
        let startWall = [startCoord, walls[startCoord][0]];
        let nextWall = null;

        while(JSON.stringify(nextWall) !== JSON.stringify(startWall)) {
            if (!nextWall) {
                nextWall = [...startWall];
            }

            let direction = nextWall[1];
            if (walls[nextWall[0]].includes(direction)) {
                path.push(direction);
                direction = clockwiseTurn(direction);
                nextWall[1] = direction;
            } else {
                nextWall = [JSON.stringify(step(JSON.parse(nextWall[0]), direction)), clockwiseTurn(direction, false)]
            }
        }

        // Remove any consecutives
        path = path.filter((item, idx, arr) => {
            return idx === 0 || item !== arr[idx-1];
        })

        let area = section.length;
        let sides = (path[0] !== path[path.length-1]) ? path.length : path.length-1;

        price += area * sides;
    })

    return price;
}