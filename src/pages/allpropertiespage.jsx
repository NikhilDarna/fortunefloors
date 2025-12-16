import { useEffect, useState } from "react";
import PropertyCard from "../components/PropertyCard";
import "./allpropertiespage.css";

const AllProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllProperties();
  }, []);

  const fetchAllProperties = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/properties");
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="all-properties-page">
      <div className="all-properties-header">
        <h1>All Properties</h1>
      </div>

      {loading ? (
  <div className="loading">Loading properties...</div>
) : properties.length === 0 ? (
  <div className="no-properties">
    <h2>No properties found</h2>
    <p>
      There are currently no properties listed under this category.
      <br />
      Please check back later or try a different filter.
    </p>
  </div>
) : (
  <div className="property-grid">
    {properties.map((property) => (
      <PropertyCard key={property.id} property={property} />
    ))}
  </div>
)}
    </div>
  );
};

export default AllProperties;
