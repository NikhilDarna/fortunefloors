import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container">
      <div className="privacy-policy-header">
        <h1>Privacy Policy</h1>
        <p>Last updated: January 1, 2024</p>
      </div>

      <div className="privacy-policy-content">
        <div className="policy-intro">
          <p>
            At FortuneFloors, we are committed to protecting your privacy and ensuring the security of your personal 
            information. This Privacy Policy outlines how we collect, use, and protect your data when you use our 
            real estate platform.
          </p>
        </div>

        <section className="policy-section">
          <h2>Information We Collect</h2>
          <div className="policy-subsection">
            <h3>Personal Information</h3>
            <p>
              When you create an account or use our services, we may collect the following personal information:
            </p>
            <ul>
              <li>Name and contact information (email, phone number, address)</li>
              <li>Account credentials (username, encrypted password)</li>
              <li>Property preferences and search history</li>
              <li>Communication preferences</li>
              <li>Payment information (processed securely through third-party providers)</li>
            </ul>
          </div>

          <div className="policy-subsection">
            <h3>Property Information</h3>
            <p>
              For property listings, we collect and display:
            </p>
            <ul>
              <li>Property details (address, size, features, amenities)</li>
              <li>Property photos and videos</li>
              <li>Pricing information</li>
              <li>Owner/agent contact information (with consent)</li>
            </ul>
          </div>

          <div className="policy-subsection">
            <h3>Automatically Collected Information</h3>
            <p>
              We automatically collect certain technical information when you visit our website:
            </p>
            <ul>
              <li>IP address and browser type</li>
              <li>Device information and operating system</li>
              <li>Pages visited and time spent on our site</li>
              <li>Referring website information</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </div>
        </section>

        <section className="policy-section">
          <h2>How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide and maintain our real estate platform services</li>
            <li>Process property listings and transactions</li>
            <li>Connect buyers with sellers and agents</li>
            <li>Send important notifications about your account and activities</li>
            <li>Personalize your experience and show relevant properties</li>
            <li>Improve our website and develop new features</li>
            <li>Respond to your questions and provide customer support</li>
            <li>Comply with legal obligations and protect against fraud</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>Information Sharing</h2>
          <div className="policy-subsection">
            <h3>When We Share Information</h3>
            <p>We may share your information in the following circumstances:</p>
            <ul>
              <li><strong>With Other Users:</strong> Your contact information may be shared with other users when you 
              inquire about properties or list your own property for sale/rent.</li>
              <li><strong>Service Providers:</strong> We work with trusted third-party service providers who help us 
              operate our business, such as payment processors, hosting services, and analytics providers.</li>
              <li><strong>Legal Requirements:</strong> We may disclose information when required by law or to protect 
              our rights, property, or safety.</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, user 
              information may be transferred as part of the transaction.</li>
            </ul>
          </div>

          <div className="policy-subsection">
            <h3>What We Don't Share</h3>
            <p>We do not sell your personal information to third parties for marketing purposes. We do not share 
            your information with anyone except as described in this policy.</p>
          </div>
        </section>

        <section className="policy-section">
          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information 
            against unauthorized access, alteration, disclosure, or destruction. These include:
          </p>
          <ul>
            <li>SSL encryption for data transmission</li>
            <li>Secure servers and database protection</li>
            <li>Regular security audits and vulnerability assessments</li>
            <li>Employee training on data protection</li>
            <li>Access controls and authentication systems</li>
          </ul>
          <p>
            However, no method of transmission over the internet is 100% secure. While we strive to protect your 
            data, we cannot guarantee absolute security.
          </p>
        </section>

        <section className="policy-section">
          <h2>Your Rights and Choices</h2>
          <p>You have the following rights regarding your personal information:</p>
          <ul>
            <li><strong>Access:</strong> Request access to your personal information</li>
            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
            <li><strong>Deletion:</strong> Request deletion of your account and personal data</li>
            <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
            <li><strong>Opt-out:</strong> Opt out of marketing communications</li>
            <li><strong>Restriction:</strong> Restrict processing of your information in certain circumstances</li>
          </ul>
          <p>
            To exercise these rights, please contact us using the information provided at the end of this policy.
          </p>
        </section>

        <section className="policy-section">
          <h2>Cookies and Tracking</h2>
          <p>
            We use cookies and similar tracking technologies to enhance your experience on our website. Cookies are 
            small files stored on your device that help us:
          </p>
          <ul>
            <li>Remember your preferences and login information</li>
            <li>Analyze website traffic and usage patterns</li>
            <li>Personalize content and advertisements</li>
            <li>Improve website functionality and performance</li>
          </ul>
          <p>
            You can control cookies through your browser settings. However, disabling cookies may affect your 
            ability to use certain features of our website.
          </p>
        </section>

        <section className="policy-section">
          <h2>Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites, including property listing sites, financial 
            institutions, and service providers. We are not responsible for the privacy practices of these 
            third-party sites. We encourage you to review their privacy policies before providing any personal 
            information.
          </p>
        </section>

        <section className="policy-section">
          <h2>Children's Privacy</h2>
          <p>
            Our services are not intended for individuals under the age of 18. We do not knowingly collect personal 
            information from children under 18. If you believe we have collected information from a child, please 
            contact us immediately so we can delete such information.
          </p>
        </section>

        <section className="policy-section">
          <h2>International Data Transfers</h2>
          <p>
            Your personal information may be transferred to and processed in countries other than your own. We 
            ensure appropriate safeguards are in place to protect your data in accordance with applicable data 
            protection laws.
          </p>
        </section>

        <section className="policy-section">
          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices or for other 
            operational, legal, or regulatory reasons. We will notify you of any material changes by posting the 
            updated policy on our website and updating the "Last updated" date.
          </p>
        </section>

        <section className="policy-section">
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or want to exercise your rights regarding your 
            personal information, please contact us:
          </p>
          <div className="contact-info">
            <p><strong>Email:</strong> privacy@fortunefloors.com</p>
            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            <p><strong>Address:</strong> 123 Fortune Street, Downtown, City, State 12345</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
