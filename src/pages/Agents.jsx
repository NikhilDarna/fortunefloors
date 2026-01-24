import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Agents.css";

const Agents = () => {
  const { type } = useParams(); // top-rated | nearby | verified
  const { user } = useAuth();
  const navigate = useNavigate();

  const [agents, setAgents] = useState([]);
  const [activeAgentId, setActiveAgentId] = useState(null);
  const [reviewStars, setReviewStars] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [userLocation, setUserLocation] = useState("Hyderabad"); // Default fallback
  const [locationLoading, setLocationLoading] = useState(true);

  // Get user's current location
  useEffect(() => {
    if (type === "nearby") {
      setLocationLoading(true);
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              console.log("📍 Location detected:", latitude, longitude);
              
              // Get city name from coordinates using reverse geocoding
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
              );
              const data = await response.json();
              console.log("🏙️ Geocoding response:", data);
              
              const city = data.address?.city || 
                         data.address?.town || 
                         data.address?.village || 
                         data.address?.county ||
                         "Hyderabad"; // Fallback
              
              console.log("🏙️ Detected city:", city);
              setUserLocation(city);
              setLocationLoading(false);
            } catch (error) {
              console.error("Error getting location:", error);
              setUserLocation("Hyderabad");
              setLocationLoading(false);
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            setUserLocation("Hyderabad");
            setLocationLoading(false);
          }
        );
      } else {
        console.log("Geolocation not supported");
        setUserLocation("Hyderabad");
        setLocationLoading(false);
      }
    }
  }, [type]);
useEffect(() => {
  if (user?.role === "agent") {
    navigate("/dashboard");
  }
}, [user, navigate]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        let url = '';
        
        if (type === "verified") {
          url = `${import.meta.env.VITE_API_URL}/api/agents/verified`;
        } else if (type === "nearby") {
          url = `${import.meta.env.VITE_API_URL}/api/agents/nearby?location=${encodeURIComponent(userLocation)}`;
        } else {
          // Default to all agents for top-rated or other types
          url = `${import.meta.env.VITE_API_URL}/api/agents/nearby`;
        }

        const response = await fetch(url);
        if (response.ok) {
          const agentsData = await response.json();
          
          // Transform data to match the expected format
          const transformedAgents = agentsData.map(agent => ({
            id: agent.id,
            name: agent.full_name || agent.username,
            email: agent.email,
            phone: agent.phone,
            location: agent.phone || 'Location not specified', // Using phone as fallback since location field might not exist
            operatingArea: 'Not specified',
            rating: agent.average_rating ? agent.average_rating.toFixed(1) : "0.0",
            isVerified: agent.verified === 1,
            profilePhoto: agent.profile_photo,
            totalProperties: agent.total_properties || 0,
            approvedProperties: agent.approved_properties || 0
          }));

          let filtered = transformedAgents;

          if (type === "top-rated") {
            filtered = transformedAgents.filter(a => Number(a.rating) >= 4);
          }

          setAgents(filtered);
        } else {
          console.error("Failed to fetch agents:", response.status);
          // Fallback to localStorage if API fails
          const storedAgents = JSON.parse(localStorage.getItem("agents")) || [];
          setAgents(storedAgents);
        }
      } catch (error) {
        console.error("Error fetching agents:", error);
        // Fallback to localStorage if API fails
        const storedAgents = JSON.parse(localStorage.getItem("agents")) || [];
        setAgents(storedAgents);
      }
    };

    if (type !== "nearby" || !locationLoading) {
      fetchAgents();
    }
  }, [type, userLocation, locationLoading]);

  /* ================= CONTACT (LOGIN REQUIRED) ================= */

  const handleProtectedAction = (action, value) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (action === "call") {
      // Open phone dialer
      window.open(`tel:${value}`, "_blank");
    } else if (action === "email") {
      // Open email client
      const subject = encodeURIComponent(`Inquiry about property services`);
      const body = encodeURIComponent(`Hi, I'm interested in your property services. Please let me know more about your offerings.\n\nThank you!`);
      window.open(`mailto:${value}?subject=${subject}&body=${body}`, "_blank");
    }
  };

  /* ================= REVIEW SUBMISSION ================= */

  const submitReview = async (agentId) => {
    if (!reviewText.trim()) {
      alert("Please write a review before submitting.");
      return;
    }

    try {
      // In a real app, this would be an API call
      const agents = JSON.parse(localStorage.getItem("agents")) || [];
      
      const updatedAgents = agents.map(agent => {
        if (agent.id === agentId) {
          const reviews = [...(agent.reviews || []), {
            id: Date.now(),
            user: user.name || "Anonymous",
            userId: user.id,
            stars: reviewStars,
            text: reviewText,
            date: new Date().toISOString()
          }];

          const avgRating =
            reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length;

          return {
            ...agent,
            reviews,
            rating: avgRating.toFixed(1)
          };
        }
        return agent;
      });

      localStorage.setItem("agents", JSON.stringify(updatedAgents));

      // Re-filter agents based on current type and location
      let filtered = [];
      if (type === "verified") {
        filtered = updatedAgents.filter(a => a.isVerified);
      } else if (type === "nearby") {
        filtered = updatedAgents.filter(a => {
          return !userLocation || 
                 a.location?.toLowerCase().includes(userLocation.toLowerCase()) ||
                 userLocation.toLowerCase().includes(a.location?.toLowerCase() || "");
        });
      } else if (type === "top-rated") {
        filtered = updatedAgents.filter(a => Number(a.rating) >= 4);
      } else {
        filtered = updatedAgents;
      }
      
      setAgents(filtered);

      setReviewText("");
      setReviewStars(5);
      setActiveAgentId(null);
      
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  return (
    <div className="agents-page">
      <h2 className="agents-title">
        {type.replace("-", " ").toUpperCase()} AGENTS
      </h2>

      {type === "nearby" && (
        <div className="location-info">
          {locationLoading ? (
            <p>🔄 Detecting your location...</p>
          ) : (
            <p>📍 Showing agents near: <strong>{userLocation}</strong></p>
          )}
        </div>
      )}

      {agents.length === 0 ? (
        <p className="no-agents">
          {locationLoading ? "Detecting your location..." : 
           type === "nearby" ? `No agents found near ${userLocation}.` : 
           "No agents found."}
        </p>
      ) : (
        <div className="agents-grid">
          {agents.map(agent => (
            <div className="agent-card" key={agent.id}>

              {/* INFO */}
              <div className="agent-info">
                <div className="agent-header-section">
                  <img 
                    src={agent.profilePhoto || `https://picsum.photos/seed/${agent.name}/40/40.jpg`}
                    alt={agent.name}
                    className="agent-profile-mini"
                  />
                  <h3>{agent.name}</h3>
                </div>
                <div className="agent-info-details">
                  <p><span>📍</span> <span>{agent.location}</span></p>
                  <p><span>📌</span> <span>Area: {agent.operatingArea}</span></p>
                  <p><span>⭐</span> <span>Rating: {agent.rating || "0.0"}</span></p>
                  {agent.isVerified && (
                    <span className="agent-verified" style={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: '#4caf50',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      ✓ Verified
                    </span>
                  )}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="agent-actions">
                <button
                  className="agent-btn call"
                  onClick={() => handleProtectedAction("call", agent.phone)}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 8V5z"/>
                  </svg>
                  Call
                </button>

                <button
                  className="agent-btn email"
                  onClick={() => handleProtectedAction("email", agent.email)}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Email
                </button>

                {/* ADD REVIEW */}
                {user && (
                  <>
                    {activeAgentId !== agent.id ? (
                      <button
                        className="agent-btn email"
                        onClick={() => setActiveAgentId(agent.id)}
                        style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", boxShadow: "0 2px 8px rgba(139, 92, 246, 0.3)" }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Add Review
                      </button>
                    ) : (
                      <div style={{ marginTop: "8px" }}>
                        <select
                          value={reviewStars}
                          onChange={(e) => setReviewStars(Number(e.target.value))}
                          style={{ 
                            padding: "8px 12px", 
                            borderRadius: "8px", 
                            border: "1px solid #e5e7eb",
                            marginRight: "12px",
                            width: "120px"
                          }}
                        >
                          {[5, 4, 3, 2, 1].map(s => (
                            <option key={s} value={s}>{s} Stars</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder="Write your review..."
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          style={{ 
                            padding: "8px 12px", 
                            borderRadius: "8px", 
                            border: "1px solid #e5e7eb",
                            width: "200px"
                          }}
                        />
                        <div style={{ marginTop: "8px" }}>
                          <button
                            onClick={() => submitReview(agent.id)}
                            style={{
                              background: "#667eea",
                              color: "white",
                              border: "none",
                              padding: "8px 16px",
                              borderRadius: "8px",
                              marginRight: "8px",
                              cursor: "pointer"
                            }}
                          >
                            Submit
                          </button>
                          <button
                            onClick={() => {
                              setActiveAgentId(null);
                              setReviewText("");
                              setReviewStars(5);
                            }}
                            style={{
                              background: "#f3f4f6",
                              color: "#374151",
                              border: "none",
                              padding: "8px 16px",
                              borderRadius: "8px",
                              cursor: "pointer"
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Agents;

