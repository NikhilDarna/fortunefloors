import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import "./allpropertiespage.css";

const AllProperties = () => {
  const location = useLocation();
  const [allProperties, setAllProperties] = useState([]); // Store all properties
  const [properties, setProperties] = useState([]); // Displayed properties
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);
  const propertiesPerPage = 8;

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
    const category = params.get("category");

    /* ===== SPECIAL FLAGS ===== */
    if (params.get("readyToMove") === "true") return "Ready To Move Properties";
    if (params.get("directFromOwner") === "true") return "Owner Properties";
    if (params.get("bachelorFriendly") === "true") return "Bachelor Friendly Properties";
    if (params.get("verified") === "true") return "Verified Homes";

    /* ===== COMMERCIAL (ALWAYS BEFORE SUBTYPE) ===== */
    if (category === "commercial") return "Commercial Properties";

    if (propertyType === "pg") {
      const pgCat = params.get("pgCategory");
      const subType = params.get("listingSubType");

      if (pgCat && subType)
        return `${capitalize(pgCat)} ${capitalize(subType)} PG Properties`;

      if (pgCat)
        return `${capitalize(pgCat)} PG Properties`;

      if (subType)
        return `${capitalize(subType)} PG Properties`;

      if (sharing)
        return `PG Properties (${sharing} Sharing)`;

      return "PG Properties";
    }

    /* ===== FURNISHING ===== */
    if (furnishing === "fully-furnished") return "Fully Furnished Properties";
    if (furnishing === "semi-furnished") return "Semi Furnished Properties";

    /* ===== RENT / BUY ===== */
    if (type === "rent" && propertyType && locationName)
      return `${capitalize(propertyType)} for Rent in ${locationName}`;

    if (type === "rent") return "Rental Properties";
    if (type === "sale" || type === "buy") return "Properties for Sale";

    /* ===== COMMERCIAL SUBTYPES (ONLY IF CATEGORY MISSING) ===== */
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
    setAllProperties([]);
    setProperties([]);
    setCurrentPage(1);
    fetchProperties();
  }, [location.search]);

  useEffect(() => {
    // Update displayed properties when page changes or all properties are loaded
    updateDisplayedProperties();
  }, [currentPage, allProperties]);

  const fetchProperties = async () => {
    try {
      setLoading(true);

      // ✅ DO NOT MODIFY / ADD PARAMS
      const query = location.search;

      const url = `${import.meta.env.VITE_API_URL}/api/properties${query}`;

      console.log("🔍 FINAL FETCH:", url);

      const res = await fetch(url);
      const data = await res.json();

      // Store all properties and handle response
      const propertiesArray = Array.isArray(data) ? data : (data.properties || []);
      setAllProperties(propertiesArray);
      setTotalProperties(propertiesArray.length);
    } catch (err) {
      console.error("Fetch error:", err);
      setAllProperties([]);
      setTotalProperties(0);
    } finally {
      setLoading(false);
    }
  };

  const updateDisplayedProperties = () => {
    if (allProperties.length === 0) {
      setProperties([]);
      return;
    }

    const startIndex = (currentPage - 1) * propertiesPerPage;
    const endIndex = startIndex + propertiesPerPage;
    const displayedProperties = allProperties.slice(startIndex, endIndex);

    setProperties(displayedProperties);
  };

  const totalPages = Math.ceil(totalProperties / propertiesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <>
          <div className="property-grid">
            {Array.isArray(properties) && properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination-container">
              <div className="pagination-info">
                Showing {((currentPage - 1) * propertiesPerPage) + 1} to {Math.min(currentPage * propertiesPerPage, totalProperties)} of {totalProperties} properties
              </div>
              <div className="pagination">
                <button
                  className="pagination-button prev"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ‹
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  // Show max 5 page numbers
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        className={`pagination-button ${currentPage === pageNumber ? 'active' : ''}`}
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    (pageNumber === currentPage - 2 && currentPage > 3) ||
                    (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                  ) {
                    return <span key={pageNumber} className="pagination-ellipsis">...</span>;
                  }
                  return null;
                })}

                <button
                  className="pagination-button next"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </>
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