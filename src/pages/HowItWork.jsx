import React from 'react';
import './HowItWork.css';

const HowItWork = () => {
  const buyerSteps = [
    {
      number: 1,
      title: 'Sign Up',
      description: 'Create your free account to get started with property search and listings.',
      icon: '👤'
    },
    {
      number: 2,
      title: 'Search Properties',
      description: 'Use our advanced search filters to find properties that match your criteria.',
      icon: '🔍'
    },
    {
      number: 3,
      title: 'View Details',
      description: 'Explore property details, photos, virtual tours, and neighborhood information.',
      icon: '🏠'
    },
    {
      number: 4,
      title: 'Contact Owner',
      description: 'Get in touch with property owners or agents directly through our platform.',
      icon: '📞'
    },
    {
      number: 5,
      title: 'Schedule Visit',
      description: 'Arrange property visits and inspections to see the property in person.',
      icon: '📅'
    },
    {
      number: 6,
      title: 'Make Offer',
      description: 'Submit your offer and negotiate terms with the seller.',
      icon: '💰'
    },
    {
      number: 7,
      title: 'Complete Transaction',
      description: 'Finalize the purchase with our secure payment and documentation system.',
      icon: '✅'
    }
  ];

  const sellerSteps = [
    {
      number: 1,
      title: 'Create Account',
      description: 'Sign up for a free account to list your properties.',
      icon: '👤'
    },
    {
      number: 2,
      title: 'List Property',
      description: 'Add your property details, photos, and set your price.',
      icon: '📝'
    },
    {
      number: 3,
      title: 'Review & Approve',
      description: 'Our team reviews your listing for quality and accuracy.',
      icon: '✓'
    },
    {
      number: 4,
      title: 'Go Live',
      description: 'Your property is now visible to thousands of potential buyers.',
      icon: '🌐'
    },
    {
      number: 5,
      title: 'Receive Inquiries',
      description: 'Get contacted by interested buyers and respond to their questions.',
      icon: '💬'
    },
    {
      number: 6,
      title: 'Negotiate & Close',
      description: 'Negotiate offers and complete the sale with our support.',
      icon: '🤝'
    }
  ];

  const features = [
    {
      icon: '🔒',
      title: 'Secure Platform',
      description: 'All transactions and communications are encrypted and secure.'
    },
    {
      icon: '🎯',
      title: 'Smart Matching',
      description: 'Our AI-powered algorithm matches you with perfect properties.'
    },
    {
      icon: '📱',
      title: 'Mobile App',
      description: 'Access FortuneFloors on the go with our mobile application.'
    },
    {
      icon: '💬',
      title: '24/7 Support',
      description: 'Get help anytime with our round-the-clock customer support.'
    },
    {
      icon: '📊',
      title: 'Market Insights',
      description: 'Access real-time market data and property value trends.'
    },
    {
      icon: '🤝',
      title: 'Verified Listings',
      description: 'All properties are verified for authenticity and accuracy.'
    }
  ];

  return (
    <div className="how-it-work-container">
      <div className="how-it-work-header">
        <h1>How FortuneFloors Works</h1>
        <p>Your complete guide to buying, selling, and renting properties with ease</p>
      </div>

      <div className="process-tabs">
        <div className="tab-buttons">
          <button className="tab-btn active">For Buyers</button>
          <button className="tab-btn">For Sellers</button>
          <button className="tab-btn">For Renters</button>
        </div>
      </div>

      <div className="process-section">
        <h2>For Property Buyers</h2>
        <div className="steps-grid">
          {buyerSteps.map((step) => (
            <div key={step.number} className="step-card">
              <div className="step-number">{step.number}</div>
              <div className="step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="process-section">
        <h2>For Property Sellers</h2>
        <div className="steps-grid">
          {sellerSteps.map((step) => (
            <div key={step.number} className="step-card">
              <div className="step-number">{step.number}</div>
              <div className="step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="features-section">
        <h2>Why Choose FortuneFloors?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="timeline-section">
        <h2>Typical Transaction Timeline</h2>
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <h3>Day 1-7</h3>
              <p>Property search and initial contact</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <h3>Day 8-14</h3>
              <p>Property visits and inspections</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <h3>Day 15-21</h3>
              <p>Offer submission and negotiation</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <h3>Day 22-30</h3>
              <p>Due diligence and documentation</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <h3>Day 31-45</h3>
              <p>Closing and handover</p>
            </div>
          </div>
        </div>
      </div>

      <div className="tips-section">
        <h2>Pro Tips for Success</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <h3>🎯 Be Specific</h3>
            <p>Use detailed search filters to find exactly what you're looking for.</p>
          </div>
          <div className="tip-card">
            <h3>📸 Quality Photos</h3>
            <p>Listings with high-quality photos get 3x more views.</p>
          </div>
          <div className="tip-card">
            <h3>💰 Market Research</h3>
            <p>Research comparable properties to price your listing competitively.</p>
          </div>
          <div className="tip-card">
            <h3>🤝 Quick Responses</h3>
            <p>Respond to inquiries within 24 hours for better engagement.</p>
          </div>
          <div className="tip-card">
            <h3>📋 Complete Information</h3>
            <p>Provide all necessary details to avoid unnecessary questions.</p>
          </div>
          <div className="tip-card">
            <h3>🔍 Verify Everything</h3>
            <p>Always verify property details and legal documents before proceeding.</p>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of satisfied users who found their perfect property through FortuneFloors</p>
        <div className="cta-buttons">
          <button className="cta-btn primary">Start Searching</button>
          <button className="cta-btn secondary">List Property</button>
        </div>
      </div>
    </div>
  );
};

export default HowItWork;
