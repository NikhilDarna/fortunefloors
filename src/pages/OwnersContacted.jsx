import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import './OwnersContacted.css';

const OwnersContacted = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [contactedProperties, setContactedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContactedProperties = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/contacted-owners`, {
          headers: { Authorization: token ? `Bearer ${token}` : undefined },
          withCredentials: true,
        });
        setContactedProperties(response.data || []);
        setError(null);
      } catch (e) {
        console.error('Failed loading contacted owners', e);
        setError('Failed to load your contacted properties');
        setContactedProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContactedProperties();
  }, [token]);

  const handleContactOwner = (propertyId, ownerId) => {
    navigate(`/property/${propertyId}?contact=${ownerId}`);
  };

  const handleViewProperty = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="owners-contacted-page">
        <h2>Owners You Contacted</h2>
        <div className="loading-state">Loading your contact history...</div>
      </div>
    );
  }

  return (
    <div className="owners-contacted-page">
      <h2>Owners You Contacted</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {contactedProperties.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📞</div>
          <h3>No contacts yet</h3>
          <p>You haven't contacted any property owners yet. Start browsing properties and reach out to owners!</p>
          <button 
            className="browse-btn"
            onClick={() => navigate('/all-properties')}
          >
            Browse Properties
          </button>
        </div>
      ) : (
        <div className="contacted-grid">
          {contactedProperties.map((contact) => (
            <div key={contact.id} className="contact-item">
              <div className="property-section">
                <PropertyCard property={contact.property} />
              </div>
              
              <div className="owner-details">
                <div className="owner-info">
                  <h4>Owner Information</h4>
                  <div className="owner-name">
                    <strong>{contact.owner.name || 'Property Owner'}</strong>
                  </div>
                  {contact.owner.phone && (
                    <div className="owner-phone">
                      📱 {contact.owner.phone}
                    </div>
                  )}
                  {contact.owner.email && (
                    <div className="owner-email">
                      ✉️ {contact.owner.email}
                    </div>
                  )}
                </div>
                
                <div className="contact-info">
                  <div className="contact-status">
                    <span className={`status-badge ${contact.status || 'contacted'}`}>
                      {contact.status || 'Contacted'}
                    </span>
                    <span className="contact-date">
                      {formatDate(contact.contacted_at)}
                    </span>
                  </div>
                  
                  {contact.message && (
                    <div className="contact-message">
                      <p><strong>Your message:</strong></p>
                      <p>{contact.message}</p>
                    </div>
                  )}
                </div>
                
                <div className="contact-actions">
                  <button 
                    className="action-btn primary"
                    onClick={() => handleViewProperty(contact.property.id)}
                  >
                    View Property
                  </button>
                  <button 
                    className="action-btn secondary"
                    onClick={() => handleContactOwner(contact.property.id, contact.owner.id)}
                  >
                    Contact Again
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnersContacted;