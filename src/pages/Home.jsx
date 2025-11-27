import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import PropertyCard from '../components/PropertyCard';
import PropertyFilters from '../components/PropertyFilters';
import TopCities from "./TopCities";
import WhyChooseUs from "./WhyChooseUs";
import Testimonials from "./Testimonials";
import PgArticle from "./pg_article.jsx";
import FortuneOptions  from "./FortuneOptions.jsx";
import { useLocation } from "react-router-dom";


import './home.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ad1 from "../assets/ad1.png";
import image from "../assets/mainimage.png";
import image1 from "../assets/1.jpg";

import acers from "../assets/brochers/acers.jpg";
import acers1 from "../assets/brochers/acres1.jpeg";
import acers2 from "../assets/brochers/acres2.jpeg";
import acers3 from "../assets/brochers/acres3.jpeg";


import sellrent1 from "../assets/brochers/sell-rent/sell-rent1.jpg";
import sellrent2 from "../assets/brochers/sell-rent/sell-rent2.jpg";
import sellrent3 from "../assets/brochers/sell-rent/sell-rent3.jpg";
import sellrent4 from "../assets/brochers/sell-rent/sell-rent4.jpg";

import buysell from "../assets/brochers/buysell/buysell.avif";
import buysell1 from "../assets/brochers/buysell/buysell1.webp";
import buysell2 from "../assets/brochers/buysell/buysell2.png";
import buysell3 from "../assets/brochers/buysell/buysell3.jpg";
import buysell4 from "../assets/brochers/buysell/buysell4.webp";

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState('all');
  const [filters, setFilters] = useState({ location: '', minPrice: '', maxPrice: '' });

  // Area Converter
  const [areaValue, setAreaValue] = useState('');
  const [fromUnit, setFromUnit] = useState('sq_meter');
  const [toUnit, setToUnit] = useState('sq_foot');
  const [convertedResult, setConvertedResult] = useState('');

  // Loan Calculator
  const [loanAmount, setLoanAmount] = useState('');
  const [loanRate, setLoanRate] = useState('');
  const [loanTime, setLoanTime] = useState('');
  const [loanResult, setLoanResult] = useState(null);
  const locationHook = useLocation();

  const conversionRates = {
    acre: 4046.8564224,
    sq_meter: 1,
    sq_kilometer: 1e6,
    sq_mile: 2.59e6,
    sq_yard: 0.83612736,
    sq_foot: 0.09290304,
    sq_inch: 0.00064516,
    hectare: 10000,
  };

  // 🔹 Fetch properties on load or filter/type change
useEffect(() => {
  fetchProperties();
}, [activeType, filters]);

const fetchProperties = async () => {
  try {
    setLoading(true);
    const queryParams = new URLSearchParams({ type: activeType, ...filters });
    const response = await fetch(`http://localhost:5000/api/properties?${queryParams}`);
    const data = await response.json();
    setProperties(data);
    setFilteredProperties(data);
  } catch (error) {
    console.error("Error fetching properties:", error);
  } finally {
    setLoading(false);
  }
};

// 🔹 Detect if a filter comes from Navbar (query string)
useEffect(() => {
  const params = new URLSearchParams(locationHook.search);
  const filterType = params.get("filter");
  const value = params.get("value");
  if (filterType && value) {
    applyNavbarFilter(filterType, value);
  }
}, [locationHook]);

// 🔹 Apply filters from Navbar (budget or location/type)
const applyNavbarFilter = (filterType, value) => {
  let filtered = [...properties];

  if (filterType === "budget") {
    let min = 0,
      max = Infinity;

    // Convert to pure numbers (your database uses digits)
    if (value === "Under 3000000") {
      max = 3000000;
    } else if (value === "3000000-5000000") {
      min = 3000000;
      max = 5000000;
    } else if (value === "5000000-10000000") {
      min = 5000000;
      max = 10000000;
    } else if (value === "Above 10000000") {
      min = 10000000;
    }

    filtered = properties.filter((p) => p.price >= min && p.price <= max);
  }

  if (filterType === "location") {
    const city = value.toLowerCase();
    filtered = properties.filter((p) => p.location.toLowerCase().includes(city));
  }

  if (filterType === "type") {
    const propType = value.toLowerCase();
    filtered = properties.filter((p) => p.type.toLowerCase().includes(propType));
  }

  setFilteredProperties(filtered);
};
  
  const handleTypeChange = (type) => setActiveType(type);
  const handleFilterChange = (newFilters) => setFilters(newFilters);

  // Area Converter
  const convertArea = () => {
    const value = parseFloat(areaValue);
    if (isNaN(value) || value <= 0) {
      setConvertedResult('⚠️ Please enter a valid positive number.');
      return;
    }
    const convertedValue = (value * conversionRates[fromUnit]) / conversionRates[toUnit];
    setConvertedResult(`${value} ${fromUnit.replace('_',' ')} = ${convertedValue.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${toUnit.replace('_',' ')}`);
  };

  // Loan Calculator
  const calculateLoan = () => {
    const P = parseFloat(loanAmount);
    const R = parseFloat(loanRate) / 12 / 100;
    const N = parseFloat(loanTime) * 12;
    if (isNaN(P) || isNaN(R) || isNaN(N) || P <= 0 || R < 0 || N <= 0) {
      setLoanResult(null);
      return;
    }
    const EMI = (P * R * Math.pow(1+R, N)) / (Math.pow(1+R, N)-1);
    const totalPayment = EMI * N;
    const totalInterest = totalPayment - P;
    setLoanResult({ EMI, totalInterest, totalPayment });
  };

  // Carousel Settings
  const carouselSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    pauseOnHover: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } }
    ]
  };

  // 📰 Articles Section Data
  const articles = [
    {
      title: "Why do flat prices in the same locality vary?",
      date: "Oct 16, 2025",
      img: "https://via.placeholder.com/500x250.png?text=Flat+Prices",
    },
    {
      title: "The Noida Metro effect on property rates",
      date: "Oct 10, 2025",
      img: "https://via.placeholder.com/500x250.png?text=Noida+Metro",
    },
    {
      title: "How electricity bill affects cost of living?",
      date: "Sep 16, 2025",
      img: "", // no image (should keep space)
    },
    {
      title: "What’s Driving Sector 50, Noida Rates Up?",
      date: "Sep 12, 2025",
      img: "https://via.placeholder.com/500x250.png?text=Noida+Rates",
    },
    {
      title: "Top tips for first-time property sellers",
      date: "Aug 25, 2025",
      img: "", // fallback
    },
  ];

  const handleImageError = (e) => {
    e.target.src =
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='500' height='250'>
          <rect width='500' height='250' fill='#e0e0e0'/>
          <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='18' fill='#555'>
            No Image Available
          </text>
        </svg>`
      );
  };

  return (
    <div className="home">
       {/* 🏡 Your Existing Hero */}
       
      <div  className="hero-section">
        <div className="hero-content">
          <h1>Find Your Dream Property</h1>
          <p>Discover the best real estate deals in your area</p>
        </div>
      </div>

      <div className="container">
        {/* 🏷️ Property Type Buttons */}
        <div className="container1">
          <div className="property-types">
          {["Dream Properties", "sale", "rent", "plot",  "pg"].map((type) => (
            <button
              key={type}
              className={`type-btn ${activeType === type ? "active" : ""}`}
              onClick={() => handleTypeChange(type)}
            >
              {type === "all"
                ? "All Properties"
                : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
          </div>
          {/* 🔹 Filters */}
          <PropertyFilters onFilterChange={handleFilterChange} />
        </div>
        

        
        
        <FortuneOptions/>
        
        {/* 🏡 Featured Properties with Side Ads */}
        <div className="featured-section-with-ads">
          <div className="main-properties">
            <div className="properties-section-header">
              <h2>Featured Properties</h2>
              <Link to="/all-properties" className="see-all-btn">See All</Link>
            </div>

            {loading ? (
              <div className="loading">Loading properties...</div>
            ) : filteredProperties.length === 0 ? (
              <div className="no-properties">No properties found.</div>
            ) : (
              <Slider {...carouselSettings}>
                {filteredProperties.map((property) => (
                  <div key={property.id}>
                    <PropertyCard property={property} />
                  </div>
                ))}
              </Slider>
            )}
          </div>

          <div className="ad-space right-ad">
            <img src={ad1} alt="Ad Right" />
          </div>
        </div>

        {/* 🧩 Sell or Rent Section */}
          <div
            className="hero-section-sellrent"
            style={{
              position: "relative",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-around",
              padding: "30px 20px 50px",
              backgroundColor: "#fff",
              margin: "40px auto 0",
              width: "90%",
              maxWidth: "1100px",
              zIndex: 2,
            }}
          >
            <div style={{ flex: "1 1 300px", textAlign: "center" }}>
              <img
                src={image}
                alt="Hero Visual"
                style={{ width: "100%", maxWidth: "320px", borderRadius: "10px" }}
              />
            </div>

            <div style={{ flex: "1 1 400px", padding: "20px 40px" }}>
              <h2 style={{ color: "#1d3557", fontSize: "28px", fontWeight: "700" }}>
                Sell or rent faster at the right price!
              </h2>
              <p style={{ fontSize: "16px", marginBottom: "20px" }}>
                List your property now
              </p>
              <button
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  padding: "12px 22px",
                  fontSize: "16px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
                onClick={() => {
                  alert("Post Property clicked!");
                  window.location.href = "/post-property";
                }}
              >
                Post Property, It’s FREE
              </button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "15px",
                  fontSize: "15px",
                }}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                  alt="WhatsApp"
                  style={{ width: "22px", height: "22px" }}
                />
                <span style={{ color: "#075e54", fontWeight: "500" }}>
                  Post via WhatsApp →
                </span>
              </div>
            </div>
          </div>

          {/* 📰 Articles Section - Sell or Rent */}
          <div
            className="articles-section-sellrent"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "stretch",
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              padding: "20px",
              margin: "-65px auto 60px",
              width: "90%",
              maxWidth: "1100px",
              position: "relative",
              zIndex: 3,
            }}
          >
            {/* Left Section */}
            <div
              style={{
                flex: "0 0 30%",
                minWidth: "280px",
                paddingRight: "30px",
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <h2
                style={{
                  color: "#1d3557",
                  fontWeight: "700",
                  fontSize: "26px",
                  marginBottom: "10px",
                }}
              >
                Articles & Insights for Smart Homeowners
              </h2>
              <p style={{ color: "#555", fontSize: "15px", lineHeight: "1.6" }}>
                Explore strategies, ideas, and expert advice to manage your property more
                efficiently and profitably.
              </p>
            </div>

            {/* Right Section */}
            <div className="articles-grid-sellrent">
              {[
                {
                  title: "Upgrade Your Home, Upgrade Its Worth.",
                  desc: "Learn which renovations give the best returns before you sell or rent your property.",
                  img: sellrent1,
                },
                {
                  title: "Stay Ahead on Property Taxes.",
                  desc: "Know the latest tax updates and save more through smart, legal planning.",
                  img: sellrent2,
                },
                {
                  title: "Keep Your Property in Perfect Shape",
                  desc: "Easy maintenance habits to avoid costly repairs and protect your property’s value.",
                  img: sellrent3,
                },
                {
                  title: "Master the Art of Property Negotiation",
                  desc: "Proven techniques to close deals confidently — whether selling or renting.",
                  img: sellrent4,
                },
              ].map((article, index) => (
                <div
                  key={index}
                  className="article-card-sellrent"
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    background: "#f9f9f9",
                    borderRadius: "10px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                    padding: "12px 16px",
                    gap: "10px",
                    transition: "transform 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateY(-3px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                  }
                >
                  <div
                    style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      flexShrink: 0,
                      background: "#e0e0e0",
                    }}
                  >
                    <img
                      src={
                        article.img ||
                        "https://via.placeholder.com/70x70.png?text=No+Image"
                      }
                      alt={article.title}
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/70x70.png?text=No+Image")
                      }
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <h4
                      style={{
                        color: "#1d3557",
                        fontSize: "15px",
                        fontWeight: "600",
                        marginBottom: "4px",
                      }}
                    >
                      {article.title}
                    </h4>
                    <p
                      style={{
                        color: "#555",
                        fontSize: "13px",
                        lineHeight: "1.4",
                        margin: 0,
                      }}
                    >
                      {article.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

         {/* 🏠 Popular Properties with Side Ads */}
        <div className="featured-section-with-ads">
          <div className="main-properties">
            <div className="properties-section-header">
              <h2>Popular Properties</h2>
              <Link to="/all-properties" className="see-all-btn">See All</Link>
            </div>

            {loading ? (
              <div className="loading">Loading properties...</div>
            ) : filteredProperties.length === 0 ? (
              <div className="no-properties">No properties found.</div>
            ) : (
              <Slider {...carouselSettings}>
                {filteredProperties.map((property) => (
                  <div key={property.id}>
                    <PropertyCard property={property} />
                  </div>
                ))}
              </Slider>
            )}
          </div>

          <div className="ad-space right-ad">
            <img src={ad1} alt="Ad Right" />
          </div>
        </div>
        
       
       <PgArticle/>

        {/* 💡 Features Section (Converter, Loan Calculator, etc.) */}
        <div className="hero-section-99acres">
            <div className="features-section">
              <div className="feature-card">
                <h2>Add Your Property</h2>
                <p>Easily list your property with location, type, size, price, and photos.</p>
                <Link to="/post-property"><button className="add-btn">Add New Property</button></Link>
              </div>

              <div className="feature-card">
                <h2>🌍 Area Converter</h2>
                <p>Instantly convert between acres, hectares, and square meters.</p>
                <input type="number" placeholder="Enter value" value={areaValue} onChange={(e) => setAreaValue(e.target.value)} />
                <div>
                  <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
                    {Object.keys(conversionRates).map(unit => (
                      <option key={unit} value={unit}>{unit.replace('_',' ')}</option>
                    ))}
                  </select>
                  <span>⇌</span>
                  <select value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
                    {Object.keys(conversionRates).map(unit => (
                      <option key={unit} value={unit}>{unit.replace('_',' ')}</option>
                    ))}
                  </select>
                </div>
                <button onClick={convertArea}>Convert</button>
                {convertedResult && <p className={convertedResult.includes('⚠️') ? 'error' : 'success'}>{convertedResult}</p>}
              </div>

              <div className="feature-card">
                <h2>🏦 Loan Calculator</h2>
                <p>Calculate EMI, total interest, and total payment.</p>
                <input type="number" placeholder="Loan Amount (₹)" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} />
                <input type="number" placeholder="Annual Interest Rate (%)" value={loanRate} onChange={(e) => setLoanRate(e.target.value)} />
                <input type="number" placeholder="Tenure (years)" value={loanTime} onChange={(e) => setLoanTime(e.target.value)} />
                <button onClick={calculateLoan}>Calculate</button>
                {loanResult && (
                  <div>
                    <p>EMI: ₹{loanResult.EMI.toFixed(2)}</p>
                    <p>Total Interest: ₹{loanResult.totalInterest.toFixed(2)}</p>
                    <p>Total Payment: ₹{loanResult.totalPayment.toFixed(2)}</p>
                  </div>
                )}
              </div>
            </div>
        </div>
        

         {/* 🧩 find buy own */}
        <div
          className="hero-section-99acres"
          style={{
            position: "relative",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-around",
            padding: "30px 20px 50px",
            backgroundColor: "#fff",
            margin: "40px auto 0",
            width: "90%",
            maxWidth: "1100px",
            zIndex: 2,
          }}
        >
          {/* Left Image */}
          <div style={{ flex: "1 1 300px", textAlign: "center" }}>
            <img
              src={buysell}
              alt="Hero Visual"
              style={{
                width: "100%",
                maxWidth: "320px",
                borderRadius: "10px",
              }}
            />
          </div>

          {/* Right Content */}
          <div style={{ flex: "1 1 400px", padding: "20px 40px" }}>
            <h6
              style={{
                color: "#4C5056FF",
                fontSize: "28px",
                fontWeight: "700",
              }}
            >
              BUY A HOME
            </h6>
            <h2
              style={{
                color: "#1d3557",
                fontSize: "28px",
                fontWeight: "700",
              }}
            >
              Find, Buy & Own Your Dream Home
            </h2>
            <p style={{ fontSize: "16px", marginBottom: "20px" }}>
              Explore top apartments, villas, and builder floors to make your home-buying journey easy.
            </p>
            <button
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                padding: "12px 22px",
                fontSize: "16px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
              onClick={() => alert("Explore Buying clicked!")}
            >
              Explore Buying
            </button>
          </div>
        </div>

        {/* 📰 Articles Section find buy own */}
        <div
          className="articles-section"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "stretch",
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            padding: "20px 50px 50px 20px",
            margin: "-65px auto 60px",
            width: "85%",
            maxWidth: "1100px",
            position: "relative",
            zIndex: 3,
          }}
        >
          {/* Left Section */}
          <div
            className="articles-left"
            style={{
              flex: "0 0 30%",
              minWidth: "280px",
              paddingRight: "30px",
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h2
              style={{
                color: "#1d3557",
                fontWeight: "700",
                fontSize: "26px",
                marginBottom: "10px",
              }}
            >
              Top articles on home buying
            </h2>
            <p style={{ color: "#555", fontSize: "15px", lineHeight: "1.6" }}>
              Read from Beginners check-list to Pro Tips
            </p>
          </div>

          {/* Right Section */}
          <div
            className="articles-right"
            style={{
              flex: "0 0 70%",
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gridTemplateRows: "repeat(2, auto)",
              gap: "20px",
              alignItems: "stretch",
            }}
          >
            {[
              {
                title: "Top home-buying tips for first-time buyers",
                desc: "Learn how to budget smartly, choose the right location, and understand property agreements before buying.",
                img: buysell1,
              },
              {
                title: "Real estate trends shaping home prices in 2025",
                desc: "Explore how market demand, infrastructure, and government policies will impact property values this year.",
                img: buysell2,
              },
              {
                title: "Essential documents to check before buying a home",
                desc: "From sale deeds to occupancy certificates — know the paperwork required for a safe purchase.",
                img: buysell3,
              },
              {
                title: "Smart financing options for your dream home",
                desc: "Compare home loans, EMIs, and government schemes to find the best way to finance your property.",
                img: buysell4,
              },
            ].map((article, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  background: "#f9f9f9",
                  borderRadius: "10px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                  padding: "12px 16px",
                  gap: "10px",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.08)";
                }}
              >
                {/* Left Small Image */}
                <div
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    flexShrink: 0,
                    background: "#e0e0e0",
                  }}
                >
                  <img
                    src={
                      article.img ||
                      "https://via.placeholder.com/70x70.png?text=No+Image"
                    }
                    alt={article.title}
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/70x70.png?text=No+Image")
                    }
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                {/* Right Title + Description */}
                <div style={{ flex: 1 }}>
                  <h4
                    style={{
                      color: "#1d3557",
                      fontSize: "15px",
                      fontWeight: "600",
                      marginBottom: "4px",
                    }}
                  >
                    {article.title}
                  </h4>
                  <p
                    style={{
                      color: "#555",
                      fontSize: "13px",
                      lineHeight: "1.4",
                      margin: 0,
                    }}
                  >
                    {article.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <TopCities />
        
         {/* 🧩 BUY PLOTS/LAND Residential & Commercial Plots/Land */}
          <div
            className="hero-section-99acres"
            style={{
              position: "relative",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-around",
              padding: "30px 20px 50px",
              backgroundColor: "#fff",
              margin: "40px auto 0",
              width: "90%",
              maxWidth: "1100px",
              zIndex: 2,
            }}
          >
            {/* Left Image */}
            <div style={{ flex: "1 1 400px", textAlign: "center" }}>
              <img
                src={acers}
                alt="Hero Visual"
                style={{
                  width: "100%",
                  maxWidth: "320px",
                  borderRadius: "10px",
                }}
              />
            </div>

            {/* Right Content */}
            <div style={{ flex: "1 1 400px", padding: "20px 40px" }}>
              <h6
                style={{
                  color: "#4C5056FF",
                  fontSize: "28px",
                  fontWeight: "700",
                }}
              >
                BUY PLOTS/LAND
              </h6>
              <h2
                style={{
                  color: "#1d3557",
                  fontSize: "28px",
                  fontWeight: "700",
                }}
              >
                Residential & Commercial Plots/Land
              </h2>
              <p style={{ fontSize: "16px", marginBottom: "20px" }}>
                Explore Residential, Agricultural, Industrial and Commercial Plots/Land
              </p>
              <button
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  padding: "12px 22px",
                  fontSize: "16px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
                onClick={() => alert("Explore Plots/Land clicked!")}
              >
                Explore Plots & Land
              </button>
            </div>
          </div>

          {/* 📰 Articles Section BUY PLOTS/LAND Residential & Commercial Plots/Land */}
          <div
            className="articles-section"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "stretch",
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              padding: "20px 50px 20px 20px",
              margin: "-65px auto 60px",
              width: "85%",
              maxWidth: "1100px",
              position: "relative",
              zIndex: 3,
            }}
          >
            {/* Left Section */}
            <div
              className="articles-left"
              style={{
                flex: "0 0 30%",
                minWidth: "280px",
                paddingRight: "30px",
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <h2
                style={{
                  color: "#1d3557",
                  fontWeight: "700",
                  fontSize: "26px",
                  marginBottom: "10px",
                }}
              >
                Smart Guides for Buying Plots & Land
              </h2>
              <p style={{ color: "#555", fontSize: "15px", lineHeight: "1.6" }}>
                Expert insights, beginner tips, and essential checklists for safe and profitable land investments.
              </p>
            </div>

            {/* Right Section */}
            <div
              className="articles-right"
              style={{
                flex: "0 0 70%",
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gridTemplateRows: "repeat(2, auto)",
                gap: "20px",
                alignItems: "stretch",
              }}
            >
              {[
                {
                  title: "How to evaluate a plot before you buy",
                  desc: "Key checks for soil, topography, zoning, utilities and access to help you make a safe purchase.",
                  img: acers1,
                },
                {
                  title: "Top land investment trends in 2025",
                  desc: "Discover growth corridors, infrastructure-led value upticks and emerging opportunities for plot investors.",
                  img: acers2,
                },
                {
                  title: "Essential documents for buying or selling land",
                  desc: "A clear checklist of title deeds, encumbrance certificates, NOC, tax receipts and conversion records you must verify.",
                  img: acers3,
                },
                {
                  title: "Due diligence & finding reliable brokers",
                  desc: "Practical steps to verify sellers, check liabilities and choose trustworthy agents for a secure transaction.",
                  img: acers,
                },
              ].map((article, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    background: "#f9f9f9",
                    borderRadius: "10px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                    padding: "12px 16px",
                    gap: "10px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.08)";
                  }}
                >
                  {/* Left Small Image */}
                  <div
                    style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      flexShrink: 0,
                      background: "#e0e0e0",
                    }}
                  >
                    <img
                      src={
                        article.img ||
                        "https://via.placeholder.com/70x70.png?text=No+Image"
                      }
                      alt={article.title}
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/70x70.png?text=No+Image")
                      }
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  {/* Right Title + Description */}
                  <div style={{ flex: 1 }}>
                    <h4
                      style={{
                        color: "#1d3557",
                        fontSize: "15px",
                        fontWeight: "600",
                        marginBottom: "4px",
                      }}
                    >
                      {article.title}
                    </h4>
                    <p
                      style={{
                        color: "#555",
                        fontSize: "13px",
                        lineHeight: "1.4",
                        margin: 0,
                      }}
                    >
                      {article.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        
        <WhyChooseUs/>
        <Testimonials/>
      </div>
    </div>
  );
};

export default Home;
