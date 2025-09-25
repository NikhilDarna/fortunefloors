import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PostProperty = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'house',
    transactionType: 'sale',
    price: '',
    location: '',
    area: '',
    bedrooms: '',
    bathrooms: ''
  });
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const submitData = new FormData();
    
    // Add form data
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });
    
    // Add photos
    photos.forEach(photo => {
      submitData.append('photos', photo);
    });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/properties', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Property submitted successfully! It will be reviewed by admin before being published.');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError(data.error || 'Failed to submit property');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-property">
      <div className="container">
        <div className="post-header">
          <h1>Post New Property</h1>
          <p>List your property and reach thousands of potential buyers/tenants</p>
        </div>

        <div className="post-form-container">
          <div className="user-profile">
            <div className="profile-info">
              <div className="profile-avatar">
                {user?.profilePhoto ? (
                  <img src={`http://localhost:5000/uploads/${user.profilePhoto}`} alt="Profile" />
                ) : (
                  <div className="avatar-placeholder">{user?.fullName?.charAt(0) || user?.username?.charAt(0)}</div>
                )}
              </div>
              <div className="profile-details">
                <h3>{user?.fullName || user?.username}</h3>
                <p className="user-type">{user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}</p>
                <div className="rating">
                  <span className="stars">★★★★☆</span>
                  <span className="rating-text">{user?.rating || 4.5} (Based on previous listings)</span>
                </div>
                <p className="contact">{user?.phone}</p>
                <p className="contact">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="property-form">
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleSubmit}>
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

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="propertyType">Property Type</label>
                    <select
                      id="propertyType"
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      required
                    >
                      <option value="house">House</option>
                      <option value="apartment">Apartment</option>
                      <option value="villa">Villa</option>
                      <option value="plot">Plot/Land</option>
                      <option value="commercial">Commercial</option>
                      <option value="office">Office Space</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="transactionType">For</label>
                    <select
                      id="transactionType"
                      name="transactionType"
                      value={formData.transactionType}
                      onChange={handleChange}
                      required
                    >
                      <option value="sale">Sale</option>
                      <option value="rent">Rent</option>
                      <option value="plot">Plot</option>
                    </select>
                  </div>
                </div>
              </div>

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

              <div className="form-section">
                <h3>Property Photos</h3>
                <div className="form-group">
                  <label htmlFor="photos">Upload Photos</label>
                  <input
                    type="file"
                    id="photos"
                    name="photos"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="file-input"
                  />
                  <p className="file-help">Select up to 10 images (Max 5MB each)</p>
                  {photos.length > 0 && (
                    <div className="selected-files">
                      <p>{photos.length} file(s) selected</p>
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Property for Review'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostProperty;