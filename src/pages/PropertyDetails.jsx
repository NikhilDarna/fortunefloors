import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from "react-router-dom";

import {
  FaBed,
  FaBath,
  FaBuilding,
  FaCouch,
  FaMapMarkerAlt,
  FaPhoneAlt
} from "react-icons/fa";
import "./PropertyDetails.css";

const slugify = (t, l) =>
  `${t}-${l}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const buildStars = (rating) => {
  const r = Math.max(0, Math.min(5, Number(rating) || 0));
  return "★".repeat(Math.floor(r)) + "☆".repeat(5 - Math.floor(r));
};

const StarRating = ({ value, onChange }) => (
  <div style={{ display: "flex", gap: 4 }}>
    {[1, 2, 3, 4, 5].map((n) => (
      <span
        key={n}
        style={{
          cursor: "pointer",
          fontSize: 18,
          color: n <= value ? "#fbbf24" : "#d1d5db",
        }}
        onClick={() => onChange(n)}
      >
        ★
      </span>
    ))}
  </div>
);



export default function PropertyDetails() {
  // 🔧 Advice & Tools carousel ref
  const toolsRef = useRef(null);

  const scrollTools = (direction) => {
    if (!toolsRef.current) return;

    const scrollAmount = 320;

    toolsRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };
  const { slug } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [img, setImg] = useState(0);
  const [tab, setTab] = useState("Overview");
  const [showPhone, setShowPhone] = useState(false);
  const [allProperties, setAllProperties] = useState([]);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [interiorDesigns, setInteriorDesigns] = useState([]);
  const [similarInteriors, setSimilarInteriors] = useState([]);
  const [homeAppliances, setHomeAppliances] = useState([]);

  // ===== REVIEWS STATES =====
const [societyReviews, setSocietyReviews] = useState([]);
const [localityReviews, setLocalityReviews] = useState([]);

const [societyReviewForm, setSocietyReviewForm] = useState({
  name: "",
  rating: 0,
  text: "",
});

const [localityReviewForm, setLocalityReviewForm] = useState({
  name: "",
  rating: 0,
  text: "",
});

const [showAllSocietyReviews, setShowAllSocietyReviews] = useState(false);
const [showAllLocalityReviews, setShowAllLocalityReviews] = useState(false);
// ===== LOAN STATES =====
const [showLoanForm, setShowLoanForm] = useState(false);
const [pan, setPan] = useState("");
const [dob, setDob] = useState("");
const [cibilScore, setCibilScore] = useState(null);
const [loanStep, setLoanStep] = useState("form"); // "form" | "result"
const [loanError, setLoanError] = useState("");
const [faqOpenIndex, setFaqOpenIndex] = useState(-1);
const [faqQuery, setFaqQuery] = useState("");

// ===== LEAD STATES =====
const token = localStorage.getItem("token");
const [leadLoading, setLeadLoading] = useState(false);
/* ================= TOOLS STATES ================= */

// Area Converter
const [areaValue, setAreaValue] = useState("");
const [fromUnit, setFromUnit] = useState("sq_meter");
const [toUnit, setToUnit] = useState("sq_foot");
const [convertedResult, setConvertedResult] = useState("");

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

const convertArea = () => {
  const value = parseFloat(areaValue);
  if (isNaN(value) || value <= 0) {
    setConvertedResult("⚠️ Enter a valid value");
    return;
  }

  const converted =
    (value * conversionRates[fromUnit]) / conversionRates[toUnit];

  setConvertedResult(
    `${value} ${fromUnit.replace("_", " ")} = ${converted.toLocaleString(undefined, {
      maximumFractionDigits: 4,
    })} ${toUnit.replace("_", " ")}`
  );
};
const getLocalityName = (locality) => {
  if (!locality) return "NA";

  // if string
  if (typeof locality === "string") return locality;

  // if array of objects
  if (Array.isArray(locality)) {
    return locality
      .map(l => l?.name || l?.area || Object.values(l).join(" "))
      .join(", ");
  }

  // if single object
  if (typeof locality === "object") {
    return locality.name || locality.area || Object.values(locality).join(" ");
  }

  return "NA";
};

// Loan Calculator
const [loanAmount, setLoanAmount] = useState(property?.price || "");
const [loanRate, setLoanRate] = useState("");
const [loanTime, setLoanTime] = useState("");
const [loanResult, setLoanResult] = useState(null);

const calculateLoan = () => {
  const P = parseFloat(loanAmount);
  const R = parseFloat(loanRate) / 12 / 100;
  const N = parseFloat(loanTime) * 12;

  if (isNaN(P) || isNaN(R) || isNaN(N) || P <= 0 || N <= 0) {
    setLoanResult(null);
    return;
  }

  const EMI =
    (P * R * Math.pow(1 + R, N)) /
    (Math.pow(1 + R, N) - 1);

  setLoanResult({
    EMI,
    totalInterest: EMI * N - P,
    totalPayment: EMI * N,
  });
};




  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/properties`)
      .then(r => r.json())
      .then(data => {
        setProperty(
          data.find(p => slugify(p.title, p.location) === slug)
        );
      });
  }, [slug]);
  const faqs = useMemo(() => {
  if (!property) return [];
  return [
    {
      q: "How do I schedule a site visit?",
      a: "Click on Contact Owner and share your preferred time.",
    },
    {
      q: "Is this property verified?",
      a: "We recommend verifying documents and visiting the property before finalizing.",
    },
    {
      q: "Can I apply for a loan?",
      a: "Yes, use the Loan section to check eligibility and EMI.",
    },
    {
      q: "What is the property price?",
      a: `The listed price is ₹ ${property.price?.toLocaleString()}.`,
    },
    {
      q: "Is negotiation possible?",
      a: "Negotiation depends on the owner. Contact them for details.",
    },
  ];
}, [property]);
const filteredFaqs = faqs.filter(
  (f) =>
    f.q.toLowerCase().includes(faqQuery.toLowerCase()) ||
    f.a.toLowerCase().includes(faqQuery.toLowerCase())
);


  // ================= REVIEW SUBMIT HANDLERS =================

const handleAddSocietyReview = async (e) => {
  e.preventDefault();

  const { name, rating, text } = societyReviewForm;
  if (!name || !rating || !text) return;

  await fetch(`${import.meta.env.VITE_API_URL}/api/society-reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      societyKey: slugify(property.title, property.location),
      name,
      rating,
      text,
    }),
  });

  setSocietyReviews([{ name, rating, text }, ...societyReviews]);
  setSocietyReviewForm({ name: "", rating: 0, text: "" });
};

const handleAddLocalityReview = async (e) => {
  e.preventDefault();

  const { name, rating, text } = localityReviewForm;
  if (!name || !rating || !text) return;

  await fetch(`${import.meta.env.VITE_API_URL}/api/locality-reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      localityKey: property.location,
      name,
      rating,
      text,
    }),
  });

  setLocalityReviews([{ name, rating, text }, ...localityReviews]);
  setLocalityReviewForm({ name: "", rating: 0, text: "" });
};
  useEffect(() => {
  if (!property || interiorDesigns.length === 0) return;

 const scoreForInterior = (i) => {
  let score = 0;

  // 📍 Service area match (MOST IMPORTANT)
  if (
    i.service_area &&
    (
      property.city ||
      property.location ||
      property.locality
    ) &&
    i.service_area
      .toLowerCase()
      .includes(
        (property.city || property.location || property.locality)
          .toLowerCase()
      )
  ) {
    score += 5;
  }

  // 💰 Budget match
  if (
    i.starting_price &&
    property.price &&
    i.starting_price <= property.price * 0.25
  ) {
    score += 2;
  }

  return score;
};


  const ranked = interiorDesigns
    .map((i) => ({ ...i, score: scoreForInterior(i) }))
    .filter((i) => i.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  setSimilarInteriors(ranked);
}, [property, interiorDesigns]);

// ================= LOAN HANDLERS =================

const handleCibilCheck = (e) => {
  e.preventDefault();
  setLoanError("");

  if (!pan || !dob) {
    setLoanError("Please enter PAN and Date of Birth");
    return;
  }

  // mock CIBIL score
  setTimeout(() => {
    const score = Math.floor(Math.random() * 300) + 600;
    setCibilScore(score);
    setLoanStep("result");
  }, 1200);
};
const formatText = (value, fallback = "") => {
  if (!value) return fallback;

  return value
    .toString()
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
};

// ===== CREATE LEAD =====
const createLead = async () => {
  if (!property) return;

  try {
    setLeadLoading(true);

    await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        propertyId: property.id,
        ownerId: property.user_id,
        source: "property_details",
      }),
    });

  } catch (err) {
    console.error("Lead creation failed", err);
  } finally {
    setLeadLoading(false);
  }
};

const resetLoanProcess = () => {
  setPan("");
  setDob("");
  setCibilScore(null);
  setLoanStep("form");
  setLoanError("");
  setShowLoanForm(false);
};
useEffect(() => {
  setShowLoanForm(false);
  setLoanStep("form");
}, [tab]);
useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/api/properties`)
    .then((r) => r.json())
    .then((data) => {
      setAllProperties(Array.isArray(data) ? data : []);
    });
}, []);
useEffect(() => {
  if (!property || allProperties.length === 0) return;

  const scoreFor = (p) => {
    let score = 0;
    if (p.location === property.location) score += 3;
    if (p.property_type === property.property_type) score += 2;
    if (p.transaction_type === property.transaction_type) score += 1;
    return score;
  };

  const ranked = allProperties
    .filter(
      (p) =>
        `${p.title}-${p.location}`.toLowerCase().replace(/[^a-z0-9]+/g, "-") !==
        slug
    )
    .map((p) => ({ ...p, score: scoreFor(p) }))
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  setSimilarProperties(ranked);
}, [property, allProperties, slug]);

// ================= FETCH INTERIOR DESIGN & HOME APPLIANCES =================

const slugifyInterior = (text) =>
  text
    ?.toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-");

useEffect(() => {
  const fetchInteriors = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/interiors`
      );
      const data = await res.json();

      const interiorsWithSlug = Array.isArray(data)
        ? data.map((item) => ({
            ...item,
            slug: item.slug || slugifyInterior(item.title),
          }))
        : [];

      setInteriorDesigns(interiorsWithSlug);
    } catch (err) {
      console.error("Interior fetch error:", err);
      setInteriorDesigns([]);
    }
  };

  fetchInteriors();
}, []);




const showValue = (v) =>
  v === null || v === undefined || v === "" ? "NA" : v;

if (!property) {
  return <div className="loading">Property not found</div>;
}
const isCommercial = property?.category === "commercial";
const INTERIOR_PLACEHOLDER =
  "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg";

  return (
    <div className="mb-page">
      {/* ================= CONTENT ================= */}
      <div className="mb-content">
        <div className="mb-layout">

          {/* LEFT */}
          <div className="mb-left">
            <h1 className="mb-title">{property.title}</h1>
            {/* ================= HERO ================= */}
            <div className="mb-hero">
              <img
                src={
                  property.photos?.length > 0
                    ? `${import.meta.env.VITE_API_URL}/uploads/${property.photos[img]}`
                    : "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800"
                }
                className="mb-hero-img"
                alt={property.title || "Property Image"}
              />

                    {property.photos?.length > 0 && (
                      <>
                        <div className="mb-hero-count">
                          {property.photos.length} Photos
                        </div>

                        <div className="mb-hero-thumbs">
                          {property.photos.slice(0, 5).map((p, i) => (
                            <img
                              key={i}
                              src={`${import.meta.env.VITE_API_URL}/uploads/${p}`}
                              className={img === i ? "active" : ""}
                              onClick={() => setImg(i)}
                              alt=""
                            />
                          ))}
                        </div>
                      </>
                    )}
            </div>
            {/* MOBILE PRICE CARD */}
            <div className="mb-mobile-card">
              <div className="mb-price">₹ {property.price?.toLocaleString()}</div>

              <div className="mb-mobile-actions">
                <button
                className="mb-btn-outline"
                onClick={async () => {
                  if (!token) {
                    alert("Please login to view phone number");
                    return;
                  }

                  await createLead();
                  setShowPhone(true);
                }}
                >
                  <FaPhoneAlt /> Get Phone No.
                </button>

              </div>

              {showPhone && (
                <div className="mb-phone">
                  📞 +91 {property.phone || "9876543210"}
                </div>
              )}
            </div>

            {/* ICON GRID */}
            {!isCommercial && (
  <div className="mb-icon-row">
    {property.bedrooms && (
      <div>
        <FaBed /> {property.bedrooms} Beds
      </div>
    )}

    {property.bathrooms && (
      <div>
        <FaBath /> {property.bathrooms} Baths
      </div>
    )}

    {property.balcony !== undefined &&
 property.balcony !== null && (
  <div>
    <FaBuilding /> {property.balcony} Balcony
  </div>
)}


    {property.furnishing && (
      <div>
        <FaCouch /> {formatText(property.furnishing)}
      </div>
    )}
  </div>
)}


            {/* DETAILS GRID */}
            <div className="mb-details-grid">
              <div>
                <label>Super Built-up Area</label>
                <p>{property.area} sq.ft</p>
              </div>

              <div>
                <label>Developer</label>
                <p>{formatText(property.developer, "Owner")}</p>
              </div>

              <div>
                <label>Project</label>
                <p>{formatText(property.project, property.title)}</p>
              </div>

              <div>
                <label>Floor</label>
                <p>
                  {property?.floor_number
                    ? `${property.floor_number}${property?.total_floors ? ` of ${property.total_floors}` : ""}`
                    : "NA"}
                </p>
              </div>



              <div>
                <label>Transaction Type</label>
                <p>{formatText(property.transaction_type, "Resale")}</p>
              </div>

              <div>
                <label>Status</label>
                <p>{formatText(property.status, "Ready To Move")}</p>
              </div>
            </div>


            {/* TABS */}
            <div className="mb-tabs">
              {["Overview", "Reviews", "Loan"].map(t => (
                <div
                  key={t}
                  className={`mb-tab ${tab === t ? "active" : ""}`}
                  onClick={() => setTab(t)}
                >
                  {t}
                </div>
              ))}
            </div>
            {tab === "Overview" && (
            <div className="mb-card">
              {/* ================= MORE DETAILS ================= */}
              <div className="mb-more-details">

                <h3 className="mb-section-title">More Details</h3>

                <div className="mb-more-grid">

                  <div className="mb-more-row">
                    <span>Price Breakup</span>
                    <strong>
                      ₹ {property.price?.toLocaleString()} |
                      ₹ {Math.round(property.price * 0.06).toLocaleString()} Approx. Registration
                    </strong>
                  </div>

                  <div className="mb-more-row">
                    <span>Address</span>
                    <strong>
                      {property.locality || property.location},
                      {property.city && ` ${property.city}`},
                      {property.state && ` ${property.state}`}
                      {property.pincode && ` - ${property.pincode}`}
                    </strong>
                  </div>

                  <div className="mb-more-row">
                    <span>Furnishing</span>
                    <strong>
                      {property.furnishing
                        ? property.furnishing.replace("-", " ").toUpperCase()
                        : "FURNISHED"}
                    </strong>
                  </div>

                  <div className="mb-more-row">
                    <span>Loan Offered</span>
                    <strong>
                      Estimated EMI: ₹{Math.round(property.price / 120)}
                      <div className="mb-loan-link">Apply for Home Loan</div>
                    </strong>
                  </div>

                  <div className="mb-more-row">
                    <span>Overlooking</span>
                    <strong>Garden / Park, Pool</strong>
                  </div>

                  <div className="mb-more-row">
                    <span>Age of Construction</span>
                    <strong>{showValue(property?.age_of_construction)}</strong>
                  </div>
                  <div className="mb-more-row">
                    <span>Facing</span>
                    <strong>{showValue(property?.facing)}</strong>
                  </div>


                      {/* DESCRIPTION */}
                  <h3>Description</h3>
                  <p>{property.description}</p>
          <button
            className="mb-btn-primary1"
            disabled={leadLoading}
            onClick={async () => {
              if (!token) {
                alert("Please login to contact owner");
                navigate("/login");
                return;
              }

              await createLead();   // 🔥 lead sent
              setShowPhone(true);   // 📞 show phone
            }}
          >
            {leadLoading ? "Please wait..." : "Contact Owner"}
          </button>

                </div>
              </div>
            </div>
            )}

            {tab === "Reviews" && (
              <div className="mb-card">

                <h3>Property Reviews</h3>

                {/* ADD REVIEW */}
                <form onSubmit={handleAddSocietyReview}>
                  <input
                    placeholder="Your name"
                    value={societyReviewForm.name}
                    onChange={(e) =>
                      setSocietyReviewForm({ ...societyReviewForm, name: e.target.value })
                    }
                    required
                  />
                  <textarea
                    placeholder="Write your review"
                    value={societyReviewForm.text}
                    onChange={(e) =>
                      setSocietyReviewForm({ ...societyReviewForm, text: e.target.value })
                    }
                    required
                  />
                  <StarRating
                    value={societyReviewForm.rating}
                    onChange={(rating) =>
                      setSocietyReviewForm({ ...societyReviewForm, rating })
                    }
                  />
                  <button type="submit">Submit Review</button>
                </form>

                {/* SOCIETY REVIEWS LIST */}
                {societyReviews
                  .slice(0, showAllSocietyReviews ? societyReviews.length : 2)
                  .map((r, i) => (
                    <div key={i}>
                      <strong>{r.name}</strong>
                      <div>{buildStars(r.rating)}</div>
                      <p>{r.text}</p>
                    </div>
                  ))}

                {societyReviews.length > 2 && (
                  <button onClick={() => setShowAllSocietyReviews(!showAllSocietyReviews)}>
                    {showAllSocietyReviews ? "Show Less" : "Read More"}
                  </button>
                )}

                <hr />

                <h3>Locality Reviews</h3>

                {/* LOCALITY FORM */}
                <form onSubmit={handleAddLocalityReview}>
                  <input
                    placeholder="Your name"
                    value={localityReviewForm.name}
                    onChange={(e) =>
                      setLocalityReviewForm({ ...localityReviewForm, name: e.target.value })
                    }
                    required
                  />
                  <textarea
                    placeholder="Write your review"
                    value={localityReviewForm.text}
                    onChange={(e) =>
                      setLocalityReviewForm({ ...localityReviewForm, text: e.target.value })
                    }
                    required
                  />
                  <StarRating
                    value={localityReviewForm.rating}
                    onChange={(rating) =>
                      setLocalityReviewForm({ ...localityReviewForm, rating })
                    }
                  />
                  <button type="submit">Submit Review</button>
                </form>

                {/* LOCALITY REVIEWS LIST */}
                {localityReviews
                  .slice(0, showAllLocalityReviews ? localityReviews.length : 2)
                  .map((r, i) => (
                    <div key={i}>
                      <strong>{r.name}</strong>
                      <div>{buildStars(r.rating)}</div>
                      <p>{r.text}</p>
                    </div>
                  ))}

                {localityReviews.length > 2 && (
                  <button onClick={() => setShowAllLocalityReviews(!showAllLocalityReviews)}>
                    {showAllLocalityReviews ? "Show Less" : "Read More"}
                  </button>
                )}
              </div>
            )}




            {tab === "Loan" && (
              <div className="mb-card loan-card">

                <h3>Need a Loan for this Property?</h3>
                <p>Check your CIBIL score and apply for home loans from top banks.</p>

                <button
                  className="mb-phone-btn"
                  onClick={() => setShowLoanForm(true)}
                  style={{ marginTop: 10 }}
                >
                  Apply for Loan
                </button>

                {/* ===== LOAN MODAL ===== */}
                {showLoanForm && (
                  <div className="loan-modal" onClick={resetLoanProcess}>
                    <div className="loan-modal" onClick={(e) => e.stopPropagation()}>

                      <h2>Loan Eligibility Check</h2>

                      {loanStep === "form" && (
                        <>
                          <p>Enter your PAN and DOB to check eligibility</p>

                          {loanError && (
                            <p style={{ color: "red", marginBottom: 10 }}>
                              {loanError}
                            </p>
                          )}

                          <form onSubmit={handleCibilCheck}>
                            <input
                              type="text"
                              placeholder="PAN Number"
                              value={pan}
                              onChange={(e) => setPan(e.target.value.toUpperCase())}
                              required
                            />

                            <input
                              type="date"
                              value={dob}
                              onChange={(e) => setDob(e.target.value)}
                              required
                            />

                            <button type="submit">
                              Check CIBIL
                            </button>
                          </form>
                        </>
                      )}

                      {loanStep === "result" && (
                        <>
                          <h3>Your CIBIL Score: {cibilScore}</h3>

                          {cibilScore >= 700 ? (
                            <>
                              <p style={{ color: "green" }}>
                                You are eligible for home loan offers 🎉
                              </p>

                              <div className="loan-bank-grid">
                                {[
                                  { name: "HDFC", url: "https://www.hdfcbank.com" },
                                  { name: "ICICI", url: "https://www.icicibank.com" },
                                  { name: "Axis", url: "https://www.axisbank.com" },
                                  { name: "SBI", url: "https://sbi.co.in" },
                                  { name: "PNB", url: "https://www.pnbindia.in" },
                                ].map((b) => (
                                  <a
                                    key={b.name}
                                    href={b.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="loan-bank"
                                  >
                                    {b.name}
                                  </a>
                                ))}
                              </div>
                            </>
                          ) : (
                            <p style={{ color: "red" }}>
                              Your score is below eligibility. Try again later.
                            </p>
                          )}

                          <button
                            onClick={resetLoanProcess}
                            style={{ marginTop: 15 }}
                          >
                            Close
                          </button>
                        </>
                      )}

                    </div>
                  </div>
                )}
              </div>
            )}
            {/* ================= ABOUT PROJECT ================= */}
            <div className="about-project-card">

              <h3 className="about-project-title">About Project</h3>

              <div className="about-project-row">

                {/* LEFT ICON */}
                <div className="about-project-icon">
                  🏢
                </div>

                {/* PROJECT INFO */}
                <div className="about-project-info">
                  <strong>{property.project || property.title}</strong>
                </div>

                {/* PRICE */}
                <div className="about-project-col">
                  <span>Price</span>
                  <strong>₹ {property.price?.toLocaleString()} Onwards</strong>
                </div>

                {/* CONFIG */}
                <div className="about-project-col">
                  <span>Configuration</span>
                  <strong>{property.bedrooms || 1} BHK Flat</strong>
                </div>

              </div>

            </div>
            {/* 💡 Advice & Tools Section */}
        <div className="advice-tools-section">
          <div className="section-header">
            <h2 className="section-title">Advice & Tools</h2>
          </div>
          
          <div className="tools-carousel-container">
            <button className="carousel-arrow left" onClick={() => scrollTools('left')}>
              ‹
            </button>
            
            <div className="tools-carousel" ref={toolsRef}>
              <div className="tool-card">
                <div className="tool-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </div>
                <h3 className="tool-title">Add Your Property</h3>
                <p className="tool-description">List your property with location, type, size, price, and photos.</p>
                <Link to="/post-property" className="tool-link">View now →</Link>
              </div>

              <div className="tool-card">
                <div className="tool-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="9" y1="9" x2="15" y2="9"></line>
                    <line x1="9" y1="15" x2="15" y2="15"></line>
                  </svg>
                </div>
                <h3 className="tool-title">Area Converter</h3>
                <p className="tool-description">Instantly convert between acres, hectares, and square meters.</p>
                <Link to="/area-converter" className="tool-link">View now →</Link>
              </div>

              <div className="tool-card">
                <div className="tool-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <h3 className="tool-title">EMI Calculator</h3>
                <p className="tool-description">Calculate EMI, total interest, and total payment for your home loan.</p>
                <Link to="/emi-calculator" className="tool-link">View now →</Link>
              </div>

              <div className="tool-card">
                <div className="tool-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10,9 9,9 8,9"></polyline>
                  </svg>
                </div>
                <h3 className="tool-title">Best Home Loan Offers</h3>
                <p className="tool-description">Compare and find the best home loan interest rates from top banks.</p>
                <Link to="/home-loan-offers" className="tool-link">View now →</Link>
              </div>
            </div>
            
            <button className="carousel-arrow right" onClick={() => scrollTools('right')}>
              ›
            </button>
          </div>
        </div>
                      {similarProperties.length > 0 && (
            <div className="mb-card">
              <h3 className="mb-section-title">Similar Properties</h3>

              <div className="similar-grid">
                {similarProperties.map((p) => (
                  <div
                    key={p.id}
                    className="similar-card"
                    onClick={() =>
                      navigate(
                        `/property/${`${p.title}-${p.location}`
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")}`
                      )
                    }
                  >
                    <img
                      src={
                        p.photos?.length
                          ? `${import.meta.env.VITE_API_URL}/uploads/${p.photos?.[0]}`
                          : INTERIOR_PLACEHOLDER
                      }
                      alt={p.title}
                    />
                    <div className="similar-info">
                      <strong>{p.title}</strong>
                      <span>{p.location}</span>
                      <span>₹ {p.price?.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= SUGGESTED INTERIOR DESIGN ================= */}
          <div className="mb-card">
  <h3 className="mb-section-title">Suggested Interior Design</h3>

  {similarInteriors.length > 0 ? (
    <div className="interior-scroll">
      {similarInteriors.map((item) => (
        <div key={item.id} className="interior-card">
          <img
            src={
              item.photos?.length
                ? `${import.meta.env.VITE_API_URL}/uploads/${item.photos[0]}`
                : INTERIOR_PLACEHOLDER
            }
            alt={item.title}
          />

          <div className="suggestion-info">
            <strong>{item.title}</strong>
            <span>₹ {item.starting_price?.toLocaleString()}</span>

            <button
              className="suggestion-btn"
              onClick={() => navigate(`/interior/${item.slug}`)}
            >
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="empty-state">
      <p>No interior designs found for this property.</p>
    </div>
  )}
</div>



          {/* ================= SUGGESTED HOME APPLIANCES ================= */}
          <div className="mb-card">
            <h3 className="mb-section-title">Suggested Home Appliances</h3>
            <div className="suggestion-grid">
              {homeAppliances.map((item) => (
                <div key={item.id} className="suggestion-card">
                  <img
                    src={item.image}
                    alt={item.title}
                  />
                  <div className="suggestion-info">
                    <strong>{item.title}</strong>
                    <span>₹ {item.price?.toLocaleString()}</span>
                    <button className="suggestion-btn">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-card" id="property-faq">
            <h3 className="mb-section-title">FAQs</h3>

            <input
              className="faq-search"
              placeholder="Search FAQs"
              value={faqQuery}
              onChange={(e) => setFaqQuery(e.target.value)}
            />

            <div className="faq-list">
              {filteredFaqs.map((f, idx) => (
                <div key={idx} className="faq-item">
                  <button
                    className="faq-question"
                    onClick={() => setFaqOpenIndex(idx === faqOpenIndex ? -1 : idx)}
                  >
                    {f.q}
                    <span>{idx === faqOpenIndex ? "−" : "+"}</span>
                  </button>

                  {idx === faqOpenIndex && (
                    <div className="faq-answer">{f.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
          </div>
          {/* RIGHT (DESKTOP ONLY) */}
          <div className="mb-right">
            <div className="mb-price-card">
              <div className="mb-price">
                ₹ {property.price?.toLocaleString()}
              </div>

              <div className="mb-emi">
                EMI starts at ₹{Math.round(property.price / 120)}
              </div>

              <div className="mb-meta">
                {property.bedrooms} BHK • {property.area} sq.ft
              </div>
              <button
  className="mb-phone-btn"
  disabled={leadLoading}
  onClick={async () => {
    if (!token) {
      alert("Please login to view phone number");
      return;
    }

    await createLead();   // 🔥 lead sent
    setShowPhone(true);   // 📞 show phone
  }}
>
  {leadLoading ? "Please wait..." : "Get Phone No."}
</button>


              {showPhone && (
                <div className="mb-phone">
                  📞 +91 {property.phone || "9876543210"}
                </div>
              )}

              <div className="mb-owner">
                <strong>{property.owner_name || "Owner"}</strong>
                <div>★★★★☆</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};