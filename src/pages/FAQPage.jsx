import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FAQPage.css';

const FAQPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState(new Set());

  const handleContactSupport = () => {
    // Navigate to contact page for support
    navigate('/contact');
    // Alternatively, you could navigate to a specific support page
    // navigate('/support');
  };

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'general', name: 'General' },
    { id: 'buying', name: 'Buying Property' },
    { id: 'selling', name: 'Selling Property' },
    { id: 'renting', name: 'Renting' },
    { id: 'account', name: 'Account & Billing' },
    { id: 'technical', name: 'Technical Support' }
  ];

  const faqs = [
    {
      id: 1,
      category: 'general',
      question: 'What is FortuneFloors?',
      answer: 'FortuneFloors is a comprehensive real estate platform that connects buyers, sellers, renters, and agents. We provide property listings, search tools, and resources to help you find your perfect property or sell your current one.'
    },
    {
      id: 2,
      category: 'general',
      question: 'Is FortuneFloors free to use?',
      answer: 'Basic features like browsing properties and creating an account are free. We charge fees for premium services such as featured listings, advanced analytics, and certain transaction services. All fees are clearly displayed before you commit to any service.'
    },
    {
      id: 3,
      category: 'buying',
      question: 'How do I search for properties?',
      answer: 'Use our advanced search filters to find properties that match your criteria. You can filter by location, price range, property type, number of bedrooms, amenities, and more. Save your searches and set up alerts to be notified of new listings.'
    },
    {
      id: 4,
      category: 'buying',
      question: 'How do I contact property owners or agents?',
      answer: 'Once you find a property you\'re interested in, click the "Contact" button on the property listing. You can send a message directly through our platform, and the owner or agent will respond via email or phone.'
    },
    {
      id: 5,
      category: 'buying',
      question: 'Can I schedule property viewings through FortuneFloors?',
      answer: 'Yes, many listings allow you to schedule viewings directly through our platform. You can select available time slots and receive confirmation. For other properties, you\'ll need to contact the owner or agent directly to arrange a visit.'
    },
    {
      id: 6,
      category: 'selling',
      question: 'How do I list my property on FortuneFloors?',
      answer: 'Create an account, then click "List Property" and fill in all required information about your property. Upload high-quality photos, provide detailed descriptions, and set your price. Our team will review and approve your listing within 24 hours.'
    },
    {
      id: 7,
      category: 'selling',
      question: 'What information do I need to provide for my listing?',
      answer: 'You\'ll need to provide property details (address, size, features), high-quality photos, accurate pricing, contact information, and a detailed description. The more complete your listing, the more interest it will generate.'
    },
    {
      id: 8,
      category: 'selling',
      question: 'How long does it take for my listing to go live?',
      answer: 'Most listings are reviewed and published within 24 hours of submission. Our team ensures all information is accurate and meets our quality standards before making listings live.'
    },
    {
      id: 9,
      category: 'selling',
      question: 'Can I edit my property listing after it\'s published?',
      answer: 'Yes, you can edit your listing at any time from your dashboard. Update photos, change pricing, modify descriptions, or add new information. Changes are typically reflected within a few hours.'
    },
    {
      id: 10,
      category: 'renting',
      question: 'How do I find rental properties?',
      answer: 'Use our search filters and select "For Rent" as the property type. You can filter by monthly rent, location, amenities, and lease terms. Contact landlords directly through our platform to inquire about availability.'
    },
    {
      id: 11,
      category: 'renting',
      question: 'Are rental listings verified?',
      answer: 'We verify rental listings to ensure they\'re legitimate and accurately described. However, we always recommend conducting your own due diligence, including visiting the property and reviewing lease agreements carefully.'
    },
    {
      id: 12,
      category: 'account',
      question: 'How do I create an account?',
      answer: 'Click "Sign Up" on our homepage and provide your name, email address, and create a password. You\'ll receive a confirmation email to verify your account. Once verified, you can access all features and save your preferences.'
    },
    {
      id: 13,
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page. Enter your email address, and we\'ll send you a password reset link. Follow the instructions in the email to create a new password.'
    },
    {
      id: 14,
      category: 'account',
      question: 'Can I delete my account?',
      answer: 'Yes, you can delete your account from your account settings. Note that deleting your account will remove all your saved searches, favorites, and listing history. This action cannot be undone.'
    },
    {
      id: 15,
      category: 'billing',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, and bank transfers. All payments are processed securely through our trusted payment partners.'
    },
    {
      id: 16,
      category: 'billing',
      question: 'Can I get a refund for premium services?',
      answer: 'Refunds are handled on a case-by-case basis. Please contact our support team within 30 days of purchase to discuss refund options. Some services may be non-refundable once activated.'
    },
    {
      id: 17,
      category: 'technical',
      question: 'Why can\'t I upload photos to my listing?',
      answer: 'Ensure your photos are in JPG or PNG format and under 10MB each. Clear your browser cache and try again. If issues persist, contact our technical support team for assistance.'
    },
    {
      id: 18,
      category: 'technical',
      question: 'Is FortuneFloors mobile-friendly?',
      answer: 'Yes, our website is fully responsive and works great on mobile devices. We also offer a mobile app for iOS and Android with additional features and push notifications.'
    },
    {
      id: 19,
      category: 'technical',
      question: 'How do I report a technical issue?',
      answer: 'Contact our support team through the help center, email us at support@fortunefloors.com, or use the live chat feature. Provide details about the issue, including error messages and steps to reproduce it.'
    }
  ];

  const filteredFAQs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  const toggleExpanded = (faqId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(faqId)) {
      newExpanded.delete(faqId);
    } else {
      newExpanded.add(faqId);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="faq-container">
      <div className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about FortuneFloors</p>
      </div>

      <div className="faq-search">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search for answers..."
            className="search-input"
          />
          <button className="search-btn">🔍</button>
        </div>
      </div>

      <div className="category-tabs">
        <div className="tab-buttons">
          {categories.map(category => (
            <button
              key={category.id}
              className={`tab-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="faq-content">
        <div className="faq-list">
          {filteredFAQs.map(faq => (
            <div key={faq.id} className="faq-item">
              <button 
                className="faq-question"
                onClick={() => toggleExpanded(faq.id)}
              >
                <span>{faq.question}</span>
                <span className={`expand-icon ${expandedItems.has(faq.id) ? 'expanded' : ''}`}>
                  ▼
                </span>
              </button>
              {expandedItems.has(faq.id) && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="no-results">
            <h3>No FAQs found</h3>
            <p>Try selecting a different category or search for specific keywords.</p>
          </div>
        )}
      </div>

      <div className="help-section">
        <h2>Still Need Help?</h2>
        <div className="help-options">
          <div className="help-card">
            <div className="help-icon">💬</div>
            <h3>Live Chat</h3>
            <p>Chat with our support team in real-time for immediate assistance.</p>
            <button className="help-btn">Start Chat</button>
          </div>

          <div className="help-card">
            <div className="help-icon">📧</div>
            <h3>Email Support</h3>
            <p>Send us an email and we'll respond within 24 hours.</p>
            <button className="help-btn">Send Email</button>
          </div>

          <div className="help-card">
            <div className="help-icon">📞</div>
            <h3>Phone Support</h3>
            <p>Call us Monday-Friday, 9AM-6PM EST for direct assistance.</p>
            <button className="help-btn">Call Now</button>
          </div>
        </div>
      </div>

      <div className="popular-topics">
        <h2>Popular Topics</h2>
        <div className="topics-grid">
          <div className="topic-card">
            <h3>🏠 Property Buying Guide</h3>
            <p>Complete guide to buying your dream home</p>
            <a href="/how-it-work" className="topic-link">Learn More →</a>
          </div>
          <div className="topic-card">
            <h3>💰 Selling Tips</h3>
            <p>Best practices for selling your property quickly</p>
            <a href="/services" className="topic-link">Learn More →</a>
          </div>
          <div className="topic-card">
            <h3>🔍 Property Search Tips</h3>
            <p>How to find the perfect property using our tools</p>
            <a href="/properties" className="topic-link">Learn More →</a>
          </div>
          <div className="topic-card">
            <h3>📋 Account Management</h3>
            <p>Managing your profile and preferences</p>
            <a href="/dashboard" className="topic-link">Learn More →</a>
          </div>
        </div>
      </div>

      <div className="contact-cta">
        <h2>Can't Find What You're Looking For?</h2>
        <p>Our customer support team is here to help you with any questions or concerns.</p>
        <button className="contact-support-btn" onClick={handleContactSupport}>Contact Support</button>
      </div>
    </div>
  );
};

export default FAQPage;
