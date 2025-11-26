import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Loan related states
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [pan, setPan] = useState("");
  const [dob, setDob] = useState("");
  const [cibilScore, setCibilScore] = useState(null);
  const [loanStep, setLoanStep] = useState("form");
  const [error, setError] = useState("");

  // Contact Owner
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/properties`);
      const properties = await response.json();
      const foundProperty = properties.find((p) => p.id === parseInt(id));
      setProperty(foundProperty);
    } catch (error) {
      console.error("Error fetching property details:", error);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Mock CIBIL Check ----------
  const handleCibilCheck = (e) => {
    e.preventDefault();
    setError("");

    if (!pan || !dob) {
      setError("Please enter PAN and DOB");
      return;
    }

    setTimeout(() => {
      const mockScore = Math.floor(Math.random() * 300) + 600;
      setCibilScore(mockScore);
      setLoanStep("result");
    }, 1500);
  };

  const resetLoanProcess = () => {
    setPan("");
    setDob("");
    setCibilScore(null);
    setLoanStep("form");
    setShowLoanForm(false);
  };

  if (loading) return <div className="loading">Loading property details...</div>;
  if (!property) return <div className="error">Property not found</div>;

  return (
    <div className="property-details">
      <div className="container">
        {/* ---------- Property Images ---------- */}
        <div className="property-images">
          {property.photos && property.photos.length > 0 ? (
            <div className="image-gallery">
              <div className="main-image">
                <img
                  src={`http://localhost:5000/uploads/${property.photos[currentImageIndex]}`}
                  alt={property.title}
                />
              </div>

              {property.photos.length > 1 && (
                <div className="image-thumbnails">
                  {property.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={`http://localhost:5000/uploads/${photo}`}
                      alt={`${property.title} ${index + 1}`}
                      className={index === currentImageIndex ? "active" : ""}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="no-image">No images available</div>
          )}
        </div>

        {/* ---------- Property Info ---------- */}
        <div className="property-info">
          <div className="property-header">
            <h1>{property.title}</h1>
            <div className="property-meta">
              <span className="property-type">{property.property_type}</span>
              <span className="transaction-type">
                {property.transaction_type}
              </span>
            </div>
            <p className="property-location">📍 {property.location}</p>
            <div className="property-price">
              ₹{parseInt(property.price).toLocaleString()}
            </div>
          </div>

          {/* ---------- Property Features ---------- */}
          <div className="property-features">
            <h3>Property Features</h3>
            <div className="features-grid">
              {/* ✅ Added below: property type details */}
              {property.category && (
                <div className="feature">
                  <span className="feature-icon">🏢</span>
                  <span>Category: {property.category}</span>
                </div>
              )}
              {property.subCategory && (
                <div className="feature">
                  <span className="feature-icon">🏠</span>
                  <span>Property Type: {property.subCategory}</span>
                </div>
              )}
              {property.listingType && (
                <div className="feature">
                  <span className="feature-icon">💰</span>
                  <span>Listing Type: {property.listingType}</span>
                </div>
              )}
              {/* Existing features */}
              {property.area && (
                <div className="feature">
                  <span className="feature-icon">📏</span>
                  <span>{property.area} sq ft</span>
                </div>
              )}
              {property.bedrooms && (
                <div className="feature">
                  <span className="feature-icon">🛏️</span>
                  <span>{property.bedrooms} Bedrooms</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="feature">
                  <span className="feature-icon">🚿</span>
                  <span>{property.bathrooms} Bathrooms</span>
                </div>
              )}
            </div>
          </div>

          {/* ---------- Owner Info ---------- */}
          <div className="property-features">
            <h4>Property Owner</h4>
            {property?.owner_name && (
              <p>
                <strong>Owner Name:</strong> {property.owner_name}
              </p>
            )}

            {property?.single_owner === "yes" && property?.linked_docx && (
              <p>
                <strong>Linked Docx:</strong> {property.linked_docx}
              </p>
            )}
            {property?.single_owner === "no" && (
              <p>
                <strong>Linked Docx:</strong> No Linked Docx
              </p>
            )}
          </div>

          {/* ---------- Description ---------- */}
          <div className="property-description">
            <h3>Description</h3>
            <p>{property.description}</p>
          </div>

          {/* ---------- Loan Section ---------- */}
          <div className="loan-section" style={{ marginTop: "30px" }}>
            <h3>Need a Loan for this Property?</h3>
            <p>Check your CIBIL score and apply from top banks directly.</p>
            <button
              onClick={() => setShowLoanForm(true)}
              style={{
                background: "#007bff",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "15px",
              }}
            >
              Apply for Loan
            </button>
          </div>

          {/* ---------- Contact Owner ---------- */}
          <div className="owner-info" style={{ marginTop: "40px" }}>
            <h3>Contact Owner</h3>
            <div className="owner-card">
              <div className="owner-avatar">
                {property.profile_photo ? (
                  <img
                    src={`http://localhost:5000/uploads/${property.profile_photo}`}
                    alt="Owner"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {property.full_name?.charAt(0) ||
                      property.username?.charAt(0)}
                  </div>
                )}
              </div>

              <div className="owner-details">
                <h4>{property.full_name || property.username}</h4>
                <div className="owner-rating">
                  <span className="stars">★★★★☆</span>
                  <span>{property.rating || 4.7}</span>
                </div>

                <button
                  className="contact-btn"
                  onClick={() => setShowPhone(true)}
                >
                  Contact Owner
                </button>

                {showPhone && (
                  <div
                    id="phone"
                    style={{
                      marginTop: "10px",
                      color: "#38BDF8",
                      fontSize: "16px",
                      fontWeight: "500",
                    }}
                  >
                    📞 +91 98765 43210
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Loan Modal ---------- */}
      {showLoanForm && (
        <div
          className="loan-modal"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "10px",
              width: "400px",
              textAlign: "center",
              boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
            }}
          >
            <h2>Loan Eligibility Check</h2>
            {loanStep === "form" && (
              <>
                <p>Enter your details to check your CIBIL score:</p>
                {error && (
                  <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>
                )}
                <form onSubmit={handleCibilCheck}>
                  <input
                    type="text"
                    placeholder="Enter PAN Number"
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                    style={{
                      width: "100%",
                      margin: "10px 0",
                      padding: "8px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                    required
                  />
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    style={{
                      width: "100%",
                      margin: "10px 0",
                      padding: "8px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                    required
                  />
                  <button
                    type="submit"
                    style={{
                      background: "#007bff",
                      color: "#fff",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      cursor: "pointer",
                      marginTop: "10px",
                    }}
                  >
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
                      Excellent! You are eligible for loan offers.
                    </p>
                    <h4>Apply from these banks:</h4>
                    <ul style={{ textAlign: "left" }}>
                      <li>
                        <a
                          href="https://www.hdfcbank.com/personal/loans"
                          target="_blank"
                          rel="noreferrer"
                        >
                          HDFC Bank
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.icicibank.com/personal/loans"
                          target="_blank"
                          rel="noreferrer"
                        >
                          ICICI Bank
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.axisbank.com/loans"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Axis Bank
                        </a>
                      </li>
                    </ul>
                  </>
                ) : (
                  <p style={{ color: "red" }}>
                    Sorry, your CIBIL score is below the required level. Try again later.
                  </p>
                )}
                <button
                  onClick={resetLoanProcess}
                  style={{
                    marginTop: "15px",
                    background: "#6c757d",
                    color: "#fff",
                    border: "none",
                    padding: "8px 20px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
