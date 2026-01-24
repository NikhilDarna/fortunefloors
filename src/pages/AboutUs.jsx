import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <div className="about-header">
        <h1>About Us</h1>
        <p>Learn more about FortuneFloors and our mission to help you find your dream home</p>
      </div>
      
      <div className="about-content">
        <section className="about-section">
          <h2>Our Story</h2>
          <p>
            FortuneFloors was founded with a simple mission: to make the process of finding, buying, and selling properties 
            as seamless and transparent as possible. With years of experience in the real estate industry, our team 
            understands the challenges and opportunities that come with property transactions.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            We are committed to providing exceptional service, innovative technology, and comprehensive support to help 
            our clients make informed real estate decisions. Whether you're a first-time homebuyer, an investor, or looking 
            to sell your property, we're here to guide you every step of the way.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-item">
              <h3>Integrity</h3>
              <p>We operate with transparency and honesty in all our dealings</p>
            </div>
            <div className="value-item">
              <h3>Excellence</h3>
              <p>We strive for the highest standards in service and technology</p>
            </div>
            <div className="value-item">
              <h3>Innovation</h3>
              <p>We continuously improve our platform to better serve our clients</p>
            </div>
            <div className="value-item">
              <h3>Customer Focus</h3>
              <p>Your success is our priority</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Why Choose FortuneFloors?</h2>
          <ul className="benefits-list">
            <li>Extensive property database with detailed listings</li>
            <li>Advanced search and filtering options</li>
            <li>Verified property listings and trusted agents</li>
            <li>Secure and transparent transaction process</li>
            <li>Expert guidance and support throughout your journey</li>
            <li>Cutting-edge technology for better property discovery</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Our Team</h2>
          <p>
            Our team consists of experienced real estate professionals, technology experts, and customer service specialists 
            who are passionate about helping you achieve your property goals. We bring together diverse expertise to provide 
            you with comprehensive real estate solutions.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
