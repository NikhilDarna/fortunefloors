import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./PostBlogs.css";

const PostBlogs = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // stores HTML (iframe included)
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
    formData.append("content", content); // iframe saved here

    if (media) formData.append("media", media);

    try {
      setLoading(true);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/blog`, {
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
        <div className="quill-wrapper">
        <ReactQuill
          value={content}
          onChange={setContent}
          placeholder="Write your blog..."
          modules={{
            toolbar: [
              [{ header: [1, 2, 3,4, 5, 6,  false] }],
              ["bold", "italic", "underline"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["image"],
              ["clean"],
            ],
            clipboard: {
              matchVisual: false, // ✅ REQUIRED for iframe paste
            },
          }}
          formats={[
            "header",
            "bold",
            "italic",
            "underline",
            "list",
            "bullet",
            "image",
            "video",
            "iframe",
          ]}
        />
        </div>

        <button disabled={loading} type="submit">
          {loading ? "Posting..." : "Post Blog"}
        </button>
      </form>
    </div>
  );
};

export default PostBlogs;