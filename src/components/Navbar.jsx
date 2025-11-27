import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import navlogo from "../assets/logo.png";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [location, setLocation] = useState("Fetching...");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeLeftItem, setActiveLeftItem] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuRef = useRef(null);

  // Detect click outside menu to close it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
        setActiveDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Auto detect location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          setLocation(data.address.city || data.address.town || "Unknown");
        } catch (err) {
          setLocation("Unknown");
        }
      });
    }
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  // Dropdown data
  const dropdowns = {
    Buy: {
      left: ["Popular Choices", "Budget", "Property Types"],
      right: {
        "Popular Choices": {
          links: ["Ready to Move", "Owner Properties", "Budget Homes", "New Projects"],
          img: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600",
        },
        Budget: {
          links: ["Under 30L", "30L–50L", "50L–1Cr", "Above 1Cr"],
          img: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600",
        },
        "Property Types": {
          links: [
            `Flats in ${location}`,
            `Houses in ${location}`,
            "Villas",
            "Commercial Spaces",
          ],
          img: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600",
        },
      },
    },
    Rent: {
      left: ["Popular Choices", "Property Types"],
      right: {
        "Popular Choices": {
          links: ["Owner Properties", "Verified Homes", "Furnished", "Bachelor Friendly"],
          img: "https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg?auto=compress&cs=tinysrgb&w=600",
        },
        "Property Types": {
          links: [
            `Flats for Rent in ${location}`,
            `Houses for Rent in ${location}`,
            "PGs / Hostels",
            "Office Space",
          ],
          img: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600",
        },
      },
    },
    Sell: {
      left: ["Sell Options", "Help & Tools"],
      right: {
        "Sell Options": {
          links: ["Post Property", "Agent Services", "Commercial Listings"],
          img: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=600",
        },
        "Help & Tools": {
          links: ["Pricing Guide", "Documents Needed", "FAQs"],
          img: "https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=600",
        },
      },
    },
    Commercial: {
      left: ["Types", "Locations"],
      right: {
        Types: {
          links: ["Office Space", "Shops", "Warehouses", "Showrooms"],
          img: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600",
        },
        Locations: {
          links: ["IT Parks", "Business Districts", "High Street Areas"],
          img: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600",
        },
      },
    },
    Agents: {
      left: ["Find Agents", "Join as Agent"],
      right: {
        "Find Agents": {
          links: ["Top Rated Agents", "Nearby Agents", "Verified Partners"],
          img: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=600",
        },
        "Join as Agent": {
          links: ["Register as Agent", "Agent Dashboard", "Promote Listings"],
          img: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600",
        },
      },
    },
  };

  // Handle link click (desktop & mobile)
  const handleLinkClick = (link) => {
    let toUrl = "/";

    if (link.includes("Under 30L")) toUrl = "/?filter=budget&value=0-3000000";
    else if (link.includes("30L–50L")) toUrl = "/?filter=budget&value=3000000-5000000";
    else if (link.includes("50L–1Cr")) toUrl = "/?filter=budget&value=5000000-10000000";
    else if (link.includes("Above 1Cr")) toUrl = "/?filter=budget&value=10000000+";
    else if (link.toLowerCase().includes("in")) {
      const parts = link.split("in ");
      const city = parts[1] ? parts[1].trim() : "";
      const type = parts[0].trim().split(" ")[0];
      toUrl = `/?filter=location&type=${type}&value=${encodeURIComponent(city)}`;
    } else if (link === "Post Property") {
      toUrl = user ? "/post-property" : "/login";
    } else if (link === "Agent Services") toUrl = "/agents";
    else if (link === "Commercial Listings")
      toUrl = "/?filter=type&value=commercial";
    else if (link === "Pricing Guide") toUrl = "/pricing";
    else if (link === "FAQs") toUrl = "/faqs";

    navigate(toUrl);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <header className="ff-navbar" ref={menuRef}>
      <div className="ff-topbar unified">
        {/* Left Section */}
        <div className="ff-left">
          <Link
            to="/"
            className="ff-logo-wrapper"
            onClick={() => {
              navigate("/");
              setMobileMenuOpen(false);
              setActiveDropdown(null);
            }}
          >
            <img src={navlogo} alt="Logo" className="ff-logo" />
          </Link>
        </div>

        {/* Center Menu */}
        <div className={`ff-menu ${mobileMenuOpen ? "active" : ""}`}>
          <div
            className="ff-dropdown"
            onClick={() => {
              navigate("/");
              setMobileMenuOpen(false);
              setActiveDropdown(null);
            }}
          >
            <span className="ff-menu-name">Home</span>
          </div>

          {Object.keys(dropdowns).map((item) => (
            <div
              key={item}
              className="ff-dropdown"
              onMouseEnter={() => {
                if (window.innerWidth > 900) {
                  setActiveDropdown(item);
                  setActiveLeftItem(Object.keys(dropdowns[item].right)[0]);
                }
              }}
              onMouseLeave={() => {
                if (window.innerWidth > 900) {
                  setActiveDropdown(null);
                  setActiveLeftItem(null);
                }
              }}
            >
              <span
                className="ff-menu-name"
                onClick={() =>
                  setActiveDropdown(activeDropdown === item ? null : item)
                }
              >
                {item}
              </span>

              {/* Desktop Dropdown */}
              {activeDropdown === item && window.innerWidth > 900 && (
                <div className="ff-dropdown-panel center-popup">
                  <div className="panel-left">
                    {dropdowns[item].left.map((leftItem) => (
                      <div
                        key={leftItem}
                        className={`left-item ${
                          activeLeftItem === leftItem ? "active" : ""
                        }`}
                        onMouseEnter={() => setActiveLeftItem(leftItem)}
                      >
                        {leftItem}
                      </div>
                    ))}
                  </div>

                  <div className="panel-middle">
                    {dropdowns[item].right[activeLeftItem]?.links.map((link) => (
                      <div
                        key={link}
                        className="dropdown-link"
                        onClick={() => handleLinkClick(link)}
                      >
                        {link}
                      </div>
                    ))}
                  </div>

                  <div className="panel-image">
                    <img
                      src={dropdowns[item].right[activeLeftItem]?.img}
                      alt="preview"
                    />
                  </div>
                </div>
              )}

              {/* Mobile Dropdown */}
              {activeDropdown === item && window.innerWidth <= 900 && (
                <div className="mobile-submenu">
                  {dropdowns[item].left.map((leftItem) => (
                    <div key={leftItem}>
                      <div className="mobile-left-item">{leftItem}</div>
                      {dropdowns[item].right[leftItem]?.links.map((link) => (
                        <div
                          key={link}
                          className="mobile-link"
                          onClick={() => handleLinkClick(link)}
                        >
                          {link}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Section (Desktop Only) */}
        <div className="ff-right">
          <div className="ff-location">📍 {location}</div>
          <Link to="/post-property" className="ff-post-btn">
            Post Property
          </Link>
          <div
            className="profile-wrapper"
            onMouseEnter={() => setShowProfileMenu(true)}
            onMouseLeave={() => setShowProfileMenu(false)}
          >
            <FaUserCircle className="profile-icon" />
            {showProfileMenu && (
              <div className="profile-menu">
                {!user ? (
                  <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                  </>
                ) : (
                  <>
                    <Link to="/profile">My Profile</Link>
                    <Link to="/dashboard">Dashboard</Link>
                    {user.role === "admin" && <Link to="/admin">Admin Panel</Link>}
                    <Link to="/wishlist">Wishlist</Link>
                    <button onClick={handleLogout}>Logout</button>
                  </>
                )}
              </div>
            )}
          </div>
          <div
            className="hamburger"
            onClick={(e) => {
              e.stopPropagation();
              setMobileMenuOpen((prev) => !prev);
              setActiveDropdown(null);
            }}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
