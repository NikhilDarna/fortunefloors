import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./EditBlogs.css";

const EditBlogs = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // HTML content
  const [oldImage, setOldImage] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/blog/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setTitle(res.data.title);
        setContent(res.data.content);
        setOldImage(res.data.image);
      })
      .catch(() => alert("Failed to load blog"));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (file) formData.append("media", file);

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/blog/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Blog updated!");
      navigate("/blogs");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div className="editblogs-container">
      <h1>Edit Blog</h1>

      <form className="editblogs-form" onSubmit={handleUpdate}>
        {/* TITLE */}
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* CONTENT */}
        <label>Content</label>
        <div className="edit-wrapper">
          <ReactQuill
            value={content}
            onChange={setContent}
            placeholder="Edit your blog..."
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["image", "video"],   // ✅ VIDEO ICON ADDED
                ["clean"],
              ],
              clipboard: {
                matchVisual: false, // ✅ iframe paste support
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
              "video",               // ✅ ENABLE VIDEO FORMAT
            ]}
          />
        </div>

        {/* CURRENT IMAGE */}
        <label>Current Image:</label>
        {oldImage && (
          <img
            src={`${import.meta.env.VITE_API_URL}/uploads/${oldImage}`}
            className="editblogs-old-image"
            alt="Old"
          />
        )}

        {/* NEW IMAGE */}
        <label>Upload New Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button type="submit" className="saveblogs-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditBlogs;
