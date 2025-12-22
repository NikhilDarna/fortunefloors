import React, { useEffect, useState } from "react";
import "./PropertyCard.css";
import { Link } from "react-router-dom";
import { useWishlist } from "../components/wishlistcontext";

const PropertyCard = ({ property }) => {
  const { wishlist, toggleWishlist } = useWishlist();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const createSlug = (title, location) =>
  `${title}-${location}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  // Auto-image slider state
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const totalImages = property.photos?.length || 1;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % totalImages);
    }, 2000);

    return () => clearInterval(interval);
  }, [property.photos]);

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

  // Image URL
  const imgURL =
    property.photos?.length
      ? `http://localhost:5000/uploads/${property.photos[currentImage]}`
      : "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400";

  return (
    <div className="property-card">

      <div className="property-image">
        <img src={imgURL} alt="Property" />

        <div className="property-badges">
          <span className="badge badge-sale">
            {(property.transaction_type || "SALE").toUpperCase()}
          </span>
        </div>

        <div className="wis-btn">
          <button
            className="wishlist-btn"
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(property);
            }}
          >
            ❤️
          </button>
        </div>
      </div>

      <div className="property-content">
        <h6 className="property-title">{property.title}</h6>
        <p className="property-location">📍 {property.location}</p>

        <Link to={`/property/${createSlug(property.title, property.location)}`} className="view-details-btn">
          View Details
        </Link>

        <div className="property-footer">
          <div className="property-price">{formatPrice(property.price)}</div>

          <div className="property-features">
            <span className="feature-pill">📏 {property.area} sq ft</span>
            <span className="feature-pill">🛏 {property.bedrooms}</span>
            <span className="feature-pill">🚿 {property.bathrooms}</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PropertyCard;
