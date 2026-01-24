// src/components/wishlistcontext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist on login
  useEffect(() => {
    if (currentUser) {
      const stored = localStorage.getItem(`wishlist_${currentUser.uid}`);
      setWishlist(stored ? JSON.parse(stored) : []);
    } else {
      setWishlist([]);
    }
  }, [currentUser]);

  // Save wishlist on change
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        `wishlist_${currentUser.uid}`,
        JSON.stringify(wishlist)
      );
    }
  }, [wishlist, currentUser]);

  // Add
  const addToWishlist = (property) => {
    setWishlist((prev) => {
      if (prev.some((item) => item.id === property.id)) return prev;
      return [...prev, property];
    });
  };

  // Remove
  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  // Check
  const isInWishlist = (id) => {
    return wishlist.some((item) => item.id === id);
  };

  // ⭐ TOGGLE (IMPORTANT)
  const toggleWishlist = (property) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === property.id);
      return exists
        ? prev.filter((item) => item.id !== property.id)
        : [...prev, property];
    });
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
