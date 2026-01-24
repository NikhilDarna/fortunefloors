import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Favorites.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('date');

  // Mock data for demonstration
  const mockFavorites = [
    {
      id: 1,
      title: 'Modern Apartment in Downtown',
      type: 'Apartment',
      price: 450000,
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      location: 'Downtown',
      image: '/api/placeholder/300/200',
      dateAdded: '2024-01-15',
      priceChange: '+2.5%'
    },
    {
      id: 2,
      title: 'Luxury Villa with Pool',
      type: 'Villa',
      price: 1200000,
      bedrooms: 4,
      bathrooms: 3,
      area: 3500,
      location: 'Suburbs',
      image: '/api/placeholder/300/200',
      dateAdded: '2024-01-10',
      priceChange: '+1.2%'
    },
    {
      id: 3,
      title: 'Cozy Studio Apartment',
      type: 'Studio',
      price: 250000,
      bedrooms: 1,
      bathrooms: 1,
      area: 600,
      location: 'City Center',
      image: '/api/placeholder/300/200',
      dateAdded: '2024-01-20',
      priceChange: '-0.8%'
    },
    {
      id: 4,
      title: 'Family House with Garden',
      type: 'House',
      price: 750000,
      bedrooms: 3,
      bathrooms: 2,
      area: 2200,
      location: 'Suburbs',
      image: '/api/placeholder/300/200',
      dateAdded: '2024-01-05',
      priceChange: '+3.1%'
    },
    {
      id: 5,
      title: 'Penthouse with City View',
      type: 'Penthouse',
      price: 950000,
      bedrooms: 3,
      bathrooms: 2,
      area: 2800,
      location: 'Downtown',
      image: '/api/placeholder/300/200',
      dateAdded: '2024-01-12',
      priceChange: '+0.5%'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFavorites(mockFavorites);
      setLoading(false);
    }, 1000);
  }, []);

  const sortedFavorites = [...favorites].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'date':
        return new Date(b.dateAdded) - new Date(a.dateAdded);
      case 'name':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const handleRemoveFavorite = (propertyId) => {
    setFavorites(prev => prev.filter(property => property.id !== propertyId));
  };

  const handleCompare = () => {
    // Handle compare functionality
    console.log('Compare selected properties');
  };

  const handleShare = (property) => {
    // Handle share functionality
    console.log('Share property:', property.title);
  };

  if (loading) {
    return (
      <div className="favorites-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h1>My Favorite Properties</h1>
        <p>Keep track of properties you love and want to revisit</p>
      </div>

      <div className="favorites-actions">
        <div className="sort-section">
          <label htmlFor="sort">Sort by:</label>
          <select 
            id="sort"
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Date Added</option>
            <option value="price-low">Price (Low to High)</option>
            <option value="price-high">Price (High to Low)</option>
            <option value="name">Name</option>
          </select>
        </div>
        
        <div className="action-buttons">
          <button className="compare-btn" onClick={handleCompare}>
            Compare Selected
          </button>
          <button className="share-all-btn">
            Share All
          </button>
        </div>
      </div>

      {favorites.length > 0 ? (
        <>
          <div className="favorites-grid">
            {sortedFavorites.map(property => (
              <div key={property.id} className="favorite-card">
                <div className="favorite-image">
                  <img src={property.image} alt={property.title} />
                  <button 
                    className="favorite-btn"
                    onClick={() => handleRemoveFavorite(property.id)}
                  >
                    ❤️
                  </button>
                  {property.priceChange && (
                    <span className={`price-change ${property.priceChange.startsWith('+') ? 'positive' : 'negative'}`}>
                      {property.priceChange}
                    </span>
                  )}
                </div>
                
                <div className="favorite-details">
                  <h3>{property.title}</h3>
                  <p className="property-location">{property.location}</p>
                  
                  <div className="property-specs">
                    <span>{property.bedrooms} Beds</span>
                    <span>{property.bathrooms} Baths</span>
                    <span>{property.area} sq ft</span>
                  </div>
                  
                  <div className="property-price">
                    ${property.price.toLocaleString()}
                  </div>
                  
                  <div className="property-type">{property.type}</div>
                  
                  <div className="favorite-actions">
                    <Link to={`/property/${property.id}`} className="view-btn">
                      View Details
                    </Link>
                    <button 
                      className="share-btn"
                      onClick={() => handleShare(property)}
                    >
                      Share
                    </button>
                  </div>
                  
                  <div className="date-added">
                    Added on {new Date(property.dateAdded).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="favorites-summary">
            <h2>Favorites Summary</h2>
            <div className="summary-stats">
              <div className="stat-item">
                <div className="stat-number">{favorites.length}</div>
                <div className="stat-label">Total Favorites</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">
                  ${Math.round(favorites.reduce((sum, p) => sum + p.price, 0) / favorites.length).toLocaleString()}
                </div>
                <div className="stat-label">Average Price</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">
                  ${favorites.reduce((sum, p) => sum + p.price, 0).toLocaleString()}
                </div>
                <div className="stat-label">Total Value</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">
                  {new Set(favorites.map(p => p.type)).size}
                </div>
                <div className="stat-label">Property Types</div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="no-favorites">
          <div className="no-favorites-icon">💔</div>
          <h3>No Favorite Properties Yet</h3>
          <p>
            Start exploring and save properties you love! Click the heart icon on any property 
            to add it to your favorites.
          </p>
          <Link to="/properties" className="browse-properties-btn">
            Browse Properties
          </Link>
        </div>
      )}

      <div className="recommendations">
        <h2>Recommended for You</h2>
        <div className="recommendations-grid">
          <div className="recommendation-card">
            <img src="/api/placeholder/200/150" alt="Recommendation" />
            <h4>Modern Condo in City Center</h4>
            <p className="price">$385,000</p>
            <button className="add-favorite-btn">Add to Favorites</button>
          </div>
          <div className="recommendation-card">
            <img src="/api/placeholder/200/150" alt="Recommendation" />
            <h4>Beachfront Villa</h4>
            <p className="price">$1,250,000</p>
            <button className="add-favorite-btn">Add to Favorites</button>
          </div>
          <div className="recommendation-card">
            <img src="/api/placeholder/200/150" alt="Recommendation" />
            <h4>Cozy Townhouse</h4>
            <p className="price">$425,000</p>
            <button className="add-favorite-btn">Add to Favorites</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favorites;
