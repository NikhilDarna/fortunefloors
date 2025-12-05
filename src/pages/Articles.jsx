import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Articles.css";
import { useAuth } from "../context/AuthContext";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    axios.get("http://localhost:5000/api/articles").then((res) => {
      setArticles(res.data);
    });
  }, []);
  
  const deleteArticle = async (id) => {
  if (!window.confirm("Are you sure you want to delete this article?")) return;

  try {
    await axios.delete(`http://localhost:5000/api/admin/article/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    });

    setArticles((prev) => prev.filter((a) => a.id !== id));
    alert("Article deleted successfully!");
  } catch (err) {
    console.log(err);
    alert("Delete failed");
  }
};


  return (
    <div className="articles-container">
      <h1 className="articles-heading">Latest Articles</h1>

      <div className="articles-grid">

        {articles.map((article) => (
          <div className="article-card" key={article.id}>
            {article.image && (
                <img
                src={`http://localhost:5000/uploads/${article.image}`}
                style={{ width: "100%", borderRadius: "10px" }}
                className="article-card-img"
                />
            )}
            

            <div className="article-card-body">
              <h2 className="article-title">
                <Link to={`/article/${article.slug}`}>{article.title}</Link>
              </h2>

              <p className="article-snippet">
                {article.content.substring(0, 100)}...
              </p>

              <Link to={`/article/${article.slug}`} className="read-more">
                Read More →
              </Link>

              {user?.role === "admin" && (
                <div className="admin-buttons">
                  <Link
                    to={`/admin/edit-article/${article.id}`}
                    className="edit-btn"
                  >
                    Edit
                  </Link>
                  <button
                    className="delete-btn"
                    onClick={() => deleteArticle(article.id)}
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

export default Articles;
