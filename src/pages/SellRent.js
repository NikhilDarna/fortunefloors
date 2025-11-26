import React from "react";
import sellrent1 from "../assets/brochers/sell-rent/sell-rent1.jpg";
import sellrent2 from "../assets/brochers/sell-rent/sell-rent2.jpg";
import sellrent3 from "../assets/brochers/sell-rent/sell-rent3.jpg";
import sellrent4 from "../assets/brochers/sell-rent/sell-rent4.jpg";
import image1 from "../assets/1.jpg";
import image from "../assets/hero-sellrent.jpg"; // ✅ Replace with your main hero image

const SellRent = () => {
  const articles = [
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
      title: "Keep Your Property in Perfect Shape.",
      desc: "Easy maintenance habits to avoid costly repairs and protect your property’s value.",
      img: sellrent3,
    },
    {
      title: "Master the Art of Property Negotiation.",
      desc: "Proven techniques to close deals confidently — whether selling or renting.",
      img: sellrent4,
    },
  ];

  return (
    <>
      {/* 🧩 Hero Section */}
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
            style={{
              width: "100%",
              maxWidth: "320px",
              borderRadius: "10px",
            }}
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

      {/* 📰 Articles Section */}
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
            Explore strategies, ideas, and expert advice to manage your property
            more efficiently and profitably.
          </p>
        </div>

        {/* Right Section */}
        <div className="articles-grid-sellrent">
          {articles.map((article, index) => (
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
                  src={article.img}
                  alt={article.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
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

      {/* ✅ Responsive CSS */}
      <style>
        {`
          .articles-grid-sellrent {
            flex: 0 0 70%;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }

          @media (max-width: 900px) {
            .articles-section-sellrent {
              flex-direction: column;
              align-items: center;
              text-align: center;
              width: 95%;
              padding: 20px;
            }

            .articles-section-sellrent > div:first-child {
              flex: none;
              padding: 0 0 20px;
            }

            .articles-grid-sellrent {
              grid-template-columns: repeat(2, 1fr);
              width: 100%;
            }
          }

          @media (max-width: 700px) {
            .articles-grid-sellrent {
              grid-template-columns: 1fr;
              width: 100%;
            }

            .article-card-sellrent {
              flex-direction: row;
              width: 100%;
            }
          }
        `}
      </style>
    </>
  );
};

export default SellRent;
