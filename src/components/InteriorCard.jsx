import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../components/wishlistcontext";
import "./PropertyCard.css";

/* ================= SAFE ARRAY HANDLER ================= */
const toArray = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    if (!value.trim().startsWith("[")) return [value];

    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [value];
    } catch {
      return [value];
    }
  }

  return [];
};

/* ================= SLUG ================= */
const makeSlug = (title) =>
  title
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const InteriorCard = ({ interior }) => {
  const { wishlist, toggleWishlist } = useWishlist();
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!interior) return null;

  /* ================= DATA ================= */
  const photos = toArray(interior.photos);
  const professions = toArray(interior.profession);
  const projectTypes = toArray(interior.projectType);
  const propertiesServed = toArray(interior.propertyServed);

  const image =
    photos.length > 0
      ? `${import.meta.env.VITE_API_URL}/uploads/${photos[0]}`
      : "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400";

  const slug = makeSlug(interior.title);

  /* ================= WISHLIST STATE ================= */
  useEffect(() => {
    setIsWishlisted(
      wishlist.some(
        (w) => w.id === interior.id && w.type === "interior"
      )
    );
  }, [wishlist, interior.id]);

  /* ================= HANDLER ================= */
  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    toggleWishlist({
      ...interior,
      type: "interior",
    });
  };

  return (
    <div className="property-card">
      {/* ================= IMAGE ================= */}
      <div className="property-image">
        <img
          src={image}
          alt={interior.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400";
          }}
        />

        <div className="property-badges">
          <span className="badge badge-sale">INTERIOR</span>
        </div>

        {/* ❤️ WISHLIST */}
        <div className="wis-btn">
          <button
            className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
            onClick={handleWishlist}
          >
            <svg viewBox="0 0 24 24" className="heart-icon">
              <path d="M12 21s-6.716-4.468-9.33-7.083C.757 11.004.55 7.74 2.758 5.532 4.967 3.323 8.23 3.53 10.444 5.744L12 7.3l1.556-1.556c2.214-2.214 5.477-2.421 7.686-.212 2.208 2.208 2.001 5.472.087 8.385C18.716 16.532 12 21 12 21z" />
            </svg>
          </button>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="property-content">
        <h5 className="property-title">{interior.title}</h5>

        {professions.length > 0 && (
          <p className="property-location">🛠 {professions.join(", ")}</p>
        )}

        {interior.service_area && (
          <p className="property-location">📍 {interior.service_area}</p>
        )}

        <div className="property-price">
          <span className="rupee-symbol">₹</span>
          <span className="price-amount">
            {interior.starting_price || "On Request"}
          </span>
        </div>

        {/* ================= FEATURES ================= */}
        <div className="property-features">
          {projectTypes[0] && (
            <span className="feature-pill">🏠 {projectTypes[0]}</span>
          )}
          {propertiesServed[0] && (
            <span className="feature-pill">🏢 {propertiesServed[0]}</span>
          )}
          {interior.experience && (
            <span className="feature-pill">⏱ {interior.experience} yrs</span>
          )}
        </div>

        {/* ================= VIEW DETAILS ================= */}
        <div id="price-button-row">
          <Link to={`/interior/${slug}`} className="view-details-btn">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InteriorCard;
