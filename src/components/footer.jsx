import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import footerlogo from '../assets/logo.png';


function Footer({ user }) {
  return (
    <footer className="footer">
      {/* NEW FOOTER SECTIONS */}
      <div className="footer-sections">
        <div className='footerContainer footer-column'>
          <div className='row footerlogo'>
            <div>
              <img src={footerlogo} alt="Logo" />
            </div>
            <div>
              <p class="para">Welcome to Find Your Dream Home</p>
            </div>
          </div>
        </div>
        <div className="footer-column">
          <h4>Useful Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/properties">Properties</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>My Account</h4>
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/profile">My Profile</Link></li>
            <li><Link to="/add-property">Add Property</Link></li>
            <li><Link to="/my-listing">My Listing</Link></li>
            <li><Link to="/favorites">Favorites</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Resources</h4>
          <ul>
            <li><Link to="/account">My Account</Link></li>
            <li><Link to="/support">Support</Link></li>
            <li><Link to="/how-it-work">How It Work</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Term & Condition</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Pages</h4>
          <ul>
            <li><Link to="/partners">Our Partners</Link></li>
            <li><Link to="/how-it-work">How It Work</Link></li>
            <li><Link to="/faq">FAQ Page</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Term & Condition</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; 2025 Fortune Realistate | All Rights Reserved
      </div>
    </footer>
  );
}

export default Footer;
