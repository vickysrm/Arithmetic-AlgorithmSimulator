export const boothAlgorithm = async (multiplicand, multiplier) => {
  const steps = [];
  
  // Convert to binary and pad with zeros
  let M = parseInt(multiplicand).toString(2).padStart(8, '0');
  let Q = parseInt(multiplier).toString(2).padStart(8, '0');
  let A = '00000000';
  let Q_1 = '0';
  
  steps.push({
    step: 0,
    description: 'Initial values',
    A,
    Q,
    Q_1,
    M,
    operation: 'Initialize'
  });

  // Number of steps = number of bits in multiplier
  for (let i = 0; i < 8; i++) {
    const lastPair = Q.slice(-1) + Q_1;
    let operation = 'No operation';
    
    switch (lastPair) {
      case '10':
        A = subtractBinary(A, M);
        operation = 'Subtract M';
        break;
      case '01':
        A = addBinary(A, M);
        operation = 'Add M';
        break;
    }

    steps.push({
      step: i + 1,
      description: `Q₀Q₋₁ = ${lastPair}`,
      A,
      Q,
      Q_1,
      M,
      operation
    });

    // Arithmetic right shift
    Q_1 = Q.slice(-1);
    Q = A.slice(-1) + Q.slice(0, -1);
    A = A[0] + A.slice(0, -1);

    steps.push({
      step: i + 1.5,
      description: 'Right Shift',
      A,
      Q,
      Q_1,
      M,
      operation: 'Shift'
    });
  }

  const result = parseInt(A + Q, 2);
  steps.push({
    step: steps.length + 1,
    description: 'Final Result',
    A,
    Q,
    Q_1,
    M,
    operation: `Result = ${result} (${multiplicand} × ${multiplier})`
  });

  return steps;
};

// Helper function to perform binary subtraction
function subtractBinary(a, b) {
  const aNum = parseInt(a, 2);
  const bNum = parseInt(b, 2);
  let result = (aNum - bNum) & 0xFF; // Keep 8 bits
  return result.toString(2).padStart(8, result < 0 ? '1' : '0');
}

// Helper function to perform binary addition
function addBinary(a, b) {
  const aNum = parseInt(a, 2);
  const bNum = parseInt(b, 2);
  let result = (aNum + bNum) & 0xFF; // Keep 8 bits
  return result.toString(2).padStart(8, result < 0 ? '1' : '0');
}

// Helper function to format binary numbers with spaces for readability
function formatBinary(binary) {
  return binary.match(/.{1,4}/g).join(' ');
}

// Helper function to validate inputs
function validateInputs(multiplicand, multiplier) {
  if (!Number.isInteger(multiplicand) || !Number.isInteger(multiplier)) {
    throw new Error('Inputs must be integers');
  }
  
  // Check if numbers are within 8-bit range (-128 to 127)
  if (multiplicand < -128 || multiplicand > 127 || 
      multiplier < -128 || multiplier > 127) {
    throw new Error('Numbers must be within 8-bit range (-128 to 127)');
  }
}