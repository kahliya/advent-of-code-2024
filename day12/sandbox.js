const bb = {
    1: 400,
    2: 300
}

console.log(Object.keys(bb)[0])
console.log([4,1,6,8].filter(item => {
    console.log(item, Object.keys(bb).map(x => parseInt(x)))
    return Object.keys(bb).map(x => parseInt(x)).indexOf(item) < 0;
}));


const xx = [
    1, 2, 3, 4
]

console.log(xx.filter(x => x < 2));
console.log(xx);