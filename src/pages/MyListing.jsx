import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MyListing.css';

const MyListing = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Mock data for demonstration
  const mockProperties = [
    {
      id: 1,
      title: 'Modern Apartment in Downtown',
      type: 'Apartment',
      price: 450000,
      status: 'active',
      views: 245,
      inquiries: 12,
      date: '2024-01-15',
      image: '/api/placeholder/300/200'
    },
    {
      id: 2,
      title: 'Luxury Villa with Pool',
      type: 'Villa',
      price: 1200000,
      status: 'active',
      views: 189,
      inquiries: 8,
      date: '2024-01-10',
      image: '/api/placeholder/300/200'
    },
    {
      id: 3,
      title: 'Cozy Studio Apartment',
      type: 'Studio',
      price: 250000,
      status: 'pending',
      views: 67,
      inquiries: 3,
      date: '2024-01-20',
      image: '/api/placeholder/300/200'
    },
    {
      id: 4,
      title: 'Family House with Garden',
      type: 'House',
      price: 750000,
      status: 'sold',
      views: 423,
      inquiries: 28,
      date: '2023-12-15',
      image: '/api/placeholder/300/200'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProperties(mockProperties);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredProperties = properties.filter(property => {
    if (filter === 'all') return true;
    return property.status === filter;
  });

  const handleStatusChange = (propertyId, newStatus) => {
    setProperties(prev => prev.map(property => 
      property.id === propertyId ? { ...property, status: newStatus } : property
    ));
  };

  const handleDelete = (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      setProperties(prev => prev.filter(property => property.id !== propertyId));
    }
  };

  if (loading) {
    return (
      <div className="my-listing-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading your listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-listing-container">
      <div className="my-listing-header">
        <h1>My Property Listings</h1>
        <p>Manage and track all your property listings</p>
      </div>

      <div className="listing-actions">
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({properties.length})
          </button>
          <button 
            className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active ({properties.filter(p => p.status === 'active').length})
          </button>
          <button 
            className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({properties.filter(p => p.status === 'pending').length})
          </button>
          <button 
            className={`filter-tab ${filter === 'sold' ? 'active' : ''}`}
            onClick={() => setFilter('sold')}
          >
            Sold ({properties.filter(p => p.status === 'sold').length})
          </button>
        </div>
        
        <Link to="/add-property" className="add-property-btn">
          + Add New Property
        </Link>
      </div>

      <div className="listings-grid">
        {filteredProperties.map(property => (
          <div key={property.id} className="listing-card">
            <div className="listing-image">
              <img src={property.image} alt={property.title} />
              <span className={`status-badge ${property.status}`}>
                {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
              </span>
            </div>
            
            <div className="listing-details">
              <h3>{property.title}</h3>
              <p className="property-type">{property.type}</p>
              <div className="property-price">${property.price.toLocaleString()}</div>
              
              <div className="listing-stats">
                <div className="stat">
                  <span className="stat-icon">👁️</span>
                  <span>{property.views} views</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">💬</span>
                  <span>{property.inquiries} inquiries</span>
                </div>
              </div>
              
              <div className="listing-date">
                Listed on {new Date(property.date).toLocaleDateString()}
              </div>
              
              <div className="listing-actions">
                <Link to={`/property/${property.id}/edit`} className="edit-btn">
                  Edit
                </Link>
                <Link to={`/property/${property.id}`} className="view-btn">
                  View
                </Link>
                <select 
                  className="status-select"
                  value={property.status}
                  onChange={(e) => handleStatusChange(property.id, e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="sold">Sold</option>
                  <option value="inactive">Inactive</option>
                </select>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(property.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="no-listings">
          <h3>No properties found</h3>
          <p>
            {filter === 'all' 
              ? "You haven't listed any properties yet. Start by adding your first property!"
              : `No ${filter} properties found. Try changing the filter or add a new property.`
            }
          </p>
          {filter === 'all' && (
            <Link to="/add-property" className="add-property-btn">
              + Add Your First Property
            </Link>
          )}
        </div>
      )}

      <div className="listing-summary">
        <h2>Listing Summary</h2>
        <div className="summary-grid">
          <div className="summary-item">
            <div className="summary-number">{properties.length}</div>
            <div className="summary-label">Total Listings</div>
          </div>
          <div className="summary-item">
            <div className="summary-number">{properties.filter(p => p.status === 'active').length}</div>
            <div className="summary-label">Active</div>
          </div>
          <div className="summary-item">
            <div className="summary-number">{properties.reduce((sum, p) => sum + p.views, 0)}</div>
            <div className="summary-label">Total Views</div>
          </div>
          <div className="summary-item">
            <div className="summary-number">{properties.reduce((sum, p) => sum + p.inquiries, 0)}</div>
            <div className="summary-label">Total Inquiries</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyListing;
