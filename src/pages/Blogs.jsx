import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Blogs.css";
import { useAuth } from "../context/AuthContext";



const decodeHtml = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

const getBlogPreview = (html, limit = 200) => {
  if (!html) return "";

  // 1️⃣ Decode &lt;iframe&gt; → <iframe>
  const decoded = decodeHtml(html);

  // 2️⃣ Remove iframe + all HTML tags
  const textOnly = decoded
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/<[^>]*>/g, "")
    .trim();

  return textOnly.length > limit
    ? textOnly.slice(0, limit) + "..."
    : textOnly;
};

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/blog`).then((res) => {
      setBlogs(res.data);
    });
  }, []);

  const deleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/blog/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setBlogs((prev) => prev.filter((b) => b.id !== id));
      alert("Blog deleted successfully!");
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };
  const blogsByCategory = blogs.reduce((acc, blog) => {
  const category = blog.category || "Others";
  if (!acc[category]) acc[category] = [];
  acc[category].push(blog);
  return acc;
}, {});


  return (
  
      <div className="blogs-container">
  <h1 className="blogs-heading">Latest Blogs</h1>

  {Object.keys(blogsByCategory).length === 0 && (
    <p>No blogs found</p>
  )}

  {Object.entries(blogsByCategory).map(([category, blogs]) => (
    <div key={category} className="category-section">

      {/* CATEGORY HEADING */}
      <h2 className="category-heading">{category}</h2>

      {/* BLOGS GRID */}
      <div className="blogs-grid">
        {blogs.map((blog) => (
          <div className="blog-card" key={blog.id}>
            {blog.image && (
              <img
                src={`${import.meta.env.VITE_API_URL}/uploads/${blog.image}`}
                className="blog-card-img"
                alt={blog.title}
              />
            )}

            <div className="blog-card-body">
              <h2 className="blog-title">
                <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
              </h2>
              <p className="blog-snippet">
                {getBlogPreview(blog.content)}
              </p>

              <Link to={`/blog/${blog.slug}`} className="read-more">
                Read More →
              </Link>

              {user?.role === "admin" && (
                <div className="admin-buttons">
                  <Link
                    to={`/admin/edit-blog/${blog.id}`}
                    className="edit-btn"
                  >
                    Edit
                  </Link>

                  <button
                    className="delete-btn"
                    onClick={() => deleteBlog(blog.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  ))}
      </div>

    
  );
};

export default Blogs;
