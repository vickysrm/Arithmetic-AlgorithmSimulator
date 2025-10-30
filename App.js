import React, { useState } from "react";
import AlgorithmInput from "./AlgorithmInput";
import AlgorithmOutput from "./AlgorithmOutput";
import { boothAlgorithm } from "./BoothAlgorithm";
import { restoringDivision } from "./RestoringDivision";
import { nonRestoringDivision } from "./NonRestoringDivision";
import { bitPairRecoding } from "./BitPairRecoding";
import "./App.css";

const ALGO_OPTIONS = [
  { 
    id: "booth", 
    name: "Booth's Algorithm",
    description: "Multiplies two signed binary numbers",
    inputs: ["multiplicand", "multiplier"]
  },
  { 
    id: "restoring", 
    name: "Restoring Division",
    description: "Performs binary division with restoration step",
    inputs: ["dividend", "divisor"]
  },
  { 
    id: "nonrestoring", 
    name: "Non-Restoring Division",
    description: "Performs binary division without restoration step",
    inputs: ["dividend", "divisor"]
  },
  { 
    id: "bitpair", 
    name: "Bit-Pair Recoding",
    description: "Modified Booth's algorithm using bit pair recoding",
    inputs: ["multiplicand", "multiplier"]
  },
];

function App() {
  const [selectedAlgo, setSelectedAlgo] = useState("booth");
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const validateInputs = (inputValues) => {
    if (!inputValues) {
      throw new Error("Input values are required");
    }

    switch (selectedAlgo) {
      case "booth":
      case "bitpair":
        if (!inputValues.multiplicand || !inputValues.multiplier) {
          throw new Error("Both multiplicand and multiplier are required");
        }
        if (isNaN(inputValues.multiplicand) || isNaN(inputValues.multiplier)) {
          throw new Error("Inputs must be valid numbers");
        }
        break;
      case "restoring":
      case "nonrestoring":
        if (!inputValues.dividend || !inputValues.divisor) {
          throw new Error("Both dividend and divisor are required");
        }
        if (isNaN(inputValues.dividend) || isNaN(inputValues.divisor)) {
          throw new Error("Inputs must be valid numbers");
        }
        if (Number(inputValues.divisor) === 0) {
          throw new Error("Divisor cannot be zero");
        }
        break;
      default:
        throw new Error("Invalid algorithm selected");
    }
  };

  async function runAlgorithm(inputValues) {
    setIsLoading(true);
    setError(null);
    setSteps([]);

    try {
      validateInputs(inputValues);
      let resultSteps = [];

      switch (selectedAlgo) {
        case "booth":
          resultSteps = await boothAlgorithm(
            Number(inputValues.multiplicand),
            Number(inputValues.multiplier)
          );
          break;
        case "restoring":
          resultSteps = await restoringDivision(
            Number(inputValues.dividend),
            Number(inputValues.divisor)
          );
          break;
        case "nonrestoring":
          resultSteps = await nonRestoringDivision(
            Number(inputValues.dividend),
            Number(inputValues.divisor)
          );
          break;
        case "bitpair":
          resultSteps = await bitPairRecoding(
            Number(inputValues.multiplicand),
            Number(inputValues.multiplier)
          );
          break;
        default:
          throw new Error("Invalid algorithm selected");
      }

      setSteps(resultSteps);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const clearState = () => {
    setSteps([]);
    setError(null);
    setShowHelp(false);
  };

  const selectedAlgorithm = ALGO_OPTIONS.find(algo => algo.id === selectedAlgo);

  return (
    <div className="App">
      <header className="app-header">
        <h1>Binary Arithmetic Algorithms</h1>
        <button 
          className="help-button"
          onClick={() => setShowHelp(!showHelp)}
        >
          {showHelp ? "Hide Help" : "Show Help"}
        </button>
      </header>

      {showHelp && (
        <div className="help-panel">
          <h2>How to use this calculator:</h2>
          <ol>
            <li>Select an algorithm from the tabs below</li>
            <li>Enter the required input values</li>
            <li>Click "Calculate" to see the step-by-step solution</li>
          </ol>
        </div>
      )}

      <div className="algo-tabs">
        {ALGO_OPTIONS.map((opt) => (
          <div key={opt.id} className="algo-tab-wrapper">
            <button
              className={`algo-button ${selectedAlgo === opt.id ? "selected" : ""}`}
              onClick={() => {
                setSelectedAlgo(opt.id);
                clearState();
              }}
            >
              {opt.name}
            </button>
            <div className="algo-description">
              {opt.description}
            </div>
          </div>
        ))}
      </div>

      {selectedAlgorithm && (
        <div className="current-algo-info">
          <h2>{selectedAlgorithm.name}</h2>
          <p>{selectedAlgorithm.description}</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <AlgorithmInput 
        selectedAlgo={selectedAlgo} 
        onRun={runAlgorithm} 
        isLoading={isLoading}
        inputLabels={selectedAlgorithm?.inputs}
      />

      <AlgorithmOutput steps={steps} />
    </div>
  );
}

export default App;