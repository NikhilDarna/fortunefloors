import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import navlogo from "../assets/logo.png";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import PropertyFilters from '../components/PropertyFilters';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [location, setLocation] = useState("Fetching...");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeLeftItem, setActiveLeftItem] = useState(null);
  const [activeRightItem, setActiveRightItem] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuRef = useRef(null);

  // Close menus when clicking outside
 useEffect(() => {
  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setMobileMenuOpen(false);
      document.body.classList.remove("menu-open");
      setActiveDropdown(null);
      setActiveLeftItem(null);
      setActiveRightItem(null);
    }
  };

  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);


  // Try to auto-detect city using Nominatim (optional)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          setLocation(data.address?.city || data.address?.town || "Unknown");
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

  const dropdowns = {
    Buy: {
      left: ["Popular Choices", "Budget", "Property Types"],
      right: {
        "Popular Choices": {
          links: ["Ready to Move", "Owner Properties","Semi Furnishing","Furnishing" ],
          img: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600",
        },
        Budget: {
          links: ["Under 30L", "30L–50L", "50L–1Cr", "Above 1Cr"],
          img: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600",
        },
        "Property Types": {
          links: [`Flats in ${location}`, `Houses in ${location}`, "Villas", "Commercial Spaces"],
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
          links: [`Flats for Rent in ${location}`, `Houses for Rent in ${location}`, "PGs / Hostels", "Office Space"],
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
    pg: {
      left: ["For Men", "For Girls", "Co-living", "Women"],
      right: {
        "For Men": {
          links: ["Luxury PG", "Deluxe PG", "Normal PG", "Sharing"],
          img: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=600",
          right: {
            Sharing: {
              links: ["1-Share", "2-Share", "3-Share", "5-Share", "8-Share"],
            },
          },
        },
        "For Girls": {
          links: ["Luxury PG", "Deluxe PG", "Normal PG", "Sharing"],
          img: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600",
          right: {
            Sharing: {
              links: ["1-Share", "2-Share", "3-Share", "5-Share", "8-Share"],
            },
          },
        },
        "Co-living": {
          links: ["Luxury PG", "Deluxe PG"],
          img: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600",
        },
        "Women": {
          links: ["Luxury PG", "Deluxe PG", "Normal PG", "Sharing"],
          img: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600",
          right: {
            Sharing: {
              links: ["1-Share", "2-Share", "3-Share", "5-Share", "8-Share"],
            },
          },
        },
      },
    },
  };
  const handleAgentClick = (option) => {
  switch (option) {
    case "Agents List":
      navigate("/agents");
      break;

    case "Post Property":
      navigate("/post-property");
      break;

    case "Verified Agents":
      navigate("/agents/verified");
      break;

    // 🔴 NOT READY YET
    default:
      navigate("/"); // ⬅️ HOME
  }
};

const handleLinkClick = (link) => {
  let toUrl = "/all-properties";

  /* ================= BUY ================= */

  if (link === "Ready to Move") {
    toUrl += "?readyToMove=true";
  }

  else if (link === "Owner Properties") {
    toUrl += "?directFromOwner=true";
  }

  else if (link === "Semi Furnishing") {
    toUrl += "?furnishing=semi-furnished";
  }

  else if (link === "Furnishing" || link === "Furnished") {
    toUrl += "?furnishing=fully-furnished";
  }

  else if (link === "Villas") {
    toUrl = "/all-properties?propertyType=villa";
  }

  else if (link === "Commercial Spaces") {
    toUrl = "/all-properties?category=commercial";
  }

  /* ================= RENT ================= */

  else if (link === "Bachelor Friendly") {
    toUrl += "?bachelorFriendly=true";
  }

  else if (link === "Office Space") {
  toUrl = "/all-properties?category=commercial&listingSubType=office";
}
else if (link === "Shops") {
  toUrl = "/all-properties?category=commercial&listingSubType=shop";
}
else if (link === "Warehouses") {
  toUrl = "/all-properties?category=commercial&listingSubType=warehouse";
}
else if (link === "Showrooms") {
  toUrl = "/all-properties?category=commercial&listingSubType=showroom";
}

  else if (link === "Verified Homes") {
  toUrl += "?status=approved";
}

  /* ================= LOCATION BASED ================= */

  else if (link.toLowerCase().includes("flats in")) {
    const city = link.split("in ")[1];
    toUrl = `/all-properties?propertyType=flat&location=${encodeURIComponent(city)}`;
  }

  else if (link.toLowerCase().includes("houses in")) {
    const city = link.split("in ")[1];
    toUrl = `/all-properties?propertyType=house&location=${encodeURIComponent(city)}`;
  }

  else if (link.toLowerCase().includes("flats for rent in")) {
    const city = link.split("in ")[1];
    toUrl = `/all-properties?type=rent&propertyType=flat&location=${encodeURIComponent(city)}`;
  }

  else if (link.toLowerCase().includes("houses for rent in")) {
    const city = link.split("in ")[1];
    toUrl = `/all-properties?type=rent&propertyType=house&location=${encodeURIComponent(city)}`;
  }
  /* ================= SELL ================= */

else if (link === "Post Property") {
  navigate("/post-property");
  return;
}

else if (link === "Commercial Listings") {
  toUrl = "/all-properties?category=commercial";
}

  /* ================= PG ================= */

  else if (link === "PGs / Hostels") {
    toUrl += "?propertyType=pg";
  }

  else if (link.includes("Luxury PG")) {
    toUrl += "?propertyType=pg&listingSubType=luxury";
  }

  else if (link.includes("Deluxe PG")) {
    toUrl += "?propertyType=pg&listingSubType=deluxe";
  }

  else if (link.includes("Normal PG")) {
    toUrl += "?propertyType=pg&listingSubType=normal";
  }

  else if (link.includes("Share")) {
    const count = link.split("-")[0];
    toUrl += `?propertyType=pg&sharing=${count}`;
  }

  /* ================= BUDGET ================= */

  else if (link.includes("Under 30L")) {
    toUrl += "?maxPrice=3000000";
  }

  else if (link.includes("30L–50L")) {
    toUrl += "?minPrice=3000000&maxPrice=5000000";
  }

  else if (link.includes("50L–1Cr")) {
    toUrl += "?minPrice=5000000&maxPrice=10000000";
  }

  else if (link.includes("Above 1Cr")) {
    toUrl += "?minPrice=10000000";
  }
  // ⛔ Agent menu items are NOT property filters
if (
  link === "Top Rated Agents" ||
  link === "Nearby Agents" ||
  link === "Verified Partners"
) {
  navigate("/agents");
  return;
}


 navigate(toUrl);



  setMobileMenuOpen(false);
  setActiveDropdown(null);
  setActiveLeftItem(null);
  setActiveRightItem(null);
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
              setActiveLeftItem(null);
              setActiveRightItem(null);
            }}
          > <h1>FortuneFloors.com</h1>
            {/* <img src={navlogo} alt="Logo" className="ff-logo" /> */}
          </Link>
        </div>

        {/* Center Menu */}
        <div className={`ff-menu ${mobileMenuOpen ? "active" : ""}`}>
          {/* HOME + optional admin Post Article (kept separate so clicks don't collide) */}
          <div className="ff-dropdown home-block">
            <span
              className="ff-menu-name"
              onClick={() => {
                navigate("/");
                setMobileMenuOpen(false);
                setActiveDropdown(null);
                setActiveLeftItem(null);
                setActiveRightItem(null);
              }}
            >
              Home
            </span>

            
          </div>

          

          {/* Render the big dropdowns (Buy / Rent / Sell / etc) */}
          {Object.keys(dropdowns).map((item) => (
            <div
              key={item}
              className="ff-dropdown"
              onMouseEnter={() => {
                if (window.innerWidth > 900) {
                  setActiveDropdown(item);
                  const firstLeft = dropdowns[item].left?.[0] || null;
                  setActiveLeftItem(firstLeft);
                  setActiveRightItem(null);
                }
              }}
              onMouseLeave={() => {
                if (window.innerWidth > 900) {
                  setActiveDropdown(null);
                  setActiveLeftItem(null);
                  setActiveRightItem(null);
                }
              }}
            >
              <span
                className="ff-menu-name"
                onClick={() => {
                  const newVal = activeDropdown === item ? null : item;
                  setActiveDropdown(newVal);
                  if (newVal) {
                    const firstLeft = dropdowns[item].left?.[0] || null;
                    setActiveLeftItem(firstLeft);
                    setActiveRightItem(null);
                  } else {
                    setActiveLeftItem(null);
                    setActiveRightItem(null);
                  }
                }}
              >
                {item}
              </span>

              {/* Desktop dropdown panel */}
              {activeDropdown === item && window.innerWidth > 900 && (
                <div className="ff-dropdown-panel center-popup">
                  <div className="panel-left">
                    {dropdowns[item].left.map((leftItem) => (
                      <div
                        key={leftItem}
                        className={`left-item ${activeLeftItem === leftItem ? "active" : ""}`}
                        onMouseEnter={() => {
                          setActiveLeftItem(leftItem);
                          setActiveRightItem(null);
                        }}
                      >
                        {leftItem}
                      </div>
                    ))}
                  </div>

                  <div className="panel-middle">
                    {dropdowns[item].right[activeLeftItem]?.links?.map((link) => {
                      const middleData = dropdowns[item].right[activeLeftItem];
                      const hasSubmenu = middleData?.right && middleData.right[link];

                      return (
                        <div
                          key={link}
                          className={`dropdown-link ${activeRightItem === link ? "active" : ""}`}
                          onMouseEnter={() => {
                            if (hasSubmenu) setActiveRightItem(link);
                            else setActiveRightItem(null);
                          }}
                          onClick={() => {
                            if (!hasSubmenu) handleLinkClick(link);
                          }}
                        >
                          {link} {hasSubmenu && "›"}
                        </div>
                      );
                    })}
                  </div>

                  {/* Right column: third-level menu or image preview */}
                  {(() => {
                    const middleData = dropdowns[item].right[activeLeftItem] || {};
                    const thirdData = middleData.right?.[activeRightItem] || null;

                    if (thirdData?.links?.length) {
                      return (
                        <div className="panel-right-third">
                          {thirdData.links.map((subLink) => (
                            <div
                              key={subLink}
                              className="dropdown-sublink"
                              onClick={() => handleLinkClick(subLink)}
                            >
                              {subLink}
                            </div>
                          ))}
                        </div>
                      );
                    }

                    return (
                      <div className="panel-image">
                        <img src={dropdowns[item].right[activeLeftItem]?.img} alt="preview" />
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Mobile dropdown rendering */}
              {activeDropdown === item && window.innerWidth <= 900 && (
                <div className="mobile-submenu">
                  {dropdowns[item].left.map((leftItem) => (
                    <div key={leftItem}>
                      <div className="mobile-left-item">{leftItem}</div>
                      {dropdowns[item].right[leftItem]?.links?.map((link) => (
                        <div key={link} className="mobile-link" onClick={() => handleLinkClick(link)}>
                          {link}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {/* Articles link (separate dropdown cell) */}
          <div className="ff-dropdown">
            <Link
              to="/blogs"
              className="ff-menu-name"
              onClick={(e) => {
                // stopPropagation to be safe in mobile/menu states
                e.stopPropagation();
                setMobileMenuOpen(false);
                setActiveDropdown(null);
              }}
            >
              Blogs
            </Link>
          </div>
          {/* Admin only: Post New Article */}
            {user?.role === "admin" && (
              <Link
                to="/admin/post-Blogs"
                className="ff-menu-name admin-article-link"
                onClick={(e) => {
                  // Prevent parent Home click from firing
                  e.stopPropagation();
                }}
              >
                Post New Blog
              </Link>
            )}
            <Link
              to="/property-expo"
              className="ff-menu-name"
              onClick={(e) => {
                // stopPropagation to be safe in mobile/menu states
                e.stopPropagation();
                setMobileMenuOpen(false);
                setActiveDropdown(null);
              }}
            >
              Property Expo
            </Link>
        </div>

        {/* Right Section (desktop) */}
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
                    {user?.role === "admin" && <Link to="/admin">Admin Panel</Link>}
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

              const newState = !mobileMenuOpen;
              setMobileMenuOpen(newState);

              // prevent body scroll when menu is open
              document.body.classList.toggle("menu-open", newState);

              setActiveDropdown(null);
              setActiveLeftItem(null);
              setActiveRightItem(null);
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
