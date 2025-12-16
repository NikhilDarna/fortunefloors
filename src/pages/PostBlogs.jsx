import { useState } from "react";
import "./PostBlogs.css";

const PostBlogs = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Title & Content are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    if (media) formData.append("media", media);

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/admin/blog", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});

      const data = await response.json();

      if (response.ok) {
        alert("Blog Posted Successfully!");
        setTitle("");
        setContent("");
        setMedia(null);
        e.target.reset();
      } else {
        alert(data.error || "Failed to post blog.");
      }

    } catch (error) {
      console.error(error);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blog-container">
      <h2>Post New Blog</h2>

      <form className="blog-form" onSubmit={handleSubmit}>
        <label>Blog Title</label>
        <input
          type="text"
          placeholder="Enter blog title"
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
          placeholder="Write your blog..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows="8"
        ></textarea>

        <button disabled={loading} type="submit">
          {loading ? "Posting..." : "Post Blog"}
        </button>
      </form>
    </div>
  );
};

export default PostBlogs;
