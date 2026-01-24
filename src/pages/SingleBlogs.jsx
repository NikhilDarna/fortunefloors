import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./SingleBlog.css";
import { useAuth } from "../context/AuthContext";

/* ✅ CLEAN QUILL HTML + DECODE IFRAME */
const cleanHtml = (html) => {
  if (!html) return "";

  const textarea = document.createElement("textarea");
  textarea.innerHTML = html;
  const decodedHtml = textarea.value;

  return decodedHtml
    .replace(/<span class="ql-cursor">.*?<\/span>/g, "")
    .replace(/<p><br><\/p>/g, "");
};

const SingleBlog = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [blog, setBlog] = useState(null);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/blog/${slug}`)
      .then((res) => setBlog(res.data))
      .catch((err) => console.log(err));
  }, [slug]);

  if (!blog) return <h2>Loading...</h2>;

  /* ✅ DELETE BLOG */
  const deleteBlog = async () => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/blog/${blog.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Blog deleted successfully!");
      navigate("/blogs"); // redirect after delete
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: "Check out this blog!",
        url: window.location.href,
      });
    } else {
      setShowShareMenu(true);
    }
  };

  return (
    <div className="single-blog-wrapper">
      {/* LEFT AD */}
      <div className="blog-ads left-ads">
        <img src="/ads/ad-left.jpg" alt="Left Ad" />
      </div>

      {/* MAIN CONTENT */}
      <div className="single-blog-container">

        {/* ✅ TITLE ROW WITH ADMIN BUTTONS */}
        <div className="single-blog-title-row">
          <h1 className="single-blog-title">{blog.title}</h1>

          {user?.role === "admin" && (
            <div className="single-admin-actions">
              <Link
                to={`/admin/edit-blog/${blog.id}`}
                className="edit-btn"
              >
                Edit
              </Link>

              <button
                className="delete-btn"
                onClick={deleteBlog}
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="image-ad-wrapper">
          {blog.image && (
            <img
              className="single-blog-img"
              src={`${import.meta.env.VITE_API_URL}/uploads/${blog.image}`}
              alt={blog.title}
            />
          )}
        </div>

        <div
          className="single-blog-text"
          dangerouslySetInnerHTML={{
            __html: cleanHtml(blog.content),
          }}
        />

        <div className="blog-actions">
          <button className="share-btn" onClick={handleShare}>
            🔗 Share
          </button>
        </div>

        {showShareMenu && (
          <div className="share-menu">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                window.location.href
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                window.location.href
              )}`}
              target="_blank"
              rel="noreferrer"
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

      {/* RIGHT AD */}
      <div className="blog-ads right-ads">
        <img src="/ads/ad-right.jpg" alt="Right Ad" />
      </div>
    </div>
  );
};

export default SingleBlog;
