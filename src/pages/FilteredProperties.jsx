import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import "./allpropertiespage.css";

const FilteredProperties = () => {
  const { filterType, value } = useParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiltered();
  }, [filterType, value]);

  const fetchFiltered = async () => {
    try {
      let url = "";

      if (filterType === "ready") {
        url = "http://localhost:5000/api/properties/ready-to-move";
      }

      if (filterType === "owner") {
        url = "http://localhost:5000/api/properties/owner";
      }

      if (filterType === "furnishing") {
        url = `http://localhost:5000/api/properties/furnishing/${value}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setProperties(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="all-properties-page">
      <div className="all-properties-header">
        <h1>
          {filterType === "ready" && "Ready To Move Properties"}
          {filterType === "owner" && "Owner Properties"}
          {filterType === "furnishing" &&
            value.replace("-", " ").toUpperCase() + " Properties"}
        </h1>
      </div>

      {loading ? (
        <div className="loading">Loading properties...</div>
      ) : properties.length === 0 ? (
        <div className="no-properties">
          ❌ No properties listed under this category
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

export default FilteredProperties;
