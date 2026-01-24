import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './HowItWorks.css';

const HowItWorks = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const section = searchParams.get('section') || 'buyers';

  useEffect(() => {
    // Scroll to the appropriate section when component mounts
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [section]);

  const renderContent = () => {
    switch (section) {
      case 'buyers':
        return (
          <div className="content-section">
            <h2>For Buyers</h2>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Search Properties</h3>
                  <p>Browse through our extensive database of properties using advanced filters like location, price range, property type, and more.</p>
                </div>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>View Details</h3>
                  <p>Get comprehensive information about properties including photos, amenities, location details, and pricing.</p>
                </div>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Contact Owners</h3>
                  <p>Connect directly with property owners through our platform to ask questions, schedule visits, and negotiate terms.</p>
                </div>
              </div>
              <div className="step-card">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Get Financing</h3>
                  <p>Explore financing options and loan providers to help you purchase your dream property with ease.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'sellers':
        return (
          <div className="content-section">
            <h2>For Sellers</h2>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>List Property</h3>
                  <p>Create detailed property listings with photos, descriptions, pricing, and amenities to attract potential buyers.</p>
                </div>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Manage Listings</h3>
                  <p>Update your property information, manage inquiries, track views, and edit listings as needed.</p>
                </div>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Track Views</h3>
                  <p>Monitor how many people are viewing your properties and analyze market interest in your listings.</p>
                </div>
              </div>
              <div className="step-card">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Close Deals</h3>
                  <p>Finalize transactions, manage paperwork, and successfully close deals with buyers through our platform.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'renters':
        return (
          <div className="content-section">
            <h2>For Renters</h2>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Find Rentals</h3>
                  <p>Search for rental properties that match your preferences including budget, location, and amenities.</p>
                </div>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Apply Online</h3>
                  <p>Submit rental applications directly through our platform with digital document uploads and instant responses.</p>
                </div>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Schedule Visits</h3>
                  <p>Book property viewings online, communicate with landlords, and schedule in-person visits.</p>
                </div>
              </div>
              <div className="step-card">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Pay Rent</h3>
                  <p>Secure online rent payments, set up automatic payments, and manage your rental expenses.</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="content-section">
            <h2>How FortuneFloors Works</h2>
            <p>Select a user type above to learn more about how our platform works for your specific needs.</p>
          </div>
        );
    }
  };

  return (
    <div className="how-it-works-page">
      <div className="container">
        <h1 className="page-title">How FortuneFloors Works</h1>
        
        {/* Section Navigation */}
        <div className="section-nav">
          <button 
            className={`nav-btn ${section === 'buyers' ? 'active' : ''}`}
            onClick={() => navigate('/how-it-works?section=buyers')}
          >
            For Buyers
          </button>
          <button 
            className={`nav-btn ${section === 'sellers' ? 'active' : ''}`}
            onClick={() => navigate('/how-it-works?section=sellers')}
          >
            For Sellers
          </button>
          <button 
            className={`nav-btn ${section === 'renters' ? 'active' : ''}`}
            onClick={() => navigate('/how-it-works?section=renters')}
          >
            For Renters
          </button>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default HowItWorks;
