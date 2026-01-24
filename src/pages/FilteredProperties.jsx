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
    let params = new URLSearchParams();

    const path = window.location.pathname.toLowerCase();

    // 1. Always keep transaction context
    if (path.includes("/buy")) params.set("type", "buy");
    else if (path.includes("/rent")) params.set("type", "rent");
    else if (path.includes("/sell")) params.set("type", "sale");

    // 2. Property type overrides transaction
    if (filterType === "plots") params.set("type", "plot");
    if (filterType === "pg") params.set("type", "pg");

    // 3. Feature filters (combine with transaction)
    if (filterType === "ready") params.set("readyToMove", "true");
    if (filterType === "owner") params.set("directFromOwner", "true");
    if (filterType === "furnishing") params.set("furnishing", value);

    const url = `${import.meta.env.VITE_API_URL}/api/properties?${params.toString()}`;
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
          {filterType === "plots" && "Plot Properties"}

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
