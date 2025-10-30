import React, { useState } from 'react';

const AlgorithmInput = ({ selectedAlgo, onRun, isLoading }) => {
  const [inputValues, setInputValues] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    onRun(inputValues);
  };

  const handleInputChange = (e) => {
    setInputValues({
      ...inputValues,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {(selectedAlgo === 'booth' || selectedAlgo === 'bitpair') && (
        <>
          <input
            type="number"
            name="multiplicand"
            placeholder="Multiplicand"
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="multiplier"
            placeholder="Multiplier"
            onChange={handleInputChange}
          />
        </>
      )}
      {(selectedAlgo === 'restoring' || selectedAlgo === 'nonrestoring') && (
        <>
          <input
            type="number"
            name="dividend"
            placeholder="Dividend"
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="divisor"
            placeholder="Divisor"
            onChange={handleInputChange}
          />
        </>
      )}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Running...' : 'Run Algorithm'}
      </button>
    </form>
  );
};

export default AlgorithmInput;