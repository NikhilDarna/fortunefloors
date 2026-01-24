import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./InterestedProperties.css";

const InterestedProperties = () => {
  const { user, token } = useAuth();
  const [interestedProperties, setInterestedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterestedProperties = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/interested-properties`,
          {
            headers: { Authorization: token ? `Bearer ${token}` : undefined },
            withCredentials: true,
          }
        );
        setInterestedProperties(response.data || []);
      } catch (err) {
        console.error("Error fetching interested properties:", err);
        setError("Failed to load interested properties");
      } finally {
        setLoading(false);
      }
    };

    fetchInterestedProperties();
  }, [token]);

  const handleRemoveInterest = async (propertyId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/user/interested-properties/${propertyId}`,
        {
          headers: { Authorization: token ? `Bearer ${token}` : undefined },
          withCredentials: true,
        }
      );
      setInterestedProperties(prev => prev.filter(prop => prop.id !== propertyId));
    } catch (err) {
      console.error("Error removing interest:", err);
      setError("Failed to remove interest");
    }
  };

  if (loading) {
    return (
      <div className="interested-properties-page">
        <div className="loading">Loading interested properties...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="interested-properties-page">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="interested-properties-page">
      <h2>Properties You're Interested In</h2>
      
      {interestedProperties.length === 0 ? (
        <div className="empty-state">
          <p>You haven't shown interest in any properties yet.</p>
          <p>Browse our property listings and mark the ones you're interested in!</p>
        </div>
      ) : (
        <div className="properties-grid">
          {interestedProperties.map((property) => (
            <div key={property.id} className="property-card">
              {property.images && property.images.length > 0 && (
                <div className="property-image">
                  <img 
                    src={`${import.meta.env.VITE_API_URL}/uploads/${property.images[0]}`} 
                    alt={property.title || "Property"} 
                  />
                </div>
              )}
              
              <div className="property-details">
                <h3>{property.title || "Property Title"}</h3>
                <p className="property-price">
                  {property.price ? `₹${property.price.toLocaleString()}` : "Price not available"}
                </p>
                <p className="property-location">
                  {property.location || "Location not specified"}
                </p>
                
                {property.type && (
                  <span className="property-type">{property.type}</span>
                )}
                
                {property.bedrooms && (
                  <span className="property-spec">{property.bedrooms} BHK</span>
                )}
                
                {property.area && (
                  <span className="property-spec">{property.area} sqft</span>
                )}
              </div>
              
              <div className="property-actions">
                <button 
                  className="remove-interest-btn"
                  onClick={() => handleRemoveInterest(property.id)}
                >
                  Remove Interest
                </button>
                <button className="contact-btn">
                  Contact Owner
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterestedProperties;