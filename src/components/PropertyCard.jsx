import React, { useEffect, useState } from "react";
import "./PropertyCard.css";
import { Link } from "react-router-dom";
import { useWishlist } from "../components/wishlistcontext";
import { formatPriceShort } from "../utils/formatPrice";

// Helper function to build star rating
const buildStars = (rating) => {
  const r = Math.max(0, Math.min(5, Number(rating) || 0));
  const fullStars = Math.floor(r);
  const hasHalfStar = r % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  let stars = "★".repeat(fullStars);
  if (hasHalfStar) {
    stars += "⭐"; // Using different star for half-star
  }
  stars += "☆".repeat(emptyStars);
  return stars;
};


 const ratingCache = new Map();



const PropertyCard = ({ property }) => {
  const { wishlist, toggleWishlist } = useWishlist();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  
  const createSlug = (title, location) =>
  `${title}-${location}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  useEffect(() => {
    let cancelled = false;

    const computeFromReviews = (reviews) => {
      const list = Array.isArray(reviews) ? reviews : [];
      const count = list.length;
      if (count === 0) {
        return { avg: 0, count: 0 };
      }
      const sum = list.reduce((acc, r) => acc + (Number(r?.rating) || 0), 0);
      const avg = Math.round((sum / count) * 10) / 10;
      return { avg, count };
    };

    const run = async () => {
      const cacheKey = `${property?.title || ""}-${property?.location || ""}`;

      if (ratingCache.has(cacheKey)) {
        const cached = ratingCache.get(cacheKey);
        if (!cancelled) {
          setAverageRating(cached.avg);
          setReviewCount(cached.count);
        }
        return;
      }

      if (Array.isArray(property?.reviews)) {
        const computed = computeFromReviews(property.reviews);
        ratingCache.set(cacheKey, computed);
        if (!cancelled) {
          setAverageRating(computed.avg);
          setReviewCount(computed.count);
        }
        return;
      }

      try {
        const societyKey = `${property.title}-${property.location}`;
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/society-reviews/${encodeURIComponent(societyKey)}`
        );

        if (!res.ok) {
          const computed = { avg: 0, count: 0 };
          ratingCache.set(cacheKey, computed);
          if (!cancelled) {
            setAverageRating(computed.avg);
            setReviewCount(computed.count);
          }
          return;
        }

        const data = await res.json();
        const computed = computeFromReviews(data);
        ratingCache.set(cacheKey, computed);
        if (!cancelled) {
          setAverageRating(computed.avg);
          setReviewCount(computed.count);
        }
      } catch (e) {
        const computed = { avg: 0, count: 0 };
        ratingCache.set(cacheKey, computed);
        if (!cancelled) {
          setAverageRating(computed.avg);
          setReviewCount(computed.count);
        }
      }
    };

    if (property?.title && property?.location) {
      run();
    } else {
      setAverageRating(0);
      setReviewCount(0);
    }

    return () => {
      cancelled = true;
    };
  }, [property?.title, property?.location, property?.id]);

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
  

  

const photos = Array.isArray(property.photos) ? property.photos : [];

const imgURL =
  photos.length > 0 && photos[currentImage]
    ? `${import.meta.env.VITE_API_URL}/uploads/${photos[currentImage]}`
    : "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400";

  return (
    <div className="property-card">
      
      <div className="property-image">
       <img
          src={imgURL}
          alt="Property"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/no-image.png";
          }}
        />


        <div className="property-badges" id="property-badges">
          <span className="badge badge-sale">
            {(property.transaction_type || "SALE").toUpperCase()}
          </span>
        </div>

        <div className="wis-btn">
          <button
            className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(property);
            }}
          >
            <svg viewBox="0 0 24 24" className="heart-icon">
              <path d="M12 21s-6.716-4.468-9.33-7.083C.757 11.004.55 7.74 2.758 5.532 4.967 3.323 8.23 3.53 10.444 5.744L12 7.3l1.556-1.556c2.214-2.214 5.477-2.421 7.686-.212 2.208 2.208 2.001 5.472.087 8.385C18.716 16.532 12 21 12 21z"/>
            </svg>
          </button>

        </div>
      </div>

      <div className="property-content">
        <h5 className="property-title" id="property-title">{property.title}</h5>
        
        <div className="location-rating-row" id="location-rating-row">
          <p className="property-location"> 📍 {property.location}</p>
          <div className="property-rating">
            <Link 
              to={`/property/${createSlug(property.title, property.location)}#reviews`}
              className="rating-link"
              data-rating={`${averageRating.toFixed(1)}★`}
              title={`Average: ${averageRating.toFixed(1)}`}
            >
              <span className="rating-value">{averageRating.toFixed(1)}</span>
              <span className="rating-stars" style={{ fontSize: '14px' }}>{buildStars(averageRating)}</span>
            </Link>
          </div>
        </div>

        <div className="" id="price-button-row">
          <div className="property-price" id="property-price">
            <span className="rupee-symbol">₹</span>
            <span className="price-amount">{formatPriceShort(property.price)}</span>
          </div>
          <Link to={`/property/${createSlug(property.title, property.location)}`} className="view-details-btn" id="view-details-btn">
            View Details
          </Link>
        </div>

        <div className="property-features">
          <span className="feature-pill">📏 {property.area} sq ft</span>
          <span className="feature-pill">🛏 {property.bedrooms}</span>
          <span className="feature-pill">🚿 {property.bathrooms}</span>
        </div>
      </div>

    </div>
  );
};

export default PropertyCard;