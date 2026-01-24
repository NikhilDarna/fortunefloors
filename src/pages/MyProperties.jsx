import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import './MyProperties.css';

const MyProperties = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/properties`, {
          headers: { Authorization: token ? `Bearer ${token}` : undefined },
          withCredentials: true,
        });
        setItems(res.data || []);
        setError(null);
      } catch (e) {
        console.error('Failed loading user properties', e);
        setError('Failed to load your properties');
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [token]);

  if (loading) {
    return (
      <div className="my-properties-page">
        <h2>Your Properties</h2>
        <div className="loading-state">Loading your properties...</div>
      </div>
    );
  }

  return (
    <div className="my-properties-page">
      <div className="page-header">
        <h2>Your Properties</h2>
        <button 
          className="add-property-btn"
          onClick={() => navigate('/post-property')}
        >
          + Add New Property
        </button>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏠</div>
          <h3>You haven't posted any properties yet</h3>
          <p>Start by adding your first property to reach potential buyers and renters!</p>
          <button 
            className="add-property-btn primary"
            onClick={() => navigate('/post-property')}
          >
            + Add Your First Property
          </button>
        </div>
      ) : (
        <div className="properties-grid">
          {items.map((property) => (
            <div key={property.id} className="property-item">
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProperties;