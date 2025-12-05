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

  // ---------------------------------------------------
  // 1️⃣ CHECK GOOGLE SESSION
  // ---------------------------------------------------
  useEffect(() => {
    fetch("http://localhost:5000/auth/user", {
      credentials: "include", // IMPORTANT
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn) {
          setUser(data.user);
          setToken(null); // Google login does not use JWT
          setLoading(false);
        } else {
          checkLocalToken(); // fallback to normal login
        }
      })
      .catch(() => checkLocalToken());
  }, []);

  // ---------------------------------------------------
  // 2️⃣ JWT Normal Login (Fallback)
  // ---------------------------------------------------
  const checkLocalToken = () => {
    try {
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userData = JSON.parse(localStorage.getItem("user"));

        if (payload.exp * 1000 > Date.now() && userData) {
          setUser(userData);
        } else {
          logout();
        }
      }
    } catch (error) {
      console.error("Invalid token", error);
      logout();
    }
    setLoading(false);
  };

  // ---------------------------------------------------
  // 3️⃣ JWT Login Handler
  // ---------------------------------------------------
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(token);
    setUser(userData);
  };

  // ---------------------------------------------------
  // 4️⃣ Logout (Google + JWT)
  // ---------------------------------------------------
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);

    // clear google session in backend
    fetch("http://localhost:5000/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
