let target = [2,4,1,3,7,5,4,2,0,3,1,5,5,5,3,0]
target = target.reverse();

// After calculations (found in part2notes.txt), all registers must end with 0.
const REGISTERS = { 
    A: 0n, 
    B: 0n, 
    C: 0n  
}

for (outputIdx in target) {
    output = target[outputIdx]

    if (REGISTERS.A === 0 && outputIdx !== 0) {
        console.log(`ERROR @ Index ${outputIdx}: Program halts here when it should not.`);
        break;
    }

    if (Number(REGISTERS.B) !== output) {
        console.log(`ERROR @ Index ${outputIdx}: Register B's value does not match wanted output.`);
        console.log('B: ', Number(REGISTERS.B), 'Expected: ', output);
        break;
    }

    // [1, 5] (bxl, 5)
    REGISTERS.B = REGISTERS.B ^ 5n;

    // [0, 3] (adv, 3)
    REGISTERS.A = REGISTERS.A * 2n**3n;

    // We skip [4, 2] first, as we need to know C
    // [7, 5] (cdv, B)
    REGISTERS.C = REGISTERS.A * 2n**REGISTERS.B;

    // [4, 2] (bxc, ignored)
    REGISTERS.B = REGISTERS.B ^ REGISTERS.C;

    // [1, 3] (bxl, 3)
    REGISTERS.B = REGISTERS.B ^ 3n;

    // [2, 4] (bst, A)
    // B = A % 8
    REGISTERS.A = 8n + REGISTERS.B;
}

// My brain is not equipped for this... I'm sorry dear reader.
