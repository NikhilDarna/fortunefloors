import React, { useEffect, useRef, useState } from "react";
import "./BuilderProperty.css";
import PropertyCard from "../components/PropertyCard";

import ad1 from "../assets/ad1.png"; // RIGHT AD

const FeaturedSection = ({ properties = [], loading }) => {
  const sliderRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          <a href="/all-properties" className="see-all">See All</a>
        </div>

        <div className="scroll-wrapper">
          {!isMobile && (
            <button className="arrow-btn left" onClick={() => scroll("left")}>
              ‹
            </button>
          )}

          <div className="popular-scroller" ref={sliderRef}>
            {properties.map((property, index) => (
              <div className="popular-card" key={index}>
                <PropertyCard property={property} />
              </div>
            ))}
          </div>

          {!isMobile && (
            <button className="arrow-btn right" onClick={() => scroll("right")}>
              ›
            </button>
          )}
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
