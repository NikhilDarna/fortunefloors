import { useState } from "react";
import axios from "axios";
import "./PostArticle.css"; // we will create this

const PostArticle = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token"); // admin token stored on login

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Title & Content are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    if (media) formData.append("media", media); // MATCHES backend field

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/admin/article",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Article Posted Successfully!");
      setTitle("");
      setContent("");
      setMedia(null);
      e.target.reset(); // reset file input
    } catch (error) {
      alert("Failed to post article. Check console.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="article-container">
      <h2>Post New Article</h2>

      <form className="article-form" onSubmit={handleSubmit}>
        <label>Article Title</label>
        <input
          type="text"
          placeholder="Enter article title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Upload Image or Video</label>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setMedia(e.target.files[0])}
        />

        <label>Content</label>
        <textarea
          placeholder="Write your article..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows="8"
        ></textarea>

        <button disabled={loading} type="submit">
          {loading ? "Posting..." : "Post Article"}
        </button>
      </form>
    </div>
  );
};

export default PostArticle;
