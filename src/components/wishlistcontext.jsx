import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user, token } = useAuth(); // from AuthContext
  const [wishlist, setWishlist] = useState([]);

  // ✅ Base API URL (fallback to localhost)
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ✅ Load wishlist for the logged-in user
  useEffect(() => {
    if (token) {
      axios
        .get(`${baseUrl}/api/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setWishlist(res.data || []))
        .catch((err) => {
          console.error("❌ Error fetching wishlist:", err);
          setWishlist([]);
        });
    } else {
      setWishlist([]);
    }
  }, [token]);

  // ✅ Add or remove property from wishlist (per user)
  const toggleWishlist = async (property) => {
    if (!token) {
      alert("Please log in to use the wishlist feature.");
      return;
    }

    try {
      const isWishlisted = wishlist.some((item) => item.id === property.id);

      if (isWishlisted) {
        // 🗑 Remove from wishlist
        await axios.delete(`${baseUrl}/api/wishlist/${property.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setWishlist((prev) => prev.filter((item) => item.id !== property.id));
      } else {
        // ❤️ Add to wishlist (✅ fixed endpoint)
        const res = await axios.post(
          `${baseUrl}/api/wishlist/${property.id}`,
          {}, // backend expects param, not body
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Add only if backend returns property info
        setWishlist((prev) => [...prev, { id: property.id, ...res.data }]);
      }
    } catch (error) {
      console.error("❌ Error toggling wishlist:", error);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
