// src/components/wishlistcontext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { currentUser } = useAuth(); // Get current user from AuthContext
  const [wishlist, setWishlist] = useState([]);

  // 🔹 Load wishlist when user logs in
  useEffect(() => {
    if (currentUser) {
      const stored = localStorage.getItem(`wishlist_${currentUser.uid}`);
      setWishlist(stored ? JSON.parse(stored) : []);
    } else {
      setWishlist([]); // Clear wishlist when user logs out
    }
  }, [currentUser]);

  // 🔹 Save wishlist whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`wishlist_${currentUser.uid}`, JSON.stringify(wishlist));
    }
  }, [wishlist, currentUser]);

  // 🔹 Add a property to wishlist
  const addToWishlist = (property) => {
    setWishlist((prev) => {
      if (prev.some((item) => item.id === property.id)) return prev; // Avoid duplicates
      return [...prev, property];
    });
  };

  // 🔹 Remove a property from wishlist
  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  // 🔹 Check if item is in wishlist (optional helper)
  const isInWishlist = (id) => {
    return wishlist.some((item) => item.id === id);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
