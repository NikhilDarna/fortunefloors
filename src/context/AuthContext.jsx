import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        // ✅ Decode JWT payload
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userData = JSON.parse(localStorage.getItem("user"));

        // ✅ Validate token expiry and user data
        if (payload.exp * 1000 > Date.now() && userData) {
          setUser(userData);
        } else {
          logout();
        }
      } catch (error) {
        console.error("Invalid token, logging out...", error);
        logout();
      }
    } else {
      setUser(null);
    }

    setLoading(false);
  }, [token]);

  // ✅ Login and persist token + user info
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(token);
    setUser(userData);
  };

  // ✅ Logout and clear all
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  // ✅ Context value accessible in all components
  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
