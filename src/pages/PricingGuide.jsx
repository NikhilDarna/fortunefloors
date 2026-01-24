import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PricingGuide.css';

const PricingGuide = () => {
  const navigate = useNavigate();

  const handleRequestValuation = () => {
    // Navigate to contact page or create a valuation request form
    navigate('/contact');
    // Alternatively, you could navigate to a specific valuation page
    // navigate('/valuation-request');
  };
  return (
    <div className="pricing-guide">
      <div className="pricing-header">
        <h1>Pricing Guide</h1>
        <p>Comprehensive guide to property pricing and valuation</p>
      </div>

      <div className="pricing-content">
        <section className="pricing-section">
          <h2>How We Determine Property Value</h2>
          <div className="pricing-grid">
            <div className="pricing-card">
              <h3>Location Analysis</h3>
              <p>Property values are primarily determined by location factors including neighborhood quality, proximity to amenities, and connectivity.</p>
            </div>
            <div className="pricing-card">
              <h3>Property Specifications</h3>
              <p>Size, age, condition, and features of the property significantly impact its market value.</p>
            </div>
            <div className="pricing-card">
              <h3>Market Trends</h3>
              <p>Current market conditions, demand-supply dynamics, and recent comparable sales influence pricing.</p>
            </div>
          </div>
        </section>

        <section className="pricing-section">
          <h2>Property Pricing Factors</h2>
          <div className="factors-list">
            <div className="factor-item">
              <h4>Property Type</h4>
              <ul>
                <li>Residential Apartments: ₹3,000 - ₹15,000 per sq.ft.</li>
                <li>Independent Houses: ₹4,000 - ₹20,000 per sq.ft.</li>
                <li>Villas: ₹5,000 - ₹25,000 per sq.ft.</li>
                <li>Commercial Spaces: ₹5,000 - ₹30,000 per sq.ft.</li>
              </ul>
            </div>
            <div className="factor-item">
              <h4>Location Premium</h4>
              <ul>
                <li>Prime Locations: +20-40% premium</li>
                <li>Developing Areas: Base pricing</li>
                <li>Upcoming Locations: -10-20% discount</li>
              </ul>
            </div>
            <div className="factor-item">
              <h4>Age & Condition</h4>
              <ul>
                <li>New Construction (0-2 years): Full market value</li>
                <li>Recently Renovated (2-5 years): 90-95% market value</li>
                <li>Older Properties (5+ years): 70-85% market value</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="pricing-section">
          <h2>Additional Cost Considerations</h2>
          <div className="cost-breakdown">
            <div className="cost-item">
              <h4>Registration & Stamp Duty</h4>
              <p>Typically 5-7% of property value</p>
            </div>
            <div className="cost-item">
              <h4>Brokerage Commission</h4>
              <p>1-2% for buyers, 2-4% for sellers</p>
            </div>
            <div className="cost-item">
              <h4>Legal & Documentation</h4>
              <p>₹10,000 - ₹50,000 depending on complexity</p>
            </div>
            <div className="cost-item">
              <h4>Home Loan Processing</h4>
              <p>0.5-2% of loan amount</p>
            </div>
          </div>
        </section>

        <section className="pricing-section">
          <h2>Pricing Tips for Sellers</h2>
          <div className="tips-container">
            <div className="tip-card">
              <h3>Research Comparable Sales</h3>
              <p>Analyze recent sales in your area to set competitive pricing.</p>
            </div>
            <div className="tip-card">
              <h3>Consider Market Timing</h3>
              <p>Seasonal variations and market cycles affect optimal pricing.</p>
            </div>
            <div className="tip-card">
              <h3>Highlight Unique Features</h3>
              <p>Emphasize amenities and features that justify premium pricing.</p>
            </div>
          </div>
        </section>

        <section className="pricing-section">
          <h2>Get Professional Valuation</h2>
          <div className="valuation-cta">
            <p>For accurate property valuation, consult our certified property experts.</p>
            <button className="cta-button" onClick={handleRequestValuation}>Request Valuation</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PricingGuide;
