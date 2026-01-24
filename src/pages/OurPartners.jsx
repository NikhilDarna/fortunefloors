import React, { useState } from 'react';
import './OurPartners.css';

const OurPartners = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const partners = [
    {
      id: 1,
      name: 'Premier Mortgage Co.',
      logo: '/api/placeholder/200/100',
      category: 'financial',
      description: 'Leading mortgage provider with competitive rates and excellent service.',
      website: 'https://premiermortgage.com',
      services: ['Home Loans', 'Refinancing', 'Pre-approval'],
      featured: true
    },
    {
      id: 2,
      name: 'Secure Insurance Group',
      logo: '/api/placeholder/200/100',
      category: 'insurance',
      description: 'Comprehensive insurance solutions for homeowners and property investors.',
      website: 'https://secureinsurance.com',
      services: ['Home Insurance', 'Property Insurance', 'Liability Coverage'],
      featured: true
    },
    {
      id: 3,
      name: 'Legal Eagles Real Estate Law',
      logo: '/api/placeholder/200/100',
      category: 'legal',
      description: 'Expert legal services for real estate transactions and disputes.',
      website: 'https://legaleagles.com',
      services: ['Contract Review', 'Title Search', 'Closing Services'],
      featured: false
    },
    {
      id: 4,
      name: 'Home Inspection Pros',
      logo: '/api/placeholder/200/100',
      category: 'inspection',
      description: 'Professional property inspection services with detailed reports.',
      website: 'https://homeinspectionpros.com',
      services: ['Home Inspection', 'Pest Inspection', 'Radon Testing'],
      featured: true
    },
    {
      id: 5,
      name: 'Movers & Packers Inc.',
      logo: '/api/placeholder/200/100',
      category: 'moving',
      description: 'Reliable moving and packing services for local and long-distance moves.',
      website: 'https://moverspackers.com',
      services: ['Local Moving', 'Long Distance', 'Packing Services'],
      featured: false
    },
    {
      id: 6,
      name: 'Interior Design Studio',
      logo: '/api/placeholder/200/100',
      category: 'design',
      description: 'Creative interior design solutions for homes and commercial spaces.',
      website: 'https://interiordesignstudio.com',
      services: ['Interior Design', 'Space Planning', 'Home Staging'],
      featured: false
    },
    {
      id: 7,
      name: 'Property Management Plus',
      logo: '/api/placeholder/200/100',
      category: 'management',
      description: 'Full-service property management for rental properties.',
      website: 'https://propertymgmtplus.com',
      services: ['Tenant Screening', 'Rent Collection', 'Maintenance'],
      featured: true
    },
    {
      id: 8,
      name: 'Renovation Masters',
      logo: '/api/placeholder/200/100',
      category: 'renovation',
      description: 'Professional home renovation and remodeling services.',
      website: 'https://renovationmasters.com',
      services: ['Kitchen Remodel', 'Bathroom Renovation', 'Additions'],
      featured: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Partners' },
    { id: 'financial', name: 'Financial Services' },
    { id: 'insurance', name: 'Insurance' },
    { id: 'legal', name: 'Legal Services' },
    { id: 'inspection', name: 'Inspection' },
    { id: 'moving', name: 'Moving Services' },
    { id: 'design', name: 'Design & Staging' },
    { id: 'management', name: 'Property Management' },
    { id: 'renovation', name: 'Renovation' }
  ];

  const filteredPartners = selectedCategory === 'all' 
    ? partners 
    : partners.filter(partner => partner.category === selectedCategory);

  const featuredPartners = partners.filter(partner => partner.featured);

  return (
    <div className="partners-container">
      <div className="partners-header">
        <h1>Our Trusted Partners</h1>
        <p>Connecting you with the best real estate service providers</p>
      </div>

      <div className="partners-intro">
        <p>
          At FortuneFloors, we've partnered with industry-leading companies to provide you with comprehensive 
          real estate services. From financing to insurance, legal services to home inspections, our partners 
          are here to support you throughout your property journey.
        </p>
      </div>

      <div className="featured-section">
        <h2>Featured Partners</h2>
        <div className="featured-grid">
          {featuredPartners.map(partner => (
            <div key={partner.id} className="featured-card">
              <div className="partner-logo">
                <img src={partner.logo} alt={partner.name} />
              </div>
              <h3>{partner.name}</h3>
              <p>{partner.description}</p>
              <div className="partner-services">
                {partner.services.map((service, index) => (
                  <span key={index} className="service-tag">{service}</span>
                ))}
              </div>
              <a href={partner.website} target="_blank" rel="noopener noreferrer" className="partner-link">
                Visit Website
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="category-filter">
        <h2>Browse by Category</h2>
        <div className="category-buttons">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="partners-grid">
        {filteredPartners.map(partner => (
          <div key={partner.id} className="partner-card">
            <div className="partner-header">
              <div className="partner-logo">
                <img src={partner.logo} alt={partner.name} />
              </div>
              {partner.featured && <span className="featured-badge">Featured</span>}
            </div>
            
            <div className="partner-info">
              <h3>{partner.name}</h3>
              <p>{partner.description}</p>
              
              <div className="partner-category">
                <span className="category-label">
                  {categories.find(cat => cat.id === partner.category)?.name}
                </span>
              </div>
              
              <div className="partner-services">
                <h4>Services:</h4>
                <div className="services-list">
                  {partner.services.map((service, index) => (
                    <span key={index} className="service-item">{service}</span>
                  ))}
                </div>
              </div>
              
              <div className="partner-actions">
                <a href={partner.website} target="_blank" rel="noopener noreferrer" className="website-btn">
                  Visit Website
                </a>
                <button className="contact-btn">Contact Partner</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPartners.length === 0 && (
        <div className="no-partners">
          <h3>No partners found in this category</h3>
          <p>Try selecting a different category or browse all our partners.</p>
        </div>
      )}

      <div className="partnership-info">
        <h2>Become a Partner</h2>
        <div className="partnership-content">
          <div className="partnership-text">
            <p>
              Are you a real estate service provider looking to expand your reach? Join our network of trusted 
              partners and connect with thousands of potential clients through FortuneFloors.
            </p>
            <ul>
              <li>Increased visibility and leads</li>
              <li>Access to our growing user base</li>
              <li>Marketing and promotional opportunities</li>
              <li>Professional partnership support</li>
            </ul>
          </div>
          <div className="partnership-cta">
            <h3>Ready to Partner?</h3>
            <p>Contact our partnership team to learn more about the benefits and requirements.</p>
            <button className="apply-btn">Apply to Become a Partner</button>
          </div>
        </div>
      </div>

      <div className="testimonials-section">
        <h2>What Our Partners Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>
                "Partnering with FortuneFloors has been a game-changer for our business. We've seen a 40% 
                increase in qualified leads since joining their network."
              </p>
            </div>
            <div className="testimonial-author">
              <h4>John Smith</h4>
              <p>Premier Mortgage Co.</p>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>
                "The quality of referrals we receive from FortuneFloors is exceptional. Their users are 
                serious about buying and selling properties."
              </p>
            </div>
            <div className="testimonial-author">
              <h4>Sarah Johnson</h4>
              <p>Home Inspection Pros</p>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>
                "FortuneFloors provides excellent support to their partners. The onboarding process was smooth, 
                and the ongoing marketing help has been invaluable."
              </p>
            </div>
            <div className="testimonial-author">
              <h4>Mike Davis</h4>
              <p>Secure Insurance Group</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurPartners;
