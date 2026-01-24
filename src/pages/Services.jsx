import React from 'react';
import './Services.css';

const Services = () => {
  return (
    <div className="services-container">
      <div className="services-header">
        <h1>Our Services</h1>
        <p>Comprehensive real estate solutions tailored to meet your needs</p>
      </div>
      
      <div className="services-content">
        <section className="services-intro">
          <h2>What We Offer</h2>
          <p>
            At FortuneFloors, we provide a wide range of real estate services designed to make your property journey 
            smooth, efficient, and successful. Whether you're buying, selling, renting, or investing, we have the 
            expertise and resources to help you achieve your goals.
          </p>
        </section>

        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">🏠</div>
            <h3>Property Buying</h3>
            <p>
              Find your dream home with our extensive property listings, advanced search tools, and expert guidance. 
              We help you navigate the buying process from start to finish.
            </p>
            <ul>
              <li>Property search and filtering</li>
              <li>Virtual tours and photos</li>
              <li>Price negotiations</li>
              <li>Documentation assistance</li>
            </ul>
          </div>

          <div className="service-card">
            <div className="service-icon">💰</div>
            <h3>Property Selling</h3>
            <p>
              Sell your property quickly and at the best price with our comprehensive selling services. We connect you 
              with qualified buyers and handle all aspects of the selling process.
            </p>
            <ul>
              <li>Property valuation</li>
              <li>Marketing and advertising</li>
              <li>Buyer screening</li>
              <li>Closing assistance</li>
            </ul>
          </div>

          <div className="service-card">
            <div className="service-icon">🔑</div>
            <h3>Property Rentals</h3>
            <p>
              Whether you're looking to rent out your property or find a rental home, our rental services make the process 
              simple and efficient with verified listings and secure transactions.
            </p>
            <ul>
              <li>Rental property listings</li>
              <li>Tenant verification</li>
              <li>Rental agreement preparation</li>
              <li>Property management</li>
            </ul>
          </div>

          <div className="service-card">
            <div className="service-icon">📊</div>
            <h3>Property Investment</h3>
            <p>
              Make informed investment decisions with our expert analysis, market insights, and portfolio management 
              services designed for real estate investors.
            </p>
            <ul>
              <li>Investment property analysis</li>
              <li>ROI calculations</li>
              <li>Market trends and insights</li>
              <li>Portfolio diversification</li>
            </ul>
          </div>

          <div className="service-card">
            <div className="service-icon">🏢</div>
            <h3>Commercial Real Estate</h3>
            <p>
              Specialized services for commercial properties including office spaces, retail locations, and industrial 
              properties with expert market knowledge.
            </p>
            <ul>
              <li>Commercial property search</li>
              <li>Lease negotiations</li>
              <li>Property development consulting</li>
              <li>Market analysis</li>
            </ul>
          </div>

          <div className="service-card">
            <div className="service-icon">📋</div>
            <h3>Property Management</h3>
            <p>
              Comprehensive property management services to handle maintenance, tenant relations, and administrative 
              tasks for property owners.
            </p>
            <ul>
              <li>Tenant management</li>
              <li>Maintenance coordination</li>
              <li>Rent collection</li>
              <li>Legal compliance</li>
            </ul>
          </div>
        </div>

        <section className="process-section">
          <h2>How We Work</h2>
          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Consultation</h3>
              <p>We understand your requirements and goals through detailed consultation</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Property Search</h3>
              <p>We find and shortlist properties that match your criteria</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Site Visits</h3>
              <p>Arrange and conduct property visits with expert guidance</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Negotiation</h3>
              <p>Handle price negotiations and terms on your behalf</p>
            </div>
            <div className="step">
              <div className="step-number">5</div>
              <h3>Documentation</h3>
              <p>Manage all legal documentation and paperwork</p>
            </div>
            <div className="step">
              <div className="step-number">6</div>
              <h3>Closing</h3>
              <p>Ensure smooth closing and handover of the property</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h2>Ready to Get Started?</h2>
          <p>Contact us today to discuss your real estate needs and let our expert team help you achieve your property goals.</p>
          <button className="cta-button">Get in Touch</button>
        </section>
      </div>
    </div>
  );
};

export default Services;
