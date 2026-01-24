import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import './AdviceAndTools.css';

const AdviceAndTools = () => {
  const toolsRef = useRef(null);

  const scrollTools = (direction) => {
    if (!toolsRef.current) return;
    const scrollAmount = 320;
    toolsRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const tools = [
    {
      id: 1,
      title: 'Add Your Property',
      description: 'List your property with location, type, size, price, and photos.',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
          <polyline points="14,2 14,8 20,8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10,9 9,9 8,9"></polyline>
        </svg>
      ),
      link: '/post-property'
    },
    {
      id: 2,
      title: 'Area Converter',
      description: 'Instantly convert between acres, hectares, and square meters.',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"></path>
          <polyline points="7,21 7,3 15,3 15,21"></polyline>
          <line x1="17" y1="8" x2="17" y2="16"></line>
          <polyline points="7,8 7,16 17,16"></polyline>
        </svg>
      ),
      link: '/area-converter'
    },
    {
      id: 3,
      title: 'EMI Calculator',
      description: 'Calculate EMI, total interest, and total payment for your home loan.',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      ),
      link: '/emi-calculator'
    },
    {
      id: 4,
      title: 'Best Home Loan Offers',
      description: 'Compare and find the best home loan interest rates from top banks.',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
          <polyline points="14,2 14,8 20,8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10,9 9,9 8,9"></polyline>
        </svg>
      ),
      link: '/home-loan-offers'
    },
    {
      id: 5,
      title: 'Best Home Loan Offers',
      description: 'Compare and find the best home loan interest rates from top banks.',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
          <polyline points="14,2 14,8 20,8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10,9 9,9 8,9"></polyline>
        </svg>
      ),
      link: '/loan-offers'
    }
  ];

  return (
    <div className="advice-tools-page">
      <div className="tools-section">
        <div className="section-header">
          <h2 className="section-title">Advice & Tools</h2>
        </div>
        
        <div className="tools-carousel-container">
          <button className="carousel-arrow left" onClick={() => scrollTools('left')}>‹</button>
          <div className="tools-carousel" ref={toolsRef}>
            {[...tools, ...tools].map((tool, index) => (
              <div className="tool-card" key={index}>
                <div className="tool-icon">
                  {tool.icon}
                </div>
                <h3 className="tool-title">{tool.title}</h3>
                <p className="tool-description">{tool.description}</p>
                <Link to={tool.link} className="tool-link">View now →</Link>
              </div>
            ))}
          </div>
          <button className="carousel-arrow right" onClick={() => scrollTools('right')}>›</button>
        </div>
      </div>
    </div>
  );
};

export default AdviceAndTools;
