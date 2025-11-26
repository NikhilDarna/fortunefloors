import React from "react";
import PropertyCard from "../components/PropertyCard";
import { useWishlist } from "../components/wishlistcontext";
import "../components/PropertyCard.css"; 
import "./WishlistPage.css";


const WishlistPage = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="wishlist-page" style={{ padding: "40px 20px" }}>
      <h1 className="wishlist-title text-center mb-4">❤️ My Wishlist</h1>

      {wishlist.length === 0 ? (
        <p className="text-center text-muted">No properties in your wishlist yet.</p>
      ) : (
        <div className="property-grid">
          {wishlist.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
