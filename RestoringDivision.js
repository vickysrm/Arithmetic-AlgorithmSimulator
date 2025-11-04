export const restoringDivision = async (dividend, divisor) => {
  const steps = [];
  const BITS = 8;
  const MASK = (1 << BITS) - 1;

  validateInputs(dividend, divisor, BITS);

  const signDividend = dividend < 0;
  const signDivisor = divisor < 0;

  // Use absolute values for algorithm, apply sign to quotient at the end
  const absDividend = Math.abs(dividend);
  const absDivisor = Math.abs(divisor);

  let A = toTwos(0, BITS);
  let Q = toTwos(absDividend, BITS);
  const M = toTwos(absDivisor, BITS);

  steps.push({
    step: 0,
    operation: 'Init',
    description: `Initialize: A=0, Q=abs(dividend), M=abs(divisor)`,
    A,
    Q,
    M
  });

  for (let i = 1; i <= BITS; i++) {
    // Left shift A,Q (A <- A<<1, A[LSB]=Q[MSB]; Q <- Q<<1)
    const msbQ = Q[0];
    A = A.slice(1) + msbQ;
    Q = Q.slice(1) + '0';

    steps.push({
      step: i * 10 + 1,
      operation: 'Shift Left',
      description: `Left shift A and Q (A<-A<<1; Q<-Q<<1)`,
      A,
      Q,
      M
    });

    // A = A - M
    const tempA = subtractBinary(A, M, BITS);
    steps.push({
      step: i * 10 + 2,
      operation: 'Subtract',
      description: `A = A - M`,
      A: tempA,
      Q,
      M
    });

    // If A < 0 (sign bit 1), restore A and set Q0 = 0; else set Q0 = 1
    if (isNegative(tempA)) {
      // restore A = A + M
      A = addBinary(tempA, M, BITS);
      Q = Q.slice(0, -1) + '0';
      steps.push({
        step: i * 10 + 3,
        operation: 'Restore',
        description: `A was negative, restore A = A + M; set Q0 = 0`,
        A,
        Q,
        M
      });
    } else {
      A = tempA;
      Q = Q.slice(0, -1) + '1';
      steps.push({
        step: i * 10 + 3,
        operation: 'Set Quotient Bit',
        description: `A non-negative, set Q0 = 1`,
        A,
        Q,
        M
      });
    }
  }

  // Final numeric results (adjust signs)
  let quotient = parseInt(Q, 2);
  if (signDividend !== signDivisor) quotient = -quotient;

  let remainder = parseInt(A, 2);
  if (signDividend) remainder = -remainder;

  steps.push({
    step: 999,
    operation: 'Result',
    description: `Final quotient and remainder`,
    quotient,
    remainder,
    A,
    Q,
    M
  });

  return steps;
};

// --- Helpers ---

function validateInputs(dividend, divisor, bits) {
  if (!Number.isInteger(dividend) || !Number.isInteger(divisor)) {
    throw new Error('Dividend and divisor must be integers');
  }
  if (divisor === 0) {
    throw new Error('Divisor cannot be zero');
  }
  const min = -(1 << (bits - 1));
  const max = (1 << (bits - 1)) - 1;
  if (dividend < min || dividend > max || divisor < min || divisor > max) {
    throw new Error(`Values must fit in ${bits}-bit signed range (${min} to ${max})`);
  }
}

function toTwos(value, bits) {
  // convert non-negative integer to binary string padded to bits
  const mask = (1 << bits) - 1;
  const v = value & mask;
  return v.toString(2).padStart(bits, '0');
}

function addBinary(a, b, bits) {
  const mask = (1 << bits) - 1;
  const sum = (parseInt(a, 2) + parseInt(b, 2)) & mask;
  return sum.toString(2).padStart(bits, '0');
}

function subtractBinary(a, b, bits) {
  // a - b mod 2^bits
  const mask = (1 << bits) - 1;
  const diff = (parseInt(a, 2) - parseInt(b, 2)) & mask;
  return diff.toString(2).padStart(bits, '0');
}

function isNegative(binStr) {
  return binStr[0] === '1';
}