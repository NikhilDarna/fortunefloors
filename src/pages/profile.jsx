import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ImageCropper from "../components/ImageCropper";
import "./Profile.css";

const Profile = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // WhatsApp-style default profile image as base64
  const defaultProfileImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRDFEMUQxIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjgwIiByPSI0MCIgZmlsbD0iI0NDQ0NDQyIvPgo8cGF0aCBkPSJNMTAwIDEzMEMxMjUgMTMwIDE0MCAxNDUgMTQwIDE2MFYxODBIMFYxNjBDNjAgMTQ1IDc1IDEzMCAxMDAgMTMwWiIgZmlsbD0iI0NDQ0NDQyIvPgo8L3N2Zy4=";

  const [form, setForm] = useState({
    full_name: user?.full_name || "",
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(
    user?.profile_photo 
      ? `${import.meta.env.VITE_API_URL}/uploads/${user.profile_photo}` 
      : defaultProfileImage
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null);
  const [showManageOptions, setShowManageOptions] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageForCrop, setImageForCrop] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const photoOptionsRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (photoOptionsRef.current && !photoOptionsRef.current.contains(event.target)) {
        setShowPhotoOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Ensure proper profile photo initialization and auto-save default if needed
  useEffect(() => {
    if (user?.profile_photo) {
      setPreview(`${import.meta.env.VITE_API_URL}/uploads/${user.profile_photo}`);
    } else {
      setPreview(defaultProfileImage); // Show the default avatar image
      
      // Auto-save default profile picture to database if user doesn't have one
      const autoSaveDefaultProfile = async () => {
        try {
          const url = `${import.meta.env.VITE_API_URL}/api/user/profile`;
          const fd = new FormData();
          fd.append("full_name", user?.full_name || "");
          fd.append("username", user?.username || "");
          fd.append("phone", user?.phone || "");
          
          // Convert default image to file and upload
          const defaultFile = base64ToFile(defaultProfileImage, 'default-avatar.svg');
          fd.append("avatar", defaultFile);

          await axios.put(url, fd, {
            headers: {
              Authorization: token ? `Bearer ${token}` : undefined,
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          });

          // Update user in localStorage with default profile photo
          const updatedUser = { ...user, profile_photo: 'default-avatar.svg' };
          try {
            localStorage.setItem("user", JSON.stringify(updatedUser));
            // Also update the auth context if available
            if (window.updateUser) {
              window.updateUser(updatedUser);
            }
          } catch (e) {
            console.warn("Could not save updated user to localStorage", e);
          }
          
          console.log("Default profile picture auto-saved to database");
        } catch (err) {
          console.warn("Could not auto-save default profile picture:", err);
        }
      };

      // Only auto-save if we haven't tried before (avoid infinite loops)
      const hasAutoSaved = sessionStorage.getItem('defaultProfileAutoSaved');
      if (!hasAutoSaved && user) {
        autoSaveDefaultProfile();
        sessionStorage.setItem('defaultProfileAutoSaved', 'true');
      }
    }
  }, [user]);

  // Convert base64 to file
  const base64ToFile = (base64Data, filename) => {
    const arr = base64Data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    
    console.log('File selected:', f.name);
    setSelectedFile(f);
    setShowPhotoOptions(false);
    
    // Read the file and show crop modal
    const reader = new FileReader();
    reader.onload = (event) => {
      console.log('File loaded, showing crop modal');
      setImageForCrop(event.target.result);
      setShowCropModal(true);
    };
    reader.readAsDataURL(f);
  };

  const handleUploadPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleDeletePhoto = async () => {
    // Immediate visual feedback - show default avatar
    setPreview(defaultProfileImage);
    setAvatarFile(null);
    setShowPhotoOptions(false);
    
    try {
      setLoading(true);
      const url = `${import.meta.env.VITE_API_URL}/api/user/profile-photo`;
      
      await axios.delete(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        withCredentials: true,
      });
      
      // Update user in localStorage to ensure no profile_photo
      const updatedUser = { ...user, profile_photo: null };
      try {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        // Also update the auth context if available
        if (window.updateUser) {
          window.updateUser(updatedUser);
        }
      } catch (e) {
        console.warn("Could not save updated user to localStorage", e);
      }
      
      setMessage("Profile photo deleted successfully.");
      setLoading(false);
      
      // Reload after a short delay to ensure UI is updated
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      console.error(err);
      
      // Check if it's a network error or 404 (API doesn't exist)
      if (err.code === 'ERR_NETWORK' || err.response?.status === 404) {
        // Fallback: just delete from client-side
        const updatedUser = { ...user, profile_photo: null };
        try {
          localStorage.setItem("user", JSON.stringify(updatedUser));
          // Also update the auth context if available
          if (window.updateUser) {
            window.updateUser(updatedUser);
          }
        } catch (e) {
          console.warn("Could not save updated user to localStorage", e);
        }
        
        setMessage("Profile photo removed from your view.");
        setLoading(false);
        
        // Reload to update the UI
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setMessage(err.response?.data?.error || "Failed to delete profile photo.");
        setLoading(false);
        
        // If server deletion fails, restore the photo
        if (user?.profile_photo) {
          setPreview(`${import.meta.env.VITE_API_URL}/uploads/${user.profile_photo}`);
        }
      }
    }
  };

  const handleCropComplete = (croppedImageData) => {
    setCroppedImage(croppedImageData);
    setPreview(croppedImageData);
    
    // Convert cropped image back to file
    fetch(croppedImageData)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], selectedFile.name, { type: 'image/jpeg' });
        setAvatarFile(file);
      });
    
    setShowCropModal(false);
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setImageForCrop(null);
    setSelectedFile(null);
    setCroppedImage(null);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropDeletePhoto = () => {
    // Close crop modal and delete photo
    setShowCropModal(false);
    setImageForCrop(null);
    setSelectedFile(null);
    setCroppedImage(null);
    
    // Delete the photo
    handleDeletePhoto();
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const url = `${import.meta.env.VITE_API_URL}/api/user/profile`; // server may need this route

      // Check if we need to delete the profile photo (avatarFile is null but user had a photo before)
      const shouldDeletePhoto = !avatarFile && user?.profile_photo && !preview;
      // Check if we need to set default profile photo (user has no photo and preview is default)
      const shouldSetDefaultPhoto = !user?.profile_photo && preview === defaultProfileImage && !avatarFile;
      
      // if avatar present or we need to delete/set default photo, use FormData
      let res;
      if (avatarFile || shouldDeletePhoto || shouldSetDefaultPhoto) {
        const fd = new FormData();
        fd.append("full_name", form.full_name);
        fd.append("username", form.username);
        fd.append("phone", form.phone);
        
        if (avatarFile) {
          fd.append("avatar", avatarFile);
        } else if (shouldDeletePhoto) {
          fd.append("delete_avatar", "true"); // Signal to delete the avatar
        } else if (shouldSetDefaultPhoto) {
          // Convert default image to file and upload
          const defaultFile = base64ToFile(defaultProfileImage, 'default-avatar.svg');
          fd.append("avatar", defaultFile);
        }

        res = await axios.put(url, fd, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
      } else {
        res = await axios.put(
          url,
          { full_name: form.full_name, username: form.username, phone: form.phone },
          {
            headers: { Authorization: token ? `Bearer ${token}` : undefined },
            withCredentials: true,
          }
        );
      }

      // Update local storage user copy if response returns user
      const updatedUser = res.data?.user || { 
        ...user, 
        ...form,
        // Ensure profile_photo is properly set based on current state
        profile_photo: shouldDeletePhoto ? null : (shouldSetDefaultPhoto ? 'default-avatar.svg' : (user?.profile_photo || null))
      };
      try {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } catch (e) {
        console.warn("Could not save updated user to localStorage", e);
      }

      setMessage("Profile updated successfully.");
      setLoading(false);
      // simple refresh to let AuthProvider re-read user
      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Update failed. Server may not have the endpoint.");
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <h2>My Profile</h2>

      <div className="profile-card">
        <div className="avatar-column">
          <div className="avatar-preview">
            {preview ? (
              <img src={preview} alt="avatar" />
            ) : (
              <div className="avatar-placeholder">
                <div className="default-avatar">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              </div>
            )}

            <div className="avatar-edit-container" ref={photoOptionsRef}>
              <button
                aria-label="Edit profile photo"
                className="avatar-edit"
                type="button"
                onClick={() => setShowPhotoOptions(!showPhotoOptions)}
              >
                ✎
              </button>
              
              {showPhotoOptions && (
                <div className="photo-options-dropdown">
                  <button 
                    type="button" 
                    className="photo-option-btn upload"
                    onClick={handleUploadPhoto}
                  >
                    📷 Upload Photo
                  </button>
                  {preview && (
                    <button 
                      type="button" 
                      className="photo-option-btn delete"
                      onClick={handleDeletePhoto}
                      disabled={loading}
                    >
                      🗑️ Delete Photo
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          <input ref={fileInputRef} style={{ display: 'none' }} type="file" accept="image/*" onChange={handleFile} />
          
          <button
            type="button"
            className="manage"
            onClick={() => setShowManageOptions((s) => !s)}
          >
            Manage Your Account
          </button>
          
          {showManageOptions && (
            <div className="manage-options">
              <p>Choose an option:</p>
              <div className="manage-buttons">
                <button type="button" onClick={() => navigate('/account/shortlists')}>Your Shortlists</button>
                <button type="button" onClick={() => navigate('/account/owners')}>Owners You Contacted</button>
                <button type="button" onClick={() => navigate('/account/payments')}>Your Payments</button>
                <button type="button" onClick={() => navigate('/account/properties')}>Your Properties</button>
                <button type="button" onClick={() => navigate('/account/interested')}>Interested in Your Properties</button>
              </div>
            </div>
          )}
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input name="full_name" value={form.full_name} onChange={handleChange} />
          </label>

          <label>
            Username
            <input name="username" value={form.username} onChange={handleChange} />
          </label>

          <label>
            Email (read-only)
            <input name="email" value={form.email} readOnly />
          </label>

          <label>
            Phone
            <input name="phone" value={form.phone} onChange={handleChange} />
          </label>

          <div className="form-actions">
            <button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
            <button type="button" className="cancel" onClick={() => navigate(-1)}>Cancel</button>
          </div>

          {message && <div className="message">{message}</div>}
        </form>
      </div>

      {/* Crop Modal */}
      {showCropModal && (
        <div className="crop-modal-overlay">
          <div className="crop-modal">
            <div className="crop-modal-header">
              <h3>Crop Profile Photo</h3>
              <button 
                type="button" 
                className="close-btn"
                onClick={handleCropCancel}
              >
                ✕
              </button>
            </div>
            <div className="crop-modal-content">
              {console.log('Rendering ImageCropper with image:', imageForCrop ? 'loaded' : 'null')}
              <ImageCropper
                image={imageForCrop}
                onCropComplete={handleCropComplete}
                onCancel={handleCropCancel}
                onDeletePhoto={handleCropDeletePhoto}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;