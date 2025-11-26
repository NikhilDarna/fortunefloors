import React from "react";
import { Link } from "react-router-dom";
import pg1 from "../assets/brochers/pg/pg1.jpg";
import pg2 from "../assets/brochers/pg/pg2.webp";
import pg3 from "../assets/brochers/pg/pg3.jpeg";
import pg4 from "../assets/brochers/pg/pg4.png";
import image1 from "../assets/1.jpg";

const PG = () => {
  const articles = [
    {
      title: "How to convert your home into a PG?",
      desc: "Learn how to evaluate your property and set a competitive price to sell fast.",
      img: pg1,
    },
    {
      title: "Top real estate trends in 2025",
      desc: "Stay updated with the latest property market trends and expert insights.",
      img: pg2,
    },
    {
      title: "Documents required for property sale",
      desc: "A complete checklist of papers you need when selling your property.",
      img: pg3,
    },
    {
      title: "Finding reliable tenants",
      desc: "Step-by-step tips for screening tenants and ensuring safe rentals.",
      img: pg4,
    },
  ];

  return (
    <>
      {/* 🧩 Hero Section */}
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
        <div style={{ flex: "1 1 300px", textAlign: "center" }}>
          <img
            src={image1}
            alt="Hero Visual"
            style={{ width: "100%", maxWidth: "320px", borderRadius: "10px" }}
          />
        </div>

        <div style={{ flex: "1 1 400px", padding: "20px 40px" }}>
          <h5 style={{ color: "#4C5056FF", fontSize: "28px", fontWeight: "700" }}>
            RENT A PG / CO-LIVING
          </h5>
          <h2 style={{ color: "#1d3557", fontSize: "28px", fontWeight: "700" }}>
            Paying Guest or Co-living options
          </h2>
          <p style={{ fontSize: "16px", marginBottom: "20px" }}>
            Explore shared and private rooms in all top cities of India
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
            onClick={() => alert("Explore PG/Co-Living clicked!")}
          >
            Explore PG/Co-Living
          </button>
        </div>
      </div>

      {/* 📰 Articles Section */}
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
            Best articles on PG / Co-living
          </h2>
          <p style={{ color: "#555", fontSize: "15px", lineHeight: "1.6" }}>
            Read from beginners’ checklist to pro-tips
          </p>
        </div>

        {/* Right Section */}
        <div className="articles-grid">
          {articles.map((article, index) => (
            <div
              key={index}
              className="article-card"
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
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
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
                  src={article.img}
                  alt={article.title}
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

      {/* ✅ Inline Responsive Styles */}
      <style>
        {`
          .articles-grid {
            flex: 0 0 70%;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }

          @media (max-width: 900px) {
            .articles-section {
              flex-direction: column;
              align-items: center;
              text-align: center;
              width: 95%;
              padding: 20px;
            }

            .articles-section > div:first-child {
              flex: none;
              padding: 0 0 20px;
            }

            .articles-grid {
              grid-template-columns: repeat(2, 1fr);
              width: 100%;
            }
          }

          @media (max-width: 700px) {
            .articles-grid {
              grid-template-columns: 1fr;
              width: 100%;
            }

            .article-card {
              flex-direction: row;
              width: 100%;
            }
          }
        `}
      </style>
    </>
  );
};

export default PG;
