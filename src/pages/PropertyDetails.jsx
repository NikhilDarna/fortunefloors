import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/properties`);
      const properties = await response.json();
      const foundProperty = properties.find(p => p.id === parseInt(id));
      setProperty(foundProperty);
    } catch (error) {
      console.error('Error fetching property details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading property details...</div>;
  if (!property) return <div className="error">Property not found</div>;

  return (
    <div className="property-details">
      <div className="container">
        <div className="property-images">
          {property.photos && property.photos.length > 0 ? (
            <div className="image-gallery">
              <div className="main-image">
                <img 
                  src={`http://localhost:5000/uploads/${property.photos[currentImageIndex]}`} 
                  alt={property.title} 
                />
              </div>
              {property.photos.length > 1 && (
                <div className="image-thumbnails">
                  {property.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={`http://localhost:5000/uploads/${photo}`}
                      alt={`${property.title} ${index + 1}`}
                      className={index === currentImageIndex ? 'active' : ''}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="no-image">No images available</div>
          )}
        </div>

        <div className="property-info">
          <div className="property-header">
            <h1>{property.title}</h1>
            <div className="property-meta">
              <span className="property-type">{property.property_type}</span>
              <span className="transaction-type">{property.transaction_type}</span>
            </div>
            <p className="property-location">📍 {property.location}</p>
            <div className="property-price">₹{parseInt(property.price).toLocaleString()}</div>
          </div>

          <div className="property-features">
            <h3>Property Features</h3>
            <div className="features-grid">
              {property.area && (
                <div className="feature">
                  <span className="feature-icon">📏</span>
                  <span>{property.area} sq ft</span>
                </div>
              )}
              {property.bedrooms && (
                <div className="feature">
                  <span className="feature-icon">🛏️</span>
                  <span>{property.bedrooms} Bedrooms</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="feature">
                  <span className="feature-icon">🚿</span>
                  <span>{property.bathrooms} Bathrooms</span>
                </div>
              )}
            </div>
          </div>

          <div className="property-description">
            <h3>Description</h3>
            <p>{property.description}</p>
          </div>

          <div className="owner-info">
            <h3>Contact Owner</h3>
            <div className="owner-card">
              <div className="owner-avatar">
                {property.profile_photo ? (
                  <img src={`http://localhost:5000/uploads/${property.profile_photo}`} alt="Owner" />
                ) : (
                  <div className="avatar-placeholder">{property.full_name?.charAt(0) || property.username?.charAt(0)}</div>
                )}
              </div>
              <div className="owner-details">
                <h4>{property.full_name || property.username}</h4>
                <div className="owner-rating">
                  <span className="stars">★★★★☆</span>
                  <span>{property.rating || 4.5}</span>
                </div>
                {property.phone && <p>📞 {property.phone}</p>}
                <button className="contact-btn">Contact Owner</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;