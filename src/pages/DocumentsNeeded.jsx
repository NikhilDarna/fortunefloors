import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DocumentsNeeded.css';

const DocumentsNeeded = () => {
  const navigate = useNavigate();

  const handleDocumentAssistance = () => {
    // Navigate to contact page for document assistance
    navigate('/contact');
    // Alternatively, you could navigate to a specific document assistance page
    // navigate('/document-assistance');
  };
  return (
    <div className="documents-needed">
      <div className="documents-header">
        <h1>Documents Needed</h1>
        <p>Complete guide to required documentation for property transactions</p>
      </div>

      <div className="documents-content">
        <section className="documents-section">
          <h2>Essential Documents for Property Sale</h2>
          <div className="documents-grid">
            <div className="document-card">
              <h3>Property Title Deed</h3>
              <p>Original title deed proving ownership of the property. This is the most important document.</p>
              <div className="document-importance">Critical</div>
            </div>
            <div className="document-card">
              <h3>Sale Agreement</h3>
              <p>Detailed agreement between buyer and seller outlining terms and conditions of the sale.</p>
              <div className="document-importance">Critical</div>
            </div>
            <div className="document-card">
              <h3>Building Approval Plan</h3>
              <p>Approved construction plan from municipal authorities or relevant building department.</p>
              <div className="document-importance">Critical</div>
            </div>
            <div className="document-card">
              <h3>Occupancy Certificate</h3>
              <p>Certificate issued by authorities confirming the property is ready for occupation.</p>
              <div className="document-importance">Critical</div>
            </div>
          </div>
        </section>

        <section className="documents-section">
          <h2>Ownership & Identity Documents</h2>
          <div className="documents-list">
            <div className="document-item">
              <h4>PAN Card</h4>
              <p>Permanent Account Number card of both buyer and seller for tax purposes.</p>
              <span className="document-type">Mandatory</span>
            </div>
            <div className="document-item">
              <h4>Aadhaar Card</h4>
              <p>UIDAI Aadhaar card for identity verification and registration.</p>
              <span className="document-type">Mandatory</span>
            </div>
            <div className="document-item">
              <h4>Address Proof</h4>
              <p>Recent utility bills, passport, or other government-issued address proof.</p>
              <span className="document-type">Mandatory</span>
            </div>
            <div className="document-item">
              <h4>Passport Photos</h4>
              <p>Recent passport-sized photographs of all parties involved in the transaction.</p>
              <span className="document-type">Mandatory</span>
            </div>
          </div>
        </section>

        <section className="documents-section">
          <h2>Property-Specific Documents</h2>
          <div className="property-documents">
            <div className="property-category">
              <h3>For Residential Properties</h3>
              <ul>
                <li>Property tax receipts for last 3 years</li>
                <li>Maintenance bills from society/apartment association</li>
                <li>No objection certificate (NOC) from society</li>
                <li>Electricity and water bill copies</li>
                <li>Share certificate (for apartment owners)</li>
              </ul>
            </div>
            <div className="property-category">
              <h3>For Commercial Properties</h3>
              <ul>
                <li>Trade license copy</li>
                <li>Fire safety certificate</li>
                <li>Environmental clearance (if applicable)</li>
                <li>Commercial tax receipts</li>
                <li>Business establishment documents</li>
              </ul>
            </div>
            <div className="property-category">
              <h3>For Land/Plots</h3>
              <ul>
                <li>Land records and mutation documents</li>
                <li>Crop cultivation details (for agricultural land)</li>
                <li>Conversion certificate (if land use changed)</li>
                <li>Survey map and boundary details</li>
                <li>Soil test reports (if available)</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="documents-section">
          <h2>Financial & Legal Documents</h2>
          <div className="financial-docs">
            <div className="doc-category">
              <h4>Loan Related</h4>
              <ul>
                <li>Loan sanction letter (if applicable)</li>
                <li>No objection certificate from bank</li>
                <li>Loan repayment statements</li>
                <li>Property valuation report from bank</li>
              </ul>
            </div>
            <div className="doc-category">
              <h4>Legal Clearances</h4>
              <ul>
                <li>Encumbrance certificate (last 15 years)</li>
                <li>Legal opinion from lawyer</li>
                <li>Court orders (if any pending litigation)</li>
                <li>Inheritance documents (if inherited property)</li>
              </ul>
            </div>
            <div className="doc-category">
              <h4>Tax Documents</h4>
              <ul>
                <li>Income tax returns (last 3 years)</li>
                <li>TDS certificates (if applicable)</li>
                <li>Capital gains tax documents</li>
                <li>Stamp duty payment receipts</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="documents-section">
          <h2>Document Verification Checklist</h2>
          <div className="checklist">
            <div className="checklist-item">
              <input type="checkbox" id="verify-title" />
              <label htmlFor="verify-title">Verify title deed authenticity</label>
            </div>
            <div className="checklist-item">
              <input type="checkbox" id="check-encumbrance" />
              <label htmlFor="check-encumbrance">Check encumbrance certificate</label>
            </div>
            <div className="checklist-item">
              <input type="checkbox" id="verify-approvals" />
              <label htmlFor="verify-approvals">Verify building approvals</label>
            </div>
            <div className="checklist-item">
              <input type="checkbox" id="check-taxes" />
              <label htmlFor="check-taxes">Confirm tax payment status</label>
            </div>
            <div className="checklist-item">
              <input type="checkbox" id="verify-identity" />
              <label htmlFor="verify-identity">Verify identity documents</label>
            </div>
            <div className="checklist-item">
              <input type="checkbox" id="check-legal" />
              <label htmlFor="check-legal">Review legal clearances</label>
            </div>
          </div>
        </section>

        <section className="documents-section">
          <h2>Professional Assistance</h2>
          <div className="assistance-cta">
            <p>Document verification can be complex. Our experts can help ensure all documentation is complete and authentic.</p>
            <button className="cta-button" onClick={handleDocumentAssistance}>Get Document Assistance</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DocumentsNeeded;
