import React, { useState } from 'react';
import './AddProperty.css';

const AddProperty = () => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'apartment',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    location: '',
    address: '',
    description: '',
    amenities: [],
    images: [],
    contactName: '',
    contactEmail: '',
    contactPhone: ''
  });

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const amenitiesOptions = [
    'Parking', 'Swimming Pool', 'Gym', 'Security', 'Garden', 'Balcony',
    'Air Conditioning', 'Heating', 'Elevator', 'Storage', 'Laundry', 'Pet Friendly'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (checked) {
        setFormData(prev => ({
          ...prev,
          amenities: [...prev.amenities, value]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          amenities: prev.amenities.filter(amenity => amenity !== value)
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Property submitted:', formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="add-property-container">
        <div className="success-message">
          <h2>Property Listed Successfully!</h2>
          <p>Your property has been submitted for review and will be published within 24 hours.</p>
          <button onClick={() => window.location.href = '/my-listing'} className="view-listing-btn">
            View My Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="add-property-container">
      <div className="add-property-header">
        <h1>List Your Property</h1>
        <p>Add your property to reach thousands of potential buyers and renters</p>
      </div>

      <div className="progress-bar">
        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>Basic Info</div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>Property Details</div>
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>Photos</div>
        <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>Contact Info</div>
      </div>

      <form className="add-property-form" onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="form-step">
            <h2>Basic Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="title">Property Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Modern 3BR Apartment in Downtown"
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Property Type *</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="condo">Condo</option>
                  <option value="studio">Studio</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="price">Price ($) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 450000"
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Downtown, City"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="address">Full Address *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Street address, city, state, zip code"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Describe your property, its features, and what makes it special..."
                ></textarea>
              </div>
            </div>

            <div className="form-navigation">
              <button type="button" onClick={nextStep} className="next-btn">
                Next Step
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-step">
            <h2>Property Details</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="bedrooms">Bedrooms *</label>
                <input
                  type="number"
                  id="bedrooms"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="e.g., 3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="bathrooms">Bathrooms *</label>
                <input
                  type="number"
                  id="bathrooms"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.5"
                  placeholder="e.g., 2.5"
                />
              </div>

              <div className="form-group">
                <label htmlFor="area">Area (sq ft) *</label>
                <input
                  type="number"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="e.g., 1200"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Amenities</label>
              <div className="amenities-grid">
                {amenitiesOptions.map(amenity => (
                  <label key={amenity} className="amenity-checkbox">
                    <input
                      type="checkbox"
                      value={amenity}
                      checked={formData.amenities.includes(amenity)}
                      onChange={handleChange}
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-navigation">
              <button type="button" onClick={prevStep} className="prev-btn">
                Previous
              </button>
              <button type="button" onClick={nextStep} className="next-btn">
                Next Step
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-step">
            <h2>Property Photos</h2>
            <div className="upload-section">
              <div className="upload-area">
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <label htmlFor="images" className="upload-btn">
                  <div className="upload-icon">📷</div>
                  <p>Click to upload photos</p>
                  <small>Upload multiple photos. Maximum 10MB per file.</small>
                </label>
              </div>

              {formData.images.length > 0 && (
                <div className="uploaded-images">
                  <h3>Uploaded Images ({formData.images.length})</h3>
                  <div className="image-grid">
                    {formData.images.map((image, index) => (
                      <div key={index} className="image-preview">
                        <img src={URL.createObjectURL(image)} alt={`Preview ${index + 1}`} />
                        <button
                          type="button"
                          className="remove-image"
                          onClick={() => removeImage(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="form-navigation">
              <button type="button" onClick={prevStep} className="prev-btn">
                Previous
              </button>
              <button type="button" onClick={nextStep} className="next-btn">
                Next Step
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="form-step">
            <h2>Contact Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="contactName">Contact Name *</label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactEmail">Email Address *</label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactPhone">Phone Number *</label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  required
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="form-navigation">
              <button type="button" onClick={prevStep} className="prev-btn">
                Previous
              </button>
              <button type="submit" className="submit-btn">
                Submit Property
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddProperty;
