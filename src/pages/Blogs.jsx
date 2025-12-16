import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Blogs.css";
import { useAuth } from "../context/AuthContext";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    axios.get("http://localhost:5000/api/blog").then((res) => {
      setBlogs(res.data);
    });
  }, []);

  const deleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/blog/${id}`, {
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

  return (
    <div className="blogs-container">
      <h1 className="blogs-heading">Latest Blogs</h1>

      <div className="blogs-grid">

        {blogs.map((blog) => (
          <div className="blog-card" key={blog.id}>
            {blog.image && (
              <img
                src={`http://localhost:5000/uploads/${blog.image}`}
                style={{ width: "100%", borderRadius: "10px" }}
                className="blog-card-img"
              />
            )}

            <div className="blog-card-body">
              <h2 className="blog-title">
                <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
              </h2>

              <p className="blog-snippet">
                {blog.content.substring(0, 100)}...
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
  );
};

export default Blogs;
