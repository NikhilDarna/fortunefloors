import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './EMICalculator.css';

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(8000000);
  const [loanTenure, setLoanTenure] = useState(30);
  const [interestRate, setInterestRate] = useState(7.1);
  const [propertyFinalized, setPropertyFinalized] = useState('no');
  const [emi, setEmi] = useState(0);
  const [principalAmount, setPrincipalAmount] = useState(0);
  const [interestAmount, setInterestAmount] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [errors, setErrors] = useState({});
  const offersRef = useRef(null);

  const validateInputs = () => {
    const newErrors = {};
    
    if (!loanAmount || loanAmount <= 0) {
      newErrors.loanAmount = 'Loan amount must be greater than 0';
    } else if (loanAmount < 100000) {
      newErrors.loanAmount = 'Minimum loan amount is ₹1,00,000';
    } else if (loanAmount > 100000000) {
      newErrors.loanAmount = 'Maximum loan amount is ₹10,00,00,000';
    }
    
    if (!loanTenure || loanTenure <= 0) {
      newErrors.loanTenure = 'Loan tenure must be greater than 0';
    } else if (loanTenure < 1) {
      newErrors.loanTenure = 'Minimum tenure is 1 year';
    } else if (loanTenure > 40) {
      newErrors.loanTenure = 'Maximum tenure is 40 years';
    }
    
    if (!interestRate || interestRate <= 0) {
      newErrors.interestRate = 'Interest rate must be greater than 0';
    } else if (interestRate < 1) {
      newErrors.interestRate = 'Minimum interest rate is 1%';
    } else if (interestRate > 20) {
      newErrors.interestRate = 'Maximum interest rate is 20%';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateEMI = () => {
    if (!validateInputs()) {
      return;
    }

    const P = parseFloat(loanAmount);
    const R = parseFloat(interestRate) / 12 / 100;
    const N = parseFloat(loanTenure) * 12;
    
    const emiAmount = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const totalPaymentAmount = emiAmount * N;
    const totalInterestAmount = totalPaymentAmount - P;
    
    setEmi(Math.round(emiAmount));
    setPrincipalAmount(P);
    setInterestAmount(Math.round(totalInterestAmount));
    setTotalPayment(Math.round(totalPaymentAmount));
  };

  useEffect(() => {
    calculateEMI();
  }, [loanAmount, loanTenure, interestRate]);

  const handleLoanAmountChange = (value) => {
    const cleanValue = parseInt(value.replace(/,/g, '')) || 0;
    setLoanAmount(cleanValue);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getPrincipalPercentage = () => {
    if (!totalPayment) return 0;
    return Math.round((principalAmount / totalPayment) * 100);
  };

  const getInterestPercentage = () => {
    if (!totalPayment) return 0;
    return Math.round((interestAmount / totalPayment) * 100);
  };

  const handleBankOfferClick = (bankName) => {
    alert(`Viewing details for ${bankName} home loan offer`);
  };

  const scrollOffers = (direction) => {
    if (!offersRef.current) return;
    const scrollAmount = 340; // Card width + gap
    offersRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  // Auto-scroll for mobile
  useEffect(() => {
    const slider = offersRef.current;
    if (!slider || window.innerWidth > 768) return;

    const autoScroll = setInterval(() => {
      if (!slider) return;
      
      slider.scrollBy({
        left: slider.offsetWidth / 2,
        behavior: 'smooth'
      });

      // Reset to start to create infinite loop
      if (
        slider.scrollLeft + slider.offsetWidth >=
        slider.scrollWidth - 10
      ) {
        setTimeout(() => {
          slider.scrollTo({ left: 0, behavior: 'instant' });
        }, 600);
      }
    }, 3000);

    return () => clearInterval(autoScroll);
  }, []);

  // Bank offers data with duplicates for infinite scroll
  const bankOffers = [
    {
      bankName: 'State Bank of India',
      bankCode: 'SBI',
      interestRate: '8.5%',
      loanAmount: '₹50L',
      tenure: '30 Yr',
      emi: '₹38.4K',
      disbursementDays: '7 Days',
      cashReward: '₹5,000',
      recommended: true
    },
    {
      bankName: 'HDFC Bank',
      bankCode: 'HDFC',
      interestRate: '8.7%',
      loanAmount: '₹75L',
      tenure: '25 Yr',
      emi: '₹61.2K',
      disbursementDays: '10 Days',
      cashReward: '₹7,500',
      recommended: false
    },
    {
      bankName: 'ICICI Bank',
      bankCode: 'ICICI',
      interestRate: '8.9%',
      loanAmount: '₹60L',
      tenure: '20 Yr',
      emi: '₹53.8K',
      disbursementDays: '14 Days',
      cashReward: '₹6,000',
      recommended: false
    },
    {
      bankName: 'Axis Bank',
      bankCode: 'AXIS',
      interestRate: '9.1%',
      loanAmount: '₹40L',
      tenure: '15 Yr',
      emi: '₹40.6K',
      disbursementDays: '21 Days',
      cashReward: '₹4,000',
      recommended: false
    },
    {
      bankName: 'Kotak Bank',
      bankCode: 'KOTAK',
      interestRate: '9.3%',
      loanAmount: '₹35L',
      tenure: '20 Yr',
      emi: '₹31.8K',
      disbursementDays: '28 Days',
      cashReward: '₹3,500',
      recommended: false
    }
  ];

  return (
    <div className="emi-calculator-page">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link to="/">Home</Link>
        <span className="breadcrumb-separator">&gt;</span>
        <Link to="/loan-offers">Home Loan</Link>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-current">Home Loan EMI Calculator</span>
      </div>

      {/* Header */}
      <div className="emi-header">
        <h1>Home Loan EMI Calculator</h1>
        <p>Use our Home Loan EMI Calculator to estimate your monthly home loan payments. Simply input the loan amount, interest rate, and tenure to calculate your EMI instantly.</p>
      </div>

      {/* Main Content */}
      <div className="emi-main-content">
        <div className="emi-card">
          {/* Left Column - Input Section */}
          <div className="emi-input-section">
            {/* Logo */}
            <div className="loan-logo">
              <h2>magic<span>Loans</span></h2>
            </div>

            {/* Loan Amount */}
            <div className="input-group">
              <label>Loan Amount</label>
              <div className="amount-input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  type="text"
                  value={loanAmount.toLocaleString('en-IN')}
                  onChange={(e) => handleLoanAmountChange(e.target.value)}
                  className={`amount-input ${errors.loanAmount ? 'error' : ''}`}
                  placeholder="Enter loan amount"
                />
              </div>
              {errors.loanAmount && <span className="error-message">{errors.loanAmount}</span>}
            </div>

            {/* Loan Tenure */}
            <div className="input-group">
              <label>Loan Tenure</label>
              <div className="tenure-input-wrapper">
                <input
                  type="number"
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(parseInt(e.target.value) || 0)}
                  className={`tenure-input ${errors.loanTenure ? 'error' : ''}`}
                  placeholder="Enter tenure in years"
                />
                <span className="tenure-suffix">yrs</span>
              </div>
              {errors.loanTenure && <span className="error-message">{errors.loanTenure}</span>}
            </div>

            {/* Interest Rate */}
            <div className="input-group">
              <label>Interest Rate % (p.a.)</label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                className={`rate-input ${errors.interestRate ? 'error' : ''}`}
                step="0.1"
                placeholder="Enter interest rate"
              />
              {errors.interestRate && <span className="error-message">{errors.interestRate}</span>}
            </div>

            {/* Property Finalization */}
            <div className="input-group">
              <label>Property Finalization</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="property-finalized"
                    value="yes"
                    checked={propertyFinalized === 'yes'}
                    onChange={(e) => setPropertyFinalized(e.target.value)}
                  />
                  <span className="radio-text">Yes</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="property-finalized"
                    value="no"
                    checked={propertyFinalized === 'no'}
                    onChange={(e) => setPropertyFinalized(e.target.value)}
                  />
                  <span className="radio-text">No</span>
                </label>
              </div>
            </div>

            {/* Recalculate Button */}
            <button className="recalculate-btn" onClick={calculateEMI}>
              Recalculate Your EMI
            </button>
          </div>

          {/* Right Column - Output Section */}
          <div className="emi-output-section">
            {/* EMI Amount */}
            <div className="emi-amount-display">
              <p>You are Eligible for EMI Amount</p>
              <h3>{formatCurrency(emi)}</h3>
            </div>

            {/* Donut Chart */}
            <div className="donut-chart-container">
              <div className="donut-chart">
                <svg width="200" height="200" viewBox="0 0 200 200">
                  {/* Background circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#e9ecef"
                    strokeWidth="30"
                  />
                  {/* Principal Amount */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#28a745"
                    strokeWidth="30"
                    strokeDasharray={`${getPrincipalPercentage() * 5.0265} 502.65`}
                    transform="rotate(-90 100 100)"
                  />
                  {/* Interest Amount */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#ffc107"
                    strokeWidth="30"
                    strokeDasharray={`${getInterestPercentage() * 5.0265} 502.65`}
                    strokeDashoffset={`-${getPrincipalPercentage() * 5.0265}`}
                    transform="rotate(-90 100 100)"
                  />
                </svg>
                <div className="chart-center">
                  <div className="chart-amount">{formatCurrency(totalPayment)}</div>
                  <div className="chart-label">Total Amount</div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-color principal"></div>
                  <span>Principal Amount</span>
                  <strong>{formatCurrency(principalAmount)}</strong>
                </div>
                <div className="legend-item">
                  <div className="legend-color interest"></div>
                  <span>Interest Amount</span>
                  <strong>{formatCurrency(interestAmount)}</strong>
                </div>
              </div>
            </div>

            {/* Bank Offers */}
            <div className="bank-offers">
              <h4>Top Banks home loan Offers</h4>
              
              <div className="bank-offer">
                <div className="bank-info">
                  <div className="bank-logo">
                    <div className="bank-placeholder">Bank of Baroda</div>
                  </div>
                  <div className="bank-details">
                    <span className="bank-rate">Rate 8.4% | Max Term 30yrs</span>
                  </div>
                </div>
                <button className="view-btn" onClick={() => handleBankOfferClick('Bank of Baroda')}>View</button>
              </div>

              <div className="bank-offer">
                <div className="bank-info">
                  <div className="bank-logo">
                    <div className="bank-placeholder">State Bank of India</div>
                  </div>
                  <div className="bank-details">
                    <span className="bank-rate">Rate 8.5% | Max Term 30yrs</span>
                  </div>
                </div>
                <button className="view-btn" onClick={() => handleBankOfferClick('State Bank of India')}>View</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Home Loan Offers Section */}
      <div className="home-loan-offers-section">
        <div className="offers-header">
          <h1>Home Loan Offers <span className="new-schemes-tag">New Schemes</span></h1>
          <p>Get personalised home loan offers from top banks in just 2 mins...</p>
        </div>

        <div className="filter-tags">
          <span className="tag">Loan req. - ₹50,00,000</span>
          <span className="tag">Credit Score - 820</span>
          <span className="tag">Ongoing EMI. - ₹10,000</span>
          <span className="tag">Monthly Income - ₹1,00,000</span>
        </div>

        <div className="bank-offers-carousel">
          <button className="carousel-arrow left" onClick={() => scrollOffers('left')}>
            ‹
          </button>
          
          <div className="bank-offers-container" ref={offersRef}>
            {/* Duplicate cards for infinite scroll */}
            {[...bankOffers, ...bankOffers].map((offer, index) => (
              <div className="bank-offer-card" key={index}>
                <div className="bank-logo-name">
                  <div className="bank-logo-placeholder">{offer.bankCode}</div>
                  <div className="bank-name-tag">
                    <h3>{offer.bankName}</h3>
                    {offer.recommended && <span className="recommended-tag">Recommended</span>}
                  </div>
                </div>
                <div className="offer-details">
                  <div className="detail-row">
                    <span className="value">{offer.interestRate}</span>
                    <span className="label">Interest</span>
                  </div>
                  <div className="detail-row">
                    <span className="value">{offer.loanAmount}</span>
                    <span className="label">Loan Amount</span>
                  </div>
                  <div className="detail-row">
                    <span className="value">{offer.tenure}</span>
                    <span className="label">Tenure</span>
                  </div>
                  <div className="detail-row">
                    <span className="value">{offer.emi}</span>
                    <span className="label">Monthly EMI</span>
                  </div>
                  <p className="disbursement-info">Get Loan disbursed under <span className="highlight">{offer.disbursementDays}</span> Days</p>
                  <div className="cash-reward">
                    <span className="reward-icon">🎁</span>
                    <span className="reward-text">Cash Reward</span>
                    <span className="reward-amount">{offer.cashReward}</span>
                  </div>
                  <button className="claim-btn" onClick={() => handleBankOfferClick(offer.bankName)}>Claim Now</button>
                </div>
              </div>
            ))}
          </div>
          
          <button className="carousel-arrow right" onClick={() => scrollOffers('right')}>
            ›
          </button>
        </div>

        {/* Navigation */}
        <div className="offers-navigation">
          <button className="explore-more-btn">
            Explore More Offers
            <span className="nav-arrow">›</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;
