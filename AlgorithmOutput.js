import React from 'react';
import styles from './AlgorithmOutput.module.css';

const AlgorithmOutput = ({ steps }) => {
  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <div className={styles.algorithmOutput}>
      <h3 className={styles.title}>Algorithm Steps</h3>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.header}>Step</th>
              <th className={styles.header}>Operation</th>
              <th className={styles.header}>A</th>
              <th className={styles.header}>Q</th>
              <th className={styles.header}>Q₋₁</th>
              <th className={styles.header}>M</th>
            </tr>
          </thead>
          <tbody>
            {steps.map((step, index) => (
              <tr 
                key={index} 
                className={`${styles.row} ${step.operation === 'Shift' ? styles.shiftRow : ''}`}
              >
                <td className={styles.cell}>{step.step % 1 === 0 ? step.step : ''}</td>
                <td className={styles.cell}>{step.operation}</td>
                <td className={`${styles.cell} ${styles.binary}`}>{step.A}</td>
                <td className={`${styles.cell} ${styles.binary}`}>{step.Q}</td>
                <td className={styles.cell}>{step.Q_1}</td>
                <td className={`${styles.cell} ${styles.binary}`}>{step.M}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AlgorithmOutput;