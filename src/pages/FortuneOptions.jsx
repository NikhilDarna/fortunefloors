import React, { useRef } from "react";
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

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (direction === "left") current.scrollBy({ left: -400, behavior: "smooth" });
    else current.scrollBy({ left: 400, behavior: "smooth" });
  };

  return (
    <section className="fortune-options-section">
      <h2 className="fortune-options-title">
        GET STARTED WITH EXPLORING REAL ESTATE OPTIONS
      </h2>

      <button className="carousel-btn left" onClick={() => scroll("left")}>‹</button>

      <div className="fortune-carousel" ref={scrollRef}>
        {cities.map((city, index) => (
          <div className="fortune-card" key={index}>
            <img src={city.image} alt={city.name} className="fortune-image" />
            <p className="fortune-text">{city.name}</p>
          </div>
        ))}
      </div>

      <button className="carousel-btn right" onClick={() => scroll("right")}>›</button>
    </section>
  );
};

export default FortuneOptions;
