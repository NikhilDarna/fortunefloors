import React, { useEffect, useRef, useState } from "react";
import "./interiors.css";
import InteriorCard from "../components/InteriorCard"; // ✅ FIXED PATH
import { useAuth } from "../context/AuthContext";
import ad1 from "../assets/ad4.png";

const Interiors = () => {
  const { user } = useAuth();
  const sliderRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [interiors, setInteriors] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===== HANDLE RESIZE ===== */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ===== FETCH INTERIORS ===== */
  useEffect(() => {
    fetchInteriors();
  }, []);

  const fetchInteriors = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/interiors`
      );

      if (response.ok) {
        const data = await response.json();
        setInteriors(data);
      } else {
        console.error("Failed to fetch interiors");
      }
    } catch (error) {
      console.error("Error fetching interiors:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ===== AUTO SCROLL ===== */
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

  return (
    <div className="popular-main-container">
      {/* LEFT SECTION */}
      <div className="popular-left">
        <div className="popular-header">
          <h2>Interior Designers</h2>
          <a href="/interiors" className="see-all">
            See All
          </a>
        </div>

        <div className="scroll-wrapper">
          <div className="popular-scroller" ref={sliderRef}>
            {loading ? (
              <div className="loading">Loading interior services...</div>
            ) : interiors.length === 0 ? (
              <div className="no-properties">
                <h3>No interior services found</h3>
                <p>Check back later for new listings</p>
              </div>
            ) : (
              interiors.map((interior) => (
                <div className="popular-card" key={interior.id}>
                  <InteriorCard interior={interior} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* RIGHT AD (DESKTOP ONLY) */}
      {!isMobile && (
        <div className="popular-right-ad">
          <img src={ad1} alt="Advertisement" />
        </div>
      )}
    </div>
  );
};

export default Interiors;
