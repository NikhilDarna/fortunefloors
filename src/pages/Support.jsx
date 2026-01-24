import React, { useState } from 'react';
import './Support.css';

const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    priority: 'normal',
    message: '',
    attachments: []
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
    console.log('Support ticket submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        priority: 'normal',
        message: '',
        attachments: []
      });
    }, 3000);
  };

  const faqs = [
    {
      question: 'How do I reset my password?',
      answer: 'Click on the "Forgot Password" link on the login page and follow the instructions sent to your email.'
    },
    {
      question: 'How long does it take for my property to be listed?',
      answer: 'Most properties are reviewed and listed within 24 hours of submission.'
    },
    {
      question: 'Can I edit my property listing after it\'s published?',
      answer: 'Yes, you can edit your property listing at any time from your dashboard.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, and bank transfers.'
    },
    {
      question: 'How do I contact customer support?',
      answer: 'You can reach us through the contact form, email us at support@fortunefloors.com, or call us at +1 (555) 123-4567.'
    }
  ];

  return (
    <div className="support-container">
      <div className="support-header">
        <h1>Customer Support</h1>
        <p>We're here to help you with any questions or issues</p>
      </div>

      <div className="support-content">
        <div className="support-options">
          <div className="support-card">
            <div className="support-icon">💬</div>
            <h3>Live Chat</h3>
            <p>Chat with our support team in real-time</p>
            <button className="support-btn">Start Chat</button>
          </div>

          <div className="support-card">
            <div className="support-icon">📧</div>
            <h3>Email Support</h3>
            <p>Get help via email within 24 hours</p>
            <button className="support-btn">Send Email</button>
          </div>

          <div className="support-card">
            <div className="support-icon">📞</div>
            <h3>Phone Support</h3>
            <p>Call us for immediate assistance</p>
            <button className="support-btn">Call Now</button>
          </div>
        </div>

        <div className="support-form-section">
          <h2>Submit a Support Ticket</h2>
          {submitted ? (
            <div className="success-message">
              <h3>Support Ticket Submitted!</h3>
              <p>We'll get back to you within 24 hours with a response.</p>
              <p>Ticket ID: #{Math.floor(Math.random() * 100000)}</p>
            </div>
          ) : (
            <form className="support-form" onSubmit={handleSubmit}>
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
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing Question</option>
                    <option value="account">Account Issue</option>
                    <option value="property">Property Listing</option>
                    <option value="feature">Feature Request</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="priority">Priority</label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Brief description of your issue"
                />
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
                  placeholder="Please provide detailed information about your issue or question..."
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">Submit Ticket</button>
            </form>
          )}
        </div>

        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="contact-info">
          <h2>Other Ways to Reach Us</h2>
          <div className="contact-grid">
            <div className="contact-item">
              <h3>📧 Email</h3>
              <p>support@fortunefloors.com</p>
              <p>Response time: 24 hours</p>
            </div>
            <div className="contact-item">
              <h3>📞 Phone</h3>
              <p>+1 (555) 123-4567</p>
              <p>Mon-Fri: 9AM-6PM EST</p>
            </div>
            <div className="contact-item">
              <h3>💬 Live Chat</h3>
              <p>Available 24/7</p>
              <p>Average response: 5 minutes</p>
            </div>
            <div className="contact-item">
              <h3>📍 Office</h3>
              <p>123 Fortune Street</p>
              <p>Downtown, City 12345</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
