import React, { useRef, useEffect } from "react";
import "./FortuneOptions.css";

import Delhi from "../assets/brochers/pg/pg2.webp";
import SellRent from "../assets/mainimage.png";
import acers from "../assets/brochers/acers.jpg";
import Pg from "../assets/1.jpg";
import Mumbai from "../assets/cities/mumbhai.jpg";
import Buysell from "../assets/brochers/buysell/buysell.avif";
import Kolkata from "../assets/cities/kolkatha.jpg";

const cities = [
  { name: "Buying A Home", image: Buysell },
  { name: "Renting a Home", image: Delhi },
  { name: "Sell/Rent your property", image: SellRent },
  { name: "Plots/Land", image: acers },
  { name: "PG and co-living", image: Pg },
  { name: "Buying commercial spaces", image: Mumbai },
  { name: "Lease commercial spaces", image: Kolkata },
];

const FortuneOptions = () => {
  const scrollRef = useRef(null);

  // Mobile Auto Infinite Scroll
  useEffect(() => {
    const slider = scrollRef.current;

    if (!slider || window.innerWidth > 768) return;

    const autoScroll = setInterval(() => {
      if (!slider) return;

      slider.scrollBy({
        left: slider.offsetWidth / 2,
        behavior: "smooth",
      });

      // ⭐ Reset to the start to create infinite loop
      if (
        slider.scrollLeft + slider.offsetWidth >= slider.scrollWidth - 10
      ) {
        setTimeout(() => {
          slider.scrollTo({ left: 0, behavior: "instant" });
        }, 600);
      }
    }, 2500);

    return () => clearInterval(autoScroll);
  }, []);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -400 : 400,
      behavior: "smooth",
    });
  };

  return (
    <section className="fortune-options-section">
      <h2 className="fortune-options-title">
        GET STARTED WITH EXPLORING REAL ESTATE OPTIONS
      </h2>

      {/* Desktop arrows */}
      <button className="carousel-btn left desktop-only" onClick={() => scroll("left")}>
        ‹
      </button>

      <div className="fortune-carousel" ref={scrollRef}>
        {/* ⭐ Duplicate cards for infinite scroll */}
        {[...cities, ...cities].map((city, index) => (
          <div className="fortune-card" key={index}>
            <img src={city.image} alt={city.name} className="fortune-image" />
            <p className="fortune-text">{city.name}</p>
          </div>
        ))}
      </div>

      <button className="carousel-btn right desktop-only" onClick={() => scroll("right")}>
        ›
      </button>
    </section>
  );
};

export default FortuneOptions;
