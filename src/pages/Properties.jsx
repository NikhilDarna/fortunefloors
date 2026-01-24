import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Properties.css';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [filters, setFilters] = useState({
    propertyType: 'all',
    priceRange: 'all',
    bedrooms: 'all',
    location: ''
  });
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const mockProperties = [
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
      featured: true
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
      featured: true
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
      featured: false
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
      featured: true
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
      featured: false
    },
    {
      id: 6,
      title: 'Beachfront Condo',
      type: 'Condo',
      price: 650000,
      bedrooms: 2,
      bathrooms: 2,
      area: 1500,
      location: 'Beach Area',
      image: '/api/placeholder/300/200',
      featured: true
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProperties(mockProperties);
      setFilteredProperties(mockProperties);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = properties;

    // Filter by property type
    if (filters.propertyType !== 'all') {
      filtered = filtered.filter(p => p.type.toLowerCase() === filters.propertyType.toLowerCase());
    }

    // Filter by price range
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(p => p.price >= min && p.price <= max);
    }

    // Filter by bedrooms
    if (filters.bedrooms !== 'all') {
      filtered = filtered.filter(p => p.bedrooms === parseInt(filters.bedrooms));
    }

    // Filter by location
    if (filters.location) {
      filtered = filtered.filter(p => 
        p.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredProperties(filtered);
  }, [filters, properties]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      propertyType: 'all',
      priceRange: 'all',
      bedrooms: 'all',
      location: ''
    });
  };

  if (loading) {
    return (
      <div className="properties-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="properties-container">
      <div className="properties-header">
        <h1>Properties</h1>
        <p>Find your perfect property from our extensive collection</p>
      </div>

      <div className="filters-section">
        <h2>Filter Properties</h2>
        <div className="filters-grid">
          <div className="filter-group">
            <label>Property Type</label>
            <select 
              value={filters.propertyType} 
              onChange={(e) => handleFilterChange('propertyType', e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
              <option value="condo">Condo</option>
              <option value="studio">Studio</option>
              <option value="penthouse">Penthouse</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range</label>
            <select 
              value={filters.priceRange} 
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            >
              <option value="all">All Prices</option>
              <option value="0-300000">Under $300K</option>
              <option value="300000-500000">$300K - $500K</option>
              <option value="500000-750000">$500K - $750K</option>
              <option value="750000-1000000">$750K - $1M</option>
              <option value="1000000-9999999">$1M+</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Bedrooms</label>
            <select 
              value={filters.bedrooms} 
              onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
            >
              <option value="all">Any</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
              <option value="4">4+ Bedrooms</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Location</label>
            <input 
              type="text" 
              placeholder="Enter location..."
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            />
          </div>
        </div>
        <button className="clear-filters-btn" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      <div className="properties-stats">
        <p>Showing {filteredProperties.length} of {properties.length} properties</p>
      </div>

      <div className="properties-grid">
        {filteredProperties.map(property => (
          <div key={property.id} className="property-card">
            <div className="property-image">
              <img src={property.image} alt={property.title} />
              {property.featured && <span className="featured-badge">Featured</span>}
            </div>
            <div className="property-details">
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
              <div className="property-actions">
                <Link to={`/property/${property.id}`} className="view-details-btn">
                  View Details
                </Link>
                <button className="favorite-btn">❤️</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="no-properties">
          <h3>No properties found</h3>
          <p>Try adjusting your filters to see more results</p>
        </div>
      )}
    </div>
  );
};

export default Properties;
