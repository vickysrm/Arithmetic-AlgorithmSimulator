export const bitPairRecoding = async (multiplicand, multiplier) => {
  const steps = [];
  const BITS = 8;
  const MASK = (1 << BITS) - 1;

  validateInputs(multiplicand, multiplier, BITS);

  // Convert to binary and pad with zeros
  let M = toBinary(multiplicand & MASK, BITS);
  let Q = toBinary(multiplier & MASK, BITS) + '0'; // Add extra 0 for recoding
  
  steps.push({
    step: 0,
    operation: 'Init',
    description: 'Initialize M=multiplicand, Q=multiplier',
    M,
    Q,
    A: '00000000'
  });

  // Create recoding table
  const recodingTable = {
    '000': { value: 0, operation: 'Add 0' },
    '001': { value: 1, operation: 'Add M' },
    '010': { value: 1, operation: 'Add M' },
    '011': { value: 2, operation: 'Add 2M' },
    '100': { value: -2, operation: 'Subtract 2M' },
    '101': { value: -1, operation: 'Subtract M' },
    '110': { value: -1, operation: 'Subtract M' },
    '111': { value: 0, operation: 'Add 0' }
  };

  let A = '00000000';
  let stepCount = 1;

  // Process 2 bits at a time
  for (let i = Q.length - 2; i > 0; i -= 2) {
    const triplet = Q[i - 1] + Q[i] + Q[i + 1];
    const { value, operation } = recodingTable[triplet];

    steps.push({
      step: stepCount++,
      operation: 'Examine Bits',
      description: `Examining bits: ${triplet}`,
      M,
      Q,
      A,
      triplet
    });

    // Perform operation based on recoding
    let oldA = A;
    switch (value) {
      case 1:
        A = addBinary(A, M);
        break;
      case 2:
        A = addBinary(A, shiftLeft(M));
        break;
      case -1:
        A = subtractBinary(A, M);
        break;
      case -2:
        A = subtractBinary(A, shiftLeft(M));
        break;
    }

    steps.push({
      step: stepCount++,
      operation,
      description: `${operation}: A = ${A}`,
      M,
      Q,
      A,
      previousA: oldA
    });

    // Shift right two positions
    oldA = A;
    A = arithmeticShiftRight(A, 2);

    steps.push({
      step: stepCount++,
      operation: 'Shift Right',
      description: 'Arithmetic shift right 2 positions',
      M,
      Q,
      A,
      previousA: oldA
    });
  }

  const result = parseInt(A, 2);
  steps.push({
    step: stepCount,
    operation: 'Result',
    description: `Final Result: ${result} (${multiplicand} × ${multiplier})`,
    M,
    Q,
    A,
    result
  });

  return steps;
};

// Helper Functions
function validateInputs(multiplicand, multiplier, bits) {
  if (!Number.isInteger(multiplicand) || !Number.isInteger(multiplier)) {
    throw new Error('Inputs must be integers');
  }
  const min = -(1 << (bits - 1));
  const max = (1 << (bits - 1)) - 1;
  if (multiplicand < min || multiplicand > max || 
      multiplier < min || multiplier > max) {
    throw new Error(`Values must fit in ${bits}-bit signed range (${min} to ${max})`);
  }
}

function toBinary(value, bits) {
  const mask = (1 << bits) - 1;
  return (value & mask).toString(2).padStart(bits, '0');
}

function addBinary(a, b) {
  const sum = (parseInt(a, 2) + parseInt(b, 2)) & 0xFF;
  return sum.toString(2).padStart(8, '0');
}

function subtractBinary(a, b) {
  const diff = (parseInt(a, 2) - parseInt(b, 2)) & 0xFF;
  return diff.toString(2).padStart(8, '0');
}

function shiftLeft(binary) {
  const value = (parseInt(binary, 2) << 1) & 0xFF;
  return value.toString(2).padStart(8, '0');
}

function arithmeticShiftRight(binary, positions) {
  let value = parseInt(binary, 2);
  const signBit = value & 0x80;
  value = value >> positions;
  if (signBit) {
    value |= (0xFF << (8 - positions));
  }
  value &= 0xFF;
  return value.toString(2).padStart(8, '0');
}