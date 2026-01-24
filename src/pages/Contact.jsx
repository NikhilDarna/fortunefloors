import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>Get in touch with our team for any questions or assistance</p>
      </div>

      <div className="contact-content">
        <div className="contact-info-section">
          <h2>Get in Touch</h2>
          <p>
            We're here to help you with all your real estate needs. Whether you're looking to buy, sell, 
            or rent a property, our team of experts is ready to assist you.
          </p>

          <div className="contact-methods">
            <div className="contact-method">
              <div className="contact-icon">📍</div>
              <div className="contact-details">
                <h3>Office Address</h3>
                <p>123 Fortune Street<br />Downtown District<br />City, State 12345</p>
              </div>
            </div>

            <div className="contact-method">
              <div className="contact-icon">📞</div>
              <div className="contact-details">
                <h3>Phone</h3>
                <p>Main: +1 (555) 123-4567<br />Toll-free: 1-800-FORTUNE</p>
              </div>
            </div>

            <div className="contact-method">
              <div className="contact-icon">✉️</div>
              <div className="contact-details">
                <h3>Email</h3>
                <p>General: info@fortunefloors.com<br />Support: support@fortunefloors.com</p>
              </div>
            </div>

            <div className="contact-method">
              <div className="contact-icon">🕐</div>
              <div className="contact-details">
                <h3>Business Hours</h3>
                <p>Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 4:00 PM<br />Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-section">
          <h2>Send us a Message</h2>
          {submitted ? (
            <div className="success-message">
              <h3>Thank you for contacting us!</h3>
              <p>We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="buying">Property Buying</option>
                    <option value="selling">Property Selling</option>
                    <option value="renting">Property Rental</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          )}
        </div>
      </div>

      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>How do I list my property on FortuneFloors?</h3>
            <p>
              Simply create an account, navigate to the "Post Property" section, and fill in the required 
              details about your property. Our team will review and approve your listing within 24 hours.
            </p>
          </div>
          <div className="faq-item">
            <h3>Are there any fees for using FortuneFloors?</h3>
            <p>
              Basic property browsing is free. We charge a small commission only when a property is successfully 
              sold or rented through our platform. Premium features are available with our subscription plans.
            </p>
          </div>
          <div className="faq-item">
            <h3>How can I schedule a property viewing?</h3>
            <p>
              You can schedule viewings directly through the property listing page or contact the property 
              owner/agent using the provided contact information. We also offer virtual tours for most properties.
            </p>
          </div>
          <div className="faq-item">
            <h3>What areas do you cover?</h3>
            <p>
              We currently cover major metropolitan areas and are continuously expanding our coverage. 
              Check our service areas page or contact us to confirm availability in your location.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
