import { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import PropertyFilters from '../components/PropertyFilters';
import './home.css';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState('all');
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    fetchProperties();
  }, [activeType, filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        type: activeType,
        ...filters
      });

      const response = await fetch(
        `http://localhost:5000/api/properties?${queryParams}`
      );
      const data = await response.json();
      setProperties(data);
      setFilteredProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (type) => {
    setActiveType(type);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Find Your Dream Property</h1>
          <p>Discover the best real estate deals in your area</p>
        </div>
      </div>

      <div className="container">
        {/* Property Types */}
        <div className="property-types">
          <button
            className={`type-btn ${activeType === 'all' ? 'active' : ''}`}
            onClick={() => handleTypeChange('all')}
          >
            All Properties
          </button>
          <button
            className={`type-btn ${activeType === 'sale' ? 'active' : ''}`}
            onClick={() => handleTypeChange('sale')}
          >
            For Sale
          </button>
          <button
            className={`type-btn ${activeType === 'rent' ? 'active' : ''}`}
            onClick={() => handleTypeChange('rent')}
          >
            For Rent
          </button>
          <button
            className={`type-btn ${activeType === 'plot' ? 'active' : ''}`}
            onClick={() => handleTypeChange('plot')}
          >
            Plots
          </button>
        </div>

        {/* Filters */}
        <PropertyFilters onFilterChange={handleFilterChange} />

        {/* Featured Properties */}
<div className="properties-section">
  <h2>Featured Properties</h2>

  {loading ? (
    <div className="loading">Loading properties...</div>
  ) : filteredProperties.length === 0 ? (
    <div className="no-properties">
      No properties found matching your criteria.
    </div>
  ) : (
    <div className="properties-grid">
      {filteredProperties.map((property) => (
        <PropertyCard 
          key={property.id} 
          property={property} 
        />
      ))}
    </div>
  )}
</div>

{/* Horizontal Card Section */}
        <div className="horizontal-card-container">
          <h2>Most Popular Property Places</h2>
          <p className="section-subtitle">
            Explore the most sought-after locations for your dream home,
            featuring properties in top cities and countries around the world.
          </p>
          <div className="row smallcard">
            <div className="card card1">
              <div className="card-icon">🏡</div>
              <h3>Modern Villa</h3>
              <p>
                Step into a world of elegance and comfort in this exquisite
                modern villa, where every corner reflects contemporary luxury.
                Enjoy spacious interiors, state-of-the-art amenities, and serene
                surroundings that elevate your lifestyle.
              </p>
            </div>

            <div className="card card1">
              <div className="card-icon">🏠</div>
              <h3>Family House</h3>
              <p>
                A warm and inviting family home designed for comfort,
                togetherness, and joyful living. Enjoy spacious rooms, a cozy
                ambiance, and a safe neighborhood perfect for creating lifelong
                memories.
              </p>
            </div>

            <div className="card card1">
              <div className="card-icon">🏘️</div>
              <h3>Town House</h3>
              <p>
                A stylish and modern townhouse blending convenience with
                elegance. Perfectly designed for urban living, it offers smart
                layouts, cozy spaces, and easy access to city amenities.
              </p>
            </div>

            <div className="card card1">
              <div className="card-icon">🏢</div>
              <h3>Apartment</h3>
              <p>
                A contemporary apartment offering comfort and style in every
                corner. Thoughtfully designed for modern living, with bright
                interiors and access to essential amenities.
              </p>
            </div>
          </div>
        </div>

        {/* Popular Places Section */}
        <div className="popular-places-section">
          <h2>Most Popular Property Places</h2>
          <p className="section-subtitle">
            Explore the most sought-after locations for your dream home,
            featuring properties in top cities and countries around the world.
          </p>
          <div className="popular-places-grid">
            <div className="place-card">
              <div className="place-image">700X700</div>
              <h3>Afghanistan</h3>
              <span>14 Properties</span>
            </div>
            <div className="place-card">
              <div className="place-image">700X700</div>
              <h3>Australia</h3>
              <span>24 Properties</span>
            </div>
            <div className="place-card">
              <div className="place-image">700X700</div>
              <h3>Bangladesh</h3>
              <span>12 Properties</span>
            </div>
            <div className="place-card">
              <div className="place-image">700X700</div>
              <h3>Miami</h3>
              <span>9 Properties</span>
            </div>
            <div className="place-card">
              <div className="place-image">700X700</div>
              <h3>Belize</h3>
              <span>14 Properties</span>
            </div>
            <div className="place-card">
              <div className="place-image">700X700</div>
              <h3>Cambodia</h3>
              <span>24 Properties</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
