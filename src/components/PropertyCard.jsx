import { Link } from 'react-router-dom';

const PropertyCard = ({ property, showStatus = false }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'rejected': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <div className="property-card">
      <div className="property-image">
        {property.photos && property.photos.length > 0 ? (
          <img 
            src={`http://localhost:5000/uploads/${property.photos[0]}`} 
            alt={property.title}
            onError={(e) => {
              e.target.src = 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400';
            }}
          />
        ) : (
          <img 
            src="https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400" 
            alt={property.title} 
          />
        )}
        <div className="property-badges">
          <span className={`badge badge-${property.transaction_type}`}>
            {property.transaction_type.toUpperCase()}
          </span>
          {showStatus && (
            <span 
              className="badge badge-status"
              style={{ backgroundColor: getStatusColor(property.status) }}
            >
              {property.status.toUpperCase()}
            </span>
          )}
        </div>
      </div>
      <div className="property-content">
        <h3 className="property-title">{property.title}</h3>
        <p className="property-location">📍 {property.location}</p>
        <div className="property-price">{formatPrice(property.price)}</div>
        <div className="property-features">
          {property.area && <span>📏 {property.area} sq ft</span>}
          {property.bedrooms && <span>🛏️ {property.bedrooms} bed</span>}
          {property.bathrooms && <span>🚿 {property.bathrooms} bath</span>}
        </div>
        <div className="property-owner">
          <div className="owner-avatar">
            {property.profile_photo ? (
              <img src={`http://localhost:5000/uploads/${property.profile_photo}`} alt="Owner" />
            ) : (
              <div className="avatar-placeholder">{property.full_name?.charAt(0) || property.username?.charAt(0)}</div>
            )}
          </div>
          <div className="owner-info">
            <p className="owner-name">{property.full_name || property.username}</p>
            <div className="owner-rating">
              <span className="stars">★★★★☆</span>
              <span>{property.rating || 4.5}</span>
            </div>
          </div>
        </div>
        
        <Link to={`/property/${property.id}`} className="view-details-btn">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;