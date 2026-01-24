import React, { useEffect, useRef, useState } from "react";
import "./FeaturedCarousel.css";
import PropertyCard from "../components/PropertyCard";
import ad1 from "../assets/ad2.png";

const FeaturedSection = ({ properties = [] }) => {
  const sliderRef = useRef(null);
  const animationRef = useRef(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Resize detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Smooth auto-scroll
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const autoScroll = () => {
      if (!isPaused && !isDragging) {
        slider.scrollLeft += 0.6;

        if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth) {
          slider.scrollLeft = 0;
        }
      }
      animationRef.current = requestAnimationFrame(autoScroll);
    };

    animationRef.current = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPaused, isDragging]);
useEffect(() => {
  if (sliderRef.current) {
    sliderRef.current.scrollLeft = 0;
  }
}, [properties]);

  // Drag logic
  const handleMouseDown = (e) => {
    setIsDragging(true);
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const scroll = (direction) => {
    sliderRef.current.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <div className="popular-main-container">
      {/* LEFT */}
      <div className="popular-left">
        <div className="popular-header">
          <h2>Popular Properties</h2>
          <a href="/all-properties" className="see-all">
            See All
          </a>
        </div>

        <div className="scroll-wrapper">
          

          <div
              className="popular-scroller"
              ref={sliderRef}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => {
                setIsPaused(false);
                handleMouseUp();
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >

            {properties.map((property, index) => (
              <div className="popular-card" key={index}>
                <PropertyCard property={property} />
              </div>
            ))}
          </div>

          
        </div>
      </div>

      {/* RIGHT AD */}
      {!isMobile && (
        <div className="popular-right-ad">
          <div className="ad-wrapper">
            <img src={ad1} alt="Property Expo" />
          </div>
        </div>

      )}
    </div>
  );
};

export default FeaturedSection;
