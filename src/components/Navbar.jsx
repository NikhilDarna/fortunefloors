import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import navlogo from "../assets/logo.png";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle, FaBars, FaTimes, FaMapMarkerAlt } from "react-icons/fa";
import PropertyFilters from '../components/PropertyFilters';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentCity, setCurrentCity] = useState("Fetching...");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeLeftItem, setActiveLeftItem] = useState(null);
  const [activeRightItem, setActiveRightItem] = useState(null);
  const [activeKey, setActiveKey] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileItem, setOpenMobileItem] = useState(null);
const [openMobileSub, setOpenMobileSub] = useState(null);
const [activeRightSub, setActiveRightSub] = useState(null);



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
const closeAllMenus = () => {
  setActiveDropdown(null);
  setActiveLeftItem(null);
  setActiveRightItem(null);
  setActiveRightSub(null);
  setOpenMobileItem(null);
  setOpenMobileSub(null);
  setMobileMenuOpen(false);
  document.body.classList.remove("menu-open");
};
// helper
const disableTransactionType = (link, activeKey) => {
  // Entire menus that must NEVER use type
  if (["pg", "Agents", "Plots", "Commercial"].includes(activeKey)) return true;

  // Individual links that must ignore type
  return [
    "Post Property",
    "Agent Services",
    "Commercial Listings",
    "Plots",
    "PGs / Hostels",
    "Office Space"
  ].includes(link);
};


useEffect(() => {
  closeAllMenus();
}, [location.pathname, location.search]);

useEffect(() => {
  const updateHeaderHeight = () => {
    if (!menuRef.current) return;

    const rect = menuRef.current.getBoundingClientRect();
    const height = rect.height;

    document.documentElement.style.setProperty(
      "--ff-header-height",
      `${height}px`
    );
  };

  requestAnimationFrame(updateHeaderHeight);
  window.addEventListener("resize", updateHeaderHeight);

  return () => window.removeEventListener("resize", updateHeaderHeight);
}, []);

  // Try to auto-detect city using Nominatim (optional)
  useEffect(() => {
    // List of supported cities
    const supportedCities = [
      "Hyderabad", "Adilabad", "Warangal", "Nizamabad", "Karimnagar", 
      "Khammam", "Ramagundam", "Mahabubnagar", "Nalgonda", "Suryapet",
      "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Pune"
    ];
    
    // Set default location immediately
    setCurrentCity("Hyderabad"); // Default city
    
    const detectLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const { latitude, longitude } = pos.coords;
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
              );
              const data = await res.json();
              console.log("Location data:", data); // Debug log
              
              // Try multiple ways to get the city name
              let detectedCity = data.address?.city || 
                               data.address?.town || 
                               data.address?.village || 
                               data.address?.county ||
                               data.address?.state ||
                               data.name ||
                               "";
              
              // Clean up the city name and check if it's in our supported list
              detectedCity = detectedCity.trim();
              const matchedCity = supportedCities.find(city => 
                city.toLowerCase() === detectedCity.toLowerCase() ||
                detectedCity.toLowerCase().includes(city.toLowerCase()) ||
                city.toLowerCase().includes(detectedCity.toLowerCase())
              );
              
              setCurrentCity(matchedCity || "Hyderabad"); // Use matched city or default
            } catch (err) {
              console.error("Error fetching location:", err);
              setCurrentCity("Hyderabad"); // Default city
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            setCurrentCity("Hyderabad"); // Default city
          }
        );
      } else {
        setCurrentCity("Hyderabad"); // Default city if geolocation not supported
      }
    };

    detectLocation();
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };
const buildFilteredUrl = (newParams = {}, forcedType) => {
  // ❌ DO NOT reuse old URL params
  const params = new URLSearchParams();  

  // Always respect current menu click
  if (forcedType) {
    params.set("type", forcedType);
  }

  Object.entries(newParams).forEach(([k, v]) => {
    params.set(k, v);
  });

  return `/all-properties?${params.toString()}`;
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
          links: [`Flats in ${currentCity}`, `Houses in ${currentCity}`, "Villas", "Commercial Spaces"],
          img: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600",
        },
      },
    },
    Rent: {
      left: ["Popular Choices", "Property Types"],
      right: {
        "Popular Choices": {
          links: ["Owner Properties","Ready to Move", "Verified Homes", "Furnished", "Bachelor Friendly"],
          img: "https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg?auto=compress&cs=tinysrgb&w=600",
        },
        "Property Types": {
          links: [`Flats for Rent in ${currentCity}`, `Houses for Rent in ${currentCity}`, "PGs / Hostels", "Office Space"],
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
    Plots: {
      left: ["Explore"],
      right: {
        Explore: {
          links: ["Plots"],
          img: "https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&w=600",
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

  const isActiveRoute = (path) => {
    try {
      if (!path) return false;
      // exact match
      if (location.pathname === path) return true;
      // treat all-properties as matching many filters
      if (path === '/all-properties' && location.pathname === '/all-properties') return true;
    } catch (e) {
      return false;
    }
    return false;
  };

  const getTopRoute = (item) => {
    if (!item) return null;
    if (item.toLowerCase() === 'pg') return '/pg';
    if (item === 'Buy' || item === 'Rent' || item === 'Commercial' || item === 'Sell') return '/all-properties';
    if (item === 'Agents') return '/agents';
    if (item === 'Plots') return '/plots';
    return null;
  };

  const getItemKey = (item) => {
  if (item === "Buy") return "Buy";
  if (item === "Rent") return "Rent";
  if (item === "Sell") return "Sell";
  if (item === "Commercial") return "Commercial";
  if (item === "Agents") return "Agents";
  if (item === "Plots") return "Plots";
  if (item.toLowerCase() === "pg") return "pg";
  return null;
};
useEffect(() => {
  if (user?.role === "agent") {
    navigate("/dashboard");
  }
}, [user, navigate]);



  // Compute a single active key from current location so only one nav item is active
useEffect(() => {
  const p = location.pathname;
  const q = new URLSearchParams(location.search);

  const type = q.get("type");
  const propertyType = q.get("propertyType");
  const category = q.get("category");

  let key = null;

  // STATIC PAGES
  if (p === "/") key = "Home";
  else if (p.startsWith("/blogs")) key = "Blogs";
  else if (p.startsWith("/property-expo")) key = "Property Expo";
  else if (p.startsWith("/post-property")) key = "Post Property";
  else if (p.startsWith("/agents")) key = "Agents";
  else if (p.startsWith("/pg")) key = "pg";
  else if (p.startsWith("/plots")) key = "Plots";

  // 🔥 QUERY-BASED NAV (MOST IMPORTANT)
  else if (p.startsWith("/all-properties")) {
    if (propertyType === "pg") key = "pg";
    else if (propertyType === "plot") key = "Plots";
    else if (category === "commercial") key = "Commercial";
    else if (type === "rent") key = "Rent";
    else if (type === "sale") key = "Sell";
    else key = "Buy";
  }

  setActiveKey(key);
}, [location.pathname, location.search]);





 const handleLinkClick = (link) => {
  // 🔥 NAVIGATION LINKS (NOT FILTERS)
  
  const params = {};
  let forcedType;

  // 🔒 APPLY type ONLY when allowed
  if (!disableTransactionType(link, activeKey)) {
    if (activeKey === "Rent") forcedType = "rent";
    else if (activeKey === "Sell") forcedType = "sale";
    else if (activeKey === "Buy") forcedType = "buy";
  }

  if (link === "Post Property") {
    navigate("/post-property");
 
  closeAllMenus();
  return;
}

// ================= AGENT REGISTER =================
if (
  link === "Join as Agent" ||
  link === "Register as Agent"
) {
  navigate("/register?role=agent");
  closeAllMenus();
  return;
}

// ================= AGENT DASHBOARD =================
if (link === "Agent Dashboard") {
  navigate("/dashboard");
  closeAllMenus();
  return;
}

// ================= AGENT LISTINGS / PROMOTE =================
if (
  link === "Promote Listings" ||
  link === "Listings"
) {
  navigate("/agents/top-rated"); // all agents
  closeAllMenus();
  return;
}

// ================= FIND AGENTS =================
if (link === "Top Rated Agents") {
  navigate("/agents/top-rated");
  closeAllMenus();
  return;
}

if (link === "Nearby Agents") {
  navigate("/agents/nearby");
  closeAllMenus();
  return;
}

if (link === "Verified Partners") {
  navigate("/agents/verified");
  closeAllMenus();
  return;
}


if (link === "Commercial Listings") {
  navigate("/all-properties?category=commercial");
  closeAllMenus();
  return;
}


  // 🔴 Only Buy / Rent / Sell control transaction
 // Only force transaction for REAL property filters
if (activeKey === "Rent" && !["Post Property", "Agent Services"].includes(link)) {
  forcedType = "rent";
}
else if (activeKey === "Buy" && !["Post Property", "Agent Services"].includes(link)) {
  forcedType = "buy";
}
else if (activeKey === "Sell" && !["Post Property", "Agent Services", "Commercial Listings"].includes(link)) {
  forcedType = "sale";
}


  // ================= COMMON =================
  if (link === "Ready to Move") params.readyToMove = "true";
  if (link === "Owner Properties") params.directFromOwner = "true";
  if (link === "Semi Furnishing") params.furnishing = "semi-furnished";

  if (link === "Villas") params.propertyType = "villa";

  // ================= COMMERCIAL =================
  if (link === "Commercial Spaces") {
    params.category = "commercial";
    forcedType = undefined;
  }

  if (["Office Space", "Shops", "Warehouses", "Showrooms"].includes(link)) {
    params.category = "commercial";
    params.listingSubType = link.toLowerCase().replace(" ", "");
    forcedType = undefined; // 🔥 never filter by transaction
  }

  // ================= RENT ONLY =================
  if (link === "Bachelor Friendly") params.bachelorFriendly = "true";
  if (link === "Verified Homes") params.status = "approved";

  // ================= LOCATION =================
  if (link.toLowerCase().includes("flats"))
    params.propertyType = "flat/apartment";

  if (link.toLowerCase().includes("houses"))
    params.propertyType = "independent house / villa";

// ================= PG FILTERS =================

// ================= PG FILTERS =================

// Category
if (["For Men", "For Girls", "Women", "Co-living"].includes(link)) {
  params.propertyType = "pg";
  params.pgCategory = link
    .replace("For ", "")
    .trim()
    .toLowerCase()
    .replace("-", "");
  forcedType = undefined;
}

// Subtype (keep category also)
if (["Luxury PG", "Deluxe PG", "Normal PG"].includes(link)) {
  params.propertyType = "pg";
  params.listingSubType = link.split(" ")[0].toLowerCase();

  // 👇 keep already selected category
  const currentCat = new URLSearchParams(location.search).get("pgCategory");
  if (currentCat) params.pgCategory = currentCat;

  forcedType = undefined;
}


// Sharing
if (link.includes("Share")) {
  params.propertyType = "pg";
  params.sharing = link.split("-")[0];
  forcedType = undefined;
}
  // ================= PLOTS =================
  if (link === "Plots") {
    params.propertyType = "plot";
    forcedType = undefined;
  }

  // ================= BUDGET =================
  if (link.includes("Under 30L")) params.maxPrice = "3000000";
  if (link.includes("30L–50L")) {
    params.minPrice = "3000000";
    params.maxPrice = "5000000";
  }
  if (link.includes("50L–1Cr")) {
    params.minPrice = "5000000";
    params.maxPrice = "10000000";
  }
  if (link.includes("Above 1Cr")) params.minPrice = "10000000";

  // ================= NAVIGATION =================
  navigate(buildFilteredUrl(params, forcedType));
  closeAllMenus();
};





 
  return (
  <header className="ff-navbar" ref={menuRef}>

    {/* ======================= TOP ROW ======================= */}
    <div className="ff-top-row">

      {/* LOGO */}
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
        >
          <h1>
            <span className="red">F</span>ortune
            <span className="red">F</span>loors.
            <span className="red">C</span>om
          </h1>
        </Link>
        {/* LOCATION */}
        <div className="ff-location">
          <FaMapMarkerAlt className="location-icon" />
          <span
            onClick={() => {
              const newCity = prompt("Enter your city:", currentCity);
              if (newCity) setCurrentCity(newCity);
            }}
          >
            {currentCity}
          </span>
        </div>
      </div>

      {/* RIGHT ACTIONS */}
      <div className="ff-right">

        

        {/* POST PROPERTY */}
        <span
          onClick={() => {
            navigate("/post-property");
            closeAllMenus();
          }}
          className={`ff-post-btn ${activeKey === "Post Property" ? "active-post" : ""}`}
        >
          <span className="postpropert-btn0">Post Property</span><span className="postpropert-btn">for Free</span>
        </span>
        {user && (
              <div className="profile-user">
                👋 Hi, <strong>{user.name || user.username || user.fullName || "User"}</strong>
              </div>
            )}
        {/* PROFILE */}
        <div
          className="profile-wrapper"
          onClick={(e) => {
            e.stopPropagation(); // 🛑 stop document click
            setShowProfileMenu((prev) => !prev);
          }}
          onMouseEnter={() => window.innerWidth > 900 && setShowProfileMenu(true)}
          onMouseLeave={() => window.innerWidth > 900 && setShowProfileMenu(false)}
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

        {/* HAMBURGER (MOBILE) */}
        <div
          className="hamburger"
          onClick={(e) => {
            e.stopPropagation();
            const next = !mobileMenuOpen;
            setMobileMenuOpen(next);
            document.body.classList.toggle("menu-open", next);
            setActiveDropdown(null);
            setActiveLeftItem(null);
            setActiveRightItem(null);
          }}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </div>

    {/* ======================= MENU ROW ======================= */}
    <div className={`ff-menu-row ${mobileMenuOpen ? "active" : ""}`}>
  <div className="ff-menu">

    {/* HOME */}
    <span
      className={`ff-menu-name ${activeKey === "Home" ? "active-route" : ""}`}
      onClick={() => {
        navigate("/");
        closeAllMenus();
      }}
    >
      Home
    </span>

    {/* MAIN DROPDOWNS */}
    {Object.keys(dropdowns).map((item) => (
      <div key={item} className="ff-dropdown">

        {/* MAIN ITEM */}
        <span
          className={`ff-menu-name ${
            activeKey === getItemKey(item) ? "active-route" : ""
          }`}
          onClick={() => {

  // 🔥 FIRST: reset URL & backend state
  if (item === "Buy") navigate(buildFilteredUrl({}, "buy"));
  else if (item === "Rent") navigate(buildFilteredUrl({}, "rent"));
  else if (item === "Sell") navigate(buildFilteredUrl({}, "sale"));
  else if (item === "Commercial") navigate(buildFilteredUrl({ category: "commercial" }));
  else if (item === "pg") navigate(buildFilteredUrl({ propertyType: "pg" }));
  else if (item === "Plots") navigate(buildFilteredUrl({ propertyType: "plot" }));

  // 🔽 THEN open dropdown UI
  if (window.innerWidth <= 900) {
    setOpenMobileItem(openMobileItem === item ? null : item);
    setOpenMobileSub(null);
  } else {
    setActiveDropdown(activeDropdown === item ? null : item);
    setActiveLeftItem(dropdowns[item].left?.[0]);
  }
}}

        >
          {item}
        </span>

        {/* DESKTOP MEGA MENU */}
        {activeDropdown === item && window.innerWidth > 900 && (
          <div className="ff-dropdown-panel center-popup">

            <div className="panel-left">
              {dropdowns[item].left.map((left) => (
                <div
                key={left}
                className={`left-item ${activeLeftItem === left ? "active" : ""}`}
                onMouseEnter={() => setActiveLeftItem(left)}
                onClick={() => handleLinkClick(left)}   // 🔴 THIS LINE IS MISSING
              >
                {left}
              </div>

              ))}
            </div>

           <div className="panel-middle">
            {dropdowns[item].right[activeLeftItem]?.links?.map((link) => {

              const hasSub =
                dropdowns[item].right[activeLeftItem]?.right?.[link];

              return (
                <div
  key={link}
  className="dropdown-link-wrapper grid-row"
  onMouseEnter={() => hasSub && setActiveRightSub(link)}
  onMouseLeave={() => hasSub && setActiveRightSub(null)}
>
  {/* LEFT (MAIN LINK) */}
  <div
  className="dropdown-link"
  onClick={() => handleLinkClick(link)}
>

    {link}
  </div>

  {/* RIGHT (SUB LINKS) */}
  <div className="dropdown-sub-cell">
    {hasSub && activeRightSub === link &&
      hasSub.links.map((sub) => (
        <div
          key={sub}
          className="dropdown-sub-link"
          onClick={() => handleLinkClick(sub)}
        >
          {sub}
        </div>
      ))}
  </div>
</div>

              );
            })}
           </div>




            <div className="panel-image">
              <img src={dropdowns[item].right[activeLeftItem]?.img} alt="" />
            </div>

          </div>
        )}

        {/* ✅ MOBILE SUBMENU */}
        {window.innerWidth <= 900 && openMobileItem === item && (
          <div className="mobile-submenu">
            {dropdowns[item].left.map((left) => (
              <div key={left} className="mobile-left-block">

                <div
                  className="mobile-left-title"
                  onClick={() =>
                    setOpenMobileSub(openMobileSub === left ? null : left)
                  }
                >
                  {left}
                </div>

                {openMobileSub === left && (
                  <div className="mobile-right-links">
                    {dropdowns[item].right[left]?.links?.map((link) => (
                      <div
                        key={link}
                        className="mobile-link"
                        onClick={() => handleLinkClick(link)}
                      >
                        {link}
                      </div>
                    ))}
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </div>
    ))}

    {/* STATIC LINKS */}
    <span 
      className={`ff-menu-name ${activeKey === "Blogs" ? "active-route" : ""}`}
      onClick={() => {
        navigate("/blogs");
        closeAllMenus();
      }}
    >
      Blogs
    </span>

    <span 
      className={`ff-menu-name ${activeKey === "Property Expo" ? "active-route" : ""}`}
      onClick={() => {
        navigate("/property-expo");
        closeAllMenus();
      }}
    >
      Property Expo
    </span>

  </div>
</div>

  </header>
);

};

export default Navbar;