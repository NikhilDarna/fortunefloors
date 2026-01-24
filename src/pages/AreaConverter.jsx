import React, { useState } from 'react';
import './AreaConverter.css';
import { Link } from 'react-router-dom';

const AreaConverter = () => {
  const [areaValue, setAreaValue] = useState('');
  const [fromUnit, setFromUnit] = useState('sq_meter');
  const [toUnit, setToUnit] = useState('sq_foot');
  const [convertedResult, setConvertedResult] = useState('');

  const conversionRates = {
    acre: 4046.8564224,
    sq_meter: 1,
    sq_kilometer: 1e6,
    sq_foot: 0.092903,
    sq_yard: 0.836127,
    hectare: 10000,
    bigha: 2529.29, // Approximate, varies by region
    guntha: 101.17, // Approximate, varies by region
    cent: 40.4686, // Used in South India
    ground: 222.97, // Used in Tamil Nadu
    kanal: 505.857, // Used in North India
    marla: 25.2929, // Used in North India
  };

  const convertArea = () => {
    const value = parseFloat(areaValue);
    if (isNaN(value) || value <= 0) {
      setConvertedResult('⚠️ Please enter a valid positive number.');
      return;
    }
    const convertedValue = (value * conversionRates[fromUnit]) / conversionRates[toUnit];
    setConvertedResult(`${value} ${fromUnit.replace('_',' ')} = ${convertedValue.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${toUnit.replace('_',' ')}`);
  };

  return (
    <div className="area-converter-page">
      <div className="converter-container">
        <div className="converter-header">
          <Link to="/" className="back-link">← Back to Home</Link>
          <h1>🌍 Area Converter</h1>
          <p>Instantly convert between different area units used in real estate</p>
        </div>

        <div className="converter-card">
          <div className="input-section">
            <label>Enter Value</label>
            <input
              type="number"
              placeholder="Enter area value"
              value={areaValue}
              onChange={(e) => setAreaValue(e.target.value)}
              className="area-input"
            />
          </div>

          <div className="units-section">
            <div className="unit-select">
              <label>From</label>
              <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="unit-dropdown">
                {Object.keys(conversionRates).map((unit) => (
                  <option key={unit} value={unit}>
                    {unit.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="swap-icon">⇌</div>

            <div className="unit-select">
              <label>To</label>
              <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="unit-dropdown">
                {Object.keys(conversionRates).map((unit) => (
                  <option key={unit} value={unit}>
                    {unit.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button className="convert-btn" onClick={convertArea}>
            Convert
          </button>

          {convertedResult && (
            <div className={`result-section ${convertedResult.includes('⚠️') ? 'error' : 'success'}`}>
              {convertedResult}
            </div>
          )}
        </div>

        <div className="info-section">
          <h3>Common Area Conversions</h3>
          <div className="conversion-grid">
            <div className="conversion-item">
              <strong>1 Acre</strong> = 4,047 sq meters
            </div>
            <div className="conversion-item">
              <strong>1 Hectare</strong> = 10,000 sq meters
            </div>
            <div className="conversion-item">
              <strong>1 Bigha</strong> = 2,529 sq meters (approx)
            </div>
            <div className="conversion-item">
              <strong>1 Ground</strong> = 223 sq meters (approx)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaConverter;
