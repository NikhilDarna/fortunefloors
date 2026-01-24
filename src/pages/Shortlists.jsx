import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';
import './Shortlists.css';

const Shortlists = () => {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/wishlist`, {
          headers: { Authorization: token ? `Bearer ${token}` : undefined },
          withCredentials: true,
        });
        setItems(res.data || []);
        setError(null);
      } catch (e) {
        console.error('Failed loading wishlist', e);
        setError('Failed to load your shortlisted properties');
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [token]);

  const handleRemoveFromShortlist = async (propertyId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/wishlist/${propertyId}`, {
        headers: { Authorization: token ? `Bearer ${token}` : undefined },
        withCredentials: true,
      });
      setItems(prev => prev.filter(item => item.id !== propertyId));
    } catch (e) {
      console.error('Failed to remove from shortlist', e);
      setError('Failed to remove property from shortlist');
    }
  };

  if (loading) {
    return (
      <div className="shortlists-page">
        <h2>Your Shortlists</h2>
        <div className="loading-state">Loading your shortlisted properties...</div>
      </div>
    );
  }

  return (
    <div className="shortlists-page">
      <h2>Your Shortlists</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No shortlisted properties yet</h3>
          <p>Start browsing and add properties to your shortlist to see them here!</p>
        </div>
      ) : (
        <div className="shortlists-grid">
          {items.map((property) => (
            <div key={property.id} className="shortlist-item">
              <PropertyCard property={property} />
              <button 
                className="remove-shortlist-btn"
                onClick={() => handleRemoveFromShortlist(property.id)}
              >
                Remove from Shortlist
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shortlists;