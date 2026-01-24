import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaSearch,
  FaHeart,
  FaPlusCircle,
  FaUser,
} from "react-icons/fa";
import "./BottomNav.css";

const BottomNav = () => {
  const location = useLocation();

 

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="ff-bottom-nav">
      <Link to="/" className={isActive("/") ? "active" : ""}>
        <FaHome />
        <span>Home</span>
      </Link>

      {/* ✅ FULL FILTER PAGE */}
      <Link to="/filters" className={isActive("/filters") ? "active" : ""}>
        <FaSearch />
        <span>Search</span>
      </Link>

      <Link to="/wishlist" className={isActive("/wishlist") ? "active" : ""}>
        <FaHeart />
        <span>Shortlist</span>
      </Link>

      <Link to="/post-property" className="post-btn">
        <FaPlusCircle />
        <span>Post</span>
      </Link>

      <Link to="/profile" className={isActive("/profile") ? "active" : ""}>
        <FaUser />
        <span>Profile</span>
      </Link>
    </nav>
  );
};

export default BottomNav;
