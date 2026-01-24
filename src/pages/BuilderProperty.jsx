import React, { useEffect, useRef, useState } from "react";
import "./BuilderProperty.css";
import PropertyCard from "../components/PropertyCard";
import { useAuth } from "../context/AuthContext";

import ad1 from "../assets/ad4.png"; // RIGHT AD

const FeaturedSection = () => {
  const { user } = useAuth();
  const sliderRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchBuilderProperties();
  }, []);

  const fetchBuilderProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/builder-properties`);
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      } else {
        console.error("Failed to fetch builder properties");
      }
    } catch (error) {
      console.error("Error fetching builder properties:", error);
    } finally {
      setLoading(false);
    }
  };

  // Auto Scroll
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const interval = setInterval(() => {
      slider.scrollBy({
        left: isMobile ? 240 : 320,
        behavior: "smooth",
      });

      if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 5) {
        slider.scrollTo({ left: 0 });
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [isMobile]);

  const scroll = (direction) => {
    const slider = sliderRef.current;
    slider.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <div className="popular-main-container">

      {/* LEFT AREA */}
      <div className="popular-left">
        <div className="popular-header">
          <h2>Builder Properties</h2>
          <a href="/builder-properties" className="see-all">See All</a>
        </div>

        <div className="scroll-wrapper">
          

          <div className="popular-scroller" ref={sliderRef}>
            {loading ? (
              <div className="loading">Loading builder properties...</div>
            ) : properties.length === 0 ? (
              <div className="no-properties">
                <h3>No builder properties found</h3>
                <p>Check back later for new builder listings</p>
              </div>
            ) : (
              properties.map((property, index) => (
                <div className="popular-card" key={index}>
                  <PropertyCard property={property} />
                </div>
              ))
            )}
          </div>

          
        </div>
      </div>

      {/* RIGHT AD (Desktops Only) */}
      {!isMobile && (
        <div className="popular-right-ad">
          <img src={ad1} alt="Ad Banner" />
        </div>
      )}

    </div>
  );
};

export default FeaturedSection;