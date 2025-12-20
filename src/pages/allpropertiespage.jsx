import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import "./allpropertiespage.css";

const AllProperties = () => {
  const location = useLocation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const params = new URLSearchParams(location.search);

  /* ===============================
     🔹 DYNAMIC HEADING LOGIC
  =============================== */
 const getPageHeading = () => {
  const type = params.get("type");
  const propertyType = params.get("propertyType");
  const locationName = params.get("location");
  const furnishing = params.get("furnishing");
  const sharing = params.get("sharing");
  const subType = params.get("listingSubType");

  /* ===== HIGHEST PRIORITY ===== */

  if (params.get("readyToMove") === "true")
    return "Ready To Move Properties";

  if (params.get("directFromOwner") === "true")
    return "Owner Properties";

  if (params.get("bachelorFriendly") === "true")
    return "Bachelor Friendly Properties";
  
  if (params.get("verified") === "true") 
    return "Verified Homes";
  
  if (params.get("category") === "commercial") 
    return "Commercial Properties";

  /* ===== FURNISHING ===== */

  if (furnishing === "fully-furnished")
    return "Fully Furnished Properties";

  if (furnishing === "semi-furnished")
    return "Semi Furnished Properties";

  /* ===== PG ===== */

  if (propertyType === "pg") {
    if (sharing) return `${sharing}-Sharing PG`;
    return "PG / Hostels";
  }

  /* ===== RENT ===== */

  if (type === "rent" && propertyType && locationName)
    return `${capitalize(propertyType)} for Rent in ${locationName}`;

  /* ===== BUY ===== */

  if (propertyType && locationName)
    return `${capitalize(propertyType)} in ${locationName}`;

  /* ===== COMMERCIAL ===== */
  if (params.get("status") === "approved") {
    return "Verified Homes";
  }

  if (params.get("category") === "commercial")
    return "Commercial Properties";

  /* ===== DEFAULT ===== */
  if (subType === "office") return "Commercial Office Spaces";
  if (subType === "shop") return "Commercial Shops";
  if (subType === "warehouse") return "Warehouses";
  if (subType === "showroom") return "Showrooms";
  return "All Properties";
};


  const pageTitle = getPageHeading();

  /* ===============================
     🔹 FETCH PROPERTIES
  =============================== */
  useEffect(() => {
    setProperties([]);
    fetchProperties();
  }, [location.search]);

  const fetchProperties = async () => {
    try {
      setLoading(true);

      // remove empty params
      [...params.keys()].forEach((k) => {
        if (!params.get(k)) params.delete(k);
      });

      const query = params.toString();
      const url = `http://localhost:5000/api/properties${query ? `?${query}` : ""}`;

      console.log("🔍 Fetching:", url);

      const res = await fetch(url);
      const data = await res.json();
      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="all-properties-page">
      <div className="all-properties-header">
        <h1>{pageTitle}</h1>
      </div>

      {loading ? (
        <div className="loading">Loading properties...</div>
      ) : properties.length === 0 ? (
        <div className="no-properties">
          <h2>No properties found</h2>
          <p>Please try a different option.</p>
        </div>
      ) : (
        <div className="property-grid">
          {Array.isArray(properties) && properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProperties;

/* ===============================
   🔹 HELPERS
=============================== */
const capitalize = (text) =>
  text.charAt(0).toUpperCase() + text.slice(1);
