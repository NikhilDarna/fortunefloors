import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./PropertyCard.css";
import { useWishlist } from "../components/wishlistcontext";

// ❤️ Inline SVG Heart Icon
const HeartIcon = ({ filled, size = 22 }) => {
  const fillColor = filled ? "#e91e63" : "none";
  const strokeColor = "#e91e63";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 21s-7.178-4.873-10-8.197C-0.166 9.944 2.243 4 7.5 4 9.78 4 11 5.382 12 6.5 13 5.382 14.22 4 16.5 4 21.757 4 24.166 9.944 22 12.803 19.178 16.127 12 21 12 21z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const PropertyCard = ({ property }) => {
  const { wishlist, toggleWishlist } = useWishlist();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    setIsWishlisted(wishlist.some((item) => item.id === property.id));
  }, [wishlist, property.id]);

  const formatPrice = (price) =>
    price
      ? new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          minimumFractionDigits: 0,
        }).format(price)
      : "Price not available";

  // Normalized transaction type (for CSS class)
  const badgeType = (property.transaction_type || "default")
    .toLowerCase()
    .replace(" ", "-");

  return (
    <div className="property-card">
      <div className="property-image">
        <img
          src={
            property.photos?.length
              ? `http://localhost:5000/uploads/${property.photos[0]}`
              : "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400"
          }
          alt={property.title || "Property"}
          onError={(e) => {
            e.target.src =
              "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400";
          }}
        />

        {/* 🏷️ Property Type Badge */}
        <div className="property-badges">
          <span className={`badge badge-${badgeType}`}>
            {(property.transaction_type || "Property").toUpperCase()}
          </span>
        </div>

        {/* ❤️ Wishlist Button */}
        <div className="wis-btn">
          <button
            className="wishlist-btn"
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(property);
            }}
            aria-pressed={isWishlisted}
          >
            <HeartIcon filled={isWishlisted} />
          </button>
        </div>
      </div>

      <div className="property-content">
        <div className="property-titlelocation">
          <h6 className="property-title">
            {property.title || "Untitled Property"}
          </h6>
          <p className="property-location">
            📍{property.location || "Location not available"}
          </p>
        </div>

        <Link
          to={`/property/${property.id || "#"}`}
          className="view-details-btn"
        >
          View Details
        </Link>

        <div className="property-price">{formatPrice(property.price)}</div>

        <div className="property-features">
          <span>📏 {property.area || "N/A"} sq ft</span>
          <span>🛏️ {property.bedrooms || "N/A"} bed</span>
          <span>🚿 {property.bathrooms || "N/A"} bath</span>
          <span>{property.ownerName || "N/A"} owner</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
