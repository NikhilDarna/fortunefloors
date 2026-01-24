import React from 'react';
import './TermsAndConditions.css';

const TermsAndConditions = () => {
  return (
    <div className="terms-container">
      <div className="terms-header">
        <h1>Terms & Conditions</h1>
        <p>Last updated: January 1, 2024</p>
      </div>

      <div className="terms-content">
        <div className="terms-intro">
          <p>
            Welcome to FortuneFloors! These Terms & Conditions govern your use of our real estate platform and services. 
            By accessing or using FortuneFloors, you agree to comply with and be bound by these terms.
          </p>
        </div>

        <section className="terms-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By creating an account, listing a property, or using any services provided by FortuneFloors, you acknowledge 
            that you have read, understood, and agree to be bound by these Terms & Conditions, our Privacy Policy, and 
            all applicable laws and regulations.
          </p>
        </section>

        <section className="terms-section">
          <h2>2. Eligibility</h2>
          <p>
            To use FortuneFloors, you must:
          </p>
          <ul>
            <li>Be at least 18 years of age</li>
            <li>Have the legal capacity to enter into contracts</li>
            <li>Provide accurate and complete information</li>
            <li>Comply with all applicable laws and regulations</li>
          </ul>
          <p>
            FortuneFloors reserves the right to refuse service to anyone at any time for any reason.
          </p>
        </section>

        <section className="terms-section">
          <h2>3. Account Registration and Security</h2>
          <p>
            When you create an account with FortuneFloors, you agree to:
          </p>
          <ul>
            <li>Provide truthful, accurate, and complete information</li>
            <li>Maintain and update your account information</li>
            <li>Keep your password secure and confidential</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Notify us immediately of any unauthorized use</li>
          </ul>
          <p>
            You are solely responsible for maintaining the confidentiality of your account credentials.
          </p>
        </section>

        <section className="terms-section">
          <h2>4. Property Listings</h2>
          <div className="terms-subsection">
            <h3>Listing Requirements</h3>
            <p>
              When listing a property on FortuneFloors, you must ensure that:
            </p>
            <ul>
              <li>You have the legal right to list the property</li>
              <li>All information provided is accurate and truthful</li>
              <li>Photos and descriptions represent the actual property</li>
              <li>Pricing information is current and valid</li>
              <li>No fraudulent or misleading information is included</li>
            </ul>
          </div>

          <div className="terms-subsection">
            <h3>Listing Approval</h3>
            <p>
              FortuneFloors reserves the right to review, approve, or reject any property listing. We may remove 
              listings that violate our terms, contain false information, or are deemed inappropriate.
            </p>
          </div>

          <div className="terms-subsection">
            <h3>Listing Fees</h3>
            <p>
              Certain listing services may require fees. All fees are clearly displayed before you commit to any 
              paid service. Refunds are subject to our refund policy.
            </p>
          </div>
        </section>

        <section className="terms-section">
          <h2>5. User Conduct</h2>
          <p>
            You agree not to use FortuneFloors for any unlawful purposes or in any way that could damage, 
            disable, or impair the service. Prohibited activities include:
          </p>
          <ul>
            <li>Posting false, misleading, or fraudulent information</li>
            <li>Impersonating another person or entity</li>
            <li>Engaging in spam or unsolicited communications</li>
            <li>Violating any applicable laws or regulations</li>
            <li>Infringing on intellectual property rights</li>
            <li>Interfering with or disrupting the service</li>
            <li>Attempting to gain unauthorized access to our systems</li>
            <li>Using automated tools to access the platform</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>6. Property Transactions</h2>
          <div className="terms-subsection">
            <h3>Third-Party Transactions</h3>
            <p>
              FortuneFloors acts as a platform connecting buyers, sellers, renters, and agents. We are not a party 
              to any property transactions and do not provide legal or financial advice.
            </p>
          </div>

          <div className="terms-subsection">
            <h3>Due Diligence</h3>
            <p>
              Users are responsible for conducting their own due diligence before entering into any property 
              transaction. This includes verifying property details, legal documents, and conducting inspections.
            </p>
          </div>

          <div className="terms-subsection">
            <h3>Dispute Resolution</h3>
            <p>
              FortuneFloors is not responsible for resolving disputes between users. Any disputes should be 
              resolved directly between the parties involved, with legal recourse if necessary.
            </p>
          </div>
        </section>

        <section className="terms-section">
          <h2>7. Intellectual Property</h2>
          <p>
            All content on FortuneFloors, including but not limited to text, graphics, logos, images, and software, 
            is owned by or licensed to FortuneFloors and is protected by copyright, trademark, and other intellectual 
            property laws.
          </p>
          <p>
            You may not use, copy, reproduce, or distribute any content from FortuneFloors without our express 
            written permission.
          </p>
        </section>

        <section className="terms-section">
          <h2>8. Fees and Payments</h2>
          <div className="terms-subsection">
            <h3>Service Fees</h3>
            <p>
              FortuneFloors may charge fees for certain services, including premium listings, featured placements, 
              and subscription plans. All fees are clearly displayed before you commit to any service.
            </p>
          </div>

          <div className="terms-subsection">
            <h3>Payment Terms</h3>
            <p>
              All payments must be made through our approved payment methods. You agree to provide accurate payment 
            information and authorize us to charge the specified fees for the services you select.
            </p>
          </div>

          <div className="terms-subsection">
            <h3>Refund Policy</h3>
            <p>
              Refunds are provided at our discretion and subject to our refund policy. Some services may be 
              non-refundable once activated or used.
            </p>
          </div>
        </section>

        <section className="terms-section">
          <h2>9. Privacy and Data Protection</h2>
          <p>
            Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, 
            and protect your personal information. By using FortuneFloors, you consent to the collection and use 
            of your information as described in our Privacy Policy.
          </p>
        </section>

        <section className="terms-section">
          <h2>10. Disclaimers and Warranties</h2>
          <p>
            FortuneFloors provides its services "as is" and makes no warranties, express or implied, regarding the 
            accuracy, reliability, or completeness of any information on the platform.
          </p>
          <p>
            We do not guarantee:
          </p>
          <ul>
            <li>The accuracy of property listings or user-provided information</li>
            <li>The availability of any particular property</li>
            <li>Uninterrupted or error-free service</li>
            <li>The security of the platform against all threats</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>11. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, FortuneFloors shall not be liable for any indirect, incidental, 
            special, or consequential damages arising from your use of the platform, including but not limited to 
            loss of profits, data, or business opportunities.
          </p>
          <p>
            Our total liability for any claims related to the service shall not exceed the amount you paid for the 
            service in the preceding 12 months.
          </p>
        </section>

        <section className="terms-section">
          <h2>12. Indemnification</h2>
          <p>
            You agree to indemnify and hold FortuneFloors harmless from any claims, damages, or expenses arising 
            from your use of the platform, violation of these terms, or infringement of any third-party rights.
          </p>
        </section>

        <section className="terms-section">
          <h2>13. Termination</h2>
          <p>
            FortuneFloors reserves the right to suspend or terminate your account at any time, with or without 
            cause, and with or without notice. Upon termination, you lose access to your account and all associated 
            data.
          </p>
          <p>
            You may terminate your account at any time by following the account deletion process in your settings 
            or contacting customer support.
          </p>
        </section>

        <section className="terms-section">
          <h2>14. Changes to Terms</h2>
          <p>
            We may update these Terms & Conditions from time to time. Changes will be effective immediately upon 
            posting on our website. Your continued use of the platform after any changes constitutes acceptance 
            of the updated terms.
          </p>
        </section>

        <section className="terms-section">
          <h2>15. Governing Law</h2>
          <p>
            These Terms & Conditions are governed by and construed in accordance with the laws of the jurisdiction 
            where FortuneFloors operates, without regard to conflict of law principles.
          </p>
        </section>

        <section className="terms-section">
          <h2>16. Contact Information</h2>
          <p>
            If you have any questions about these Terms & Conditions, please contact us:
          </p>
          <div className="contact-info">
            <p><strong>Email:</strong> legal@fortunefloors.com</p>
            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            <p><strong>Address:</strong> 123 Fortune Street, Downtown, City, State 12345</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;
