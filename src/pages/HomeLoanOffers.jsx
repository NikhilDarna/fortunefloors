import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './HomeLoanOffers.css';

const HomeLoanOffers = () => {
  const [loanAmount, setLoanAmount] = useState(60);
  const [selectedBank, setSelectedBank] = useState(null);
  const [showLoanDetails, setShowLoanDetails] = useState(false);
  const sliderRef = useRef(null);

  const bankNetwork = [
    { 
      id: 1,
      name: 'Indiabulls', 
      logo: 'IB',
      interestRate: '8.4%',
      processingFee: '2%',
      maxLoanAmount: '₹5 Cr',
      tenure: '30 years',
      prepaymentCharges: 'Nil',
      foreclosureCharges: '4%'
    },
    { 
      id: 2,
      name: 'YES BANK', 
      logo: 'YES',
      interestRate: '8.5%',
      processingFee: '1.5%',
      maxLoanAmount: '₹3 Cr',
      tenure: '25 years',
      prepaymentCharges: '2%',
      foreclosureCharges: '3%'
    },
    { 
      id: 3,
      name: 'AAVAS', 
      logo: 'AAVAS',
      interestRate: '8.6%',
      processingFee: '2.5%',
      maxLoanAmount: '₹2 Cr',
      tenure: '20 years',
      prepaymentCharges: '3%',
      foreclosureCharges: '4%'
    },
    { 
      id: 4,
      name: 'HDFC Bank', 
      logo: 'HDFC',
      interestRate: '8.7%',
      processingFee: '1%',
      maxLoanAmount: '₹10 Cr',
      tenure: '30 years',
      prepaymentCharges: 'Nil',
      foreclosureCharges: '2%'
    },
    { 
      id: 5,
      name: 'ICICI Bank', 
      logo: 'ICICI',
      interestRate: '8.9%',
      processingFee: '2%',
      maxLoanAmount: '₹5 Cr',
      tenure: '25 years',
      prepaymentCharges: '2%',
      foreclosureCharges: '3%'
    },
    { 
      id: 6,
      name: 'State Bank of India', 
      logo: 'SBI',
      interestRate: '8.5%',
      processingFee: '0.5%',
      maxLoanAmount: '₹10 Cr',
      tenure: '30 years',
      prepaymentCharges: 'Nil',
      foreclosureCharges: '2%'
    },
    { 
      id: 7,
      name: 'Axis Bank', 
      logo: 'AXIS',
      interestRate: '9.1%',
      processingFee: '1.5%',
      maxLoanAmount: '₹3 Cr',
      tenure: '20 years',
      prepaymentCharges: '2%',
      foreclosureCharges: '3%'
    },
    { 
      id: 8,
      name: 'Kotak Bank', 
      logo: 'KOTAK',
      interestRate: '9.3%',
      processingFee: '2%',
      maxLoanAmount: '₹2 Cr',
      tenure: '15 years',
      prepaymentCharges: '3%',
      foreclosureCharges: '4%'
    },
    { 
      id: 9,
      name: 'PNB Housing', 
      logo: 'PNB',
      interestRate: '8.8%',
      processingFee: '1.5%',
      maxLoanAmount: '₹1.5 Cr',
      tenure: '20 years',
      prepaymentCharges: '2%',
      foreclosureCharges: '3%'
    },
    { 
      id: 10,
      name: 'LIC Housing', 
      logo: 'LIC',
      interestRate: '8.7%',
      processingFee: '1%',
      maxLoanAmount: '₹5 Cr',
      tenure: '30 years',
      prepaymentCharges: 'Nil',
      foreclosureCharges: '2%'
    },
    { 
      id: 11,
      name: 'Bajaj Housing', 
      logo: 'BAJAJ',
      interestRate: '9.0%',
      processingFee: '2%',
      maxLoanAmount: '₹3 Cr',
      tenure: '25 years',
      prepaymentCharges: '2%',
      foreclosureCharges: '3%'
    },
    { 
      id: 12,
      name: 'Tata Capital', 
      logo: 'TATA',
      interestRate: '8.9%',
      processingFee: '1.5%',
      maxLoanAmount: '₹2 Cr',
      tenure: '20 years',
      prepaymentCharges: '2%',
      foreclosureCharges: '3%'
    }
  ];

  const handleSliderChange = (value) => {
    setLoanAmount(value);
  };

  const handleArrowClick = (direction) => {
    if (direction === 'left' && loanAmount > 45) {
      setLoanAmount(loanAmount - 5);
    } else if (direction === 'right' && loanAmount < 75) {
      setLoanAmount(loanAmount + 5);
    }
  };

  const handleBankClick = (bank) => {
    setSelectedBank(bank);
    setShowLoanDetails(true);
  };

  const handleClosePopup = () => {
    setShowLoanDetails(false);
    setSelectedBank(null);
  };

  const handleGetStarted = () => {
    if (selectedBank) {
      alert(`Applying for ${selectedBank.name} loan of ₹${loanAmount} Lakh`);
    } else {
      alert(`Getting started with loan amount: ₹${loanAmount} Lakh`);
    }
  };

  const calculateEMI = (amount, rate, years) => {
    const principal = amount * 100000; // Convert lakh to rupees
    const r = parseFloat(rate) / 12 / 100;
    const n = years * 12;
    const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(emi);
  };

  return (
    <div className="home-loan-offers-page">
      {/* Header Section */}
      <div className="offers-header">
        <div className="logo-section">
          <div className="fortune-loans-logo">
            <span className="rupee-symbol">₹</span>
            <span className="logo-text">FortuneLoans</span>
          </div>
        </div>
        
        <div className="headline-section">
          <h1 className="main-headline">
            Now Compare Home Loan Offers from <span className="highlight">40+ banks</span>
          </h1>
          <div className="call-to-action">
            <span className="timer-icon">⏱️</span>
            <span className="cta-text">in just 90 Seconds</span>
          </div>
        </div>
      </div>

      <div className="main-content">
        {/* Bank Network Section */}
        <div className="bank-network-section">
          <h2 className="network-title">Our Bank Network</h2>
          <div className="bank-logos-container">
            {bankNetwork.map((bank, index) => (
              <div 
                className="bank-logo-item" 
                key={bank.id}
                onClick={() => handleBankClick(bank)}
                style={{ cursor: 'pointer' }}
              >
                <div className="bank-logo-placeholder">
                  {bank.logo}
                </div>
                <span className="bank-name">{bank.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Loan Amount Input Card */}
        <div className="loan-amount-card">
          <div className="card-header">
            <h3>Enter your required Loan Amount below</h3>
          </div>
          
          <div className="amount-display">
            <span className="currency-symbol">₹</span>
            <span className="amount-value">{loanAmount}</span>
            <span className="amount-unit">Lakh</span>
          </div>

          <div className="slider-container">
            <div className="slider-track">
              <div className="slider-fill" style={{ width: `${((loanAmount - 45) / 30) * 100}%` }}></div>
            </div>
            <input
              ref={sliderRef}
              type="range"
              min="45"
              max="75"
              value={loanAmount}
              onChange={(e) => handleSliderChange(parseInt(e.target.value))}
              className="loan-slider"
            />
            
            <div className="slider-markings">
              <span className="marking">45L</span>
              <span className="marking active">{loanAmount}L</span>
              <span className="marking">75L</span>
            </div>
            
            <div className="slider-arrows">
              <button 
                className="arrow-btn left" 
                onClick={() => handleArrowClick('left')}
                disabled={loanAmount <= 45}
              >
                ‹
              </button>
              <button 
                className="arrow-btn right" 
                onClick={() => handleArrowClick('right')}
                disabled={loanAmount >= 75}
              >
                ›
              </button>
            </div>
          </div>

          <p className="note-text">*Rounded off to nearest lakh</p>
          
          <button className="get-started-btn" onClick={handleGetStarted}>
            Get Started →
          </button>
        </div>
      </div>

      {/* Journey Section */}
      <div className="journey-section">
        <h2 className="journey-title">Our journey so far</h2>
        <div className="journey-stats">
          <div className="stat-item">
            <div className="stat-number">50,000+</div>
            <div className="stat-label">Happy Customers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">₹2,000 Cr+</div>
            <div className="stat-label">Loan Disbursed</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">40+</div>
            <div className="stat-label">Partner Banks</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">98%</div>
            <div className="stat-label">Customer Satisfaction</div>
          </div>
        </div>
      </div>

      {/* Loan Details Popup */}
      {showLoanDetails && selectedBank && (
        <div className="loan-details-overlay" onClick={handleClosePopup}>
          <div className="loan-details-popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>{selectedBank.name} Loan Details</h3>
              <button className="close-btn" onClick={handleClosePopup}>×</button>
            </div>
            
            <div className="popup-content">
              <div className="loan-summary">
                <div className="summary-item">
                  <span className="label">Requested Amount:</span>
                  <span className="value">₹{loanAmount} Lakh</span>
                </div>
                <div className="summary-item">
                  <span className="label">Interest Rate:</span>
                  <span className="value">{selectedBank.interestRate}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Monthly EMI:</span>
                  <span className="value">₹{calculateEMI(loanAmount, selectedBank.interestRate, 20).toLocaleString()}</span>
                </div>
              </div>

              <div className="loan-features">
                <h4>Loan Features</h4>
                <div className="feature-grid">
                  <div className="feature-item">
                    <span className="feature-label">Processing Fee</span>
                    <span className="feature-value">{selectedBank.processingFee}</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-label">Max Loan Amount</span>
                    <span className="feature-value">{selectedBank.maxLoanAmount}</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-label">Max Tenure</span>
                    <span className="feature-value">{selectedBank.tenure}</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-label">Prepayment Charges</span>
                    <span className="feature-value">{selectedBank.prepaymentCharges}</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-label">Foreclosure Charges</span>
                    <span className="feature-value">{selectedBank.foreclosureCharges}</span>
                  </div>
                </div>
              </div>

              <div className="popup-actions">
                <button className="apply-loan-btn" onClick={handleGetStarted}>
                  Apply for {selectedBank.name} Loan
                </button>
                <button className="cancel-btn" onClick={handleClosePopup}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeLoanOffers;
