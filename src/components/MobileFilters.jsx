import { useState, useEffect } from "react";
import {
  FaBuilding,
  FaHome,
  FaVectorSquare,
  FaStore,
  FaBed,
  FaWarehouse,
} from "react-icons/fa";
import "./MobileFilters.css";

/* ================= PRICE ================= */
const PRICE_STEPS = [
  0, 5000, 10000, 20000, 30000, 50000,
  100000, 300000, 500000,
  1000000, 2000000, 3000000,
  5000000, 10000000, 20000000, 30000000
];

const formatPrice = (v) => {
  if (v === 0) return "₹ 0";
  if (v >= 10000000) return `₹ ${(v / 10000000).toFixed(1)} Cr`;
  if (v >= 100000) return `₹ ${(v / 100000).toFixed(0)} L`;
  return `₹ ${v.toLocaleString()}`;
};

/* ================= PROPERTY TYPES ================= */
const PROPERTY_TYPE_MAP = {
  buy: [
    { id: "flat", label: "Flat", icon: <FaBuilding /> },
    { id: "villa", label: "House/Villa", icon: <FaHome /> },
    { id: "plot", label: "Plot/Land", icon: <FaVectorSquare /> },
  ],

  rent: [
    { id: "flat", label: "Flat", icon: <FaBuilding /> },
    { id: "villa", label: "House/Villa", icon: <FaHome /> },
  ],

  "pg/hostel": [
    { id: "pg", label: "PG", icon: <FaBed /> },
    { id: "hostel", label: "Hostel", icon: <FaWarehouse /> },
  ],

  plot: [
    { id: "plot", label: "Plot/Land", icon: <FaVectorSquare /> },
  ],

  commercial_buy: [
    { id: "office", label: "Office Space", icon: <FaBuilding /> },
    { id: "shop", label: "Shop", icon: <FaStore /> },
    { id: "showroom", label: "Showroom", icon: <FaStore /> },
    { id: "land", label: "Commercial Land", icon: <FaVectorSquare /> },
  ],

  commercial_rent: [
    { id: "office", label: "Office Space", icon: <FaBuilding /> },
    { id: "showroom", label: "Showroom", icon: <FaStore /> },
  ],
};

const BHK_OPTIONS = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"];

export default function MobileFilters() {
  const [activeTab, setActiveTab] = useState("buy");
  const [commercialMode, setCommercialMode] = useState("buy");

  const [minIdx, setMinIdx] = useState(0);
  const [maxIdx, setMaxIdx] = useState(PRICE_STEPS.length - 1);

  const [types, setTypes] = useState([]);
  const [bhk, setBhk] = useState([]);

  /* ================= RESTORE SAVED FILTERS ================= */
  useEffect(() => {
    const saved = JSON.parse(sessionStorage.getItem("filters"));
    if (!saved) return;

    if (saved.type === "rent") setActiveTab("rent");
    if (saved.type === "buy") setActiveTab("buy");
    if (saved.propertyType === "plot") setActiveTab("plot");
    if (saved.propertyType === "pg") setActiveTab("pg/hostel");
    if (saved.category === "commercial") {
      setActiveTab("commercial");
      setCommercialMode(saved.type || "buy");
    }

    if (saved.minPrice !== undefined)
      setMinIdx(PRICE_STEPS.indexOf(Number(saved.minPrice)));

    if (saved.maxPrice !== undefined)
      setMaxIdx(PRICE_STEPS.indexOf(Number(saved.maxPrice)));

    if (saved.propertyType) setTypes([saved.propertyType]);
    if (saved.bhk) setBhk(saved.bhk.split(","));
  }, []);

  /* ================= SAVE FILTERS ================= */
  useEffect(() => {
    const filters = {};

    /* transaction */
    if (activeTab === "buy") filters.type = "buy";
    if (activeTab === "rent") filters.type = "rent";
    if (activeTab === "plot") filters.propertyType = "plot";
    if (activeTab === "pg/hostel") filters.propertyType = "pg";

    if (activeTab === "commercial") {
      filters.category = "commercial";
      filters.type = commercialMode;
    }

    /* price */
    filters.minPrice = PRICE_STEPS[minIdx];
    filters.maxPrice = PRICE_STEPS[maxIdx];

    /* property type */
    if (types.length) {
      filters.propertyType = types[0];
    }

    /* bhk */
    if (bhk.length) {
      filters.bhk = bhk.join(",");
    }

    sessionStorage.setItem("filters", JSON.stringify(filters));
  }, [activeTab, commercialMode, minIdx, maxIdx, types, bhk]);

  /* ================= HELPERS ================= */
  const getPropertyTypes = () => {
    if (activeTab === "commercial") {
      return PROPERTY_TYPE_MAP[`commercial_${commercialMode}`];
    }
    return PROPERTY_TYPE_MAP[activeTab] || [];
  };

  const toggleType = (id) => {
    setTypes((prev) => (prev[0] === id ? [] : [id]));
  };

  const toggleBhk = (b) => {
    setBhk((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );
  };

  const propertyTypes = getPropertyTypes();

  return (
    <div className="mf-container">

      {/* MAIN TABS */}
      <div className="mf-tabs">
        {["Buy", "Rent", "Pg/Hostel", "Plot", "Commercial"].map((t) => (
          <button
            key={t}
            className={`mf-tab ${activeTab === t.toLowerCase() ? "active" : ""}`}
            onClick={() => {
              setActiveTab(t.toLowerCase());
              setTypes([]);
              setBhk([]);
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* COMMERCIAL SUB TABS */}
      {activeTab === "commercial" && (
        <div className="mf-sub-tabs">
          <h5>Looking to:</h5>
          {["Buy", "Rent"].map((t) => (
            <button
              key={t}
              className={`mf-sub-tab ${
                commercialMode === t.toLowerCase() ? "active" : ""
              }`}
              onClick={() => {
                setCommercialMode(t.toLowerCase());
                setTypes([]);
              }}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {/* LOCATION */}
      <section className="mf-section">
        <h4>Select City/Localities</h4>
        <div className="mf-chip-row">
          <span className="mf-chip active">Hyderabad</span>
        </div>
      </section>

      {/* BUDGET */}
      <section className="mf-section">
        <h4>Budget</h4>
        <div className="mf-budget-value">
          {formatPrice(PRICE_STEPS[minIdx])} to{" "}
          {formatPrice(PRICE_STEPS[maxIdx])}
        </div>

        <div className="mf-range-wrapper">
          <input
            type="range"
            min="0"
            max={PRICE_STEPS.length - 1}
            value={minIdx}
            onChange={(e) =>
              setMinIdx(Math.min(+e.target.value, maxIdx - 1))
            }
          />
          <input
            type="range"
            min="0"
            max={PRICE_STEPS.length - 1}
            value={maxIdx}
            onChange={(e) =>
              setMaxIdx(Math.max(+e.target.value, minIdx + 1))
            }
          />
        </div>
      </section>

      {/* PROPERTY TYPE */}
      <section className="mf-section">
        <h4>Property Type</h4>
        <div className="mf-type-scroll">
          {propertyTypes.map((p) => (
            <div
              key={p.id}
              className={`mf-type-card ${types.includes(p.id) ? "active" : ""}`}
              onClick={() => toggleType(p.id)}
            >
              <div className="mf-type-icon">{p.icon}</div>
              <span>{p.label}</span>
              {types.includes(p.id) && <span className="mf-check">✓</span>}
            </div>
          ))}
        </div>
      </section>

      {/* BHK */}
      {(activeTab === "buy" || activeTab === "rent") && (
        <section className="mf-section">
          <h4>BHK</h4>
          <div className="mf-chip-row">
            {BHK_OPTIONS.map((b) => (
              <span
                key={b}
                className={`mf-chip ${bhk.includes(b) ? "active" : ""}`}
                onClick={() => toggleBhk(b)}
              >
                + {b}
              </span>
            ))}
          </div>
        </section>
      )}

      <div className="mf-advance">Check Advance Filters</div>
    </div>
  );
}
