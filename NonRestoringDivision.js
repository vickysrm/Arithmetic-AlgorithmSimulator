export const nonRestoringDivision = async (dividend, divisor) => {
  const steps = [];
  const BITS = 8;
  const MASK = (1 << BITS) - 1;
  const MSB = 1 << (BITS - 1);

  validateInputs(dividend, divisor, BITS);

  const signDividend = dividend < 0;
  const signDivisor = divisor < 0;

  const absDividend = Math.abs(dividend);
  const absDivisor = Math.abs(divisor);

  let A = 0;
  let Q = absDividend & MASK;
  const M = absDivisor & MASK;

  steps.push({
    step: 0,
    operation: 'Init',
    description: 'Initialize A=0, Q=abs(dividend), M=abs(divisor)',
    A: toBinary(A, BITS),
    Q: toBinary(Q, BITS),
    M: toBinary(M, BITS)
  });

  for (let i = 1; i <= BITS; i++) {
    // Left shift A,Q: A <- (A<<1) | Q[MSB]; Q <- Q<<1
    const qMsb = (Q & MSB) ? 1 : 0;
    A = ((A << 1) | qMsb) & MASK;
    Q = (Q << 1) & MASK;

    steps.push({
      step: i * 10 + 1,
      operation: 'Shift Left',
      description: 'Left shift A and Q (A<-A<<1|Q[MSB]; Q<-Q<<1)',
      A: toBinary(A, BITS),
      Q: toBinary(Q, BITS),
      M: toBinary(M, BITS)
    });

    // If A >= 0 => A = A - M else A = A + M
    if ((A & MSB) === 0) { // A non-negative
      A = (A - M) & MASK;
      steps.push({
        step: i * 10 + 2,
        operation: 'A = A - M',
        description: 'A was non-negative; subtract M',
        A: toBinary(A, BITS),
        Q: toBinary(Q, BITS),
        M: toBinary(M, BITS)
      });
    } else { // A negative
      A = (A + M) & MASK;
      steps.push({
        step: i * 10 + 2,
        operation: 'A = A + M',
        description: 'A was negative; add M',
        A: toBinary(A, BITS),
        Q: toBinary(Q, BITS),
        M: toBinary(M, BITS)
      });
    }

    // Set Q0 based on sign of A after addition/subtraction
    if ((A & MSB) === 0) { // A non-negative => Q0 = 1
      Q = Q | 1;
      steps.push({
        step: i * 10 + 3,
        operation: 'Set Q0 = 1',
        description: 'A non-negative, set current quotient bit to 1',
        A: toBinary(A, BITS),
        Q: toBinary(Q, BITS),
        M: toBinary(M, BITS)
      });
    } else { // A negative => Q0 = 0
      Q = Q & (~1);
      steps.push({
        step: i * 10 + 3,
        operation: 'Set Q0 = 0',
        description: 'A negative, set current quotient bit to 0',
        A: toBinary(A, BITS),
        Q: toBinary(Q, BITS),
        M: toBinary(M, BITS)
      });
    }
  }

  // Final correction if A is negative
  if ((A & MSB) !== 0) {
    A = (A + M) & MASK;
    steps.push({
      step: 999,
      operation: 'Final Correction',
      description: 'A negative after iterations, add M to correct remainder',
      A: toBinary(A, BITS),
      Q: toBinary(Q, BITS),
      M: toBinary(M, BITS)
    });
  }

  // Compute numeric results and apply signs
  let quotient = Q;
  if (signDividend !== signDivisor) {
    quotient = -quotient;
  }

  let remainder = A;
  if (signDividend) {
    remainder = -remainder;
  }

  steps.push({
    step: 1000,
    operation: 'Result',
    description: 'Final numeric quotient and remainder (with signs applied)',
    quotient,
    remainder,
    A: toBinary(A, BITS),
    Q: toBinary(Q, BITS),
    M: toBinary(M, BITS)
  });

  return steps;
};

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

function toBinary(value, bits) {
  return (value & ((1 << bits) - 1)).toString(2).padStart(bits, '0');
}