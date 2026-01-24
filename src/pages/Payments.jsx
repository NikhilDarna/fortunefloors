import React from 'react';
import './Payments.css';

const Payments = () => {
  return (
    <div className="payments-page">
      <div className="coming-soon-container">
        <div className="coming-soon-icon">💳</div>
        <h2>Payments</h2>
        <h1>Coming Soon</h1>
        <p>We're working hard to bring you a secure and seamless payment experience.</p>
        <p>You'll soon be able to:</p>
        <ul className="features-list">
          <li>🔒 Make secure payments for properties</li>
          <li>📊 View your payment history</li>
          <li>💳 Manage multiple payment methods</li>
          <li>📱 Get payment notifications</li>
          <li>🧾 Download invoices and receipts</li>
        </ul>
        <div className="progress-info">
          <p><strong>Status:</strong> Under Development</p>
          <p><strong>Expected Launch:</strong> Very Soon!</p>
        </div>
        <button className="notify-btn">
          📬 Notify Me When Available
        </button>
      </div>
    </div>
  );
};

export default Payments;