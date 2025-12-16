import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./SingleBlog.css";

const SingleBlog = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/blog/${slug}`)
      .then((res) => setBlog(res.data))
      .catch((err) => console.log(err));
  }, [slug]);

  if (!blog) return <h2>Loading...</h2>;

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: blog.title,
          text: "Check out this blog!",
          url: window.location.href,
        })
        .catch((err) => console.log("Share failed:", err));
    } else {
      setShowShareMenu(true); // Desktop fallback
    }
  };

  return (
    <div className="single-blog-container">

      <h1 className="single-blog-title">{blog.title}</h1>

      {blog.image && (
        <img
          className="single-blog-img"
          src={`http://localhost:5000/uploads/${blog.image}`}
          alt={blog.title}
        />
      )}

      <p className="single-blog-text">{blog.content}</p>

      <div className="blog-actions">
        <button className="share-btn" onClick={handleShare}>
          🔗 Share
        </button>
      </div>

      {/* DESKTOP SHARE MENU */}
      {showShareMenu && (
        <div className="share-menu">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              window.location.href
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>

          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              window.location.href
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>

          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              window.location.href
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter / X
          </a>

          <a
            href={`mailto:?subject=${encodeURIComponent(
              blog.title
            )}&body=${encodeURIComponent(window.location.href)}`}
          >
            Email
          </a>

          <button onClick={() => setShowShareMenu(false)}>Close</button>
        </div>
      )}

    </div>
  );
};

export default SingleBlog;
