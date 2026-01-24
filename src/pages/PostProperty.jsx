import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../pages/postproperty.css";

const PostProperty = () => {
  const { user } = useAuth();
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [area, setArea] = useState("");
  const [pincode, setPincode] = useState("");
  

  const isInterior = user?.role === "interiors";

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // PG extra options
  const pgCategoryOptions = ["Normal PG", "Deluxe PG", "Luxury PG"];
  const pgShareOptions = ["1 Share", "2 Share", "3 Share", "4 Share", "5 Share", "8 Share"];

  
  // ✅ Correct mapping (use "sale" instead of "sell")
  const typeOptions = {
    sale: {
      residential: [
        "Flat/Apartment",
        "Independent House / Villa",
        "Independent / Builder Floor",
        "Plot / Land",
        "1 RK/ Studio Apartment",
        "Serviced Apartment",
        "Farmhouse","Shop",
        "Other",
      ],
      commercial: [
        "Office",
        "Retail",
        "Plot / Land",
        "Storage",
        "Industry",
        "Hospitality",
        "Other",
      ],
    },
    rent: {
      residential: [
        "Flat/Apartment",
        "Villa",
        "Independent House",
        "Independent / Builder Floor",
        "1 RK/ Studio Apartment",
        "Serviced Apartment",
        "Farmhouse",
        "Shop",
        "Other",
      ],
      commercial: [
        "Office",
        "Retail",
        "Plot / Land",
        "Storage",
        "Industry",
        "Hospitality",
        "Other",
      ],
    },
    pg: {
      residential: [
        "PG - Male",
        "PG - Female",
        "PG - Co-living",
        "Serviced Apartment",
        "Other",
      ],
      commercial: ["Office", "Retail", "Other"],
    },
    plot: {
      residential: [
        "Residential Plot",
        "Farm Land",
        "Agricultural Land",
        "Farmhouse Plot",
        "Other",
      ],
      commercial: [
        "Commercial Plot",
        "Industrial Land",
        "Warehouse Land",
        "Institutional Land",
        "Other",
      ],
    },
  };

  // ✅ Use "sale" here (not "sell") and add fallback safety
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    transactionType: "sale",
    listingSubType: "sell",
    category: "residential",
    propertyType:
      typeOptions["sale"]?.["residential"]?.[0] || "Flat/Apartment",
    price: "",
    location: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    furnishing: "unfurnished", // ✅ NEW
    readyToMove: false,        // ✅ NEW
    directFromOwner: false,    // ✅ NEW
    bachelorFriendly: false,
    singleOwner: "yes",
    ownerName: "",
    linkedDocx: "",
    pgCategory: "",
    pgSharing: "",
    // ===== INTERIOR SERVICE FIELDS (ADD ONLY) =====
    profession: [],
    projectType: [],
    propertyServed: [],

    materialUsed: "",
    experience: "",
    startingPrice: "",
    serviceArea: "",

    postedBy: user?.fullName || user?.username || user?.email || "Unknown User",
  });

  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle input
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle transaction type safely
  const handleTransactionType = (transactionType) => {
    const newCategory =
      transactionType === "pg" ? "residential" : formData.category;
    const newPropertyType =
      typeOptions[transactionType]?.[newCategory]?.[0] ||
      "Flat/Apartment";

    setFormData((prev) => ({
      ...prev,
      transactionType,
      category: newCategory,
      propertyType: newPropertyType,
    }));
  };
  const handleCheckboxChange = (e) => {
  const { name, checked } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: checked,
  }));
};

  const handleCategory = (category) => {
    const newPropertyType =
      typeOptions[formData.transactionType]?.[category]?.[0] ||
      "Flat/Apartment";
    setFormData((prev) => ({
      ...prev,
      category,
      propertyType: newPropertyType,
    }));
  };

  const handlePropertyTypeSelect = (propertyType) => {
  setFormData((prev) => ({
    ...prev,
    propertyType,
    pgCategory: "",
    pgSharing: "",
  }));
};


  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  setSuccess("");

  try {
    const submitData = new FormData();

    /* =================================================
       ✅ ADD THIS BLOCK (INTERIOR USERS ONLY)
    ================================================= */
    if (isInterior) {
      submitData.append("title", formData.title);
      submitData.append("experience", formData.experience);
      submitData.append("startingPrice", formData.startingPrice);
      submitData.append("serviceArea", formData.serviceArea);

      submitData.append("profession", JSON.stringify(formData.profession));
      submitData.append("propertyServed", JSON.stringify(formData.propertyServed));
      submitData.append("projectType", JSON.stringify(formData.projectType));

      photos.forEach((photo) => {
        submitData.append("photos", photo);
      });

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/interiors`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: submitData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to submit interior service");
        return;
      }

      setSuccess("Interior service submitted for review!");
      setTimeout(() => navigate("/dashboard"), 2000);
      return; // ⛔ IMPORTANT: stop here for interiors
    }

    /* =================================================
       ❌ YOUR ORIGINAL CODE (UNCHANGED)
    ================================================= */

    // 1️⃣ Send TITLE manually FIRST (highest priority)
    submitData.append("title", formData.title);

    // 2️⃣ Then send all other text fields
    Object.keys(formData).forEach((key) => {
      if (key !== "title") {
        submitData.append(key, formData[key]);
      }
    });

    // ✅ Address fields
    submitData.append("city", city?.value || city || "");
    submitData.append("state", state?.value || state || "");
    submitData.append("locality", area || "");
    submitData.append("pincode", pincode ? String(pincode) : "");

    // 3️⃣ Finally send PHOTOS
    photos.forEach((photo) => {
      submitData.append("photos", photo);
    });

    const token = localStorage.getItem("token");
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/properties`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submitData,
      }
    );

    const data = await response.json();

    if (response.ok) {
      setSuccess(
        "Property submitted successfully! It will be reviewed by admin before being published."
      );
      setTimeout(() => navigate("/dashboard"), 2000);
    } else {
      setError(data.error || "Failed to submit property");
    }
  } catch (err) {
    console.error(err);
    setError("Network error. Please try again.");
  } finally {
    setLoading(false);
  }
};

const professionOptions = [
  "Interior Designer",
  "False Ceiling Contractor",
  "Modular Kitchen Expert",
  "Turnkey Interior",
];
const propertyTypeServedOptions = [
  "Flat / Apartment",
  "Villa",
  "Office",
  "Shop",
];

const projectTypeOptions = [
  "Full Home Interior",
  "Kitchen Only",
  "Office Fitout",
];

const [customProfession, setCustomProfession] = useState("");


  // ✅ Safe property type options
  const currentOptions =
    typeOptions[formData.transactionType]?.[formData.category] || [];

  return (
    <div className="post-property">
      <div className="container">
        <div className="post-header">
          <h1>Start posting your property, it’s free</h1>
          <p>Add basic details about your property to get started</p>
        </div>

        <div className="post-form-container">
          <div className="user-profile">
            <div className="profile-info">
              <div className="profile-avatar">
                {user?.profilePhoto ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/${user.profilePhoto}`}
                    alt="Profile"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {user?.fullName?.charAt(0) || user?.username?.charAt(0)}
                  </div>
                )}
              </div>
              <div className="profile-details">
                <h3>{user?.fullName || user?.username}</h3>
                <p className="user-type">
                  {user?.role
                    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                    : ""}
                </p>
                <div className="rating">
                  <span className="stars">★★★★☆</span>
                  <span className="rating-text">
                    {user?.rating || 4.5} (Based on previous listings)
                  </span>
                </div>
                <p className="contact">{user?.phone}</p>
                <p className="contact">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE – SWITCH BASED ON ROLE */}
          {!isInterior ? (
            /* ================= PROPERTY FORM (UNCHANGED) ================= */
            <div className="property-form">
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <form onSubmit={handleSubmit}>
                      {/* ---- Basic Info ---- */}
                      <div className="form-section">
                        <h3>Basic Information</h3>
                        <div className="form-group">
                          <label htmlFor="title">Property Title</label>
                          <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Beautiful 3BHK Villa with Garden"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="description">Description</label>
                          <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Describe your property in detail..."
                            required
                          />
                        </div>
                      </div>

                      {/* ---- Transaction + Category ---- */}
                      <div className="form-section">
                        <h3>Add Basic Details</h3>
                        <div className="form-group">
                          <label>You're looking to ...</label>
                          <div className="option-group">
                            {["sale", "rent", "pg", "plot"].map((t) => (
                              <button
                                key={t}
                                type="button"
                                className={`option-btn ${
                                  formData.transactionType === t ? "active" : ""
                                }`}
                                onClick={() => handleTransactionType(t)}
                              >
                                {t === "sale"
                                  ? "Sell"
                                  : t === "rent"
                                  ? "Rent / Lease"
                                  : t === "pg"
                                  ? "PG"
                                  : "Plot"}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Category */}
                        <div className="form-group">
                          <label>And it's a ...</label>
                          <div className="option-group">
                            <label className="radio-inline">
                              <input
                                type="radio"
                                name="category"
                                value="residential"
                                checked={formData.category === "residential"}
                                onChange={() => handleCategory("residential")}
                              />{" "}
                              Residential
                            </label>

                            <label className="radio-inline">
                              <input
                                type="radio"
                                name="category"
                                value="commercial"
                                checked={formData.category === "commercial"}
                                onChange={() => handleCategory("commercial")}
                                disabled={formData.transactionType === "pg"}
                              />{" "}
                              Commercial
                            </label>
                          </div>
                        </div>

                        {/* Property Type Buttons */}
                        <div className="option-group wrap" style={{ marginTop: 12 }}>
                          {currentOptions.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={`option-btn ${
                                formData.propertyType === opt ? "active" : ""
                              }`}
                              onClick={() => handlePropertyTypeSelect(opt)}
                            >
                              {opt}
                            </button>
                          ))}
                          {formData.transactionType === "pg" &&
          formData.propertyType.startsWith("PG") && (
            <div style={{ marginTop: "15px" }}>
              <p><b>Select PG Type</b></p>
              {pgCategoryOptions.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`option-btn ${formData.pgCategory === cat ? "active" : ""}`}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      pgCategory: cat,
                      pgSharing: "",
                    }))
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
          {formData.transactionType === "pg" && formData.pgCategory && (
          <div style={{ marginTop: "15px" }}>
            <p><b>Select Sharing</b></p>
            {pgShareOptions.map((share) => (
              <button
                key={share}
                type="button"
                className={`option-btn ${formData.pgSharing === share ? "active" : ""}`}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, pgSharing: share }))
                }
              >
                {share}
              </button>
            ))}
          </div>
        )}

                        </div>
                      </div>
                      {/* ---- Property Preferences ---- */}
                      <div className="form-section">
                        <h3>Property Preferences</h3>

                        {/* Furnishing */}
                        <div className="form-group">
                          <label>Furnishing</label>
                          <div className="option-group">
                            {["unfurnished", "semi-furnished", "fully-furnished"].map((f) => (
                              <button
                                key={f}
                                type="button"
                                className={`option-btn ${
                                  formData.furnishing === f ? "active" : ""
                                }`}
                                onClick={() =>
                                  setFormData((prev) => ({ ...prev, furnishing: f }))
                                }
                              >
                                {f.replace("-", " ").toUpperCase()}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Preferences (multi-select pills) */}
                        <div className="checkbox-group">
                          <label className="checkbox-pill-wrapper">
                            <input
                              type="checkbox"
                              name="readyToMove"
                              checked={formData.readyToMove}
                              onChange={handleCheckboxChange}
                            />
                            <span className="checkbox-pill">Ready to Move</span>
                          </label>

                          <label className="checkbox-pill-wrapper">
                            <input
                              type="checkbox"
                              name="directFromOwner"
                              checked={formData.directFromOwner}
                              onChange={handleCheckboxChange}
                            />
                            <span className="checkbox-pill">Direct From Owner</span>
                          </label>

                          <label className="checkbox-pill-wrapper">
                            <input
                              type="checkbox"
                              name="bachelorFriendly"
                              checked={formData.bachelorFriendly}
                              onChange={handleCheckboxChange}
                            />
                            <span className="checkbox-pill">Bachelor Friendly</span>
                          </label>
                        </div>
                      </div>

                      {/* ---- Property Details ---- */}
                      <div className="form-section">
                        <h3>Property Details</h3>
                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="price">Price (₹)</label>
                            <input
                              type="number"
                              id="price"
                              name="price"
                              value={formData.price}
                              onChange={handleChange}
                              placeholder="Enter price"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="area">Area (sq ft)</label>
                            <input
                              type="number"
                              id="area"
                              name="area"
                              value={formData.area}
                              onChange={handleChange}
                              placeholder="Enter area"
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label htmlFor="location">Location</label>
                          <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Enter complete address"
                            required
                          />
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>City</label>
                            <input
                              type="text"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              placeholder="City (e.g. Hyderabad)"
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label>State</label>
                            <input
                              type="text"
                              value={state}
                              onChange={(e) => setState(e.target.value)}
                              placeholder="State (e.g. Telangana)"
                              required
                            />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label>Area / Locality</label>
                            <input
                              type="text"
                              value={area}
                              onChange={(e) => setArea(e.target.value)}
                              placeholder="Area / Locality"
                            />
                          </div>

                          <div className="form-group">
                            <label>Pincode</label>
                            <input
                              type="text"
                              value={pincode}
                              onChange={(e) => setPincode(e.target.value)}
                              placeholder="Pincode"
                            />
                          </div>
                        </div>


                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="bedrooms">Bedrooms</label>
                            <input
                              type="number"
                              id="bedrooms"
                              name="bedrooms"
                              value={formData.bedrooms}
                              onChange={handleChange}
                              placeholder="Number of bedrooms"
                              min="0"
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="bathrooms">Bathrooms</label>
                            <input
                              type="number"
                              id="bathrooms"
                              name="bathrooms"
                              value={formData.bathrooms}
                              onChange={handleChange}
                              placeholder="Number of bathrooms"
                              min="0"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Photos */}
                      <div className="form-section">
                        <h3>Property Photos</h3>
                        <div className="form-group">
                          <label htmlFor="photos">Upload Photos Max 5 Photos</label>
                          <input
                            type="file"
                            id="photos"
                            name="photos"
                            multiple
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="file-input"
                          />
                          {photos.length > 0 && (
                            <div className="selected-files">
                              <p>{photos.length} file(s) selected</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Owner Details */}
                      <div className="form-section">
                        <h3>Owner Details</h3>
                        <div className="form-group">
                          <label>Owner Name</label>
                          <input
                            type="text"
                            name="ownerName"
                            value={formData.ownerName}
                            onChange={handleChange}
                            placeholder="Enter Owner Name"
                            required
                          />
                        </div>
                      </div>
                          
                      <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                      >
                        {loading ? "Submitting..." : "Submit Property for Review"}
                      </button>
                    </form>
                  </div>
          ) : (
            /* ================= INTERIOR FORM (JUSTDIAL STYLE) ================= */
            <div className="property-form">
              <form onSubmit={handleSubmit}>
                <div className="form-section">
                  <h3>Interior Service Details</h3>
                  <div className="form-group">
                    <label>Business / Service Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. I Design Fall Ceiling Contractor"
                      required
                    />
                  </div>
                  <div className="form-section">
                  <h3>Profession</h3>

                  {/* PREDEFINED OPTIONS */}
                  <div className="option-group wrap">
                    {professionOptions.map((opt) => {
                      const isActive = formData.profession.includes(opt);

                      return (
                        <button
                          key={opt}
                          type="button"
                          className={`option-btn ${isActive ? "active" : ""}`}
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              profession: isActive
                                ? prev.profession.filter((p) => p !== opt)
                                : [...prev.profession, opt],
                            }));
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  </div>
                  <div className="form-section">
                    <h3>Property Type Served</h3>

                    <div className="option-group wrap">
                      {propertyTypeServedOptions.map((opt) => {
                        const isActive = formData.propertyServed.includes(opt);

                        return (
                          <button
                            key={opt}
                            type="button"
                            className={`option-btn ${isActive ? "active" : ""}`}
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                propertyServed: isActive
                                  ? prev.propertyServed.filter((p) => p !== opt)
                                  : [...prev.propertyServed, opt],
                              }));
                            }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="form-section">
                    <h3>Project Type</h3>

                    <div className="option-group wrap">
                      {projectTypeOptions.map((opt) => {
                        const isActive = formData.projectType.includes(opt);

                        return (
                          <button
                            key={opt}
                            type="button"
                            className={`option-btn ${isActive ? "active" : ""}`}
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                projectType: isActive
                                  ? prev.projectType.filter((p) => p !== opt)
                                  : [...prev.projectType, opt],
                              }));
                            }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Experience (Years)</label>
                      <input
                        type="number"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Starting Price (₹)</label>
                      <input
                        type="number"
                        name="startingPrice"
                        value={formData.startingPrice}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Service Area</label>
                    <input
                      type="text"
                      name="serviceArea"
                      value={formData.serviceArea}
                      onChange={handleChange}
                      placeholder="Hyderabad, Gachibowli"
                    />
                  </div>
                </div>
                {/* PORTFOLIO IMAGES */}
                <div className="form-section">
                  <h3>Portfolio Images</h3>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Submitting..." : "Submit for Review"}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PostProperty;
