import { useState } from 'react';

const PropertyFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: ''
  });

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { location: '', minPrice: '', maxPrice: '' };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="property-filters">
      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            placeholder="Enter city or area"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="minPrice">Min Price (₹)</label>
          <input
            type="number"
            id="minPrice"
            placeholder="Min price"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="maxPrice">Max Price (₹)</label>
          <input
            type="number"
            id="maxPrice"
            placeholder="Max price"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
          />
        </div>
        
        <div className="filter-actions">
          <button onClick={clearFilters} className="clear-filters-btn">
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;