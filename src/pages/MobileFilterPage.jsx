import MobileFilters from "../components/MobileFilters";
import "./MobileFilterPage.css";
import { useNavigate } from "react-router-dom";

const MobileFilterPage = () => {
  const navigate = useNavigate();

  const handleClear = () => {
    sessionStorage.removeItem("filters");
    navigate("/all-properties");
  };

  const handleApply = () => {
    const filters = JSON.parse(sessionStorage.getItem("filters")) || {};

    // ✅ CONVERT OBJECT → QUERY STRING
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null) {
        params.append(key, value);
      }
    });

    navigate(`/all-properties?${params.toString()}`);
  };

  return (
    <div className="mobile-filter-page">
      {/* HEADER */}
      <div className="filter-page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← <span className="header-title">Back</span>
        </button>

        <button className="clear-btn" onClick={handleClear}>
          Clear
        </button>
      </div>

      {/* FILTER CONTENT */}
      <MobileFilters />

      {/* BOTTOM ACTION */}
      <div className="filter-bottom-bar">
        <button className="bottom-apply-btn" onClick={handleApply}>
          VIEW PROPERTIES
        </button>
      </div>
    </div>
  );
};

export default MobileFilterPage;
