import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaBriefcase,
  FaHome,
} from "react-icons/fa";
import "./PropertyDetails.css";

/* ================= HELPERS ================= */
const makeSlug = (title) =>
  title?.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const safeArray = (v) => {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === "string") return [v];
  return [];
};

/* ================= STAR ================= */
const buildStars = (rating = 4.5) =>
  "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));

/* ================= COMPONENT ================= */
export default function InteriorDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [interior, setInterior] = useState(null);
  const [img, setImg] = useState(0);
  const [tab, setTab] = useState("Overview");
  const [showPhone, setShowPhone] = useState(false);

  /* ================= FETCH INTERIOR ================= */
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/interiors`)
      .then((r) => r.json())
      .then((data) => {
        const found = data.find(
          (i) => makeSlug(i.title) === slug
        );
        setInterior(found || null);
      });
  }, [slug]);

  if (!interior) {
    return <div className="loading">Interior service not found</div>;
  }

  const photos = safeArray(interior.photos);
  const profession = safeArray(interior.profession);
  const projectType = safeArray(interior.projectType);
  const propertyServed = safeArray(interior.propertyServed);

  /* ================= UI ================= */
  return (
    <div className="mb-page">
      <div className="mb-content">
        <div className="mb-layout">

          {/* LEFT */}
          <div className="mb-left">
            <h1 className="mb-title">{interior.title}</h1>

            {/* HERO */}
            <div className="mb-hero">
              <img
                src={
                  photos[img]
                    ? `${import.meta.env.VITE_API_URL}/uploads/${photos[img]}`
                    : "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800"
                }
                className="mb-hero-img"
                alt={interior.title}
              />

              {photos.length > 1 && (
                <div className="mb-hero-thumbs">
                  {photos.map((p, i) => (
                    <img
                      key={i}
                      src={`${import.meta.env.VITE_API_URL}/uploads/${p}`}
                      className={img === i ? "active" : ""}
                      onClick={() => setImg(i)}
                      alt=""
                    />
                  ))}
                </div>
              )}
            </div>

            {/* MOBILE CARD */}
            <div className="mb-mobile-card">
              <div className="mb-price">
                Starting ₹ {interior.starting_price}
              </div>

              <button
                className="mb-btn-outline"
                onClick={() => {
                  if (!token) {
                    alert("Please login to contact");
                    navigate("/login");
                    return;
                  }
                  setShowPhone(true);
                }}
              >
                <FaPhoneAlt /> Contact
              </button>

              {showPhone && (
                <div className="mb-phone">
                  📞 +91 {interior.phone || "9876543210"}
                </div>
              )}
            </div>

            {/* ICON ROW */}
            <div className="mb-icon-row">
              <div>
                <FaBriefcase /> {interior.experience || 5} yrs Experience
              </div>
              <div>
                <FaHome /> {propertyServed[0] || "All Properties"}
              </div>
            </div>

            {/* DETAILS GRID */}
            <div className="mb-details-grid">
              <div>
                <label>Profession</label>
                <p>{profession.join(", ")}</p>
              </div>

              <div>
                <label>Project Type</label>
                <p>{projectType.join(", ")}</p>
              </div>

              <div>
                <label>Service Area</label>
                <p>
                  <FaMapMarkerAlt /> {interior.service_area}
                </p>
              </div>

              <div>
                <label>Rating</label>
                <p>{buildStars(4.5)}</p>
              </div>
            </div>

            {/* TABS */}
            <div className="mb-tabs">
              {["Overview", "Reviews"].map((t) => (
                <div
                  key={t}
                  className={`mb-tab ${tab === t ? "active" : ""}`}
                  onClick={() => setTab(t)}
                >
                  {t}
                </div>
              ))}
            </div>

            {/* OVERVIEW */}
            {tab === "Overview" && (
              <div className="mb-card">
                <h3 className="mb-section-title">About Service</h3>

                <p>
                  {interior.description ||
                    "Professional interior design services with quality materials and timely delivery."}
                </p>

                <button
                  className="mb-btn-primary1"
                  onClick={() => {
                    if (!token) {
                      alert("Please login to contact");
                      navigate("/login");
                      return;
                    }
                    setShowPhone(true);
                  }}
                >
                  Contact Now
                </button>
              </div>
            )}

            {/* REVIEWS */}
            {tab === "Reviews" && (
              <div className="mb-card">
                <h3>Customer Reviews</h3>
                <p>★★★★☆ (4.5 / 5)</p>
                <p>“Great quality work and professional team.”</p>
                <p>“On-time delivery and good finishing.”</p>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="mb-right">
            <div className="mb-price-card">
              <div className="mb-price">
                ₹ {interior.starting_price}
              </div>

              <div className="mb-meta">
                {profession[0]} • {interior.experience || 5} yrs
              </div>

              <button
                className="mb-phone-btn"
                onClick={() => {
                  if (!token) {
                    alert("Please login to view phone number");
                    return;
                  }
                  setShowPhone(true);
                }}
              >
                Get Phone No.
              </button>

              {showPhone && (
                <div className="mb-phone">
                  📞 +91 {interior.phone || "9876543210"}
                </div>
              )}

              <div className="mb-owner">
                <strong>{interior.posted_by || "Verified Professional"}</strong>
                <div>★★★★☆</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
