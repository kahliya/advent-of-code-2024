const { readFile, parseInput } = require('./helpers.js');

const REGISTERS = {
    A: 0,
    B: 0,
    C: 0
}

const OPERATION = {
    0: (operand) => { // adv
        operand = getComboOperand(operand);
        REGISTERS.A = REGISTERS.A / (2n**operand)
    },
    1: (operand) => { // bxl
        REGISTERS.B = REGISTERS.B ^ operand;
    },
    2: (operand) => { // bst
        operand = getComboOperand(operand);
        REGISTERS.B = operand % 8n;
    },
    3: (operand) => { // jnz
        if (REGISTERS.A !== 0n) {
            return [undefined, Number(operand)];
        }
    },
    4: (operand) => { // bxc
        REGISTERS.B = REGISTERS.B ^ REGISTERS.C;
    },
    5: (operand) => { // out
        operand = getComboOperand(operand);
        return [Number(operand % 8n), undefined];
    },
    6: (operand) => { // bdv
        operand = getComboOperand(operand);
        REGISTERS.B = REGISTERS.A / 2n**operand
    },
    7: (operand) => { // cdv
        operand = getComboOperand(operand);
        REGISTERS.C = REGISTERS.A / 2n**operand
    },
}

const getComboOperand = (operand) => {
    switch (operand) {
        case 0n:
        case 1n:
        case 2n:
        case 3n:
            return operand;
        case 4n:
            return REGISTERS.A;
        case 5n:
            return REGISTERS.B;
        case 6n:
            return REGISTERS.C;
        default:
            return null; // Invalid, should not appear!
    }
}

const input = readFile('inputtest.txt');
const [regA, regB, regC, program] = parseInput(input);
REGISTERS.A = regA;
REGISTERS.B = regB;
REGISTERS.C = regC;
// console.log(REGISTERS);
// console.log(program);


let output = [];
for (let i=0; i < program.length; i+=2) {
    const opcode = program[i];
    const operand = program[i+1]

    const [rez, jmp] = OPERATION[opcode](operand) ?? [undefined, undefined];
    if (jmp !== undefined) {
        i = jmp-2; // -2 to account for iteration increase
    }
    if (rez !== undefined) {
        output.push(rez);
    }

    // console.log(rez, jmp, REGISTERS);
}

console.log(REGISTERS);
console.log(output);

