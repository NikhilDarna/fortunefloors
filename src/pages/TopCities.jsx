import React from "react";
import "./TopCities.css";
import Delhi from "../assets/cities/delhi.jpg";
import Bangalore from "../assets/cities/banglore.jpg";
import Pune from "../assets/cities/pune.jpg";
import chennai from "../assets/cities/chennai.jpg";
import mumbhai from "../assets/cities/mumbhai.jpg";
import hyderabad from "../assets/cities/hyderabad.jpg";
import kolkatha from "../assets/cities/kolkatha.jpg";
import Ahmedabad from "../assets/cities/ahmedhabad.jpg";


const cities = [
   {
    name: "Hyderabad",
    properties: "26,000+ Properties",
    image: hyderabad,
  },
    {
    name: "Delhi / NCR",
    properties: "169,000+ Properties",
    image: Delhi,
  },
  {
    name: "Bangalore",
    properties: "47,000+ Properties",
    image: Bangalore,
  },
  {
    name: "Pune",
    properties: "37,000+ Properties",
    image: Pune,
  },
  {
    name: "Chennai",
    properties: "36,000+ Properties",
    image: chennai,
  },
  {
    name: "Mumbai",
    properties: "39,000+ Properties",
    image: mumbhai,
  },
  {
    name: "Kolkata",
    properties: "31,000+ Properties",
    image: kolkatha,
  },
  {
    name: "Ahmedabad",
    properties: "22,000+ Properties",
    image: Ahmedabad,
  },
];

const TopCities = () => {
  return (
    <section className="top-cities-section">
      <h4 className="topcities">Top Cities</h4>
      <h2 className="top-cities-title">
        Explore Real Estate in Popular Indian Cities
      </h2>

      <div className="top-cities-row">
        {cities.map((city, index) => (
          <div className="city-card" key={index}>
            <img src={city.image} alt={city.name} className="city-image" />
            <div className="city-info">
              <h3>{city.name}</h3>
              <p>{city.properties}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopCities;
